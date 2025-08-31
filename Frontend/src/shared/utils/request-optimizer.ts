/**
 * Request optimization utilities for better performance
 */

interface RequestConfig {
  timeout?: number;
  retries?: number;
  retryDelay?: number;
  cache?: boolean;
  cacheTTL?: number;
}

interface DebouncedRequest {
  cancel: () => void;
  flush: () => void;
}

class RequestOptimizer {
  private pendingRequests = new Map<string, Promise<any>>();
  private debounceTimers = new Map<string, number>();
  private cache = new Map<
    string,
    { data: any; timestamp: number; ttl: number }
  >();

  /**
   * Debounce a request to prevent multiple rapid calls
   */
  debounce<T>(
    key: string,
    requestFn: () => Promise<T>,
    delay: number = 300
  ): DebouncedRequest {
    let timeoutId: number | null = null;
    let resolvePromise: ((value: T) => void) | null = null;
    let rejectPromise: ((error: any) => void) | null = null;

    const debouncedRequest = new Promise<T>((resolve, reject) => {
      resolvePromise = resolve;
      rejectPromise = reject;
    });

    const execute = async () => {
      try {
        const result = await requestFn();
        if (resolvePromise) resolvePromise(result);
      } catch (error) {
        if (rejectPromise) rejectPromise(error);
      }
    };

    const cancel = () => {
      if (timeoutId) {
        clearTimeout(timeoutId);
        timeoutId = null;
      }
      if (rejectPromise) {
        rejectPromise(new Error("Request cancelled"));
      }
    };

    const flush = () => {
      if (timeoutId) {
        clearTimeout(timeoutId);
        timeoutId = null;
        execute();
      }
    };

    timeoutId = setTimeout(execute, delay);

    return {
      cancel,
      flush,
    };
  }

  /**
   * Deduplicate concurrent requests with the same key
   */
  async deduplicate<T>(key: string, requestFn: () => Promise<T>): Promise<T> {
    if (this.pendingRequests.has(key)) {
      return this.pendingRequests.get(key)!;
    }

    const promise = requestFn().finally(() => {
      this.pendingRequests.delete(key);
    });

    this.pendingRequests.set(key, promise);
    return promise;
  }

  /**
   * Cache request results
   */
  async withCache<T>(
    key: string,
    requestFn: () => Promise<T>,
    ttl: number = 5 * 60 * 1000 // 5 minutes
  ): Promise<T> {
    const cached = this.cache.get(key);
    if (cached && Date.now() - cached.timestamp < cached.ttl) {
      return cached.data;
    }

    const result = await requestFn();
    this.cache.set(key, {
      data: result,
      timestamp: Date.now(),
      ttl,
    });

    return result;
  }

  /**
   * Retry failed requests with exponential backoff
   */
  async withRetry<T>(
    requestFn: () => Promise<T>,
    config: RequestConfig = {}
  ): Promise<T> {
    const { retries = 3, retryDelay = 1000 } = config;
    let lastError: any;

    for (let attempt = 0; attempt <= retries; attempt++) {
      try {
        return await requestFn();
      } catch (error) {
        lastError = error;
        if (attempt === retries) break;

        const delay = retryDelay * Math.pow(2, attempt);
        await new Promise(resolve => setTimeout(resolve, delay));
      }
    }

    throw lastError;
  }

  /**
   * Optimize request with all features
   */
  async optimize<T>(
    key: string,
    requestFn: () => Promise<T>,
    config: RequestConfig = {}
  ): Promise<T> {
    const { cache: useCache = true, cacheTTL } = config;

    let optimizedRequest = () => this.deduplicate(key, requestFn);

    if (useCache) {
      optimizedRequest = () => this.withCache(key, requestFn, cacheTTL);
    }

    return this.withRetry(optimizedRequest, config);
  }

  /**
   * Clear cache
   */
  clearCache(pattern?: string): void {
    if (!pattern) {
      this.cache.clear();
      return;
    }

    const regex = new RegExp(pattern);
    for (const [key] of this.cache) {
      if (regex.test(key)) {
        this.cache.delete(key);
      }
    }
  }

  /**
   * Get cache statistics
   */
  getCacheStats() {
    const now = Date.now();
    let validEntries = 0;
    let expiredEntries = 0;

    for (const [, entry] of this.cache) {
      if (now - entry.timestamp < entry.ttl) {
        validEntries++;
      } else {
        expiredEntries++;
      }
    }

    return {
      total: this.cache.size,
      valid: validEntries,
      expired: expiredEntries,
      pendingRequests: this.pendingRequests.size,
    };
  }
}

// Global instance
export const requestOptimizer = new RequestOptimizer();

// Utility functions
export const requestUtils = {
  /**
   * Debounce a function
   */
  debounce<T extends (...args: any[]) => any>(
    func: T,
    delay: number
  ): (...args: Parameters<T>) => void {
    let timeoutId: number | null = null;

    return (...args: Parameters<T>) => {
      if (timeoutId) {
        clearTimeout(timeoutId);
      }
      timeoutId = setTimeout(() => func(...args), delay);
    };
  },

  /**
   * Throttle a function
   */
  throttle<T extends (...args: any[]) => any>(
    func: T,
    delay: number
  ): (...args: Parameters<T>) => void {
    let lastCall = 0;

    return (...args: Parameters<T>) => {
      const now = Date.now();
      if (now - lastCall >= delay) {
        lastCall = now;
        func(...args);
      }
    };
  },

  /**
   * Create a request with optimization
   */
  createOptimizedRequest<T>(
    key: string,
    requestFn: () => Promise<T>,
    config: RequestConfig = {}
  ) {
    return () => requestOptimizer.optimize(key, requestFn, config);
  },
};

export default RequestOptimizer;
