/**
 * Conversation Analytics & Search
 */

import type {
  ConversationDocument,
  PaginatedResponse,
  QueryOptions,
} from "../types/database.types";
import { logger } from "../../../shared/utils/logger";
import { conversationService } from "./conversation.service";

export const searchConversations = async (
  userId: string,
  searchTerm: string,
  options: QueryOptions = {}
): Promise<ConversationDocument[]> => {
  try {
    const conversations: PaginatedResponse<ConversationDocument> =
      await conversationService.getUserConversations(userId, {
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
};

export const getConversationStats = async (
  userId: string
): Promise<{
  total: number;
  active: number;
  archived: number;
  totalMessages: number;
  averageMessagesPerConversation: number;
}> => {
  try {
    const conversations = await conversationService.getUserConversations(
      userId,
      {
        limit: 1000,
      }
    );

    const stats = {
      total: conversations.data.length,
      active: conversations.data.filter(c => c.status === "active").length,
      archived: conversations.data.filter(c => c.status === "archived").length,
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
};
