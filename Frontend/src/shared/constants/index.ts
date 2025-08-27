/**
 * Application Constants
 * Centralized constants for the entire application
 */

// ============================================================================
// STORAGE KEYS
// ============================================================================

export const STORAGE_KEYS = {
  // User data
  USER: "owl_ai_user",
  USER_PROFILE: "owl_ai_user_profile",
  USER_PREFERENCES: "owl_ai_user_preferences",

  // Chat data
  CHAT_SESSIONS: "owl_ai_chat_sessions",
  CURRENT_SESSION: "owl_ai_current_session",
  SELECTED_CHAT: "owl_ai_selected_chat",

  // App settings
  THEME: "owl_ai_theme",
  LANGUAGE: "owl_ai_language",
  SIDEBAR_STATE: "owl_ai_sidebar_state",

  // Session data
  SESSION_ID: "owl_ai_session_id",
  ANONYMOUS_SESSION: "owl_ai_anonymous_session",

  // Questionnaire
  QUESTIONNAIRE_ANSWERS: "owl_ai_questionnaire_answers",
  QUESTIONNAIRE_COMPLETE: "owl_ai_questionnaire_complete",

  // Analytics
  ANALYTICS_CONSENT: "owl_ai_analytics_consent",
  FIRST_VISIT: "owl_ai_first_visit",
} as const;

// ============================================================================
// API ENDPOINTS
// ============================================================================

export const API_ENDPOINTS = {
  // Auth
  AUTH_LOGIN: "/auth/login",
  AUTH_LOGOUT: "/auth/logout",
  AUTH_REFRESH: "/auth/refresh",

  // Chat
  CHAT_SESSIONS: "/chat/sessions",
  CHAT_MESSAGES: "/chat/messages",
  CHAT_SEND: "/chat/send",

  // User
  USER_PROFILE: "/users/profile",
  USER_PREFERENCES: "/users/preferences",

  // Session
  SESSION_CREATE: "/session/create",
  SESSION_INIT_ANON: "/session/init-anon",

  // Feedback
  FEEDBACK_SUBMIT: "/feedback/submit",
} as const;

// ============================================================================
// APP CONFIGURATION
// ============================================================================

export const APP_CONFIG = {
  NAME: "OWL AI",
  VERSION: "1.0.0",
  DESCRIPTION: "AI-powered learning assistant for exam preparation",

  // Features
  FEATURES: {
    PHONE_AUTH: true,
    ANONYMOUS_CHAT: true,
    QUESTIONNAIRE: true,
    SUBSCRIPTION: true,
    ANALYTICS: false,
  },

  // Limits
  LIMITS: {
    MAX_MESSAGE_LENGTH: 4000,
    MAX_CHAT_SESSIONS: 50,
    MAX_MESSAGES_PER_SESSION: 100,
    SESSION_TIMEOUT: 30 * 60 * 1000, // 30 minutes
  },

  // UI
  UI: {
    SIDEBAR_WIDTH: 280,
    HEADER_HEIGHT: 64,
    ANIMATION_DURATION: 300,
    DEBOUNCE_DELAY: 300,
  },
} as const;

// ============================================================================
// MESSAGE CONSTANTS
// ============================================================================

export const MESSAGE_LIMITS = {
  MAX_LENGTH: 4000,
  MIN_LENGTH: 1,
  TYPING_INDICATOR_DELAY: 1000,
  MESSAGE_TIMEOUT: 30000,
} as const;

export const ANIMATION_DURATION = {
  FAST: 150,
  NORMAL: 300,
  SLOW: 500,
  VERY_SLOW: 1000,
} as const;

// ============================================================================
// BREAKPOINTS
// ============================================================================

export const BREAKPOINTS = {
  MOBILE: 768,
  TABLET: 1024,
  DESKTOP: 1280,
  LARGE_DESKTOP: 1536,
} as const;

// ============================================================================
// THEME CONSTANTS
// ============================================================================

export const THEMES = {
  LIGHT: "light",
  DARK: "dark",
  AUTO: "auto",
} as const;

