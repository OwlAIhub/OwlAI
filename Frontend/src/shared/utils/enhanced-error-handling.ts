/**
 * Enhanced Error Handling and Retry Mechanisms
 * Provides intelligent retry strategies, circuit breakers, and error recovery
 */

interface RetryConfig {
  maxRetries: number;
  initialDelay: number;
  maxDelay: number;
  backoffFactor: number;
  retryCondition?: (error: any) => boolean;
  onRetry?: (error: any, retryCount: number) => void;
}

interface CircuitBreakerConfig {
  failureThreshold: number;
  resetTimeout: number;
  monitoringWindow: number;
}

export class EnhancedRetryManager {
  private static defaultConfig: RetryConfig = {
    maxRetries: 3,
    initialDelay: 1000,
    maxDelay: 10000,
    backoffFactor: 2,
    retryCondition: error => {
      // Retry on network errors and 5xx server errors
      return (
        error.name === "NetworkError" ||
        error.name === "TypeError" ||
        (error.status >= 500 && error.status < 600) ||
        error.status === 408 || // Request Timeout
        error.status === 429 // Too Many Requests
      );
    },
  };

  static async withRetry<T>(
    operation: () => Promise<T>,
    config: Partial<RetryConfig> = {}
  ): Promise<T> {
    const finalConfig = { ...this.defaultConfig, ...config };
    let lastError: any;
    let delay = finalConfig.initialDelay;

    for (let attempt = 0; attempt <= finalConfig.maxRetries; attempt++) {
      try {
        return await operation();
      } catch (error) {
        lastError = error;

        // Don't retry if this is the last attempt
        if (attempt === finalConfig.maxRetries) {
          break;
        }

        // Check if we should retry this error
        if (finalConfig.retryCondition && !finalConfig.retryCondition(error)) {
          break;
        }

        // Call retry callback if provided
        if (finalConfig.onRetry) {
          finalConfig.onRetry(error, attempt + 1);
        }

        // Wait before retrying
        await this.delay(delay);

        // Exponential backoff with jitter
        delay = Math.min(
          delay * finalConfig.backoffFactor + Math.random() * 1000,
          finalConfig.maxDelay
        );
      }
    }

    throw lastError;
  }

  private static delay(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
}

// Circuit Breaker pattern implementation
export class CircuitBreaker {
  private failures = 0;
  private lastFailureTime = 0;
  private state: "CLOSED" | "OPEN" | "HALF_OPEN" = "CLOSED";
  private config: CircuitBreakerConfig;
  private recentRequests: { timestamp: number; success: boolean }[] = [];

  constructor(config: Partial<CircuitBreakerConfig> = {}) {
    this.config = {
      failureThreshold: config.failureThreshold ?? 5,
      resetTimeout: config.resetTimeout ?? 60000, // 1 minute
      monitoringWindow: config.monitoringWindow ?? 60000, // 1 minute
    };
  }

  async execute<T>(operation: () => Promise<T>): Promise<T> {
    if (this.state === "OPEN") {
      if (this.shouldAttemptReset()) {
        this.state = "HALF_OPEN";
      } else {
        throw new Error("Circuit breaker is OPEN");
      }
    }

    try {
      const result = await operation();
      this.onSuccess();
      return result;
    } catch (error) {
      this.onFailure();
      throw error;
    }
  }

  private onSuccess(): void {
    this.failures = 0;
    this.recordRequest(true);
    if (this.state === "HALF_OPEN") {
      this.state = "CLOSED";
    }
  }

  private onFailure(): void {
    this.failures++;
    this.lastFailureTime = Date.now();
    this.recordRequest(false);

    if (this.shouldOpenCircuit()) {
      this.state = "OPEN";
    }
  }

  private recordRequest(success: boolean): void {
    const now = Date.now();
    this.recentRequests.push({ timestamp: now, success });

    // Remove old requests outside the monitoring window
    this.recentRequests = this.recentRequests.filter(
      req => now - req.timestamp <= this.config.monitoringWindow
    );
  }

  private shouldOpenCircuit(): boolean {
    return this.failures >= this.config.failureThreshold;
  }

  private shouldAttemptReset(): boolean {
    return Date.now() - this.lastFailureTime >= this.config.resetTimeout;
  }

  getState() {
    return {
      state: this.state,
      failures: this.failures,
      recentRequests: this.recentRequests.length,
      successRate: this.getSuccessRate(),
    };
  }

  private getSuccessRate(): number {
    if (this.recentRequests.length === 0) return 100;
    const successes = this.recentRequests.filter(req => req.success).length;
    return (successes / this.recentRequests.length) * 100;
  }
}

// Error categorization and handling
export class ErrorHandler {
  private static errorCategories = {
    NETWORK: ["NetworkError", "TypeError", "ERR_NETWORK"],
    TIMEOUT: ["TimeoutError", "TIMEOUT"],
    SERVER: ["InternalServerError", "BadGateway"],
    CLIENT: ["BadRequest", "Unauthorized", "Forbidden"],
    RATE_LIMIT: ["TooManyRequests"],
  };

  static categorizeError(error: any): string {
    const errorName = error.name || error.code || error.message || "Unknown";
    const statusCode = error.status || error.statusCode;

    // Check by status code first
    if (statusCode) {
      if (statusCode >= 400 && statusCode < 500) return "CLIENT";
      if (statusCode >= 500 && statusCode < 600) return "SERVER";
      if (statusCode === 429) return "RATE_LIMIT";
      if (statusCode === 408) return "TIMEOUT";
    }

    // Check by error type/name
    for (const [category, patterns] of Object.entries(this.errorCategories)) {
      if (patterns.some(pattern => errorName.includes(pattern))) {
        return category;
      }
    }

    return "UNKNOWN";
  }

