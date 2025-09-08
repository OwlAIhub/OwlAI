/**
 * Database Schema Types for OwlAI
 * Complete type definitions for Firestore collections
 */

import { Timestamp } from 'firebase/firestore';

// ============================================================================
// USER COLLECTION
// ============================================================================

export interface UserProfile {
  id: string;
  phoneNumber: string;
  displayName?: string;
  email?: string;
  photoURL?: string;

  // User Preferences
  preferences: {
    language: 'en' | 'hi' | 'regional';
    examType: 'ugc-net' | 'csir-net' | 'ssc' | 'ctet' | 'other';
    studyLevel: 'beginner' | 'intermediate' | 'advanced';
    notifications: {
      email: boolean;
      push: boolean;
      studyReminders: boolean;
    };
  };

  // Study Progress
  studyStats: {
    totalStudyTime: number; // in minutes
    totalQuestions: number;
    correctAnswers: number;
    streakDays: number;
    lastStudyDate: Timestamp;
    favoriteTopics: string[];
  };

  // Account Info
  createdAt: Timestamp;
  updatedAt: Timestamp;
  lastLoginAt: Timestamp;
  isActive: boolean;
}

// ============================================================================
// CONVERSATIONS COLLECTION
// ============================================================================

export interface Conversation {
  id: string;
  userId: string;
  title: string;
  subject?: string;
  examType?: string;

  // Conversation Metadata
  messageCount: number;
  totalTokens?: number;
  lastMessageAt: Timestamp;
  lastOpenedAt?: Timestamp; // last time user opened this conversation
  createdAt: Timestamp;
  updatedAt: Timestamp;

  // Status
  isArchived: boolean;
  isFavorite: boolean;
  tags: string[];
}

// ============================================================================
// MESSAGES COLLECTION
// ============================================================================

export interface ChatMessage {
  id: string;
  conversationId: string;
  userId: string;

  // Message Content
  type: 'user' | 'bot';
  content: string;
  originalContent?: string; // For edited messages

  // AI Response Metadata
  aiMetadata?: {
    model: string;
    tokens: number;
    responseTime: number;
    confidence?: number;
    sources?: string[];
  };

  // User Interaction
  userFeedback?: {
    rating: 1 | 2 | 3 | 4 | 5;
    feedback?: string;
    reported?: boolean;
  };

  // Timestamps
  createdAt: Timestamp;
  updatedAt: Timestamp;

  // Status
  isEdited: boolean;
  isDeleted: boolean;
}

// ============================================================================
// STUDY MATERIALS COLLECTION
// ============================================================================

export interface StudyMaterial {
  id: string;
  title: string;
  content: string;
  type: 'note' | 'question' | 'formula' | 'diagram' | 'summary';

  // Categorization
  subject: string;
  topic: string;
  subtopic?: string;
  examType: string[];
  difficulty: 'easy' | 'medium' | 'hard';

  // Metadata
  tags: string[];
  keywords: string[];
  estimatedTime: number; // in minutes

  // User Interaction
  userId?: string; // For user-created materials
  isPublic: boolean;
  likes: number;
  views: number;

  // Timestamps
  createdAt: Timestamp;
  updatedAt: Timestamp;
}

// ============================================================================
// STUDY SESSIONS COLLECTION
// ============================================================================

export interface StudySession {
  id: string;
  userId: string;

  // Session Details
  type: 'chat' | 'practice' | 'review' | 'test';
  subject?: string;
  topic?: string;

  // Session Data
  startTime: Timestamp;
  endTime?: Timestamp;
  duration: number; // in minutes

  // Performance Metrics
  questionsAnswered: number;
  correctAnswers: number;
  accuracy: number;

  // Session Content
  materialsUsed: string[]; // Study material IDs
  conversationsUsed: string[]; // Conversation IDs

  // Timestamps
  createdAt: Timestamp;
  updatedAt: Timestamp;
}

// ============================================================================
// ANALYTICS COLLECTION
// ============================================================================

export interface UserAnalytics {
  id: string; // userId
  userId: string;

  // Daily Stats
  dailyStats: {
    date: string; // YYYY-MM-DD format
    studyTime: number;
    questionsAnswered: number;
    conversationsStarted: number;
    materialsCreated: number;
  }[];

  // Weekly/Monthly Aggregates
  weeklyStats: {
    week: string; // YYYY-WW format
    totalStudyTime: number;
    averageAccuracy: number;
    streakDays: number;
  }[];

  monthlyStats: {
    month: string; // YYYY-MM format
    totalStudyTime: number;
    topicsCovered: string[];
    improvementAreas: string[];
  }[];

  // Learning Patterns
  learningPatterns: {
    preferredStudyTime: string; // HH:MM format
    averageSessionLength: number;
    mostProductiveDays: string[]; // ['monday', 'tuesday', etc.]
    favoriteSubjects: string[];
  };

  // Timestamps
  lastUpdated: Timestamp;
  createdAt: Timestamp;
}

// ============================================================================
// SYSTEM COLLECTION
// ============================================================================

export interface SystemConfig {
  id: string;
  key: string;
  value: unknown;
  description?: string;
  updatedAt: Timestamp;
  updatedBy: string;
}

// ============================================================================
// HELPER TYPES
// ============================================================================

export type CollectionName =
  | 'users'
  | 'conversations'
  | 'messages'
  | 'studyMaterials'
  | 'studySessions'
  | 'analytics'
  | 'systemConfig';

export interface DatabaseError {
  code: string;
  message: string;
  details?: unknown;
}

export interface PaginationOptions {
  limit: number;
  startAfter?: unknown;
  orderBy?: string;
  orderDirection?: 'asc' | 'desc';
}

export interface QueryResult<T> {
  data: T[];
  hasMore: boolean;
  lastDoc?: unknown;
  total?: number;
}
