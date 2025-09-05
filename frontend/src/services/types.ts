// Shared TypeScript interfaces for chat and Flowise

export type ChatRole = 'user' | 'assistant' | 'system';

export interface ChatMessage {
  id: string;
  role: ChatRole;
  content: string;
  createdAt: number; // epoch ms (IST handling at UI layer)
}

export interface FlowiseRequestBody {
  question: string;
  // Extendable for future params (e.g., history, model, temperature)
  history?: Array<{ role: ChatRole; content: string }>;
}

export interface FlowiseSuccessResponse {
  text?: string;
  response?: string;
  // Some Flowise deployments return { text }, others { response }
  [key: string]: unknown;
}

export interface FlowiseErrorResponse {
  error: string;
  message?: string;
  status?: number;
}

export type FlowiseResponse = FlowiseSuccessResponse | FlowiseErrorResponse;

export class FlowiseApiError extends Error {
  status?: number;
  constructor(message: string, status?: number) {
    super(message);
    this.name = 'FlowiseApiError';
    this.status = status;
  }
}
