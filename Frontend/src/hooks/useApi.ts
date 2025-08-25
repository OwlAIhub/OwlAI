import { useState, useEffect, useCallback, useRef } from "react";
import { LoadingState, ApiResponse } from "@/types";
import { ERROR_MESSAGES } from "@/constants";

interface UseApiOptions {
  immediate?: boolean;
  cacheKey?: string;
  cacheDuration?: number; // in milliseconds
  retryAttempts?: number;
  retryDelay?: number;
}

interface UseApiReturn<T> {
  data: T | null;
  loading: LoadingState;
  error: string | null;
  execute: (...args: any[]) => Promise<T | null>;
  reset: () => void;
  retry: () => Promise<T | null>;
}

// Simple in-memory cache
const apiCache = new Map<
  string,
  { data: any; timestamp: number; duration: number }
>();

export const useApi = <T>(
  apiFunction: (...args: any[]) => Promise<ApiResponse<T>>,
  options: UseApiOptions = {}
): UseApiReturn<T> => {
  const {
    immediate = false,
    cacheKey,
    cacheDuration = 5 * 60 * 1000, // 5 minutes default
    retryAttempts = 3,
    retryDelay = 1000,
  } = options;

  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState<LoadingState>("idle");
  const [error, setError] = useState<string | null>(null);

  const lastArgsRef = useRef<any[]>([]);
  const retryCountRef = useRef(0);
  const abortControllerRef = useRef<AbortController | null>(null);

  // Check cache for data
  const getCachedData = useCallback((key: string): T | null => {
    if (!key) return null;

    const cached = apiCache.get(key);
    if (cached && Date.now() - cached.timestamp < cached.duration) {
      return cached.data;
    }

    // Remove expired cache
    if (cached) {
      apiCache.delete(key);
    }

    return null;
  }, []);

  // Set cache data
  const setCachedData = useCallback(
    (key: string, data: T) => {
      if (key) {
        apiCache.set(key, {
          data,
          timestamp: Date.now(),
          duration: cacheDuration,
        });
      }
    },
    [cacheDuration]
  );

  // Execute API call
  const execute = useCallback(
    async (...args: any[]): Promise<T | null> => {
      // Store args for retry
      lastArgsRef.current = args;

      // Check cache first
      if (cacheKey) {
        const cachedData = getCachedData(cacheKey);
        if (cachedData) {
          setData(cachedData);
          setLoading("success");
          setError(null);
          return cachedData;
        }
      }

      // Cancel previous request
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }

      // Create new abort controller
      abortControllerRef.current = new AbortController();

      try {
        setLoading("loading");
        setError(null);

        const response = await apiFunction(...args);

        // Check if request was aborted
        if (abortControllerRef.current?.signal.aborted) {
          return null;
        }

        if (response.status === "success" && response.data) {
          setData(response.data);
          setLoading("success");
          retryCountRef.current = 0;

          // Cache the result
          if (cacheKey) {
            setCachedData(cacheKey, response.data);
          }

          return response.data;
        } else {
          throw new Error(response.error || ERROR_MESSAGES.GENERIC_ERROR);
        }
      } catch (err) {
        // Don't update state if request was aborted
        if (abortControllerRef.current?.signal.aborted) {
          return null;
        }

        console.error("API call failed:", err);
        const errorMessage =
          err instanceof Error ? err.message : ERROR_MESSAGES.NETWORK_ERROR;
        setError(errorMessage);
        setLoading("error");
        return null;
      }
    },
    [apiFunction, cacheKey, getCachedData, setCachedData]
  );

  // Retry function
  const retry = useCallback(async (): Promise<T | null> => {
    if (retryCountRef.current < retryAttempts) {
      retryCountRef.current++;

      // Add delay before retry
      await new Promise(resolve => setTimeout(resolve, retryDelay));

      return execute(...lastArgsRef.current);
    } else {
      setError("Maximum retry attempts reached.");
      return null;
    }
  }, [execute, retryAttempts, retryDelay]);

  // Reset function
  const reset = useCallback(() => {
    setData(null);
    setLoading("idle");
    setError(null);
    retryCountRef.current = 0;

    // Cancel any ongoing request
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }
  }, []);

  // Execute immediately if requested
  useEffect(() => {
    if (immediate) {
      execute();
    }
  }, [immediate, execute]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
    };
  }, []);

  return {
    data,
    loading,
    error,
    execute,
    reset,
    retry,
  };
};

// Specialized hooks for common API patterns
export const useChatHistory = (chatId: string) => {
  return useApi(
    async () => {
      const { chatApi } = await import("@/services/api");
      return chatApi.getChatHistory(chatId);
    },
    {
      cacheKey: `chat-history-${chatId}`,
      cacheDuration: 5 * 60 * 1000, // 5 minutes
      immediate: !!chatId,
    }
  );
};

export const useChatSessions = (userId: string) => {
  return useApi(
    async () => {
      const { api } = await import("@/services/api");
      if (
        !api.session ||
        typeof (api.session as any).listSessions !== "function"
      ) {
        throw new Error("api.session.listSessions is not implemented");
      }
      // @ts-expect-error: listSessions may not be typed on api.session
      return api.session.listSessions(userId);
    },
    {
      cacheKey: `chat-sessions-${userId}`,
      cacheDuration: 2 * 60 * 1000, // 2 minutes
      immediate: !!userId,
    }
  );
};
