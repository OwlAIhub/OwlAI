// Simple Database Schema for OwlAI
// Using Firebase Firestore

export interface Chat {
  id: string;
  title: string;
  guestId: string;
  persona: {
    name: string;
    description: string;
    systemPrompt: string;
  };
  createdAt: Date;
  updatedAt: Date;
  // Optional: Basic usage tracking
  messageCount?: number;
}

export interface Message {
  id: string;
  chatId: string;
  role: 'user' | 'ai';
  text: string;
  createdAt: Date;
  // Optional: Basic message metadata
  tokens?: number; // For cost tracking
  model?: string; // AI model used
}

export interface Guest {
  id: string;
  createdAt: Date;
  lastActive: Date;
  // Optional: Basic preferences
  preferences?: {
    theme?: 'light' | 'dark';
    language?: string;
  };
}

export interface MessageFeedback {
  id: string;
  messageId: string;
  chatId: string;
  guestId: string;
  feedback: 'up' | 'down';
  createdAt: Date;
  // Optional: Additional context
  reason?: string;
  messageText?: string; // For analysis
}

// Database Collections:
// - chats: Contains chat documents
// - chats/{chatId}/messages: Contains messages for each chat
// - guests: Basic guest user tracking (optional)
// - feedback: Contains user feedback on AI responses

// Simple structure:
// 1. Chat ID - unique identifier for each conversation
// 2. Chat History - messages stored under each chat
// 3. User Message - text input from user
// 4. LLM Response - AI generated response
// 5. Basic guest tracking - for session management
// 6. Simple preferences - theme, language

// Minimal additions for practical use:
// - Message count for chat list sorting
// - Token tracking for cost management
// - Model tracking for debugging
// - Guest preferences for UX
// - Basic activity tracking
// - User feedback tracking for response quality

// No complex analytics, user profiles, or performance tracking
// Just essential chat functionality with minimal useful metadata
