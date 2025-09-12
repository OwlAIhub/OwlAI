/**
 * 🚀 MODULAR CHAT SERVICE
 * Peak Performance Chat Management with Modular Architecture
 * - Session Management
 * - Message Management  
 * - Batch Processing
 * - Performance Metrics
 * - Error Recovery
 */

import { SessionManager } from "./handlers/SessionManager";
import { MessageManager } from "./handlers/MessageManager";
import { BatchProcessor } from "./utils/BatchProcessor";
import { MetricsTracker } from "./utils/MetricsTracker";
import { ChatSession, ChatMessage, ChatHistory, ServiceMetrics } from "./types";

export class ChatService {
  private static instance: ChatService;
  
  private sessionManager: SessionManager;
  private messageManager: MessageManager;
  private batchProcessor: BatchProcessor;
  private metricsTracker: MetricsTracker;

  private constructor() {
    this.sessionManager = SessionManager.getInstance();
    this.messageManager = MessageManager.getInstance();
    this.batchProcessor = BatchProcessor.getInstance();
    this.metricsTracker = MetricsTracker.getInstance();
    
    this.metricsTracker.registerErrorRecoveryStrategies();
  }

  static getInstance(): ChatService {
    if (!ChatService.instance) {
      ChatService.instance = new ChatService();
    }
    return ChatService.instance;
  }

  // Session Management
  async createSession(userId: string, title?: string): Promise<ChatSession> {
    return this.sessionManager.createSession(userId, title);
  }

  async getSession(userId: string, sessionId: string): Promise<ChatSession | null> {
    return this.sessionManager.getSession(userId, sessionId);
  }

  async getUserSessions(
    userId: string, 
    limitCount: number = 20, 
    lastSessionId?: string
  ): Promise<ChatSession[]> {
    return this.sessionManager.getUserSessions(userId, limitCount, lastSessionId);
  }

  async updateSession(userId: string, sessionId: string, updates: Partial<ChatSession>): Promise<void> {
    return this.sessionManager.updateSession(userId, sessionId, updates);
  }

  async deleteSession(userId: string, sessionId: string): Promise<void> {
    return this.sessionManager.deleteSession(userId, sessionId);
  }

  // Message Management
  async addMessage(userId: string, sessionId: string, message: Omit<ChatMessage, "id">): Promise<ChatMessage> {
    return this.messageManager.addMessage(userId, sessionId, message);
  }

  async getSessionMessages(
    userId: string,
    sessionId: string,
    limitCount: number = 50,
    lastMessageId?: string
  ): Promise<ChatHistory> {
    return this.messageManager.getSessionMessages(userId, sessionId, limitCount, lastMessageId);
  }

  async updateMessage(userId: string, sessionId: string, messageId: string, updates: Partial<ChatMessage>): Promise<void> {
    return this.messageManager.updateMessage(userId, sessionId, messageId, updates);
  }

  async deleteMessage(userId: string, sessionId: string, messageId: string): Promise<void> {
    return this.messageManager.deleteMessage(userId, sessionId, messageId);
  }

  // Utilities
  async generateSessionTitle(messages: ChatMessage[]): Promise<string> {
    return this.messageManager.generateSessionTitle(messages);
  }

  // Performance & Monitoring
  getMetrics(): ServiceMetrics {
    return this.metricsTracker.getMetrics();
  }

  resetMetrics(): void {
    this.metricsTracker.resetMetrics();
  }

  logMetricsSummary(): void {
    this.metricsTracker.logMetricsSummary();
  }

  // Batch Operations
  async flushBatch(): Promise<void> {
    return this.batchProcessor.flushBatch();
  }

  getBatchQueueSize(): number {
    return this.batchProcessor.getBatchQueueSize();
  }
}

// Export singleton instance
export const chatService = ChatService.getInstance();