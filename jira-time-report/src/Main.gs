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
    .addItem('Build report...', 'menuOpenEpicPicker')
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

function menuOpenEpicPicker() {
  const html = HtmlService.createHtmlOutputFromFile('EpicPicker')
    .setWidth(460)
    .setHeight(260);
  SpreadsheetApp.getUi().showModalDialog(html, 'Build Jira time report');
}

function menuRebuildReport() {
  rebuildReport();
  SpreadsheetApp.getUi().alert('Report rebuilt from current Stories/Events tabs.');
}

/**
 * Called from EpicPicker.html to populate the dropdown.
 * @return {{key:string, summary:string, status:string, url:string}[]}
 */
function listEpicsForPicker() {
  const cfg = readConfig();
  return getEpics(cfg.projectKeys, cfg.epicJqlOverride);
}

/**
 * Called from EpicPicker.html when the user clicks Build report.
 * @param {string} epicKey
 * @return {{ok:boolean, epicKey:string, storyCount:number}}
 */
function buildReportForEpicFromDialog(epicKey) {
  if (!epicKey) throw new Error('No Epic selected.');
  const storyCount = buildReportForEpic_(epicKey);
  return { ok: true, epicKey: epicKey, storyCount: storyCount };
}

/**
 * Core pipeline: children -> calendar events -> sheets -> report.
 * @param {string} epicKey
 * @return {number} number of child issues processed
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
    if (resp !== ui.Button.YES) return 0;
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
  return children.length;
}
