/**
 * Flowise API Configuration
 * Optimized settings for faster response times
 */

export const FLOWISE_CONFIG = {
  // API Settings
  API_URL: "https://34.47.149.141/api/v1/prediction/79dcfd80-c276-4143-b9fd-07bde03d96de",

  // Performance Settings
  REQUEST_TIMEOUT: 30000, // 30 seconds
  MAX_RETRIES: 2,
  RETRY_DELAY: 1000, // 1 second base delay

  // Caching Settings
  CACHE_DURATION: 5 * 60 * 1000, // 5 minutes
  MAX_CACHE_SIZE: 100,

  // Model Optimization Settings
  MODEL_CONFIG: {
    temperature: 0.7, // Lower for faster, more focused responses
    maxTokens: 1000, // Limit response length for faster generation
    topP: 0.9,
    frequencyPenalty: 0.1,
    presencePenalty: 0.1,
    // Additional optimizations
    stopSequences: ["\n\n", "Human:", "Assistant:"],
    timeout: 25000, // 25 seconds for model inference
  },

  // Streaming Settings
  STREAMING: {
    enabled: true,
    chunkSize: 1024,
    bufferSize: 4096,
  },

  // Connection Settings
  CONNECTION: {
    keepAlive: true,
    maxConnections: 6,
    connectionTimeout: 10000, // 10 seconds
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
    // Development overrides
    ...(isDevelopment && {
      REQUEST_TIMEOUT: 45000, // Longer timeout in dev
      MODEL_CONFIG: {
        ...FLOWISE_CONFIG.MODEL_CONFIG,
        temperature: 0.8, // Slightly higher creativity in dev
      },
    }),
  };
};

// Performance thresholds
export const PERFORMANCE_THRESHOLDS = {
  FAST_RESPONSE: 2000, // < 2 seconds
  MEDIUM_RESPONSE: 5000, // < 5 seconds
  SLOW_RESPONSE: 10000, // < 10 seconds
  TIMEOUT: 30000, // 30 seconds
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
