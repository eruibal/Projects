/**
 * Google Sheets to Jira Integration Script
 * 
 * Instructions:
 * 1. Open your Google Sheet.
 * 2. Go to Extensions > Apps Script.
 * 3. Copy/Paste Code.gs and Page.html.
 * 4. Set Script Properties (JIRA_URL, JIRA_EMAIL, JIRA_API_TOKEN, JIRA_PROJECT_KEY).
 */

function onOpen() {
  const ui = SpreadsheetApp.getUi();
  ui.createMenu('Jira Integration')
      .addItem('Create Jira Issue from Row', 'showCreateIssueDialog')
      .addToUi();
}

/**
 * Opens the sidebar or dialog to select an Epic and enter a row number.
 */
function showCreateIssueDialog() {
  const html = HtmlService.createHtmlOutputFromFile('Page')
      .setWidth(400)
      .setHeight(300)
      .setTitle('Create Jira Issue');
  SpreadsheetApp.getUi().showModalDialog(html, 'Create Jira Issue');
}

/**
 * Validates the project key by checking if it exists in script properties
 */
function validateProjectKey() {
  const scriptProperties = PropertiesService.getScriptProperties();
  const projectKey = scriptProperties.getProperty('JIRA_PROJECT_KEY');
  if (!projectKey) {
    throw new Error('JIRA_PROJECT_KEY is not set in Script Properties.');
  }
  return projectKey;
}

/**
 * Fetches Open Epics from Jira to populate the dropdown.
 */
function getOpenEpics() {
  const projectKey = validateProjectKey();
  
  // JQL to find open Epics in the project
  const jql = `project = "${projectKey}" AND issuetype = Epic AND statusCategory != Done ORDER BY created DESC`;
  
  // Use POST /rest/api/3/search/jql which is the new specific endpoint for JQL search
  const payload = {
    jql: jql,
    fields: ['summary'],
    maxResults: 50
  };

  const result = callJiraApi('/rest/api/3/search/jql', 'post', payload);
  
  if (!result || !result.issues) {
    return [];
  }

  return result.issues.map(issue => ({
    key: issue.key,
    summary: issue.fields.summary
  }));
}

/**
 * Fetches Components for the project.
 */
function getProjectComponents() {
  const projectKey = validateProjectKey();
  const result = callJiraApi(`/rest/api/3/project/${projectKey}/components`, 'get');
  
  if (!result) {
    return [];
  }

  return result.map(c => ({
    id: c.id,
    name: c.name
  }));
}

/**
 * Processes the form submission from Page.html
 */
function processForm(formObject) {
  const row = parseInt(formObject.row);
  const epicKey = formObject.epicKey;
  const componentId = formObject.componentId; // New field

  if (isNaN(row) || row < 1) {
    throw new Error('Invalid row number');
  }

  createIssue(row, epicKey, componentId);
}

/**
 * Helper to call Jira API
 */
function callJiraApi(endpoint, method, payload) {
  const scriptProperties = PropertiesService.getScriptProperties();
  const jiraUrl = scriptProperties.getProperty('JIRA_URL');
  const userEmail = scriptProperties.getProperty('JIRA_EMAIL');
  const apiToken = scriptProperties.getProperty('JIRA_API_TOKEN');

  if (!jiraUrl || !userEmail || !apiToken) {
    throw new Error('Missing Script Properties. Please configure JIRA_URL, JIRA_EMAIL, and JIRA_API_TOKEN.');
  }

  const options = {
    'method': method,
    'contentType': 'application/json',
    'headers': {
      'Authorization': 'Basic ' + Utilities.base64Encode(userEmail + ':' + apiToken)
    },
    'muteHttpExceptions': true
  };

  if (payload) {
    options.payload = JSON.stringify(payload);
  }

  const url = `${jiraUrl}${endpoint}`;
  const response = UrlFetchApp.fetch(url, options);
  const responseCode = response.getResponseCode();
  const content = response.getContentText();

  if (responseCode >= 200 && responseCode < 300) {
    if (content.trim() === "") {
      return {}; // Return empty object for 204 No Content
    }
    return JSON.parse(content);
  } else {
    // Attempt to parse error message
    let errorMessage = `Jira API Error (${responseCode})`;
    try {
      const errorJson = JSON.parse(content);
      if (errorJson.errorMessages && errorJson.errorMessages.length > 0) {
        errorMessage += ': ' + errorJson.errorMessages.join(', ');
      } else if (errorJson.errors) {
        errorMessage += ': ' + JSON.stringify(errorJson.errors);
      }
    } catch (e) {
      errorMessage += ': ' + content;
    }
    throw new Error(errorMessage);
  }
}

