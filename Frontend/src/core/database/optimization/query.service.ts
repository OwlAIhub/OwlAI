/**
 * Query Service
 * Handles optimized database queries to reduce data transfer and improve performance
 */

import {
  query,
  where,
  orderBy,
  limit,
  startAfter,
  getDocs,
  QueryDocumentSnapshot,
  DocumentData,
  collection,
  doc,
  getDoc,
  Timestamp,
} from "firebase/firestore";
import { db, COLLECTIONS } from "../firestore.config";
import { logger } from "../../../shared/utils/logger";
import { cacheService } from "./cache.service";
import type {
  MessageDocument,
  ConversationDocument,
  PaginationParams,
  PaginatedResponse,
  QueryOptions,
} from "../types/database.types";

interface QueryStats {
  totalQueries: number;
  cachedQueries: number;
  cacheHitRate: number;
  averageQueryTime: number;
}

interface OptimizedQueryOptions extends QueryOptions {
  useCache?: boolean;
  cacheTTL?: number;
  selectFields?: string[];
  excludeFields?: string[];
}

class QueryService {
  private static instance: QueryService;
  private stats: QueryStats = {
    totalQueries: 0,
    cachedQueries: 0,
    cacheHitRate: 0,
    averageQueryTime: 0,
  };

  private constructor() {}

  public static getInstance(): QueryService {
    if (!QueryService.instance) {
      QueryService.instance = new QueryService();
    }
    return QueryService.instance;
  }

