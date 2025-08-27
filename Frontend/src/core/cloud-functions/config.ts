/**
 * Cloud Functions Configuration
 * Centralized configuration for server-side processing and background tasks
 */

// Cloud Functions Configuration
export const CLOUD_FUNCTIONS_CONFIG = {
  BASE_URL: "https://us-central1-owlai-123456.cloudfunctions.net", // Replace with your actual project
  TIMEOUT: 60000, // 60 seconds for AI processing
  MAX_RETRIES: 3,
  RETRY_DELAY: 2000,
  RATE_LIMIT: {
    REQUESTS_PER_MINUTE: 60,
    REQUESTS_PER_HOUR: 1000,
    BURST_LIMIT: 10,
  },
} as const;

// Function endpoints
export const FUNCTION_ENDPOINTS = {
  // AI Processing
  AI_PROCESSING: "/ai-processing",
  AI_STREAMING: "/ai-streaming",

  // Background Tasks
  CONVERSATION_SUMMARY: "/conversation-summary",
  ANALYTICS_PROCESSING: "/analytics-processing",
  MESSAGE_ARCHIVAL: "/message-archival",

  // Rate Limiting
  RATE_LIMIT_CHECK: "/rate-limit-check",

  // Health & Monitoring
  HEALTH_CHECK: "/health-check",
  PERFORMANCE_METRICS: "/performance-metrics",
} as const;

// Request/Response types
export interface CloudFunctionRequest<T = any> {
  data: T;
  userId?: string;
  conversationId?: string;
  timestamp: string;
  requestId: string;
  metadata?: {
    source: "client" | "background" | "scheduled";
    priority: "low" | "normal" | "high";
    retryCount?: number;
  };
}

export interface CloudFunctionResponse<T = any> {
  success: boolean;
  data?: T;
  error?: {
    code: string;
    message: string;
    details?: any;
  };
  metadata?: {
    processingTime: number;
    tokensUsed?: number;
    modelUsed?: string;
    cost?: number;
  };
}

// Rate limiting types
export interface RateLimitInfo {
  userId: string;
  requestsPerMinute: number;
  requestsPerHour: number;
  lastRequestTime: string;
  isLimited: boolean;
  resetTime: string;
}

// AI Processing types
export interface AIProcessingRequest {
  question: string;
  conversationId: string;
  userId: string;
  context?: {
    previousMessages?: string[];
    userPreferences?: any;
    conversationSummary?: string;
  };
  options?: {
    model?: string;
    temperature?: number;
    maxTokens?: number;
    stream?: boolean;
  };
}

export interface AIProcessingResponse {
  text: string;
  metadata: {
    tokensUsed: number;
    modelUsed: string;
    processingTime: number;
    cost: number;
  };
  context?: {
    conversationSummary?: string;
    relevantHistory?: string[];
  };
}

// Background task types
export interface ConversationSummaryRequest {
  conversationId: string;
  userId: string;
  messages: Array<{
    role: "user" | "assistant";
    content: string;
    timestamp: string;
  }>;
}

export interface AnalyticsProcessingRequest {
  userId: string;
  conversationId: string;
  events: Array<{
    type: string;
    data: any;
    timestamp: string;
  }>;
}

// Error codes
export const ERROR_CODES = {
  RATE_LIMIT_EXCEEDED: "RATE_LIMIT_EXCEEDED",
  AI_PROCESSING_FAILED: "AI_PROCESSING_FAILED",
  INVALID_REQUEST: "INVALID_REQUEST",
  UNAUTHORIZED: "UNAUTHORIZED",
  TIMEOUT: "TIMEOUT",
  BACKGROUND_TASK_FAILED: "BACKGROUND_TASK_FAILED",
} as const;

// Function priorities
export const FUNCTION_PRIORITIES = {
  HIGH: "high", // Real-time AI responses
  NORMAL: "normal", // Standard processing
  LOW: "low", // Background tasks
} as const;
