/**
 * Enhanced caching utility with TTL support
 */

interface CacheEntry<T> {
  value: T;
  timestamp: number;
  ttl: number;
}

interface CacheOptions {
  ttl?: number; // Time to live in milliseconds
  maxSize?: number; // Maximum number of entries
}

class Cache<T = any> {
  private cache = new Map<string, CacheEntry<T>>();
  private readonly defaultTTL: number;
  private readonly maxSize: number;

  constructor(options: CacheOptions = {}) {
    this.defaultTTL = options.ttl || 5 * 60 * 1000; // 5 minutes default
    this.maxSize = options.maxSize || 100;
  }

  set(key: string, value: T, ttl?: number): void {
    // Clean expired entries before adding new one
    this.cleanup();

    // Remove oldest entry if cache is full
    if (this.cache.size >= this.maxSize) {
      const firstKey = this.cache.keys().next().value;
      if (firstKey) {
        this.cache.delete(firstKey);
      }
    }

    const entry: CacheEntry<T> = {
      value,
      timestamp: Date.now(),
      ttl: ttl || this.defaultTTL,
    };

    this.cache.set(key, entry);
  }

  get(key: string): T | null {
    const entry = this.cache.get(key);
    if (!entry) return null;

    const isExpired = Date.now() - entry.timestamp > entry.ttl;
    if (isExpired) {
      this.cache.delete(key);
      return null;
    }

    return entry.value;
  }

  has(key: string): boolean {
    return this.get(key) !== null;
  }

  delete(key: string): boolean {
    return this.cache.delete(key);
  }

  clear(): void {
    this.cache.clear();
  }

  size(): number {
    this.cleanup();
    return this.cache.size;
  }

  keys(): string[] {
    this.cleanup();
    return Array.from(this.cache.keys());
  }

  private cleanup(): void {
    const now = Date.now();
    for (const [key, entry] of this.cache.entries()) {
      if (now - entry.timestamp > entry.ttl) {
        this.cache.delete(key);
      }
    }
  }
}

// Global cache instance
export const globalCache = new Cache();

// Utility functions
export const cacheUtils = {
  /**
   * Cache a function result
   */
  memoize<T extends (...args: any[]) => any>(
    fn: T,
    keyGenerator?: (...args: Parameters<T>) => string,
    ttl?: number
  ): T {
    return ((...args: Parameters<T>) => {
      const key = keyGenerator ? keyGenerator(...args) : JSON.stringify(args);
      const cached = globalCache.get(key);
      if (cached !== null) {
        return cached;
      }
      const result = fn(...args);
      globalCache.set(key, result, ttl);
      return result;
    }) as T;
  },

  /**
   * Cache with automatic key generation
   */
  cacheResult<T>(
    key: string,
    fn: () => T | Promise<T>,
    ttl?: number
  ): Promise<T> {
    const cached = globalCache.get(key);
    if (cached !== null) {
      return Promise.resolve(cached);
    }

    return Promise.resolve(fn()).then(result => {
      globalCache.set(key, result, ttl);
      return result;
    });
  },

  /**
   * Invalidate cache entries by pattern
   */
  invalidatePattern(pattern: string): void {
    const keys = globalCache.keys();
    const regex = new RegExp(pattern);
    keys.forEach(key => {
      if (regex.test(key)) {
        globalCache.delete(key);
      }
    });
  },
};

export default Cache;
