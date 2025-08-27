/**
 * Message Service
 * Handles message CRUD operations, real-time listeners, and pagination
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
  increment,
  QueryDocumentSnapshot,
  DocumentData,
} from "firebase/firestore";
import { db, COLLECTIONS, DB_CONFIG } from "../firestore.config";
import { logger } from "../../../shared/utils/logger";
import { conversationService } from "./conversation.service";
import { batchService, queryService, cacheService } from "../optimization";
import type {
  MessageDocument,
  PaginationParams,
  PaginatedResponse,
  QueryOptions,
  RealtimeListener,
} from "../types/database.types";

class MessageService {
  private static instance: MessageService;

  private constructor() {}

  public static getInstance(): MessageService {
    if (!MessageService.instance) {
      MessageService.instance = new MessageService();
    }
    return MessageService.instance;
  }

  /**
   * Send a new message
   */
  public async sendMessage(
    conversationId: string,
    userId: string,
    data: Partial<MessageDocument>
  ): Promise<MessageDocument> {
    try {
      const messageData: Partial<MessageDocument> = {
        conversation_id: conversationId,
        user_id: userId,
        content: data.content || "",
        type: data.type || "text",
        role: data.role || "user",
        status: "sent",
        metadata: {
          tokens_used: data.metadata?.tokens_used,
          model_used: data.metadata?.model_used,
          response_time: data.metadata?.response_time,
          context_length: data.metadata?.context_length,
          attachments: data.metadata?.attachments,
        },
        parent_message_id: data.parent_message_id,
        reactions: {},
        created_at: serverTimestamp() as any,
        updated_at: serverTimestamp() as any,
      };

      // Use batch service for optimized operations
      batchService.addMessage(messageData);

      // Add conversation metadata update to batch
      batchService.addConversationIncrement(
        conversationId,
        "total_messages",
        1
      );
      batchService.addConversationMetadataUpdate(conversationId, {
        last_message_at: serverTimestamp() as any,
        last_message_preview: data.content?.substring(0, 100) || "",
      });

      // Invalidate cache for this conversation
      cacheService.invalidateByPattern(`conversation:${conversationId}`);

      // For immediate response, create a temporary result
      const result = {
        id: `temp-${Date.now()}`, // Temporary ID until batch is committed
        ...messageData,
      } as MessageDocument;

      logger.info("Message sent successfully", "MessageService", {
        messageId: result.id,
        conversationId,
        userId,
        role: data.role,
      });

      return result;
    } catch (error) {
      logger.error("Failed to send message", "MessageService", error);
      throw new Error("Failed to send message");
    }
  }

  /**
   * Get message by ID
   */
  public async getMessage(messageId: string): Promise<MessageDocument | null> {
    try {
      const docRef = doc(db, COLLECTIONS.MESSAGES, messageId);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        return {
          id: docSnap.id,
          ...docSnap.data(),
        } as MessageDocument;
      }

      return null;
    } catch (error) {
      logger.error("Failed to get message", "MessageService", error);
      throw new Error("Failed to get message");
    }
  }

  /**
   * Get conversation messages with optimization
   */
  public async getConversationMessages(
    conversationId: string,
    params: PaginationParams = { limit: DB_CONFIG.MESSAGES_PER_PAGE }
  ): Promise<PaginatedResponse<MessageDocument>> {
    try {
      // Use optimized query service with caching
      const result = await queryService.getConversationMessages(
        conversationId,
        {
          limit: params.limit,
          startAfter: params.startAfter,
          useCache: true,
          cacheTTL: 2 * 60 * 1000, // 2 minutes
        }
      );

      logger.info(
        "Conversation messages retrieved with optimization",
        "MessageService",
        {
          conversationId,
          count: result.data.length,
          hasMore: result.hasMore,
        }
      );

      return {
        data: result.data,
        hasMore: result.hasMore,
        lastDoc: result.lastDoc || undefined,
      };
    } catch (error) {
      logger.error(
        "Failed to get conversation messages",
        "MessageService",
        error
      );
      throw new Error("Failed to get messages");
    }
  }

  /**
   * Update message
   */
  public async updateMessage(
    messageId: string,
    updates: Partial<MessageDocument>
  ): Promise<void> {
    try {
      const docRef = doc(db, COLLECTIONS.MESSAGES, messageId);

      await updateDoc(docRef, {
        ...updates,
        updated_at: serverTimestamp(),
      });

      logger.info("Message updated successfully", "MessageService", {
        messageId,
        updates: Object.keys(updates),
      });
    } catch (error) {
      logger.error("Failed to update message", "MessageService", error);
      throw new Error("Failed to update message");
    }
  }

  /**
   * Update message status
   */
  public async updateMessageStatus(
    messageId: string,
    status: MessageDocument["status"]
  ): Promise<void> {
    try {
      await this.updateMessage(messageId, { status });
      logger.info("Message status updated", "MessageService", {
        messageId,
        status,
      });
    } catch (error) {
      logger.error("Failed to update message status", "MessageService", error);
      throw new Error("Failed to update message status");
    }
  }

  /**
   * Add reaction to message
   */
  public async addReaction(
    messageId: string,
    userId: string,
    reaction: "like" | "dislike" | "helpful" | "unhelpful"
  ): Promise<void> {
    try {
      const docRef = doc(db, COLLECTIONS.MESSAGES, messageId);

      await updateDoc(docRef, {
        [`reactions.${userId}`]: reaction,
        updated_at: serverTimestamp(),
      });

      logger.info("Message reaction added", "MessageService", {
        messageId,
        userId,
        reaction,
      });
    } catch (error) {
      logger.error("Failed to add message reaction", "MessageService", error);
      throw new Error("Failed to add reaction");
    }
  }

  /**
   * Remove reaction from message
   */
  public async removeReaction(
    messageId: string,
    userId: string
  ): Promise<void> {
    try {
      const docRef = doc(db, COLLECTIONS.MESSAGES, messageId);

      await updateDoc(docRef, {
        [`reactions.${userId}`]: null,
        updated_at: serverTimestamp(),
      });

      logger.info("Message reaction removed", "MessageService", {
        messageId,
        userId,
      });
    } catch (error) {
      logger.error(
        "Failed to remove message reaction",
        "MessageService",
        error
      );
      throw new Error("Failed to remove reaction");
    }
  }

  /**
   * Delete message (soft delete)
   */
  public async deleteMessage(messageId: string): Promise<void> {
    try {
      const message = await this.getMessage(messageId);
      if (!message) {
        throw new Error("Message not found");
      }

      await this.updateMessage(messageId, { status: "deleted" });

      // Update conversation metadata
      await this.updateConversationMetadata(message.conversation_id, {
        total_messages: increment(-1),
      });

      logger.info("Message deleted", "MessageService", { messageId });
    } catch (error) {
      logger.error("Failed to delete message", "MessageService", error);
      throw new Error("Failed to delete message");
    }
  }

  /**
   * Listen to conversation messages in real-time
   */
  public listenToConversationMessages(
    conversationId: string,
    onData: (messages: MessageDocument[]) => void,
    onError: (error: any) => void
  ): RealtimeListener {
    try {
      const q = query(
        collection(db, COLLECTIONS.MESSAGES),
        where("conversation_id", "==", conversationId),
        orderBy("created_at", "asc")
      );

      const unsubscribe = onSnapshot(
        q,
        querySnapshot => {
          const messages: MessageDocument[] = [];
          querySnapshot.forEach(doc => {
            messages.push({
              id: doc.id,
              ...doc.data(),
            } as MessageDocument);
          });
          onData(messages);
        },
        error => {
          logger.error(
            "Conversation messages listener error",
            "MessageService",
            error
          );
          onError(error);
        }
      );

      logger.info("Conversation messages listener started", "MessageService", {
        conversationId,
      });

      return {
        unsubscribe,
        onData,
        onError,
      };
    } catch (error) {
      logger.error(
        "Failed to start conversation messages listener",
        "MessageService",
        error
      );
      throw new Error("Failed to start messages listener");
    }
  }

  /**
   * Listen to new messages in real-time
   */
  public listenToNewMessages(
    conversationId: string,
    onData: (message: MessageDocument) => void,
    onError: (error: any) => void
  ): RealtimeListener {
    try {
      const q = query(
        collection(db, COLLECTIONS.MESSAGES),
        where("conversation_id", "==", conversationId),
        orderBy("created_at", "desc"),
        limit(1)
      );

      const unsubscribe = onSnapshot(
        q,
        querySnapshot => {
          if (!querySnapshot.empty) {
            const doc = querySnapshot.docs[0];
            const message = {
              id: doc.id,
              ...doc.data(),
            } as MessageDocument;
            onData(message);
          }
        },
        error => {
          logger.error("New messages listener error", "MessageService", error);
          onError(error);
        }
      );

      logger.info("New messages listener started", "MessageService", {
        conversationId,
      });

      return {
        unsubscribe,
        onData,
        onError,
      };
    } catch (error) {
      logger.error(
        "Failed to start new messages listener",
        "MessageService",
        error
      );
      throw new Error("Failed to start new messages listener");
    }
  }

  /**
   * Search messages in conversation
   */
  public async searchMessages(
    conversationId: string,
    searchTerm: string,
    options: QueryOptions = {}
  ): Promise<MessageDocument[]> {
    try {
      // Note: Firestore doesn't support full-text search natively
      // This is a basic implementation - consider using Algolia or similar for production
      const messages = await this.getConversationMessages(conversationId, {
        limit: 1000,
      });

      return messages.data.filter(message =>
        message.content.toLowerCase().includes(searchTerm.toLowerCase())
      );
    } catch (error) {
      logger.error("Failed to search messages", "MessageService", error);
      throw new Error("Failed to search messages");
    }
  }

  /**
   * Get message statistics
   */
  public async getMessageStats(conversationId: string): Promise<{
    total: number;
    userMessages: number;
    assistantMessages: number;
    systemMessages: number;
    averageResponseTime: number;
    totalTokens: number;
  }> {
    try {
      const messages = await this.getConversationMessages(conversationId, {
        limit: 1000,
      });

      const stats = {
        total: messages.data.length,
        userMessages: messages.data.filter(m => m.role === "user").length,
        assistantMessages: messages.data.filter(m => m.role === "assistant")
          .length,
        systemMessages: messages.data.filter(m => m.role === "system").length,
        averageResponseTime: 0,
        totalTokens: 0,
      };

      // Calculate average response time
      const responseTimes = messages.data
        .filter(m => m.metadata?.response_time)
        .map(m => m.metadata.response_time!);

      if (responseTimes.length > 0) {
        stats.averageResponseTime = Math.round(
          responseTimes.reduce((sum, time) => sum + time, 0) /
            responseTimes.length
        );
      }

      // Calculate total tokens
      const tokens = messages.data
        .filter(m => m.metadata?.tokens_used)
        .map(m => m.metadata.tokens_used!);

      stats.totalTokens = tokens.reduce((sum, token) => sum + token, 0);

      return stats;
    } catch (error) {
      logger.error("Failed to get message stats", "MessageService", error);
      throw new Error("Failed to get message statistics");
    }
  }

  /**
   * Update conversation metadata helper
   */
  private async updateConversationMetadata(
    conversationId: string,
    metadata: any
  ): Promise<void> {
    try {
      await conversationService.updateConversationMetadata(
        conversationId,
        metadata
      );
    } catch (error) {
      logger.error(
        "Failed to update conversation metadata",
        "MessageService",
        error
      );
      // Don't throw error here as message was already sent
    }
  }

  /**
   * Batch send multiple messages
   */
  public async batchSendMessages(
    conversationId: string,
    userId: string,
    messages: Partial<MessageDocument>[]
  ): Promise<MessageDocument[]> {
    try {
      const batch = writeBatch(db);
      const results: MessageDocument[] = [];

      for (const messageData of messages) {
        const messageRef = doc(collection(db, COLLECTIONS.MESSAGES));
        const message: Partial<MessageDocument> = {
          conversation_id: conversationId,
          user_id: userId,
          content: messageData.content || "",
          type: messageData.type || "text",
          role: messageData.role || "user",
          status: "sent",
          metadata: messageData.metadata,
          parent_message_id: messageData.parent_message_id,
          reactions: {},
          created_at: serverTimestamp() as any,
          updated_at: serverTimestamp() as any,
        };

        batch.set(messageRef, message);
        results.push({ id: messageRef.id, ...message } as MessageDocument);
      }

      await batch.commit();

      // Update conversation metadata
      await this.updateConversationMetadata(conversationId, {
        total_messages: increment(messages.length),
        last_message_at: serverTimestamp() as any,
        last_message_preview:
          messages[messages.length - 1]?.content?.substring(0, 100) || "",
      });

      logger.info("Batch messages sent successfully", "MessageService", {
        conversationId,
        count: messages.length,
      });

      return results;
    } catch (error) {
      logger.error("Failed to batch send messages", "MessageService", error);
      throw new Error("Failed to send messages");
    }
  }
}

// Export singleton instance
export const messageService = MessageService.getInstance();
