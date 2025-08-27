/**
 * Context Management Service
 * Handles conversation context, token tracking, and memory optimization
 */

import { logger } from "../../../shared/utils/logger";
import { messageService } from "./message.service";
import { conversationService } from "./conversation.service";
import type {
  MessageDocument,
  ConversationDocument,
} from "../types/database.types";

// Context management configuration
const CONTEXT_CONFIG = {
  MAX_CONTEXT_MESSAGES: 20, // Maximum messages to include in context
  MAX_CONTEXT_TOKENS: 4000, // Maximum tokens for context (adjust based on model)
  SUMMARY_THRESHOLD: 50, // Messages before triggering summary
  ARCHIVE_THRESHOLD: 100, // Messages before archiving old ones
  RELEVANCE_SCORE_THRESHOLD: 0.7, // Minimum relevance score
} as const;

interface ContextMessage {
  id: string;
  content: string;
  role: "user" | "assistant" | "system";
  timestamp: Date;
  relevanceScore?: number;
  tokens?: number;
}

interface ConversationContext {
  conversationId: string;
  messages: ContextMessage[];
  totalTokens: number;
  summary?: string;
  lastUpdated: Date;
  metadata: {
    messageCount: number;
    averageRelevanceScore: number;
    contextWindowSize: number;
  };
}

interface ContextOptions {
  includeSummary?: boolean;
  maxTokens?: number;
  maxMessages?: number;
  relevanceThreshold?: number;
  includeSystemMessages?: boolean;
}

class ContextManagementService {
  private static instance: ContextManagementService;
  private contextCache: Map<string, ConversationContext> = new Map();

  private constructor() {}

  public static getInstance(): ContextManagementService {
    if (!ContextManagementService.instance) {
      ContextManagementService.instance = new ContextManagementService();
    }
    return ContextManagementService.instance;
  }

  /**
   * Get optimized conversation context for AI
   */
  public async getConversationContext(
    conversationId: string,
    options: ContextOptions = {}
  ): Promise<ConversationContext> {
    try {
      const {
        includeSummary = true,
        maxTokens = CONTEXT_CONFIG.MAX_CONTEXT_TOKENS,
        maxMessages = CONTEXT_CONFIG.MAX_CONTEXT_MESSAGES,
        relevanceThreshold = CONTEXT_CONFIG.RELEVANCE_SCORE_THRESHOLD,
        includeSystemMessages = false,
      } = options;

      // Check cache first
      const cached = this.contextCache.get(conversationId);
      if (cached && this.isContextFresh(cached)) {
        logger.info("Using cached context", "ContextManagementService", {
          conversationId,
          messageCount: cached.messages.length,
        });
        return cached;
      }

      // Get conversation details
      const conversation =
        await conversationService.getConversation(conversationId);
      if (!conversation) {
        throw new Error("Conversation not found");
      }

      // Get recent messages
      const messages = await messageService.getConversationMessages(
        conversationId,
        {
          limit: maxMessages * 2, // Get more to filter
        }
      );

      // Filter and process messages
      const contextMessages = await this.processMessagesForContext(
        messages.data,
        {
          maxTokens,
          maxMessages,
          relevanceThreshold,
          includeSystemMessages,
        }
      );

      // Generate summary if needed
      let summary: string | undefined;
      if (
        includeSummary &&
        messages.data.length > CONTEXT_CONFIG.SUMMARY_THRESHOLD
      ) {
        summary = await this.generateConversationSummary(
          conversationId,
          messages.data
        );
      }

      // Calculate metadata
      const totalTokens = contextMessages.reduce(
        (sum, msg) => sum + (msg.tokens || 0),
        0
      );
      const averageRelevanceScore =
        contextMessages.length > 0
          ? contextMessages.reduce(
              (sum, msg) => sum + (msg.relevanceScore || 0),
              0
            ) / contextMessages.length
          : 0;

      const context: ConversationContext = {
        conversationId,
        messages: contextMessages,
        totalTokens,
        summary,
        lastUpdated: new Date(),
        metadata: {
          messageCount: contextMessages.length,
          averageRelevanceScore,
          contextWindowSize: totalTokens,
        },
      };

      // Cache the context
      this.contextCache.set(conversationId, context);

      logger.info(
        "Context generated successfully",
        "ContextManagementService",
        {
          conversationId,
          messageCount: contextMessages.length,
          totalTokens,
          hasSummary: !!summary,
        }
      );

      return context;
    } catch (error) {
      logger.error(
        "Failed to get conversation context",
        "ContextManagementService",
        error
      );
      throw new Error("Failed to load conversation context");
    }
  }

