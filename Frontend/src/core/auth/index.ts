/**
 * Authentication Module
 * Main entry point for all authentication functionality
 */

// Services
export { phoneAuthService } from "./services/phone-auth.service";
export { rateLimitService } from "./services/rate-limit.service";
export { userProfileService } from "./services/user-profile.service";
export { sessionService } from "./services/session.service";

// Hooks
export { usePhoneAuth } from "./hooks/usePhoneAuth";

// Components
export { default as Auth } from "./components/auth";

// Utils
export { phoneNumberValidator } from "./utils/phone-validator";

// Types
export type {
  PhoneAuthState,
} from "./types/phone-auth.types";

export type {
  RateLimitCheck,
  RateLimitInfo,
} from "./services/rate-limit.service";
export type { SessionData } from "./services/session.service";

// Re-export Firebase auth for convenience
export { auth } from "../firebase";
