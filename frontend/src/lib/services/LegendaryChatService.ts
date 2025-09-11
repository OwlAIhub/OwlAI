/**
 * 🚀 LEGENDARY CHAT SERVICE
 * Peak Performance Chat Management
 * - Integrated with LegendaryCache for lightning-fast responses
 * - Uses LegendaryConnection for optimized network requests  
 * - Implements LegendaryErrorHandler for bulletproof reliability
 * - Advanced batching and deduplication
 * - Real-time performance monitoring
 */

import { 
  collection, 
  doc, 
  updateDoc, 
  deleteDoc,
  setDoc,
  getDocs, 
  getDoc,
  query, 
  orderBy, 
  limit, 
  startAfter,
  writeBatch,
  serverTimestamp,
  increment,
  Timestamp
} from "firebase/firestore";

import { db } from "../firebase/config";
import { ChatMessage, ChatSession, ChatHistory } from "../types/chat";
import { legendaryCache } from "../cache/LegendaryCacheManager";
import { legendaryConnection } from "../network/LegendaryConnectionManager";
import { legendaryErrorHandler } from "../monitoring/LegendaryErrorHandler";

interface BatchOperation {
  type: 'create' | 'update' | 'delete';
  collection: string;
  id: string;
  data?: any;
  timestamp: number;
}

interface ServiceMetrics {
  totalOperations: number;
  cacheHitRate: number;
  averageResponseTime: number;
  batchedOperations: number;
  errorRate: number;
}

export class LegendaryChatService {
  private static instance: LegendaryChatService;
  private batchQueue: BatchOperation[] = [];
  private metrics: ServiceMetrics = {
    totalOperations: 0,
    cacheHitRate: 0,
    averageResponseTime: 0,
    batchedOperations: 0,
    errorRate: 0
  };

  private readonly BATCH_SIZE = 10;
  private readonly BATCH_TIMEOUT = 500; // 500ms
  private readonly CACHE_TTL = 5 * 60 * 1000; // 5 minutes
  
  private batchTimer?: NodeJS.Timeout;

  private constructor() {
    this.startBatchProcessor();
    this.registerErrorRecoveryStrategies();
  }

  static getInstance(): LegendaryChatService {
    if (!LegendaryChatService.instance) {
      LegendaryChatService.instance = new LegendaryChatService();
    }
    return LegendaryChatService.instance;
  }

