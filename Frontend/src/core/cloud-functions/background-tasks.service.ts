/**
 * Background Tasks Service
 * Handles server-side background processing for summarization, analytics, and archival
 */

import { logger } from "../../shared/utils/logger";
import {
  CLOUD_FUNCTIONS_CONFIG,
  FUNCTION_ENDPOINTS,
  FUNCTION_PRIORITIES,
  type CloudFunctionRequest,
  type CloudFunctionResponse,
  type ConversationSummaryRequest,
  type AnalyticsProcessingRequest,
} from "./config";

interface BackgroundTaskResult {
  success: boolean;
  taskId: string;
  processingTime: number;
  data?: any;
  error?: string;
}

interface TaskQueue {
  [taskId: string]: {
    status: "pending" | "processing" | "completed" | "failed";
    result?: BackgroundTaskResult;
    timestamp: number;
  };
}

class BackgroundTasksService {
  private static instance: BackgroundTasksService;
  private taskQueue: TaskQueue = {};
  private processingTasks: Set<string> = new Set();

  private constructor() {}

  public static getInstance(): BackgroundTasksService {
    if (!BackgroundTasksService.instance) {
      BackgroundTasksService.instance = new BackgroundTasksService();
    }
    return BackgroundTasksService.instance;
  }

  /**
   * Generate conversation summary
   */
  public async generateConversationSummary(
    conversationId: string,
    userId: string,
    messages: Array<{
      role: "user" | "assistant";
      content: string;
      timestamp: string;
    }>
  ): Promise<BackgroundTaskResult> {
    const taskId = this.generateTaskId("summary", conversationId);

    try {
      logger.info(
        "Starting conversation summary generation",
        "BackgroundTasksService",
        {
          taskId,
          conversationId,
          userId,
          messageCount: messages.length,
        }
      );

      const request: CloudFunctionRequest<ConversationSummaryRequest> = {
        data: {
          conversationId,
          userId,
          messages,
        },
        userId,
        conversationId,
        timestamp: new Date().toISOString(),
        requestId: taskId,
        metadata: {
          source: "background",
          priority: FUNCTION_PRIORITIES.LOW,
          retryCount: 0,
        },
      };

      this.taskQueue[taskId] = {
        status: "processing",
        timestamp: Date.now(),
      };

      const result = await this.executeBackgroundTask(
        FUNCTION_ENDPOINTS.CONVERSATION_SUMMARY,
        request
      );

      this.taskQueue[taskId] = {
        status: "completed",
        result,
        timestamp: Date.now(),
      };

      logger.info(
        "Conversation summary generated successfully",
        "BackgroundTasksService",
        {
          taskId,
          processingTime: result.processingTime,
        }
      );

      return result;
    } catch (error) {
      const errorResult: BackgroundTaskResult = {
        success: false,
        taskId,
        processingTime:
          Date.now() - (this.taskQueue[taskId]?.timestamp || Date.now()),
        error: error instanceof Error ? error.message : "Unknown error",
      };

      this.taskQueue[taskId] = {
        status: "failed",
        result: errorResult,
        timestamp: Date.now(),
      };

      logger.error(
        "Conversation summary generation failed",
        "BackgroundTasksService",
        error
      );
      return errorResult;
    }
  }

  /**
   * Process analytics data
   */
  public async processAnalytics(
    userId: string,
    conversationId: string,
    events: Array<{
      type: string;
      data: any;
      timestamp: string;
    }>
  ): Promise<BackgroundTaskResult> {
    const taskId = this.generateTaskId("analytics", conversationId);

    try {
      logger.info("Starting analytics processing", "BackgroundTasksService", {
        taskId,
        conversationId,
        userId,
        eventCount: events.length,
      });

      const request: CloudFunctionRequest<AnalyticsProcessingRequest> = {
        data: {
          userId,
          conversationId,
          events,
        },
        userId,
        conversationId,
        timestamp: new Date().toISOString(),
        requestId: taskId,
        metadata: {
          source: "background",
          priority: FUNCTION_PRIORITIES.LOW,
          retryCount: 0,
        },
      };

      this.taskQueue[taskId] = {
        status: "processing",
        timestamp: Date.now(),
      };

      const result = await this.executeBackgroundTask(
        FUNCTION_ENDPOINTS.ANALYTICS_PROCESSING,
        request
      );

      this.taskQueue[taskId] = {
        status: "completed",
        result,
        timestamp: Date.now(),
      };

      logger.info(
        "Analytics processing completed successfully",
        "BackgroundTasksService",
        {
          taskId,
          processingTime: result.processingTime,
        }
      );

      return result;
    } catch (error) {
      const errorResult: BackgroundTaskResult = {
        success: false,
        taskId,
        processingTime:
          Date.now() - (this.taskQueue[taskId]?.timestamp || Date.now()),
        error: error instanceof Error ? error.message : "Unknown error",
      };

      this.taskQueue[taskId] = {
        status: "failed",
        result: errorResult,
        timestamp: Date.now(),
      };

      logger.error(
        "Analytics processing failed",
        "BackgroundTasksService",
        error
      );
      return errorResult;
    }
  }

