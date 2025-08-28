import { logger } from "../../../shared/utils/logger";
import type { MessageDocument } from "../types/database.types";

export interface ContextMessage {
  id: string;
  content: string;
  role: "user" | "assistant" | "system";
  timestamp: Date;
  relevanceScore?: number;
  tokens?: number;
}

export const estimateTokenCount = (text: string): number => {
  return Math.ceil(text.length / 4);
};

export const calculateRelevanceScore = (
  message: MessageDocument,
  allMessages: MessageDocument[]
): number => {
  const now = Date.now();
  const messageTime = message.created_at.toMillis();
  const timeDiff = now - messageTime;
  const hoursDiff = timeDiff / (1000 * 60 * 60);

  const recencyScore = Math.max(0, 1 - hoursDiff / 24);
  const contentLength = message.content.length;
  const lengthScore = Math.min(1, contentLength / 500);
  const roleScore =
    message.role === "assistant" ? 0.8 : message.role === "user" ? 0.6 : 0.4;
  const reactionCount = Object.keys(message.reactions || {}).length;
  const engagementScore = Math.min(1, reactionCount * 0.2);

  const relevanceScore =
    recencyScore * 0.4 +
    lengthScore * 0.2 +
    roleScore * 0.3 +
    engagementScore * 0.1;

  return Math.round(relevanceScore * 100) / 100;
};

export const processMessagesForContext = async (
  messages: MessageDocument[],
  options: {
    maxTokens: number;
    maxMessages: number;
    relevanceThreshold: number;
    includeSystemMessages: boolean;
  }
): Promise<ContextMessage[]> => {
  const { maxTokens, maxMessages, relevanceThreshold, includeSystemMessages } =
    options;

  let filteredMessages = messages.filter(msg => {
    if (!includeSystemMessages && msg.role === "system") return false;
    if (msg.status === "deleted") return false;
    return true;
  });

  const scoredMessages = filteredMessages.map(msg => ({
    ...msg,
    relevanceScore: calculateRelevanceScore(msg, messages),
    tokens: estimateTokenCount(msg.content),
  }));

  scoredMessages.sort((a, b) => {
    const relevanceDiff = (b.relevanceScore || 0) - (a.relevanceScore || 0);
    if (Math.abs(relevanceDiff) > 0.1) return relevanceDiff;
    return b.created_at.toMillis() - a.created_at.toMillis();
  });

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

  selectedMessages.sort((a, b) => a.timestamp.getTime() - b.timestamp.getTime());
  return selectedMessages;
};

export const generateConversationSummary = async (
  conversationId: string,
  messages: MessageDocument[]
): Promise<string> => {
  try {
    const userMessages = messages.filter(m => m.role === "user");
    const assistantMessages = messages.filter(m => m.role === "assistant");
    const summary =
      `Conversation with ${userMessages.length} user messages and ${assistantMessages.length} AI responses. ` +
      `Last user message: "${userMessages[userMessages.length - 1]?.content.substring(0, 100)}..."`;
    logger.info("Conversation summary generated", "ContextManagementService", {
      conversationId,
      summaryLength: summary.length,
    });
    return summary;
  } catch (error) {
    logger.error(
      "Failed to generate conversation summary",
      "ContextManagementService",
      error
    );
    return "Summary unavailable";
  }
};

export const isContextFresh = (lastUpdated: Date): boolean => {
  const now = new Date();
  const ageInMinutes = (now.getTime() - lastUpdated.getTime()) / (1000 * 60);
  return ageInMinutes < 5;
};


