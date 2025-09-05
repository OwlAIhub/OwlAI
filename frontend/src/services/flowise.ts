import { FlowiseApiError, FlowiseRequestBody, FlowiseResponse } from './types';

// Keep endpoint configurable; default to provided URL
const DEFAULT_FLOWISE_ENDPOINT =
  process.env.NEXT_PUBLIC_FLOWISE_ENDPOINT ||
  'http://34.47.149.141/api/v1/prediction/086aebf7-e250-41e6-b437-061f747041d2';

// Get API key from environment
const FLOWISE_API_KEY = process.env.FLOWISE_API_KEY;

export type QueryOptions = {
  signal?: AbortSignal;
  endpoint?: string;
  headers?: Record<string, string>;
};

export async function queryFlowise(
  body: FlowiseRequestBody,
  options: QueryOptions = {}
): Promise<FlowiseResponse> {
  const { signal, endpoint = DEFAULT_FLOWISE_ENDPOINT, headers } = options;

  if (!endpoint) {
    throw new FlowiseApiError('Flowise endpoint not configured', 500);
  }

  // Prepare headers with optional API key
  const requestHeaders: Record<string, string> = {
    'Content-Type': 'application/json',
    ...headers,
  };

  // Add API key if available
  if (FLOWISE_API_KEY) {
    requestHeaders['Authorization'] = `Bearer ${FLOWISE_API_KEY}`;
  }

  // Debug logging (can be enabled for troubleshooting)
  // console.log('Flowise request:', { endpoint, body, headers: requestHeaders });

  const res = await fetch(endpoint, {
    method: 'POST',
    headers: requestHeaders,
    body: JSON.stringify(body),
    signal,
  });

  const contentType = res.headers.get('content-type') || '';
  const isJson = contentType.includes('application/json');

  if (!res.ok) {
    let message = `Flowise request failed (${res.status})`;
    try {
      if (isJson) {
        const err = (await res.json()) as Record<string, unknown>;
        message = (err?.message as string) || (err?.error as string) || message;
        // console.error('Flowise error response:', err);
      } else {
        const text = await res.text();
        if (text) message = text;
        // console.error('Flowise error text:', text);
      }
    } catch {
      // console.error('Error parsing Flowise error response:', e);
    }
    // console.error('Flowise request failed:', { status: res.status, message, endpoint, body });
    throw new FlowiseApiError(message, res.status);
  }

  if (isJson) {
    return (await res.json()) as FlowiseResponse;
  }

  // Fallback to text
  const text = await res.text();
  return { text } as FlowiseResponse;
}

export function extractAnswer(payload: FlowiseResponse): string {
  // Normalize different Flowise shapes
  if (!payload) return '';
  if (typeof (payload as Record<string, unknown>).text === 'string')
    return (payload as Record<string, unknown>).text as string;
  if (typeof (payload as Record<string, unknown>).response === 'string')
    return (payload as Record<string, unknown>).response as string;
  // Common nested shapes (some nodes)
  const possible = [
    ((payload as Record<string, unknown>)?.data as Record<string, unknown>)
      ?.text,
    ((payload as Record<string, unknown>)?.data as Record<string, unknown>)
      ?.response,
    (payload as Record<string, unknown>)?.result,
  ];
  for (const v of possible) {
    if (typeof v === 'string' && v.trim()) return v as string;
  }
  return JSON.stringify(payload);
}

function wait(ms: number) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

export async function queryFlowiseWithRetry(
  body: FlowiseRequestBody,
  options: QueryOptions = {},
  retries = 2,
  backoffMs = 400
): Promise<FlowiseResponse> {
  let attempt = 0;
  while (true) {
    try {
      return await queryFlowise(body, options);
    } catch (err: unknown) {
      // Do not retry aborted requests
      if (err instanceof Error && err.name === 'AbortError') throw err;
      attempt += 1;
      if (attempt > retries) throw err;
      const jitter = Math.floor(Math.random() * 100);
      await wait(backoffMs * attempt + jitter);
    }
  }
}
