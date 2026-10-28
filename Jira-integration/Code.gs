/**
 * Google Sheets to Jira Integration Script
 *
 * Instructions:
 * 1. Open your Google Sheet.
 * 2. Go to Extensions > Apps Script.
 * 3. Copy/Paste Code.gs, Page.html and PushIdeas.html.
 * 4. Set Script Properties (JIRA_URL, JIRA_EMAIL, JIRA_API_TOKEN, JIRA_PROJECT_KEY).
 *
 * PRODUCT DISCOVERY EXTENSION (added below the original code):
 * 5. Add one more Script Property: JPD_PROJECT_KEY = DIS
 *
 *    Menu: Jira Integration > Product Discovery
 *      - Push ideas to Discovery...   (dialog: scope, label, roadmap)
 *      - Diagnose selected row
 *      - Check Discovery connection
 *
 *    Columns are detected from the header row, so the Ideas tab can be a
 *    simple ID | Item | Status list or the full 5-level template.
 */

/**
 * Status every newly created Jira issue is moved to.
 * Matched against the DESTINATION status name, not the transition name —
 * in the SKP workflow the transition is called "In Progress" but lands on
 * the status "In Flight". Set to '' to leave new issues where they land.
 */
var JIRA_DEFAULT_STATUS = 'In Flight';

function onOpen() {
  const ui = SpreadsheetApp.getUi();
  ui.createMenu('Jira Integration')
      .addItem('Create Jira Issue from Row', 'showCreateIssueDialog')
      .addItem('Diagnose issue status...', 'diagnoseIssueStatus')
      .addSeparator()
      .addSubMenu(ui.createMenu('Product Discovery')
          .addItem('Push ideas to Discovery...', 'showPushIdeasDialog')
          .addSeparator()
          .addItem('Diagnose selected row', 'diagnoseSelectedIdeaRow')
          .addItem('Check Discovery connection', 'checkJpdConnection'))
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

  const jql = `project = "${projectKey}" AND issuetype = Epic AND statusCategory != Done ORDER BY created DESC`;

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
  const componentId = formObject.componentId;

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

  const dataRange = sheet.getRange(row, 1, 1, 4);
  const values = dataRange.getValues()[0];

  // Mapping:
  // Col D (3): Summary
  const summary = values[3];
  const issueType = 'Story';
  const priority = 'High';
  const description = values[1];

  if (!summary) {
    throw new Error('Summary (Column A) is required.');
  }

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

  if (componentId) {
    payload.fields.components = [{ "id": componentId }];
  }

  if (epicKey) {
    payload.fields.parent = { "key": epicKey };
  }

  const json = callJiraApi('/rest/api/3/issue', 'post', payload);

  if (json.key) {
    const jiraUrl = PropertiesService.getScriptProperties().getProperty('JIRA_URL');
    const issueUrl = `${jiraUrl}/browse/${json.key}`;

    const richTextValue = SpreadsheetApp.newRichTextValue()
      .setText(summary)
      .setLinkUrl(issueUrl)
      .build();
    sheet.getRange(row, 4).setRichTextValue(richTextValue);

    if (!JIRA_DEFAULT_STATUS) {
      SpreadsheetApp.getUi().alert(`Success! Issue created: ${json.key}\n(Link: ${issueUrl})`);
      return;
    }

    try {
      var landedOn = transitionIssueToStatus(json.key, JIRA_DEFAULT_STATUS);
      SpreadsheetApp.getUi().alert(`Success! Issue created: ${json.key}\nStatus: ${landedOn}\n(Link: ${issueUrl})`);
    } catch (e) {
      SpreadsheetApp.getUi().alert(
          `Issue created: ${json.key}\n(Link: ${issueUrl})\n\n` +
          `BUT the status is still "${currentStatus_(json.key)}" instead of "${JIRA_DEFAULT_STATUS}".\n\n` +
          `Reason: ${e.message}`);
    }
  }
}

