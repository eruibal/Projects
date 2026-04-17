/**
 * Config.gs
 *
 * Credential storage (Script Properties) and Config sheet bootstrap.
 * Secrets (email + API token) are kept out of the spreadsheet itself.
 */

const CONFIG_SHEET_NAME = 'Config';

const PROP_KEYS = {
  BASE_URL: 'JIRA_BASE_URL',
  EMAIL: 'JIRA_EMAIL',
  API_TOKEN: 'JIRA_API_TOKEN',
};

const CONFIG_DEFAULTS = {
  PROJECT_KEYS: '',
  EPIC_JQL_OVERRIDE: '',
  CALENDAR_IDS: 'primary',
  LOOKBACK_DAYS: '180',
  ISSUE_KEY_REGEX: '\\b[A-Z][A-Z0-9]+-\\d+\\b',
  ALL_DAY_HOURS: '8',
  INCLUDE_SUBTASKS: 'true',
};

const CONFIG_SCHEMA = [
  ['Key', 'Value', 'Notes'],
  ['PROJECT_KEYS', CONFIG_DEFAULTS.PROJECT_KEYS, 'Comma-separated Jira project keys, e.g. "ABC,XYZ". Used when EPIC_JQL_OVERRIDE is empty.'],
  ['EPIC_JQL_OVERRIDE', CONFIG_DEFAULTS.EPIC_JQL_OVERRIDE, 'Optional: full JQL for Epics. Leave blank to use PROJECT_KEYS.'],
  ['CALENDAR_IDS', CONFIG_DEFAULTS.CALENDAR_IDS, 'Comma-separated calendar IDs to scan. "primary" = your default calendar.'],
  ['LOOKBACK_DAYS', CONFIG_DEFAULTS.LOOKBACK_DAYS, 'How many days back to search Calendar for matching events.'],
  ['ISSUE_KEY_REGEX', CONFIG_DEFAULTS.ISSUE_KEY_REGEX, 'Regex used to post-filter events; should match Jira issue keys.'],
  ['ALL_DAY_HOURS', CONFIG_DEFAULTS.ALL_DAY_HOURS, 'Hours counted per all-day event. 0 = ignore all-day events.'],
  ['INCLUDE_SUBTASKS', CONFIG_DEFAULTS.INCLUDE_SUBTASKS, '"true" to include sub-tasks when listing Epic children.'],
];

function getScriptProperty_(key) {
  return PropertiesService.getScriptProperties().getProperty(key) || '';
}

function setScriptProperty_(key, value) {
  PropertiesService.getScriptProperties().setProperty(key, value);
}

function getCredentials() {
  const baseUrl = getScriptProperty_(PROP_KEYS.BASE_URL);
  const email = getScriptProperty_(PROP_KEYS.EMAIL);
  const token = getScriptProperty_(PROP_KEYS.API_TOKEN);
  if (!baseUrl || !email || !token) {
    throw new Error(
      'Jira credentials are not set. Use the "Jira Time Report \u2192 Set credentials" menu first.'
    );
  }
  return {
    baseUrl: baseUrl.replace(/\/+$/, ''),
    email: email,
    token: token,
  };
}

function setCredentials(baseUrl, email, token) {
  if (!baseUrl || !email || !token) {
    throw new Error('baseUrl, email and token are all required.');
  }
  setScriptProperty_(PROP_KEYS.BASE_URL, baseUrl.replace(/\/+$/, ''));
  setScriptProperty_(PROP_KEYS.EMAIL, email);
  setScriptProperty_(PROP_KEYS.API_TOKEN, token);
}

function ensureConfigSheet_() {
  const ss = SpreadsheetApp.getActive();
  let sheet = ss.getSheetByName(CONFIG_SHEET_NAME);
  if (sheet) return sheet;

  sheet = ss.insertSheet(CONFIG_SHEET_NAME, 0);
  sheet.getRange(1, 1, CONFIG_SCHEMA.length, CONFIG_SCHEMA[0].length).setValues(CONFIG_SCHEMA);
  sheet.getRange(1, 1, 1, CONFIG_SCHEMA[0].length).setFontWeight('bold');
  sheet.setFrozenRows(1);
  sheet.setColumnWidth(1, 200);
  sheet.setColumnWidth(2, 280);
  sheet.setColumnWidth(3, 520);
  return sheet;
}

function readConfig() {
  const sheet = ensureConfigSheet_();
  const values = sheet.getRange(2, 1, Math.max(sheet.getLastRow() - 1, 0), 2).getValues();
  const map = {};
  values.forEach(function (row) {
    const key = String(row[0] || '').trim();
    if (!key) return;
    map[key] = String(row[1] == null ? '' : row[1]).trim();
  });

  function str(key) {
    return map[key] !== undefined && map[key] !== '' ? map[key] : CONFIG_DEFAULTS[key];
  }
  function list(key) {
    return str(key)
      .split(',')
      .map(function (s) { return s.trim(); })
      .filter(function (s) { return s.length > 0; });
  }
  function num(key) {
    const n = Number(str(key));
    return isNaN(n) ? Number(CONFIG_DEFAULTS[key]) : n;
  }
  function bool(key) {
    return String(str(key)).toLowerCase() === 'true';
  }

  return {
    projectKeys: list('PROJECT_KEYS'),
    epicJqlOverride: str('EPIC_JQL_OVERRIDE'),
    calendarIds: list('CALENDAR_IDS'),
    lookbackDays: num('LOOKBACK_DAYS'),
    issueKeyRegex: new RegExp(str('ISSUE_KEY_REGEX'), 'g'),
    allDayHours: num('ALL_DAY_HOURS'),
    includeSubtasks: bool('INCLUDE_SUBTASKS'),
  };
}