  /**
   * 🔥 LEGENDARY SESSION MANAGEMENT
   */
  async createSession(userId: string, title?: string): Promise<ChatSession> {
    const startTime = performance.now();
    const operation = 'createSession';
    
    try {
      legendaryErrorHandler.captureError = legendaryErrorHandler.captureError.bind(legendaryErrorHandler);
      
      const sessionId = `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      const sessionData = {
        id: sessionId,
        userId,
        title: title || `Chat ${new Date().toLocaleDateString()}`,
        category: "study" as const,
        isPinned: false,
        isArchived: false,
        messageCount: 0,
        lastMessage: {
          content: "",
          timestamp: serverTimestamp()
        },
        metadata: {
          model: "OwlAI",
          isStarred: false,
          tags: []
        },
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp()
      };

      // Use batched operation for optimal performance
      await this.batchOperation({
        type: 'create',
        collection: `users/${userId}/chatSessions`,
        id: sessionId,
        data: sessionData,
        timestamp: Date.now()
      });

      const session: ChatSession = {
        ...sessionData,
        createdAt: new Date(),
        updatedAt: new Date(),
        lastMessage: {
          content: "",
          timestamp: new Date()
        }
      };

      // Cache the new session
      await legendaryCache.set(`session_${sessionId}`, session, {
        ttl: this.CACHE_TTL,
        layers: ['memory', 'localStorage']
      });

      // Update user sessions cache
      this.invalidateUserSessionsCache(userId);

      this.updateMetrics(operation, performance.now() - startTime, true);
      return session;

    } catch (error) {
      this.updateMetrics(operation, performance.now() - startTime, false);
      legendaryErrorHandler.captureError(
        error as Error,
        { component: 'LegendaryChatService', action: 'createSession', userId },
        'high'
      );
      throw new Error("Failed to create chat session");
    }
  }

  async getUserSessions(userId: string, limitCount: number = 20): Promise<ChatSession[]> {
    const startTime = performance.now();
    const operation = 'getUserSessions';
    const cacheKey = `user_sessions_${userId}_${limitCount}`;

    try {
      // Check cache first - MASSIVE performance boost
      const cached = await legendaryCache.get<ChatSession[]>(cacheKey);
      if (cached) {
        this.updateMetrics(operation, performance.now() - startTime, true, true);
        return cached;
      }

      const q = query(
        collection(db, "users", userId, "chatSessions"),
        orderBy("updatedAt", "desc"),
        limit(limitCount)
      );

      const querySnapshot = await getDocs(q);
      const sessions = querySnapshot.docs.map(doc => {
        const data = doc.data();
        return {
          id: doc.id,
          ...data,
          createdAt: (data.createdAt as Timestamp)?.toDate() || new Date(),
          updatedAt: (data.updatedAt as Timestamp)?.toDate() || new Date(),
          lastMessage: data.lastMessage ? {
            content: data.lastMessage.content || "",
            timestamp: (data.lastMessage.timestamp as Timestamp)?.toDate() || new Date()
          } : undefined
        };
      }) as ChatSession[];

      // Cache the results
      await legendaryCache.set(cacheKey, sessions, {
        ttl: this.CACHE_TTL,
        layers: ['memory', 'localStorage']
      });

      this.updateMetrics(operation, performance.now() - startTime, true, false);
      return sessions;

    } catch (error) {
      this.updateMetrics(operation, performance.now() - startTime, false);
      legendaryErrorHandler.captureError(
        error as Error,
        { component: 'LegendaryChatService', action: 'getUserSessions', userId },
        'medium'
      );
      throw new Error("Failed to fetch chat sessions");
    }
  }

  async updateSession(userId: string, sessionId: string, updates: Partial<ChatSession>): Promise<void> {
    const startTime = performance.now();
    const operation = 'updateSession';

    try {
      await this.batchOperation({
        type: 'update',
        collection: `users/${userId}/chatSessions`,
        id: sessionId,
        data: {
          ...updates,
          updatedAt: serverTimestamp()
        },
        timestamp: Date.now()
      });

      // Update caches
      await this.updateSessionCaches(sessionId, updates);
      this.invalidateUserSessionsCache(userId);

      this.updateMetrics(operation, performance.now() - startTime, true);

    } catch (error) {
      this.updateMetrics(operation, performance.now() - startTime, false);
      legendaryErrorHandler.captureError(
        error as Error,
        { component: 'LegendaryChatService', action: 'updateSession', userId, sessionId },
        'medium'
      );
      throw new Error("Failed to update session");
    }
  }

  async deleteSession(userId: string, sessionId: string): Promise<void> {
    const startTime = performance.now();
    const operation = 'deleteSession';

    try {
      const batch = writeBatch(db);
      
      // Delete session
      const sessionRef = doc(db, "users", userId, "chatSessions", sessionId);
      batch.delete(sessionRef);

      // Delete all messages in this session  
      const messagesQuery = query(
        collection(db, "users", userId, "chatSessions", sessionId, "messages")
      );
      const messagesSnapshot = await getDocs(messagesQuery);
      
      messagesSnapshot.docs.forEach(doc => {
        batch.delete(doc.ref);
      });

      await batch.commit();

      // Clear all related caches
      await this.clearSessionCaches(sessionId);
      this.invalidateUserSessionsCache(userId);

      this.updateMetrics(operation, performance.now() - startTime, true);

    } catch (error) {
      this.updateMetrics(operation, performance.now() - startTime, false);
      legendaryErrorHandler.captureError(
        error as Error,
        { component: 'LegendaryChatService', action: 'deleteSession', userId, sessionId },
        'high'
      );
      throw new Error("Failed to delete session");
    }
  }

  /**
   * 🚀 LEGENDARY MESSAGE MANAGEMENT
   */
  async addMessage(userId: string, sessionId: string, message: Omit<ChatMessage, "id">): Promise<ChatMessage> {
    const startTime = performance.now();
    const operation = 'addMessage';

    try {
      const batch = writeBatch(db);
      const messageId = `msg_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      
      // Add message
      const messageRef = doc(db, "users", userId, "chatSessions", sessionId, "messages", messageId);
      const messageData = {
        id: messageId,
        sessionId,
        userId,
        content: message.content,
        sender: message.sender,
        type: "text" as const,
        status: message.status,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp()
      };
      batch.set(messageRef, messageData);

      // Update session with atomic increment - LEGENDARY performance!
      const sessionRef = doc(db, "users", userId, "chatSessions", sessionId);
      batch.update(sessionRef, {
        updatedAt: serverTimestamp(),
        messageCount: increment(1), // ⚡ Atomic increment - NO read needed!
        lastMessage: {
          content: message.content.slice(0, 100) + (message.content.length > 100 ? "..." : ""),
          timestamp: serverTimestamp()
        }
      });

      await batch.commit();

      const newMessage: ChatMessage = {
        id: messageId,
        ...message,
        timestamp: new Date()
      };

      // Cache the message for instant retrieval
      await this.cacheMessage(sessionId, newMessage);
      
      // Invalidate session messages cache to force refresh
      this.invalidateSessionMessagesCache(sessionId);
      this.invalidateUserSessionsCache(userId);

      this.updateMetrics(operation, performance.now() - startTime, true);
      return newMessage;

    } catch (error) {
      this.updateMetrics(operation, performance.now() - startTime, false);
      legendaryErrorHandler.captureError(
        error as Error,
        { component: 'LegendaryChatService', action: 'addMessage', userId, sessionId },
        'high'
      );
      throw new Error("Failed to add message");
    }
  }