/**
 * Moves an issue to a status by name, and VERIFIES it landed there.
 *
 * Matches the destination status first ("In Flight"), then falls back to the
 * transition's own name ("In Progress") — in this workflow they differ.
 * Returns the status the issue actually ends on; throws with the available
 * transitions listed when it cannot get there.
 */
function transitionIssueToStatus(issueKey, targetStatusName) {
  var target = normalizeStatus_(targetStatusName);

  var data = callJiraApi('/rest/api/3/issue/' + issueKey + '/transitions', 'get');
  var list = (data && data.transitions) || [];
  if (!list.length) {
    throw new Error('Jira offered no transitions for ' + issueKey + '.');
  }

  // by destination status name, then by transition name
  var candidates = list.filter(function (t) {
    return normalizeStatus_(t.to && t.to.name) === target;
  });
  if (!candidates.length) {
    candidates = list.filter(function (t) { return normalizeStatus_(t.name) === target; });
  }
  if (!candidates.length) {
    throw new Error('Nothing leads to "' + targetStatusName + '". Jira offered: ' +
        list.map(function (t) {
          return (t.to && t.to.name) + ' (via "' + t.name + '", id ' + t.id + ')';
        }).join('; '));
  }

  var lastError = null;
  for (var i = 0; i < candidates.length; i++) {
    try {
      callJiraApi('/rest/api/3/issue/' + issueKey + '/transitions', 'post',
                  { transition: { id: String(candidates[i].id) } });

      var now = currentStatus_(issueKey);
      if (normalizeStatus_(now) === target) return now;

      lastError = new Error('Jira accepted transition "' + candidates[i].name +
                            '" (id ' + candidates[i].id + ') but ' + issueKey +
                            ' is now "' + now + '".');
    } catch (e) {
      lastError = e;
    }
  }
  throw lastError;
}

function currentStatus_(issueKey) {
  var issue = callJiraApi('/rest/api/3/issue/' + issueKey + '?fields=status', 'get');
  return (issue && issue.fields && issue.fields.status && issue.fields.status.name) || '(unknown)';
}

function normalizeStatus_(s) {
  return String(s || '').toLowerCase().replace(/\s+/g, ' ').trim();
}

/**
 * Run this against an issue key to see exactly what Jira offers and what
 * happens when the script tries to move it to JIRA_DEFAULT_STATUS.
 */
function diagnoseIssueStatus() {
  var ui = SpreadsheetApp.getUi();
  var res = ui.prompt('Diagnose issue status',
                      'Issue key to inspect (e.g. SKP-315):', ui.ButtonSet.OK_CANCEL);
  if (res.getSelectedButton() !== ui.Button.OK) return;

  var key = res.getResponseText().trim();
  if (!key) return;

  var before = currentStatus_(key);
  var data = callJiraApi('/rest/api/3/issue/' + key + '/transitions', 'get');
  var lines = ((data && data.transitions) || []).map(function (t) {
    return '  "' + t.name + '"  ->  ' + (t.to && t.to.name) + '   (id ' + t.id + ')';
  });

  var outcome;
  try {
    outcome = 'moved to "' + transitionIssueToStatus(key, JIRA_DEFAULT_STATUS) + '"';
  } catch (e) {
    outcome = 'FAILED — ' + e.message;
  }

  ui.alert(
      'Issue ' + key + '\n\n' +
      'Status before: ' + before + '\n' +
      'Target (JIRA_DEFAULT_STATUS): ' + JIRA_DEFAULT_STATUS + '\n\n' +
      'Transitions Jira offered:\n' + (lines.length ? lines.join('\n') : '  (none)') + '\n\n' +
      'Result: ' + outcome + '\n' +
      'Status now: ' + currentStatus_(key));
}

