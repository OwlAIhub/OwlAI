// React hook for real-time chat functionality with Firebase integration

import { useState, useEffect, useCallback, useRef } from "react";
import { Unsubscribe } from "firebase/firestore";
import { useAuth } from "../lib/contexts/AuthContext";
import { chatService } from "../lib/services/chatService";
import {
  ClientChatSession,
  ClientMessage,
  CreateSessionRequest,
  SendMessageRequest,
  UpdateSessionRequest,
  PaginationOptions,
  ChatError,
} from "../lib/types/chat";
import { sendMessage as sendFlowiseMessage } from "../lib/services/flowiseService";

export interface UseRealtimeChatOptions {
  sessionId?: string;
  autoLoadMessages?: boolean;
  messageLimit?: number;
}

export interface UseRealtimeChatReturn {
  // Session Management
  sessions: ClientChatSession[];
  currentSession: ClientChatSession | null;
  createSession: (data: CreateSessionRequest) => Promise<string>;
  updateSession: (
    sessionId: string,
    updates: UpdateSessionRequest,
  ) => Promise<void>;
  deleteSession: (sessionId: string) => Promise<void>;
  switchSession: (sessionId: string) => void;

  // Message Management
  messages: ClientMessage[];
  sendMessage: (content: string) => Promise<void>;
  loadMoreMessages: () => Promise<void>;

  // State
  isLoading: boolean;
  isSending: boolean;
  isTyping: boolean;
  error: ChatError | null;
  hasMoreMessages: boolean;

  // Actions
  clearError: () => void;
  regenerateMessage: (messageId: string) => Promise<void>;
  retryLastMessage: () => Promise<void>;
}

