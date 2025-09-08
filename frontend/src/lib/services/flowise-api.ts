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

export interface FlowiseStreamHandlers {
  onToken?: (chunk: string) => void;
  onDone?: (finalText: string) => void;
  onError?: (error: FlowiseAPIError) => void;
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
    process.env.NEXT_PUBLIC_FLOWISE_URL ||
    'http://34.47.149.141/api/v1/prediction/79dcfd80-c276-4143-b9fd-07bde03d96de';
  private readonly apiKey = process.env.NEXT_PUBLIC_FLOWISE_API_KEY;
  private readonly timeout = 30000; // 30 seconds
  private readonly maxRetries = 3;
  private readonly cacheTTL = Number(
    process.env.NEXT_PUBLIC_FLOWISE_CACHE_TTL_MS || 30000
  );
  private readonly historyLimit = Number(
    process.env.NEXT_PUBLIC_CHAT_HISTORY_LIMIT || 10
  );
  private readonly cache = new Map<
    string,
    { expiresAt: number; value: FlowiseResponse }
  >();

  /** Limit history length/token budget crudely by character count */
  private clampHistory(
    history: FlowiseRequest['history'] = []
  ): FlowiseRequest['history'] {
    const limited = history.slice(-this.historyLimit);
    // crude char budget of ~4000 chars
    const budget = 4000;
    const out: typeof limited = [];
    let used = 0;
    for (let i = limited.length - 1; i >= 0; i--) {
      const h = limited[i];
      if (used + h.message.length <= budget) {
        out.unshift(h);
        used += h.message.length;
      } else {
        break;
      }
    }
    return out;
  }

  private cacheKey(data: FlowiseRequest): string {
    const hist = (data.history || [])
      .map(h => `${h.type}:${h.message}`)
      .join('|');
    return `${data.question}__${hist}`;
  }

  private getFromCache(data: FlowiseRequest): FlowiseResponse | null {
    const key = this.cacheKey(data);
    const hit = this.cache.get(key);
    if (hit && hit.expiresAt > Date.now()) return hit.value;
    if (hit) this.cache.delete(key);
    return null;
  }

  private setCache(data: FlowiseRequest, value: FlowiseResponse): void {
    const key = this.cacheKey(data);
    this.cache.set(key, { expiresAt: Date.now() + this.cacheTTL, value });
  }

  /**
   * Send a question to Flowise and get response
   */
  async query(data: FlowiseRequest): Promise<FlowiseResponse> {
    // clamp history
    data.history = this.clampHistory(data.history);

    // cache
    const cached = this.getFromCache(data);
    if (cached) return cached;

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), this.timeout);

    try {
      const response = await fetch(this.baseURL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(this.apiKey ? { Authorization: `Bearer ${this.apiKey}` } : {}),
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

      this.setCache(data, result);
      return result as FlowiseResponse;
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

  /**
   * Streaming query (best-effort). Falls back to non-stream if server does not stream.
   */
  async queryStream(
    data: FlowiseRequest,
    handlers: FlowiseStreamHandlers
  ): Promise<void> {
    // clamp history, skip cache for streaming to keep UX fresh
    data.history = this.clampHistory(data.history);

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), this.timeout);

    try {
      const response = await fetch(this.baseURL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'text/event-stream, application/json',
          ...(this.apiKey ? { Authorization: `Bearer ${this.apiKey}` } : {}),
        },
        body: JSON.stringify({ ...data, stream: true }),
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      // If JSON returned, not streaming
      const contentType = response.headers.get('content-type') || '';
      if (!response.body || contentType.includes('application/json')) {
        const result = await response.json();
        if (!result || typeof result.text !== 'string') {
          throw new FlowiseAPIError('Invalid response format from Flowise API');
        }
        handlers.onToken?.(result.text);
        handlers.onDone?.(result.text);
        return;
      }

      const reader = response.body.getReader();
      const decoder = new TextDecoder('utf-8');
      let finalText = '';
      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        const chunk = decoder.decode(value, { stream: true });
        // naive SSE/NDJSON splitter
        const parts = chunk.split('\n');
        for (const part of parts) {
          const line = part.trim();
          if (!line) continue;
          // Try JSON first
          try {
            const json = JSON.parse(line);
            const text =
              typeof json.text === 'string' ? json.text : String(line);
            finalText += text;
            handlers.onToken?.(text);
          } catch {
            finalText += line;
            handlers.onToken?.(line);
          }
        }
      }
      handlers.onDone?.(finalText);
    } catch (error) {
      clearTimeout(timeoutId);
      const apiErr =
        error instanceof FlowiseAPIError
          ? error
          : new FlowiseAPIError(
              error instanceof Error ? error.message : 'Unknown streaming error'
            );
      handlers.onError?.(apiErr);
    }
  }
}

// Export singleton instance
export const flowiseAPI = new FlowiseAPIService();