function onEdit(e) {
  var sheet = e.source.getActiveSheet();
  var range = e.range;

  // CONFIGURATION: Adjusted for Column B
  var targetSheetName = "Applications Log";
  var companyColumn = 2;
  var rejectionSheetName = "Rejections";
  var rejectionCompanyColumn = 2;

  if (sheet.getName() === targetSheetName && range.getColumn() === companyColumn && e.value) {
    var enteredCompany = e.value.trim().toLowerCase();

    var rejSheet = e.source.getSheetByName(rejectionSheetName);
    if (!rejSheet) return;

    var lastRow = rejSheet.getLastRow();
    if (lastRow < 1) return;

    var rejectedCompanies = rejSheet.getRange(1, rejectionCompanyColumn, lastRow, 1).getValues();

    for (var i = 0; i < rejectedCompanies.length; i++) {
      if (rejectedCompanies[i][0].toString().trim().toLowerCase() === enteredCompany) {

        SpreadsheetApp.getUi().alert(
          "🚨 REJECTION WARNING 🚨\n\n" +
          "You have already been rejected by '" + e.value + "' in the past. " +
          "Check your Rejections tab before proceeding!"
        );
        break;
      }
    }
  }
}

/* =====================================================================
 * JIRA PRODUCT DISCOVERY (JPD) EXTENSION
 * ---------------------------------------------------------------------
 * Pushes rows from the Ideas tab into the Discovery project as Ideas,
 * writes the key into the ID column and links the Item text to the idea.
 * Label and Roadmap are chosen in the dialog and applied to the batch.
 * ===================================================================== */

var JPD = {
  TAB_MATCH: 'Ideas',
  DEFAULT_PROJECT_KEY: 'DIS',
  ISSUE_TYPE: 'Idea',

  HEADER_ROW: 1,
  IDEA_LEVEL: 2,             // outline depth of an Idea row, when levels exist
  ONLY_IDEA_LEVEL: true,     // ignored on a flat tab
  INDENT_WIDTH: 4,

  ROADMAP_FIELD_NAME: 'Roadmap',   // JPD select field to offer in the dialog
  LABEL_SAMPLE_SIZE: 100,          // ideas scanned to collect existing labels
  DEFAULT_STATUS: 'Discovery',     // every new idea is moved here; '' to skip

  SEND_DESCRIPTION: true,
  PAUSE_MS: 250
};

var JPD_HEADERS = {
  key:      ['id', 'key', 'jpd key', 'jira key', 'idea key'],
  item:     ['item', 'summary', 'idea', 'title', 'name'],
  owner:    ['owner', 'assignee', 'responsible'],
  status:   ['status', 'state'],
  value:    ['value', 'value 1-5'],
  effort:   ['effort', 'effort 1-5'],
  score:    ['score'],
  priority: ['priority'],
  roadmap:  ['roadmap']
};

// ---------------------------------------------------------------- menu

function showPushIdeasDialog() {
  jpdIdeasSheet_();   // fail early with a clear message if the tab is missing
  var html = HtmlService.createHtmlOutputFromFile('PushIdeas')
      .setWidth(420)
      .setHeight(520)
      .setTitle('Push ideas to Discovery');
  SpreadsheetApp.getUi().showModalDialog(html, 'Push ideas to Discovery');
}

