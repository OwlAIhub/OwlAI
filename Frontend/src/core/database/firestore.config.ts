/**
 * Firestore Database Configuration
 * Centralized Firestore setup with proper configuration
 */

import {
  getFirestore,
  connectFirestoreEmulator,
  enableIndexedDbPersistence,
} from "firebase/firestore";
import { app } from "../firebase";
import { logger } from "../../shared/utils/logger";

// Initialize Firestore
export const db = getFirestore(app);

// Enable offline persistence
export const initializeFirestore = async (): Promise<void> => {
  try {
    // Enable offline persistence
    await enableIndexedDbPersistence(db, {
      synchronizeTabs: true,
    });

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

// Database configuration
export const DB_CONFIG = {
  // Pagination settings
  MESSAGES_PER_PAGE: 20,
  CONVERSATIONS_PER_PAGE: 10,

  // Cache settings
  CACHE_SIZE_MB: 100,

  // Timeout settings
  QUERY_TIMEOUT: 30000, // 30 seconds

  // Retry settings
  MAX_RETRIES: 3,
  RETRY_DELAY: 1000,
} as const;

// Export types
export type CollectionName = (typeof COLLECTIONS)[keyof typeof COLLECTIONS];
