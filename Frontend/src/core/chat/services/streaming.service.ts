/**
 * Streaming Service
 * Handles real-time streaming of AI responses with proper error handling and reconnection
 */

import { logger } from "../../../shared/utils/logger";
import { aiProcessingService } from "../../cloud-functions";

interface StreamingOptions {
  onChunk: (chunk: string) => void;
  onComplete: (fullResponse: string) => void;
  onError: (error: Error) => void;
  onStart?: () => void;
  timeout?: number;
}

interface StreamingRequest {
  question: string;
  conversationId: string;
  userId: string;
  context?: string;
}

class StreamingService {
  private static instance: StreamingService;
  private abortController: AbortController | null = null;
  private isStreaming = false;

  private constructor() {}

  public static getInstance(): StreamingService {
    if (!StreamingService.instance) {
      StreamingService.instance = new StreamingService();
    }
    return StreamingService.instance;
  }

  /**
   * Start streaming AI response
   */
  public async startStreaming(
    request: StreamingRequest,
    options: StreamingOptions
  ): Promise<void> {
    if (this.isStreaming) {
      throw new Error("Streaming already in progress");
    }

    this.isStreaming = true;
    this.abortController = new AbortController();

    try {
      options.onStart?.();

      logger.info("Starting AI response streaming", "StreamingService", {
        conversationId: request.conversationId,
        userId: request.userId,
        questionLength: request.question.length,
      });

      // Use the Cloud Functions AI processing service for streaming
      await aiProcessingService.streamAIResponse(
        {
          question: request.question,
          conversationId: request.conversationId,
          userId: request.userId,
          context: request.context,
        },
        {
          onChunk: (chunk: string) => {
            options.onChunk(chunk);
          },
          onComplete: (fullResponse: string) => {
            this.isStreaming = false;
            options.onComplete(fullResponse);

            logger.info("AI response streaming completed", "StreamingService", {
              conversationId: request.conversationId,
              responseLength: fullResponse.length,
            });
          },
          onError: (error: Error) => {
            this.isStreaming = false;
            options.onError(error);

            logger.error(
              "AI response streaming failed",
              "StreamingService",
              error
            );
          },
          timeout: options.timeout || 30000, // 30 seconds default
        }
      );
    } catch (error) {
      this.isStreaming = false;
      const errorMessage =
        error instanceof Error ? error.message : "Unknown streaming error";
      options.onError(new Error(errorMessage));

      logger.error("Failed to start streaming", "StreamingService", error);
    }
  }

  /**
   * Stop current streaming
   */
  public stopStreaming(): void {
    if (this.abortController) {
      this.abortController.abort();
      this.abortController = null;
    }
    this.isStreaming = false;

    logger.info("Streaming stopped by user", "StreamingService");
  }

  /**
   * Check if currently streaming
   */
  public isCurrentlyStreaming(): boolean {
    return this.isStreaming;
  }

  /**
   * Process streaming response with typing effect
   */
  public processStreamingResponse(
    fullResponse: string,
    onUpdate: (displayedText: string) => void,
    typingSpeed: number = 30
  ): Promise<void> {
    return new Promise(resolve => {
      let currentIndex = 0;
      const interval = setInterval(() => {
        if (currentIndex < fullResponse.length) {
          const displayedText = fullResponse.substring(0, currentIndex + 1);
          onUpdate(displayedText);
          currentIndex++;
        } else {
          clearInterval(interval);
          resolve();
        }
      }, typingSpeed);
    });
  }

  /**
   * Simulate streaming for development/testing
   */
  public async simulateStreaming(
    response: string,
    options: StreamingOptions,
    delay: number = 50
  ): Promise<void> {
    if (this.isStreaming) {
      throw new Error("Streaming already in progress");
    }

    this.isStreaming = true;
    this.abortController = new AbortController();

    try {
      options.onStart?.();

      // Split response into chunks
      const chunks = response.split(" ");
      let fullResponse = "";

      for (const chunk of chunks) {
        if (this.abortController.signal.aborted) {
          break;
        }

        fullResponse += (fullResponse ? " " : "") + chunk;
        options.onChunk(fullResponse);

        // Add delay between chunks
        await new Promise(resolve => setTimeout(resolve, delay));
      }

      if (!this.abortController.signal.aborted) {
        options.onComplete(fullResponse);
      }
    } catch (error) {
      options.onError(
        error instanceof Error ? error : new Error("Simulation failed")
      );
    } finally {
      this.isStreaming = false;
    }
  }

  /**
   * Get streaming statistics
   */
  public getStreamingStats(): {
    isStreaming: boolean;
    hasAbortController: boolean;
  } {
    return {
      isStreaming: this.isStreaming,
      hasAbortController: this.abortController !== null,
    };
  }

  /**
   * Reset streaming service
   */
  public reset(): void {
    this.stopStreaming();
    this.isStreaming = false;
    this.abortController = null;
  }
}

// Export singleton instance
export const streamingService = StreamingService.getInstance();
