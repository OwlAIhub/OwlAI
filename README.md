# 🦉 OWL AI - Intelligent Study Partner

> Your AI-powered companion for competitive exams and academic excellence

[![Next.js](https://img.shields.io/badge/Next.js-15.5.2-black?style=flat-square&logo=next.js)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue?style=flat-square&logo=typescript)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-3.4-38B2AC?style=flat-square&logo=tailwind-css)](https://tailwindcss.com/)
[![Firebase](https://img.shields.io/badge/Firebase-10.0-orange?style=flat-square&logo=firebase)](https://firebase.google.com/)
[![Vercel](https://img.shields.io/badge/Deployed_on-Vercel-black?style=flat-square&logo=vercel)](https://vercel.com/)

## 🎯 Overview

OWL AI is a cutting-edge educational platform that revolutionizes how students prepare for competitive exams. Built with modern web technologies, it provides an intelligent, real-time chat interface powered by advanced AI to deliver personalized study assistance, practice questions, and comprehensive exam preparation tools.

## 🏗️ Architecture

```
OwlAI/
├── frontend/                    # Next.js 15 Application
│   ├── src/
│   │   ├── app/                # App Router (Next.js 15)
│   │   │   ├── api/            # API Routes
│   │   │   ├── chat/           # Chat Interface
│   │   │   └── dashboard/      # User Dashboard
│   │   ├── components/         # React Components
│   │   │   ├── ui/             # Shadcn/ui Components
│   │   │   ├── chat_interface/ # Chat System
│   │   │   └── sidebar/        # Navigation
│   │   ├── lib/                # Utilities & Services
│   │   │   ├── firebase.ts     # Firebase Configuration
│   │   │   ├── analytics.ts    # Analytics Service
│   │   │   └── utils.ts        # Helper Functions
│   │   └── types/              # TypeScript Definitions
│   ├── public/                 # Static Assets
│   ├── eslint.config.mjs       # ESLint Configuration
│   ├── next.config.ts          # Next.js Configuration
│   └── package.json            # Dependencies
├── pnpm-workspace.yaml         # Monorepo Configuration
├── vercel.json                 # Deployment Configuration
└── README.md                   # Project Documentation
```

## 🚀 Quick Start

### Prerequisites
- **Node.js** 18.0 or higher
- **Yarn** 1.22 or higher (recommended package manager)
- **Firebase Project** (for backend services)

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/your-username/owlai.git
   cd owlai
   ```

2. **Install dependencies**
   ```bash
   yarn install
   ```

3. **Environment Setup**
   ```bash
   cd frontend
   cp .env.example .env.local
   # Configure your Firebase and API keys
   ```

4. **Start development server**
   ```bash
   yarn dev
   ```

5. **Open your browser**
   ```
   http://localhost:3000
   ```

## 🛠️ Technology Stack

### Frontend
- **[Next.js 15.5.2](https://nextjs.org/)** - React framework with App Router
- **[TypeScript 5.0](https://www.typescriptlang.org/)** - Type-safe development
- **[Tailwind CSS 3.4](https://tailwindcss.com/)** - Utility-first styling
- **[Shadcn/ui](https://ui.shadcn.com/)** - Modern component library
- **[Framer Motion](https://www.framer.com/motion/)** - Smooth animations
- **[React Markdown](https://github.com/remarkjs/react-markdown)** - Markdown rendering
- **[Yarn](https://yarnpkg.com/)** - Fast, reliable package manager

### Backend & Services
- **[Firebase Firestore](https://firebase.google.com/docs/firestore)** - Real-time NoSQL database
- **[Firebase Auth](https://firebase.google.com/docs/auth)** - Authentication system
- **[Next.js API Routes](https://nextjs.org/docs/app/building-your-application/routing/route-handlers)** - Serverless functions
- **[Flowise AI](https://flowiseai.com/)** - AI workflow management

### Development Tools
- **[ESLint](https://eslint.org/)** - Code linting with TypeScript support
- **[Prettier](https://prettier.io/)** - Code formatting
- **[Yarn](https://yarnpkg.com/)** - Fast, reliable package manager
- **[Next.js Bundler](https://nextjs.org/docs/app/building-your-application/routing/route-handlers)** - Optimized production builds

## 🚀 Deployment

### Vercel (Recommended)
```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel --prod
```

### Manual Deployment
```bash
# Build the application
yarn build

# Start production server
yarn start
```

## 🧪 Development

### Available Scripts
```bash
# Development
yarn dev              # Start development server
yarn build            # Build for production
yarn start            # Start production server

# Code Quality
yarn lint             # Run ESLint
yarn lint:fix         # Fix ESLint errors
yarn format           # Format with Prettier
yarn type-check       # TypeScript type checking

# Comprehensive Checks
yarn check-all        # Run all quality checks
yarn fix-all          # Fix all auto-fixable issues
```

### Code Standards
- **TypeScript** - Strict type checking enabled
- **ESLint** - Comprehensive linting rules
- **Prettier** - Consistent code formatting
- **Conventional Commits** - Standardized commit messages


## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- **Next.js Team** - For the amazing React framework
- **Vercel** - For seamless deployment platform
- **Firebase** - For robust backend services
- **Shadcn** - For beautiful UI components
- **OpenAI** - For AI capabilities
