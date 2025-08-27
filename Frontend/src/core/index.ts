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
  PhoneAuthConfig,
  PhoneAuthResult,
  SMSRateLimit,
  VerificationAttempt,
  PhoneAuthError,
  PhoneAuthSession,
  RateLimitCheck,
  RateLimitInfo,
  SessionData,
} from "./auth";

// Chat
export * from "./chat";

// Theme System
export * from "./theme";

// Config
export { default as config } from "./config/config";

// Firebase
export * from "./firebase/firebase";

// Stores
export * from "./stores";

// Cloud Functions
export * from "./cloud-functions";

// Security & Privacy
export {
  encryptionService,
  gdprService,
  inputSanitizationService,
  auditLoggingService,
  securityPrivacyManager,
  FIRESTORE_SECURITY_RULES,
  SECURITY_RULE_TEMPLATES,
  COMPLETE_FIRESTORE_RULES,
  SECURITY_VALIDATORS,
  AUDIT_EVENT_TYPES,
  AUDIT_LOG_LEVELS,
} from "./security";

export type {
  EncryptionResult,
  DecryptionResult,
  EncryptionStats,
  GDPRRequest,
  DataExport,
  DeletionConfirmation,
  GDPRStats,
  SanitizationResult,
  SanitizationStats,
  AuditLogEntry,
  AuditLogStats,
  SecurityRuleTemplate,
  PermissionLevel,
} from "./security";