export function useRealtimeChat(
  options: UseRealtimeChatOptions = {},
): UseRealtimeChatReturn {
  const { user } = useAuth();
  const {
    sessionId: initialSessionId,
    autoLoadMessages = true,
    messageLimit = 50,
  } = options;

  // State
  const [sessions, setSessions] = useState<ClientChatSession[]>([]);
  const [currentSession, setCurrentSession] =
    useState<ClientChatSession | null>(null);
  const [messages, setMessages] = useState<ClientMessage[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isSending, setIsSending] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const [error, setError] = useState<ChatError | null>(null);
  const [hasMoreMessages, setHasMoreMessages] = useState(false);

  // Refs for cleanup and state management
  const sessionsUnsubscribe = useRef<Unsubscribe | null>(null);
  const messagesUnsubscribe = useRef<Unsubscribe | null>(null);
  const lastUserMessage = useRef<string>("");
  const retryCount = useRef<number>(0);
  const maxRetries = 3;

  // Clear error
  const clearError = useCallback(() => {
    setError(null);
  }, []);

  // Error handler
  const handleError = useCallback((error: unknown, context: string) => {
    console.error(`Chat error in ${context}:`, error);

    if (error && typeof error === "object" && "code" in error) {
      setError(error as ChatError);
    } else {
      setError({
        code: "UNKNOWN_ERROR",
        message: `An error occurred while ${context}`,
        details: { error },
      });
    }
  }, []);

  // Load sessions with real-time updates
  const loadSessions = useCallback(async () => {
    if (!user?.uid) return;

    try {
      setIsLoading(true);

      // Clean up existing subscription
      if (sessionsUnsubscribe.current) {
        sessionsUnsubscribe.current();
      }

      // Subscribe to real-time session updates
      sessionsUnsubscribe.current = chatService.subscribeToSessions(
        user.uid,
        (updatedSessions) => {
          setSessions(updatedSessions);

          // Update current session if it exists in the updated list
          if (currentSession) {
            const updatedCurrentSession = updatedSessions.find(
              (s) => s.id === currentSession.id,
            );
            if (updatedCurrentSession) {
              setCurrentSession(updatedCurrentSession);
            }
          }
        },
      );
    } catch (error) {
      handleError(error, "loading sessions");
    } finally {
      setIsLoading(false);
    }
  }, [user?.uid, currentSession, handleError]);

  // Load messages for a session with real-time updates
  const loadMessages = useCallback(
    async (sessionId: string) => {
      if (!user?.uid) return;

      try {
        setIsLoading(true);

        // Clean up existing subscription
        if (messagesUnsubscribe.current) {
          messagesUnsubscribe.current();
        }

        // Subscribe to real-time message updates
        messagesUnsubscribe.current = chatService.subscribeToMessages(
          user.uid,
          sessionId,
          (updatedMessages) => {
            setMessages(updatedMessages);
            setHasMoreMessages(updatedMessages.length >= messageLimit);
          },
        );
      } catch (error) {
        handleError(error, "loading messages");
      } finally {
        setIsLoading(false);
      }
    },
    [user?.uid, messageLimit, handleError],
  );

  // Create new session
  const createSession = useCallback(
    async (data: CreateSessionRequest): Promise<string> => {
      if (!user?.uid) {
        throw new Error("User not authenticated");
      }

      try {
        setIsLoading(true);
        const sessionId = await chatService.createChatSession(user.uid, data);

        // Set the new session as current
        const newSession = sessions.find((s) => s.id === sessionId);
        if (newSession) {
          setCurrentSession(newSession);
        }

        return sessionId;
      } catch (error) {
        handleError(error, "creating session");
        throw error;
      } finally {
        setIsLoading(false);
      }
    },
    [user?.uid, handleError, sessions],
  );

  // Update session
  const updateSession = useCallback(
    async (sessionId: string, updates: UpdateSessionRequest): Promise<void> => {
      if (!user?.uid) return;

      try {
        await chatService.updateChatSession(user.uid, sessionId, updates);
      } catch (error) {
        handleError(error, "updating session");
        throw error;
      }
    },
    [user?.uid, handleError],
  );

  // Delete session
  const deleteSession = useCallback(
    async (sessionId: string): Promise<void> => {
      if (!user?.uid) return;

      try {
        setIsLoading(true);
        await chatService.deleteChatSession(user.uid, sessionId);

        // If deleting current session, switch to another or clear
        if (currentSession?.id === sessionId) {
          const remainingSessions = sessions.filter((s) => s.id !== sessionId);
          if (remainingSessions.length > 0) {
            setCurrentSession(remainingSessions[0]);
            if (autoLoadMessages) {
              // Load messages for the new session
              const messagesResponse = await chatService.getMessages(
                user.uid,
                remainingSessions[0].id,
              );
              setMessages(messagesResponse.data);
            }
          } else {
            setCurrentSession(null);
            setMessages([]);
          }
        }
      } catch (error) {
        handleError(error, "deleting session");
        throw error;
      } finally {
        setIsLoading(false);
      }
    },
    [user?.uid, currentSession, sessions, handleError, autoLoadMessages],
  );

  // Switch to a different session
  const switchSession = useCallback(
    (sessionId: string) => {
      const session = sessions.find((s) => s.id === sessionId);
      if (session) {
        setCurrentSession(session);
        if (autoLoadMessages) {
          loadMessages(sessionId);
        }
      }
    },
    [sessions, autoLoadMessages, loadMessages],
  );

  // Send message
  const sendMessage = useCallback(
    async (content: string): Promise<void> => {
      if (!user?.uid || !currentSession || !content.trim()) return;

      try {
        setIsSending(true);
        setError(null);
        lastUserMessage.current = content;
        retryCount.current = 0;

        // Send user message to Firestore
        const messageData: SendMessageRequest = {
          sessionId: currentSession.id,
          content: content.trim(),
          type: "text",
        };

        await chatService.sendMessage(user.uid, messageData);

        // Show typing indicator
        setIsTyping(true);

        // Send to Flowise AI
        const startTime = Date.now();
        const aiResponse = await sendFlowiseMessage(content);
        const processingTime = Date.now() - startTime;

        // Add AI response to Firestore
        await chatService.addAIMessage(
          user.uid,
          currentSession.id,
          aiResponse.text || "No response received",
          {
            processingTime,
            sources: aiResponse.sourceDocuments?.map((doc) => ({
              title:
                ((doc.metadata as Record<string, unknown>)?.title as string) ||
                "Unknown",
              url: (doc.metadata as Record<string, unknown>)?.url as string,
              relevance:
                ((doc.metadata as Record<string, unknown>)?.score as number) ||
                0,
            })),
          },
        );
      } catch (error) {
        handleError(error, "sending message");

        // Mark user message as error if it exists
        try {
          const errorMessages = messages.filter(
            (m) =>
              m.sender === "user" &&
              m.content === content &&
              m.status === "sending",
          );

          if (errorMessages.length > 0) {
            await chatService.updateMessageStatus(
              user.uid,
              currentSession.id,
              errorMessages[0].id,
              "error",
            );
          }
        } catch (updateError) {
          console.error("Failed to update message status:", updateError);
        }
      } finally {
        setIsSending(false);
        setIsTyping(false);
      }
    },
    [user?.uid, currentSession, messages, handleError],
  );

  // Retry last message
  const retryLastMessage = useCallback(async (): Promise<void> => {
    if (!lastUserMessage.current || retryCount.current >= maxRetries) {
      return;
    }

    retryCount.current += 1;
    await sendMessage(lastUserMessage.current);
  }, [sendMessage]);

  // Regenerate message (placeholder for future implementation)
  const regenerateMessage = useCallback(
    async (messageId: string): Promise<void> => {
      // TODO: Implement message regeneration
      console.log("Regenerate message:", messageId);
    },
    [],
  );

  // Load more messages (pagination)
  const loadMoreMessages = useCallback(async (): Promise<void> => {
    if (!user?.uid || !currentSession || !hasMoreMessages) return;

    try {
      setIsLoading(true);

      const options: PaginationOptions = {
        limit: messageLimit,
        startAfter: messages.length > 0 ? messages[0] : undefined,
      };

      const result = await chatService.getMessages(
        user.uid,
        currentSession.id,
        options,
      );

      setMessages((prev) => [...result.data, ...prev]);
      setHasMoreMessages(result.hasMore);
    } catch (error) {
      handleError(error, "loading more messages");
    } finally {
      setIsLoading(false);
    }
  }, [
    user?.uid,
    currentSession,
    hasMoreMessages,
    messageLimit,
    messages,
    handleError,
  ]);

  // Initialize and load data
  useEffect(() => {
    if (user?.uid) {
      loadSessions();
    }

    return () => {
      // Cleanup subscriptions
      if (sessionsUnsubscribe.current) {
        sessionsUnsubscribe.current();
      }
      if (messagesUnsubscribe.current) {
        messagesUnsubscribe.current();
      }
    };
  }, [user?.uid, loadSessions]);

  // Handle initial session selection
  useEffect(() => {
    if (initialSessionId && sessions.length > 0) {
      switchSession(initialSessionId);
    } else if (!currentSession && sessions.length > 0) {
      // Auto-select first session if none selected
      switchSession(sessions[0].id);
    }
  }, [initialSessionId, sessions, currentSession, switchSession]);

  return {
    // Session Management
    sessions,
    currentSession,
    createSession,
    updateSession,
    deleteSession,
    switchSession,

    // Message Management
    messages,
    sendMessage,
    loadMoreMessages,

    // State
    isLoading,
    isSending,
    isTyping,
    error,
    hasMoreMessages,

    // Actions
    clearError,
    regenerateMessage,
    retryLastMessage,
  };
}

export default useRealtimeChat;
