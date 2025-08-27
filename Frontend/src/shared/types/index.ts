/**
 * Application Types
 * Centralized type definitions for the entire application
 */

import React from "react";

// ============================================================================
// AUTHENTICATION TYPES
// ============================================================================

export interface User {
  uid: string;
  email?: string;
  phoneNumber?: string;
  displayName?: string;
  photoURL?: string;
  emailVerified: boolean;
  metadata: {
    creationTime: string;
    lastSignInTime: string;
  };
}

export interface AuthState {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  error: string | null;
}

// ============================================================================
// CHAT TYPES
// ============================================================================

export interface ChatSession {
  id: string;
  title: string;
  created_at: string;
  updated_at: string;
  user_id: string;
  message_count: number;
  last_message?: string;
}

export interface ChatMessage {
  id: string;
  session_id: string;
  content: string;
  role: "user" | "assistant";
  created_at: string;
  metadata?: {
    tokens_used?: number;
    model_used?: string;
    response_time?: number;
  };
}

export interface ChatState {
  sessions: ChatSession[];
  currentSession: ChatSession | null;
  messages: ChatMessage[];
  isLoading: boolean;
  error: string | null;
}

// ============================================================================
// USER PROFILE TYPES
// ============================================================================

export interface UserProfile {
  id: string;
  uid: string;
  name: string;
  email?: string;
  phone?: string;
  avatar?: string;
  bio?: string;
  created_at: string;
  updated_at: string;
}

export interface UserPreferences {
  theme: "light" | "dark" | "auto";
  language: string;
  notifications: boolean;
  privacy_settings: {
    profile_visibility: "public" | "private";
    allow_analytics: boolean;
    allow_marketing: boolean;
  };
  chat_settings: {
    auto_save: boolean;
    message_history_limit: number;
    typing_indicator: boolean;
  };
}

// ============================================================================
// API TYPES
// ============================================================================

export interface ApiResponse<T = any> {
  data: T;
  status: number;
  message: string;
  success: boolean;
}

export interface ApiError {
  message: string;
  status: number;
  code?: string;
}

export interface RequestConfig {
  method?: "GET" | "POST" | "PUT" | "DELETE" | "PATCH";
  headers?: Record<string, string>;
  body?: any;
  timeout?: number;
  retries?: number;
}

// ============================================================================
// QUESTIONNAIRE TYPES
// ============================================================================

export interface QuestionnaireData {
  languages: Language[];
  curricula: Curriculum[];
  subjects: Subject[];
  attempts: Attempt[];
  sources: Source[];
  examCycles: ExamCycle[];
}

export interface Language {
  id: string;
  name: string;
  code: string;
}

export interface Curriculum {
  id: string;
  name: string;
  description: string;
}

export interface Subject {
  id: string;
  name: string;
  curriculum_id: string;
}

export interface Attempt {
  id: string;
  name: string;
  description: string;
}

export interface Source {
  id: string;
  name: string;
  description: string;
}

export interface ExamCycle {
  id: string;
  name: string;
  year: number;
  description: string;
}

export interface QuestionnaireState {
  currentStep: number;
  answers: Record<string, any>;
  isComplete: boolean;
  isLoading: boolean;
  error: string | null;
}

// ============================================================================
// SUBSCRIPTION TYPES
// ============================================================================

export interface SubscriptionPlan {
  id: string;
  name: string;
  price: number;
  currency: string;
  interval: "monthly" | "yearly";
  features: string[];
  isPopular?: boolean;
  isRecommended?: boolean;
}

export interface SubscriptionState {
  plans: SubscriptionPlan[];
  currentPlan: SubscriptionPlan | null;
  isLoading: boolean;
  error: string | null;
}

// ============================================================================
// UI TYPES
// ============================================================================

export interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectChat: (chatId: string) => void;
  currentUser: User | null;
  activeChatId: string | null;
  setChats: (chats: ChatSession[]) => void;
  onUserProfileClick: () => void;
  setSesssionId: (sessionId: string) => void;
}

export interface ChatLayoutProps {
  children: React.ReactNode;
  isSidebarOpen: boolean;
  onToggleSidebar: () => void;
  currentUser: User | null;
  onSignOut: () => void;
}

// ============================================================================
// UTILITY TYPES
// ============================================================================

export type LoadingState = "idle" | "loading" | "success" | "error";

export interface PaginationParams {
  page: number;
  limit: number;
  offset: number;
}

export interface PaginatedResponse<T> {
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
    hasNext: boolean;
    hasPrev: boolean;
  };
}

// ============================================================================
// STORAGE TYPES
// ============================================================================

export interface StorageData {
  user: User | null;
  userProfile: UserProfile | null;
  userPreferences: UserPreferences | null;
  chatSessions: ChatSession[];
  questionnaireAnswers: Record<string, any>;
  theme: "light" | "dark" | "auto";
  language: string;
}

// ============================================================================
// ERROR TYPES
// ============================================================================

export interface AppError {
  code: string;
  message: string;
  details?: any;
  timestamp: string;
  context?: string;
}

// ============================================================================
// EVENT TYPES
// ============================================================================

export interface AppEvent {
  type: string;
  payload: any;
  timestamp: string;
  userId?: string;
  sessionId?: string;
}
