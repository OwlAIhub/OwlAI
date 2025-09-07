# 🚀 Getting Started - Development Guide

Quick start guide for local development of Owl AI.

## 📋 Prerequisites

### Required Software

- **Node.js** 18+ (LTS recommended)
- **pnpm** 8+ (package manager)
- **Git** (version control)
- **VS Code** (recommended editor)

### Recommended VS Code Extensions

- **ES7+ React/Redux/React-Native snippets**
- **Prettier - Code formatter**
- **ESLint**
- **TypeScript Importer**
- **Tailwind CSS IntelliSense**
- **Firebase**

## ⚡ Quick Setup

### 1. Clone and Install

```bash
# Clone the repository
git clone <repository-url>
cd OwlAI/frontend

# Install dependencies
pnpm install

# Setup environment
pnpm setup
```

### 2. Configure Environment

```bash
# Edit development environment
nano config/environments/.env.local

# Add your Firebase development credentials
```

### 3. Start Development Server

```bash
# Start development server with Turbopack
pnpm dev

# Server will start at http://localhost:3000
```

## 🏗️ Project Structure

```
src/
├── app/                    # Next.js 13+ App Router
│   ├── (auth)/            # Auth route group
│   │   ├── login/         # Login page
│   │   └── signup/        # Signup page
│   ├── chat/              # Chat interface
│   ├── dashboard/         # Dashboard page
│   ├── globals.css        # Global styles
│   ├── layout.tsx         # Root layout
│   └── page.tsx           # Home page
├── components/            # Reusable components
│   ├── auth/             # Authentication components
│   ├── layout/           # Layout components
│   ├── shared/           # Shared utilities
│   └── ui/               # UI components (Shadcn)
├── lib/                  # Core libraries
│   ├── config/           # Configuration files
│   ├── services/         # API services
│   ├── types/            # TypeScript types
│   └── utils/            # Utility functions
└── styles/               # Styling
    ├── components/       # Component styles
    ├── globals/          # Global styles
    └── themes/           # Theme configurations
```

## 🛠️ Development Commands

### Core Commands

```bash
# Development server
pnpm dev

# Production build
pnpm build

# Type checking
pnpm type-check

# Linting
pnpm lint
pnpm lint:fix

# Formatting
pnpm format
pnpm format:check
```

### Testing Commands

```bash
# Run tests
pnpm test

# Watch mode
pnpm test:watch

# Coverage
pnpm test:coverage
```

### Utility Commands

```bash
# Clean build files
pnpm clean

# Reinstall dependencies
pnpm reinstall

# Security audit
pnpm audit

# Bundle analysis
pnpm build:analyze
```

## 🔥 Firebase Setup

### 1. Create Firebase Project

1. Go to [Firebase Console](https://console.firebase.google.com)
2. Create new project
3. Enable Authentication
4. Enable Phone authentication provider

### 2. Get Configuration

1. Go to Project Settings
2. Add web app
3. Copy configuration
4. Add to `config/environments/.env.local`

### 3. Test Authentication

```bash
# Start development server
pnpm dev

# Navigate to http://localhost:3000/login
# Test phone authentication flow
```

## 📱 Features Overview

### Authentication

- **Phone Authentication** with OTP
- **reCAPTCHA** verification
- **Persistent sessions** with localStorage
- **Route protection**

### UI Components

- **Shadcn/ui** component library
- **Tailwind CSS** for styling
- **Framer Motion** for animations
- **Responsive design**

### Performance

- **Next.js 15** with App Router
- **Turbopack** for fast development
- **Static site generation**
- **Optimized bundles**

## 🐛 Common Issues

### Port Already in Use

```bash
# Kill process on port 3000
lsof -ti:3000 | xargs kill -9

# Or use different port
pnpm dev -- --port 3001
```

### Environment Variables Not Loading

```bash
# Check file location
ls -la config/environments/

# Restart development server
pnpm dev
```

### Firebase Authentication Issues

```bash
# Check Firebase configuration
cat config/environments/.env.local

# Verify Firebase project settings
firebase projects:list
```

## 📞 Getting Help

### Documentation

- Check `docs/` folder for detailed guides
- Review component documentation
- Check API documentation

### Debugging

- Use browser developer tools
- Check console for errors
- Enable verbose logging in development

### Support

- Check troubleshooting guides
- Review error messages
- Test in different browsers

---

**Happy coding! 🎉**
