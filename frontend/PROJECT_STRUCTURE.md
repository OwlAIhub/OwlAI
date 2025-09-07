# 🏗️ Owl AI - Project Structure

Extremely organized and clean project structure with everything in its proper place.

## 📁 Root Structure

```
frontend/
├── 📋 docs/                    # All documentation
├── 📜 scripts/                 # All scripts organized by type
├── ⚙️ config/                  # All configuration files
├── 🎨 assets/                  # Static assets (images, icons, fonts)
├── 📱 src/                     # Source code
├── 🌐 public/                  # Public static files
├── 📦 package.json             # Dependencies and scripts
├── ⚙️ next.config.ts           # Next.js configuration
├── 📝 tsconfig.json            # TypeScript configuration
└── 🔒 .gitignore               # Git ignore rules
```

## 📋 Documentation Structure

```
docs/
├── 📖 README.md                # Documentation hub
├── 🚀 deployment/              # Deployment guides
│   ├── production-deployment.md
│   └── environment-setup.md
├── 🔧 development/             # Development guides
│   ├── getting-started.md
│   ├── code-standards.md
│   └── architecture.md
├── 👤 user-guide/              # User documentation
│   ├── features.md
│   ├── authentication.md
│   └── troubleshooting.md
└── 🔌 api/                     # API documentation
    ├── firebase-auth.md
    ├── error-handling.md
    └── monitoring.md
```

## 📜 Scripts Structure

```
scripts/
├── 📖 README.md                # Scripts documentation
├── 🚀 deploy/                  # Deployment scripts
│   ├── production-deploy.sh
│   └── deploy.sh
├── 🔧 setup/                   # Setup scripts
│   ├── setup-env.sh
│   └── setup-firebase.sh
├── 🏗️ build/                   # Build scripts
│   ├── build-prod.sh
│   └── build-analyze.sh
└── 🛠️ utils/                   # Utility scripts
    ├── clean.sh
    └── health-check.sh
```

## ⚙️ Configuration Structure

```
config/
├── 📖 README.md                # Configuration documentation
├── 🌍 environments/            # Environment variables
│   ├── .env.local              # Development (gitignored)
│   ├── .env.production         # Production (gitignored)
│   └── env.example             # Template file
├── 🏗️ build/                   # Build configuration
│   ├── build.config.js
│   └── tsconfig.production.json
├── 🚀 deployment/              # Deployment configuration
│   └── firebase.json
└── 🔒 security/                # Security configuration
    ├── csp.config.js
    └── security-headers.js
```

## 📱 Source Code Structure

```
src/
├── 📱 app/                     # Next.js 13+ App Router
│   ├── (auth)/                # Auth route group
│   │   ├── login/
│   │   └── signup/
│   ├── chat/                  # Chat interface
│   ├── dashboard/             # Dashboard page
│   ├── globals.css            # Global styles
│   ├── layout.tsx             # Root layout
│   └── page.tsx               # Home page
├── 🧩 components/             # React components
│   ├── 🔐 auth/               # Authentication components
│   │   ├── forms/             # Auth forms
│   │   │   └── PhoneAuthForm.tsx
│   │   └── providers/         # Auth providers
│   │       └── AuthProvider.tsx
│   ├── 🎨 layout/             # Layout components
│   │   ├── header/            # Header components
│   │   ├── footer/            # Footer components
│   │   │   └── Footer.tsx
│   │   ├── sidebar/           # Sidebar components
│   │   │   ├── app-sidebar.tsx
│   │   │   ├── nav-user.tsx
│   │   │   ├── nav-main.tsx
│   │   │   ├── nav-projects.tsx
│   │   │   ├── nav-secondary.tsx
│   │   │   └── settings-dialog.tsx
│   │   └── navigation/        # Navigation components
│   ├── 🎯 ui/                 # UI components (Shadcn)
│   │   ├── buttons/           # Button components
│   │   │   └── button.tsx
│   │   ├── forms/             # Form components
│   │   │   └── form.tsx
│   │   ├── inputs/            # Input components
│   │   │   ├── input.tsx
│   │   │   └── label.tsx
│   │   ├── modals/            # Modal components
│   │   │   └── dialog.tsx
│   │   ├── cards/             # Card components
│   │   │   └── card.tsx
│   │   ├── separator.tsx
│   │   └── features-section-demo-2.tsx
│   ├── 🔗 shared/             # Shared components
│   │   ├── hooks/             # Custom hooks
│   │   ├── utils/             # Shared utilities
│   │   ├── constants/         # Constants
│   │   └── providers/         # Shared providers
│   │       ├── LenisProvider.tsx
│   │       ├── EnvironmentProvider.tsx
│   │       ├── PageTransition.tsx
│   │       └── HydrationFix.tsx
│   └── index.ts               # Components export index
├── 📚 lib/                    # Core libraries
│   ├── ⚙️ config/             # Configuration
│   │   └── config.ts
│   ├── 🔧 services/           # API services
│   │   ├── firebase.ts
│   │   └── monitoring.ts
│   ├── 🛠️ utils/              # Utility functions
│   │   ├── utils.ts
│   │   ├── auth.ts
│   │   └── env-validation.ts
│   └── 📝 types/              # TypeScript types
│       ├── auth.types.ts
│       ├── api.types.ts
│       └── common.types.ts
├── 🎨 styles/                 # Styling
│   ├── components/            # Component-specific styles
│   ├── globals/               # Global styles
│   └── themes/                # Theme configurations
└── 🪝 hooks/                  # Custom React hooks
    └── use-mobile.ts
```

