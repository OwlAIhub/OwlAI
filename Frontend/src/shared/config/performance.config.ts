/**
 * Performance Configuration
 * Centralized performance settings and optimizations
 */

export const PERFORMANCE_CONFIG = {
  // API Configuration
  API: {
    TIMEOUT: 15000, // 15 seconds (reduced from 30s)
    MAX_RETRIES: 2, // Reduced retries for faster failure
    RETRY_DELAY: 500, // Faster retry attempts
    CIRCUIT_BREAKER: {
      FAILURE_THRESHOLD: 5,
      RESET_TIMEOUT: 30000, // 30 seconds
      MONITORING_WINDOW: 60000, // 1 minute
    },
  },

  // Caching Configuration
  CACHE: {
    RESPONSE_TTL: 2 * 60 * 1000, // 2 minutes for API responses
    CONVERSATION_TTL: 10 * 60 * 1000, // 10 minutes for conversations
    MESSAGE_TTL: 5 * 60 * 1000, // 5 minutes for messages
    MAX_CACHE_SIZE: 200,
    CLEANUP_INTERVAL: 30 * 1000, // 30 seconds
  },

  // Request Optimization
  REQUEST: {
    BATCH_SIZE: 3,
    MAX_WAIT_TIME: 50, // 50ms for UI responsiveness
    PARALLEL_LIMIT: 6, // Browser connection limit
    DEBOUNCE_DELAY: 300, // Input debouncing
    THROTTLE_LIMIT: 1000, // Throttle limit
  },

  // Database Optimization
  DATABASE: {
    MESSAGES_PER_PAGE: 20,
    CONVERSATIONS_PER_PAGE: 10,
    QUERY_TIMEOUT: 15000, // Reduced from 30s
    CACHE_FIRESTORE_RESULTS: true,
    USE_OFFLINE_PERSISTENCE: true,
  },

  // UI Optimization
  UI: {
    VIRTUAL_SCROLLING_THRESHOLD: 100, // Items before virtualization
    LAZY_LOADING_OFFSET: 200, // Pixels before loading
    ANIMATION_DURATION: {
      FAST: 150,
      NORMAL: 300,
      SLOW: 500,
    },
    TYPING_SPEED: 50, // ms between characters
    CHUNK_SIZE_FOR_STREAMING: 5, // Words per chunk
  },

  // Memory Management
  MEMORY: {
    MAX_CHAT_HISTORY: 100, // Messages to keep in memory
    GARBAGE_COLLECTION_INTERVAL: 5 * 60 * 1000, // 5 minutes
    MAX_CONCURRENT_REQUESTS: 6,
    PRELOAD_THRESHOLD: 5, // Messages to preload
  },

  // Error Handling
  ERROR: {
    TIMEOUT_THRESHOLD: 15000,
    MAX_ERROR_RETRIES: 2,
    EXPONENTIAL_BACKOFF_BASE: 1000,
    EXPONENTIAL_BACKOFF_MAX: 10000,
    CIRCUIT_BREAKER_ENABLED: true,
    GRACEFUL_DEGRADATION: true,
  },

  // Performance Monitoring
  MONITORING: {
    PERFORMANCE_MARK_ENABLED: true,
    RESPONSE_TIME_TRACKING: true,
    ERROR_RATE_TRACKING: true,
    MEMORY_USAGE_TRACKING: true,
    REPORT_INTERVAL: 60000, // 1 minute
  },
} as const;

// Performance optimization flags
export const OPTIMIZATION_FLAGS = {
  // Aggressive optimizations for better performance
  AGGRESSIVE_CACHING: true,
  PREFETCH_CRITICAL_RESOURCES: true,
  USE_SERVICE_WORKER: false, // Disabled for development
  COMPRESS_RESPONSES: true,
  USE_CDN: false, // Configure based on deployment

  // Experimental features
  ENABLE_HTTP2_PUSH: false,
  USE_WEBASSEMBLY: false,
  ENABLE_STREAMING_RESPONSES: true,
  USE_INTERSECTION_OBSERVER: true,

  // Development vs Production
  DEVELOPMENT_MODE: import.meta.env.DEV,
  ENABLE_DEBUG_LOGGING: import.meta.env.DEV,
  PERFORMANCE_PROFILING: import.meta.env.DEV,
} as const;

