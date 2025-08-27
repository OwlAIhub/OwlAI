/**
 * AI Processing Service
 * Handles server-side AI processing to reduce client-side costs and improve performance
 */

import { logger } from "../../shared/utils/logger";
import {
  CLOUD_FUNCTIONS_CONFIG,
  FUNCTION_ENDPOINTS,
  FUNCTION_PRIORITIES,
  ERROR_CODES,
  type CloudFunctionRequest,
  type CloudFunctionResponse,
  type AIProcessingRequest,
  type AIProcessingResponse,
} from "./config";

class AIProcessingService {
  private static instance: AIProcessingService;
  private requestQueue: Map<string, Promise<AIProcessingResponse>> = new Map();

  private constructor() {}

  public static getInstance(): AIProcessingService {
    if (!AIProcessingService.instance) {
      AIProcessingService.instance = new AIProcessingService();
    }
    return AIProcessingService.instance;
  }

  /**
   * Process AI request on server-side
   */
  public async processAIRequest(
    request: AIProcessingRequest,
    options: {
      priority?: "high" | "normal" | "low";
      stream?: boolean;
      timeout?: number;
    } = {}
  ): Promise<AIProcessingResponse> {
    const requestId = this.generateRequestId();
    const priority = options.priority || FUNCTION_PRIORITIES.NORMAL;

    try {
      logger.info(
        "Processing AI request on server-side",
        "AIProcessingService",
        {
          requestId,
          conversationId: request.conversationId,
          userId: request.userId,
          priority,
          stream: options.stream,
        }
      );

      // Check if request is already being processed
      const existingRequest = this.requestQueue.get(requestId);
      if (existingRequest) {
        return await existingRequest;
      }

      // Create cloud function request
      const cloudRequest: CloudFunctionRequest<AIProcessingRequest> = {
        data: request,
        userId: request.userId,
        conversationId: request.conversationId,
        timestamp: new Date().toISOString(),
        requestId,
        metadata: {
          source: "client",
          priority,
          retryCount: 0,
        },
      };

      // Process request
      const processingPromise = this.executeAIProcessing(cloudRequest, options);
      this.requestQueue.set(requestId, processingPromise);

      const result = await processingPromise;
      this.requestQueue.delete(requestId);

      logger.info(
        "AI processing completed successfully",
        "AIProcessingService",
        {
          requestId,
          processingTime: result.metadata.processingTime,
          tokensUsed: result.metadata.tokensUsed,
          cost: result.metadata.cost,
        }
      );

      return result;
    } catch (error) {
      this.requestQueue.delete(requestId);
      logger.error("AI processing failed", "AIProcessingService", error);
      throw this.handleAIError(error);
    }
  }

  /**
   * Stream AI response
   */
  public async streamAIResponse(
    request: AIProcessingRequest,
    onChunk: (chunk: string) => void,
    onComplete: (fullResponse: AIProcessingResponse) => void,
    onError: (error: Error) => void
  ): Promise<void> {
    const requestId = this.generateRequestId();

    try {
      logger.info("Starting AI streaming", "AIProcessingService", {
        requestId,
        conversationId: request.conversationId,
        userId: request.userId,
      });

      const cloudRequest: CloudFunctionRequest<AIProcessingRequest> = {
        data: { ...request, options: { ...request.options, stream: true } },
        userId: request.userId,
        conversationId: request.conversationId,
        timestamp: new Date().toISOString(),
        requestId,
        metadata: {
          source: "client",
          priority: FUNCTION_PRIORITIES.HIGH,
          retryCount: 0,
        },
      };

      await this.executeStreamingRequest(
        cloudRequest,
        onChunk,
        onComplete,
        onError
      );
    } catch (error) {
      logger.error("AI streaming failed", "AIProcessingService", error);
      onError(this.handleAIError(error));
    }
  }

