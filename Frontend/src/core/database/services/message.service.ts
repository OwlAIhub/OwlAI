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
  query,
  where,
  orderBy,
  limit,
  startAfter,
  serverTimestamp,
  writeBatch,
  increment,
  QueryDocumentSnapshot,
  DocumentData,
} from "firebase/firestore";
import { db, COLLECTIONS, DB_CONFIG } from "../firestore.config";
import { logger } from "../../../shared/utils/logger";
import { conversationService } from "./conversation.service";
import { conversationCache, CacheUtils } from "../../../shared/utils/cache";
import type {
  MessageDocument,
  ConversationDocument,
  PaginationParams,
  PaginatedResponse,
  QueryOptions,
  RealtimeListener,
} from "../types/database.types";
import {
  listenToConversationMessages as listenToConversationMessagesHelper,
  listenToNewMessages as listenToNewMessagesHelper,
} from "./message.listeners";

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

      // Persist message directly
      const docRef = await addDoc(
        collection(db, COLLECTIONS.MESSAGES),
        messageData
      );

      // Update conversation metadata
      await this.updateConversationMetadata(conversationId, {
        total_messages: increment(1) as unknown as number,
        last_message_at: serverTimestamp() as any,
        last_message_preview: data.content?.substring(0, 100) || "",
      });

      const result = {
        id: docRef.id,
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
      // Fallback to direct Firestore query with simple pagination
      const constraints: (
        | ReturnType<typeof where>
        | ReturnType<typeof orderBy>
        | ReturnType<typeof limit>
        | ReturnType<typeof startAfter>
      )[] = [
        where("conversation_id", "==", conversationId),
        orderBy("created_at", "asc"),
        limit(params.limit),
      ];
      if (params.startAfter) {
        constraints.push(startAfter(params.startAfter as any));
      }

      const q = query(collection(db, COLLECTIONS.MESSAGES), ...constraints);
      const snapshot = await getDocs(q);

      const data: MessageDocument[] = snapshot.docs.map(d => {
        const payload = d.data() as unknown as Omit<MessageDocument, "id">;
        return { id: d.id, ...payload } as MessageDocument;
      });

      const hasMore = snapshot.size === params.limit;
      const lastDoc = snapshot.docs[snapshot.docs.length - 1] as
        | QueryDocumentSnapshot<DocumentData>
        | undefined;

      logger.info("Conversation messages retrieved", "MessageService", {
        conversationId,
        count: data.length,
        hasMore,
      });

      return { data, hasMore, lastDoc };
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
        total_messages: increment(-1) as unknown as number,
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
    return listenToConversationMessagesHelper(conversationId, onData, onError);
  }

  /**
   * Listen to new messages in real-time
   */
  public listenToNewMessages(
    conversationId: string,
    onData: (message: MessageDocument) => void,
    onError: (error: any) => void
  ): RealtimeListener {
    return listenToNewMessagesHelper(conversationId, onData, onError);
  }

  /**
   * Search messages in conversation
   */
  public async searchMessages(
    conversationId: string,
    searchTerm: string,
    _options: QueryOptions = {}
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
    metadata: Partial<ConversationDocument["metadata"]> & {
      total_messages?: unknown;
      last_message_at?: unknown;
    }
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
        total_messages: increment(messages.length) as unknown as number,
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
