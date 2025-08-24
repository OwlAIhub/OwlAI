/**
 * API Service Layer
 * Centralized API calls with proper error handling and types
 */

import {
  ApiResponse,
  ChatApiResponse,
  SessionCreateResponse,
  ChatSession,
  FeedbackData,
} from "@/types";
import { API_ENDPOINTS } from "@/constants";

// Get API base URL from config
const getApiUrl = (): string => {
  // Dynamically import config to avoid circular dependencies
  return (window as any).APP_CONFIG?.apiUrl || "http://localhost:8000";
};

/**
 * Generic API request handler with error handling
 */
async function apiRequest<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<ApiResponse<T>> {
  try {
    const url = `${getApiUrl()}${endpoint}`;
    const response = await fetch(url, {
      headers: {
        "Content-Type": "application/json",
        ...options.headers,
      },
      ...options,
    });

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }

    const data = await response.json();
    return {
      status: "success",
      data,
    };
  } catch (error) {
    console.error("API Request failed:", error);
    return {
      status: "error",
      error: error instanceof Error ? error.message : "Unknown error",
    };
  }
}

/**
 * Chat API Service
 */
export const chatApi = {
  /**
   * Send a message to the AI
   */
  async sendMessage(
    query: string,
    userId: string,
    sessionId: string
  ): Promise<ApiResponse<ChatApiResponse>> {
    return apiRequest<ChatApiResponse>(API_ENDPOINTS.ASK, {
      method: "POST",
      body: JSON.stringify({
        query,
        user_id: userId,
        session_id: sessionId,
      }),
    });
  },

  /**
   * Get chat history for a specific chat ID
   */
  async getChatHistory(
    chatId: string,
    token?: string
  ): Promise<ApiResponse<any>> {
    const headers: Record<string, string> = {};
    if (token) {
      headers.Authorization = `Bearer ${token}`;
    }
    return apiRequest<any>(`${API_ENDPOINTS.CHAT_HISTORY}/${chatId}`, {
      headers,
    });
  },

  /**
   * Get all chat sessions for a user
   */
  async getChatSessions(userId: string): Promise<ApiResponse<ChatSession[]>> {
    return apiRequest<ChatSession[]>(
      `${API_ENDPOINTS.CHAT_SESSIONS}?user_id=${userId}`
    );
  },
};

/**
 * Session API Service
 */
export const sessionApi = {
  /**
   * Create a new chat session
   */
  async createSession(
    userId: string
  ): Promise<ApiResponse<SessionCreateResponse>> {
    return apiRequest<SessionCreateResponse>(
      `${API_ENDPOINTS.SESSION_CREATE}?user_id=${userId}`,
      { method: "POST" }
    );
  },

  /**
   * Initialize anonymous session
   */
  async initAnonymousSession(): Promise<ApiResponse<SessionCreateResponse>> {
    return apiRequest<SessionCreateResponse>(API_ENDPOINTS.SESSION_INIT_ANON, {
      method: "POST",
    });
  },

  /**
   * Rename a chat session
   */
  async renameSession(
    sessionId: string,
    newName: string
  ): Promise<ApiResponse<void>> {
    return apiRequest<void>(API_ENDPOINTS.SESSION_RENAME, {
      method: "PATCH",
      body: JSON.stringify({
        session_id: sessionId,
        new_name: newName,
      }),
    });
  },

  /**
   * Delete a chat session
   */
  async deleteSession(sessionId: string): Promise<ApiResponse<void>> {
    return apiRequest<void>(`${API_ENDPOINTS.SESSION_DELETE}/${sessionId}`, {
      method: "DELETE",
    });
  },
};

/**
 * Feedback API Service
 */
export const feedbackApi = {
  /**
   * Submit feedback for a chat response
   */
  async submitFeedback(feedbackData: FeedbackData): Promise<ApiResponse<void>> {
    return apiRequest<void>(API_ENDPOINTS.FEEDBACK_CREATE, {
      method: "POST",
      body: JSON.stringify(feedbackData),
    });
  },
};

/**
 * Re-export for convenience
 */
export const api = {
  chat: chatApi,
  session: sessionApi,
  feedback: feedbackApi,
};
