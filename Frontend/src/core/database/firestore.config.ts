/**
 * Firestore Database Configuration
 * Centralized Firestore setup with proper configuration
 */

import {
  getFirestore,
  connectFirestoreEmulator,
  enableMultiTabIndexedDbPersistence,
} from "firebase/firestore";
import { app } from "../firebase";
import { logger } from "../../shared/utils/logger";

// Initialize Firestore
export const db = getFirestore(app);

// Enable offline persistence
export const initializeFirestore = async (): Promise<void> => {
  try {
    // Check if persistence is already enabled
    try {
      // Enable offline persistence (multi-tab)
      await enableMultiTabIndexedDbPersistence(db);
    } catch (persistenceError: any) {
      // If persistence is already enabled, this is fine
      if (persistenceError.code === "failed-precondition") {
        logger.info("Persistence already enabled", "FirestoreConfig");
      } else {
        throw persistenceError;
      }
    }

    // Connect to emulator in development
    if (
      import.meta.env.DEV &&
      import.meta.env.VITE_USE_FIRESTORE_EMULATOR === "true"
    ) {
      connectFirestoreEmulator(db, "localhost", 8080);
      logger.info("Connected to Firestore emulator", "FirestoreConfig");
    }

    logger.info("Firestore initialized successfully", "FirestoreConfig");
  } catch (error) {
    logger.error("Failed to initialize Firestore", "FirestoreConfig", error);
    throw error;
  }
};

// Collection names
export const COLLECTIONS = {
  USERS: "users",
  CONVERSATIONS: "conversations",
  MESSAGES: "messages",
  USER_PREFERENCES: "user_preferences",
  CHAT_SESSIONS: "chat_sessions",
  ANALYTICS: "analytics",
} as const;

// Database configuration (optimized for performance)
export const DB_CONFIG = {
  // Pagination settings
  MESSAGES_PER_PAGE: 20,
  CONVERSATIONS_PER_PAGE: 10,

  // Cache settings (increased for better performance)
  CACHE_SIZE_MB: 150,
  ENABLE_OFFLINE_PERSISTENCE: true,
  ENABLE_REALTIME_CACHE: true,

  // Timeout settings (reduced for faster failure detection)
  QUERY_TIMEOUT: 15000, // 15 seconds (reduced from 30s)
  CONNECTION_TIMEOUT: 10000, // 10 seconds

  // Retry settings (optimized)
  MAX_RETRIES: 2, // Reduced from 3
  RETRY_DELAY: 500, // Reduced from 1000ms
  EXPONENTIAL_BACKOFF: true,

  // Performance optimizations
  USE_BATCH_OPERATIONS: true,
  PRELOAD_RECENT_CONVERSATIONS: true,
  CACHE_QUERY_RESULTS: true,
  ENABLE_COMPRESSION: true,
} as const;

// Export types
export type CollectionName = (typeof COLLECTIONS)[keyof typeof COLLECTIONS];
