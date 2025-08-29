/**
 * Flowise API Service
 * Handles communication with Flowise AI backend and integrates with chat system
 */

import { logger } from "../../../shared/utils/logger";
import { messageService } from "../../database/services/message.service";
import { conversationService } from "../../database/services/conversation.service";
import { contextManagementService } from "../../database/services/context-management.service";
import { responseCache, CacheUtils } from "../../../shared/utils/cache";

import type { MessageDocument } from "../../database/types/database.types";

// Flowise API Configuration
const FLOWISE_CONFIG = {
  BASE_URL:
    import.meta.env.VITE_FLOWISE_API_URL ||
    "http://34.47.149.141/api/v1/prediction/086aebf7-e250-41e6-b437-061f747041d2",
  TIMEOUT: 15000, // 15 seconds for faster response
  MAX_RETRIES: 2, // Reduced retries for faster failure
  RETRY_DELAY: 500, // Faster retry attempts
} as const;

// Request/Response types
interface FlowiseRequest {
  question: string;
  conversationId?: string;
  userId?: string;
  context?: {
    previousMessages?: string[];
    userPreferences?: any;
  };
}

interface FlowiseResponse {
  text: string;
  sourceDocuments?: any[];
  chatHistory?: any[];
  error?: string;
  metadata?: {
    tokens_used?: number;
    response_time?: number;
    model_used?: string;
    timestamp?: string;
  };
}

interface ChatMessage {
  content: string;
  role: "user" | "assistant" | "system";
  timestamp: Date;
  metadata?: {
    tokens_used?: number;
    response_time?: number;
    model_used?: string;
    source_documents?: any[];
    error?: string;
  };
}

class FlowiseService {
  private static instance: FlowiseService;
  private requestQueue: Map<string, Promise<FlowiseResponse>> = new Map();

  private constructor() {}

  public static getInstance(): FlowiseService {
    if (!FlowiseService.instance) {
      FlowiseService.instance = new FlowiseService();
    }
    return FlowiseService.instance;
  }

  /**
   * Send message using direct Flowise API with caching and deduplication
   */
  public async sendMessage(
    question: string,
    conversationId: string,
    userId: string,
    context?: any
  ): Promise<FlowiseResponse> {
    try {
      const startTime = Date.now();
      
      // Create request key for deduplication
      const requestKey = `${question}:${conversationId}:${userId}`;
      
      // Check if same request is already in progress
      const existingRequest = this.requestQueue.get(requestKey);
      if (existingRequest) {
        logger.info("Returning existing request", "FlowiseService", { requestKey });
        return await existingRequest;
      }

      logger.info(
        "Processing AI request via Flowise API",
        "FlowiseService",
        {
          conversationId,
          userId,
          questionLength: question.length,
        }
      );

      // Create and queue the request
      const requestPromise = this.makeRequest({
        question,
        conversationId,
        userId,
        context,
      });
      
      this.requestQueue.set(requestKey, requestPromise);

      try {
        const response = await requestPromise;
        const responseTime = Date.now() - startTime;

        logger.info(
          "AI response received via Flowise API",
          "FlowiseService",
          {
            conversationId,
            responseTime,
            responseLength: response.text?.length || 0,
          }
        );

        return {
          text: response.text,
          metadata: {
            tokens_used: response.metadata?.tokens_used,
            response_time: responseTime,
            model_used: response.metadata?.model_used,
            timestamp: new Date().toISOString(),
          },
        };
      } finally {
        // Remove from queue when done
        this.requestQueue.delete(requestKey);
      }
    } catch (error) {
      logger.error(
        "Failed to process AI request via Flowise API",
        "FlowiseService",
        error
      );
      throw new Error("Failed to get AI response. Please try again.");
    }
  }

  /**
   * Make HTTP request to Flowise API with retry logic
   */
  private async makeRequest(
    data: FlowiseRequest,
    retryCount = 0
  ): Promise<FlowiseResponse> {
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(
        () => controller.abort(),
        FLOWISE_CONFIG.TIMEOUT
      );

      const response = await fetch(FLOWISE_CONFIG.BASE_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      const result = await response.json();
      return result;
    } catch (error) {
      if (retryCount < FLOWISE_CONFIG.MAX_RETRIES) {
        logger.warn(
          `Flowise request failed, retrying... (${retryCount + 1}/${FLOWISE_CONFIG.MAX_RETRIES})`,
          "FlowiseService",
          error
        );

        await new Promise(resolve =>
          setTimeout(resolve, FLOWISE_CONFIG.RETRY_DELAY * (retryCount + 1))
        );
        return this.makeRequest(data, retryCount + 1);
      }

      throw error;
    }
  }

