// ========================================
// PRODUCTION-READY FIREBASE CONFIGURATION
// ========================================
// Single source of truth for all Firebase services
// Includes comprehensive error handling and security

import { initializeApp, getApps, FirebaseApp } from "firebase/app";
import { getInstallations } from "firebase/installations";
import { getAnalytics, isSupported, Analytics } from "firebase/analytics";
import {
  getFirestore,
  Firestore,
  connectFirestoreEmulator,
  doc,
  getDoc,
} from "firebase/firestore";
import { 
  getAuth, 
  Auth, 
  connectAuthEmulator, 
  setPersistence, 
  browserLocalPersistence
} from "firebase/auth";
import {
  getStorage,
  FirebaseStorage,
  connectStorageEmulator,
} from "firebase/storage";
import { getPerformance } from "firebase/performance";
import type { FirebasePerformance } from "firebase/performance";

// ========================================
// ENVIRONMENT VALIDATION
// ========================================

interface FirebaseConfig {
  apiKey: string;
  authDomain: string;
  projectId: string;
  storageBucket: string;
  messagingSenderId: string;
  appId: string;
  measurementId?: string;
}

interface AppConfig {
  firebase: FirebaseConfig;
  environment: 'development' | 'production' | 'test';
  features: {
    useEmulators: boolean;
    enableAnalytics: boolean;
    enableErrorReporting: boolean;
    enablePerformanceMonitoring: boolean;
    debugMode: boolean;
  };
  security: {
    otpCooldownSeconds: number;
    maxOtpAttempts: number;
    sessionTimeoutMinutes: number;
  };
}

function validateRequiredEnvVar(name: string, value: string | undefined): string {
  if (!value || value.trim() === '') {
    throw new Error(`Missing required environment variable: ${name}`);
  }
  return value;
}

function getAppConfig(): AppConfig {
  // Validate all required environment variables
  const config: AppConfig = {
    firebase: {
      apiKey: validateRequiredEnvVar('NEXT_PUBLIC_FIREBASE_API_KEY', process.env.NEXT_PUBLIC_FIREBASE_API_KEY),
      authDomain: validateRequiredEnvVar('NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN', process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN),
      projectId: validateRequiredEnvVar('NEXT_PUBLIC_FIREBASE_PROJECT_ID', process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID),
      storageBucket: validateRequiredEnvVar('NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET', process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET),
      messagingSenderId: validateRequiredEnvVar('NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID', process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID),
      appId: validateRequiredEnvVar('NEXT_PUBLIC_FIREBASE_APP_ID', process.env.NEXT_PUBLIC_FIREBASE_APP_ID),
      measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID,
    },
    environment: (process.env.NEXT_PUBLIC_ENV as 'development' | 'production' | 'test') || 'development',
    features: {
      useEmulators: process.env.NEXT_PUBLIC_USE_FIREBASE_EMULATORS === 'true',
      enableAnalytics: process.env.NEXT_PUBLIC_ENABLE_ANALYTICS === 'true',
      enableErrorReporting: process.env.NEXT_PUBLIC_ENABLE_ERROR_REPORTING === 'true',
      enablePerformanceMonitoring: process.env.NEXT_PUBLIC_ENABLE_PERFORMANCE_MONITORING === 'true',
      debugMode: process.env.NEXT_PUBLIC_DEBUG_FIREBASE === 'true',
    },
    security: {
      otpCooldownSeconds: parseInt(process.env.NEXT_PUBLIC_OTP_COOLDOWN_SECONDS || '30'),
      maxOtpAttempts: parseInt(process.env.NEXT_PUBLIC_MAX_OTP_ATTEMPTS || '5'),
      sessionTimeoutMinutes: parseInt(process.env.NEXT_PUBLIC_SESSION_TIMEOUT_MINUTES || '60'),
    },
  };

  if (config.features.debugMode) {
    console.log('🔧 Firebase Config Debug:', {
      environment: config.environment,
      projectId: config.firebase.projectId,
      features: config.features,
      security: config.security,
    });
  }

  return config;
}

