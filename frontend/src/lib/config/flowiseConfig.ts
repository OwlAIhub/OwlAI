/**
 * Flowise API Configuration
 * Optimized settings for faster response times
 */

export const FLOWISE_CONFIG = {
  // API Settings
  API_URL: "http://34.47.149.141/api/v1/prediction/79dcfd80-c276-4143-b9fd-07bde03d96de",

  // Performance Settings - Optimized for speed
  REQUEST_TIMEOUT: 15000, // Reduced to 15 seconds for faster responses
  MAX_RETRIES: 1, // Reduced retries for faster failure handling
  RETRY_DELAY: 500, // Faster retry delay

  // Caching Settings - Enhanced for speed
  CACHE_DURATION: 10 * 60 * 1000, // Increased to 10 minutes for better caching
  MAX_CACHE_SIZE: 200, // Increased cache size for more hits

  // Model Optimization Settings - Tuned for speed and smoothness
  MODEL_CONFIG: {
    temperature: 0.5, // Lower for faster, more deterministic responses
    maxTokens: 800, // Reduced for faster generation
    topP: 0.8, // More focused responses
    frequencyPenalty: 0.2, // Slightly higher to avoid repetition
    presencePenalty: 0.1,
    // Additional optimizations for speed
    stopSequences: ["\n\n", "Human:", "Assistant:", "\n---"],
    timeout: 12000, // Reduced to 12 seconds for faster inference
  },

  // Streaming Settings - Optimized for smoothness
  STREAMING: {
    enabled: true,
    chunkSize: 512, // Smaller chunks for smoother streaming
    bufferSize: 2048, // Optimized buffer size
  },

  // Connection Settings - Enhanced for speed
  CONNECTION: {
    keepAlive: true,
    maxConnections: 8, // Increased for better concurrency
    connectionTimeout: 5000, // Reduced to 5 seconds for faster connections
  },

  // Performance Monitoring
  MONITORING: {
    enabled: true,
    trackResponseTimes: true,
    trackCacheHits: true,
    trackErrors: true,
  },
} as const;

// Environment-specific overrides
export const getFlowiseConfig = () => {
  const isDevelopment = process.env.NODE_ENV === 'development';

  return {
    ...FLOWISE_CONFIG,
    // Development overrides - Optimized for fast development
    ...(isDevelopment && {
      REQUEST_TIMEOUT: 20000, // Optimized timeout for dev (not too long)
      MAX_RETRIES: 0, // No retries in dev for faster debugging
      MODEL_CONFIG: {
        ...FLOWISE_CONFIG.MODEL_CONFIG,
        temperature: 0.4, // Even lower for consistent dev responses
        maxTokens: 600, // Shorter responses for faster dev testing
        timeout: 10000, // Faster timeout in dev
      },
      STREAMING: {
        ...FLOWISE_CONFIG.STREAMING,
        chunkSize: 256, // Even smaller chunks for smoother dev experience
      },
    }),
  };
};

// Performance thresholds - Optimized for faster responses
export const PERFORMANCE_THRESHOLDS = {
  FAST_RESPONSE: 1000, // < 1 second (very fast)
  MEDIUM_RESPONSE: 3000, // < 3 seconds (acceptable)
  SLOW_RESPONSE: 6000, // < 6 seconds (slow but tolerable)
  TIMEOUT: 15000, // 15 seconds (matches REQUEST_TIMEOUT)
} as const;

// Error codes and messages
export const FLOWISE_ERRORS = {
  TIMEOUT: 'TIMEOUT_ERROR',
  NETWORK: 'NETWORK_ERROR',
  PARSE: 'PARSE_ERROR',
  API: 'API_ERROR',
  STREAM: 'STREAM_ERROR',
  UNKNOWN: 'UNKNOWN_ERROR',
} as const;