  /**
   * Process chat message with AI response
   */
  public async processChatMessage(
    userMessage: string,
    conversationId: string,
    userId: string
  ): Promise<{ userMessage: MessageDocument; aiResponse: MessageDocument }> {
    try {
      // 1. Save user message to database
      const userMessageDoc = await messageService.sendMessage(
        conversationId,
        userId,
        {
          content: userMessage,
          role: "user",
          type: "text",
        }
      );

      // 2. Get conversation context (previous messages)
      const context = await this.getConversationContext(conversationId, 5); // Last 5 messages

      // 3. Send to Flowise API
      const aiResponse = await this.sendMessage(
        userMessage,
        conversationId,
        userId,
        context
      );

      // 4. Save AI response to database
      const aiMessageDoc = await messageService.sendMessage(
        conversationId,
        userId,
        {
          content: aiResponse.text,
          role: "assistant",
          type: "text",
          metadata: {
            tokens_used: aiResponse.metadata?.tokens_used,
            response_time: aiResponse.metadata?.response_time,
            model_used: "flowise",
            context_length: aiResponse.text.length,
          },
        }
      );

      // 5. Update conversation analytics
      await this.updateConversationAnalytics(
        conversationId,
        aiResponse.metadata?.response_time
      );

      logger.info("Chat message processed successfully", "FlowiseService", {
        conversationId,
        userMessageId: userMessageDoc.id,
        aiMessageId: aiMessageDoc.id,
        responseTime: aiResponse.metadata?.response_time,
      });

      return {
        userMessage: userMessageDoc,
        aiResponse: aiMessageDoc,
      };
    } catch (error) {
      logger.error("Failed to process chat message", "FlowiseService", error);

      // Save error message to database
      await messageService.sendMessage(conversationId, userId, {
        content: `Sorry, I encountered an error: ${error instanceof Error ? error.message : "Unknown error"}. Please try again.`,
        role: "assistant",
        type: "error",
      });

      throw error;
    }
  }

  /**
   * Get conversation context for AI
   */
  private async getConversationContext(
    conversationId: string,
    messageLimit: number = 5
  ): Promise<any> {
    try {
      const messages = await messageService.getConversationMessages(
        conversationId,
        {
          limit: messageLimit,
        }
      );

      const context = {
        previousMessages: messages.data.map(msg => ({
          role: msg.role,
          content: msg.content,
          timestamp: msg.created_at,
        })),
        conversationId,
        messageCount: messages.data.length,
      };

      return context;
    } catch (error) {
      logger.error(
        "Failed to get conversation context",
        "FlowiseService",
        error
      );
      return { previousMessages: [], conversationId };
    }
  }

  /**
   * Update conversation analytics
   */
  private async updateConversationAnalytics(
    conversationId: string,
    responseTime?: number
  ): Promise<void> {
    try {
      const stats = await messageService.getMessageStats(conversationId);

      await conversationService.updateConversationAnalytics(conversationId, {
        total_duration: stats.averageResponseTime * stats.total,
        average_response_time: responseTime || stats.averageResponseTime,
      });
    } catch (error) {
      logger.error(
        "Failed to update conversation analytics",
        "FlowiseService",
        error
      );
    }
  }

  /**
   * Stream AI response (for future implementation)
   */
  public async streamResponse(
    question: string,
    conversationId: string,
    userId: string,
    onChunk: (chunk: string) => void,
    onComplete: (fullResponse: string) => void,
    onError: (error: Error) => void
  ): Promise<void> {
    try {
      // For now, use regular request
      // TODO: Implement streaming when Flowise supports it
      const response = await this.sendMessage(question, conversationId, userId);

      // Simulate streaming by sending chunks
      const chunks = response.text.split(" ");
      let fullResponse = "";

      for (const chunk of chunks) {
        fullResponse += chunk + " ";
        onChunk(chunk + " ");
        await new Promise(resolve => setTimeout(resolve, 50)); // 50ms delay
      }

      onComplete(fullResponse.trim());
    } catch (error) {
      onError(error instanceof Error ? error : new Error("Streaming failed"));
    }
  }

  /**
   * Get conversation history for context
   */
  public async getConversationHistory(
    conversationId: string
  ): Promise<ChatMessage[]> {
    try {
      const messages = await messageService.getConversationMessages(
        conversationId,
        {
          limit: 50, // Get last 50 messages for context
        }
      );

      return messages.data.map(msg => ({
        content: msg.content,
        role: msg.role,
        timestamp: msg.created_at.toDate(),
        metadata: msg.metadata,
      }));
    } catch (error) {
      logger.error(
        "Failed to get conversation history",
        "FlowiseService",
        error
      );
      return [];
    }
  }

  /**
   * Test Flowise API connection
   */
  public async testConnection(): Promise<boolean> {
    try {
      const response = await this.sendMessage(
        "Hello, this is a test message.",
        "test-conversation",
        "test-user"
      );

      return !!response.text;
    } catch (error) {
      logger.error(
        "Flowise API connection test failed",
        "FlowiseService",
        error
      );
      return false;
    }
  }

  /**
   * Get API configuration
   */
  public getConfig() {
    return { ...FLOWISE_CONFIG };
  }
}

// Export singleton instance
export const flowiseService = FlowiseService.getInstance();

// Export types
export type { FlowiseRequest, FlowiseResponse, ChatMessage };
