# OwlAI - AI-Powered Learning Assistant

A production-ready React application for AI-powered learning assistance, specifically designed for competitive exam preparation (UGC NET, CSIR-NET, SSC, CTET).

## 🚀 Quick Start

```bash
# Clone the repository
git clone <repository-url>
cd Frontend

# Install dependencies
npm install

# Start development server
npm run dev

# Open http://localhost:3000
```

## 📋 Prerequisites

- **Node.js**: 18.x or higher
- **npm**: 9.x or higher
- **Firebase CLI**: For deployment and database management
- **Git**: For version control

## 🏗️ Project Architecture

```
Frontend/
├── src/
│   ├── core/                 # Core application logic
│   │   ├── auth/            # Authentication services
│   │   ├── chat/            # Chat functionality
│   │   ├── firebase/        # Firebase configuration
│   │   ├── config/          # App configuration
│   │   ├── security/        # Security & privacy services
│   │   └── stores/          # State management
│   ├── features/            # Feature-specific components
│   ├── shared/              # Reusable components
│   │   ├── components/      # UI components
│   │   ├── hooks/           # Custom React hooks
│   │   └── utils/           # Utility functions
│   ├── services/            # API services
│   ├── types/               # TypeScript definitions
│   └── app/                 # App routing and layout
├── public/                  # Static assets
├── scripts/                 # Build and optimization scripts
└── docs/                    # Documentation
```

## 🛠️ Technology Stack

### Frontend

- **React 19** - UI framework
- **TypeScript** - Type safety
- **Vite** - Build tool and dev server
- **Tailwind CSS** - Styling framework
- **React Router DOM** - Client-side routing

### UI Components

- **Radix UI** - Accessible component primitives
- **Headless UI** - Unstyled, accessible components
- **Framer Motion** - Animation library
- **Lucide React** - Icon library

### Backend & Services

- **Firebase** - Backend as a Service
  - Firestore - Database
  - Authentication - User management
  - Cloud Functions - Serverless functions

### Development Tools

- **ESLint** - Code linting
- **Prettier** - Code formatting
- **Lighthouse** - Performance monitoring
- **TypeScript** - Static type checking

## 🔧 Development Setup

### 1. Environment Configuration

Create `.env.local` file in the root directory:

```env
# Firebase Configuration
VITE_FIREBASE_API_KEY=your_api_key
VITE_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
VITE_FIREBASE_APP_ID=your_app_id

# App Configuration
VITE_APP_NAME=OwlAI
VITE_APP_VERSION=1.0.0
VITE_API_BASE_URL=https://your-api-domain.com
```

### 2. Firebase Setup

```bash
# Install Firebase CLI globally
npm install -g firebase-tools

# Login to Firebase
firebase login

# Initialize Firebase (if not already done)
firebase init

# Select services: Hosting, Firestore, Functions
```

### 3. Database Rules

Firestore security rules are configured in `firestore.rules`:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // User can only access their own data
    match /users/{userId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }

    // Chat messages
    match /chats/{chatId}/messages/{messageId} {
      allow read, write: if request.auth != null &&
        request.auth.uid in resource.data.participants;
    }
  }
}
```

## 📜 Available Scripts

### Development

```bash
npm run dev              # Start development server
npm run build            # Build for production
npm run preview          # Preview production build
npm run lint             # Run ESLint
npm run lint:fix         # Fix ESLint errors
npm run format           # Format code with Prettier
npm run type-check       # Run TypeScript type checking
```

### Performance & SEO

```bash
npm run lighthouse       # Run Lighthouse audit
npm run lighthouse:ci    # Run Lighthouse CI
npm run seo:optimize     # Generate SEO files
npm run optimize:images  # Optimize images
npm run build:seo        # Build with SEO optimization
```

### Testing

```bash
npm run test:lighthouse      # Test performance
npm run test:lighthouse:dev  # Test dev server
npm run test:lighthouse:build # Test production build
```

## 🎨 Design System

### Color Scheme

The application uses a **Teal-based color system** with CSS custom properties:

- **Primary Teal**: `#009688` (hsl(174 100% 29%))
- **Primary Dark**: `#00796B` (hsl(174 100% 23%))
- **Primary Light**: `#4DB6AC` (hsl(174 29% 61%))
- **Accent Yellow**: `#FFC107` (hsl(45 100% 51%))
- **Dark Background**: `#0D1B2A` (hsl(208 64% 10%))

