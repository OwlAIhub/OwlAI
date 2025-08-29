/**
 * Advanced Caching Utility
 * Implements in-memory caching with TTL and LRU eviction
 */

interface CacheItem<T> {
  value: T;
  timestamp: number;
  ttl: number;
  accessCount: number;
  lastAccessed: number;
}

interface CacheConfig {
  maxSize: number;
  defaultTTL: number; // Time to live in milliseconds
  cleanupInterval: number;
}

export class AdvancedCache<T> {
  private cache = new Map<string, CacheItem<T>>();
  private config: CacheConfig;
  private cleanupTimer?: NodeJS.Timeout;

  constructor(config: Partial<CacheConfig> = {}) {
    this.config = {
      maxSize: config.maxSize ?? 100,
      defaultTTL: config.defaultTTL ?? 5 * 60 * 1000, // 5 minutes
      cleanupInterval: config.cleanupInterval ?? 60 * 1000, // 1 minute
    };

    this.startCleanupTimer();
  }

  set(key: string, value: T, ttl?: number): void {
    const now = Date.now();
    const itemTTL = ttl ?? this.config.defaultTTL;

    // If cache is full, remove least recently used item
    if (this.cache.size >= this.config.maxSize && !this.cache.has(key)) {
      this.evictLRU();
    }

    this.cache.set(key, {
      value,
      timestamp: now,
      ttl: itemTTL,
      accessCount: 0,
      lastAccessed: now,
    });
  }

  get(key: string): T | null {
    const item = this.cache.get(key);
    
    if (!item) {
      return null;
    }

    const now = Date.now();
    
    // Check if item has expired
    if (now - item.timestamp > item.ttl) {
      this.cache.delete(key);
      return null;
    }

    // Update access statistics
    item.accessCount++;
    item.lastAccessed = now;

    return item.value;
  }

  has(key: string): boolean {
    const item = this.cache.get(key);
    if (!item) return false;

    const now = Date.now();
    if (now - item.timestamp > item.ttl) {
      this.cache.delete(key);
      return false;
    }

    return true;
  }

  delete(key: string): boolean {
    return this.cache.delete(key);
  }

  clear(): void {
    this.cache.clear();
  }

  size(): number {
    return this.cache.size;
  }

  // Get cache statistics
  getStats() {
    let totalAccess = 0;
    let expiredCount = 0;
    const now = Date.now();

    for (const [key, item] of this.cache.entries()) {
      if (now - item.timestamp > item.ttl) {
        expiredCount++;
      } else {
        totalAccess += item.accessCount;
      }
    }

    return {
      size: this.cache.size,
      maxSize: this.config.maxSize,
      defaultTTL: this.config.defaultTTL,
      totalAccess,
      expiredCount,
      utilizationPercent: (this.cache.size / this.config.maxSize) * 100,
    };
  }

  private evictLRU(): void {
    let oldestKey = '';
    let oldestTime = Date.now();

    for (const [key, item] of this.cache.entries()) {
      if (item.lastAccessed < oldestTime) {
        oldestTime = item.lastAccessed;
        oldestKey = key;
      }
    }

    if (oldestKey) {
      this.cache.delete(oldestKey);
    }
  }

  private cleanup(): void {
    const now = Date.now();
    const keysToDelete: string[] = [];

    for (const [key, item] of this.cache.entries()) {
      if (now - item.timestamp > item.ttl) {
        keysToDelete.push(key);
      }
    }

    keysToDelete.forEach(key => this.cache.delete(key));
  }

  private startCleanupTimer(): void {
    this.cleanupTimer = setInterval(() => {
      this.cleanup();
    }, this.config.cleanupInterval);
  }

  destroy(): void {
    if (this.cleanupTimer) {
      clearInterval(this.cleanupTimer);
    }
    this.clear();
  }
}

// Response cache for API requests
export class ResponseCache {
  private cache: AdvancedCache<any>;

  constructor() {
    this.cache = new AdvancedCache({
      maxSize: 200,
      defaultTTL: 2 * 60 * 1000, // 2 minutes for API responses
      cleanupInterval: 30 * 1000, // 30 seconds cleanup
    });
  }

  // Generate cache key from request details
  private generateKey(url: string, method: string, body?: any): string {
    const bodyStr = body ? JSON.stringify(body) : '';
    return `${method}:${url}:${btoa(bodyStr)}`;
  }

  async get(url: string, method: string, body?: any): Promise<any | null> {
    const key = this.generateKey(url, method, body);
    return this.cache.get(key);
  }

  set(url: string, method: string, response: any, body?: any, ttl?: number): void {
    const key = this.generateKey(url, method, body);
    this.cache.set(key, response, ttl);
  }

  invalidate(pattern?: string): void {
    if (!pattern) {
      this.cache.clear();
      return;
    }

    // Remove entries matching pattern
    for (const [key] of this.cache['cache']) {
      if (key.includes(pattern)) {
        this.cache.delete(key);
      }
    }
  }

  getStats() {
    return this.cache.getStats();
  }
}

// Conversation cache for chat messages
export class ConversationCache {
  private cache: AdvancedCache<any>;

  constructor() {
    this.cache = new AdvancedCache({
      maxSize: 50,
      defaultTTL: 10 * 60 * 1000, // 10 minutes for conversations
      cleanupInterval: 60 * 1000, // 1 minute cleanup
    });
  }

  getMessages(conversationId: string): any[] | null {
    return this.cache.get(`messages:${conversationId}`);
  }

  setMessages(conversationId: string, messages: any[], ttl?: number): void {
    this.cache.set(`messages:${conversationId}`, messages, ttl);
  }

  getConversation(conversationId: string): any | null {
    return this.cache.get(`conversation:${conversationId}`);
  }

  setConversation(conversationId: string, conversation: any, ttl?: number): void {
    this.cache.set(`conversation:${conversationId}`, conversation, ttl);
  }

  invalidateConversation(conversationId: string): void {
    this.cache.delete(`messages:${conversationId}`);
    this.cache.delete(`conversation:${conversationId}`);
  }

  getStats() {
    return this.cache.getStats();
  }
}

// Global cache instances
export const responseCache = new ResponseCache();
export const conversationCache = new ConversationCache();

// Cache utilities
export const CacheUtils = {
  // Memoize function with caching
  memoize<T extends (...args: any[]) => any>(
    fn: T,
    keyGenerator?: (...args: Parameters<T>) => string,
    ttl?: number
  ): T {
    const cache = new AdvancedCache<ReturnType<T>>({
      maxSize: 50,
      defaultTTL: ttl ?? 5 * 60 * 1000,
    });

    return ((...args: Parameters<T>) => {
      const key = keyGenerator ? keyGenerator(...args) : JSON.stringify(args);
      
      let cached = cache.get(key);
      if (cached !== null) {
        return cached;
      }

      const result = fn(...args);
      cache.set(key, result);
      
      return result;
    }) as T;
  },

  // Cache async operations
  async cacheAsync<T>(
    key: string,
    operation: () => Promise<T>,
    cache: AdvancedCache<T>,
    ttl?: number
  ): Promise<T> {
    const cached = cache.get(key);
    if (cached !== null) {
      return cached;
    }

    const result = await operation();
    cache.set(key, result, ttl);
    return result;
  },
};
