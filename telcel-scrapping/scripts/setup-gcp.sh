#!/bin/bash

# Google Cloud Platform automated setup script
# This script sets up all required GCP resources for the Tel Cel Data Monitor

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Function to print colored output
print_info() {
    echo -e "${GREEN}[INFO]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

# Check if gcloud is installed
if ! command -v gcloud &> /dev/null; then
    print_error "gcloud CLI is not installed. Please install it first."
    exit 1
fi

# Get project ID
PROJECT_ID=${GCP_PROJECT_ID:-$(gcloud config get-value project)}

if [ -z "$PROJECT_ID" ]; then
    print_error "GCP_PROJECT_ID not set. Please set it and try again."
    exit 1
fi

print_info "Using GCP Project: $PROJECT_ID"

# Set the project
gcloud config set project $PROJECT_ID

# Step 1: Enable APIs
print_info "Enabling required APIs..."
gcloud services enable cloudfunctions.googleapis.com
gcloud services enable cloudscheduler.googleapis.com
gcloud services enable secretmanager.googleapis.com
gcloud services enable cloudbuild.googleapis.com
gcloud services enable logging.googleapis.com
print_info "APIs enabled successfully"

# Step 2: Create secrets
print_info "Setting up secrets..."
print_warning "You'll be prompted to enter your credentials"

read -p "Enter Tel Cel username/email: " TELCEL_USERNAME
read -sp "Enter Tel Cel password: " TELCEL_PASSWORD
echo
read -p "Enter Gmail sender email: " GMAIL_SENDER_EMAIL
read -sp "Enter Gmail app password: " GMAIL_APP_PASSWORD
echo
read -p "Enter recipient email: " RECIPIENT_EMAIL

# Create secrets
echo -n "$TELCEL_USERNAME" | gcloud secrets create telcel_username --data-file=- --replication-policy="automatic" 2>/dev/null || \
    (echo -n "$TELCEL_USERNAME" | gcloud secrets versions add telcel_username --data-file=-)

echo -n "$TELCEL_PASSWORD" | gcloud secrets create telcel_password --data-file=- --replication-policy="automatic" 2>/dev/null || \
    (echo -n "$TELCEL_PASSWORD" | gcloud secrets versions add telcel_password --data-file=-)

echo -n "$GMAIL_SENDER_EMAIL" | gcloud secrets create gmail_sender_email --data-file=- --replication-policy="automatic" 2>/dev/null || \
    (echo -n "$GMAIL_SENDER_EMAIL" | gcloud secrets versions add gmail_sender_email --data-file=-)

echo -n "$GMAIL_APP_PASSWORD" | gcloud secrets create gmail_app_password --data-file=- --replication-policy="automatic" 2>/dev/null || \
    (echo -n "$GMAIL_APP_PASSWORD" | gcloud secrets versions add gmail_app_password --data-file=-)

echo -n "$RECIPIENT_EMAIL" | gcloud secrets create recipient_email --data-file=- --replication-policy="automatic" 2>/dev/null || \
    (echo -n "$RECIPIENT_EMAIL" | gcloud secrets versions add recipient_email --data-file=-)

print_info "Secrets created successfully"

# Step 3: Create service account
print_info "Creating service account..."
gcloud iam service-accounts create telcel-monitor \
  --display-name "Tel Cel Data Monitor Service Account" 2>/dev/null || \
  print_warning "Service account telcel-monitor already exists"

# Step 4: Grant roles to service account
print_info "Granting IAM roles to service account..."
gcloud projects add-iam-policy-binding $PROJECT_ID \
  --member="serviceAccount:telcel-monitor@$PROJECT_ID.iam.gserviceaccount.com" \
  --role="roles/secretmanager.secretAccessor" \
  --quiet

gcloud projects add-iam-policy-binding $PROJECT_ID \
  --member="serviceAccount:telcel-monitor@$PROJECT_ID.iam.gserviceaccount.com" \
  --role="roles/logging.logWriter" \
  --quiet

print_info "IAM roles granted successfully"

print_info "Setup complete! Next steps:"
echo "1. Run: npm install"
echo "2. Run: npm run build"
echo "3. Review config/gcloud-setup.md for deployment instructions"
echo "4. Run the deployment command to deploy the Cloud Function"
