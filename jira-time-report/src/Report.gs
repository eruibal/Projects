/**
 * Report.gs
 *
 * Writes the Stories, Events and Report tabs. Reporting roll-ups use
 * SUMIF formulas against the Events tab so the user can tweak hours manually
 * and see totals update.
 */

const SHEETS = {
  STORIES: 'Stories',
  EVENTS: 'Events',
  REPORT: 'Report',
};

const STORIES_HEADERS = ['Epic Key', 'Key', 'Summary', 'Type', 'Status', 'URL'];
const EVENTS_HEADERS = [
  'Epic Key',
  'Story Key',
  'Calendar ID',
  'Event Title',
  'Start',
  'End',
  'Hours',
  'All-day',
  'Event Link',
  'Event ID',
];
const REPORT_HEADERS = ['Epic Key', 'Story Key', 'Summary', 'Type', 'Status', 'Hours', 'Events'];

function ensureSheet_(name, headers) {
  const ss = SpreadsheetApp.getActive();
  let sheet = ss.getSheetByName(name);
  if (!sheet) {
    sheet = ss.insertSheet(name);
  }
  if (sheet.getLastRow() === 0 || sheet.getLastColumn() === 0) {
    sheet.getRange(1, 1, 1, headers.length).setValues([headers]).setFontWeight('bold');
    sheet.setFrozenRows(1);
  } else {
    const firstRow = sheet.getRange(1, 1, 1, headers.length).getValues()[0];
    const mismatch = headers.some(function (h, i) { return firstRow[i] !== h; });
    if (mismatch) {
      sheet.getRange(1, 1, 1, headers.length).setValues([headers]).setFontWeight('bold');
      sheet.setFrozenRows(1);
    }
  }
  return sheet;
}

function clearSheetBody_(sheet) {
  const last = sheet.getLastRow();
  if (last > 1) {
    sheet.getRange(2, 1, last - 1, sheet.getLastColumn()).clearContent();
  }
}

/**
 * @param {string} epicKey
 * @param {{key,summary,status,issuetype,url}[]} stories
 */
function writeStories(epicKey, stories) {
  const sheet = ensureSheet_(SHEETS.STORIES, STORIES_HEADERS);
  const existing = sheet.getLastRow() > 1
    ? sheet.getRange(2, 1, sheet.getLastRow() - 1, STORIES_HEADERS.length).getValues()
    : [];
  const kept = existing.filter(function (r) { return r[0] && r[0] !== epicKey; });
  const fresh = stories.map(function (s) {
    return [epicKey, s.key, s.summary, s.issuetype, s.status, s.url];
  });
  const all = kept.concat(fresh);
  clearSheetBody_(sheet);
  if (all.length) {
    sheet.getRange(2, 1, all.length, STORIES_HEADERS.length).setValues(all);
  }
}

/**
 * @param {string} epicKey
 * @param {Array} events from CalendarClient.findEventsForIssueKeys
 */
function writeEvents(epicKey, events) {
  const sheet = ensureSheet_(SHEETS.EVENTS, EVENTS_HEADERS);
  const existing = sheet.getLastRow() > 1
    ? sheet.getRange(2, 1, sheet.getLastRow() - 1, EVENTS_HEADERS.length).getValues()
    : [];
  const kept = existing.filter(function (r) { return r[0] && r[0] !== epicKey; });
  const fresh = events.map(function (e) {
    return [
      epicKey,
      e.issueKey,
      e.calendarId,
      e.title,
      e.start,
      e.end,
      e.hours,
      e.allDay ? 'yes' : 'no',
      e.htmlLink,
      e.eventId,
    ];
  });
  const all = kept.concat(fresh);
  clearSheetBody_(sheet);
  if (all.length) {
    sheet.getRange(2, 1, all.length, EVENTS_HEADERS.length).setValues(all);
    sheet.getRange(2, 5, all.length, 2).setNumberFormat('yyyy-mm-dd hh:mm');
    sheet.getRange(2, 7, all.length, 1).setNumberFormat('0.00');
  }
}

/**
 * Rebuild the Report tab across ALL Epics currently listed in Stories.
 * Uses SUMIF / COUNTIF against the Events tab so edits to hours stay live.
 */
function rebuildReport() {
  const ss = SpreadsheetApp.getActive();
  const storiesSheet = ensureSheet_(SHEETS.STORIES, STORIES_HEADERS);
  const reportSheet = ensureSheet_(SHEETS.REPORT, REPORT_HEADERS);

  clearSheetBody_(reportSheet);

  const storyRows = storiesSheet.getLastRow() > 1
    ? storiesSheet.getRange(2, 1, storiesSheet.getLastRow() - 1, STORIES_HEADERS.length).getValues()
    : [];
  if (!storyRows.length) return;

  const outRows = storyRows.map(function (r) {
    const epicKey = r[0];
    const storyKey = r[1];
    const summary = r[2];
    const type = r[3];
    const status = r[4];
    const hoursFormula = '=IFERROR(SUMIFS(' + SHEETS.EVENTS + '!G:G,' + SHEETS.EVENTS + '!A:A,"' + epicKey + '",' + SHEETS.EVENTS + '!B:B,"' + storyKey + '"),0)';
    const eventsFormula = '=IFERROR(COUNTIFS(' + SHEETS.EVENTS + '!A:A,"' + epicKey + '",' + SHEETS.EVENTS + '!B:B,"' + storyKey + '"),0)';
    return [epicKey, storyKey, summary, type, status, hoursFormula, eventsFormula];
  });

  reportSheet.getRange(2, 1, outRows.length, REPORT_HEADERS.length).setValues(outRows);
  reportSheet.getRange(2, 6, outRows.length, 1).setNumberFormat('0.00');

  const totalRow = outRows.length + 2;
  reportSheet.getRange(totalRow, 1).setValue('TOTAL').setFontWeight('bold');
  reportSheet.getRange(totalRow, 6)
    .setFormula('=SUM(F2:F' + (totalRow - 1) + ')')
    .setFontWeight('bold')
    .setNumberFormat('0.00');
  reportSheet.getRange(totalRow, 7)
    .setFormula('=SUM(G2:G' + (totalRow - 1) + ')')
    .setFontWeight('bold');
}
