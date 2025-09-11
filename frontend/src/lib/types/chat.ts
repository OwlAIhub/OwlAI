export interface ChatMessage {
  id: string;
  content: string;
  sender: "user" | "ai";
  timestamp: Date;
  status: "sending" | "sent" | "error";
  tokens?: number;
  model?: string;
}

export interface ChatSession {
  id: string;
  userId: string;
  title: string;
  createdAt: Date;
  updatedAt: Date;
  messageCount: number;
  lastMessage?: {
    content: string;
    timestamp: Date;
  };
  metadata?: {
    subject?: string;
    tags?: string[];
    isStarred?: boolean;
    model?: string;
  };
}

export interface ChatHistory {
  sessionId: string;
  messages: ChatMessage[];
  totalMessages: number;
  hasMore: boolean;
}

export type ChatEventType =
  | "session_created"
  | "session_updated"
  | "message_added"
  | "message_updated"
  | "session_deleted";

export interface ChatEvent {
  type: ChatEventType;
  sessionId: string;
  userId: string;
  timestamp: Date;
  data: unknown;
}
