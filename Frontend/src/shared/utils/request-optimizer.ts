/**
 * Request Optimization Utilities
 * Implements request batching, parallel processing, and smart queuing
 */

interface BatchRequest {
  id: string;
  url: string;
  method: string;
  data?: any;
  resolve: (value: any) => void;
  reject: (error: any) => void;
  timestamp: number;
}

interface RequestBatchConfig {
  batchSize: number;
  maxWaitTime: number; // Maximum time to wait before sending a batch
  parallelLimit: number; // Maximum parallel requests
}

export class RequestBatcher {
  private queue: BatchRequest[] = [];
  private processing = false;
  private batchTimer?: NodeJS.Timeout;
  private activeRequests = 0;
  private config: RequestBatchConfig;

  constructor(config: Partial<RequestBatchConfig> = {}) {
    this.config = {
      batchSize: config.batchSize ?? 5,
      maxWaitTime: config.maxWaitTime ?? 100, // 100ms
      parallelLimit: config.parallelLimit ?? 6, // Browser default
    };
  }

  async addRequest(
    url: string,
    method: string,
    data?: any
  ): Promise<any> {
    return new Promise((resolve, reject) => {
      const request: BatchRequest = {
        id: `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        url,
        method,
        data,
        resolve,
        reject,
        timestamp: Date.now(),
      };

      this.queue.push(request);
      this.scheduleProcessing();
    });
  }

  private scheduleProcessing(): void {
    // Clear existing timer
    if (this.batchTimer) {
      clearTimeout(this.batchTimer);
    }

    // Process immediately if batch is full or we're under parallel limit
    if (
      this.queue.length >= this.config.batchSize ||
      (this.activeRequests < this.config.parallelLimit && this.queue.length > 0)
    ) {
      this.processBatch();
    } else {
      // Wait for more requests or timeout
      this.batchTimer = setTimeout(() => {
        this.processBatch();
      }, this.config.maxWaitTime);
    }
  }

  private async processBatch(): Promise<void> {
    if (this.processing || this.queue.length === 0) return;
    if (this.activeRequests >= this.config.parallelLimit) return;

    this.processing = true;

    // Take a batch of requests
    const batchSize = Math.min(
      this.config.batchSize,
      this.config.parallelLimit - this.activeRequests,
      this.queue.length
    );
    const batch = this.queue.splice(0, batchSize);

    this.activeRequests += batch.length;

    try {
      // Process batch in parallel
      const promises = batch.map(async (request) => {
        try {
          const response = await this.executeRequest(request);
          request.resolve(response);
        } catch (error) {
          request.reject(error);
        }
      });

      await Promise.allSettled(promises);
    } finally {
      this.activeRequests -= batch.length;
      this.processing = false;

      // Continue processing if there are more requests
      if (this.queue.length > 0) {
        this.scheduleProcessing();
      }
    }
  }

  private async executeRequest(request: BatchRequest): Promise<any> {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 15000); // 15s timeout

    try {
      const response = await fetch(request.url, {
        method: request.method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: request.data ? JSON.stringify(request.data) : undefined,
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      return await response.json();
    } catch (error) {
      clearTimeout(timeoutId);
      throw error;
    }
  }

  // Get queue statistics
  getStats() {
    return {
      queueLength: this.queue.length,
      activeRequests: this.activeRequests,
      processing: this.processing,
      parallelLimit: this.config.parallelLimit,
    };
  }
}

// Parallel request processor for independent operations
export class ParallelProcessor {
  private concurrencyLimit: number;

  constructor(concurrencyLimit: number = 6) {
    this.concurrencyLimit = concurrencyLimit;
  }

  async processParallel<T, R>(
    items: T[],
    processor: (item: T) => Promise<R>,
    options: { retries?: number; retryDelay?: number } = {}
  ): Promise<R[]> {
    const { retries = 1, retryDelay = 1000 } = options;

    // Split items into chunks
    const chunks = this.chunkArray(items, this.concurrencyLimit);
    const results: R[] = [];

    for (const chunk of chunks) {
      const chunkPromises = chunk.map(async (item) => {
        let lastError: any;
        
        for (let attempt = 0; attempt <= retries; attempt++) {
          try {
            return await processor(item);
          } catch (error) {
            lastError = error;
            if (attempt < retries) {
              await this.delay(retryDelay * (attempt + 1));
            }
          }
        }
        
        throw lastError;
      });

      const chunkResults = await Promise.allSettled(chunkPromises);
      
      // Extract successful results and collect errors
      for (const result of chunkResults) {
        if (result.status === 'fulfilled') {
          results.push(result.value);
        } else {
          throw result.reason;
        }
      }
    }

    return results;
  }

  private chunkArray<T>(array: T[], chunkSize: number): T[][] {
    const chunks: T[][] = [];
    for (let i = 0; i < array.length; i += chunkSize) {
      chunks.push(array.slice(i, i + chunkSize));
    }
    return chunks;
  }

  private delay(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
}

// Smart request prioritizer
export class RequestPrioritizer {
  private highPriorityQueue: (() => Promise<any>)[] = [];
  private normalPriorityQueue: (() => Promise<any>)[] = [];
  private lowPriorityQueue: (() => Promise<any>)[] = [];
  private processing = false;

  async addRequest<T>(
    request: () => Promise<T>,
    priority: 'high' | 'normal' | 'low' = 'normal'
  ): Promise<T> {
    return new Promise((resolve, reject) => {
      const wrappedRequest = async () => {
        try {
          const result = await request();
          resolve(result);
          return result;
        } catch (error) {
          reject(error);
          throw error;
        }
      };

      switch (priority) {
        case 'high':
          this.highPriorityQueue.push(wrappedRequest);
          break;
        case 'low':
          this.lowPriorityQueue.push(wrappedRequest);
          break;
        default:
          this.normalPriorityQueue.push(wrappedRequest);
      }

      this.processQueue();
    });
  }

  private async processQueue(): Promise<void> {
    if (this.processing) return;

    this.processing = true;

    try {
      while (this.hasRequests()) {
        const request = this.getNextRequest();
        if (request) {
          await request();
        }
      }
    } finally {
      this.processing = false;
    }
  }

  private hasRequests(): boolean {
    return (
      this.highPriorityQueue.length > 0 ||
      this.normalPriorityQueue.length > 0 ||
      this.lowPriorityQueue.length > 0
    );
  }

  private getNextRequest(): (() => Promise<any>) | undefined {
    if (this.highPriorityQueue.length > 0) {
      return this.highPriorityQueue.shift();
    }
    if (this.normalPriorityQueue.length > 0) {
      return this.normalPriorityQueue.shift();
    }
    if (this.lowPriorityQueue.length > 0) {
      return this.lowPriorityQueue.shift();
    }
    return undefined;
  }

  getStats() {
    return {
      highPriority: this.highPriorityQueue.length,
      normalPriority: this.normalPriorityQueue.length,
      lowPriority: this.lowPriorityQueue.length,
      processing: this.processing,
    };
  }
}

// Global instances
export const requestBatcher = new RequestBatcher({
  batchSize: 3,
  maxWaitTime: 50, // 50ms for UI responsiveness
  parallelLimit: 6,
});

export const parallelProcessor = new ParallelProcessor(4);

export const requestPrioritizer = new RequestPrioritizer();

// Utility functions
export const RequestUtils = {
  // Optimize fetch with automatic batching
  async optimizedFetch(
    url: string,
    options: RequestInit = {},
    priority: 'high' | 'normal' | 'low' = 'normal'
  ): Promise<Response> {
    const method = options.method || 'GET';
    
    if (method === 'GET') {
      // Use request batcher for GET requests
      return requestBatcher.addRequest(url, method);
    } else {
      // Use prioritizer for other requests
      return requestPrioritizer.addRequest(
        () => fetch(url, options),
        priority
      );
    }
  },

  // Batch multiple similar requests
  async batchRequests<T>(
    requests: Array<{ url: string; method?: string; data?: any }>,
    options: { parallelLimit?: number; retries?: number } = {}
  ): Promise<T[]> {
    const processor = new ParallelProcessor(options.parallelLimit || 4);
    
    return processor.processParallel(
      requests,
      async (request) => {
        const response = await fetch(request.url, {
          method: request.method || 'GET',
          headers: { 'Content-Type': 'application/json' },
          body: request.data ? JSON.stringify(request.data) : undefined,
        });
        
        if (!response.ok) {
          throw new Error(`HTTP ${response.status}: ${response.statusText}`);
        }
        
        return response.json();
      },
      { retries: options.retries || 1 }
    );
  },
};
