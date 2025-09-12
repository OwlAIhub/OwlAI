import { ChatHistory, ChatMessage, ChatSession } from "@/lib/types/chat";

export interface BatchOperation {
  type: 'create' | 'update' | 'delete';
  collection: string;
  id: string;
  data?: Record<string, unknown>;
  timestamp: number;
}

export interface ServiceMetrics {
  totalOperations: number;
  cacheHitRate: number;
  averageResponseTime: number;
  batchedOperations: number;
  errorRate: number;
}

export interface ChatServiceConfig {
  BATCH_SIZE: number;
  BATCH_TIMEOUT: number;
  CACHE_TTL: number;
}

export type { ChatHistory, ChatMessage, ChatSession };