/** Everything the dialog needs: scope counts, labels, roadmap options. */
function getPushContext() {
  var sheet = jpdIdeasSheet_();
  var cols = jpdColumns_(sheet);
  var hier = jpdHasHierarchy_(sheet, cols);

  // rows currently selected that would actually push
  var selected = [];
  var list = sheet.getActiveRangeList();
  var ranges = list ? list.getRanges() : [sheet.getActiveRange()];
  ranges.forEach(function (r) {
    if (!r) return;
    for (var i = 0; i < r.getNumRows(); i++) {
      var row = r.getRow() + i;
      if (row > JPD.HEADER_ROW && selected.indexOf(row) === -1 &&
          !jpdSkipReason_(sheet, row, cols, hier)) {
        selected.push(row);
      }
    }
  });
  selected.sort(function (a, b) { return a - b; });

  var unsynced = 0;
  for (var row = JPD.HEADER_ROW + 1; row <= sheet.getLastRow(); row++) {
    if (!jpdSkipReason_(sheet, row, cols, hier)) unsynced++;
  }

  return {
    projectKey:   jpdProjectKey_(),
    sheetName:    sheet.getName(),
    selectedRows: selected,
    unsyncedCount: unsynced,
    labels:       jpdExistingLabels_(),
    roadmap:      jpdSelectField_(JPD.ROADMAP_FIELD_NAME)
  };
}

/** Called by the dialog. Returns a plain-text summary shown back in it. */
function runPushFromDialog(form) {
  var sheet = jpdIdeasSheet_();
  var cols = jpdColumns_(sheet);
  var hier = jpdHasHierarchy_(sheet, cols);

  var rows;
  if (form.scope === 'all') {
    rows = [];
    for (var row = JPD.HEADER_ROW + 1; row <= sheet.getLastRow(); row++) rows.push(row);
  } else {
    rows = (form.rows || []).map(Number);
  }
  if (!rows.length) return { ok: false, message: 'Nothing to push — no rows in scope.' };

  var label = String(form.label || '').trim().replace(/[^A-Za-z0-9_-]+/g, '-');
  var roadmapField = (form.roadmapId) ? jpdSelectField_(JPD.ROADMAP_FIELD_NAME) : null;

  return pushIdeaRows_(sheet, rows, {
    label: label,
    roadmapFieldId: roadmapField ? roadmapField.fieldId : '',
    roadmapId: String(form.roadmapId || ''),
    roadmapText: String(form.roadmapText || ''),
    cols: cols,
    hier: hier
  });
}

function diagnoseSelectedIdeaRow() {
  var sheet = jpdIdeasSheet_();
  var row = sheet.getActiveRange() ? sheet.getActiveRange().getRow() : 0;
  var cols = jpdColumns_(sheet);
  var hier = jpdHasHierarchy_(sheet, cols);

  if (row <= JPD.HEADER_ROW) {
    SpreadsheetApp.getUi().alert('Select a data row (below row ' + JPD.HEADER_ROW + ') and run this again.');
    return;
  }

  var text = String(sheet.getRange(row, cols.item).getValue() || '');
  var keyVal = String(sheet.getRange(row, cols.key).getValue() || '').trim();
  var reason = jpdSkipReason_(sheet, row, cols, hier);

  SpreadsheetApp.getUi().alert(
    'Row ' + row + ' on "' + sheet.getName() + '"\n\n' +
    'Columns detected:\n' +
    '  key  -> column ' + colLetter_(cols.key) + '\n' +
    '  item -> column ' + colLetter_(cols.item) + '\n' +
    (cols.status  ? '  status  -> column ' + colLetter_(cols.status)  + '\n' : '') +
    (cols.owner   ? '  owner   -> column ' + colLetter_(cols.owner)   + '\n' : '') +
    (cols.roadmap ? '  roadmap -> column ' + colLetter_(cols.roadmap) + '\n' : '') +
    '\nItem text: "' + text + '"' +
    '\nKey cell: ' + (keyVal ? '"' + keyVal + '"' : '(empty)') +
    '\n\nTab has a hierarchy: ' + (hier ? 'yes' : 'no (flat list — level filter is off)') +
    '\nRow level: ' + jpdRowLevel_(sheet, row, text) +
    '\n\nVerdict: ' + (reason ? 'SKIP — ' + reason : 'WILL PUSH'));
}

