# Google Sheets to Jira Integration

This repository contains a Google Apps Script to create Jira issues directly from a Google Sheet row.

## Features
- **Menu Integration**: Adds a custom "Jira Integration" menu to your Google Sheet.
- **Row-based creation**: Prompts for a row number to process.
- **Data Mapping**: Reads Summary (A), Issue Type (B), Priority (C), and Description (D).
- **Auto-Transition**: Automatically attempts to move the issue to "Selected for Development".

## Setup Instructions

### 1. Create a Google Sheet
Create a new Google Sheet or use an existing one. Ensure it has the following headers (optional but recommended):
| Row | A | B | C | D |
|---|---|---|---|---|
| **Header** | Summary | Issue Type | Priority | Description |
| **Data** | Fix login bug | Bug | High | Login fails with 500 error |

### 2. Open Script Editor
1. In your Google Sheet, go to `Extensions` > `Apps Script`.
2. Rename the project to "Jira Integration" (top left).
3. **Delete** any default code in `Code.gs`.
4. Copy the content of [Code.gs](./Code.gs) from this repository and paste it into the editor's `Code.gs` file.
5. **Create a new HTML file**:
   - Click the plus (+) icon next to Files > HTML.
   - Name it `Page` (it will become `Page.html`).
   - Copy the content of [Page.html](./Page.html) and paste it into this new file.

### 3. Configure API Credentials
For security, we use **Script Properties** instead of hardcoding credentials.

1. In the Apps Script editor, click on **Project Settings** (gear icon on the left).
2. Scroll down to **Script Properties**.
3. Click **Add script property** for each of the following:

| Property | Value |
|---|---|
| `JIRA_URL` | Your Jira instance URL (e.g., `https://your-company.atlassian.net`). No trailing slash. |
| `JIRA_EMAIL` | The email address you use to log in to Jira. |
| `JIRA_API_TOKEN` | Your Jira API Token. [Create one here](https://id.atlassian.com/manage-profile/security/api-tokens). |
| `JIRA_PROJECT_KEY` | The Key of the Jira project where issues will be created (e.g., `KAN`, `PROJ`). |

### 4. Run the Script
1. Refresh your Google Sheet.
2. You should see a new menu item: `Jira Integration`.
3. Select a row with data.
4. Click `Jira Integration` > `Create Jira Issue from Row`.
5. Enter the row number (e.g., `2`).
6. Grant permissions when prompted (first time only).

## Troubleshooting
- **Error: "Summary is required"**: Ensure Column A is not empty for the selected row.
- **401 Unauthorized**: Check your `JIRA_EMAIL` and `JIRA_API_TOKEN`.
- **400 Bad Request**: Check if `JIRA_PROJECT_KEY` is correct or if the Issue Type exists in your project.
