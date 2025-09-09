/**
 * Flowise API Service
 * Handles communication with the Flowise chatbot API
 */

import { getFlowiseConfig } from "../config/flowiseConfig";

// Get configuration
const config = getFlowiseConfig();
const FLOWISE_API_URL = config.API_URL;
const REQUEST_TIMEOUT = config.REQUEST_TIMEOUT;
const MAX_RETRIES = config.MAX_RETRIES;
const RETRY_DELAY = config.RETRY_DELAY;

// Type definitions
export interface FlowiseRequest {
  question: string;
  chatId?: string;
  overrideConfig?: Record<string, unknown>;
}

export interface FlowiseResponse {
  text?: string;
  sourceDocuments?: Record<string, unknown>[];
  chatMessageId?: string;
  chatId?: string;
  error?: string;
  streaming?: boolean;
}

export interface FlowiseStreamResponse {
  text: string;
  done: boolean;
  chatId?: string;
  error?: string;
}

export class FlowiseError extends Error {
  status?: number;
  code?: string;

  constructor(options: { message: string; status?: number; code?: string }) {
    super(options.message);
    this.name = "FlowiseError";
    this.status = options.status;
    this.code = options.code;
  }
}

/**
 * Create an AbortController with timeout
 */
function createTimeoutController(timeoutMs: number): AbortController {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), timeoutMs);

  // Clean up timeout when request completes
  controller.signal.addEventListener('abort', () => clearTimeout(timeoutId));

  return controller;
}

/**
 * Enhanced fetch with timeout and retry logic
 */
async function fetchWithTimeout(
  url: string,
  options: RequestInit,
  timeoutMs: number = REQUEST_TIMEOUT
): Promise<Response> {
  const controller = createTimeoutController(timeoutMs);

  try {
    const response = await fetch(url, {
      ...options,
      signal: controller.signal,
      headers: {
        'Content-Type': 'application/json',
        'Connection': 'keep-alive',
        'Cache-Control': 'no-cache',
        ...options.headers,
      },
    });

    return response;
  } catch (error) {
    if (error instanceof Error && error.name === 'AbortError') {
      throw new FlowiseError({
        message: `Request timeout after ${timeoutMs}ms`,
        code: 'TIMEOUT_ERROR',
      });
    }
    throw error;
  }
}

/**
 * Main query function to communicate with Flowise API with retry logic
 * @param data - The request data containing the question and optional parameters
 * @returns Promise<FlowiseResponse> - The API response
 */
export async function query(data: FlowiseRequest): Promise<FlowiseResponse> {
  // Validate input
  if (!data.question || typeof data.question !== "string") {
    throw new Error("Question is required and must be a string");
  }

  if (data.question.trim().length === 0) {
    throw new Error("Question cannot be empty");
  }

  let lastError: Error | null = null;

  // Retry logic
  for (let attempt = 0; attempt <= MAX_RETRIES; attempt++) {
    try {
      // Make API request with timeout
      const response = await fetchWithTimeout(FLOWISE_API_URL, {
        method: "POST",
        body: JSON.stringify({
          ...data,
          // Add performance optimizations
          overrideConfig: {
            ...data.overrideConfig,
            ...config.MODEL_CONFIG,
          },
        }),
      });

      // Check if response is ok
      if (!response.ok) {
        throw new FlowiseError({
          message: `API request failed: ${response.status} ${response.statusText}`,
          status: response.status,
          code: "API_ERROR",
        });
      }

      // Parse JSON response
      const result: FlowiseResponse = await response.json();

      // Validate response structure
      if (!result || typeof result !== "object") {
        throw new Error("Invalid response format from API");
      }

      // Check for API-level errors
      if (result.error) {
        throw new Error(`API Error: ${result.error}`);
      }

      return result;
    } catch (error) {
      lastError = error as Error;

      // Don't retry on certain errors
      if (error instanceof FlowiseError &&
          (error.code === 'TIMEOUT_ERROR' || error.status === 400)) {
        throw error;
      }

      // Wait before retry (exponential backoff)
      if (attempt < MAX_RETRIES) {
        const delay = RETRY_DELAY * Math.pow(2, attempt);
        await new Promise(resolve => setTimeout(resolve, delay));
        console.warn(`Flowise API attempt ${attempt + 1} failed, retrying in ${delay}ms...`);
      }
    }
  }

  // All retries failed
  if (lastError instanceof TypeError && lastError.message.includes("fetch")) {
    throw new FlowiseError({
      message: "Network error: Unable to connect to the API after multiple attempts",
      code: "NETWORK_ERROR",
    });
  }

  if (lastError instanceof SyntaxError) {
    throw new FlowiseError({
      message: "Invalid response format from API",
      code: "PARSE_ERROR",
    });
  }

  // Re-throw FlowiseError as-is
  if (lastError instanceof FlowiseError) {
    throw lastError;
  }

  // Wrap other errors
  throw new FlowiseError({
    message: lastError?.message || "Unknown error occurred after multiple attempts",
    code: "UNKNOWN_ERROR",
  });
}

// Request cache to avoid duplicate API calls
const requestCache = new Map<string, { response: FlowiseResponse; timestamp: number }>();
const CACHE_DURATION = config.CACHE_DURATION;

/**
 * Generate cache key for request
 */
function generateCacheKey(question: string, chatId?: string): string {
  return `${question.trim().toLowerCase()}_${chatId || 'new'}`;
}