  /**
   * Process messages for context optimization
   */
  private async processMessagesForContext(
    messages: MessageDocument[],
    options: {
      maxTokens: number;
      maxMessages: number;
      relevanceThreshold: number;
      includeSystemMessages: boolean;
    }
  ): Promise<ContextMessage[]> {
    const {
      maxTokens,
      maxMessages,
      relevanceThreshold,
      includeSystemMessages,
    } = options;

    // Filter messages
    let filteredMessages = messages.filter(msg => {
      if (!includeSystemMessages && msg.role === "system") return false;
      if (msg.status === "deleted") return false;
      return true;
    });

    // Calculate relevance scores (simple implementation)
    const scoredMessages = filteredMessages.map(msg => ({
      ...msg,
      relevanceScore: this.calculateRelevanceScore(msg, messages),
      tokens: this.estimateTokenCount(msg.content),
    }));

    // Sort by relevance and recency
    scoredMessages.sort((a, b) => {
      const relevanceDiff = (b.relevanceScore || 0) - (a.relevanceScore || 0);
      if (Math.abs(relevanceDiff) > 0.1) return relevanceDiff;
      return b.created_at.toMillis() - a.created_at.toMillis();
    });

    // Apply token and message limits
    const selectedMessages: ContextMessage[] = [];
    let currentTokens = 0;

    for (const msg of scoredMessages) {
      const messageTokens = msg.tokens || 0;

      if (selectedMessages.length >= maxMessages) break;
      if (currentTokens + messageTokens > maxTokens) break;
      if ((msg.relevanceScore || 0) < relevanceThreshold) break;

      selectedMessages.push({
        id: msg.id,
        content: msg.content,
        role: msg.role,
        timestamp: msg.created_at.toDate(),
        relevanceScore: msg.relevanceScore,
        tokens: messageTokens,
      });

      currentTokens += messageTokens;
    }

    // Sort by timestamp for chronological order
    selectedMessages.sort(
      (a, b) => a.timestamp.getTime() - b.timestamp.getTime()
    );

    return selectedMessages;
  }

  /**
   * Calculate message relevance score
   */
  private calculateRelevanceScore(
    message: MessageDocument,
    allMessages: MessageDocument[]
  ): number {
    // Simple relevance scoring based on:
    // 1. Recency (newer messages are more relevant)
    // 2. Content length (longer messages might be more important)
    // 3. Role (assistant messages might be more relevant)
    // 4. Engagement (messages with reactions are more relevant)

    const now = Date.now();
    const messageTime = message.created_at.toMillis();
    const timeDiff = now - messageTime;
    const hoursDiff = timeDiff / (1000 * 60 * 60);

    // Recency score (0-1, newer = higher)
    const recencyScore = Math.max(0, 1 - hoursDiff / 24);

    // Content length score (0-1, longer = higher, but with diminishing returns)
    const contentLength = message.content.length;
    const lengthScore = Math.min(1, contentLength / 500);

    // Role score
    const roleScore =
      message.role === "assistant" ? 0.8 : message.role === "user" ? 0.6 : 0.4;

    // Engagement score
    const reactionCount = Object.keys(message.reactions || {}).length;
    const engagementScore = Math.min(1, reactionCount * 0.2);

    // Weighted average
    const relevanceScore =
      recencyScore * 0.4 +
      lengthScore * 0.2 +
      roleScore * 0.3 +
      engagementScore * 0.1;

    return Math.round(relevanceScore * 100) / 100;
  }

