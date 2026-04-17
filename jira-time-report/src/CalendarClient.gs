/**
 * CalendarClient.gs
 *
 * Uses the Advanced Calendar Service (Calendar.Events.list) to find events
 * whose title or description references a Jira issue key. Post-filters with
 * a word-boundary regex so `q`'s fuzzy match does not produce false positives.
 */

/**
 * Find events referencing any of the given issue keys across the given calendars.
 *
 * @param {string[]} issueKeys e.g. ["ABC-1", "ABC-2"]
 * @param {string[]} calendarIds e.g. ["primary", "team@group.calendar.google.com"]
 * @param {Date} timeMin
 * @param {Date} timeMax
 * @param {RegExp} issueKeyRegex global regex for issue-key detection
 * @param {number} allDayHours hours counted per all-day event (0 to skip)
 * @return {Array<{issueKey:string,eventId:string,calendarId:string,title:string,description:string,start:Date,end:Date,hours:number,allDay:boolean,htmlLink:string}>}
 */
function findEventsForIssueKeys(issueKeys, calendarIds, timeMin, timeMax, issueKeyRegex, allDayHours) {
  if (!issueKeys || !issueKeys.length) return [];
  if (!calendarIds || !calendarIds.length) return [];

  const keySet = {};
  issueKeys.forEach(function (k) { keySet[k.toUpperCase()] = true; });

  const seen = {};
  const results = [];

  for (let c = 0; c < calendarIds.length; c++) {
    const calendarId = calendarIds[c];
    for (let k = 0; k < issueKeys.length; k++) {
      const issueKey = issueKeys[k];
      const events = listEventsByQuery_(calendarId, issueKey, timeMin, timeMax);
      for (let e = 0; e < events.length; e++) {
        const ev = events[e];
        const dedupeKey = calendarId + '|' + ev.id + '|' + issueKey;
        if (seen[dedupeKey]) continue;

        const text = ((ev.summary || '') + ' ' + (ev.description || '')).toUpperCase();
        const matches = extractIssueKeys_(text, issueKeyRegex);
        if (matches.indexOf(issueKey.toUpperCase()) === -1) continue;

        seen[dedupeKey] = true;

        const times = resolveEventTimes_(ev);
        if (!times) continue;
        if (times.allDay && (!allDayHours || allDayHours <= 0)) continue;

        const hours = times.allDay
          ? Number(allDayHours)
          : (times.end.getTime() - times.start.getTime()) / 3600000;

        results.push({
          issueKey: issueKey,
          eventId: ev.id,
          calendarId: calendarId,
          title: ev.summary || '',
          description: ev.description || '',
          start: times.start,
          end: times.end,
          hours: hours,
          allDay: times.allDay,
          htmlLink: ev.htmlLink || '',
        });
      }
    }
  }

  return results;
}

function listEventsByQuery_(calendarId, query, timeMin, timeMax) {
  const out = [];
  let pageToken = null;
  do {
    const params = {
      timeMin: timeMin.toISOString(),
      timeMax: timeMax.toISOString(),
      q: query,
      singleEvents: true,
      orderBy: 'startTime',
      maxResults: 250,
    };
    if (pageToken) params.pageToken = pageToken;
    const resp = Calendar.Events.list(calendarId, params);
    const items = resp.items || [];
    for (let i = 0; i < items.length; i++) out.push(items[i]);
    pageToken = resp.nextPageToken;
  } while (pageToken);
  return out;
}

function extractIssueKeys_(text, issueKeyRegex) {
  const regex = new RegExp(issueKeyRegex.source, 'g');
  const found = {};
  let m;
  while ((m = regex.exec(text)) !== null) {
    found[m[0].toUpperCase()] = true;
  }
  return Object.keys(found);
}

function resolveEventTimes_(ev) {
  if (!ev.start || !ev.end) return null;
  if (ev.start.date && !ev.start.dateTime) {
    return {
      start: new Date(ev.start.date + 'T00:00:00Z'),
      end: new Date(ev.end.date + 'T00:00:00Z'),
      allDay: true,
    };
  }
  if (ev.start.dateTime && ev.end.dateTime) {
    return {
      start: new Date(ev.start.dateTime),
      end: new Date(ev.end.dateTime),
      allDay: false,
    };
  }
  return null;
}
