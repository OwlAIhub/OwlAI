# 🦉 OWL AI - Landing Page

> A clean, modern landing page for educational services

[![Next.js](https://img.shields.io/badge/Next.js-15.5.2-black?style=flat-square&logo=next.js)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue?style=flat-square&logo=typescript)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-3.4-38B2AC?style=flat-square&logo=tailwind-css)](https://tailwindcss.com/)

## 🎯 Overview

OWL AI is a clean, modern landing page built with Next.js 15, TypeScript, and Tailwind CSS. It features a responsive design with smooth animations and a professional layout.

## 🏗️ Project Structure

```
OwlAI/
├── frontend/                    # Next.js 15 Application
│   ├── src/
│   │   ├── app/                # App Router (Next.js 15)
│   │   │   ├── layout.tsx      # Root Layout
│   │   │   └── page.tsx        # Home Page
│   │   ├── components/         # React Components
│   │   │   ├── ui/             # Shadcn/ui Components
│   │   │   ├── sections/       # Landing Page Sections
│   │   │   ├── layout/         # Layout Components
│   │   │   └── providers/      # Context Providers
│   │   └── lib/                # Utilities
│   ├── public/                 # Static Assets
│   └── package.json            # Dependencies
└── README.md                   # Project Documentation
```

## 🚀 Quick Start

### Prerequisites

- **Node.js** 18.0 or higher
- **pnpm** 8.0 or higher (recommended package manager)

### Installation

1. **Install dependencies**

   ```bash
   cd frontend
   pnpm install
   ```

2. **Start development server**

   ```bash
   pnpm dev
   ```

3. **Open your browser**
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
- **[pnpm](https://pnpm.io/)** - Fast, reliable package manager

### Development Tools

- **[ESLint](https://eslint.org/)** - Code linting with TypeScript support
- **[Prettier](https://prettier.io/)** - Code formatting
- **[Next.js Bundler](https://nextjs.org/docs/app/building-your-application/routing/route-handlers)** - Optimized production builds

## 🧪 Development

### Available Scripts

```bash
# Development
pnpm dev              # Start development server
pnpm build            # Build for production
pnpm start            # Start production server

# Code Quality
pnpm lint             # Run ESLint
pnpm lint:fix         # Fix ESLint errors
pnpm format           # Format with Prettier
pnpm type-check       # TypeScript type checking

# Comprehensive Checks
pnpm check-all        # Run all quality checks
pnpm fix-all          # Fix all auto-fixable issues
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
- **Shadcn** - For beautiful UI components
- **Tailwind CSS** - For utility-first styling
