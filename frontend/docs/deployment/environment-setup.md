# 🌍 Environment Setup Guide

Complete guide for setting up development and production environments.

## 📁 Environment Structure (Next.js Standard)

```
frontend/ (root)
├── .env.local              # Development environment (gitignored)
├── .env.production         # Production environment (gitignored)
├── .env.example           # Template file (committed to git)
└── .env                   # Default environment (optional)
```

**Note**: Next.js automatically loads environment files from the project root in this order:

1. `.env.local` (loaded in development only)
2. `.env.production` (loaded when NODE_ENV=production)
3. `.env` (loaded in all environments)

## 🔧 Setup Process

### 1. Run Setup Script

```bash
# Automated setup
pnpm setup
```

### 2. Configure Development Environment

```bash
# Firebase Configuration for Development
NEXT_PUBLIC_FIREBASE_API_KEY=your_dev_api_key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_dev_project.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_dev_project_id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_dev_project.firebasestorage.app
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_dev_sender_id
NEXT_PUBLIC_FIREBASE_APP_ID=your_dev_app_id
NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID=your_dev_measurement_id

# Environment
NODE_ENV=development

# App Configuration
NEXT_PUBLIC_APP_URL=http://localhost:3000
NEXT_PUBLIC_APP_NAME=Owl AI (Dev)
NEXT_PUBLIC_APP_VERSION=1.0.0-dev
```

### 3. Configure Production Environment

```bash
# Firebase Configuration for Production
NEXT_PUBLIC_FIREBASE_API_KEY=your_prod_api_key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_prod_project.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_prod_project_id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_prod_project.firebasestorage.app
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_prod_sender_id
NEXT_PUBLIC_FIREBASE_APP_ID=your_prod_app_id
NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID=your_prod_measurement_id

# Environment
NODE_ENV=production

# App Configuration
NEXT_PUBLIC_APP_URL=https://your-domain.com
NEXT_PUBLIC_APP_NAME=Owl AI
NEXT_PUBLIC_APP_VERSION=1.0.0
```

## 🔒 Security Best Practices

### ✅ Do:

- Use different Firebase projects for dev/prod
- Keep environment files in `.gitignore`
- Use strong, unique API keys
- Regularly rotate credentials
- Use environment-specific configurations

### ❌ Don't:

- Commit environment files to git
- Share environment files in chat/email
- Use production credentials in development
- Hardcode secrets in source code

## 🔍 Environment Validation

The system automatically validates environment variables:

```typescript
// Required variables are checked on startup
const requiredVars = [
  'NEXT_PUBLIC_FIREBASE_API_KEY',
  'NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN',
  'NEXT_PUBLIC_FIREBASE_PROJECT_ID',
  // ... more variables
];
```

## 🐛 Troubleshooting

### Environment Variables Not Loading

```bash
# Check if files exist
ls -la config/environments/

# Verify file permissions
chmod 600 config/environments/.env.*

# Restart development server
pnpm dev
```

### Build Failures

```bash
# Check environment validation
pnpm type-check

# Run linting
pnpm lint

# Test build
pnpm build:test
```

---

**Remember:** Always use separate Firebase projects for different environments!
