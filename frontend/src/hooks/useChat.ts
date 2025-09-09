"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { useAuth } from "../lib/contexts/AuthContext";
import {
    FlowiseError,
    sendMessage,
    sendMessageStream
} from "../lib/services/flowiseService";

export interface ChatMessage {
  id: string;
  content: string;
  sender: "user" | "ai";
  timestamp: Date;
  status: "sending" | "sent" | "error";
  metadata?: {
    chatId?: string;
    sourceDocuments?: Record<string, unknown>[];
    processingTime?: number;
  };
}

export interface UseChatOptions {
  initialMessages?: ChatMessage[];
  onError?: (error: FlowiseError) => void;
  onMessageSent?: (message: ChatMessage) => void;
  onMessageReceived?: (message: ChatMessage) => void;
  maxRetries?: number;
  useStreaming?: boolean;
  useCache?: boolean;
}

export interface UseChatReturn {
  messages: ChatMessage[];
  isLoading: boolean;
  error: string | null;
  sendMessage: (content: string) => Promise<void>;
  regenerateMessage: (messageId: string) => Promise<void>;
  clearMessages: () => void;
  retryLastMessage: () => Promise<void>;
  isTyping: boolean;
}

export function useChat(options: UseChatOptions = {}): UseChatReturn {
  const {
    initialMessages = [],
    onError,
    onMessageSent,
    onMessageReceived,
    maxRetries = 2, // Reduced from 3 for faster failure recovery
    useStreaming = true, // Enable streaming by default for better UX
    useCache = true, // Enable caching by default
  } = options;

  useAuth();
  const [messages, setMessages] = useState<ChatMessage[]>(initialMessages);
  const [isLoading, setIsLoading] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [chatId, setChatId] = useState<string | null>(null);
  const retryCountRef = useRef<number>(0);
  const lastUserMessageRef = useRef<string>("");

  // Generate unique message ID
  const generateMessageId = () => {
    return `msg_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  };

  // Add message to the chat
  const addMessage = useCallback((message: Omit<ChatMessage, "id">) => {
    const newMessage: ChatMessage = {
      ...message,
      id: generateMessageId(),
    };

    setMessages((prev) => [...prev, newMessage]);
    return newMessage;
  }, []);

  // Update message status
  const updateMessage = useCallback(
    (messageId: string, updates: Partial<ChatMessage>) => {
      setMessages((prev) =>
        prev.map((msg) =>
          msg.id === messageId ? { ...msg, ...updates } : msg,
        ),
      );
    },
    [],
  );

  // Remove message
  const removeMessage = useCallback((messageId: string) => {
    setMessages((prev) => prev.filter((msg) => msg.id !== messageId));
  }, []);

  // Send message to Flowise API with streaming support
  const handleSendMessage = useCallback(
    async (content: string): Promise<void> => {
      if (!content.trim() || isLoading) return;

      setError(null);
      setIsLoading(true);
      lastUserMessageRef.current = content;

      // Add user message
      const userMessage = addMessage({
        content: content.trim(),
        sender: "user",
        timestamp: new Date(),
        status: "sending",
      });

      onMessageSent?.(userMessage);

      try {
        // Update user message status to sent
        updateMessage(userMessage.id, { status: "sent" });

        // Show typing indicator
        setIsTyping(true);

        const startTime = Date.now();
        let aiMessage: ChatMessage | null = null;

        if (useStreaming) {
          // Use streaming for real-time response
          try {
            const streamResponse = await sendMessageStream(
              content,
              chatId || undefined,
              (chunk: string) => {
                // Update AI message with streaming content
                if (!aiMessage) {
                  aiMessage = addMessage({
                    content: chunk,
                    sender: "ai",
                    timestamp: new Date(),
                    status: "sent",
                    metadata: {
                      chatId: streamResponse.chatId,
                      processingTime: Date.now() - startTime,
                    },
                  });
                  onMessageReceived?.(aiMessage);
                } else {
                  // Update existing message with new chunk
                  updateMessage(aiMessage.id, {
                    content: aiMessage.content + chunk,
                    metadata: {
                      ...aiMessage.metadata,
                      processingTime: Date.now() - startTime,
                    },
                  });
                }
              }
            );

            // Update chat ID if provided
            if (streamResponse.chatId && streamResponse.chatId !== chatId) {
              setChatId(streamResponse.chatId);
            }

            // Final update with complete response
            if (aiMessage && streamResponse.text) {
              updateMessage(aiMessage.id, {
                content: streamResponse.text,
                metadata: {
                  ...aiMessage.metadata,
                  processingTime: Date.now() - startTime,
                },
              });
            }
          } catch (streamError) {
            console.warn("Streaming failed, falling back to regular request:", streamError);
            // Fallback to regular request
            const response = await sendMessage(content, chatId || undefined, useCache);
            const processingTime = Date.now() - startTime;

            if (response.chatId && response.chatId !== chatId) {
              setChatId(response.chatId);
            }

            if (response.text) {
              aiMessage = addMessage({
                content: response.text,
                sender: "ai",
                timestamp: new Date(),
                status: "sent",
                metadata: {
                  chatId: response.chatId,
                  sourceDocuments: response.sourceDocuments,
                  processingTime,
                },
              });
              onMessageReceived?.(aiMessage);
            }
          }
        } else {
          // Use regular request
          const response = await sendMessage(content, chatId || undefined, useCache);
          const processingTime = Date.now() - startTime;

          if (response.chatId && response.chatId !== chatId) {
            setChatId(response.chatId);
          }

          if (response.text) {
            aiMessage = addMessage({
              content: response.text,
              sender: "ai",
              timestamp: new Date(),
              status: "sent",
              metadata: {
                chatId: response.chatId,
                sourceDocuments: response.sourceDocuments,
                processingTime,
              },
            });
            onMessageReceived?.(aiMessage);
          }
        }

        if (!aiMessage || !aiMessage.content) {
          throw new Error("No response text received from AI");
        }

        // Reset retry count on success
        retryCountRef.current = 0;
      } catch (err) {
        console.error("Chat error:", err);

        const errorMessage =
          err instanceof FlowiseError
            ? err.message
            : err instanceof Error
              ? err.message
              : "Failed to send message";

        // Update user message status to error
        updateMessage(userMessage.id, { status: "error" });

        setError(errorMessage);
        onError?.(err as FlowiseError);

        // Auto-retry logic with faster backoff
        if (retryCountRef.current < maxRetries) {
          retryCountRef.current++;
          const delay = Math.min(500 * retryCountRef.current, 2000); // Faster retry: 500ms, 1s, 2s max
          setTimeout(() => {
            handleSendMessage(content);
          }, delay);
        }
      } finally {
        setIsLoading(false);
        setIsTyping(false);
      }
    },
    [
      isLoading,
      chatId,
      addMessage,
      updateMessage,
      onMessageSent,
      onMessageReceived,
      onError,
      maxRetries,
      useStreaming,
      useCache,
    ],
  );

  // Regenerate AI message
  const regenerateMessage = useCallback(
    async (messageId: string): Promise<void> => {
      const messageIndex = messages.findIndex((msg) => msg.id === messageId);
      if (messageIndex === -1) return;

      // Find the user message that prompted this AI response
      let userMessageContent = "";
      for (let i = messageIndex - 1; i >= 0; i--) {
        if (messages[i].sender === "user") {
          userMessageContent = messages[i].content;
          break;
        }
      }

      if (!userMessageContent) return;

      // Remove the AI message
      removeMessage(messageId);

      // Resend the user message
      await handleSendMessage(userMessageContent);
    },
    [messages, removeMessage, handleSendMessage],
  );

  // Retry last message
  const retryLastMessage = useCallback(async (): Promise<void> => {
    if (lastUserMessageRef.current) {
      await handleSendMessage(lastUserMessageRef.current);
    }
  }, [handleSendMessage]);

  // Clear all messages
  const clearMessages = useCallback(() => {
    setMessages([]);
    setError(null);
    setChatId(null);
    retryCountRef.current = 0;
    lastUserMessageRef.current = "";
  }, []);

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    const scrollToBottom = () => {
      const chatContainer = document.getElementById("messages-container");
      if (chatContainer) {
        chatContainer.scrollTo({
          top: chatContainer.scrollHeight,
          behavior: "smooth",
        });
      }
    };

    // Scroll after a short delay to ensure DOM is updated
    const timeoutId = setTimeout(scrollToBottom, 150);
    return () => clearTimeout(timeoutId);
  }, [messages]);

  return {
    messages,
    isLoading,
    error,
    sendMessage: handleSendMessage,
    regenerateMessage,
    clearMessages,
    retryLastMessage,
    isTyping,
  };
}
