/**
 * Cache Service
 * Handles caching of frequently accessed database data for read optimization
 */

import { logger } from "../../../shared/utils/logger";

interface CacheItem<T> {
  data: T;
  timestamp: number;
  ttl: number;
}

interface CacheStats {
  hits: number;
  misses: number;
  size: number;
  hitRate: number;
}

class CacheService {
  private static instance: CacheService;
  private cache: Map<string, CacheItem<any>> = new Map();
  private stats: CacheStats = {
    hits: 0,
    misses: 0,
    size: 0,
    hitRate: 0,
  };

  // Cache configuration
  private readonly DEFAULT_TTL = 5 * 60 * 1000; // 5 minutes
  private readonly MAX_CACHE_SIZE = 1000; // Maximum cache entries
  private readonly CLEANUP_INTERVAL = 60 * 1000; // 1 minute

  private constructor() {
    this.startCleanupInterval();
  }

  public static getInstance(): CacheService {
    if (!CacheService.instance) {
      CacheService.instance = new CacheService();
    }
    return CacheService.instance;
  }

  /**
   * Get data from cache
   */
  public get<T>(key: string): T | null {
    const item = this.cache.get(key);

    if (!item) {
      this.stats.misses++;
      this.updateHitRate();
      return null;
    }

    // Check if item has expired
    if (Date.now() > item.timestamp + item.ttl) {
      this.cache.delete(key);
      this.stats.misses++;
      this.updateHitRate();
      return null;
    }

    this.stats.hits++;
    this.updateHitRate();
    return item.data;
  }

  /**
   * Set data in cache
   */
  public set<T>(key: string, data: T, ttl: number = this.DEFAULT_TTL): void {
    // Evict oldest items if cache is full
    if (this.cache.size >= this.MAX_CACHE_SIZE) {
      this.evictOldest();
    }

    this.cache.set(key, {
      data,
      timestamp: Date.now(),
      ttl,
    });

    this.stats.size = this.cache.size;
  }

  /**
   * Delete item from cache
   */
  public delete(key: string): boolean {
    const deleted = this.cache.delete(key);
    if (deleted) {
      this.stats.size = this.cache.size;
    }
    return deleted;
  }

  /**
   * Clear entire cache
   */
  public clear(): void {
    this.cache.clear();
    this.stats.size = 0;
    this.stats.hits = 0;
    this.stats.misses = 0;
    this.stats.hitRate = 0;
  }

  /**
   * Get cache statistics
   */
  public getStats(): CacheStats {
    return { ...this.stats };
  }

  /**
   * Generate cache key for conversation data
   */
  public generateConversationKey(
    conversationId: string,
    limit: number = 50
  ): string {
    return `conversation:${conversationId}:messages:${limit}`;
  }

  /**
   * Generate cache key for user conversations
   */
  public generateUserConversationsKey(userId: string, status?: string): string {
    return `user:${userId}:conversations:${status || "all"}`;
  }

  /**
   * Generate cache key for message stats
   */
  public generateMessageStatsKey(conversationId: string): string {
    return `stats:conversation:${conversationId}`;
  }

  /**
   * Invalidate cache entries by pattern
   */
  public invalidateByPattern(pattern: string): number {
    let deletedCount = 0;
    const keysToDelete: string[] = [];

    for (const key of this.cache.keys()) {
      if (key.includes(pattern)) {
        keysToDelete.push(key);
      }
    }

    for (const key of keysToDelete) {
      if (this.cache.delete(key)) {
        deletedCount++;
      }
    }

    this.stats.size = this.cache.size;
    return deletedCount;
  }

  /**
   * Evict oldest cache entries
   */
  private evictOldest(): void {
    let oldestKey: string | null = null;
    let oldestTime = Date.now();

    for (const [key, item] of this.cache.entries()) {
      if (item.timestamp < oldestTime) {
        oldestTime = item.timestamp;
        oldestKey = key;
      }
    }

    if (oldestKey) {
      this.cache.delete(oldestKey);
    }
  }

  /**
   * Update hit rate statistics
   */
  private updateHitRate(): void {
    const total = this.stats.hits + this.stats.misses;
    this.stats.hitRate = total > 0 ? (this.stats.hits / total) * 100 : 0;
  }

  /**
   * Start cleanup interval to remove expired items
   */
  private startCleanupInterval(): void {
    setInterval(() => {
      this.cleanupExpired();
    }, this.CLEANUP_INTERVAL);
  }

  /**
   * Remove expired cache items
   */
  private cleanupExpired(): void {
    const now = Date.now();
    const keysToDelete: string[] = [];

    for (const [key, item] of this.cache.entries()) {
      if (now > item.timestamp + item.ttl) {
        keysToDelete.push(key);
      }
    }

    for (const key of keysToDelete) {
      this.cache.delete(key);
    }

    if (keysToDelete.length > 0) {
      this.stats.size = this.cache.size;
      logger.info(
        `Cleaned up ${keysToDelete.length} expired cache items`,
        "CacheService"
      );
    }
  }
}

// Export singleton instance
export const cacheService = CacheService.getInstance();

// Export types
export type { CacheStats };