function checkJpdConnection() {
  var key = jpdProjectKey_();
  var meta = callJiraApi(
      '/rest/api/3/issue/createmeta?projectKeys=' + encodeURIComponent(key) +
      '&expand=projects.issuetypes', 'get');

  var project = meta && meta.projects && meta.projects[0];
  if (!project) throw new Error('Project ' + key + ' not visible with these credentials.');

  var types = (project.issuetypes || []).map(function (t) { return t.name; });
  var roadmap = jpdSelectField_(JPD.ROADMAP_FIELD_NAME);
  var labels = jpdExistingLabels_();

  SpreadsheetApp.getUi().alert(
      'Connected to ' + project.name + ' (' + project.key + ').\n\n' +
      'Issue types: ' + types.join(', ') + '\n' +
      'Creating: ' + JPD.ISSUE_TYPE +
        (JPD.DEFAULT_STATUS ? ', then moved to "' + JPD.DEFAULT_STATUS + '"' : '') + '\n\n' +
      JPD.ROADMAP_FIELD_NAME + ' field: ' +
        (roadmap ? roadmap.fieldId + ' — options: ' +
          roadmap.options.map(function (o) { return o.value; }).join(', ')
        : 'not found on the create screen') + '\n\n' +
      'Labels in use: ' + (labels.length ? labels.join(', ') : '(none)'));
}

// ---------------------------------------------------------------- core

function pushIdeaRows_(sheet, rows, opts) {
  opts = opts || {};
  var projectKey = jpdProjectKey_();
  var jiraUrl = PropertiesService.getScriptProperties().getProperty('JIRA_URL');
  if (!jiraUrl) throw new Error('JIRA_URL is not set in Script Properties.');
  jiraUrl = jiraUrl.replace(/\/+$/, '');

  var cols = opts.cols || jpdColumns_(sheet);
  var hier = (opts.hier !== undefined) ? opts.hier : jpdHasHierarchy_(sheet, cols);

  var todo = [], skipped = [];
  rows.forEach(function (row) {
    var reason = jpdSkipReason_(sheet, row, cols, hier);
    if (reason) { skipped.push('Row ' + row + ': ' + reason); return; }
    var text = String(sheet.getRange(row, cols.item).getValue() || '');
    todo.push({ row: row, text: text, summary: text.trim() });
  });

  if (!todo.length) {
    return { ok: false, message: 'Nothing to push.\n\n' + skipped.join('\n') };
  }

  var created = [], failed = [], warned = [];

  todo.forEach(function (item, i) {
    try {
      var result = createJpdIdea_(projectKey, item.summary, {
        description: JPD.SEND_DESCRIPTION
            ? jpdIdeaDescription_(sheet, item.row, cols, hier) : '',
        labels: opts.label ? [opts.label] : [],
        roadmapFieldId: opts.roadmapFieldId,
        roadmapId: opts.roadmapId,
        roadmapText: opts.roadmapText
      });

      var key = result.json.key;
      var url = jiraUrl + '/browse/' + key;

      sheet.getRange(item.row, cols.key).setValue(key);

      var leading = item.text.length - item.text.replace(/^\s+/, '').length;
      var rich = SpreadsheetApp.newRichTextValue().setText(item.text);
      rich.setLinkUrl(leading, item.text.length, url);
      sheet.getRange(item.row, cols.item).setRichTextValue(rich.build());

      // mirror the roadmap choice into the sheet when a Roadmap column exists
      if (cols.roadmap && opts.roadmapText) {
        sheet.getRange(item.row, cols.roadmap).setValue(opts.roadmapText);
      }

      sheet.getRange(item.row, cols.key).clearNote();
      created.push(key + '  ' + item.summary);
      result.warnings.forEach(function (w) { warned.push(key + ': ' + w); });
    } catch (err) {
      failed.push('Row ' + item.row + ': ' + err.message);
      sheet.getRange(item.row, cols.key).setNote('JPD push failed: ' + err.message);
    }
    if (i < todo.length - 1) Utilities.sleep(JPD.PAUSE_MS);
  });

  SpreadsheetApp.flush();

  // Clean run: the sheet already shows the key and the link, so the dialog
  // just closes. Anything short of that is reported.
  if (created.length && !failed.length && !warned.length && !skipped.length) {
    return { ok: true, message: '' };
  }

  var msg = created.length + ' idea(s) created in ' + projectKey + '.';
  if (skipped.length) msg += '\n\nSkipped:\n' + skipped.join('\n');
  if (warned.length)  msg += '\n\nWarnings:\n' + warned.join('\n');
  if (failed.length)  msg += '\n\nFailed:\n' + failed.join('\n') +
                             '\n(Reasons are also notes on the ID cells.)';
  return { ok: false, message: msg };
}

