# OWL AI - Frontend

Your intelligent AI study partner for competitive exams and academic success.

## 🚀 Features

- **Intelligent Chat Interface** - Powered by advanced AI for educational assistance
- **Starter Prompts** - Quick access to common study topics
- **Clean UI Design** - Apple-level design with teal green, white, and black theme
- **Responsive Design** - Works perfectly on all devices
- **Real-time Chat** - Instant responses and smooth conversations
- **Account Management** - User profile and settings management
- **Chat History** - Persistent conversation history
- **Delete All Conversations** - Clean slate functionality

## 🛠️ Tech Stack

- **Framework**: Next.js 14 with App Router
- **Styling**: Tailwind CSS
- **UI Components**: Shadcn/ui
- **Animations**: Framer Motion
- **Database**: Firebase Firestore
- **Authentication**: Firebase Auth (ready to implement)
- **Icons**: Lucide React
- **Package Manager**: pnpm

## 📁 Project Structure

```
frontend/
├── src/
│   ├── app/                    # Next.js App Router
│   │   ├── api/               # API routes
│   │   ├── chat/              # Chat page
│   │   ├── dashboard/         # Dashboard page
│   │   ├── globals.css        # Global styles
│   │   ├── layout.tsx         # Root layout
│   │   └── page.tsx           # Home page
│   ├── components/            # React components
│   │   ├── chat_interface/    # Chat-related components
│   │   ├── layout/            # Layout components
│   │   ├── sections/          # Page sections
│   │   ├── sidebar/           # Sidebar components
│   │   └── ui/                # Reusable UI components
│   └── lib/                   # Utility functions
│       ├── analytics.ts       # Analytics utilities
│       ├── chats.ts           # Chat management
│       ├── data-generator.ts  # Sample data
│       ├── firebase-client.ts # Firebase configuration
│       ├── guest.ts           # Guest user management
│       ├── messages.ts        # Message handling
│       ├── realtime.ts        # Real-time subscriptions
│       └── utils.ts           # General utilities
├── public/                    # Static assets
│   ├── owl-ai-logo.png       # App logo
│   └── ...                   # Other assets
├── components.json            # Shadcn/ui configuration
├── next.config.ts            # Next.js configuration
├── package.json              # Dependencies
├── postcss.config.mjs        # PostCSS configuration
├── tailwind.config.ts        # Tailwind CSS configuration
└── tsconfig.json             # TypeScript configuration
```

## 🚀 Getting Started

### Prerequisites

- Node.js 18+
- pnpm (recommended) or npm

### Installation

1. **Install dependencies:**

   ```bash
   pnpm install
   ```

2. **Set up environment variables:**

   ```bash
   cp .env.example .env.local
   ```

   Add your Firebase configuration:

   ```env
   NEXT_PUBLIC_FIREBASE_API_KEY=your_api_key
   NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_auth_domain
   NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
   NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_storage_bucket
   NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
   NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id
   ```

3. **Run the development server:**

   ```bash
   pnpm dev
   ```

4. **Open your browser:**
   Navigate to [http://localhost:3000](http://localhost:3000)

## 🎨 Design System

### Colors

- **Primary**: Teal Green (#14b8a6)
- **Background**: White (#ffffff)
- **Text**: Black (#000000)
- **Muted**: Gray tones for secondary text

### Typography

- **Font**: Geist Sans (primary), Geist Mono (code)
- **Sizes**: Responsive typography scale

### Components

- **Buttons**: Clean, minimal design with hover states
- **Modals**: Apple-level design with backdrop blur
- **Cards**: Subtle shadows and rounded corners
- **Animations**: Smooth transitions with Framer Motion

## 🔧 Available Scripts

- `pnpm dev` - Start development server
- `pnpm build` - Build for production
- `pnpm start` - Start production server
- `pnpm lint` - Run ESLint
- `pnpm type-check` - Run TypeScript checks

## 📱 Features Overview

### Chat Interface

- **Welcome Screen**: Beautiful landing with starter prompts
- **Real-time Messaging**: Instant AI responses
- **Message History**: Persistent conversation storage
- **Copy/Feedback**: Message interaction features

### Sidebar

- **New Chat**: Create fresh conversations
- **Chat History**: Access previous conversations
- **Account Management**: User profile and settings
- **Delete All**: Clean conversation history

### Account Modal

- **Profile Settings**: User information management
- **Notifications**: Email preference settings
- **Privacy**: Security and privacy controls
- **App Settings**: Customization options
- **Delete Conversations**: Bulk conversation removal

## 📄 License

This project is part of the OWL AI ecosystem. All rights reserved.
