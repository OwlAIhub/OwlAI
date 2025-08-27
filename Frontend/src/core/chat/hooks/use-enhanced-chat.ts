import { useState, useCallback, useRef, useEffect } from "react";
import { ChatMessage } from "@/types";
import { streamingService } from "../services/streaming.service";
import { messageService } from "../../database/services/message.service";
import { conversationService } from "../../database/services/conversation.service";
import { logger } from "../../../shared/utils/logger";
import { toast } from "react-toastify";

interface UseEnhancedChatProps {
  sessionId: string | null;
  userId: string | null;
  darkMode: boolean;
}

interface UseEnhancedChatReturn {
  // State
  messages: ChatMessage[];
  loading: boolean;
  isStreaming: boolean;
  streamingContent: string;
  copiedIndex: number | null;

  // Actions
  sendMessage: (content: string) => Promise<void>;
  stopStreaming: () => void;
  copyMessage: (index: number) => void;
  handleFeedback: (index: number, type: string, remark?: string) => void;
  regenerateResponse: (index: number) => void;
  editMessage: (index: number, content: string) => void;
  clearMessages: () => void;

  // Utilities
  canSendMessage: boolean;
  messageCount: number;
}

export const useEnhancedChat = ({
  sessionId,
  userId,
  darkMode,
}: UseEnhancedChatProps): UseEnhancedChatReturn => {
  // State
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [loading, setLoading] = useState(false);
  const [isStreaming, setIsStreaming] = useState(false);
  const [streamingContent, setStreamingContent] = useState("");
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);
  const [messageCount, setMessageCount] = useState(0);

  // Refs
  const conversationIdRef = useRef<string | null>(null);
  const abortControllerRef = useRef<AbortController | null>(null);

  // Load existing messages when session changes
  useEffect(() => {
    if (sessionId) {
      loadMessages();
    }
  }, [sessionId]);

  // Load messages from database
  const loadMessages = useCallback(async () => {
    if (!sessionId) return;

    try {
      setLoading(true);

      // Get conversation for this session
      const conversations = await conversationService.getUserConversations(
        userId || "anonymous"
      );
      const conversation = conversations.data.find(
        conv => conv.session_id === sessionId
      );

      if (conversation) {
        conversationIdRef.current = conversation.id;

        // Load messages for this conversation
        const messagesResult = await messageService.getConversationMessages(
          conversation.id
        );
        setMessages(messagesResult.data);
        setMessageCount(messagesResult.data.length);
      }
    } catch (error) {
      logger.error("Failed to load messages", "useEnhancedChat", error);
      toast.error("Failed to load chat history");
    } finally {
      setLoading(false);
    }
  }, [sessionId, userId]);

  // Send message with streaming
  const sendMessage = useCallback(
    async (content: string) => {
      if (!content.trim() || !sessionId || !userId) return;

      const userMessage: ChatMessage = {
        role: "user",
        content: content.trim(),
        isMarkdown: true,
        feedback: null,
        timestamp: new Date().toISOString(),
      };

      // Add user message immediately
      setMessages(prev => [...prev, userMessage]);
      setMessageCount(prev => prev + 1);
      setLoading(true);

      try {
        // Save user message to database
        if (conversationIdRef.current) {
          await messageService.sendMessage({
            conversation_id: conversationIdRef.current,
            user_id: userId,
            content: userMessage.content,
            role: "user",
            type: "text",
          });
        }

        // Start streaming response
        setIsStreaming(true);
        setStreamingContent("");

        await streamingService.startStreaming(
          {
            question: content,
            conversationId: sessionId,
            userId: userId,
          },
          {
            onStart: () => {
              logger.info("Streaming started", "useEnhancedChat");
            },
            onChunk: (chunk: string) => {
              setStreamingContent(chunk);
            },
            onComplete: async (fullResponse: string) => {
              setIsStreaming(false);
              setStreamingContent("");
              setLoading(false);

              const botMessage: ChatMessage = {
                role: "bot",
                content: fullResponse,
                isMarkdown: true,
                feedback: null,
                timestamp: new Date().toISOString(),
              };

              setMessages(prev => [...prev, botMessage]);
              setMessageCount(prev => prev + 1);

              // Save bot message to database
              if (conversationIdRef.current) {
                try {
                  await messageService.sendMessage({
                    conversation_id: conversationIdRef.current,
                    user_id: userId,
                    content: botMessage.content,
                    role: "bot",
                    type: "text",
                  });
                } catch (error) {
                  logger.error(
                    "Failed to save bot message",
                    "useEnhancedChat",
                    error
                  );
                }
              }

              logger.info("Streaming completed", "useEnhancedChat", {
                responseLength: fullResponse.length,
              });
            },
            onError: (error: Error) => {
              setIsStreaming(false);
              setStreamingContent("");
              setLoading(false);

              const errorMessage: ChatMessage = {
                role: "bot",
                content: `Sorry, I encountered an error: ${error.message}. Please try again.`,
                isMarkdown: true,
                feedback: null,
                timestamp: new Date().toISOString(),
                type: "error",
              };

              setMessages(prev => [...prev, errorMessage]);
              setMessageCount(prev => prev + 1);

              logger.error("Streaming error", "useEnhancedChat", error);
              toast.error("Failed to get response. Please try again.");
            },
            timeout: 30000, // 30 seconds
          }
        );
      } catch (error) {
        setIsStreaming(false);
        setStreamingContent("");
        setLoading(false);

        const errorMessage: ChatMessage = {
          role: "bot",
          content:
            "Sorry, I'm having trouble connecting. Please try again later.",
          isMarkdown: true,
          feedback: null,
          timestamp: new Date().toISOString(),
          type: "error",
        };

        setMessages(prev => [...prev, errorMessage]);
        setMessageCount(prev => prev + 1);

        logger.error("Failed to send message", "useEnhancedChat", error);
        toast.error("Failed to send message");
      }
    },
    [sessionId, userId]
  );

  // Stop streaming
  const stopStreaming = useCallback(() => {
    streamingService.stopStreaming();
    setIsStreaming(false);
    setStreamingContent("");
    setLoading(false);
  }, []);

  // Copy message
  const copyMessage = useCallback(
    (index: number) => {
      const message = messages[index];
      if (message) {
        navigator.clipboard.writeText(message.content);
        setCopiedIndex(index);
        setTimeout(() => setCopiedIndex(null), 2000);
        toast.success("Message copied to clipboard");
      }
    },
    [messages]
  );

  // Handle feedback
  const handleFeedback = useCallback(
    async (index: number, type: string, remark?: string) => {
      const message = messages[index];
      if (!message) return;

      try {
        // Update message feedback
        const updatedMessages = [...messages];
        updatedMessages[index] = {
          ...message,
          feedback: type as "like" | "dislike",
        };
        setMessages(updatedMessages);

        // Save feedback to database (if you have a feedback service)
        // await feedbackService.submitFeedback({
        //   messageId: message.id,
        //   userId: userId,
        //   type: type,
        //   remark: remark,
        // });

        toast.success("Feedback submitted successfully");
        logger.info("Feedback submitted", "useEnhancedChat", { type, remark });
      } catch (error) {
        logger.error("Failed to submit feedback", "useEnhancedChat", error);
        toast.error("Failed to submit feedback");
      }
    },
    [messages, userId]
  );

  // Regenerate response
  const regenerateResponse = useCallback(
    async (index: number) => {
      const message = messages[index];
      if (!message || message.role !== "bot") return;

      // Find the user message that preceded this bot response
      const userMessageIndex = index - 1;
      const userMessage = messages[userMessageIndex];

      if (userMessage && userMessage.role === "user") {
        // Remove the current bot response
        setMessages(prev => prev.slice(0, index));
        setMessageCount(prev => prev - 1);

        // Send the user message again
        await sendMessage(userMessage.content);
      }
    },
    [messages, sendMessage]
  );

  // Edit message
  const editMessage = useCallback(
    async (index: number, content: string) => {
      const message = messages[index];
      if (!message || message.role !== "user") return;

      try {
        // Update message in state
        const updatedMessages = [...messages];
        updatedMessages[index] = {
          ...message,
          content: content,
        };
        setMessages(updatedMessages);

        // Update message in database
        if (message.id) {
          await messageService.updateMessage(message.id, {
            content: content,
          });
        }

        toast.success("Message updated");
        logger.info("Message edited", "useEnhancedChat", { index, content });
      } catch (error) {
        logger.error("Failed to edit message", "useEnhancedChat", error);
        toast.error("Failed to edit message");
      }
    },
    [messages]
  );

  // Clear messages
  const clearMessages = useCallback(() => {
    setMessages([]);
    setMessageCount(0);
    setStreamingContent("");
    setIsStreaming(false);
    setLoading(false);
    streamingService.reset();
  }, []);

  // Check if can send message
  const canSendMessage = !loading && !isStreaming && !!sessionId && !!userId;

  return {
    // State
    messages,
    loading,
    isStreaming,
    streamingContent,
    copiedIndex,

    // Actions
    sendMessage,
    stopStreaming,
    copyMessage,
    handleFeedback,
    regenerateResponse,
    editMessage,
    clearMessages,

    // Utilities
    canSendMessage,
    messageCount,
  };
};
