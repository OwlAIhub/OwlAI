/**
 * Context Management Service
 * Handles conversation context, token tracking, and memory optimization
 */

import { logger } from "../../../shared/utils/logger";
import { messageService } from "./message.service";
import { conversationService } from "./conversation.service";
import {
  ContextMessage,
  processMessagesForContext,
  generateConversationSummary,
  isContextFresh,
} from "./context.helpers";
// types are referenced via helpers

// Context management configuration
const CONTEXT_CONFIG = {
  MAX_CONTEXT_MESSAGES: 20, // Maximum messages to include in context
  MAX_CONTEXT_TOKENS: 4000, // Maximum tokens for context (adjust based on model)
  SUMMARY_THRESHOLD: 50, // Messages before triggering summary
  ARCHIVE_THRESHOLD: 100, // Messages before archiving old ones
  RELEVANCE_SCORE_THRESHOLD: 0.7, // Minimum relevance score
} as const;

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
      if (cached && isContextFresh(cached.lastUpdated)) {
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
      const contextMessages = await processMessagesForContext(messages.data, {
        maxTokens,
        maxMessages,
        relevanceThreshold,
        includeSystemMessages,
      });

      // Generate summary if needed
      let summary: string | undefined;
      if (
        includeSummary &&
        messages.data.length > CONTEXT_CONFIG.SUMMARY_THRESHOLD
      ) {
        summary = await generateConversationSummary(
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
  // helpers extracted to context.helpers.ts

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

      // Update conversation metadata with supported fields
      await conversationService.updateConversationMetadata(conversationId, {
        last_message_at: new Date() as unknown as import("firebase/firestore").Timestamp,
        last_message_preview: `Archived ${oldMessages.length} messages`,
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