/**
 * Reads data from the specified row and sends a request to Jira.
 */
function createIssue(row, epicKey, componentId) {
  const sheet = SpreadsheetApp.getActiveSheet();
  const projectKey = validateProjectKey();
  
  // Get data from the row
  const dataRange = sheet.getRange(row, 1, 1, 4);
  const values = dataRange.getValues()[0];
  
  // Updated Mapping:
  // Col A (0): Summary
  // Col B (1): Issue Type
  // Col C (2): Priority
  // Col D (3): Description
  const summary = values[0];
  const issueType = values[1] || 'Task'; // Changed from values[2]
  const priority = values[2];            // Changed from values[3]
  const description = values[3];         // Changed from values[1]

  if (!summary) {
    throw new Error('Summary (Column A) is required.');
  }

  // Construct payload for API v3 (Atlassian Document Format for description)
  const payload = {
    "fields": {
      "project": { "key": projectKey },
      "summary": summary,
      "description": {
        "type": "doc",
        "version": 1,
        "content": [
          {
            "type": "paragraph",
            "content": [
              {
                "type": "text",
                "text": description || ""
              }
            ]
          }
        ]
      },
      "issuetype": { "name": issueType }
    }
  };

  if (priority) {
    payload.fields.priority = { "name": priority };
  }
  
  // Add component if selected
  if (componentId) {
    payload.fields.components = [{ "id": componentId }];
  }

  // Link to Epic if selected
  if (epicKey) {
     payload.fields.parent = { "key": epicKey };
  }

  // API Call using v3
  const json = callJiraApi('/rest/api/3/issue', 'post', payload);

  if (json.key) {  
    // Attempt to transition the issue to "Selected for Development"
    try {
      transitionIssueToStatus(json.key, 'Selected for Development');
      SpreadsheetApp.getUi().alert(`Success! Issue created: ${json.key} and moved to 'Selected for Development'.\n(Link: ${PropertiesService.getScriptProperties().getProperty('JIRA_URL')}/browse/${json.key})`);
    } catch (e) {
      SpreadsheetApp.getUi().alert(`Success! Issue created: ${json.key}, but failed to move status: ${e.message}\n(Link: ${PropertiesService.getScriptProperties().getProperty('JIRA_URL')}/browse/${json.key})`);
    }
  }
}

/**
 * Transitions an issue to a specific status by name.
 */
function transitionIssueToStatus(issueKey, targetStatusName) {
  // 1. Get available transitions
  const response = callJiraApi(`/rest/api/3/issue/${issueKey}/transitions`, 'get');
  
  if (!response || !response.transitions) {
    throw new Error('No transitions found.');
  }

  // 2. Find the transition that leads to the target status
  const transition = response.transitions.find(t => 
    t.to.name.toLowerCase().trim() === targetStatusName.toLowerCase().trim()
  );

  if (!transition) {
    const available = response.transitions.map(t => t.to.name).join(', ');
    throw new Error(`Transition to status '${targetStatusName}' not found. Available statuses: ${available}`);
  }

  // 3. Perform the transition
  const payload = {
    transition: {
      id: transition.id
    }
  };
  
  callJiraApi(`/rest/api/3/issue/${issueKey}/transitions`, 'post', payload);
}