function jpdSkipReason_(sheet, row, cols, hier) {
  var text = String(sheet.getRange(row, cols.item).getValue() || '');
  if (!text.trim()) return 'the Item cell (' + colLetter_(cols.item) + row + ') is empty';

  var existing = String(sheet.getRange(row, cols.key).getValue() || '').trim();
  if (isJiraKey_(existing)) return 'already synced as ' + existing;

  if (JPD.ONLY_IDEA_LEVEL && hier) {
    var level = jpdRowLevel_(sheet, row, text);
    if (level !== JPD.IDEA_LEVEL) {
      return 'it sits at level ' + level + ', not Idea level (' + JPD.IDEA_LEVEL + ')';
    }
  }
  return '';
}

/**
 * Creates one Idea. Labels and description go in the create call; the
 * roadmap is set afterwards so a refusal there never costs you the idea.
 * Returns { json, warnings[] }.
 */
function createJpdIdea_(projectKey, summary, opts) {
  var warnings = [];

  var fields = {
    project:   { key: projectKey },
    summary:   summary,
    issuetype: { name: JPD.ISSUE_TYPE }
  };
  if (opts.description) fields.description = adfParagraphs_(opts.description);
  if (opts.labels && opts.labels.length) fields.labels = opts.labels;

  var json;
  try {
    json = callJiraApi('/rest/api/3/issue', 'post', { fields: fields });
  } catch (e) {
    if (!/description|labels|cannot be set|not on the appropriate screen/i.test(e.message)) {
      throw e;
    }
    warnings.push('created without description/labels (' + e.message + ')');
    json = callJiraApi('/rest/api/3/issue', 'post', {
      fields: {
        project:   { key: projectKey },
        summary:   summary,
        issuetype: { name: JPD.ISSUE_TYPE }
      }
    });
    // labels are worth a second attempt on their own
    if (opts.labels && opts.labels.length) {
      try {
        callJiraApi('/rest/api/3/issue/' + json.key, 'put',
                    { fields: { labels: opts.labels } });
        warnings.pop();
        warnings.push('description skipped, label applied afterwards');
      } catch (e2) {
        warnings.push('label not applied: ' + e2.message);
      }
    }
  }

  if (opts.roadmapFieldId && (opts.roadmapId || opts.roadmapText)) {
    try {
      jpdSetSelectField_(json.key, opts.roadmapFieldId, opts.roadmapId, opts.roadmapText);
    } catch (e3) {
      warnings.push(JPD.ROADMAP_FIELD_NAME + ' not set: ' + e3.message);
    }
  }

  if (JPD.DEFAULT_STATUS) {
    try {
      transitionIssueToStatus(json.key, JPD.DEFAULT_STATUS);
    } catch (e4) {
      warnings.push('status not moved to ' + JPD.DEFAULT_STATUS + ': ' + e4.message);
    }
  }

  return { json: json, warnings: warnings };
}

