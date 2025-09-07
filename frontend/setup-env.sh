#!/bin/bash

# Firebase Environment Setup Script
# This script helps you create the necessary environment files

echo "🔧 Firebase Environment Setup"
echo "================================"

# Function to create env files
create_env_files() {
    echo ""
    echo "📁 Creating Firebase Functions environment files..."

    # Copy example files to actual env files
    if [ -f "functions/env.example" ]; then
        cp functions/env.example functions/.env
        echo "✅ Created functions/.env"
    fi

    if [ -f "functions/env.prod.example" ]; then
        cp functions/env.prod.example functions/.env.prod
        echo "✅ Created functions/.env.prod"
    fi

    echo ""
    echo "⚠️  IMPORTANT: You need to update the environment files with your actual Firebase credentials:"
    echo "   - functions/.env (for development)"
    echo "   - functions/.env.prod (for production)"
    echo "   - apphosting.yaml (for Firebase Hosting - development)"
    echo "   - apphosting.production.yaml (for Firebase Hosting - production)"
    echo ""
}

# Function to validate Firebase project
validate_firebase() {
    echo "🔍 Validating Firebase setup..."

    if command -v firebase &> /dev/null; then
        echo "✅ Firebase CLI is installed"

        # Check if logged in
        if firebase projects:list &> /dev/null; then
            echo "✅ Firebase CLI is authenticated"

            # Show current project
            current_project=$(firebase use --project)
            echo "📋 Current Firebase project: $current_project"
        else
            echo "❌ Firebase CLI not authenticated. Run: firebase login"
        fi
    else
        echo "❌ Firebase CLI not found. Install it with: npm install -g firebase-tools"
    fi
    echo ""
}

# Function to show next steps
show_next_steps() {
    echo "🚀 Next Steps:"
    echo "1. Update your Firebase credentials in the environment files"
    echo "2. Set environment to 'production' in Firebase Console for production deployments"
    echo "3. Deploy your functions: firebase deploy --only functions"
    echo "4. Deploy your hosting: firebase deploy --only hosting"
    echo ""
    echo "📚 Documentation:"
    echo "- Firebase Hosting Environment: https://firebase.google.com/docs/app-hosting/configure"
    echo "- Firebase Functions Environment: https://firebase.google.com/docs/functions/config-env"
    echo ""
}

# Main execution
main() {
    validate_firebase
    create_env_files
    show_next_steps
}

# Run main function
main
