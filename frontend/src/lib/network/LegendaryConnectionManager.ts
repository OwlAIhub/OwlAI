/**
 * 🚀 LEGENDARY CONNECTION MANAGER
 * Peak Performance Network Layer
 * - Intelligent request batching
 * - Connection pooling simulation
 * - Circuit breaker pattern
 * - Request deduplication
 * - Adaptive retry strategies
 */

interface QueuedRequest {
  id: string;
  url: string;
  options: RequestInit;
  resolve: (value: Response) => void;
  reject: (reason: any) => void;
  timestamp: number;
  priority: number;
  retryCount: number;
}

interface CircuitBreakerState {
  failures: number;
  lastFailureTime: number;
  state: 'CLOSED' | 'OPEN' | 'HALF_OPEN';
  nextAttemptTime: number;
}

interface ConnectionMetrics {
  totalRequests: number;
  successfulRequests: number;
  failedRequests: number;
  averageResponseTime: number;
  queueSize: number;
  circuitBreakerState: string;
  deduplicatedRequests: number;
  batchedRequests: number;
}

export class LegendaryConnectionManager {
  private static instance: LegendaryConnectionManager;
  private requestQueue: QueuedRequest[] = [];
  private inFlightRequests = new Map<string, Promise<Response>>();
  private circuitBreakers = new Map<string, CircuitBreakerState>();
  
  private readonly MAX_CONCURRENT = 6; // Browser connection limit
  private readonly BATCH_SIZE = 10;
  private readonly BATCH_TIMEOUT = 50; // ms
  private readonly CIRCUIT_BREAKER_THRESHOLD = 5;
  private readonly CIRCUIT_BREAKER_TIMEOUT = 30000; // 30s
  
  private metrics: ConnectionMetrics = {
    totalRequests: 0,
    successfulRequests: 0,
    failedRequests: 0,
    averageResponseTime: 0,
    queueSize: 0,
    circuitBreakerState: 'CLOSED',
    deduplicatedRequests: 0,
    batchedRequests: 0
  };

  private processingTimer?: NodeJS.Timeout;
  private activeConnections = 0;

  private constructor() {
    this.startBatchProcessor();
  }

  static getInstance(): LegendaryConnectionManager {
    if (!LegendaryConnectionManager.instance) {
      LegendaryConnectionManager.instance = new LegendaryConnectionManager();
    }
    return LegendaryConnectionManager.instance;
  }

  /**
   * 🔥 LEGENDARY FETCH - Intelligent request handling
   */
  async fetch(url: string, options: RequestInit = {}, priority: number = 0): Promise<Response> {
    const requestKey = this.generateRequestKey(url, options);
    
    // Check for in-flight duplicate requests
    if (this.inFlightRequests.has(requestKey)) {
      this.metrics.deduplicatedRequests++;
      return this.inFlightRequests.get(requestKey)!;
    }

    // Check circuit breaker
    const circuitBreaker = this.getCircuitBreaker(url);
    if (circuitBreaker.state === 'OPEN') {
      if (Date.now() < circuitBreaker.nextAttemptTime) {
        throw new Error(`Circuit breaker is OPEN for ${url}`);
      } else {
        circuitBreaker.state = 'HALF_OPEN';
      }
    }

    return new Promise<Response>((resolve, reject) => {
      const request: QueuedRequest = {
        id: this.generateRequestId(),
        url,
        options,
        resolve,
        reject,
        timestamp: Date.now(),
        priority,
        retryCount: 0
      };

      this.requestQueue.push(request);
      this.requestQueue.sort((a, b) => b.priority - a.priority); // High priority first
      
      this.metrics.totalRequests++;
      this.metrics.queueSize = this.requestQueue.length;
      
      // Process immediately if we have capacity
      if (this.activeConnections < this.MAX_CONCURRENT) {
        this.processQueue();
      }
    });
  }

  /**
   * 🚀 LEGENDARY BATCH PROCESSING
   */
  private startBatchProcessor(): void {
    this.processingTimer = setInterval(() => {
      this.processQueue();
    }, this.BATCH_TIMEOUT);
  }

  private async processQueue(): Promise<void> {
    while (this.requestQueue.length > 0 && this.activeConnections < this.MAX_CONCURRENT) {
      const batch = this.requestQueue.splice(0, Math.min(this.BATCH_SIZE, this.MAX_CONCURRENT - this.activeConnections));
      
      if (batch.length > 1) {
        this.metrics.batchedRequests += batch.length;
        await this.processBatch(batch);
      } else if (batch.length === 1) {
        this.processRequest(batch[0]);
      }
      
      this.metrics.queueSize = this.requestQueue.length;
    }
  }

  private async processBatch(batch: QueuedRequest[]): Promise<void> {
    const promises = batch.map(request => this.processRequest(request));
    await Promise.allSettled(promises);
  }

