// API client configuration

import { API_BASE_URL, API_TIMEOUT } from "../../constants";
import { responseCache } from "../../shared/utils/cache";
import { ErrorUtils } from "../../shared/utils/enhanced-error-handling";
import { RequestUtils } from "../../shared/utils/request-optimizer";

class ApiClient {
  private baseURL: string;
  private timeout: number;

  constructor() {
    this.baseURL = API_BASE_URL;
    this.timeout = API_TIMEOUT;
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    const url = `${this.baseURL}${endpoint}`;

    const config: RequestInit = {
      headers: {
        "Content-Type": "application/json",
        ...options.headers,
      },
      ...options,
    };

    // Add auth token if available
    const token = localStorage.getItem("owlai_auth_token");
    if (token) {
      config.headers = {
        ...config.headers,
        Authorization: `Bearer ${token}`,
      };
    }

    // Use enhanced error handling with circuit breaker and smart retries
    return ErrorUtils.robustExecute(
      async () => {
        const response = await RequestUtils.optimizedFetch(
          url,
          config,
          "normal"
        );

        if (!response.ok) {
          const error = new Error(`HTTP error! status: ${response.status}`);
          (error as any).status = response.status;
          (error as any).statusCode = response.status;
          throw error;
        }

        return await response.json();
      },
      {
        timeout: this.timeout,
        circuitBreaker: true,
        retries: 2,
        fallbackKey: `api-${endpoint.split("/")[1]}`, // Use resource type as fallback key
      }
    );
  }

  async get<T>(endpoint: string, useCache: boolean = true): Promise<T> {
    // Check cache first for GET requests
    if (useCache) {
      const cached = await responseCache.get(endpoint, "GET");
      if (cached) {
        return cached;
      }
    }

    const result = await this.request<T>(endpoint, { method: "GET" });

    // Cache successful GET responses
    if (useCache) {
      responseCache.set(endpoint, "GET", result);
    }

    return result;
  }

  async post<T>(
    endpoint: string,
    data?: any,
    useCache: boolean = false
  ): Promise<T> {
    // Check cache for POST requests if explicitly enabled
    if (useCache) {
      const cached = await responseCache.get(endpoint, "POST", data);
      if (cached) {
        return cached;
      }
    }

    const result = await this.request<T>(endpoint, {
      method: "POST",
      body: data ? JSON.stringify(data) : undefined,
    });

    // Cache successful POST responses if enabled
    if (useCache) {
      responseCache.set(endpoint, "POST", result, data, 60000); // 1 minute TTL
    }

    // Invalidate related cache entries for POST requests
    responseCache.invalidate(endpoint.split("/")[1]); // Invalidate by resource type

    return result;
  }

  async put<T>(endpoint: string, data?: any): Promise<T> {
    return this.request<T>(endpoint, {
      method: "PUT",
      body: data ? JSON.stringify(data) : undefined,
    });
  }

  async delete<T>(endpoint: string): Promise<T> {
    return this.request<T>(endpoint, { method: "DELETE" });
  }

  async patch<T>(endpoint: string, data?: any): Promise<T> {
    return this.request<T>(endpoint, {
      method: "PATCH",
      body: data ? JSON.stringify(data) : undefined,
    });
  }
}

export const apiClient = new ApiClient();
