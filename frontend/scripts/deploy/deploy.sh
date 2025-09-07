#!/bin/bash

# Deployment Script for Owl AI
# This script handles different deployment scenarios

set -e  # Exit on any error

echo "🚀 Owl AI Deployment Script"
echo "=========================="

# Function to display usage
usage() {
    echo "Usage: $0 [environment]"
    echo "Environments:"
    echo "  dev     - Deploy to development"
    echo "  prod    - Deploy to production"
    echo "  test    - Test build without deployment"
    echo ""
    echo "Examples:"
    echo "  $0 dev"
    echo "  $0 prod"
    echo "  $0 test"
}

# Check if environment is provided
if [ $# -eq 0 ]; then
    usage
    exit 1
fi

ENVIRONMENT=$1

case $ENVIRONMENT in
    "dev")
        echo "🔧 Deploying to Development..."

        # Check if .env.local exists
        if [ ! -f ".env.local" ]; then
            echo "❌ .env.local not found. Run ./setup-env.sh first"
            exit 1
        fi

        # Install dependencies
        echo "📦 Installing dependencies..."
        pnpm install

        # Run type check
        echo "🔍 Running type check..."
        pnpm type-check

        # Run linting
        echo "🧹 Running linting..."
        pnpm lint

        # Build for development
        echo "🏗️  Building for development..."
        pnpm build

        echo "✅ Development build complete!"
        echo "🌐 Start development server with: pnpm dev"
        ;;

    "prod")
        echo "🏭 Deploying to Production..."

        # Check if .env.production exists
        if [ ! -f ".env.production" ]; then
            echo "❌ .env.production not found. Run ./setup-env.sh first"
            exit 1
        fi

        # Load production environment
        echo "📋 Loading production environment..."
        export $(cat .env.production | grep -v '^#' | xargs)

        # Install dependencies
        echo "📦 Installing dependencies..."
        pnpm install --frozen-lockfile

        # Run type check
        echo "🔍 Running type check..."
        pnpm type-check

        # Run linting
        echo "🧹 Running linting..."
        pnpm lint

        # Build for production
        echo "🏗️  Building for production..."
        pnpm build

        # Deploy to Firebase (if firebase.json exists)
        if [ -f "firebase.json" ]; then
            echo "🔥 Deploying to Firebase..."
            firebase deploy --only hosting
        else
            echo "⚠️  firebase.json not found. Build complete but not deployed."
            echo "📁 Static files are in the 'out' directory"
        fi

        echo "✅ Production deployment complete!"
        ;;

    "test")
        echo "🧪 Testing build..."

        # Install dependencies
        echo "📦 Installing dependencies..."
        pnpm install

        # Run type check
        echo "🔍 Running type check..."
        pnpm type-check

        # Run linting
        echo "🧹 Running linting..."
        pnpm lint

        # Test build
        echo "🏗️  Testing build..."
        pnpm build

        echo "✅ Build test complete!"
        echo "📁 Static files are in the 'out' directory"
        ;;

    *)
        echo "❌ Unknown environment: $ENVIRONMENT"
        usage
        exit 1
        ;;
esac

echo ""
echo "🎉 Deployment script completed successfully!"
