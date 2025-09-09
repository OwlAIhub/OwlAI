// Chat-related TypeScript interfaces for Firestore integration

import { Timestamp } from 'firebase/firestore';

// User Profile Interface
export interface User {
  id: string;
  email: string;
  displayName: string;
  photoURL?: string;
  onboardingProfile?: {
    examType: string;
    subjects: string[];
    studyLevel: string;
    goals: string[];
    preferredLanguage: string;
    studyHours: number;
    source: string;
  };
  preferences: {
    theme: 'light' | 'dark';
    notifications: boolean;
    autoSave: boolean;
  };
  subscription: {
    plan: 'free' | 'premium';
    expiresAt?: Timestamp;
    features: string[];
  };
  createdAt: Timestamp;
  updatedAt: Timestamp;
  lastActiveAt: Timestamp;
}

// Chat Session Interface
export interface ChatSession {
  id: string;
  userId: string;
  title: string;
  description?: string;
  category: 'study' | 'practice' | 'general' | 'exam-prep';
  subject?: string;
  isPinned: boolean;
  isArchived: boolean;
  messageCount: number;
  lastMessage: {
    content: string;
    sender: 'user' | 'ai';
    timestamp: Timestamp;
  };
  metadata: {
    flowiseSessionId?: string;
    examContext?: string;
    studyTopic?: string;
    difficulty?: 'beginner' | 'intermediate' | 'advanced';
  };
  createdAt: Timestamp;
  updatedAt: Timestamp;
}

// Message Interface
export interface Message {
  id: string;
  sessionId: string;
  userId: string;
  content: string;
  sender: 'user' | 'ai';
  type: 'text' | 'image' | 'file' | 'system';
  status: 'sending' | 'sent' | 'delivered' | 'read' | 'error';
  
  // AI-specific fields
  aiMetadata?: {
    flowiseMessageId?: string;
    processingTime?: number;
    model?: string;
    tokens?: {
      input: number;
      output: number;
    };
    confidence?: number;
    sources?: Array<{
      title: string;
      url?: string;
      relevance: number;
    }>;
  };
  
  // User interaction tracking
  interactions?: {
    copied: boolean;
    regenerated: boolean;
    feedback?: 'like' | 'dislike';
    feedbackReason?: string;
  };
  
  // Message threading
  parentMessageId?: string;
  threadId?: string;
  
  createdAt: Timestamp;
  updatedAt: Timestamp;
}

// User Activity Interface
export interface UserActivity {
  id: string;
  userId: string;
  type: 'session_created' | 'message_sent' | 'ai_response' | 'feedback_given';
  sessionId?: string;
  messageId?: string;
  metadata: Record<string, unknown>;
  timestamp: Timestamp;
}

// Client-side interfaces (without Firestore Timestamp)
export interface ClientChatSession extends Omit<ChatSession, 'createdAt' | 'updatedAt' | 'lastMessage'> {
  createdAt: Date;
  updatedAt: Date;
  lastMessage: {
    content: string;
    sender: 'user' | 'ai';
    timestamp: Date;
  };
}

export interface ClientMessage extends Omit<Message, 'createdAt' | 'updatedAt'> {
  createdAt: Date;
  updatedAt: Date;
}

export interface ClientUser extends Omit<User, 'createdAt' | 'updatedAt' | 'lastActiveAt' | 'subscription'> {
  createdAt: Date;
  updatedAt: Date;
  lastActiveAt: Date;
  subscription: {
    plan: 'free' | 'premium';
    expiresAt?: Date;
    features: string[];
  };
}

// API Response interfaces
export interface CreateSessionRequest {
  title?: string;
  category?: ChatSession['category'];
  subject?: string;
  examContext?: string;
  studyTopic?: string;
}

export interface SendMessageRequest {
  sessionId: string;
  content: string;
  type?: Message['type'];
}

export interface UpdateSessionRequest {
  title?: string;
  isPinned?: boolean;
  isArchived?: boolean;
  category?: ChatSession['category'];
  subject?: string;
}

// Pagination interfaces
export interface PaginationOptions {
  limit?: number;
  startAfter?: unknown;
  orderBy?: string;
  orderDirection?: 'asc' | 'desc';
}

export interface PaginatedResponse<T> {
  data: T[];
  hasMore: boolean;
  lastDoc?: unknown;
  total?: number;
}

// Real-time listener types
export type SessionListener = (sessions: ClientChatSession[]) => void;
export type MessageListener = (messages: ClientMessage[]) => void;
export type UserListener = (user: ClientUser | null) => void;

// Error types
export interface ChatError {
  code: string;
  message: string;
  details?: Record<string, unknown>;
}

// Utility types
export type MessageSender = Message['sender'];
export type MessageStatus = Message['status'];
export type MessageType = Message['type'];
export type SessionCategory = ChatSession['category'];
export type UserPlan = User['subscription']['plan'];