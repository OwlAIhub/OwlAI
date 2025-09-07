#!/bin/bash

# Environment Setup Script for Owl AI
# This script helps set up environment variables for different environments

echo "🦉 Owl AI Environment Setup"
echo "=========================="

# Check if .env.local exists
if [ ! -f ".env.local" ]; then
    echo "📝 Creating .env.local file..."

    cat > .env.local << 'EOF'
# Firebase Configuration for Development
NEXT_PUBLIC_FIREBASE_API_KEY=AIzaSyDIOsZ__q73T9_Ta4xdyFN3RYqSeduyvJM
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=owl-ai-1ef31.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=owl-ai-1ef31
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=owl-ai-1ef31.firebasestorage.app
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=202604444478
NEXT_PUBLIC_FIREBASE_APP_ID=1:202604444478:web:26493d1dbdc5cb92cbca6f
NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID=G-9902XT617E

# Environment
NODE_ENV=development

# App Configuration
NEXT_PUBLIC_APP_URL=http://localhost:3000
NEXT_PUBLIC_APP_NAME=Owl AI
NEXT_PUBLIC_APP_VERSION=1.0.0
EOF

    echo "✅ .env.local created successfully!"
else
    echo "✅ .env.local already exists"
fi

# Check if .env.production exists
if [ ! -f ".env.production" ]; then
    echo "📝 Creating .env.production template..."

    cat > .env.production << 'EOF'
# Firebase Configuration for Production
NEXT_PUBLIC_FIREBASE_API_KEY=your_production_firebase_api_key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_production_project.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_production_project_id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_production_project.firebasestorage.app
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_production_messaging_sender_id
NEXT_PUBLIC_FIREBASE_APP_ID=your_production_app_id
NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID=your_production_measurement_id

# Environment
NODE_ENV=production

# App Configuration
NEXT_PUBLIC_APP_URL=https://your-domain.com
NEXT_PUBLIC_APP_NAME=Owl AI
NEXT_PUBLIC_APP_VERSION=1.0.0
EOF

    echo "✅ .env.production template created!"
    echo "⚠️  Please update .env.production with your production Firebase credentials"
else
    echo "✅ .env.production already exists"
fi

echo ""
echo "🎉 Environment setup complete!"
echo ""
echo "📋 Next steps:"
echo "1. Update .env.production with your production Firebase credentials"
echo "2. Run 'pnpm dev' to start development server"
echo "3. Run 'pnpm build' to test production build"
echo ""
echo "🔒 Security Note:"
echo "- Never commit .env.local or .env.production to version control"
echo "- Use different Firebase projects for development and production"
