/**
 * 🚀 LEGENDARY CACHE MANAGER
 * Peak Performance Caching System
 * - Multi-layer caching (Memory + LocalStorage + SessionStorage)
 * - LRU eviction with TTL
 * - Intelligent cache warming
 * - Performance metrics tracking
 */

interface CacheEntry<T> {
  data: T;
  timestamp: number;
  expiresAt: number;
  accessCount: number;
  lastAccessed: number;
  size: number;
}

interface CacheMetrics {
  hits: number;
  misses: number;
  evictions: number;
  totalOperations: number;
  avgAccessTime: number;
  memoryUsage: number;
}

type CacheLayer = "memory" | "localStorage" | "sessionStorage";

export class LegendaryCacheManager {
  private static instance: LegendaryCacheManager;
  private cache = new Map<string, CacheEntry<unknown>>();
  private metrics: CacheMetrics = {
    hits: 0,
    misses: 0,
    evictions: 0,
    totalOperations: 0,
    avgAccessTime: 0,
    memoryUsage: 0,
  };

  private readonly MAX_MEMORY_SIZE = 50 * 1024 * 1024; // 50MB
  private readonly MAX_ENTRIES = 10000;
  private readonly DEFAULT_TTL = 30 * 60 * 1000; // 30 minutes
  private readonly CLEANUP_INTERVAL = 5 * 60 * 1000; // 5 minutes

  private cleanupTimer?: NodeJS.Timeout;

  private constructor() {
    this.startCleanupTimer();
    this.loadFromPersistentStorage();
  }

  static getInstance(): LegendaryCacheManager {
    if (!LegendaryCacheManager.instance) {
      LegendaryCacheManager.instance = new LegendaryCacheManager();
    }
    return LegendaryCacheManager.instance;
  }

  /**
   * 🔥 LEGENDARY GET - Multi-layer retrieval with performance tracking
   */
  async get<T>(
    key: string,
    layers: CacheLayer[] = ["memory", "localStorage"],
  ): Promise<T | null> {
    const startTime = performance.now();
    this.metrics.totalOperations++;

    try {
      // Check memory first (fastest)
      if (layers.includes("memory")) {
        const entry = this.cache.get(key);
        if (entry && entry.expiresAt > Date.now()) {
          entry.accessCount++;
          entry.lastAccessed = Date.now();
          this.metrics.hits++;
          this.updateAvgAccessTime(performance.now() - startTime);
          return entry.data as T;
        }
      }

      // Check localStorage (persistent)
      if (layers.includes("localStorage")) {
        const stored = this.getFromStorage("localStorage", key);
        if (stored) {
          // Promote to memory cache for future access
          this.set(key, stored, { layers: ["memory"] });
          this.metrics.hits++;
          this.updateAvgAccessTime(performance.now() - startTime);
          return stored as T;
        }
      }

      // Check sessionStorage (session-scoped)
      if (layers.includes("sessionStorage")) {
        const stored = this.getFromStorage("sessionStorage", key);
        if (stored) {
          // Promote to memory and localStorage
          this.set(key, stored, { layers: ["memory", "localStorage"] });
          this.metrics.hits++;
          this.updateAvgAccessTime(performance.now() - startTime);
          return stored as T;
        }
      }

      this.metrics.misses++;
      this.updateAvgAccessTime(performance.now() - startTime);
      return null;
    } catch (error) {
      console.error("LegendaryCacheManager: Get error", error);
      this.metrics.misses++;
      return null;
    }
  }

