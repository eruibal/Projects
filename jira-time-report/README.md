# Jira Time Report for Google Sheets

A Google Apps Script project, bound to a Google Sheet, that:

1. Pulls the list of **Epics** from Jira Cloud.
2. Lets you pick an Epic and pulls its **child stories** (+ optional sub-tasks).
3. Scans one or more **Google Calendars** for events whose title/description
   references those story keys (typical output of "Issue Events"-style plugins
   that sync Jira issues to Google Calendar).
4. Sums event durations into a per-story / per-Epic **time-accrued report**.

## Repository layout

```
appsscript.json          # Manifest (Calendar Advanced Service + OAuth scopes)
src/Config.gs            # Script Properties + Config sheet bootstrap
src/JiraClient.gs        # Jira Cloud REST v3 wrapper (basic auth, pagination)
src/CalendarClient.gs    # Advanced Calendar Service search + regex filter
src/Report.gs            # Epics / Stories / Events / Report tab writers
src/Main.gs              # Custom menu + orchestration
.clasp.json.example      # Template for pushing via clasp
```

## One-time setup

### 1. Create the Sheet + Apps Script project

Option A: **clasp (recommended)**

```bash
npm install -g @google/clasp
clasp login
# Create a new Sheet-bound script:
clasp create --type sheets --title "Jira Time Report"
# Copy the generated scriptId into .clasp.json (use the example as a template):
cp .clasp.json.example .clasp.json
# Edit .clasp.json and paste the scriptId, then:
clasp push -f
```

Option B: **Copy/paste**

1. Create a new Google Sheet.
2. **Extensions -> Apps Script**.
3. Delete the default `Code.gs` and paste each file from `src/` as a separate
   script file with the same name. Replace `appsscript.json` with the one in
   this repo (enable "Show 'appsscript.json' manifest file" in Apps Script
   settings if hidden).

### 2. Enable the Advanced Calendar Service

In the Apps Script editor, **Services (+)** -> select **Google Calendar API**
-> leave the identifier as `Calendar` -> **Add**. (`appsscript.json` already
declares it, but the editor still requires you to enable the service once.)

### 3. Create a Jira API token

Visit <https://id.atlassian.com/manage-profile/security/api-tokens>, create a
token, and copy it.

### 4. First run in the Sheet

1. Reload the Sheet; a **Jira Time Report** menu appears.
2. **Jira Time Report -> Initialise Config sheet** - creates the `Config` tab.
3. **Jira Time Report -> Set credentials** - prompts for base URL, email and
   API token; they are stored in Script Properties, never in the Sheet.
4. **Jira Time Report -> Test Jira connection** - should show your Jira
   display name.
5. Fill in the `Config` tab:
   - `PROJECT_KEYS` - comma-separated project keys, e.g. `ABC,XYZ`.
   - `EPIC_JQL_OVERRIDE` - optional; if set, overrides `PROJECT_KEYS`.
   - `CALENDAR_IDS` - comma-separated calendar IDs; `primary` = your default
     Google Calendar. Team calendars look like
     `something@group.calendar.google.com`.
   - `LOOKBACK_DAYS` - how far back to search events.
   - `ISSUE_KEY_REGEX` - regex used to confirm an event really references an
     issue key (prevents fuzzy-match false positives).
   - `ALL_DAY_HOURS` - hours credited per all-day event (0 to ignore them).
   - `INCLUDE_SUBTASKS` - `true` / `false`.

## Daily use

1. **Jira Time Report -> Load Epics** - populates the `Epics` tab.
2. Click any cell in the row of the Epic you want to report on.
3. **Jira Time Report -> Build report for selected Epic** - this fetches that
   Epic's children, searches the configured calendars, fills the `Stories`
   and `Events` tabs (data for the selected Epic replaces any stale rows for
   that same Epic; other Epics' data is preserved), and rebuilds the `Report`
   tab.
4. **Jira Time Report -> Rebuild report (all Epics)** - regenerates the
   `Report` tab from whatever is currently in `Stories` + `Events` (useful
   after manual edits to hours).

The `Report` tab uses `SUMIFS`/`COUNTIFS` against the `Events` tab, so if you
adjust an event's `Hours` value in place, the totals update live.

## How events are matched

For each story key `K` on the Epic, the script calls
`Calendar.Events.list(calendarId, { q: K, singleEvents: true, ... })` on each
configured calendar, then post-filters hits with the `ISSUE_KEY_REGEX` against
the event title + description to drop fuzzy-match false positives. Recurring
events are expanded (`singleEvents: true`) so each instance counts once.

If your Jira -> Google Calendar plugin formats event titles differently (e.g.
as `[ABC-123] - Standup` or embeds the key in the description), the default
regex `\b[A-Z][A-Z0-9]+-\d+\b` will still match. Tighten it via the `Config`
tab if you have multiple key prefixes in use and want to restrict to one.

## Security notes

- Jira email + API token are stored via `PropertiesService.getScriptProperties()`
  - they are not visible in any sheet cell and are scoped to this script.
- OAuth scopes requested: Spreadsheets, External requests (for Jira),
  Calendar (read-only), Script App + Container UI (for menus).
- The Sheet never writes to Jira or Calendar - strictly read-only.

## Troubleshooting

- `Calendar is not defined` -> enable the **Google Calendar API** advanced
  service (step 2 above).
- `Jira API 401` -> wrong email/token; re-run **Set credentials**.
- `Jira API 400 JQL` -> check `PROJECT_KEYS` or `EPIC_JQL_OVERRIDE` on the
  `Config` tab.
- Script exceeds 6 minute runtime -> reduce `LOOKBACK_DAYS`, trim
  `CALENDAR_IDS`, or pick Epics with fewer children.

## Out of scope

- Writing hours back to Jira as worklogs.
- OAuth 2.0 / 3LO (uses simple API-token basic auth).
- Standalone web UI - the Sheet itself is the UI.
