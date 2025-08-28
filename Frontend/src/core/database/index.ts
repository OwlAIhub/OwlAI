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

// Services
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
