/**
 * Flowise API Service
 * Handles communication with Flowise chatbot API
 */

export interface SourceDocument {
  pageContent: string;
  metadata: {
    source?: string;
    [key: string]: unknown;
  };
}

export interface FlowiseResponse {
  text: string;
  sourceDocuments?: SourceDocument[];
  chatId?: string;
}

export interface FlowiseRequest {
  question: string;
  chatId?: string;
  history?: Array<{
    type: 'apiMessage' | 'userMessage';
    message: string;
  }>;
}

export class FlowiseAPIError extends Error {
  constructor(
    message: string,
    public status?: number,
    public code?: string
  ) {
    super(message);
    this.name = 'FlowiseAPIError';
  }
}

class FlowiseAPIService {
  private readonly baseURL =
    'http://34.47.149.141/api/v1/prediction/79dcfd80-c276-4143-b9fd-07bde03d96de';
  private readonly timeout = 30000; // 30 seconds
  private readonly maxRetries = 3;

  /**
   * Send a question to Flowise and get response
   */
  async query(data: FlowiseRequest): Promise<FlowiseResponse> {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), this.timeout);

    try {
      const response = await fetch(this.baseURL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      if (!response.ok) {
        throw new FlowiseAPIError(
          `HTTP ${response.status}: ${response.statusText}`,
          response.status
        );
      }

      const result = await response.json();

      // Validate response structure
      if (!result || typeof result.text !== 'string') {
        throw new FlowiseAPIError('Invalid response format from Flowise API');
      }

      return result;
    } catch (error) {
      clearTimeout(timeoutId);

      if (error instanceof FlowiseAPIError) {
        throw error;
      }

      if (error instanceof Error) {
        if (error.name === 'AbortError') {
          throw new FlowiseAPIError('Request timeout - please try again');
        }
        throw new FlowiseAPIError(`Network error: ${error.message}`);
      }

      throw new FlowiseAPIError('Unknown error occurred');
    }
  }

  /**
   * Query with retry logic
   */
  async queryWithRetry(data: FlowiseRequest): Promise<FlowiseResponse> {
    let lastError: Error;

    for (let attempt = 1; attempt <= this.maxRetries; attempt++) {
      try {
        return await this.query(data);
      } catch (error) {
        lastError = error as Error;

        // Don't retry on certain errors
        if (
          error instanceof FlowiseAPIError &&
          error.status &&
          error.status < 500
        ) {
          throw error;
        }

        // Wait before retry (exponential backoff)
        if (attempt < this.maxRetries) {
          const delay = Math.min(1000 * Math.pow(2, attempt - 1), 5000);
          await new Promise(resolve => setTimeout(resolve, delay));
        }
      }
    }

    throw lastError!;
  }
}

// Export singleton instance
export const flowiseAPI = new FlowiseAPIService();
