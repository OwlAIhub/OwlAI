/**
 * Cloud Functions Module
 * Provides unified interface for server-side processing and background tasks
 */

import { aiProcessingService } from "./ai-processing.service";
import { backgroundTasksService } from "./background-tasks.service";
import { rateLimitingService } from "./rate-limiting.service";

export { aiProcessingService } from "./ai-processing.service";
export { backgroundTasksService } from "./background-tasks.service";
export { rateLimitingService } from "./rate-limiting.service";

// Re-export configuration and types
export {
  CLOUD_FUNCTIONS_CONFIG,
  FUNCTION_ENDPOINTS,
  FUNCTION_PRIORITIES,
  ERROR_CODES,
} from "./config";
export type {
  CloudFunctionRequest,
  CloudFunctionResponse,
  AIProcessingRequest,
  AIProcessingResponse,
  RateLimitInfo,
  ConversationSummaryRequest,
  AnalyticsProcessingRequest,
} from "./config";

// Re-export service types
export type {
  BackgroundTaskResult,
  TaskQueue,
} from "./background-tasks.service";
export type { RateLimitRule, RateLimitStats } from "./rate-limiting.service";

/**
 * Cloud Functions Manager
 * Centralized management of all Cloud Functions services
 */
class CloudFunctionsManager {
  private static instance: CloudFunctionsManager;

  private constructor() {}

  public static getInstance(): CloudFunctionsManager {
    if (!CloudFunctionsManager.instance) {
      CloudFunctionsManager.instance = new CloudFunctionsManager();
    }
    return CloudFunctionsManager.instance;
  }

  /**
   * Get all service statistics
   */
  public getAllServiceStats() {
    return {
      aiProcessing: aiProcessingService.getProcessingStats(),
      backgroundTasks: backgroundTasksService.getServiceStats(),
      rateLimiting: rateLimitingService.getRateLimitStats(),
    };
  }

  /**
   * Health check for all services
   */
  public async healthCheck(): Promise<{
    aiProcessing: boolean;
    backgroundTasks: boolean;
    rateLimiting: boolean;
    overall: boolean;
  }> {
    try {
      // Simple health checks - in production, these would be more comprehensive
      const aiProcessingHealthy =
        aiProcessingService.getProcessingStats().activeRequests >= 0;
      const backgroundTasksHealthy =
        backgroundTasksService.getServiceStats().totalTasks >= 0;
      const rateLimitingHealthy =
        rateLimitingService.getRateLimitStats().activeUsers >= 0;

      const overall =
        aiProcessingHealthy && backgroundTasksHealthy && rateLimitingHealthy;

      return {
        aiProcessing: aiProcessingHealthy,
        backgroundTasks: backgroundTasksHealthy,
        rateLimiting: rateLimitingHealthy,
        overall,
      };
    } catch (error) {
      return {
        aiProcessing: false,
        backgroundTasks: false,
        rateLimiting: false,
        overall: false,
      };
    }
  }

  /**
   * Initialize all services
   */
  public async initialize(): Promise<void> {
    try {
      // Initialize services if needed
      // For now, just log initialization
      console.log("Cloud Functions services initialized");
    } catch (error) {
      console.error("Failed to initialize Cloud Functions services:", error);
      throw error;
    }
  }

  /**
   * Cleanup all services
   */
  public async cleanup(): Promise<void> {
    try {
      // Clear queues and caches
      aiProcessingService.clearQueue();
      backgroundTasksService.clearAllTasks();
      rateLimitingService.clearAllRateLimits();

      console.log("Cloud Functions services cleaned up");
    } catch (error) {
      console.error("Failed to cleanup Cloud Functions services:", error);
      throw error;
    }
  }

  /**
   * Reset all statistics
   */
  public resetAllStats(): void {
    backgroundTasksService.clearAllTasks();
    rateLimitingService.resetStats();
    // Note: AI processing service doesn't have a reset method, but queue is cleared above
  }

  /**
   * Get performance summary
   */
  public getPerformanceSummary() {
    const aiStats = aiProcessingService.getProcessingStats();
    const backgroundStats = backgroundTasksService.getServiceStats();
    const rateLimitStats = rateLimitingService.getRateLimitStats();

    return {
      activeAIRequests: aiStats.activeRequests,
      backgroundTasks: backgroundStats.totalTasks,
      rateLimitHitRate:
        rateLimitStats.totalRequests > 0
          ? (rateLimitStats.limitedRequests / rateLimitStats.totalRequests) *
            100
          : 0,
      averageResponseTime: rateLimitStats.averageResponseTime,
      activeUsers: rateLimitStats.activeUsers,
    };
  }
}

// Export cloud functions manager
export const cloudFunctionsManager = CloudFunctionsManager.getInstance();
