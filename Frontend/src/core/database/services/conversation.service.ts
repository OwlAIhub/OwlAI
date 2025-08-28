/**
 * Conversation Service
 * Handles conversation CRUD operations and real-time listeners
 */

import {
  collection,
  doc,
  getDoc,
  getDocs,
  addDoc,
  updateDoc,
  deleteDoc,
  query,
  where,
  orderBy,
  limit,
  startAfter,
  serverTimestamp,
  writeBatch,
  QueryDocumentSnapshot,
  DocumentData,
} from "firebase/firestore";
import { db, COLLECTIONS, DB_CONFIG } from "../firestore.config";
import { logger } from "../../../shared/utils/logger";
import type {
  ConversationDocument,
  PaginationParams,
  PaginatedResponse,
  QueryOptions,
  RealtimeListener,
} from "../types/database.types";

import {
  listenToConversation as listenToConversationHelper,
  listenToUserConversations as listenToUserConversationsHelper,
} from "./conversation.listeners";
import {
  searchConversations as searchConversationsHelper,
  getConversationStats as getConversationStatsHelper,
} from "./conversation.analytics";
import {
  createConversation as createConversationHelper,
  getConversationById as getConversationByIdHelper,
  updateConversation as updateConversationHelper,
  softUpdateStatus as softUpdateStatusHelper,
  updateConversationMetadata as updateConversationMetadataHelper,
  updateConversationAnalytics as updateConversationAnalyticsHelper,
} from "./conversation.crud";

class ConversationService {
  private static instance: ConversationService;

  private constructor() {}

  public static getInstance(): ConversationService {
    if (!ConversationService.instance) {
      ConversationService.instance = new ConversationService();
    }
    return ConversationService.instance;
  }

  /**
   * Create a new conversation
   */
  public async createConversation(
    userId: string,
    data: Partial<ConversationDocument>
  ): Promise<ConversationDocument> {
    return createConversationHelper(userId, data);
  }

  /**
   * Get conversation by ID
   */
  public async getConversation(
    conversationId: string
  ): Promise<ConversationDocument | null> {
    return getConversationByIdHelper(conversationId);
  }

  /**
   * Get user conversations with pagination
   */
  public async getUserConversations(
    userId: string,
    params: PaginationParams = { limit: DB_CONFIG.CONVERSATIONS_PER_PAGE }
  ): Promise<PaginatedResponse<ConversationDocument>> {
    try {
      let q = query(
        collection(db, COLLECTIONS.CONVERSATIONS),
        where("user_id", "==", userId),
        where("status", "!=", "deleted"),
        orderBy("status"),
        orderBy("updated_at", "desc"),
        limit(params.limit)
      );

      if (params.startAfter) {
        q = query(q, startAfter(params.startAfter));
      }

      const querySnapshot = await getDocs(q);
      const conversations: ConversationDocument[] = [];

      querySnapshot.forEach(doc => {
        conversations.push({
          id: doc.id,
          ...doc.data(),
        } as ConversationDocument);
      });

      const hasMore = querySnapshot.docs.length === params.limit;
      const lastDoc = querySnapshot.docs[querySnapshot.docs.length - 1];

      logger.info("User conversations retrieved", "ConversationService", {
        userId,
        count: conversations.length,
        hasMore,
      });

      return {
        data: conversations,
        hasMore,
        lastDoc: hasMore ? lastDoc : undefined,
      };
    } catch (error) {
      logger.error(
        "Failed to get user conversations",
        "ConversationService",
        error
      );
      throw new Error("Failed to get conversations");
    }
  }

  /**
   * Update conversation
   */
  public async updateConversation(
    conversationId: string,
    updates: Partial<ConversationDocument>
  ): Promise<void> {
    return updateConversationHelper(conversationId, updates);
  }

  /**
   * Archive conversation
   */
  public async archiveConversation(conversationId: string): Promise<void> {
    return softUpdateStatusHelper(conversationId, "archived");
  }

  /**
   * Delete conversation (soft delete)
   */
  public async deleteConversation(conversationId: string): Promise<void> {
    return softUpdateStatusHelper(conversationId, "deleted");
  }

  /**
   * Update conversation metadata
   */
  public async updateConversationMetadata(
    conversationId: string,
    metadata: Partial<ConversationDocument["metadata"]>
  ): Promise<void> {
    return updateConversationMetadataHelper(conversationId, metadata);
  }

  /**
   * Update conversation analytics
   */
  public async updateConversationAnalytics(
    conversationId: string,
    analytics: Partial<ConversationDocument["analytics"]>
  ): Promise<void> {
    return updateConversationAnalyticsHelper(conversationId, analytics);
  }

  /**
   * Listen to conversation changes in real-time
   */
  public listenToConversation(
    conversationId: string,
    onData: (conversation: ConversationDocument | null) => void,
    onError: (error: any) => void
  ): RealtimeListener {
    return listenToConversationHelper(conversationId, onData, onError);
  }

  /**
   * Listen to user conversations in real-time
   */
  public listenToUserConversations(
    userId: string,
    onData: (conversations: ConversationDocument[]) => void,
    onError: (error: any) => void
  ): RealtimeListener {
    return listenToUserConversationsHelper(userId, onData, onError);
  }

  /**
   * Search conversations
   */
  public async searchConversations(
    userId: string,
    searchTerm: string,
    options: QueryOptions = {}
  ): Promise<ConversationDocument[]> {
    return searchConversationsHelper(userId, searchTerm, options);
  }

  /**
   * Get conversation statistics
   */
  public async getConversationStats(userId: string): Promise<{
    total: number;
    active: number;
    archived: number;
    totalMessages: number;
    averageMessagesPerConversation: number;
  }> {
    return getConversationStatsHelper(userId);
  }
}

// Export singleton instance
export const conversationService = ConversationService.getInstance();