/**
 * Check if cached response is still valid
 */
function isCacheValid(timestamp: number): boolean {
  return Date.now() - timestamp < CACHE_DURATION;
}

/**
 * Send a chat message to Flowise with caching
 * @param question - The user's question/message
 * @param chatId - Optional chat ID for conversation continuity
 * @param useCache - Whether to use cached responses (default: true)
 * @returns Promise<FlowiseResponse> - The AI response
 */
export async function sendMessage(
  question: string,
  chatId?: string,
  useCache: boolean = true,
): Promise<FlowiseResponse> {
  const trimmedQuestion = question.trim();

  // Check cache first (only for new conversations)
  if (useCache && !chatId) {
    const cacheKey = generateCacheKey(trimmedQuestion);
    const cached = requestCache.get(cacheKey);

    if (cached && isCacheValid(cached.timestamp)) {
      console.log('Using cached response for:', trimmedQuestion.substring(0, 50) + '...');
      return cached.response;
    }
  }

  const requestData: FlowiseRequest = {
    question: trimmedQuestion,
  };

  if (chatId) {
    requestData.chatId = chatId;
  }

  const startTime = Date.now();
  const response = await query(requestData);
  const responseTime = Date.now() - startTime;

  // Emit performance event
  if (typeof window !== 'undefined') {
    window.dispatchEvent(new CustomEvent('flowise-performance', {
      detail: { type: 'response_time', data: { responseTime } }
    }));
  }

  // Cache the response (only for new conversations)
  if (useCache && !chatId && response.text) {
    const cacheKey = generateCacheKey(trimmedQuestion);
    requestCache.set(cacheKey, {
      response,
      timestamp: Date.now(),
    });

    // Emit cache hit event for future requests
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new CustomEvent('flowise-performance', {
        detail: { type: 'cache_hit', data: {} }
      }));
    }

    // Clean up old cache entries
    if (requestCache.size > config.MAX_CACHE_SIZE) {
      const entries = Array.from(requestCache.entries());
      entries
        .filter(([_, value]) => !isCacheValid(value.timestamp))
        .forEach(([key]) => requestCache.delete(key));
    }
  }

  return response;
}

/**
 * Stream a chat message to Flowise (if supported)
 * @param question - The user's question/message
 * @param chatId - Optional chat ID for conversation continuity
 * @param onChunk - Callback for each text chunk received
 * @returns Promise<FlowiseStreamResponse> - The final response
 */
export async function sendMessageStream(
  question: string,
  chatId?: string,
  onChunk?: (chunk: string) => void,
): Promise<FlowiseStreamResponse> {
  const requestData: FlowiseRequest = {
    question: question.trim(),
    chatId,
    overrideConfig: {
      streaming: true,
      temperature: 0.7,
      maxTokens: 1000,
    },
  };

  try {
    const controller = createTimeoutController(REQUEST_TIMEOUT);

    const response = await fetch(FLOWISE_API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Accept": "text/event-stream",
        "Cache-Control": "no-cache",
      },
      body: JSON.stringify(requestData),
      signal: controller.signal,
    });

    if (!response.ok) {
      throw new FlowiseError({
        message: `Streaming request failed: ${response.status} ${response.statusText}`,
        status: response.status,
        code: "STREAM_ERROR",
      });
    }

    const reader = response.body?.getReader();
    if (!reader) {
      throw new FlowiseError({
        message: "No response body reader available",
        code: "STREAM_ERROR",
      });
    }

    const decoder = new TextDecoder();
    let fullText = "";
    let finalChatId: string | undefined;

    try {
      while (true) {
        const { done, value } = await reader.read();

        if (done) break;

        const chunk = decoder.decode(value, { stream: true });
        const lines = chunk.split('\n');

        for (const line of lines) {
          if (line.startsWith('data: ')) {
            try {
              const data = JSON.parse(line.slice(6));
              if (data.text) {
                fullText += data.text;
                onChunk?.(data.text);
              }
              if (data.chatId) {
                finalChatId = data.chatId;
              }
            } catch (e) {
              // Ignore malformed JSON chunks
            }
          }
        }
      }
    } finally {
      reader.releaseLock();
    }

    return {
      text: fullText,
      done: true,
      chatId: finalChatId,
    };
  } catch (error) {
    if (error instanceof Error && error.name === 'AbortError') {
      throw new FlowiseError({
        message: `Streaming request timeout after ${REQUEST_TIMEOUT}ms`,
        code: 'TIMEOUT_ERROR',
      });
    }
    throw error;
  }
}

/**
 * Test the API connection
 * @returns Promise<boolean> - True if API is working, false otherwise
 */
export async function testConnection(): Promise<boolean> {
  try {
    const response = await query({ question: "Hello, are you working?" });
    return !!response && (!!response.text || !!response.chatMessageId);
  } catch (error) {
    console.error("API connection test failed:", error);
    return false;
  }
}

/**
 * Get API health status
 * @returns Promise<{status: string, message: string}> - Health status
 */
export async function getApiHealth(): Promise<{
  status: string;
  message: string;
}> {
  try {
    const isWorking = await testConnection();
    return {
      status: isWorking ? "healthy" : "unhealthy",
      message: isWorking
        ? "API is responding correctly"
        : "API is not responding",
    };
  } catch (error) {
    return {
      status: "error",
      message: error instanceof Error ? error.message : "Unknown error",
    };
  }
}

// Export the main query function as default
export default query;