### CSS Variables Implementation

Colors are defined in `src/app/index.css` using CSS custom properties:

```css
:root {
  --owl-primary: 174 100% 29%; /* #009688 */
  --owl-primary-dark: 174 100% 23%; /* #00796B */
  --owl-primary-light: 174 29% 61%; /* #4DB6AC */
  --owl-accent: 45 100% 51%; /* #FFC107 */
  --owl-base-dark: 208 64% 10%; /* #0D1B2A */
  --owl-card-dark: 208 43% 16%; /* #1B263B */
}
```

### Color Usage

```typescript
// Using CSS variables in components
import { getColors } from "@/shared/utils/colors";

const colors = getColors(darkMode);
// Returns Tailwind classes like "bg-owl-primary", "text-owl-primary-dark"
```

### Tailwind Configuration

Colors are mapped in `tailwind.config.js`:

```javascript
colors: {
  owl: {
    primary: "hsl(var(--owl-primary))",
    "primary-dark": "hsl(var(--owl-primary-dark))",
    "primary-light": "hsl(var(--owl-primary-light))",
    accent: "hsl(var(--owl-accent))",
    "base-dark": "hsl(var(--owl-base-dark))",
    "card-dark": "hsl(var(--owl-card-dark))",
  }
}
```

## 🔐 Security Features

### Authentication

- Phone number authentication with Firebase
- Rate limiting for SMS verification
- Session management with secure tokens
- GDPR-compliant data handling

### Data Protection

- Input sanitization for all user inputs
- Encryption for sensitive data
- Audit logging for security events
- Secure Firestore rules

### Privacy

- GDPR compliance tools
- Data export functionality
- Account deletion capabilities
- Privacy policy integration

### 2. Code Quality

- ESLint configuration in `.eslintrc.json`
- Prettier configuration in `.prettierrc`
- TypeScript strict mode enabled
- Pre-commit hooks for code quality

## 📱 Responsive Design

The application is fully responsive with:

- Mobile-first design approach
- Breakpoints: sm (640px), md (768px), lg (1024px), xl (1280px)
- Touch-friendly interactions
- Optimized for various screen sizes

## 🔄 State Management

### Store Structure

```typescript
// Core stores in src/core/stores/
-authStore.ts - // Authentication state
  chatStore.ts - // Chat functionality
  themeStore.ts - // Theme preferences
  userStore.ts; // User profile data
```

### Usage Example

```typescript
import { useAuthStore } from "@/core/stores";

const { user, isAuthenticated, login, logout } = useAuthStore();
```

## 🔧 Troubleshooting

### Common Issues

**1. Firebase Connection Issues**

```bash
# Check Firebase configuration
firebase projects:list
firebase use <project-id>
```

**2. Build Failures**

```bash
# Clear cache and reinstall
rm -rf node_modules package-lock.json
npm install
npm run build
```

**3. TypeScript Errors**

```bash
# Check type definitions
npm run type-check
# Fix with
npm run lint:fix
```

### Performance Issues

```bash
# Analyze bundle size
npm run build
# Check Lighthouse scores
npm run lighthouse
```

## 📚 Additional Resources

- [Firebase Documentation](https://firebase.google.com/docs)
- [React Documentation](https://react.dev)
- [Tailwind CSS Documentation](https://tailwindcss.com/docs)
- [Vite Documentation](https://vitejs.dev/guide)

## 📄 License

## This project is proprietary software. All rights reserved.
