/**
 * Database Optimization Module
 * Provides unified interface for database performance optimization
 */

import { batchService } from "./batch.service";
import { cacheService } from "./cache.service";
import { queryService } from "./query.service";

export { cacheService } from "./cache.service";
export { batchService } from "./batch.service";
export { queryService } from "./query.service";

// Re-export types
export type { CacheStats } from "./cache.service";
export type { BatchOperation, BatchStats } from "./batch.service";
export type { QueryStats, OptimizedQueryOptions } from "./query.service";

/**
 * Database Optimization Manager
 * Centralized management of all optimization services
 */
class DatabaseOptimizationManager {
  private static instance: DatabaseOptimizationManager;

  private constructor() {}

  public static getInstance(): DatabaseOptimizationManager {
    if (!DatabaseOptimizationManager.instance) {
      DatabaseOptimizationManager.instance = new DatabaseOptimizationManager();
    }
    return DatabaseOptimizationManager.instance;
  }

  /**
   * Get optimization statistics
   */
  public getOptimizationStats() {
    return {
      cache: cacheService.getStats(),
      batch: batchService.getStats(),
      query: queryService.getStats(),
    };
  }

  /**
   * Reset all optimization statistics
   */
  public resetAllStats(): void {
    cacheService.clear();
    batchService.resetStats();
    queryService.resetStats();
  }

  /**
   * Clear all caches
   */
  public clearAllCaches(): void {
    cacheService.clear();
  }

  /**
   * Flush all pending batch operations
   */
  public async flushAllBatches(): Promise<void> {
    await batchService.flush();
  }

  /**
   * Invalidate all caches for a conversation
   */
  public invalidateConversationCaches(conversationId: string): void {
    queryService.invalidateConversationCache(conversationId);
  }

  /**
   * Invalidate all caches for a user
   */
  public invalidateUserCaches(userId: string): void {
    queryService.invalidateUserCache(userId);
  }

  /**
   * Get performance summary
   */
  public getPerformanceSummary() {
    const cacheStats = cacheService.getStats();
    const batchStats = batchService.getStats();
    const queryStats = queryService.getStats();

    return {
      cacheHitRate: cacheStats.hitRate,
      averageQueryTime: queryStats.averageQueryTime,
      batchEfficiency: batchStats.averageBatchSize,
      totalOperations: batchStats.totalOperations,
      cacheSize: cacheStats.size,
    };
  }
}

// Export optimization manager
export const optimizationManager = DatabaseOptimizationManager.getInstance();