/** JPD select fields accept several shapes; try them in order. */
function jpdSetSelectField_(issueKey, fieldId, optionId, optionText) {
  var attempts = [];
  if (optionId)   attempts.push({ id: String(optionId) });
  if (optionText) attempts.push({ value: optionText });
  if (optionText) attempts.push(optionText);

  var lastError = null;
  for (var i = 0; i < attempts.length; i++) {
    var fields = {};
    fields[fieldId] = attempts[i];
    try {
      callJiraApi('/rest/api/3/issue/' + issueKey, 'put', { fields: fields });
      return;
    } catch (e) {
      lastError = e;
    }
  }
  throw lastError || new Error('no accepted value shape');
}

// ------------------------------------------------------------ discovery

/** Looks up a select field on the Idea create screen by display name. */
function jpdSelectField_(fieldName) {
  var cacheKey = 'jpd_field_' + fieldName;
  var cache = CacheService.getScriptCache();
  var hit = cache.get(cacheKey);
  if (hit) {
    try { return JSON.parse(hit); } catch (e) { /* fall through */ }
  }

  var projectKey = jpdProjectKey_();
  var meta = callJiraApi(
      '/rest/api/3/issue/createmeta?projectKeys=' + encodeURIComponent(projectKey) +
      '&issuetypeNames=' + encodeURIComponent(JPD.ISSUE_TYPE) +
      '&expand=projects.issuetypes.fields', 'get');

  var project = meta && meta.projects && meta.projects[0];
  var issuetype = project && project.issuetypes && project.issuetypes[0];
  var fields = issuetype && issuetype.fields;
  if (!fields) return null;

  var found = null;
  Object.keys(fields).forEach(function (id) {
    var f = fields[id];
    if (f && f.name && f.name.toLowerCase().trim() === fieldName.toLowerCase().trim()) {
      found = {
        fieldId: id,
        name: f.name,
        options: (f.allowedValues || []).map(function (v) {
          return { id: v.id || '', value: v.value || v.name || String(v) };
        })
      };
    }
  });

  if (found) cache.put(cacheKey, JSON.stringify(found), 1800);   // 30 min
  return found;
}

/** Distinct labels already used on ideas in the Discovery project. */
function jpdExistingLabels_() {
  try {
    var projectKey = jpdProjectKey_();
    var result = callJiraApi('/rest/api/3/search/jql', 'post', {
      jql: 'project = "' + projectKey + '" ORDER BY created DESC',
      fields: ['labels'],
      maxResults: JPD.LABEL_SAMPLE_SIZE
    });
    var seen = {};
    (result.issues || []).forEach(function (issue) {
      ((issue.fields && issue.fields.labels) || []).forEach(function (l) { seen[l] = true; });
    });
    return Object.keys(seen).sort();
  } catch (e) {
    return [];
  }
}

// ------------------------------------------------------------ helpers

function jpdProjectKey_() {
  var p = PropertiesService.getScriptProperties().getProperty('JPD_PROJECT_KEY');
  return (p && p.trim()) || JPD.DEFAULT_PROJECT_KEY;
}

function jpdIdeasSheet_() {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var needle = JPD.TAB_MATCH.toLowerCase();
  var active = ss.getActiveSheet();
  if (active.getName().toLowerCase().indexOf(needle) !== -1) return active;

  var sheets = ss.getSheets();
  for (var i = 0; i < sheets.length; i++) {
    if (sheets[i].getName().toLowerCase().indexOf(needle) !== -1) return sheets[i];
  }
  throw new Error('No tab whose name contains "' + JPD.TAB_MATCH + '" was found.');
}

function jpdColumns_(sheet) {
  var lastCol = Math.max(sheet.getLastColumn(), 2);
  var headers = sheet.getRange(JPD.HEADER_ROW, 1, 1, lastCol).getDisplayValues()[0]
      .map(function (h) { return String(h).trim().toLowerCase(); });

  function find(names, fallback) {
    for (var i = 0; i < headers.length; i++) {
      if (names.indexOf(headers[i]) !== -1) return i + 1;
    }
    return fallback;
  }

  return {
    key:      find(JPD_HEADERS.key, 1),
    item:     find(JPD_HEADERS.item, 2),
    owner:    find(JPD_HEADERS.owner, 0),
    status:   find(JPD_HEADERS.status, 0),
    value:    find(JPD_HEADERS.value, 0),
    effort:   find(JPD_HEADERS.effort, 0),
    score:    find(JPD_HEADERS.score, 0),
    priority: find(JPD_HEADERS.priority, 0),
    roadmap:  find(JPD_HEADERS.roadmap, 0)
  };
}

