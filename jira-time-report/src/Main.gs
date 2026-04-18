/**
 * Main.gs
 *
 * Entry points wired to the custom "Jira Time Report" menu on the sheet.
 */

const WARN_STORY_COUNT = 500;

function onOpen() {
  SpreadsheetApp.getUi()
    .createMenu('Jira Time Report')
    .addItem('Set credentials', 'menuSetCredentials')
    .addItem('Test Jira connection', 'menuTestConnection')
    .addSeparator()
    .addItem('Load Epics', 'menuLoadEpics')
    .addItem('Build report for selected Epic', 'menuBuildReportForSelected')
    .addSeparator()
    .addItem('Rebuild report (all Epics)', 'menuRebuildReport')
    .addToUi();
}

function menuSetCredentials() {
  const ui = SpreadsheetApp.getUi();
  const base = ui.prompt(
    'Jira Cloud base URL',
    'e.g. https://your-company.atlassian.net',
    ui.ButtonSet.OK_CANCEL
  );
  if (base.getSelectedButton() !== ui.Button.OK) return;

  const email = ui.prompt('Jira account email', 'The email you use to sign in to Jira.', ui.ButtonSet.OK_CANCEL);
  if (email.getSelectedButton() !== ui.Button.OK) return;

  const token = ui.prompt(
    'Jira API token',
    'Create one at https://id.atlassian.com/manage-profile/security/api-tokens',
    ui.ButtonSet.OK_CANCEL
  );
  if (token.getSelectedButton() !== ui.Button.OK) return;

  setCredentials(
    base.getResponseText().trim(),
    email.getResponseText().trim(),
    token.getResponseText().trim()
  );
  ui.alert('Credentials saved to Script Properties.');
}

function menuTestConnection() {
  const ui = SpreadsheetApp.getUi();
  try {
    const me = testJiraConnection();
    ui.alert('Connected as ' + me.displayName + ' <' + me.emailAddress + '>');
  } catch (e) {
    ui.alert('Jira connection failed:\n' + e.message);
  }
}

function menuLoadEpics() {
  const ui = SpreadsheetApp.getUi();
  try {
    const cfg = readConfig();
    const epics = getEpics(cfg.projectKeys, cfg.epicJqlOverride);
    writeEpics(epics);
    SpreadsheetApp.getActive().setActiveSheet(
      SpreadsheetApp.getActive().getSheetByName(SHEETS.EPICS)
    );
    ui.alert('Loaded ' + epics.length + ' Epic(s). Select a row and run "Build report for selected Epic".');
  } catch (e) {
    ui.alert('Failed to load Epics:\n' + e.message);
  }
}

function menuBuildReportForSelected() {
  const ui = SpreadsheetApp.getUi();
  const epicKey = getSelectedEpicKey();
  if (!epicKey) {
    ui.alert('Select a row in the "' + SHEETS.EPICS + '" sheet first (click a cell on that row).');
    return;
  }
  try {
    buildReportForEpic_(epicKey);
    ui.alert('Report built for ' + epicKey + '. See the "' + SHEETS.REPORT + '" tab.');
  } catch (e) {
    ui.alert('Failed to build report for ' + epicKey + ':\n' + e.message);
  }
}

function menuRebuildReport() {
  rebuildReport();
  SpreadsheetApp.getUi().alert('Report rebuilt from current Stories/Events tabs.');
}

/**
 * Core pipeline: children -> calendar events -> sheets -> report.
 * @param {string} epicKey
 */
function buildReportForEpic_(epicKey) {
  const cfg = readConfig();

  const children = getChildrenOfEpic(epicKey, cfg.includeSubtasks);
  if (children.length > WARN_STORY_COUNT) {
    const ui = SpreadsheetApp.getUi();
    const resp = ui.alert(
      'Large result',
      'Epic ' + epicKey + ' has ' + children.length + ' children. This may hit script time limits. Continue?',
      ui.ButtonSet.YES_NO
    );
    if (resp !== ui.Button.YES) return;
  }
  writeStories(epicKey, children);

  const now = new Date();
  const windowStart = new Date(now.getTime() - cfg.lookbackDays * 24 * 3600 * 1000);
  const windowEnd = new Date(now.getTime() + 24 * 3600 * 1000);

  const issueKeys = children.map(function (c) { return c.key; });

  const events = findEventsForIssueKeys(
    issueKeys,
    cfg.calendarIds,
    windowStart,
    windowEnd,
    cfg.issueKeyRegex,
    cfg.allDayHours
  );

  writeEvents(epicKey, events);
  rebuildReport();
}
