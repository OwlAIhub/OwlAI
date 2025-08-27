/**
 * Database Types
 * Type definitions for Firestore collections and documents
 */

import { Timestamp } from "firebase/firestore";

// Base document interface
export interface BaseDocument {
  id: string;
  created_at: Timestamp;
  updated_at: Timestamp;
}

// User Profile
export interface UserDocument extends BaseDocument {
  uid: string;
  phone: string;
  name: string;
  email?: string;
  avatar?: string;
  bio?: string;
  status: "active" | "inactive" | "suspended";
  last_seen: Timestamp;
  subscription_tier: "free" | "premium" | "enterprise";
  usage_limits: {
    messages_per_month: number;
    conversations_per_month: number;
    current_month_messages: number;
    current_month_conversations: number;
  };
  preferences: {
    theme: "light" | "dark" | "auto";
    language: string;
    notifications: boolean;
    privacy_settings: {
      profile_visibility: "public" | "private";
      allow_analytics: boolean;
      allow_marketing: boolean;
    };
  };
}

// Conversation
export interface ConversationDocument extends BaseDocument {
  user_id: string;
  title: string;
  description?: string;
  status: "active" | "archived" | "deleted";
  type: "chat" | "questionnaire" | "support";
  settings: {
    auto_save: boolean;
    message_history_limit: number;
    typing_indicator: boolean;
    read_receipts: boolean;
  };
  metadata: {
    total_messages: number;
    last_message_at?: Timestamp;
    last_message_preview?: string;
    participants: string[];
    tags: string[];
  };
  analytics: {
    total_duration: number; // in seconds
    average_response_time: number; // in milliseconds
    user_satisfaction_score?: number; // 1-5
  };
}

// Message
export interface MessageDocument extends BaseDocument {
  conversation_id: string;
  user_id: string;
  content: string;
  type: "text" | "image" | "file" | "system" | "error";
  role: "user" | "assistant" | "system";
  status: "sent" | "delivered" | "read" | "failed" | "deleted";
  metadata: {
    tokens_used?: number;
    model_used?: string;
    response_time?: number; // in milliseconds
    context_length?: number;
    attachments?: {
      type: "image" | "file" | "audio";
      url: string;
      name: string;
      size: number;
    }[];
  };
  parent_message_id?: string; // for threaded conversations
  reactions?: {
    [userId: string]: "like" | "dislike" | "helpful" | "unhelpful";
  };
}

// Chat Session
export interface ChatSessionDocument extends BaseDocument {
  user_id: string;
  conversation_id: string;
  session_id: string;
  status: "active" | "ended" | "timeout";
  start_time: Timestamp;
  end_time?: Timestamp;
  duration?: number; // in seconds
  messages_count: number;
  user_agent?: string;
  ip_address?: string;
  device_info?: {
    platform: string;
    browser: string;
    version: string;
  };
}

// User Preferences
export interface UserPreferencesDocument extends BaseDocument {
  user_id: string;
  chat_settings: {
    auto_save: boolean;
    message_history_limit: number;
    typing_indicator: boolean;
    read_receipts: boolean;
    sound_notifications: boolean;
    desktop_notifications: boolean;
  };
  appearance_settings: {
    theme: "light" | "dark" | "auto";
    font_size: "small" | "medium" | "large";
    compact_mode: boolean;
    show_timestamps: boolean;
  };
  privacy_settings: {
    profile_visibility: "public" | "private";
    allow_analytics: boolean;
    allow_marketing: boolean;
    data_retention_days: number;
  };
  notification_settings: {
    email_notifications: boolean;
    push_notifications: boolean;
    message_notifications: boolean;
    mention_notifications: boolean;
  };
}

// Analytics
export interface AnalyticsDocument extends BaseDocument {
  user_id: string;
  event_type:
    | "message_sent"
    | "conversation_started"
    | "session_ended"
    | "error_occurred";
  event_data: {
    conversation_id?: string;
    message_id?: string;
    error_code?: string;
    error_message?: string;
    response_time?: number;
    tokens_used?: number;
  };
  session_id?: string;
  timestamp: Timestamp;
  metadata: {
    user_agent?: string;
    ip_address?: string;
    referrer?: string;
  };
}

// Pagination
export interface PaginationParams {
  limit: number;
  startAfter?: any;
  orderBy?: string;
  orderDirection?: "asc" | "desc";
}

export interface PaginatedResponse<T> {
  data: T[];
  hasMore: boolean;
  lastDoc?: any;
  totalCount?: number;
}

// Real-time listeners
export interface RealtimeListener {
  unsubscribe: () => void;
  onData: (data: any) => void;
  onError: (error: any) => void;
}

// Database operations
export interface DatabaseOperation {
  success: boolean;
  data?: any;
  error?: string;
  timestamp: Timestamp;
}

// Query filters
export interface QueryFilter {
  field: string;
  operator:
    | "=="
    | "!="
    | "<"
    | "<="
    | ">"
    | ">="
    | "array-contains"
    | "array-contains-any"
    | "in"
    | "not-in";
  value: any;
}

export interface QueryOptions {
  filters?: QueryFilter[];
  orderBy?: { field: string; direction: "asc" | "desc" }[];
  limit?: number;
  startAfter?: any;
}
