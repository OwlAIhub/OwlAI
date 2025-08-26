/**
 * Application Constants
 */

// App Configuration
export const APP_NAME = "OwlAI";
export const APP_VERSION = "1.0.0";

// Local Storage Keys
export const STORAGE_KEYS = {
  USER: "user",
  USER_PROFILE: "userProfile",
  SESSION_ID: "sessionId",
  SELECTED_CHAT: "selectedChat",
  DARK_MODE: "darkMode",
  ANONYMOUS_USER_ID: "anonymousUserId",
  ANONYMOUS_SESSION_ID: "anonymousSessionId",
  ANONYMOUS_SESSION_INITIALIZED: "anonymousSessionInitialized",
  PRESET_QUERY: "presetQuery",
} as const;

// API Endpoints
export const API_ENDPOINTS = {
  ASK: "/ask",
  SESSION_CREATE: "/session/create",
  SESSION_INIT_ANON: "/session/init-anon",
  SESSION_RENAME: "/chat/session/rename",
  SESSION_DELETE: "/chat/session",
  CHAT_HISTORY: "/chat",
  CHAT_SESSIONS: "/chat/sidebar/sessions",
  FEEDBACK_CREATE: "/feedback/create",
} as const;

// UI Constants
export const BREAKPOINTS = {
  MOBILE: 768,
  TABLET: 1024,
  DESKTOP: 1280,
} as const;

export const SIDEBAR_WIDTH = {
  MOBILE: "w-64",
  DESKTOP: "lg:w-72",
} as const;

export const HEADER_HEIGHT = "h-17"; // 68px

// Animation Durations
export const ANIMATION_DURATION = {
  FAST: 200,
  NORMAL: 300,
  SLOW: 500,
  SIDEBAR: 700,
  TYPING: 1,
} as const;

// Message Limits
export const MESSAGE_LIMITS = {
  ANONYMOUS_MAX: 3,
  TYPING_INTERVAL: 1,
  CACHE_DURATION: 300000, // 5 minutes
} as const;

// Predefined Prompts
export const PREDEFINED_PROMPTS = [
  "Explain Research Methodology",
  "What is Teaching Aptitude?",
  "Explain Logical Reasoning",
  "What is Communication?",
] as const;

// Toast Configuration
export const TOAST_CONFIG = {
  POSITION: "bottom-right",
  AUTO_CLOSE: 3000,
  HIDE_PROGRESS_BAR: false,
  CLOSE_ON_CLICK: true,
  PAUSEON_HOVER: true,
  DRAGGABLE: true,
  NEWEST_ON_TOP: false,
} as const;

// Theme Colors (for reference - actual colors in CSS variables)
export const THEME_COLORS = {
  PRIMARY: "#009688",
  PRIMARY_DARK: "#00796B",
  PRIMARY_LIGHT: "#4DB6AC",
  ACCENT: "#FFC107",
  ACCENT_DARK: "#FFA000",
  BASE_DARK: "#0D1B2A",
  CARD_DARK: "#1B263B",
  CARD_BORDER: "#415A77",
} as const;

// Error Messages
export const ERROR_MESSAGES = {
  NETWORK_ERROR: "Network error. Please check your connection.",
  AUTH_REQUIRED: "Please log in to continue.",
  SESSION_EXPIRED: "Your session has expired. Please log in again.",
  GENERIC_ERROR: "Something went wrong. Please try again.",
  CHAT_LOAD_ERROR: "Failed to load chat history.",
  SEND_MESSAGE_ERROR: "Failed to send message.",
} as const;

// Success Messages
export const SUCCESS_MESSAGES = {
  LOGIN_SUCCESS: "Signed in successfully! 🚀",
  LOGOUT_SUCCESS: "You've been signed out.",
  CHAT_CREATED: "New chat started!",
  CHAT_RENAMED: "Chat renamed successfully",
  CHAT_DELETED: "Chat deleted successfully",
  FEEDBACK_SENT: "Thanks for your feedback!",
  COPIED: "Copied to clipboard",
} as const;
