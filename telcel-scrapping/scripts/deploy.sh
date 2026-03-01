#!/bin/bash

# Deployment script for Tel Cel Data Monitor to Google Cloud Functions

set -e

# Colors for output
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m'

print_info() {
  echo -e "${GREEN}[INFO]${NC} $1"
}

print_error() {
  echo -e "${RED}[ERROR]${NC} $1"
}

print_warning() {
  echo -e "${YELLOW}[WARNING]${NC} $1"
}

# Check if in correct directory
if [ ! -f "package.json" ]; then
  print_error "package.json not found. Please run this script from the project root."
  exit 1
fi

# Get project ID
PROJECT_ID=${GCP_PROJECT_ID:-$(gcloud config get-value project)}

if [ -z "$PROJECT_ID" ]; then
  print_error "GCP_PROJECT_ID not set. Please set it and try again."
  exit 1
fi

print_info "Deploying to GCP Project: $PROJECT_ID"

# Step 1: Build the project
print_info "Building TypeScript..."
npm run build

# Step 2: Deploy Cloud Function
print_info "Deploying Cloud Function..."

FUNCTION_URL=$(gcloud functions deploy checkTelcelUsage \
  --gen2 \
  --runtime nodejs20 \
  --trigger-http \
  --region us-central1 \
  --entry-point checkTelcelUsage \
  --source . \
  --memory 1GB \
  --timeout 540s \
  --service-account telcel-monitor@$PROJECT_ID.iam.gserviceaccount.com \
  --set-env-vars \
    "LOG_LEVEL=info,PLAYWRIGHT_HEADLESS=true,SCREENSHOT_ON_ERROR=false,GCP_PROJECT_ID=$PROJECT_ID,SECRET_MANAGER_ENABLED=true" \
  --quiet \
  --format="value(serviceConfig.uri)")

print_info "Cloud Function deployed successfully!"
print_info "Function URL: $FUNCTION_URL"

# Step 3: Test the function
print_info "Testing the function..."
RESPONSE=$(curl -s -X POST "$FUNCTION_URL" \
  -H "Content-Type: application/json" \
  -w "\n%{http_code}")

HTTP_CODE=$(echo "$RESPONSE" | tail -n1)
BODY=$(echo "$RESPONSE" | head -n-1)

if [ "$HTTP_CODE" = "200" ]; then
  print_info "Function test successful!"
  echo "$BODY" | jq .
else
  print_warning "Function returned HTTP $HTTP_CODE"
  echo "$BODY" | jq . || echo "$BODY"
fi

# Step 4: Check if Cloud Scheduler job exists and create if needed
print_info "Checking Cloud Scheduler job..."

if gcloud scheduler jobs describe telcel-daily-check --location us-central1 &>/dev/null; then
  print_warning "Cloud Scheduler job already exists"
else
  print_info "Creating Cloud Scheduler job..."
  gcloud scheduler jobs create http telcel-daily-check \
    --location us-central1 \
    --schedule "0 14 * * *" \
    --http-method POST \
    --uri "$FUNCTION_URL" \
    --oidc-service-account-email telcel-monitor@$PROJECT_ID.iam.gserviceaccount.com \
    --quiet
  print_info "Cloud Scheduler job created successfully"
  print_warning "Remember to adjust the schedule time for your timezone!"
fi

print_info "Deployment complete!"
print_info "View logs: gcloud functions logs read checkTelcelUsage --limit=50 --follow"
