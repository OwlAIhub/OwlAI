/**
 * AI Chat Hook
 * Enhanced chat hook that integrates Flowise AI with real-time chat functionality
 */

import { useState, useCallback } from "react";
import { useRealtimeChat } from "./useRealtimeChat";
import { flowiseService } from "../../api/services/flowise.service";
import { logger } from "../../../shared/utils/logger";
import type { MessageDocument } from "../types/database.types";

interface UseAIChatReturn {
  // Inherit all real-time chat functionality
  conversations: any[];
  currentConversation: any;
  messages: MessageDocument[];
  isLoading: boolean;
  isSending: boolean;

  // AI-specific state
  isAIResponding: boolean;
  aiError: string | null;

  // Enhanced actions
  sendAIMessage: (content: string) => Promise<void>;
  sendMessageWithStreaming: (
    content: string,
    onChunk?: (chunk: string) => void
  ) => Promise<void>;
  testAIConnection: () => Promise<boolean>;

  // Inherit all other actions
  createConversation: (title?: string, type?: string) => Promise<any>;
  selectConversation: (conversationId: string) => void;
  sendMessage: (
    content: string,
    role?: "user" | "assistant"
  ) => Promise<MessageDocument>;
  updateConversation: (updates: any) => Promise<void>;
  archiveConversation: (conversationId: string) => Promise<void>;
  deleteConversation: (conversationId: string) => Promise<void>;
  updateMessage: (messageId: string, updates: any) => Promise<void>;
  deleteMessage: (messageId: string) => Promise<void>;
  addReaction: (messageId: string, reaction: string) => Promise<void>;
  removeReaction: (messageId: string) => Promise<void>;
  loadMoreMessages: () => Promise<void>;
  hasMoreMessages: boolean;
  startListening: () => void;
  stopListening: () => void;
  error: string | null;
  clearError: () => void;
}

export const useAIChat = (userId: string): UseAIChatReturn => {
  const realtimeChat = useRealtimeChat(userId);
  const [isAIResponding, setIsAIResponding] = useState(false);
  const [aiError, setAiError] = useState<string | null>(null);

  // Enhanced send message with AI integration
  const sendAIMessage = useCallback(
    async (content: string): Promise<void> => {
      if (!realtimeChat.currentConversation) {
        throw new Error("No conversation selected");
      }

      try {
        setAiError(null);
        setIsAIResponding(true);

        // Process the message through Flowise AI
        const result = await flowiseService.processChatMessage(
          content,
          realtimeChat.currentConversation.id,
          userId
        );

        logger.info("AI message processed successfully", "useAIChat", {
          conversationId: realtimeChat.currentConversation.id,
          userMessageId: result.userMessage.id,
          aiMessageId: result.aiResponse.id,
        });
      } catch (error) {
        const errorMessage =
          error instanceof Error ? error.message : "Failed to get AI response";
        setAiError(errorMessage);
        logger.error("Failed to send AI message", "useAIChat", error);
        throw error;
      } finally {
        setIsAIResponding(false);
      }
    },
    [realtimeChat.currentConversation, userId]
  );

  // Send message with streaming (simulated)
  const sendMessageWithStreaming = useCallback(
    async (
      content: string,
      onChunk?: (chunk: string) => void
    ): Promise<void> => {
      if (!realtimeChat.currentConversation) {
        throw new Error("No conversation selected");
      }

      try {
        setAiError(null);
        setIsAIResponding(true);

        // First, save the user message
        await realtimeChat.sendMessage(content, "user");

        // Then stream the AI response
        await flowiseService.streamResponse(
          content,
          realtimeChat.currentConversation.id,
          userId,
          chunk => {
            if (onChunk) onChunk(chunk);
          },
          async fullResponse => {
            // Save the complete AI response
            await realtimeChat.sendMessage(fullResponse, "assistant");
          },
          error => {
            setAiError(error.message);
            logger.error("Streaming error", "useAIChat", error);
          }
        );
      } catch (error) {
        const errorMessage =
          error instanceof Error ? error.message : "Failed to get AI response";
        setAiError(errorMessage);
        logger.error("Failed to send streaming message", "useAIChat", error);
        throw error;
      } finally {
        setIsAIResponding(false);
      }
    },
    [realtimeChat.currentConversation, userId, realtimeChat.sendMessage]
  );

  // Test AI connection
  const testAIConnection = useCallback(async (): Promise<boolean> => {
    try {
      const isConnected = await flowiseService.testConnection();

      if (isConnected) {
        logger.info("AI connection test successful", "useAIChat");
      } else {
        logger.warn("AI connection test failed", "useAIChat");
      }

      return isConnected;
    } catch (error) {
      logger.error("AI connection test error", "useAIChat", error);
      return false;
    }
  }, []);

  // Clear AI error
  const clearAIError = useCallback(() => {
    setAiError(null);
  }, []);

  return {
    // Inherit all real-time chat functionality
    ...realtimeChat,

    // AI-specific state
    isAIResponding,
    aiError,

    // Enhanced actions
    sendAIMessage,
    sendMessageWithStreaming,
    testAIConnection,

    // Override error handling to include AI errors
    error: realtimeChat.error || aiError,
    clearError: () => {
      realtimeChat.clearError();
      clearAIError();
    },
  };
};
