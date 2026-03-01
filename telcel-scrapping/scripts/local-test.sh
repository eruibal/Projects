#!/bin/bash

# Local testing script for Tel Cel Data Monitor

set -e

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

# Check if .env file exists
if [ ! -f ".env" ]; then
  print_error ".env file not found. Please create it from .env.example"
  print_info "cp .env.example .env"
  exit 1
fi

# Check if node_modules exists
if [ ! -d "node_modules" ]; then
  print_info "Installing dependencies..."
  npm install
fi

# Check if dist exists, if not build
if [ ! -d "dist" ]; then
  print_info "Building TypeScript..."
  npm run build
fi

print_info "Starting local test server..."
print_warning "Make sure your .env file has valid Tel Cel and Gmail credentials"

# Set environment for local testing
export NODE_ENV=development
export SECRET_MANAGER_ENABLED=false
export PLAYWRIGHT_HEADLESS=true

print_info "Running TypeScript in development mode..."
npx ts-node src/index.ts &

sleep 2

print_info "Function is running. You can test it with:"
echo ""
echo "curl -X POST http://localhost:3000/checkTelcelUsage"
echo ""
print_warning "Press Ctrl+C to stop the server"

wait