## 🎨 Assets Structure

```
assets/
├── 🖼️ images/                 # Image assets
│   ├── logos/
│   ├── icons/
│   └── backgrounds/
├── 🎭 icons/                  # Icon assets
│   ├── svg/
│   └── png/
└── 🔤 fonts/                  # Font assets
    ├── woff2/
    └── ttf/
```

## 🌐 Public Structure

```
public/
├── 📱 manifest.json           # PWA manifest
├── 🤖 robots.txt              # Search engine rules
├── 🗺️ sitemap.xml             # Site map
├── 🍎 apple-touch-icon.png    # Apple touch icon
├── 🔗 favicon.ico             # Favicon
├── 🦉 owl-ai-logo.png         # App logo
├── 📄 browserconfig.xml       # Browser configuration
└── 📚 exam-logos/             # Exam logos
    ├── CSIR.webp
    ├── SSC.png
    ├── CTET.png
    └── UGC.png
```

## 🔧 Key Features

### ✅ Extreme Organization

- **Everything in its place** - No scattered files
- **Hierarchical structure** - Logical nesting
- **Clear separation** - Different concerns separated
- **Easy navigation** - Find anything quickly

### ✅ Clean Architecture

- **Modular components** - Reusable and maintainable
- **Centralized configuration** - Single source of truth
- **Environment separation** - Dev/prod isolation
- **Type safety** - Full TypeScript support

### ✅ Production Ready

- **Security first** - Headers, CSP, validation
- **Performance optimized** - Bundle splitting, lazy loading
- **Monitoring included** - Error tracking, analytics
- **CI/CD ready** - Automated deployment

### ✅ Developer Experience

- **Easy setup** - One command setup
- **Clear documentation** - Everything documented
- **Helpful scripts** - Automated common tasks
- **Best practices** - Industry standards followed

## 📋 Quick Commands

```bash
# Setup environment
pnpm setup

# Start development
pnpm dev

# Build for production
pnpm build:prod

# Deploy to production
pnpm deploy:prod

# Run health check
pnpm health

# Clean project
pnpm clean
```

## 📞 Navigation Tips

### Finding Components

- **Auth components**: `src/components/auth/`
- **Layout components**: `src/components/layout/`
- **UI components**: `src/components/ui/`
- **Shared utilities**: `src/components/shared/`

### Finding Configuration

- **Environment vars**: `config/environments/`
- **Build config**: `config/build/`
- **Deployment config**: `config/deployment/`
- **Security config**: `config/security/`

### Finding Documentation

- **Deployment guides**: `docs/deployment/`
- **Development guides**: `docs/development/`
- **User guides**: `docs/user-guide/`
- **API docs**: `docs/api/`

### Finding Scripts

- **Deployment scripts**: `scripts/deploy/`
- **Setup scripts**: `scripts/setup/`
- **Build scripts**: `scripts/build/`
- **Utility scripts**: `scripts/utils/`

---

**🎉 Perfect organization achieved! Everything has its place and is easy to find.**
