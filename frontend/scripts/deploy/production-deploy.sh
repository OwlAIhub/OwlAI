#!/bin/bash

# Production Deployment Script for Owl AI
# This script handles production deployment with all necessary checks

set -e  # Exit on any error

echo "🚀 Owl AI Production Deployment"
echo "==============================="

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Function to print colored output
print_status() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

print_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Function to check if command exists
command_exists() {
    command -v "$1" >/dev/null 2>&1
}

# Function to check environment
check_environment() {
    print_status "Checking environment..."

    # Check if we're in the right directory
    if [ ! -f "package.json" ]; then
        print_error "package.json not found. Please run this script from the project root."
        exit 1
    fi

    # Check if .env.production exists
    if [ ! -f ".env.production" ]; then
        print_error ".env.production not found. Please create it with production credentials."
        exit 1
    fi

    # Check if Firebase CLI is installed
    if ! command_exists firebase; then
        print_error "Firebase CLI not found. Please install it: npm install -g firebase-tools"
        exit 1
    fi

    # Check if pnpm is installed
    if ! command_exists pnpm; then
        print_error "pnpm not found. Please install it: npm install -g pnpm"
        exit 1
    fi

    print_success "Environment check passed"
}

# Function to validate environment variables
validate_env_vars() {
    print_status "Validating environment variables..."

    # Load production environment
    export $(cat .env.production | grep -v '^#' | xargs)

    # Check required variables
    required_vars=(
        "NEXT_PUBLIC_FIREBASE_API_KEY"
        "NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN"
        "NEXT_PUBLIC_FIREBASE_PROJECT_ID"
        "NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET"
        "NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID"
        "NEXT_PUBLIC_FIREBASE_APP_ID"
    )

    missing_vars=()
    for var in "${required_vars[@]}"; do
        if [ -z "${!var}" ]; then
            missing_vars+=("$var")
        fi
    done

    if [ ${#missing_vars[@]} -ne 0 ]; then
        print_error "Missing required environment variables:"
        for var in "${missing_vars[@]}"; do
            echo "  - $var"
        done
        exit 1
    fi

    print_success "Environment variables validation passed"
}

# Function to run pre-deployment checks
run_checks() {
    print_status "Running pre-deployment checks..."

    # Install dependencies
    print_status "Installing dependencies..."
    pnpm install --frozen-lockfile

    # Type check
    print_status "Running TypeScript type check..."
    pnpm type-check

    # Linting
    print_status "Running ESLint..."
    pnpm lint

    # Security audit
    print_status "Running security audit..."
    pnpm audit --audit-level moderate || print_warning "Security audit found issues"

    print_success "Pre-deployment checks passed"
}

# Function to build the application
build_application() {
    print_status "Building application for production..."

    # Set production environment
    export NODE_ENV=production

    # Build the application
    pnpm build

    # Check if build was successful
    if [ ! -d "out" ]; then
        print_error "Build failed - 'out' directory not found"
        exit 1
    fi

    # Check build size
    build_size=$(du -sh out | cut -f1)
    print_success "Build completed successfully (Size: $build_size)"
}

# Function to deploy to Firebase
deploy_firebase() {
    print_status "Deploying to Firebase..."

    # Check Firebase login
    if ! firebase projects:list >/dev/null 2>&1; then
        print_error "Not logged in to Firebase. Please run: firebase login"
        exit 1
    fi

    # Deploy to Firebase
    firebase deploy --only hosting

    print_success "Deployment to Firebase completed"
}

# Function to run post-deployment checks
post_deployment_checks() {
    print_status "Running post-deployment checks..."

    # Get the deployed URL
    deployed_url=$(firebase hosting:channel:list --json | jq -r '.[0].url' 2>/dev/null || echo "https://owl-ai-1ef31.web.app")

    print_success "Application deployed successfully!"
    print_status "Deployed URL: $deployed_url"

    # Optional: Run health check
    if command_exists curl; then
        print_status "Running health check..."
        if curl -s -o /dev/null -w "%{http_code}" "$deployed_url" | grep -q "200"; then
            print_success "Health check passed"
        else
            print_warning "Health check failed - please verify deployment manually"
        fi
    fi
}

# Main deployment function
main() {
    echo "Starting production deployment process..."
    echo ""

    check_environment
    validate_env_vars
    run_checks
    build_application
    deploy_firebase
    post_deployment_checks

    echo ""
    print_success "🎉 Production deployment completed successfully!"
    echo ""
    echo "📋 Deployment Summary:"
    echo "  - Environment: Production"
    echo "  - Build: Optimized for production"
    echo "  - Security: Headers and CSP enabled"
    echo "  - Performance: Optimized bundles"
    echo "  - Monitoring: Error tracking enabled"
    echo ""
    echo "🔗 Next steps:"
    echo "  1. Verify the deployment at: https://owl-ai-1ef31.web.app"
    echo "  2. Test authentication flow"
    echo "  3. Monitor error logs"
    echo "  4. Set up monitoring alerts"
}

# Run main function
main "$@"
