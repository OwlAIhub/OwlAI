# 📜 Scripts Directory

This directory contains all project scripts organized by category.

## 📁 Script Structure

### 🚀 [Deploy](./deploy/)

- **production-deploy.sh** - Complete production deployment
- **deploy.sh** - Multi-environment deployment script
- **staging-deploy.sh** - Staging deployment (if needed)

### 🔧 [Setup](./setup/)

- **setup-env.sh** - Environment setup script
- **setup-firebase.sh** - Firebase initialization
- **setup-dev.sh** - Development environment setup

### 🏗️ [Build](./build/)

- **build-prod.sh** - Production build script
- **build-analyze.sh** - Bundle analysis script
- **build-test.sh** - Test build script

### 🛠️ [Utils](./utils/)

- **clean.sh** - Clean build artifacts
- **health-check.sh** - Application health check
- **backup.sh** - Backup important files

## 🚀 Quick Commands

### Setup

```bash
# Setup development environment
./scripts/setup/setup-env.sh

# Setup Firebase
./scripts/setup/setup-firebase.sh
```

### Deployment

```bash
# Deploy to production
./scripts/deploy/production-deploy.sh

# Deploy to staging
./scripts/deploy/deploy.sh staging
```

### Build & Test

```bash
# Production build
./scripts/build/build-prod.sh

# Analyze bundle
./scripts/build/build-analyze.sh
```

### Utilities

```bash
# Clean project
./scripts/utils/clean.sh

# Health check
./scripts/utils/health-check.sh
```

## 📋 Script Permissions

All scripts should have execute permissions:

```bash
# Make all scripts executable
find scripts/ -name "*.sh" -exec chmod +x {} \;
```

## 🔒 Security Notes

- Never commit sensitive data in scripts
- Use environment variables for secrets
- Validate inputs in scripts
- Log important actions

---

**All scripts are production-ready and follow best practices.**