  private async processRequest(request: QueuedRequest): Promise<void> {
    const { id, url, options, resolve, reject, timestamp } = request;
    const requestKey = this.generateRequestKey(url, options);
    
    this.activeConnections++;
    const startTime = performance.now();

    try {
      // Create the actual fetch promise
      const fetchPromise = this.executeRequest(url, options);
      this.inFlightRequests.set(requestKey, fetchPromise);
      
      const response = await fetchPromise;
      
      // Update circuit breaker on success
      this.updateCircuitBreaker(url, true);
      
      // Update metrics
      const responseTime = performance.now() - startTime;
      this.updateResponseTimeMetrics(responseTime);
      this.metrics.successfulRequests++;
      
      resolve(response);
      
    } catch (error) {
      // Update circuit breaker on failure
      this.updateCircuitBreaker(url, false);
      
      // Retry logic
      if (request.retryCount < this.getMaxRetries(error)) {
        request.retryCount++;
        const delay = this.calculateRetryDelay(request.retryCount);
        
        setTimeout(() => {
          this.requestQueue.unshift(request); // High priority
          this.processQueue();
        }, delay);
        
      } else {
        this.metrics.failedRequests++;
        reject(error);
      }
      
    } finally {
      this.activeConnections--;
      this.inFlightRequests.delete(requestKey);
    }
  }

  private async executeRequest(url: string, options: RequestInit): Promise<Response> {
    // Add intelligent headers
    const enhancedOptions: RequestInit = {
      ...options,
      headers: {
        'Accept': 'application/json',
        'Cache-Control': 'no-cache',
        'X-Requested-With': 'LegendaryConnectionManager',
        ...options.headers
      }
    };

    // Add timeout if not specified
    if (!options.signal) {
      const controller = new AbortController();
      const timeout = setTimeout(() => controller.abort(), 30000);
      enhancedOptions.signal = controller.signal;
      
      try {
        const response = await fetch(url, enhancedOptions);
        clearTimeout(timeout);
        return response;
      } catch (error) {
        clearTimeout(timeout);
        throw error;
      }
    }

    return fetch(url, enhancedOptions);
  }

  private getCircuitBreaker(url: string): CircuitBreakerState {
    const domain = new URL(url).origin;
    
    if (!this.circuitBreakers.has(domain)) {
      this.circuitBreakers.set(domain, {
        failures: 0,
        lastFailureTime: 0,
        state: 'CLOSED',
        nextAttemptTime: 0
      });
    }
    
    return this.circuitBreakers.get(domain)!;
  }

  private updateCircuitBreaker(url: string, success: boolean): void {
    const circuitBreaker = this.getCircuitBreaker(url);
    
    if (success) {
      if (circuitBreaker.state === 'HALF_OPEN') {
        circuitBreaker.state = 'CLOSED';
        circuitBreaker.failures = 0;
      }
    } else {
      circuitBreaker.failures++;
      circuitBreaker.lastFailureTime = Date.now();
      
      if (circuitBreaker.failures >= this.CIRCUIT_BREAKER_THRESHOLD) {
        circuitBreaker.state = 'OPEN';
        circuitBreaker.nextAttemptTime = Date.now() + this.CIRCUIT_BREAKER_TIMEOUT;
      }
    }
    
    // Update metrics with overall circuit breaker state
    const allClosed = Array.from(this.circuitBreakers.values()).every(cb => cb.state === 'CLOSED');
    this.metrics.circuitBreakerState = allClosed ? 'CLOSED' : 'OPEN';
  }

  private getMaxRetries(error: any): number {
    if (error?.name === 'AbortError') return 0; // Don't retry timeouts
    if (error?.status >= 400 && error?.status < 500) return 1; // Limited retries for client errors
    return 3; // Standard retries for network errors
  }

  private calculateRetryDelay(retryCount: number): number {
    // Exponential backoff with jitter
    const baseDelay = Math.pow(2, retryCount) * 1000;
    const jitter = Math.random() * 0.1 * baseDelay;
    return Math.min(baseDelay + jitter, 30000); // Max 30s
  }

  private generateRequestKey(url: string, options: RequestInit): string {
    const method = options.method || 'GET';
    const body = options.body ? JSON.stringify(options.body) : '';
    return `${method}:${url}:${body}`;
  }

  private generateRequestId(): string {
    return `req_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  private updateResponseTimeMetrics(responseTime: number): void {
    const total = this.metrics.averageResponseTime * (this.metrics.successfulRequests - 1) + responseTime;
    this.metrics.averageResponseTime = total / this.metrics.successfulRequests;
  }

  /**
   * 📊 LEGENDARY METRICS
   */
  getMetrics(): ConnectionMetrics & { 
    efficiency: number; 
    successRate: number;
    queueUtilization: number;
  } {
    const successRate = this.metrics.totalRequests > 0 
      ? (this.metrics.successfulRequests / this.metrics.totalRequests) * 100 
      : 100;
    
    const efficiency = this.metrics.averageResponseTime > 0 
      ? Math.max(0, 100 - (this.metrics.averageResponseTime / 1000)) 
      : 100;
      
    const queueUtilization = (this.activeConnections / this.MAX_CONCURRENT) * 100;

    return {
      ...this.metrics,
      efficiency: Math.round(efficiency * 100) / 100,
      successRate: Math.round(successRate * 100) / 100,
      queueUtilization: Math.round(queueUtilization * 100) / 100
    };
  }

  /**
   * 🔧 LEGENDARY UTILITIES
   */
  clearQueue(): void {
    this.requestQueue.forEach(req => req.reject(new Error('Queue cleared')));
    this.requestQueue = [];
    this.metrics.queueSize = 0;
  }

  resetCircuitBreakers(): void {
    this.circuitBreakers.clear();
    this.metrics.circuitBreakerState = 'CLOSED';
  }

  destroy(): void {
    if (this.processingTimer) {
      clearInterval(this.processingTimer);
    }
    this.clearQueue();
    this.resetCircuitBreakers();
  }
}

// Singleton instance
export const legendaryConnection = LegendaryConnectionManager.getInstance();