  /**
   * Estimate token count for text
   */
  private estimateTokenCount(text: string): number {
    // Simple estimation: ~4 characters per token
    // For production, use a proper tokenizer
    return Math.ceil(text.length / 4);
  }

  /**
   * Generate conversation summary
   */
  private async generateConversationSummary(
    conversationId: string,
    messages: MessageDocument[]
  ): Promise<string> {
    try {
      // For now, create a simple summary
      // In production, this could call an AI service or Cloud Function
      const userMessages = messages.filter(m => m.role === "user");
      const assistantMessages = messages.filter(m => m.role === "assistant");

      const summary =
        `Conversation with ${userMessages.length} user messages and ${assistantMessages.length} AI responses. ` +
        `Last user message: "${userMessages[userMessages.length - 1]?.content.substring(0, 100)}..."`;

      logger.info(
        "Conversation summary generated",
        "ContextManagementService",
        {
          conversationId,
          summaryLength: summary.length,
        }
      );

      return summary;
    } catch (error) {
      logger.error(
        "Failed to generate conversation summary",
        "ContextManagementService",
        error
      );
      return "Summary unavailable";
    }
  }

  /**
   * Check if cached context is still fresh
   */
  private isContextFresh(context: ConversationContext): boolean {
    const now = new Date();
    const ageInMinutes =
      (now.getTime() - context.lastUpdated.getTime()) / (1000 * 60);
    return ageInMinutes < 5; // Cache for 5 minutes
  }

  /**
   * Clear context cache
   */
  public clearCache(conversationId?: string): void {
    if (conversationId) {
      this.contextCache.delete(conversationId);
    } else {
      this.contextCache.clear();
    }
    logger.info("Context cache cleared", "ContextManagementService", {
      conversationId,
    });
  }

  /**
   * Archive old messages for memory optimization
   */
  public async archiveOldMessages(conversationId: string): Promise<void> {
    try {
      const messages = await messageService.getConversationMessages(
        conversationId,
        {
          limit: 1000,
        }
      );

      if (messages.data.length <= CONTEXT_CONFIG.ARCHIVE_THRESHOLD) {
        return; // No need to archive
      }

      // Archive messages older than 30 days
      const thirtyDaysAgo = new Date();
      thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

      const oldMessages = messages.data.filter(
        msg =>
          msg.created_at.toDate() < thirtyDaysAgo && msg.status !== "deleted"
      );

      if (oldMessages.length === 0) {
        return;
      }

      // Update conversation metadata
      await conversationService.updateConversation(conversationId, {
        metadata: {
          archived_messages_count: oldMessages.length,
          last_archived_at: new Date(),
        },
      });

      logger.info("Old messages archived", "ContextManagementService", {
        conversationId,
        archivedCount: oldMessages.length,
      });
    } catch (error) {
      logger.error(
        "Failed to archive old messages",
        "ContextManagementService",
        error
      );
    }
  }

  /**
   * Get context statistics
   */
  public async getContextStats(conversationId: string): Promise<{
    totalMessages: number;
    contextMessages: number;
    totalTokens: number;
    averageRelevanceScore: number;
    cacheHitRate: number;
  }> {
    try {
      const context = await this.getConversationContext(conversationId);
      const allMessages = await messageService.getConversationMessages(
        conversationId,
        {
          limit: 1000,
        }
      );

      return {
        totalMessages: allMessages.data.length,
        contextMessages: context.messages.length,
        totalTokens: context.totalTokens,
        averageRelevanceScore: context.metadata.averageRelevanceScore,
        cacheHitRate: this.contextCache.has(conversationId) ? 1 : 0,
      };
    } catch (error) {
      logger.error(
        "Failed to get context stats",
        "ContextManagementService",
        error
      );
      throw new Error("Failed to get context statistics");
    }
  }
}

// Export singleton instance
export const contextManagementService = ContextManagementService.getInstance();