  async getSessionMessages(
    userId: string,
    sessionId: string, 
    limitCount: number = 50,
    lastMessageId?: string
  ): Promise<ChatHistory> {
    const startTime = performance.now();
    const operation = 'getSessionMessages';
    const cacheKey = `session_messages_${sessionId}_${limitCount}_${lastMessageId || 'initial'}`;

    try {
      // Check cache first for massive performance gain
      const cached = await legendaryCache.get<ChatHistory>(cacheKey);
      if (cached && !lastMessageId) { // Only use cache for initial loads
        this.updateMetrics(operation, performance.now() - startTime, true, true);
        return cached;
      }

      // Parallel queries for optimal performance
      const [sessionDoc, messagesQuery] = await Promise.all([
        getDoc(doc(db, "users", userId, "chatSessions", sessionId)),
        this.buildMessagesQuery(userId, sessionId, limitCount, lastMessageId)
      ]);

      const querySnapshot = await getDocs(messagesQuery);
      const docs = querySnapshot.docs;
      
      const hasMore = docs.length > limitCount;
      const messages = docs
        .slice(0, limitCount)
        .reverse() // Reverse to get chronological order
        .map(doc => ({
          id: doc.id,
          content: doc.data().content,
          sender: doc.data().sender,
          timestamp: (doc.data().createdAt as Timestamp)?.toDate() || new Date(),
          status: doc.data().status
        })) as ChatMessage[];

      const result: ChatHistory = {
        sessionId,
        messages,
        totalMessages: sessionDoc.exists() ? (sessionDoc.data()?.messageCount || 0) : 0,
        hasMore
      };

      // Cache results for faster subsequent access
      if (!lastMessageId) { // Only cache initial loads
        await legendaryCache.set(cacheKey, result, {
          ttl: this.CACHE_TTL / 2, // Shorter TTL for messages
          layers: ['memory']
        });
      }

      this.updateMetrics(operation, performance.now() - startTime, true, false);
      return result;

    } catch (error) {
      this.updateMetrics(operation, performance.now() - startTime, false);
      legendaryErrorHandler.captureError(
        error as Error,
        { component: 'LegendaryChatService', action: 'getSessionMessages', userId, sessionId },
        'medium'
      );
      throw new Error("Failed to fetch messages");
    }
  }