  /**
   * Get conversation messages with optimized query
   */
  public async getConversationMessages(
    conversationId: string,
    options: OptimizedQueryOptions = {}
  ): Promise<PaginatedResponse<MessageDocument>> {
    const startTime = Date.now();
    const cacheKey = cacheService.generateConversationKey(
      conversationId,
      options.limit || 50
    );

    // Try cache first
    if (options.useCache !== false) {
      const cached =
        cacheService.get<PaginatedResponse<MessageDocument>>(cacheKey);
      if (cached) {
        this.stats.cachedQueries++;
        this.updateStats(startTime);
        return cached;
      }
    }

    try {
      const messagesQuery = query(
        collection(db, COLLECTIONS.MESSAGES),
        where("conversation_id", "==", conversationId),
        where("status", "!=", "deleted"),
        orderBy("status"),
        orderBy("created_at", "desc"),
        limit(options.limit || 50)
      );

      if (options.startAfter) {
        messagesQuery.startAfter(options.startAfter);
      }

      const snapshot = await getDocs(messagesQuery);
      const messages = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
      })) as MessageDocument[];

      const result: PaginatedResponse<MessageDocument> = {
        data: messages,
        hasMore: snapshot.docs.length === (options.limit || 50),
        lastDoc: snapshot.docs[snapshot.docs.length - 1] || undefined,
        totalCount: messages.length,
      };

      // Cache the result
      if (options.useCache !== false) {
        cacheService.set(cacheKey, result, options.cacheTTL);
      }

      this.updateStats(startTime);
      return result;
    } catch (error) {
      logger.error(
        "Failed to get conversation messages",
        "QueryService",
        error
      );
      throw error;
    }
  }

  /**
   * Get user conversations with optimized query
   */
  public async getUserConversations(
    userId: string,
    options: OptimizedQueryOptions = {}
  ): Promise<PaginatedResponse<ConversationDocument>> {
    const startTime = Date.now();
    const cacheKey = cacheService.generateUserConversationsKey(
      userId,
      options.status
    );

    // Try cache first
    if (options.useCache !== false) {
      const cached =
        cacheService.get<PaginatedResponse<ConversationDocument>>(cacheKey);
      if (cached) {
        this.stats.cachedQueries++;
        this.updateStats(startTime);
        return cached;
      }
    }

    try {
      let conversationsQuery = query(
        collection(db, COLLECTIONS.CONVERSATIONS),
        where("user_id", "==", userId),
        orderBy("updated_at", "desc"),
        limit(options.limit || 20)
      );

      if (options.status && options.status !== "all") {
        conversationsQuery = query(
          collection(db, COLLECTIONS.CONVERSATIONS),
          where("user_id", "==", userId),
          where("status", "==", options.status),
          orderBy("updated_at", "desc"),
          limit(options.limit || 20)
        );
      }

      if (options.startAfter) {
        conversationsQuery.startAfter(options.startAfter);
      }

      const snapshot = await getDocs(conversationsQuery);
      const conversations = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
      })) as ConversationDocument[];

      const result: PaginatedResponse<ConversationDocument> = {
        data: conversations,
        hasMore: snapshot.docs.length === (options.limit || 20),
        lastDoc: snapshot.docs[snapshot.docs.length - 1] || undefined,
        totalCount: conversations.length,
      };

      // Cache the result
      if (options.useCache !== false) {
        cacheService.set(cacheKey, result, options.cacheTTL);
      }

      this.updateStats(startTime);
      return result;
    } catch (error) {
      logger.error("Failed to get user conversations", "QueryService", error);
      throw error;
    }
  }

  /**
   * Get message statistics with optimized query
   */
  public async getMessageStats(
    conversationId: string,
    options: OptimizedQueryOptions = {}
  ): Promise<{
    total: number;
    averageResponseTime: number;
    lastMessageAt?: Timestamp;
  }> {
    const startTime = Date.now();
    const cacheKey = cacheService.generateMessageStatsKey(conversationId);

    // Try cache first
    if (options.useCache !== false) {
      const cached = cacheService.get(cacheKey);
      if (cached) {
        this.stats.cachedQueries++;
        this.updateStats(startTime);
        return cached;
      }
    }

    try {
      const messagesQuery = query(
        collection(db, COLLECTIONS.MESSAGES),
        where("conversation_id", "==", conversationId),
        where("status", "!=", "deleted"),
        orderBy("created_at", "desc"),
        limit(100) // Limit for performance
      );

      const snapshot = await getDocs(messagesQuery);
      const messages = snapshot.docs.map(doc =>
        doc.data()
      ) as MessageDocument[];

      const total = messages.length;
      const responseTimes = messages
        .filter(msg => msg.metadata?.response_time)
        .map(msg => msg.metadata!.response_time!);

      const averageResponseTime =
        responseTimes.length > 0
          ? responseTimes.reduce((sum, time) => sum + time, 0) /
            responseTimes.length
          : 0;

      const lastMessageAt =
        messages.length > 0 ? messages[0].created_at : undefined;

      const result = {
        total,
        averageResponseTime,
        lastMessageAt,
      };

      // Cache the result
      if (options.useCache !== false) {
        cacheService.set(cacheKey, result, options.cacheTTL || 5 * 60 * 1000); // 5 minutes
      }

      this.updateStats(startTime);
      return result;
    } catch (error) {
      logger.error("Failed to get message stats", "QueryService", error);
      throw error;
    }
  }

  /**
   * Get single document with optimized query
   */
  public async getDocument<T>(
    collectionName: string,
    docId: string,
    options: OptimizedQueryOptions = {}
  ): Promise<T | null> {
    const startTime = Date.now();
    const cacheKey = `${collectionName}:${docId}`;

    // Try cache first
    if (options.useCache !== false) {
      const cached = cacheService.get<T>(cacheKey);
      if (cached) {
        this.stats.cachedQueries++;
        this.updateStats(startTime);
        return cached;
      }
    }

    try {
      const docRef = doc(db, collectionName, docId);
      const docSnap = await getDoc(docRef);

      if (!docSnap.exists()) {
        return null;
      }

      const result = {
        id: docSnap.id,
        ...docSnap.data(),
      } as T;

      // Cache the result
      if (options.useCache !== false) {
        cacheService.set(cacheKey, result, options.cacheTTL);
      }

      this.updateStats(startTime);
      return result;
    } catch (error) {
      logger.error(
        `Failed to get document ${collectionName}/${docId}`,
        "QueryService",
        error
      );
      throw error;
    }
  }

  /**
   * Search messages with optimized query
   */
  public async searchMessages(
    conversationId: string,
    searchTerm: string,
    options: OptimizedQueryOptions = {}
  ): Promise<MessageDocument[]> {
    const startTime = Date.now();
    const cacheKey = `search:${conversationId}:${searchTerm}`;

    // Try cache first
    if (options.useCache !== false) {
      const cached = cacheService.get<MessageDocument[]>(cacheKey);
      if (cached) {
        this.stats.cachedQueries++;
        this.updateStats(startTime);
        return cached;
      }
    }

    try {
      // Note: Firestore doesn't support full-text search natively
      // This is a basic implementation - consider using Algolia or similar for production
      const messagesQuery = query(
        collection(db, COLLECTIONS.MESSAGES),
        where("conversation_id", "==", conversationId),
        where("status", "!=", "deleted"),
        orderBy("created_at", "desc"),
        limit(options.limit || 100)
      );

      const snapshot = await getDocs(messagesQuery);
      const messages = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
      })) as MessageDocument[];

      // Client-side filtering (basic implementation)
      const filteredMessages = messages.filter(message =>
        message.content.toLowerCase().includes(searchTerm.toLowerCase())
      );

      // Cache the result
      if (options.useCache !== false) {
        cacheService.set(
          cacheKey,
          filteredMessages,
          options.cacheTTL || 2 * 60 * 1000
        ); // 2 minutes
      }

      this.updateStats(startTime);
      return filteredMessages;
    } catch (error) {
      logger.error("Failed to search messages", "QueryService", error);
      throw error;
    }
  }

  /**
   * Invalidate cache for conversation
   */
  public invalidateConversationCache(conversationId: string): void {
    cacheService.invalidateByPattern(`conversation:${conversationId}`);
    cacheService.delete(cacheService.generateMessageStatsKey(conversationId));
  }

  /**
   * Invalidate cache for user
   */
  public invalidateUserCache(userId: string): void {
    cacheService.invalidateByPattern(`user:${userId}`);
  }

  /**
   * Get query statistics
   */
  public getStats(): QueryStats {
    return { ...this.stats };
  }

  /**
   * Reset query statistics
   */
  public resetStats(): void {
    this.stats = {
      totalQueries: 0,
      cachedQueries: 0,
      cacheHitRate: 0,
      averageQueryTime: 0,
    };
  }

  /**
   * Update query statistics
   */
  private updateStats(startTime: number): void {
    const queryTime = Date.now() - startTime;
    this.stats.totalQueries++;
    this.stats.averageQueryTime =
      (this.stats.averageQueryTime * (this.stats.totalQueries - 1) +
        queryTime) /
      this.stats.totalQueries;
    this.stats.cacheHitRate =
      this.stats.totalQueries > 0
        ? (this.stats.cachedQueries / this.stats.totalQueries) * 100
        : 0;
  }
}

// Export singleton instance
export const queryService = QueryService.getInstance();

// Export types
export type { QueryStats, OptimizedQueryOptions };
