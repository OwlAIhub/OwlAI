# ⚙️ Configuration Directory

This directory contains all project configuration files organized by category.

## 📁 Configuration Structure

### 🌍 [Environments](./environments/)

- **.env.local** - Development environment variables
- **.env.production** - Production environment variables
- **.env.staging** - Staging environment variables (optional)
- **.env.example** - Environment template

### 🏗️ [Build](./build/)

- **build.config.js** - Build configuration settings
- **tsconfig.production.json** - Production TypeScript config
- **webpack.config.js** - Custom webpack configuration (if needed)

### 🚀 [Deployment](./deployment/)

- **firebase.json** - Firebase hosting configuration
- **vercel.json** - Vercel deployment config (if needed)
- **docker-compose.yml** - Docker configuration (if needed)

### 🔒 [Security](./security/)

- **csp.config.js** - Content Security Policy
- **cors.config.js** - CORS configuration
- **security-headers.js** - Security headers configuration

## 🔧 Configuration Files

### Environment Variables

```bash
# Development
config/environments/.env.local

# Production
config/environments/.env.production

# Template
config/environments/.env.example
```

### Build Configuration

```bash
# TypeScript production config
config/build/tsconfig.production.json

# Build settings
config/build/build.config.js
```

### Deployment Configuration

```bash
# Firebase hosting
config/deployment/firebase.json

# Vercel (if used)
config/deployment/vercel.json
```

## 🔒 Security Notes

### Environment Files

- ✅ Never commit `.env.local` or `.env.production`
- ✅ Always use `.env.example` as template
- ✅ Use different credentials for dev/prod
- ✅ Validate environment variables on startup

### Configuration Files

- ✅ Review security settings regularly
- ✅ Use strong CSP policies
- ✅ Enable security headers
- ✅ Configure CORS properly

## 📋 Best Practices

### Organization

- Keep related configs together
- Use descriptive file names
- Document configuration options
- Version control safe configs only

### Security

- Separate dev/prod configurations
- Use environment-specific settings
- Validate all configurations
- Regular security audits

### Maintenance

- Regular config reviews
- Update dependencies
- Monitor for security issues
- Document configuration changes

---

**All configurations follow security best practices and are production-ready.**
