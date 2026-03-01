# Tel Cel Data Usage Monitor

Automated Playwright-based script that monitors your Tel Cel internet data usage and sends daily email summaries.

## Features

- 📊 **Automated Monitoring**: Checks your Tel Cel data usage daily
- 📧 **Email Notifications**: Sends formatted HTML emails with usage details
- ☁️ **Cloud Native**: Runs on Google Cloud Functions (serverless, no server to maintain)
- 🔒 **Secure**: Credentials stored in Google Cloud Secret Manager
- 📈 **Usage Analytics**: Tracks usage percentage, remaining data, and plan info
- ⚠️ **Smart Alerts**: Color-coded warnings for high usage (warning at 75%, critical at 90%)
- 🌍 **Reliable**: Auto-retry on email delivery failures

## What You Need

### Before Starting
1. **Google Account**
   - Active Gmail account (for sending reports)
   - GCP account with billing enabled

2. **Tel Cel Account**
   - Tel Cel phone account with portal access
   - Username/email and password for Tel Cel portal

3. **Local Tools**
   - Node.js 20+ ([download](https://nodejs.org/))
   - npm (comes with Node.js)
   - Google Cloud SDK (`gcloud` CLI) ([install guide](https://cloud.google.com/sdk/docs/install))

## Quick Start

### 1. Clone and Setup

```bash
# Navigate to project directory
cd /Users/eruibal/Projects/telcel-scrapping

# Install dependencies
npm install

# Create .env file from template
cp .env.example .env

# Edit .env with your credentials (for local testing only)
# NOTE: Don't commit the .env file!
```

### 2. Get Gmail App Password

Currently, the script uses Gmail with app passwords for security:

1. Go to [Google Account Security](https://myaccount.google.com/security)
2. Enable 2-Step Verification (if not already enabled)
3. Go to "App passwords" (appears after 2FA setup)
4. Select "Mail" and "Windows Computer" (or your device type)
5. Copy the generated 16-character password
6. Add it to your `.env` file as `GMAIL_APP_PASSWORD`

### 3. Configure Google Cloud Platform

```bash
# Set your GCP project ID
export GCP_PROJECT_ID="your-project-id"

# Run the automated setup script
bash scripts/setup-gcp.sh

# Follow the prompts to enter your credentials
```

This script will:
- Enable required GCP APIs
- Create secrets in Secret Manager
- Create a service account with proper permissions

### 4. Deploy to Google Cloud

```bash
# Deploy the Cloud Function
bash scripts/deploy.sh

# The script will create:
# - Cloud Function
# - Cloud Scheduler job (runs daily at 2 PM UTC)
# - Automated email reports
```

### 5. Verify Deployment

```bash
# Check the function status
gcloud functions describe checkTelcelUsage --gen2

# View recent logs
gcloud functions logs read checkTelcelUsage --limit=50 --follow

# Manually trigger a test
curl -X POST $(gcloud functions describe checkTelcelUsage --gen2 --format='value(serviceConfig.uri)')
```

## Local Testing (Without GCP)

For local testing before deploying to GCP:

```bash
# Install dependencies
npm install

# Build TypeScript
npm run build

# Test locally with your .env file
npm run dev
```

## Project Structure

```
.
├── src/
│   ├── index.ts                    # Cloud Functions entry point
│   ├── telcel-scraper.ts           # Playwright portal automation
│   ├── gmail-sender.ts             # Email sending logic
│   ├── data-parser.ts              # Data validation & formatting
│   ├── utils/
│   │   ├── logger.ts               # Logging utility
│   │   ├── error-handler.ts        # Error handling
│   │   ├── secrets-manager.ts      # Secret retrieval
│   │   └── types.ts                # TypeScript types
│   └── templates/
│       └── email-template.html     # Email HTML format
├── config/
│   ├── gcloud-setup.md             # GCP setup guide
│   ├── secrets-setup.md            # Secrets configuration
│   └── deployment-steps.md         # Deployment guide
├── scripts/
│   ├── setup-gcp.sh                # Automated GCP setup
│   ├── deploy.sh                   # Deployment script
│   └── local-test.sh               # Local testing script
├── dist/                           # Compiled JavaScript (generated)
├── package.json                    # Dependencies
├── tsconfig.json                   # TypeScript configuration
└── .env.example                    # Environment variables template
```

## Configuration

### Environment Variables (`.env`)

```env
TELCEL_USERNAME=your_email@example.com
TELCEL_PASSWORD=your_password
GMAIL_SENDER_EMAIL=your_gmail@gmail.com
GMAIL_APP_PASSWORD=xxxx xxxx xxxx xxxx
RECIPIENT_EMAIL=recipient@example.com
GCP_PROJECT_ID=your-gcp-project-id
LOG_LEVEL=info
PLAYWRIGHT_HEADLESS=true
SCREENSHOT_ON_ERROR=false
```

### Adjusting Daily Schedule

The default schedule runs at 2 PM UTC daily. To change the time:

```bash
# Update the Cloud Scheduler job
gcloud scheduler jobs update telcel-daily-check \
  --location us-central1 \
  --schedule "0 20 * * *"  # Changed to 8 PM UTC
```

Common time zones:
- Mexico (CST): `20 14 * * *` (8 PM CST = 2 AM UTC next day, or adjust for CDT)
- US Eastern: `20 14 * * *` (8 PM EST) or `19 14 * * *` (7 PM EDT)
- US Pacific: `23 14 * * *` (11 PM PST) or `22 14 * * *` (10 PM PDT)

## Monitoring & Logs

### View Logs

```bash
# Real-time logs
gcloud functions logs read checkTelcelUsage --limit=100 --follow

# Logs for specific date
gcloud logging read "resource.type=cloud_function AND resource.labels.function_name=checkTelcelUsage" \
  --limit=50 \
  --format json

# Logs with error filter
gcloud logging read "resource.type=cloud_function AND resource.labels.function_name=checkTelcelUsage AND severity=ERROR" \
  --limit=50
```

### Troubleshooting

| Issue | Cause | Solution |
|-------|-------|----------|
| Function times out | Tel Cel portal is slow | Increase timeout in scripts/deploy.sh |
| Login fails | Credentials wrong or portal structure changed | Check .env, verify credentials work manually |
| Email not sent | Gmail app password issue | Regenerate app password, verify 2FA enabled |
| Memory errors | Browser using too much memory | Increase function memory to 2GB in deploy.sh |
| Data extraction fails | Portal layout changed | Update CSS selectors in src/telcel-scraper.ts |

## Updating Portal Selectors

If Tel Cel's portal layout changes and data extraction fails:

1. Open the Tel Cel portal manually in your browser
2. Inspect element to find the new CSS selectors for data usage elements
3. Update the selectors in `src/telcel-scraper.ts`

Example:
```typescript
const usageSection = await this.page.locator('[class*="usage"], [class*="consumo"]').first();
```

## Security Best Practices

1. **Never commit `.env` file** - It contains sensitive credentials
2. **Use Gmail App Passwords** - Don't use your actual Gmail password
3. **Secure Secret Manager** - Only service account can access stored secrets
4. **Rotate Credentials** - Update passwords regularly in Secret Manager
5. **Monitor Access** - Review Cloud Logging for unauthorized access attempts

## Costs

**Monthly Estimate:**
- Cloud Functions: $0.40 (1 invocation/day × 30 days, 2-3 min runtime, 1GB memory)
- Cloud Scheduler: $0.10 (1 scheduled job)
- Secret Manager: $6.00 (5-10 secrets)
- Cloud Logging: Free (within free tier)
- **Total: ~$6.50/month**

## Cleaning Up

To remove all resources and stop charges:

```bash
# Delete Cloud Function
gcloud functions delete checkTelcelUsage --gen2

# Delete Cloud Scheduler job
gcloud scheduler jobs delete telcel-daily-check --location us-central1

# Delete secrets
gcloud secrets delete telcel_username
gcloud secrets delete telcel_password
gcloud secrets delete gmail_sender_email
gcloud secrets delete gmail_app_password
gcloud secrets delete recipient_email

# Delete service account
gcloud iam service-accounts delete telcel-monitor@$PROJECT_ID.iam.gserviceaccount.com
```

## Limitations

1. **Portal Changes**: If Tel Cel redesigns their portal, the scraper may need updates
2. **Rate Limiting**: Some portals block automated requests - may need headless detection bypass
3. **CAPTCHA**: If Tel Cel adds CAPTCHA, manual intervention required
4. **Session Management**: Portal sessions may expire, requiring re-authentication

## Development

### Build

```bash
npm run build
```

### Run Locally

```bash
npm run dev
```

### Run Tests (future)

```bash
npm test
```

### Format and Type Check

```bash
npx tsc --noEmit
```

## Support & Troubleshooting

- **GCP Setup Issues**: See `config/gcloud-setup.md`
- **Deployment Issues**: See `config/deployment-steps.md`
- **Scraper Problems**: Check Cloud Logging for detailed error messages
- **Email Issues**: Verify Gmail app password and 2FA settings

## License

MIT

## Disclaimer

This project is for personal use. Ensure you comply with Tel Cel's Terms of Service when using automated tools to access their portal.