function jpdHasHierarchy_(sheet, cols) {
  var last = sheet.getLastRow();
  if (last <= JPD.HEADER_ROW) return false;

  for (var r = JPD.HEADER_ROW + 1; r <= last; r++) {
    try { if (sheet.getRowGroupDepth(r) > 0) return true; } catch (e) { /* no groups */ }
  }

  var texts = sheet.getRange(JPD.HEADER_ROW + 1, cols.item, last - JPD.HEADER_ROW, 1).getValues();
  for (var i = 0; i < texts.length; i++) {
    if (/^\s{2,}/.test(String(texts[i][0] || ''))) return true;
  }
  return false;
}

function isJiraKey_(v) {
  return /^[A-Z][A-Z0-9]*-\d+$/.test(String(v).trim());
}

function jpdRowLevel_(sheet, row, text) {
  var byGroup = 0;
  try { byGroup = sheet.getRowGroupDepth(row); } catch (e) { byGroup = 0; }
  var leading = text.length - text.replace(/^\s+/, '').length;
  var byIndent = Math.floor(leading / JPD.INDENT_WIDTH);
  return Math.max(byGroup, byIndent);
}

function jpdAncestorText_(sheet, row, level, cols) {
  for (var r = row - 1; r > JPD.HEADER_ROW; r--) {
    var t = String(sheet.getRange(r, cols.item).getValue() || '');
    if (!t.trim()) continue;
    if (jpdRowLevel_(sheet, r, t) === level) return t.trim();
  }
  return '';
}

function jpdIdeaDescription_(sheet, row, cols, hier) {
  var lastCol = Math.max(sheet.getLastColumn(), 2);
  var vals = sheet.getRange(row, 1, 1, lastCol).getDisplayValues()[0];
  function at(c) { return c ? String(vals[c - 1] || '').trim() : ''; }

  var lines = [];

  if (hier) {
    var portfolio = jpdAncestorText_(sheet, row, 0, cols);
    var theme     = jpdAncestorText_(sheet, row, 1, cols);
    if (portfolio || theme) lines.push([portfolio, theme].filter(String).join('  >  '));
  }

  var facts = [];
  if (at(cols.owner))    facts.push('Owner: '    + at(cols.owner));
  if (at(cols.status))   facts.push('Status: '   + at(cols.status));
  if (at(cols.value))    facts.push('Value: '    + at(cols.value));
  if (at(cols.effort))   facts.push('Effort: '   + at(cols.effort));
  if (at(cols.score))    facts.push('Score: '    + at(cols.score));
  if (at(cols.priority)) facts.push('Priority: ' + at(cols.priority));
  if (facts.length) lines.push(facts.join(' · '));

  lines.push('Pushed from ' + SpreadsheetApp.getActiveSpreadsheet().getName() +
             ' / ' + sheet.getName() + ', row ' + row + '.');
  return lines.join('\n');
}

function adfParagraphs_(text) {
  return {
    type: 'doc',
    version: 1,
    content: String(text).split('\n').map(function (line) {
      return {
        type: 'paragraph',
        content: line ? [{ type: 'text', text: line }] : []
      };
    })
  };
}

function colLetter_(col) {
  if (!col) return '-';
  var s = '';
  while (col > 0) {
    var m = (col - 1) % 26;
    s = String.fromCharCode(65 + m) + s;
    col = Math.floor((col - m) / 26);
  }
  return s;
}