  /**
   * 🚀 LEGENDARY SET - Intelligent multi-layer storage
   */
  set<T>(
    key: string,
    data: T,
    options: {
      ttl?: number;
      layers?: CacheLayer[];
      priority?: "low" | "normal" | "high";
    } = {},
  ): void {
    const {
      ttl = this.DEFAULT_TTL,
      layers = ["memory", "localStorage"],
      priority = "normal",
    } = options;

    const now = Date.now();
    const serializedSize = this.calculateSize(data);

    // Ensure we have space in memory
    if (layers.includes("memory")) {
      this.ensureSpace(serializedSize, priority);

      const entry: CacheEntry<T> = {
        data,
        timestamp: now,
        expiresAt: now + ttl,
        accessCount: 1,
        lastAccessed: now,
        size: serializedSize,
      };

      this.cache.set(key, entry);
      this.updateMemoryUsage();
    }

    // Store in persistent layers
    if (layers.includes("localStorage")) {
      this.setToStorage("localStorage", key, data, now + ttl);
    }

    if (layers.includes("sessionStorage")) {
      this.setToStorage("sessionStorage", key, data, now + ttl);
    }
  }

  /**
   * 🔥 LEGENDARY INVALIDATE - Smart cache invalidation
   */
  invalidate(pattern: string | RegExp): number {
    let invalidated = 0;

    if (typeof pattern === "string") {
      // Exact match
      if (this.cache.has(pattern)) {
        this.cache.delete(pattern);
        invalidated++;
      }
      this.removeFromStorage("localStorage", pattern);
      this.removeFromStorage("sessionStorage", pattern);
    } else {
      // Pattern match
      for (const key of this.cache.keys()) {
        if (pattern.test(key)) {
          this.cache.delete(key);
          invalidated++;
          this.removeFromStorage("localStorage", key);
          this.removeFromStorage("sessionStorage", key);
        }
      }
    }

    this.updateMemoryUsage();
    return invalidated;
  }

  /**
   * 📊 LEGENDARY METRICS - Performance insights
   */
  getMetrics(): CacheMetrics & { hitRate: number; efficiency: number } {
    const hitRate =
      this.metrics.totalOperations > 0
        ? (this.metrics.hits / this.metrics.totalOperations) * 100
        : 0;

    const efficiency =
      this.metrics.avgAccessTime > 0
        ? Math.max(0, 100 - this.metrics.avgAccessTime)
        : 100;

    return {
      ...this.metrics,
      hitRate: Math.round(hitRate * 100) / 100,
      efficiency: Math.round(efficiency * 100) / 100,
    };
  }

  /**
   * 🧹 LEGENDARY CLEANUP - Smart memory management
   */
  private ensureSpace(
    neededSize: number,
    priority: "low" | "normal" | "high",
  ): void {
    const currentSize = this.metrics.memoryUsage;

    if (
      currentSize + neededSize <= this.MAX_MEMORY_SIZE &&
      this.cache.size < this.MAX_ENTRIES
    ) {
      return; // Enough space
    }

    // LRU eviction with priority consideration
    const entries = Array.from(this.cache.entries())
      .map(([key, entry]) => ({ key, ...entry }))
      .sort((a, b) => {
        // Priority override
        if (priority === "high") return b.lastAccessed - a.lastAccessed;

        // LRU with access count weighting
        const scoreA = a.lastAccessed + a.accessCount * 10000;
        const scoreB = b.lastAccessed + b.accessCount * 10000;
        return scoreA - scoreB;
      });

    let freedSpace = 0;
    let evicted = 0;

    for (const entry of entries) {
      if (freedSpace >= neededSize && this.cache.size < this.MAX_ENTRIES) break;

      this.cache.delete(entry.key);
      freedSpace += entry.size;
      evicted++;
    }

    this.metrics.evictions += evicted;
    this.updateMemoryUsage();
  }

  private startCleanupTimer(): void {
    this.cleanupTimer = setInterval(() => {
      this.cleanup();
    }, this.CLEANUP_INTERVAL);
  }

  private cleanup(): void {
    const now = Date.now();
    let cleaned = 0;

    for (const [key, entry] of this.cache.entries()) {
      if (entry.expiresAt <= now) {
        this.cache.delete(key);
        cleaned++;
      }
    }

    if (cleaned > 0) {
      this.updateMemoryUsage();
    }

    // Clean persistent storage
    this.cleanupStorage("localStorage");
    this.cleanupStorage("sessionStorage");
  }