  static getRetryStrategy(error: any): RetryConfig {
    const category = this.categorizeError(error);

    switch (category) {
      case "NETWORK":
        return {
          maxRetries: 3,
          initialDelay: 1000,
          maxDelay: 8000,
          backoffFactor: 2,
        };

      case "TIMEOUT":
        return {
          maxRetries: 2,
          initialDelay: 2000,
          maxDelay: 10000,
          backoffFactor: 2,
        };

      case "SERVER":
        return {
          maxRetries: 2,
          initialDelay: 1500,
          maxDelay: 6000,
          backoffFactor: 2,
        };

      case "RATE_LIMIT":
        return {
          maxRetries: 3,
          initialDelay: 5000,
          maxDelay: 30000,
          backoffFactor: 3,
        };

      default:
        return {
          maxRetries: 1,
          initialDelay: 1000,
          maxDelay: 5000,
          backoffFactor: 2,
        };
    }
  }

  static async handleError<T>(
    operation: () => Promise<T>,
    customStrategy?: Partial<RetryConfig>
  ): Promise<T> {
    try {
      return await operation();
    } catch (error) {
      const strategy = customStrategy || this.getRetryStrategy(error);

      return EnhancedRetryManager.withRetry(operation, {
        ...strategy,
        onRetry: (err, retryCount) => {
          console.warn(
            `Retrying operation (${retryCount}/${strategy.maxRetries}):`,
            this.categorizeError(err),
            err.message
          );
        },
      });
    }
  }
}

// Request timeout handler
export class TimeoutHandler {
  static withTimeout<T>(
    operation: () => Promise<T>,
    timeoutMs: number,
    timeoutMessage = "Operation timed out"
  ): Promise<T> {
    return Promise.race([
      operation(),
      new Promise<never>((_, reject) =>
        setTimeout(() => reject(new Error(timeoutMessage)), timeoutMs)
      ),
    ]);
  }

  static createAbortableTimeout(timeoutMs: number): {
    controller: AbortController;
    timeoutPromise: Promise<never>;
  } {
    const controller = new AbortController();

    const timeoutPromise = new Promise<never>((_, reject) => {
      const timeoutId = setTimeout(() => {
        controller.abort();
        reject(new Error("Operation timed out"));
      }, timeoutMs);

      // Clear timeout if operation completes
      controller.signal.addEventListener("abort", () => {
        clearTimeout(timeoutId);
      });
    });

    return { controller, timeoutPromise };
  }
}

// Graceful degradation handler
export class GracefulDegradation {
  private fallbacks = new Map<string, () => Promise<any>>();

  registerFallback(key: string, fallback: () => Promise<any>): void {
    this.fallbacks.set(key, fallback);
  }

  async executeWithFallback<T>(
    key: string,
    primaryOperation: () => Promise<T>,
    options: {
      timeout?: number;
      retries?: number;
      fallbackOnTimeout?: boolean;
    } = {}
  ): Promise<T> {
    const { timeout = 10000, retries = 2, fallbackOnTimeout = true } = options;

    try {
      // Try primary operation with timeout
      return await TimeoutHandler.withTimeout(
        () =>
          EnhancedRetryManager.withRetry(primaryOperation, {
            maxRetries: retries,
          }),
        timeout
      );
    } catch (error) {
      const fallback = this.fallbacks.get(key);

      if (
        fallback &&
        (fallbackOnTimeout || !error.message.includes("timeout"))
      ) {
        console.warn(
          `Primary operation failed, using fallback for ${key}:`,
          error.message
        );
        return await fallback();
      }

      throw error;
    }
  }
}

// Global instances
export const apiCircuitBreaker = new CircuitBreaker({
  failureThreshold: 5,
  resetTimeout: 30000, // 30 seconds
  monitoringWindow: 60000, // 1 minute
});

export const gracefulDegradation = new GracefulDegradation();

// Utility functions
export const ErrorUtils = {
  // Smart retry with automatic strategy selection
  async smartRetry<T>(operation: () => Promise<T>): Promise<T> {
    return ErrorHandler.handleError(operation);
  },

  // Execute with circuit breaker protection
  async withCircuitBreaker<T>(operation: () => Promise<T>): Promise<T> {
    return apiCircuitBreaker.execute(operation);
  },

  // Combine multiple error handling strategies
  async robustExecute<T>(
    operation: () => Promise<T>,
    options: {
      timeout?: number;
      circuitBreaker?: boolean;
      retries?: number;
      fallbackKey?: string;
    } = {}
  ): Promise<T> {
    const {
      timeout = 15000,
      circuitBreaker = true,
      retries = 2,
      fallbackKey,
    } = options;

    const wrappedOperation = circuitBreaker
      ? () => apiCircuitBreaker.execute(operation)
      : operation;

    if (fallbackKey) {
      return gracefulDegradation.executeWithFallback(
        fallbackKey,
        wrappedOperation,
        { timeout, retries }
      );
    }

    return TimeoutHandler.withTimeout(
      () =>
        EnhancedRetryManager.withRetry(wrappedOperation, {
          maxRetries: retries,
        }),
      timeout
    );
  },
};
