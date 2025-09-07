#!/bin/bash

# Production Environment Setup Script
# This script sets up the production environment with the correct Firebase credentials

echo "🔥 Setting up Production Environment for Real Phone Auth"
echo "======================================================"

# Create production environment file with real Firebase credentials
cat > .env.production << 'EOF'
# Firebase Configuration for Production (Real Phone Auth)
NEXT_PUBLIC_FIREBASE_API_KEY=AIzaSyDIOsZ__q73T9_Ta4xdyFN3RYqSeduyvJM
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=owl-ai-1ef31.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=owl-ai-1ef31
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=owl-ai-1ef31.firebasestorage.app
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=202604444478
NEXT_PUBLIC_FIREBASE_APP_ID=1:202604444478:web:26493d1dbdc5cb92cbca6f
NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID=G-9902XT617E

# Environment
NODE_ENV=production

# App Configuration
NEXT_PUBLIC_APP_URL=https://owlai.bot
NEXT_PUBLIC_APP_NAME=Owl AI
NEXT_PUBLIC_APP_VERSION=1.0.0
EOF

echo "✅ Production environment configured with real Firebase credentials"
echo ""
echo "🚀 Ready for production deployment with real phone authentication!"
echo ""
echo "📋 What works in production:"
echo "  ✅ Real phone numbers (any valid phone number)"
echo "  ✅ Real SMS OTP (sent via Firebase)"
echo "  ✅ reCAPTCHA verification (invisible)"
echo "  ✅ Firebase authentication"
echo "  ✅ Local storage for user session"
echo "  ✅ Direct redirect to chat after auth"
echo ""
echo "🔧 Test phone number still works for development:"
echo "  📱 +91 98765 43210 (no real SMS, simulated OTP)"
echo ""
echo "🎯 Next steps:"
echo "  1. Deploy: pnpm deploy:prod"
echo "  2. Test with your real phone number"
echo "  3. Verify SMS OTP delivery"