  /**
   * Archive old messages
   */
  public async archiveMessages(
    conversationId: string,
    userId: string,
    messageIds: string[]
  ): Promise<BackgroundTaskResult> {
    const taskId = this.generateTaskId("archival", conversationId);

    try {
      logger.info("Starting message archival", "BackgroundTasksService", {
        taskId,
        conversationId,
        userId,
        messageCount: messageIds.length,
      });

      const request: CloudFunctionRequest<{
        conversationId: string;
        userId: string;
        messageIds: string[];
      }> = {
        data: {
          conversationId,
          userId,
          messageIds,
        },
        userId,
        conversationId,
        timestamp: new Date().toISOString(),
        requestId: taskId,
        metadata: {
          source: "background",
          priority: FUNCTION_PRIORITIES.LOW,
          retryCount: 0,
        },
      };

      this.taskQueue[taskId] = {
        status: "processing",
        timestamp: Date.now(),
      };

      const result = await this.executeBackgroundTask(
        FUNCTION_ENDPOINTS.MESSAGE_ARCHIVAL,
        request
      );

      this.taskQueue[taskId] = {
        status: "completed",
        result,
        timestamp: Date.now(),
      };

      logger.info(
        "Message archival completed successfully",
        "BackgroundTasksService",
        {
          taskId,
          processingTime: result.processingTime,
        }
      );

      return result;
    } catch (error) {
      const errorResult: BackgroundTaskResult = {
        success: false,
        taskId,
        processingTime:
          Date.now() - (this.taskQueue[taskId]?.timestamp || Date.now()),
        error: error instanceof Error ? error.message : "Unknown error",
      };

      this.taskQueue[taskId] = {
        status: "failed",
        result: errorResult,
        timestamp: Date.now(),
      };

      logger.error("Message archival failed", "BackgroundTasksService", error);
      return errorResult;
    }
  }

  /**
   * Execute background task on Cloud Functions
   */
  private async executeBackgroundTask<T>(
    endpoint: string,
    request: CloudFunctionRequest<T>
  ): Promise<BackgroundTaskResult> {
    const startTime = Date.now();
    const taskId = request.requestId;

    try {
      const response = await fetch(
        `${CLOUD_FUNCTIONS_CONFIG.BASE_URL}${endpoint}`,
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

      const result: CloudFunctionResponse = await response.json();

      if (!result.success) {
        throw new Error(result.error?.message || "Background task failed");
      }

      return {
        success: true,
        taskId,
        processingTime: Date.now() - startTime,
        data: result.data,
      };
    } catch (error) {
      return {
        success: false,
        taskId,
        processingTime: Date.now() - startTime,
        error: error instanceof Error ? error.message : "Unknown error",
      };
    }
  }

  /**
   * Get task status
   */
  public getTaskStatus(taskId: string): {
    status: "pending" | "processing" | "completed" | "failed" | "not_found";
    result?: BackgroundTaskResult;
    timestamp?: number;
  } {
    const task = this.taskQueue[taskId];
    if (!task) {
      return { status: "not_found" };
    }

    return {
      status: task.status,
      result: task.result,
      timestamp: task.timestamp,
    };
  }

  /**
   * Get all task statuses
   */
  public getAllTaskStatuses(): TaskQueue {
    return { ...this.taskQueue };
  }

  /**
   * Clean up completed tasks
   */
  public cleanupCompletedTasks(maxAge: number = 24 * 60 * 60 * 1000): number {
    const now = Date.now();
    let cleanedCount = 0;

    for (const [taskId, task] of Object.entries(this.taskQueue)) {
      if (
        (task.status === "completed" || task.status === "failed") &&
        now - task.timestamp > maxAge
      ) {
        delete this.taskQueue[taskId];
        cleanedCount++;
      }
    }

    if (cleanedCount > 0) {
      logger.info(
        `Cleaned up ${cleanedCount} completed tasks`,
        "BackgroundTasksService"
      );
    }

    return cleanedCount;
  }

  /**
   * Get authentication token
   */
  private async getAuthToken(): Promise<string> {
    // This should be implemented based on your auth system
    return "placeholder-token";
  }

  /**
   * Generate unique task ID
   */
  private generateTaskId(type: string, conversationId: string): string {
    return `${type}-${conversationId}-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  }

  /**
   * Get service statistics
   */
  public getServiceStats() {
    const stats = {
      totalTasks: Object.keys(this.taskQueue).length,
      pendingTasks: 0,
      processingTasks: 0,
      completedTasks: 0,
      failedTasks: 0,
    };

    for (const task of Object.values(this.taskQueue)) {
      stats[`${task.status}Tasks`]++;
    }

    return stats;
  }

  /**
   * Clear all tasks
   */
  public clearAllTasks(): void {
    this.taskQueue = {};
    this.processingTasks.clear();
  }
}

// Export singleton instance
export const backgroundTasksService = BackgroundTasksService.getInstance();

// Export types
export type { BackgroundTaskResult, TaskQueue };