// ========================================
// ERROR HANDLING & LOGGING
// ========================================

class FirebaseLogger {
  private debugMode: boolean;

  constructor(debugMode: boolean) {
    this.debugMode = debugMode;
  }

  info(message: string, data?: unknown) {
    if (this.debugMode) {
      console.log(`🔥 Firebase: ${message}`, data);
    }
  }

  warn(message: string, error?: unknown) {
    console.warn(`⚠️ Firebase Warning: ${message}`, error);
  }

  error(message: string, error?: unknown) {
    console.error(`❌ Firebase Error: ${message}`, error);
    
    // In production, you could send this to error monitoring service
    if (typeof window !== 'undefined' && process.env.NODE_ENV === 'production') {
      // Example: Send to error monitoring service
      // errorMonitoringService.captureException(error, { context: message });
    }
  }
}

// ========================================
// FIREBASE INITIALIZATION
// ========================================

let app: FirebaseApp;
let auth: Auth;
let db: Firestore;
let storage: FirebaseStorage;
let analytics: Analytics | null = null;
let performance: FirebasePerformance | null = null;
let logger: FirebaseLogger;
let appConfig: AppConfig;

function initializeFirebaseApp(): FirebaseApp {
  try {
    appConfig = getAppConfig();
    logger = new FirebaseLogger(appConfig.features.debugMode);
    
    logger.info('Initializing Firebase app', { projectId: appConfig.firebase.projectId });

    // Check if app is already initialized
    if (getApps().length === 0) {
      app = initializeApp(appConfig.firebase);
      logger.info('Firebase app initialized successfully');
    } else {
      app = getApps()[0];
      logger.info('Using existing Firebase app instance');
    }

    return app;
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    console.error('❌ Failed to initialize Firebase app:', errorMessage);
    throw new Error(`Firebase initialization failed: ${errorMessage}`);
  }
}

function initializeFirebaseAuth(): Auth {
  try {
    auth = getAuth(app);
    logger.info('Firebase Auth initialized');

    // Configure auth persistence
    setPersistence(auth, browserLocalPersistence).catch((error) => {
      logger.warn('Failed to set auth persistence:', error);
    });

    // Connect to Auth emulator in development
    if (appConfig.features.useEmulators && appConfig.environment === 'development') {
      try {
        connectAuthEmulator(auth, "http://localhost:9099", {
          disableWarnings: true,
        });
        logger.info('Connected to Firebase Auth emulator');
      } catch (error) {
        logger.warn('Failed to connect to Auth emulator:', error);
      }
    }

    return auth;
  } catch (error) {
    logger.error('Failed to initialize Firebase Auth:', error);
    throw error;
  }
}

function initializeFirestore(): Firestore {
  try {
    db = getFirestore(app);
    logger.info('Firestore initialized');

    // Connect to Firestore emulator in development
    if (appConfig.features.useEmulators && appConfig.environment === 'development') {
      try {
        connectFirestoreEmulator(db, "localhost", 8080);
        logger.info('Connected to Firestore emulator');
      } catch (error) {
        logger.warn('Failed to connect to Firestore emulator:', error);
      }
    }

    return db;
  } catch (error) {
    logger.error('Failed to initialize Firestore:', error);
    throw error;
  }
}

function initializeStorage(): FirebaseStorage {
  try {
    storage = getStorage(app);
    logger.info('Firebase Storage initialized');

    // Connect to Storage emulator in development
    if (appConfig.features.useEmulators && appConfig.environment === 'development') {
      try {
        connectStorageEmulator(storage, "localhost", 9199);
        logger.info('Connected to Firebase Storage emulator');
      } catch (error) {
        logger.warn('Failed to connect to Storage emulator:', error);
      }
    }

    return storage;
  } catch (error) {
    logger.error('Failed to initialize Firebase Storage:', error);
    throw error;
  }
}

