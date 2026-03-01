# Google Cloud Platform Setup Guide

## Prerequisites

- Google Cloud Platform account
- `gcloud` CLI installed and configured
- A GCP project (create one if needed)

## Step 1: Enable Required APIs

```bash
# Set your project ID
export PROJECT_ID="your-gcp-project-id"
gcloud config set project $PROJECT_ID

# Enable required APIs
gcloud services enable cloudfunctions.googleapis.com
gcloud services enable cloudscheduler.googleapis.com
gcloud services enable secretmanager.googleapis.com
gcloud services enable cloudbuild.googleapis.com
gcloud services enable logging.googleapis.com
```

## Step 2: Create Secret Manager Secrets

Store your sensitive credentials in Google Cloud Secret Manager:

```bash
# Create secrets for each credential
echo -n "your_telcel_email_or_username" | gcloud secrets create telcel_username --data-file=-
echo -n "your_telcel_password" | gcloud secrets create telcel_password --data-file=-
echo -n "your_gmail@gmail.com" | gcloud secrets create gmail_sender_email --data-file=-
echo -n "your_gmail_app_password" | gcloud secrets create gmail_app_password --data-file=-
echo -n "recipient_email@example.com" | gcloud secrets create recipient_email --data-file=-
```

### How to Generate Gmail App Password

1. Go to https://myaccount.google.com/security
2. Enable 2-Step Verification if not already enabled
3. Go to App passwords (at the bottom of the 2-Step Verification section)
4. Select Mail and Windows Computer (or your device type)
5. Copy the generated password and use it for `gmail_app_password`

## Step 3: Create Service Account

```bash
# Create service account
gcloud iam service-accounts create telcel-monitor \
  --display-name "Tel Cel Data Monitor Service Account"

# Grant necessary roles
gcloud projects add-iam-policy-binding $PROJECT_ID \
  --member="serviceAccount:telcel-monitor@$PROJECT_ID.iam.gserviceaccount.com" \
  --role="roles/secretmanager.secretAccessor"

gcloud projects add-iam-policy-binding $PROJECT_ID \
  --member="serviceAccount:telcel-monitor@$PROJECT_ID.iam.gserviceaccount.com" \
  --role="roles/cloudfunctions.developer"

gcloud projects add-iam-policy-binding $PROJECT_ID \
  --member="serviceAccount:telcel-monitor@$PROJECT_ID.iam.gserviceaccount.com" \
  --role="roles/logging.logWriter"
```

## Step 4: Deploy Cloud Function

```bash
# From project root directory
gcloud functions deploy checkTelcelUsage \
  --runtime nodejs20 \
  --trigger-http \
  --allow-unauthenticated \
  --memory 1GB \
  --timeout 540s \
  --source . \
  --entry-point checkTelcelUsage \
  --service-account telcel-monitor@$PROJECT_ID.iam.gserviceaccount.com \
  --set-env-vars \
    "LOG_LEVEL=info,\
PLAYWRIGHT_HEADLESS=true,\
SCREENSHOT_ON_ERROR=false,\
GCP_PROJECT_ID=$PROJECT_ID,\
SECRET_MANAGER_ENABLED=true"
```

## Step 5: Test the Function

```bash
# Get the function URL
FUNCTION_URL=$(gcloud functions describe checkTelcelUsage --gen2 --format='value(serviceConfig.uri)')

# Test by triggering it
curl -X POST $FUNCTION_URL
```

## Step 6: Create Cloud Scheduler Job

```bash
# Create scheduler job to run daily at 2 PM (14:00 UTC)
gcloud scheduler jobs create http telcel-daily-check \
  --location us-central1 \
  --schedule "0 14 * * *" \
  --http-method POST \
  --uri $FUNCTION_URL \
  --oidc-service-account-email telcel-monitor@$PROJECT_ID.iam.gserviceaccount.com

# Note: If you're not in UTC, adjust the schedule time
# For example, for Mexico City (CST/CDT):
# During standard time: 19:00 or 20:00 UTC (depending on UTC offset)
```

### Adjust Schedule for Your Timezone

- Find your timezone offset from UTC
- Add that offset to 14:00 (2 PM)
- Example: If you're UTC-6 (Central Standard Time), use `20 14 * * *` which is 8 PM your time

## Step 7: Optional - Set Up Logging Alerts

Create an alert if the function fails:

```bash
# Create alert policy
gcloud alpha monitoring policies create \
  --notification-channels=CHANNEL_ID \
  --display-name="Tel Cel Function Failures" \
  --condition-display-name="Error rate above 0" \
  --condition-threshold-filter 'resource.type="cloud_function" AND resource.labels.function_name="checkTelcelUsage" AND severity="ERROR"'
```

## Monitoring and Debugging

### View Logs

```bash
# View real-time logs
gcloud functions logs read checkTelcelUsage --limit=50 --follow

# View logs for specific date range
gcloud functions logs read checkTelcelUsage \
  --limit=100 \
  --gen2 \
  --start-time='2024-01-15T00:00:00Z' \
  --end-time='2024-01-16T00:00:00Z'
```

### Check Function Status

```bash
# List all versions
gcloud functions describe checkTelcelUsage --gen2

# Check recent executions
gcloud logging read "resource.type=cloud_function AND resource.labels.function_name=checkTelcelUsage" \
  --limit 20 \
  --format json | jq '.[] | "\(.timestamp): \(.jsonPayload.message // .message)"'
```

## Troubleshooting

### Function Timeout Issues

If the function times out, it's likely due to slow portal navigation. Solutions:

1. Increase timeout: Use `--timeout 900` for up to 15 minutes
2. Optimize selectors in `telcel-scraper.ts`
3. Check if Tel Cel portal structure has changed

### Login Failures

If login fails:

1. Check credentials in Secret Manager are correct
2. Verify Playwright can access Tel Cel website from GCP region
3. Look for CAPTCHA or security challenges
4. Check Cloud Logging for error details

### Email Not Sending

If emails aren't being delivered:

1. Verify Gmail app password is correct
2. Check if 2-Step Verification is enabled on Gmail account
3. Verify recipient email in Secret Manager
4. Check Gmail's Less Secure App Access settings if app password isn't working
5. Look for email delivery errors in logs

### Out of Memory

If getting memory errors:

1. Increase function memory: `--memory 2GB`
2. Optimize browser operations in scraper
3. Close browser properly after each operation

## Cost Optimization

- Cloud Functions: ~$0.40/month for daily invocation
- Cloud Scheduler: ~$0.10/month for one job
- Secret Manager: ~$6/month for standard secrets
- Logging: Free tier usually sufficient
- **Total**: ~$6.50/month

## Cleanup

To remove all resources:

```bash
# Delete Cloud Function
gcloud functions delete checkTelcelUsage

# Delete Cloud Scheduler job
gcloud scheduler jobs delete telcel-daily-check --location us-central1

# Delete service account
gcloud iam service-accounts delete telcel-monitor@$PROJECT_ID.iam.gserviceaccount.com

# Delete secrets
gcloud secrets delete telcel_username
gcloud secrets delete telcel_password
gcloud secrets delete gmail_sender_email
gcloud secrets delete gmail_app_password
gcloud secrets delete recipient_email
```
