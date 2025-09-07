#!/bin/bash

# Security Check Script for Firebase Project
# This script helps identify potential security issues

echo "🔒 Firebase Project Security Check"
echo "=================================="

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Function to check if files are properly ignored
check_gitignore() {
    echo ""
    echo "🔍 Checking .gitignore configuration..."

    # List of sensitive files that should be ignored
    sensitive_files=(
        ".env"
        ".env.local"
        "frontend/.env.local"
        "functions/.env"
        "functions/.env.prod"
        "functions/.env.local"
        "firebase-adminsdk-*.json"
        "serviceAccountKey.json"
    )

    ignored_count=0
    total_files=${#sensitive_files[@]}

    for file in "${sensitive_files[@]}"; do
        if git check-ignore "$file" 2>/dev/null; then
            echo -e "  ${GREEN}✅ $file is properly ignored${NC}"
            ((ignored_count++))
        else
            echo -e "  ${YELLOW}⚠️  $file pattern may not be ignored${NC}"
        fi
    done

    echo ""
    echo "📊 Ignored files: $ignored_count/$total_files"
}

# Function to check for exposed secrets in git history
check_git_history() {
    echo ""
    echo "🔍 Checking git history for potential secrets..."

    # Common secret patterns
    secret_patterns=(
        "AIza[0-9A-Za-z\\-_]{35}"  # Firebase API keys
        "-----BEGIN PRIVATE KEY-----"
        "firebase-adminsdk"
        "serviceAccountKey"
        "FIREBASE_PRIVATE_KEY"
    )

    secrets_found=0

    for pattern in "${secret_patterns[@]}"; do
        if git log --all --grep="$pattern" --oneline 2>/dev/null | head -1; then
            echo -e "  ${RED}❌ Potential secret found in git history: $pattern${NC}"
            ((secrets_found++))
        fi
    done

    if [ $secrets_found -eq 0 ]; then
        echo -e "  ${GREEN}✅ No obvious secrets found in git history${NC}"
    else
        echo -e "  ${RED}❌ Found $secrets_found potential secrets in git history${NC}"
        echo -e "  ${YELLOW}⚠️  Consider using git-filter-branch or BFG Repo-Cleaner to remove them${NC}"
    fi
}

# Function to check current working directory for exposed files
check_working_directory() {
    echo ""
    echo "🔍 Checking working directory for exposed sensitive files..."

    # Find files that might contain secrets
    exposed_files=$(find . -name "*.env*" -o -name "*key*" -o -name "*secret*" -o -name "*credential*" 2>/dev/null | grep -v node_modules | grep -v .git)

    if [ -z "$exposed_files" ]; then
        echo -e "  ${GREEN}✅ No obviously sensitive files found in working directory${NC}"
    else
        echo -e "  ${YELLOW}⚠️  Found potentially sensitive files:${NC}"
        echo "$exposed_files" | while read -r file; do
            if git check-ignore "$file" 2>/dev/null; then
                echo -e "    ${GREEN}✅ $file (ignored)${NC}"
            else
                echo -e "    ${RED}❌ $file (NOT ignored)${NC}"
            fi
        done
    fi
}

# Function to check Firebase configuration
check_firebase_config() {
    echo ""
    echo "🔍 Checking Firebase configuration security..."

    # Check if Firebase config files exist and are properly configured
    if [ -f "firebase.json" ]; then
        echo -e "  ${GREEN}✅ firebase.json found${NC}"

        # Check for security headers
        if grep -q "X-Frame-Options" firebase.json; then
            echo -e "  ${GREEN}✅ Security headers configured${NC}"
        else
            echo -e "  ${YELLOW}⚠️  Consider adding security headers to firebase.json${NC}"
        fi
    else
        echo -e "  ${YELLOW}⚠️  firebase.json not found${NC}"
    fi

    # Check firestore rules
    if [ -f "firestore.rules" ]; then
        echo -e "  ${GREEN}✅ firestore.rules found${NC}"
        if grep -q "allow read, write: if false" firestore.rules; then
            echo -e "  ${YELLOW}⚠️  Firestore rules may be too restrictive${NC}"
        fi
    else
        echo -e "  ${YELLOW}⚠️  firestore.rules not found${NC}"
    fi
}

# Function to check environment variable validation
check_env_validation() {
    echo ""
    echo "🔍 Checking environment variable validation..."

    if [ -f "frontend/src/lib/env-validation.ts" ]; then
        echo -e "  ${GREEN}✅ Environment validation found${NC}"
    else
        echo -e "  ${YELLOW}⚠️  No environment validation found${NC}"
    fi

    if [ -f "frontend/functions/src/config.ts" ]; then
        echo -e "  ${GREEN}✅ Functions configuration validation found${NC}"
    else
        echo -e "  ${YELLOW}⚠️  No functions configuration validation found${NC}"
    fi
}

# Function to provide security recommendations
security_recommendations() {
    echo ""
    echo "🛡️  Security Recommendations:"
    echo "=============================="
    echo ""
    echo "1. 🔐 Environment Variables:"
    echo "   - Use Firebase Secret Manager for production secrets"
    echo "   - Never commit .env files to git"
    echo "   - Rotate API keys regularly"
    echo ""
    echo "2. 🔥 Firebase Security:"
    echo "   - Configure Firestore security rules properly"
    echo "   - Enable Firebase App Check for production"
    echo "   - Use Firebase Auth for user authentication"
    echo ""
    echo "3. 📝 Code Security:"
    echo "   - Validate all environment variables"
    echo "   - Use HTTPS only in production"
    echo "   - Implement proper error handling"
    echo ""
    echo "4. 🔍 Monitoring:"
    echo "   - Enable Firebase Security Rules monitoring"
    echo "   - Set up alerts for suspicious activity"
    echo "   - Regular security audits"
}

# Main execution
main() {
    check_gitignore
    check_git_history
    check_working_directory
    check_firebase_config
    check_env_validation
    security_recommendations

    echo ""
    echo -e "${GREEN}🎉 Security check completed!${NC}"
    echo ""
}

# Run main function
main