async function initializeAnalytics(): Promise<Analytics | null> {
  if (!appConfig.features.enableAnalytics || typeof window === 'undefined') {
    return null;
  }

  try {
    const supported = await isSupported();
    if (supported && appConfig.environment === 'production') {
      analytics = getAnalytics(app);
      logger.info('Firebase Analytics initialized');
      return analytics;
    } else {
      logger.info('Firebase Analytics not supported or disabled');
      return null;
    }
  } catch (error) {
    logger.warn('Failed to initialize Firebase Analytics:', error);
    return null;
  }
}

async function initializePerformance(): Promise<FirebasePerformance | null> {
  if (!appConfig.features.enablePerformanceMonitoring || typeof window === 'undefined') {
    return null;
  }

  try {
    if (appConfig.environment === 'production') {
      performance = getPerformance(app);
      logger.info('Firebase Performance initialized');
      return performance;
    } else {
      logger.info('Firebase Performance disabled in development');
      return null;
    }
  } catch (error) {
    logger.warn('Failed to initialize Firebase Performance:', error);
    return null;
  }
}

function handleInstallations() {
  try {
    // Initialize installations service with error handling
    getInstallations(app);
    logger.info('Firebase Installations initialized');
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    const errorCode = error && typeof error === 'object' && 'code' in error ? (error as { code: string }).code : '';
    
    if (errorCode === 'installations/request-failed' || 
        errorMessage.includes('PERMISSION_DENIED')) {
      logger.warn('Firebase Installations API not available - this is normal for some hosting configurations');
    } else {
      logger.warn('Firebase Installations initialization failed:', error);
    }
  }
}

// ========================================
// INITIALIZATION & EXPORTS
// ========================================

// Initialize Firebase services
try {
  app = initializeFirebaseApp();
  auth = initializeFirebaseAuth();
  db = initializeFirestore();
  storage = initializeStorage();
  
  // Handle installations
  handleInstallations();
  
  // Initialize optional services asynchronously
  if (typeof window !== 'undefined') {
    initializeAnalytics().then((analyticsInstance) => {
      analytics = analyticsInstance;
    });
    
    initializePerformance().then((performanceInstance) => {
      performance = performanceInstance;
    });
  }
  
} catch (error) {
  console.error('🚨 Critical Firebase initialization error:', error);
  throw error;
}

// ========================================
// UTILITY FUNCTIONS
// ========================================

export const checkFirebaseConnection = async (): Promise<boolean> => {
  try {
    // Simple test to check if Firebase is accessible
    const testDoc = doc(db, "test", "connection");
    await getDoc(testDoc);
    return true;
  } catch (error) {
    logger.error("Firebase connection check failed:", error);
    return false;
  }
};

export const getFirebaseErrorMessage = (error: unknown): string => {
  if (typeof error === "object" && error !== null && "code" in error) {
    const firebaseError = error as { code: string; message: string };

    switch (firebaseError.code) {
      case "auth/user-not-found":
        return "No user found with this phone number.";
      case "auth/invalid-verification-code":
        return "Invalid verification code. Please check and try again.";
      case "auth/code-expired":
        return "Verification code has expired. Please request a new one.";
      case "auth/too-many-requests":
        return "Too many attempts. Please wait before trying again.";
      case "auth/invalid-phone-number":
        return "Please enter a valid phone number.";
      case "auth/quota-exceeded":
        return "SMS quota exceeded. Please try again later.";
      case "auth/captcha-check-failed":
        return "Security verification failed. Please refresh and try again.";
      case "auth/billing-not-enabled":
        return "Phone authentication is not properly configured.";
      case "permission-denied":
        return "You do not have permission to perform this action.";
      case "unavailable":
        return "Service is currently unavailable. Please try again later.";
      case "not-found":
        return "The requested resource was not found.";
      default:
        return firebaseError.message || "An unexpected error occurred.";
    }
  }

  if (error instanceof Error) {
    return error.message;
  }

  return "An unexpected error occurred.";
};

// ========================================
// EXPORTS
// ========================================

export { 
  app as default, 
  auth, 
  db, 
  storage, 
  analytics, 
  performance,
  appConfig,
  logger 
};

// Type exports for better TypeScript support
export type { FirebaseConfig, AppConfig };