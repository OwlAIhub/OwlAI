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
  onSnapshot,
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
    try {
      const conversationData: Partial<ConversationDocument> = {
        user_id: userId,
        title: data.title || "New Conversation",
        description: data.description,
        status: "active",
        type: data.type || "chat",
        settings: {
          auto_save: true,
          message_history_limit: 100,
          typing_indicator: true,
          read_receipts: true,
          ...data.settings,
        },
        metadata: {
          total_messages: 0,
          participants: [userId],
          tags: [],
          ...data.metadata,
        },
        analytics: {
          total_duration: 0,
          average_response_time: 0,
          ...data.analytics,
        },
        created_at: serverTimestamp() as any,
        updated_at: serverTimestamp() as any,
      };

      const docRef = await addDoc(
        collection(db, COLLECTIONS.CONVERSATIONS),
        conversationData
      );
      const conversation = await getDoc(docRef);

      const result = {
        id: docRef.id,
        ...conversation.data(),
      } as ConversationDocument;

      logger.info("Conversation created successfully", "ConversationService", {
        conversationId: docRef.id,
        userId,
      });

      return result;
    } catch (error) {
      logger.error(
        "Failed to create conversation",
        "ConversationService",
        error
      );
      throw new Error("Failed to create conversation");
    }
  }

  /**
   * Get conversation by ID
   */
  public async getConversation(
    conversationId: string
  ): Promise<ConversationDocument | null> {
    try {
      const docRef = doc(db, COLLECTIONS.CONVERSATIONS, conversationId);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        return {
          id: docSnap.id,
          ...docSnap.data(),
        } as ConversationDocument;
      }

      return null;
    } catch (error) {
      logger.error("Failed to get conversation", "ConversationService", error);
      throw new Error("Failed to get conversation");
    }
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
    try {
      const docRef = doc(db, COLLECTIONS.CONVERSATIONS, conversationId);

      await updateDoc(docRef, {
        ...updates,
        updated_at: serverTimestamp(),
      });

      logger.info("Conversation updated successfully", "ConversationService", {
        conversationId,
        updates: Object.keys(updates),
      });
    } catch (error) {
      logger.error(
        "Failed to update conversation",
        "ConversationService",
        error
      );
      throw new Error("Failed to update conversation");
    }
  }

  /**
   * Archive conversation
   */
  public async archiveConversation(conversationId: string): Promise<void> {
    try {
      await this.updateConversation(conversationId, { status: "archived" });
      logger.info("Conversation archived", "ConversationService", {
        conversationId,
      });
    } catch (error) {
      logger.error(
        "Failed to archive conversation",
        "ConversationService",
        error
      );
      throw new Error("Failed to archive conversation");
    }
  }

  /**
   * Delete conversation (soft delete)
   */
  public async deleteConversation(conversationId: string): Promise<void> {
    try {
      await this.updateConversation(conversationId, { status: "deleted" });
      logger.info("Conversation deleted", "ConversationService", {
        conversationId,
      });
    } catch (error) {
      logger.error(
        "Failed to delete conversation",
        "ConversationService",
        error
      );
      throw new Error("Failed to delete conversation");
    }
  }

  /**
   * Update conversation metadata
   */
  public async updateConversationMetadata(
    conversationId: string,
    metadata: Partial<ConversationDocument["metadata"]>
  ): Promise<void> {
    try {
      const docRef = doc(db, COLLECTIONS.CONVERSATIONS, conversationId);

      await updateDoc(docRef, {
        metadata: metadata,
        updated_at: serverTimestamp(),
      });

      logger.info("Conversation metadata updated", "ConversationService", {
        conversationId,
        metadata: Object.keys(metadata),
      });
    } catch (error) {
      logger.error(
        "Failed to update conversation metadata",
        "ConversationService",
        error
      );
      throw new Error("Failed to update conversation metadata");
    }
  }

  /**
   * Update conversation analytics
   */
  public async updateConversationAnalytics(
    conversationId: string,
    analytics: Partial<ConversationDocument["analytics"]>
  ): Promise<void> {
    try {
      const docRef = doc(db, COLLECTIONS.CONVERSATIONS, conversationId);

      await updateDoc(docRef, {
        analytics: analytics,
        updated_at: serverTimestamp(),
      });

      logger.info("Conversation analytics updated", "ConversationService", {
        conversationId,
        analytics: Object.keys(analytics),
      });
    } catch (error) {
      logger.error(
        "Failed to update conversation analytics",
        "ConversationService",
        error
      );
      throw new Error("Failed to update conversation analytics");
    }
  }

  /**
   * Listen to conversation changes in real-time
   */
  public listenToConversation(
    conversationId: string,
    onData: (conversation: ConversationDocument | null) => void,
    onError: (error: any) => void
  ): RealtimeListener {
    try {
      const docRef = doc(db, COLLECTIONS.CONVERSATIONS, conversationId);

      const unsubscribe = onSnapshot(
        docRef,
        doc => {
          if (doc.exists()) {
            const conversation = {
              id: doc.id,
              ...doc.data(),
            } as ConversationDocument;
            onData(conversation);
          } else {
            onData(null);
          }
        },
        error => {
          logger.error(
            "Conversation listener error",
            "ConversationService",
            error
          );
          onError(error);
        }
      );

      logger.info("Conversation listener started", "ConversationService", {
        conversationId,
      });

      return {
        unsubscribe,
        onData,
        onError,
      };
    } catch (error) {
      logger.error(
        "Failed to start conversation listener",
        "ConversationService",
        error
      );
      throw new Error("Failed to start conversation listener");
    }
  }

  /**
   * Listen to user conversations in real-time
   */
  public listenToUserConversations(
    userId: string,
    onData: (conversations: ConversationDocument[]) => void,
    onError: (error: any) => void
  ): RealtimeListener {
    try {
      const q = query(
        collection(db, COLLECTIONS.CONVERSATIONS),
        where("user_id", "==", userId),
        where("status", "!=", "deleted"),
        orderBy("status"),
        orderBy("updated_at", "desc")
      );

      const unsubscribe = onSnapshot(
        q,
        querySnapshot => {
          const conversations: ConversationDocument[] = [];
          querySnapshot.forEach(doc => {
            conversations.push({
              id: doc.id,
              ...doc.data(),
            } as ConversationDocument);
          });
          onData(conversations);
        },
        error => {
          logger.error(
            "User conversations listener error",
            "ConversationService",
            error
          );
          onError(error);
        }
      );

      logger.info(
        "User conversations listener started",
        "ConversationService",
        { userId }
      );

      return {
        unsubscribe,
        onData,
        onError,
      };
    } catch (error) {
      logger.error(
        "Failed to start user conversations listener",
        "ConversationService",
        error
      );
      throw new Error("Failed to start user conversations listener");
    }
  }

  /**
   * Search conversations
   */
  public async searchConversations(
    userId: string,
    searchTerm: string,
    options: QueryOptions = {}
  ): Promise<ConversationDocument[]> {
    try {
      // Note: Firestore doesn't support full-text search natively
      // This is a basic implementation - consider using Algolia or similar for production
      const conversations = await this.getUserConversations(userId, {
        limit: 100,
      });

      return conversations.data.filter(
        conversation =>
          conversation.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
          conversation.description
            ?.toLowerCase()
            .includes(searchTerm.toLowerCase())
      );
    } catch (error) {
      logger.error(
        "Failed to search conversations",
        "ConversationService",
        error
      );
      throw new Error("Failed to search conversations");
    }
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
    try {
      const conversations = await this.getUserConversations(userId, {
        limit: 1000,
      });

      const stats = {
        total: conversations.data.length,
        active: conversations.data.filter(c => c.status === "active").length,
        archived: conversations.data.filter(c => c.status === "archived")
          .length,
        totalMessages: conversations.data.reduce(
          (sum, c) => sum + (c.metadata.total_messages || 0),
          0
        ),
        averageMessagesPerConversation: 0,
      };

      stats.averageMessagesPerConversation =
        stats.total > 0 ? Math.round(stats.totalMessages / stats.total) : 0;

      return stats;
    } catch (error) {
      logger.error(
        "Failed to get conversation stats",
        "ConversationService",
        error
      );
      throw new Error("Failed to get conversation statistics");
    }
  }
}

// Export singleton instance
export const conversationService = ConversationService.getInstance();
