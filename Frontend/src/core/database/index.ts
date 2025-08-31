/**
 * Database Module
 * Main entry point for all database functionality
 */

// Configuration
export {
  db,
  initializeFirestore,
  COLLECTIONS,
  DB_CONFIG,
} from "./firestore.config";
export type { CollectionName } from "./firestore.config";

// Provider
export { DatabaseProvider, useDatabase } from "./DatabaseProvider";

// Utilities
export * from "./utils/database.utils";

// Services
export { userService } from "./services/user.service";
export { conversationService } from "./services/conversation.service";
export { messageService } from "./services/message.service";
export { contextManagementService } from "./services/context-management.service";

// Types
export type {
  BaseDocument,
  UserDocument,
  ConversationDocument,
  MessageDocument,
  ChatSessionDocument,
  UserPreferencesDocument,
  AnalyticsDocument,
  PaginationParams,
  PaginatedResponse,
  RealtimeListener,
  DatabaseOperation,
  QueryFilter,
  QueryOptions,
} from "./types/database.types";
