/**
 * Application Constants
 * Essential constants used throughout the application
 */

// API Configuration
export const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "http://localhost:3000";
export const API_TIMEOUT = 15000; // Reduced from 30s to 15s for faster failure detection

// Local Storage Keys
export const STORAGE_KEYS = {
  USER_PREFERENCES: "owlai_user_preferences",
  AUTH_TOKEN: "owlai_auth_token",
  THEME: "owlai_theme",
  LANGUAGE: "owlai_language",
  USER: "owl_ai_user",
  USER_PROFILE: "owl_ai_user_profile",
  SESSION_ID: "sessionId",
  SELECTED_CHAT: "selectedChat",
  PRESET_QUERY: "presetQuery",
  ANONYMOUS_USER_ID: "anonymousUserId",
  ANONYMOUS_SESSION_ID: "anonymousSessionId",
  DARK_MODE: "darkMode",
};

// Message limits
export const MESSAGE_LIMITS = {
  MAX_LENGTH: 4000,
  MIN_LENGTH: 1,
  TYPING_INDICATOR_DELAY: 1000,
  MESSAGE_TIMEOUT: 15000, // Reduced timeout for faster response feedback
  ANONYMOUS_MAX: 5,
  CACHE_DURATION: 5 * 60 * 1000, // 5 minutes
} as const;

// Animation duration
export const ANIMATION_DURATION = {
  FAST: 150,
  NORMAL: 300,
  SLOW: 500,
  VERY_SLOW: 1000,
  TYPING: 1000,
} as const;

// Predefined prompts for welcome screen
export const PREDEFINED_PROMPTS = [
  "Explain the concept of learning theories in simple terms",
  "What are the key differences between behaviorism and constructivism?",
  "How can I apply cognitive load theory in my teaching?",
  "Give me examples of formative assessment strategies",
  "What are the best practices for classroom management?",
  "How can I differentiate instruction for diverse learners?",
] as const;
