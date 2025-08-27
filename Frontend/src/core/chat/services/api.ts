/**
 * API Service
 * Centralized API communication with proper error handling and authentication
 */

import { auth } from "../../firebase";
import { logger } from "../../../shared/utils/logger";

// Import types (these will be defined in the types module)
interface ChatSession {
  id: string;
  title: string;
  created_at: string;
  updated_at: string;
  user_id: string;
}

interface ChatMessage {
  id: string;
  session_id: string;
  content: string;
  role: "user" | "assistant";
  created_at: string;
}

interface UserProfile {
  id: string;
  name: string;
  email?: string;
  phone?: string;
  avatar?: string;
  created_at: string;
  updated_at: string;
}

interface UserPreferences {
  theme: "light" | "dark" | "auto";
  language: string;
  notifications: boolean;
  privacy_settings: Record<string, boolean>;
}

// API Configuration
const API_CONFIG = {
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:8000",
  timeout: parseInt(import.meta.env.VITE_API_TIMEOUT || "30000"),
  retries: 3,
  retryDelay: 1000,
};

// Request types
interface RequestConfig {
  method?: "GET" | "POST" | "PUT" | "DELETE" | "PATCH";
  headers?: Record<string, string>;
  body?: any;
  timeout?: number;
  retries?: number;
}

interface ApiResponse<T = any> {
  data: T;
  status: number;
  message: string;
  success: boolean;
}

// Error types
class ApiError extends Error {
  constructor(
    message: string,
    public status: number,
    public code?: string
  ) {
    super(message);
    this.name = "ApiError";
  }
}

class NetworkError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "NetworkError";
  }
}

/**
 * Get authentication token
 */
const getAuthToken = async (): Promise<string | null> => {
  try {
    const user = auth.currentUser;
    if (user) {
      return await user.getIdToken();
    }
    return null;
  } catch (error) {
    logger.error("Failed to get auth token", "api", error);
    return null;
  }
};

/**
 * Create request headers
 */
const createHeaders = async (
  customHeaders?: Record<string, string>
): Promise<Record<string, string>> => {
  const token = await getAuthToken();

  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    Accept: "application/json",
    ...customHeaders,
  };

  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }

  return headers;
};

/**
 * Retry mechanism for failed requests
 */
const retryRequest = async <T>(
  requestFn: () => Promise<T>,
  retries: number,
  delay: number
): Promise<T> => {
  try {
    return await requestFn();
  } catch (error: unknown) {
    if (
      retries > 0 &&
      (error instanceof NetworkError || (error as ApiError)?.status >= 500)
    ) {
      await new Promise(resolve => setTimeout(resolve, delay));
      return retryRequest(requestFn, retries - 1, delay * 2);
    }
    throw error;
  }
};

/**
 * Make HTTP request with proper error handling
 */
const makeRequest = async <T>(
  endpoint: string,
  config: RequestConfig = {}
): Promise<ApiResponse<T>> => {
  const {
    method = "GET",
    headers: customHeaders,
    body,
    timeout = API_CONFIG.timeout,
    retries = API_CONFIG.retries,
  } = config;

  const url = `${API_CONFIG.baseURL}${endpoint}`;
  const headers = await createHeaders(customHeaders);

  const requestFn = async (): Promise<ApiResponse<T>> => {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), timeout);

    try {
      const response = await fetch(url, {
        method,
        headers,
        body: body ? JSON.stringify(body) : undefined,
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      if (!response.ok) {
        let errorMessage = `HTTP ${response.status}: ${response.statusText}`;

        try {
          const errorData = await response.json();
          errorMessage = errorData.message || errorMessage;
        } catch {
          // If error response is not JSON, use default message
        }

        throw new ApiError(errorMessage, response.status);
      }

      const data = await response.json();

      logger.info("API request successful", "api", {
        method,
        endpoint,
        status: response.status,
      });

      return {
        data,
        status: response.status,
        message: "Success",
        success: true,
      };
    } catch (error) {
      clearTimeout(timeoutId);

      if (error instanceof ApiError) {
        throw error;
      }

      if (error.name === "AbortError") {
        throw new NetworkError("Request timeout");
      }

      if (error instanceof TypeError && error.message.includes("fetch")) {
        throw new NetworkError("Network error - please check your connection");
      }

      throw new NetworkError(
        error instanceof Error ? error.message : "Unknown error"
      );
    }
  };

  return retryRequest(requestFn, retries, API_CONFIG.retryDelay);
};

/**
 * Chat API methods
 */
export const chatApi = {
  // Get chat sessions
  getChatSessions: async (userId: string) => {
    return makeRequest<ChatSession[]>(`/chat/sessions?user_id=${userId}`);
  },

  // Create new chat session
  createChatSession: async (userId: string, title?: string) => {
    return makeRequest<{ session_id: string }>("/chat/sessions", {
      method: "POST",
      body: { user_id: userId, title },
    });
  },

  // Send message
  sendMessage: async (sessionId: string, message: string) => {
    return makeRequest<ChatMessage>("/chat/messages", {
      method: "POST",
      body: { session_id: sessionId, message },
    });
  },

  // Get chat messages
  getMessages: async (sessionId: string, limit = 50, offset = 0) => {
    return makeRequest<ChatMessage[]>(
      `/chat/messages?session_id=${sessionId}&limit=${limit}&offset=${offset}`
    );
  },

  // Delete chat session
  deleteChatSession: async (sessionId: string) => {
    return makeRequest(`/chat/sessions/${sessionId}`, {
      method: "DELETE",
    });
  },

  // Update chat session title
  updateChatSession: async (sessionId: string, title: string) => {
    return makeRequest(`/chat/sessions/${sessionId}`, {
      method: "PUT",
      body: { title },
    });
  },
};

/**
 * User API methods
 */
export const userApi = {
  // Get user profile
  getUserProfile: async (userId: string) => {
    return makeRequest<UserProfile>(`/users/${userId}`);
  },

  // Update user profile
  updateUserProfile: async (userId: string, profile: Partial<UserProfile>) => {
    return makeRequest<UserProfile>(`/users/${userId}`, {
      method: "PUT",
      body: profile,
    });
  },

  // Get user preferences
  getUserPreferences: async (userId: string) => {
    return makeRequest<UserPreferences>(`/users/${userId}/preferences`);
  },

  // Update user preferences
  updateUserPreferences: async (
    userId: string,
    preferences: Partial<UserPreferences>
  ) => {
    return makeRequest<UserPreferences>(`/users/${userId}/preferences`, {
      method: "PUT",
      body: preferences,
    });
  },
};

/**
 * Session API methods
 */
export const sessionApi = {
  // Initialize anonymous session
  initAnonymousSession: async () => {
    return makeRequest<{ session_id: string }>("/session/init-anon", {
      method: "POST",
    });
  },

  // Create user session
  createUserSession: async (userId: string) => {
    return makeRequest<{ session_id: string }>("/session/create", {
      method: "POST",
      body: { user_id: userId },
    });
  },
};

// Export all API methods
export const api = {
  chat: chatApi,
  user: userApi,
  session: sessionApi,
};

// Export types for use in other modules
export type { ApiResponse, RequestConfig };
export { ApiError, NetworkError };
