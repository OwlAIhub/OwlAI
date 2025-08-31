/**
 * Core Module Exports
 * All core functionality including auth, chat, config, and firebase
 */

// Auth
export {
  phoneAuthService,
  rateLimitService,
  userProfileService,
  sessionService,
  usePhoneAuth,
  phoneNumberValidator,
  auth,
} from "./auth";

export type {
  PhoneAuthState,
  RateLimitCheck,
  RateLimitInfo,
  SessionData,
} from "./auth";

// Chat
export * from "./chat";

// Theme System (removed - unused)

// Firebase
export * from "./firebase/firebase";

// Stores
export * from "./stores";

// Security & Privacy (removed unused module)