export const COLORS = {
  PRIMARY: {
    50: "#f0fdf4",
    100: "#dcfce7",
    200: "#bbf7d0",
    300: "#86efac",
    400: "#4ade80",
    500: "#22c55e",
    600: "#16a34a",
    700: "#15803d",
    800: "#166534",
    900: "#14532d",
  },
  GRAY: {
    50: "#f9fafb",
    100: "#f3f4f6",
    200: "#e5e7eb",
    300: "#d1d5db",
    400: "#9ca3af",
    500: "#6b7280",
    600: "#4b5563",
    700: "#374151",
    800: "#1f2937",
    900: "#111827",
  },
} as const;

// ============================================================================
// ERROR MESSAGES
// ============================================================================

export const ERROR_MESSAGES = {
  // Auth errors
  AUTH_FAILED: "Authentication failed. Please try again.",
  INVALID_CREDENTIALS: "Invalid email or password.",
  USER_NOT_FOUND: "User not found.",
  EMAIL_ALREADY_EXISTS: "An account with this email already exists.",
  WEAK_PASSWORD: "Password is too weak. Please choose a stronger password.",

  // Network errors
  NETWORK_ERROR: "Network error. Please check your connection.",
  TIMEOUT_ERROR: "Request timeout. Please try again.",
  SERVER_ERROR: "Server error. Please try again later.",

  // Chat errors
  CHAT_CREATE_FAILED: "Failed to create chat session.",
  MESSAGE_SEND_FAILED: "Failed to send message.",
  CHAT_LOAD_FAILED: "Failed to load chat history.",

  // General errors
  UNKNOWN_ERROR: "An unknown error occurred.",
  VALIDATION_ERROR: "Please check your input and try again.",
  PERMISSION_DENIED: "You do not have permission to perform this action.",
} as const;

// ============================================================================
// SUCCESS MESSAGES
// ============================================================================

export const SUCCESS_MESSAGES = {
  // Auth
  LOGIN_SUCCESS: "Successfully logged in.",
  LOGOUT_SUCCESS: "Successfully logged out.",
  SIGNUP_SUCCESS: "Account created successfully.",

  // Chat
  MESSAGE_SENT: "Message sent successfully.",
  CHAT_CREATED: "Chat session created.",
  CHAT_DELETED: "Chat session deleted.",

  // Profile
  PROFILE_UPDATED: "Profile updated successfully.",
  PREFERENCES_SAVED: "Preferences saved successfully.",

  // General
  CHANGES_SAVED: "Changes saved successfully.",
  OPERATION_SUCCESS: "Operation completed successfully.",
} as const;

// ============================================================================
// VALIDATION RULES
// ============================================================================

export const VALIDATION_RULES = {
  // Email
  EMAIL: {
    PATTERN: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
    MESSAGE: "Please enter a valid email address.",
  },

  // Password
  PASSWORD: {
    MIN_LENGTH: 8,
    PATTERN: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/,
    MESSAGE:
      "Password must be at least 8 characters with uppercase, lowercase, number, and special character.",
  },

  // Phone
  PHONE: {
    PATTERN: /^\+?[1-9]\d{1,14}$/,
    MESSAGE: "Please enter a valid phone number.",
  },

  // Name
  NAME: {
    MIN_LENGTH: 2,
    MAX_LENGTH: 50,
    PATTERN: /^[a-zA-Z\s]+$/,
    MESSAGE: "Name must be 2-50 characters with only letters and spaces.",
  },
} as const;

// ============================================================================
// LOCAL STORAGE UTILITIES
// ============================================================================

export const STORAGE_UTILS = {
  // Get item with type safety
  get: <T>(key: string, defaultValue?: T): T | null => {
    try {
      const item = localStorage.getItem(key);
      return item ? JSON.parse(item) : defaultValue || null;
    } catch {
      return defaultValue || null;
    }
  },

  // Set item with error handling
  set: <T>(key: string, value: T): void => {
    try {
      localStorage.setItem(key, JSON.stringify(value));
    } catch (error) {
      console.error("Failed to save to localStorage:", error);
    }
  },

  // Remove item
  remove: (key: string): void => {
    try {
      localStorage.removeItem(key);
    } catch (error) {
      console.error("Failed to remove from localStorage:", error);
    }
  },

  // Clear all app data
  clear: (): void => {
    try {
      Object.values(STORAGE_KEYS).forEach(key => {
        localStorage.removeItem(key);
      });
    } catch (error) {
      console.error("Failed to clear localStorage:", error);
    }
  },
} as const;
