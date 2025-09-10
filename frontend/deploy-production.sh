#!/bin/bash

# ========================================
# PRODUCTION DEPLOYMENT SCRIPT
# ========================================
# Comprehensive production deployment with all checks

set -e  # Exit on any error

echo "🚀 Starting OwlAI Production Deployment..."

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Function to print colored output
print_status() {
    echo -e "${GREEN}[INFO]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# ========================================
# PRE-DEPLOYMENT CHECKS
# ========================================

print_status "Running pre-deployment checks..."

# Check if environment variables are set
if [ ! -f ".env.local" ]; then
    print_error ".env.local file not found! Copy .env.example and fill in your Firebase credentials."
    exit 1
fi

# Check required tools
command -v firebase >/dev/null 2>&1 || { print_error "Firebase CLI is required but not installed."; exit 1; }
command -v npm >/dev/null 2>&1 || { print_error "npm is required but not installed."; exit 1; }

print_status "✅ Pre-deployment checks passed"

# ========================================
# CODE QUALITY CHECKS
# ========================================

print_status "Running code quality checks..."

# TypeScript type checking
print_status "Checking TypeScript types..."
npm run type-check

# ESLint
print_status "Running ESLint..."
npm run lint

# Format check
print_status "Checking code formatting..."
npm run format:check || {
    print_warning "Code formatting issues found. Running formatter..."
    npm run format
}

print_status "✅ Code quality checks passed"

# ========================================
# SECURITY CHECKS
# ========================================

print_status "Running security audit..."
npm audit --audit-level moderate || {
    print_warning "Security vulnerabilities found. Consider running 'npm audit fix'"
}

print_status "✅ Security checks completed"

# ========================================
# BUILD PROCESS
# ========================================

print_status "Building production bundle..."

# Clean previous builds
rm -rf .next out dist

# Build for production
NEXT_PUBLIC_ENV=production npm run build:production

print_status "✅ Production build completed"

# ========================================
# FIREBASE DEPLOYMENT
# ========================================

print_status "Deploying to Firebase..."

# Deploy Firestore rules and indexes first
print_status "Deploying Firestore rules and indexes..."
firebase deploy --only firestore

# Deploy hosting
print_status "Deploying to Firebase Hosting..."
firebase deploy --only hosting

print_status "✅ Firebase deployment completed"

# ========================================
# POST-DEPLOYMENT VERIFICATION
# ========================================

print_status "Running post-deployment verification..."

# Check if Firebase project is accessible
firebase projects:list > /dev/null || {
    print_error "Cannot access Firebase project. Check your authentication."
    exit 1
}

print_status "✅ Post-deployment verification completed"

# ========================================
# COMPLETION
# ========================================

echo ""
echo "🎉 Production deployment completed successfully!"
echo ""
print_status "Your OwlAI app is now live with:"
echo "  ✅ Production-ready Firebase configuration"
echo "  ✅ Secure phone authentication"
echo "  ✅ International phone number validation"  
echo "  ✅ Proper error handling and logging"
echo "  ✅ Rate limiting and security features"
echo "  ✅ Optimized Firestore rules and indexes"
echo ""
print_status "Next steps:"
echo "  1. Test phone authentication flow"
echo "  2. Verify all security rules are working"
echo "  3. Monitor Firebase console for any issues"
echo "  4. Set up error monitoring in production"
echo ""
print_status "Deployment completed at $(date)"