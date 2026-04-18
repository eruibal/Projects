/**
 * Config.gs
 *
 * Credential storage (Script Properties) and inline runtime settings.
 * Secrets (email + API token) are kept out of source control via Script
 * Properties; everything else lives in SETTINGS below and is edited in code.
 */

const PROP_KEYS = {
  BASE_URL: 'JIRA_BASE_URL',
  EMAIL: 'JIRA_EMAIL',
  API_TOKEN: 'JIRA_API_TOKEN',
};

const SETTINGS = {
  PROJECT_KEYS: ['ABC', 'XYZ'],
  EPIC_JQL_OVERRIDE: '',
  CALENDAR_IDS: ['primary'],
  LOOKBACK_DAYS: 180,
  ISSUE_KEY_REGEX: /\b[A-Z][A-Z0-9]+-\d+\b/g,
  ALL_DAY_HOURS: 8,
  INCLUDE_SUBTASKS: true,
};

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

function readConfig() {
  return {
    projectKeys: SETTINGS.PROJECT_KEYS,
    epicJqlOverride: SETTINGS.EPIC_JQL_OVERRIDE,
    calendarIds: SETTINGS.CALENDAR_IDS,
    lookbackDays: SETTINGS.LOOKBACK_DAYS,
    issueKeyRegex: SETTINGS.ISSUE_KEY_REGEX,
    allDayHours: SETTINGS.ALL_DAY_HOURS,
    includeSubtasks: SETTINGS.INCLUDE_SUBTASKS,
  };
}