  /**
   * 🎯 LEGENDARY UTILITIES
   */
  async generateSessionTitle(messages: ChatMessage[]): Promise<string> {
    try {
      if (messages.length === 0) return `Chat ${new Date().toLocaleDateString()}`;
      
      const firstUserMessage = messages.find(m => m.sender === "user");
      if (firstUserMessage) {
        const title = firstUserMessage.content.slice(0, 50);
        return title + (firstUserMessage.content.length > 50 ? "..." : "");
      }
      
      return `Chat ${new Date().toLocaleDateString()}`;
    } catch (error) {
      legendaryErrorHandler.captureError(
        error as Error,
        { component: 'LegendaryChatService', action: 'generateSessionTitle' },
        'low'
      );
      return `Chat ${new Date().toLocaleDateString()}`;
    }
  }

  async searchSessions(userId: string, searchTerm: string, limitCount: number = 10): Promise<ChatSession[]> {
    const cacheKey = `search_${userId}_${searchTerm}_${limitCount}`;
    
    try {
      const cached = await legendaryCache.get<ChatSession[]>(cacheKey);
      if (cached) {
        return cached;
      }

      const sessions = await this.getUserSessions(userId, 100);
      const results = sessions.filter(session => 
        session.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        session.lastMessage?.content.toLowerCase().includes(searchTerm.toLowerCase())
      ).slice(0, limitCount);

      await legendaryCache.set(cacheKey, results, {
        ttl: this.CACHE_TTL / 4, // Short TTL for search results
        layers: ['memory']
      });

      return results;
    } catch (error) {
      legendaryErrorHandler.captureError(
        error as Error,
        { component: 'LegendaryChatService', action: 'searchSessions', userId },
        'low'
      );
      throw new Error("Failed to search sessions");
    }
  }

  /**
   * ⚡ LEGENDARY BATCHING SYSTEM
   */
  private async batchOperation(operation: BatchOperation): Promise<void> {
    this.batchQueue.push(operation);
    this.metrics.batchedOperations++;

    // Process immediately if queue is full
    if (this.batchQueue.length >= this.BATCH_SIZE) {
      await this.processBatchQueue();
    }
  }

  private startBatchProcessor(): void {
    this.batchTimer = setInterval(() => {
      if (this.batchQueue.length > 0) {
        this.processBatchQueue();
      }
    }, this.BATCH_TIMEOUT);
  }

  private async processBatchQueue(): Promise<void> {
    if (this.batchQueue.length === 0) return;

    const operations = this.batchQueue.splice(0, this.BATCH_SIZE);
    const batch = writeBatch(db);

    try {
      for (const operation of operations) {
        const docRef = doc(db, operation.collection, operation.id);
        
        switch (operation.type) {
          case 'create':
            batch.set(docRef, operation.data);
            break;
          case 'update':
            batch.update(docRef, operation.data);
            break;
          case 'delete':
            batch.delete(docRef);
            break;
        }
      }

      await batch.commit();
    } catch (error) {
      legendaryErrorHandler.captureError(
        error as Error,
        { component: 'LegendaryChatService', action: 'processBatchQueue' },
        'high'
      );
      throw error;
    }
  }

  /**
   * 🧠 LEGENDARY CACHE MANAGEMENT
   */
  private async updateSessionCaches(sessionId: string, updates: Partial<ChatSession>): Promise<void> {
    const cacheKey = `session_${sessionId}`;
    const cached = await legendaryCache.get<ChatSession>(cacheKey);
    
    if (cached) {
      const updated = { ...cached, ...updates };
      await legendaryCache.set(cacheKey, updated, {
        ttl: this.CACHE_TTL,
        layers: ['memory', 'localStorage']
      });
    }
  }