// Feature flags for performance testing
export const FEATURE_FLAGS = {
  // API optimizations
  USE_REQUEST_BATCHING: true,
  USE_RESPONSE_CACHING: true,
  USE_PARALLEL_REQUESTS: true,
  USE_CIRCUIT_BREAKER: true,

  // UI optimizations
  USE_VIRTUAL_SCROLLING: true,
  USE_LAZY_LOADING: true,
  USE_OPTIMISTIC_UPDATES: true,
  USE_DEBOUNCED_SEARCH: true,

  // Database optimizations
  USE_FIRESTORE_CACHE: true,
  USE_OFFLINE_PERSISTENCE: true,
  USE_REAL_TIME_LISTENERS: true,

  // Experimental
  USE_WEB_WORKERS: false,
  USE_STREAMING_APIS: true,
  USE_PREDICTIVE_PREFETCH: false,
} as const;

// Environment-specific configurations
export const getEnvironmentConfig = () => {
  const isDev = import.meta.env.DEV;
  const isProd = import.meta.env.PROD;

  return {
    // More aggressive timeouts in production
    API_TIMEOUT: isDev ? 20000 : PERFORMANCE_CONFIG.API.TIMEOUT,

    // Less caching in development for fresh data
    CACHE_TTL: isDev ? 30000 : PERFORMANCE_CONFIG.CACHE.RESPONSE_TTL,

    // More retries in production
    MAX_RETRIES: isDev ? 1 : PERFORMANCE_CONFIG.API.MAX_RETRIES,

    // Debug features
    ENABLE_LOGGING: isDev,
    PERFORMANCE_MONITORING: isProd,

    // Resource optimization
    PRELOAD_RESOURCES: isProd,
    COMPRESS_ASSETS: isProd,
    USE_BUNDLE_SPLITTING: isProd,
  };
};

// Performance utilities
export const PerformanceUtils = {
  // Mark performance milestones
  mark: (name: string) => {
    if (OPTIMIZATION_FLAGS.PERFORMANCE_PROFILING) {
      performance.mark(name);
    }
  },

  // Measure performance between marks
  measure: (name: string, startMark: string, endMark?: string) => {
    if (OPTIMIZATION_FLAGS.PERFORMANCE_PROFILING) {
      performance.measure(name, startMark, endMark);
      const measure = performance.getEntriesByName(name, "measure")[0];
      if (OPTIMIZATION_FLAGS.ENABLE_DEBUG_LOGGING) {
        console.log(
          `Performance: ${name} took ${measure.duration.toFixed(2)}ms`
        );
      }
      return measure.duration;
    }
    return 0;
  },

  // Get current memory usage (if available)
  getMemoryUsage: () => {
    if ("memory" in performance) {
      return {
        used: (performance as any).memory.usedJSHeapSize,
        total: (performance as any).memory.totalJSHeapSize,
        limit: (performance as any).memory.jsHeapSizeLimit,
      };
    }
    return null;
  },

  // Check if performance API is supported
  isSupported: () => {
    return (
      typeof performance !== "undefined" &&
      typeof performance.mark === "function"
    );
  },
};

// Export commonly used configurations
export const {
  API: API_CONFIG,
  CACHE: CACHE_CONFIG,
  REQUEST: REQUEST_CONFIG,
  UI: UI_CONFIG,
  DATABASE: DB_CONFIG,
  ERROR: ERROR_CONFIG,
} = PERFORMANCE_CONFIG;
