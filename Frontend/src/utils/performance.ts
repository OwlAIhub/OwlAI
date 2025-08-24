/**
 * Performance Optimization Utilities
 * Provides utilities for optimizing async operations and preventing blocking calls
 */

/**
 * Debounce function to limit execution frequency
 */
export function debounce<T extends (...args: any[]) => any>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeout: ReturnType<typeof setTimeout> | null = null;

  return (...args: Parameters<T>) => {
    if (timeout) {
      clearTimeout(timeout);
    }
    timeout = setTimeout(() => func(...args), wait);
  };
}

/**
 * Throttle function to limit execution rate
 */
export function throttle<T extends (...args: any[]) => any>(
  func: T,
  limit: number
): (...args: Parameters<T>) => void {
  let inThrottle: boolean = false;

  return (...args: Parameters<T>) => {
    if (!inThrottle) {
      func(...args);
      inThrottle = true;
      setTimeout(() => (inThrottle = false), limit);
    }
  };
}

/**
 * Async retry with exponential backoff
 */
export async function retryWithBackoff<T>(
  fn: () => Promise<T>,
  maxRetries: number = 3,
  baseDelay: number = 1000
): Promise<T> {
  let lastError: Error;

  for (let attempt = 0; attempt <= maxRetries; attempt++) {
    try {
      return await fn();
    } catch (error) {
      lastError = error as Error;

      if (attempt === maxRetries) {
        throw lastError;
      }

      const delay = baseDelay * Math.pow(2, attempt);
      await new Promise((resolve) => setTimeout(resolve, delay));
    }
  }

  throw lastError!;
}

/**
 * Batch operations for better performance
 */
export class BatchProcessor<T> {
  private batch: T[] = [];
  private processing = false;
  private batchSize: number;
  private processDelay: number;
  private processor: (items: T[]) => Promise<void>;

  constructor(
    processor: (items: T[]) => Promise<void>,
    batchSize: number = 10,
    processDelay: number = 100
  ) {
    this.processor = processor;
    this.batchSize = batchSize;
    this.processDelay = processDelay;
  }

  add(item: T): void {
    this.batch.push(item);
    this.scheduleProcessing();
  }

  private scheduleProcessing(): void {
    if (this.processing) return;

    if (this.batch.length >= this.batchSize) {
      this.process();
    } else {
      setTimeout(() => this.process(), this.processDelay);
    }
  }

  private async process(): Promise<void> {
    if (this.processing || this.batch.length === 0) return;

    this.processing = true;
    const itemsToProcess = this.batch.splice(0, this.batchSize);

    try {
      await this.processor(itemsToProcess);
    } catch (error) {
      // Re-add items to batch on error
      this.batch.unshift(...itemsToProcess);
      throw error;
    } finally {
      this.processing = false;

      // Continue processing if there are more items
      if (this.batch.length > 0) {
        this.scheduleProcessing();
      }
    }
  }

  async flush(): Promise<void> {
    while (this.batch.length > 0 || this.processing) {
      await this.process();
    }
  }
}

/**
 * Lazy loading utility
 */
export function createLazyLoader<T>(
  loader: () => Promise<T>
): () => Promise<T> {
  let cached: T | null = null;
  let loading: Promise<T> | null = null;

  return async (): Promise<T> => {
    if (cached) return cached;

    if (loading) return loading;

    loading = loader().then((result) => {
      cached = result;
      loading = null;
      return result;
    });

    return loading;
  };
}

/**
 * Memory-efficient array chunking
 */
export function* chunkArray<T>(
  array: T[],
  chunkSize: number
): Generator<T[], void> {
  for (let i = 0; i < array.length; i += chunkSize) {
    yield array.slice(i, i + chunkSize);
  }
}

/**
 * Non-blocking array processing
 */
export async function processArrayNonBlocking<T, R>(
  array: T[],
  processor: (item: T, index: number) => Promise<R>,
  chunkSize: number = 10,
  delayBetweenChunks: number = 0
): Promise<R[]> {
  const results: R[] = [];

  for (const chunk of chunkArray(array, chunkSize)) {
    const chunkPromises = chunk.map((item, index) =>
      processor(item, results.length + index)
    );

    const chunkResults = await Promise.all(chunkPromises);
    results.push(...chunkResults);

    if (delayBetweenChunks > 0) {
      await new Promise((resolve) => setTimeout(resolve, delayBetweenChunks));
    }
  }

  return results;
}

/**
 * Performance monitoring utility
 */
export class PerformanceMonitor {
  private marks: Map<string, number> = new Map();
  private measures: Map<string, number> = new Map();

  mark(name: string): void {
    this.marks.set(name, performance.now());
  }

  measure(name: string, startMark: string, endMark: string): number {
    const start = this.marks.get(startMark);
    const end = this.marks.get(endMark);

    if (start && end) {
      const duration = end - start;
      this.measures.set(name, duration);
      return duration;
    }

    return 0;
  }

  getMeasure(name: string): number | undefined {
    return this.measures.get(name);
  }

  clear(): void {
    this.marks.clear();
    this.measures.clear();
  }
}

export const performanceMonitor = new PerformanceMonitor();