  private async cacheMessage(sessionId: string, message: ChatMessage): Promise<void> {
    const cacheKey = `message_${message.id}`;
    await legendaryCache.set(cacheKey, message, {
      ttl: this.CACHE_TTL,
      layers: ['memory']
    });
  }

  private invalidateUserSessionsCache(userId: string): void {
    legendaryCache.invalidate(new RegExp(`user_sessions_${userId}_`));
  }

  private invalidateSessionMessagesCache(sessionId: string): void {
    legendaryCache.invalidate(new RegExp(`session_messages_${sessionId}_`));
  }

  private async clearSessionCaches(sessionId: string): Promise<void> {
    legendaryCache.invalidate(`session_${sessionId}`);
    legendaryCache.invalidate(new RegExp(`session_messages_${sessionId}_`));
    legendaryCache.invalidate(new RegExp(`message_.*_${sessionId}`));
  }

  /**
   * 🛡️ LEGENDARY ERROR RECOVERY
   */
  private registerErrorRecoveryStrategies(): void {
    // Network error recovery
    legendaryErrorHandler.registerRecoveryStrategy('NetworkError', async () => {
      // Retry batch operations
      if (this.batchQueue.length > 0) {
        await this.processBatchQueue();
        return true;
      }
      return false;
    });

    // Quota exceeded recovery
    legendaryErrorHandler.registerRecoveryStrategy('QuotaExceededError', async () => {
      // Clear old cache entries
      legendaryCache.invalidate(new RegExp('.*'));
      return true;
    });
  }

  /**
   * 📊 LEGENDARY METRICS
   */
  private updateMetrics(
    operation: string, 
    responseTime: number, 
    success: boolean, 
    cacheHit: boolean = false
  ): void {
    this.metrics.totalOperations++;
    
    if (cacheHit) {
      this.metrics.cacheHitRate = (this.metrics.cacheHitRate + 1) / 2; // Rolling average
    }

    const totalTime = this.metrics.averageResponseTime * (this.metrics.totalOperations - 1) + responseTime;
    this.metrics.averageResponseTime = totalTime / this.metrics.totalOperations;

    if (!success) {
      this.metrics.errorRate = (this.metrics.errorRate + 1) / 2; // Rolling average
    }
  }

  getMetrics(): ServiceMetrics & { 
    performanceScore: number;
    reliability: number;
  } {
    const performanceScore = Math.max(0, 100 - (this.metrics.averageResponseTime / 10));
    const reliability = Math.max(0, 100 - (this.metrics.errorRate * 10));

    return {
      ...this.metrics,
      performanceScore: Math.round(performanceScore * 100) / 100,
      reliability: Math.round(reliability * 100) / 100
    };
  }

  /**
   * 🔧 LEGENDARY HELPERS
   */
  private async buildMessagesQuery(userId: string, sessionId: string, limitCount: number, lastMessageId?: string) {
    let q = query(
      collection(db, "users", userId, "chatSessions", sessionId, "messages"),
      orderBy("createdAt", "desc"),
      limit(limitCount + 1)
    );

    if (lastMessageId) {
      const lastDoc = await getDoc(doc(db, "users", userId, "chatSessions", sessionId, "messages", lastMessageId));
      if (lastDoc.exists()) {
        q = query(q, startAfter(lastDoc));
      }
    }

    return q;
  }

  /**
   * 🔧 LEGENDARY CLEANUP
   */
  destroy(): void {
    if (this.batchTimer) {
      clearInterval(this.batchTimer);
    }
    
    // Process any remaining batch operations
    if (this.batchQueue.length > 0) {
      this.processBatchQueue().catch(console.error);
    }
  }
}

// Singleton instance with legendary performance
export const legendaryChatService = LegendaryChatService.getInstance();