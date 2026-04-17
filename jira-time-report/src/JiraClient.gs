/**
 * JiraClient.gs
 *
 * Thin wrapper over Jira Cloud REST API v3 using UrlFetchApp with
 * Basic auth (email + API token). Handles pagination and 429 back-off.
 */

const JIRA_PAGE_SIZE = 100;
const JIRA_MAX_RETRIES = 4;

function buildJiraHeaders_(creds) {
  const authToken = Utilities.base64Encode(creds.email + ':' + creds.token);
  return {
    Authorization: 'Basic ' + authToken,
    Accept: 'application/json',
    'Content-Type': 'application/json',
  };
}

function jiraFetch_(path, params) {
  const creds = getCredentials();
  const qs = params
    ? '?' + Object.keys(params)
        .map(function (k) { return encodeURIComponent(k) + '=' + encodeURIComponent(params[k]); })
        .join('&')
    : '';
  const url = creds.baseUrl + path + qs;

  let attempt = 0;
  while (true) {
    const response = UrlFetchApp.fetch(url, {
      method: 'get',
      headers: buildJiraHeaders_(creds),
      muteHttpExceptions: true,
      followRedirects: true,
    });
    const code = response.getResponseCode();
    const body = response.getContentText();

    if (code >= 200 && code < 300) {
      return JSON.parse(body);
    }
    if (code === 429 && attempt < JIRA_MAX_RETRIES) {
      const retryAfter = Number(response.getHeaders()['Retry-After']) || Math.pow(2, attempt);
      Utilities.sleep(retryAfter * 1000);
      attempt += 1;
      continue;
    }
    if (code >= 500 && attempt < JIRA_MAX_RETRIES) {
      Utilities.sleep(Math.pow(2, attempt) * 500);
      attempt += 1;
      continue;
    }
    throw new Error('Jira API ' + code + ' for ' + url + ': ' + body);
  }
}

/**
 * Paginate through /rest/api/3/search.
 * @param {string} jql
 * @param {string[]} fields
 * @return {Object[]} array of issue objects
 */
function searchIssues(jql, fields) {
  const out = [];
  let startAt = 0;
  const fieldsParam = (fields && fields.length ? fields.join(',') : 'summary,status,issuetype,parent');
  while (true) {
    const page = jiraFetch_('/rest/api/3/search', {
      jql: jql,
      startAt: String(startAt),
      maxResults: String(JIRA_PAGE_SIZE),
      fields: fieldsParam,
    });
    const issues = page.issues || [];
    for (let i = 0; i < issues.length; i++) out.push(issues[i]);
    const total = Number(page.total || 0);
    startAt += issues.length;
    if (issues.length === 0 || startAt >= total) break;
  }
  return out;
}

/**
 * @param {string[]} projectKeys
 * @param {string} jqlOverride optional full JQL
 * @return {{key:string, summary:string, status:string, url:string}[]}
 */
function getEpics(projectKeys, jqlOverride) {
  let jql;
  if (jqlOverride && jqlOverride.trim()) {
    jql = jqlOverride.trim();
  } else {
    if (!projectKeys || !projectKeys.length) {
      throw new Error('No PROJECT_KEYS configured and no EPIC_JQL_OVERRIDE set.');
    }
    const list = projectKeys.map(function (k) { return '"' + k + '"'; }).join(',');
    jql = 'project in (' + list + ') AND issuetype = Epic ORDER BY updated DESC';
  }
  const issues = searchIssues(jql, ['summary', 'status']);
  const baseUrl = getCredentials().baseUrl;
  return issues.map(function (i) {
    return {
      key: i.key,
      summary: (i.fields && i.fields.summary) || '',
      status: (i.fields && i.fields.status && i.fields.status.name) || '',
      url: baseUrl + '/browse/' + i.key,
    };
  });
}

/**
 * Fetch children (stories/tasks/bugs, optionally sub-tasks) of an Epic.
 * Uses both `parent = EPIC` (team-managed / new parent field) and
 * `"Epic Link" = EPIC` (company-managed legacy) for maximum compatibility.
 *
 * @param {string} epicKey
 * @param {boolean} includeSubtasks
 * @return {{key:string, summary:string, status:string, issuetype:string, url:string}[]}
 */
function getChildrenOfEpic(epicKey, includeSubtasks) {
  const safeKey = String(epicKey).replace(/"/g, '');
  let jql = '(parent = "' + safeKey + '" OR "Epic Link" = "' + safeKey + '")';
  if (!includeSubtasks) {
    jql += ' AND issuetype != Sub-task';
  }
  jql += ' ORDER BY issuetype ASC, created ASC';

  const issues = searchIssues(jql, ['summary', 'status', 'issuetype']);
  const baseUrl = getCredentials().baseUrl;
  return issues.map(function (i) {
    return {
      key: i.key,
      summary: (i.fields && i.fields.summary) || '',
      status: (i.fields && i.fields.status && i.fields.status.name) || '',
      issuetype: (i.fields && i.fields.issuetype && i.fields.issuetype.name) || '',
      url: baseUrl + '/browse/' + i.key,
    };
  });
}

function testJiraConnection() {
  const me = jiraFetch_('/rest/api/3/myself', null);
  return {
    accountId: me.accountId,
    displayName: me.displayName,
    emailAddress: me.emailAddress,
  };
}