  /**
   * Execute AI processing on Cloud Functions
   */
  private async executeAIProcessing(
    request: CloudFunctionRequest<AIProcessingRequest>,
    options: { timeout?: number }
  ): Promise<AIProcessingResponse> {
    const controller = new AbortController();
    const timeout = options.timeout || CLOUD_FUNCTIONS_CONFIG.TIMEOUT;

    const timeoutId = setTimeout(() => controller.abort(), timeout);

    try {
      const response = await fetch(
        `${CLOUD_FUNCTIONS_CONFIG.BASE_URL}${FUNCTION_ENDPOINTS.AI_PROCESSING}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${await this.getAuthToken()}`,
          },
          body: JSON.stringify(request),
          signal: controller.signal,
        }
      );

      clearTimeout(timeoutId);

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      const result: CloudFunctionResponse<AIProcessingResponse> =
        await response.json();

      if (!result.success) {
        throw new Error(result.error?.message || "AI processing failed");
      }

      return result.data!;
    } catch (error) {
      clearTimeout(timeoutId);
      throw error;
    }
  }

  /**
   * Execute streaming request
   */
  private async executeStreamingRequest(
    request: CloudFunctionRequest<AIProcessingRequest>,
    onChunk: (chunk: string) => void,
    onComplete: (fullResponse: AIProcessingResponse) => void,
    onError: (error: Error) => void
  ): Promise<void> {
    try {
      const response = await fetch(
        `${CLOUD_FUNCTIONS_CONFIG.BASE_URL}${FUNCTION_ENDPOINTS.AI_STREAMING}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${await this.getAuthToken()}`,
          },
          body: JSON.stringify(request),
        }
      );

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      const reader = response.body?.getReader();
      if (!reader) {
        throw new Error("Stream reader not available");
      }

      let fullResponse = "";
      const decoder = new TextDecoder();

      while (true) {
        const { done, value } = await reader.read();

        if (done) break;

        const chunk = decoder.decode(value);
        const lines = chunk.split("\n");

        for (const line of lines) {
          if (line.startsWith("data: ")) {
            const data = line.slice(6);

            if (data === "[DONE]") {
              // Stream completed
              const finalResponse: AIProcessingResponse = {
                text: fullResponse,
                metadata: {
                  tokensUsed: 0, // Will be updated by server
                  modelUsed: "streaming",
                  processingTime: Date.now(),
                  cost: 0,
                },
              };
              onComplete(finalResponse);
              return;
            }

            try {
              const parsed = JSON.parse(data);
              if (parsed.chunk) {
                fullResponse += parsed.chunk;
                onChunk(parsed.chunk);
              }
            } catch (e) {
              // Ignore parsing errors for partial chunks
            }
          }
        }
      }
    } catch (error) {
      onError(error instanceof Error ? error : new Error("Streaming failed"));
    }
  }

  /**
   * Get authentication token
   */
  private async getAuthToken(): Promise<string> {
    // This should be implemented based on your auth system
    // For now, return a placeholder
    return "placeholder-token";
  }

  /**
   * Generate unique request ID
   */
  private generateRequestId(): string {
    return `ai-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  }

  /**
   * Handle AI processing errors
   */
  private handleAIError(error: any): Error {
    if (error.name === "AbortError") {
      return new Error("AI processing timed out");
    }

    if (error.message?.includes("RATE_LIMIT")) {
      return new Error("Rate limit exceeded. Please try again later.");
    }

    if (error.message?.includes("UNAUTHORIZED")) {
      return new Error("Authentication failed");
    }

    return new Error("AI processing failed. Please try again.");
  }

  /**
   * Get processing statistics
   */
  public getProcessingStats() {
    return {
      activeRequests: this.requestQueue.size,
      queueSize: this.requestQueue.size,
    };
  }

  /**
   * Clear request queue
   */
  public clearQueue(): void {
    this.requestQueue.clear();
  }
}

// Export singleton instance
export const aiProcessingService = AIProcessingService.getInstance();

// Export types
export type { AIProcessingRequest, AIProcessingResponse };