  private calculateSize(data: unknown): number {
    try {
      return new Blob([JSON.stringify(data)]).size;
    } catch {
      return JSON.stringify(data).length * 2; // Rough estimate
    }
  }

  private updateMemoryUsage(): void {
    this.metrics.memoryUsage = Array.from(this.cache.values()).reduce(
      (total, entry) => total + entry.size,
      0,
    );
  }

  private updateAvgAccessTime(time: number): void {
    const total =
      this.metrics.avgAccessTime * (this.metrics.totalOperations - 1) + time;
    this.metrics.avgAccessTime = total / this.metrics.totalOperations;
  }

  private getFromStorage(
    layer: "localStorage" | "sessionStorage",
    key: string,
  ): unknown | null {
    try {
      const storage = layer === "localStorage" ? localStorage : sessionStorage;
      const item = storage.getItem(`owl_cache_${key}`);

      if (!item) return null;

      const parsed = JSON.parse(item);
      if (parsed.expiresAt <= Date.now()) {
        storage.removeItem(`owl_cache_${key}`);
        return null;
      }

      return parsed.data;
    } catch {
      return null;
    }
  }

  private setToStorage(
    layer: "localStorage" | "sessionStorage",
    key: string,
    data: unknown,
    expiresAt: number,
  ): void {
    try {
      const storage = layer === "localStorage" ? localStorage : sessionStorage;
      storage.setItem(`owl_cache_${key}`, JSON.stringify({ data, expiresAt }));
    } catch (error) {
      // Storage might be full or disabled
      console.warn(`Failed to store in ${layer}:`, error);
    }
  }

  private removeFromStorage(
    layer: "localStorage" | "sessionStorage",
    key: string,
  ): void {
    try {
      const storage = layer === "localStorage" ? localStorage : sessionStorage;
      storage.removeItem(`owl_cache_${key}`);
    } catch {
      // Ignore errors
    }
  }

  private cleanupStorage(layer: "localStorage" | "sessionStorage"): void {
    try {
      const storage = layer === "localStorage" ? localStorage : sessionStorage;
      const keys = Object.keys(storage).filter((key) =>
        key.startsWith("owl_cache_"),
      );

      for (const key of keys) {
        const item = storage.getItem(key);
        if (item) {
          try {
            const parsed = JSON.parse(item);
            if (parsed.expiresAt <= Date.now()) {
              storage.removeItem(key);
            }
          } catch {
            storage.removeItem(key); // Remove corrupted entries
          }
        }
      }
    } catch {
      // Ignore errors
    }
  }

  private loadFromPersistentStorage(): void {
    // Warm up cache with most accessed items from localStorage
    try {
      const keys = Object.keys(localStorage).filter((key) =>
        key.startsWith("owl_cache_"),
      );

      for (const key of keys.slice(0, 100)) {
        // Limit to prevent overload
        const realKey = key.replace("owl_cache_", "");
        const data = this.getFromStorage("localStorage", realKey);

        if (data) {
          this.set(realKey, data, {
            layers: ["memory"],
            ttl: this.DEFAULT_TTL,
          });
        }
      }
    } catch {
      // Ignore errors during warmup
    }
  }

  /**
   * 🔧 LEGENDARY UTILITIES
   */
  clear(): void {
    this.cache.clear();
    this.cleanupStorage("localStorage");
    this.cleanupStorage("sessionStorage");
    this.updateMemoryUsage();
  }

  size(): number {
    return this.cache.size;
  }

  destroy(): void {
    if (this.cleanupTimer) {
      clearInterval(this.cleanupTimer);
    }
    this.clear();
  }
}

// Singleton instance
export const legendaryCache = LegendaryCacheManager.getInstance();
