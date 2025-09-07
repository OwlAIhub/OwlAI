# 🚀 Production Deployment Guide

Complete guide for deploying Owl AI to production with enterprise-grade setup.

## 📋 Prerequisites

### Required Tools

- **Node.js** 18+
- **pnpm** 8+
- **Firebase CLI** (latest)
- **Git** (for version control)

### Required Accounts

- **Firebase Project** (production)
- **GitHub Account** (for CI/CD)
- **Domain** (optional, for custom domain)

## 🌍 Environment Setup

### 1. Create Production Environment File

```bash
# Run the setup script
pnpm setup

# Edit production environment
nano config/environments/.env.production
```

### 2. Configure Production Environment Variables

```bash
# Firebase Configuration for Production
NEXT_PUBLIC_FIREBASE_API_KEY=your_production_api_key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_production_project.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_production_project_id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_production_project.firebasestorage.app
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_production_sender_id
NEXT_PUBLIC_FIREBASE_APP_ID=your_production_app_id
NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID=your_production_measurement_id

# Environment
NODE_ENV=production

# App Configuration
NEXT_PUBLIC_APP_URL=https://your-domain.com
NEXT_PUBLIC_APP_NAME=Owl AI
NEXT_PUBLIC_APP_VERSION=1.0.0
```

## 🚀 Deployment Options

### Option 1: Automated Deployment (Recommended)

```bash
# Deploy using production script
pnpm deploy:prod
```

This script will:

1. ✅ Validate environment variables
2. ✅ Run type checking and linting
3. ✅ Build the application
4. ✅ Deploy to Firebase
5. ✅ Run health checks

### Option 2: Manual Deployment

```bash
# Build for production
pnpm build:prod

# Deploy to Firebase
firebase deploy --only hosting
```

### Option 3: CI/CD Deployment

The project includes GitHub Actions workflow that automatically deploys when you push to the `main` branch.

**Required GitHub Secrets:**

- `FIREBASE_API_KEY`
- `FIREBASE_AUTH_DOMAIN`
- `FIREBASE_PROJECT_ID`
- `FIREBASE_STORAGE_BUCKET`
- `FIREBASE_MESSAGING_SENDER_ID`
- `FIREBASE_APP_ID`
- `FIREBASE_MEASUREMENT_ID`
- `FIREBASE_SERVICE_ACCOUNT`

## 📊 Monitoring & Performance

### Error Tracking

- ✅ **Global Error Handling** - Catches unhandled errors
- ✅ **Performance Monitoring** - Tracks Core Web Vitals
- ✅ **User Analytics** - Tracks user interactions
- ✅ **Authentication Events** - Monitors auth flow

### Performance Targets

- **Lighthouse Score**: 90+
- **First Contentful Paint**: < 1.5s
- **Largest Contentful Paint**: < 2.5s
- **Cumulative Layout Shift**: < 0.1
- **Bundle Size**: < 500KB

## 🔒 Security Features

### Security Headers

- ✅ **X-Frame-Options: DENY**
- ✅ **X-Content-Type-Options: nosniff**
- ✅ **Referrer-Policy: origin-when-cross-origin**
- ✅ **Permissions-Policy: restricted**
- ✅ **Strict-Transport-Security: enabled**
- ✅ **X-XSS-Protection: enabled**

### Environment Security

- ✅ **Separate dev/prod environments**
- ✅ **No hardcoded secrets**
- ✅ **Environment variable validation**
- ✅ **Secure Firebase configuration**

## 🐛 Troubleshooting

### Build Failures

```bash
# Check TypeScript errors
pnpm type-check:prod

# Check linting errors
pnpm lint:strict

# Clean and rebuild
pnpm clean && pnpm build:prod
```

### Deployment Issues

```bash
# Check Firebase login
firebase projects:list

# Check environment variables
cat config/environments/.env.production

# Test build locally
pnpm build:prod && firebase serve
```

### Error Codes

| Error Code            | Description                   | Solution                        |
| --------------------- | ----------------------------- | ------------------------------- |
| `ENV_MISSING`         | Missing environment variables | Check `.env.production`         |
| `BUILD_FAILED`        | Build process failed          | Check TypeScript/linting errors |
| `DEPLOY_FAILED`       | Firebase deployment failed    | Check Firebase credentials      |
| `HEALTH_CHECK_FAILED` | Health check failed           | Verify deployment manually      |

---

**🎉 Your Owl AI application is now production-ready!**
