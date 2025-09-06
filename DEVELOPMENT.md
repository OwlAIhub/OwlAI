# 🚀 Development Setup Guide

This project is now fully configured with modern development tools and best practices using **Bun** as the package manager.

## 📦 Package Manager

**Bun** is used exclusively for all package management:

- ✅ Fast installation and updates
- ✅ Built-in TypeScript support
- ✅ Native bundling capabilities
- ✅ Compatible with npm ecosystem

## 🛠️ Development Tools

### Code Quality

- **ESLint** - Code linting with TypeScript support
- **Prettier** - Code formatting
- **TypeScript** - Type checking
- **Husky** - Git hooks for quality gates
- **lint-staged** - Run linters on staged files
- **Commitlint** - Enforce conventional commit messages

### Git Hooks

- **pre-commit** - Runs linting and formatting before commits
- **commit-msg** - Validates commit message format

### VS Code Integration

- **settings.json** - Optimized editor settings
- **extensions.json** - Recommended extensions
- **launch.json** - Debug configurations

## 🚀 Available Scripts

### Development

```bash
bun dev              # Start development server
bun build            # Build for production
bun start            # Start production server
```

### Code Quality

```bash
bun lint             # Run ESLint
bun lint:fix         # Fix ESLint errors
bun format           # Format with Prettier
bun type-check       # TypeScript type checking
bun validate         # Run all quality checks
```

### Utilities

```bash
bun clean            # Clean build cache
bun fresh            # Clean install and start dev
bun commit           # Stage and commit changes
```

## 📁 Project Structure

```
OwlAI/
├── .husky/                    # Git hooks
├── .vscode/                   # VS Code configuration
├── frontend/                  # Next.js application
│   ├── src/
│   │   ├── app/              # App Router pages
│   │   ├── components/       # React components
│   │   └── lib/              # Utilities
│   ├── .env.example          # Environment template
│   └── package.json          # Dependencies
├── .gitignore                # Git ignore rules
├── .prettierrc               # Prettier configuration
├── commitlint.config.js      # Commit message rules
└── .lintstagedrc.js          # Lint-staged configuration
```

## 🔧 Configuration Files

### ESLint

- Modern flat config format
- TypeScript support
- React and Next.js rules
- Accessibility checks

### Prettier

- Consistent code formatting
- Single quotes, semicolons
- 80 character line width
- LF line endings

### TypeScript

- Strict mode enabled
- Path mapping for clean imports
- Next.js optimizations

### Git Hooks

- Pre-commit: Lint and format
- Commit-msg: Validate message format

## 🎯 Best Practices

### Commits

Use conventional commit format:

```
feat: add new feature
fix: resolve bug
docs: update documentation
style: format code
refactor: improve code structure
test: add tests
chore: maintenance tasks
```

### Code Style

- Use TypeScript for all files
- Follow ESLint rules
- Format with Prettier
- Use meaningful variable names
- Add JSDoc comments for complex functions

### Development Workflow

1. Create feature branch
2. Make changes
3. Run `bun validate` to check quality
4. Commit with conventional format
5. Push and create PR

## 🚀 Getting Started

1. **Install dependencies:**

   ```bash
   cd frontend
   bun install
   ```

2. **Start development:**

   ```bash
   bun dev
   ```

3. **Open browser:**
   ```
   http://localhost:3000
   ```

## 📚 Resources

- [Bun Documentation](https://bun.sh/docs)
- [Next.js Documentation](https://nextjs.org/docs)
- [TypeScript Handbook](https://www.typescriptlang.org/docs)
- [ESLint Rules](https://eslint.org/docs/rules)
- [Prettier Options](https://prettier.io/docs/en/options.html)
- [Conventional Commits](https://www.conventionalcommits.org/)

---

**Happy coding! 🎉**
