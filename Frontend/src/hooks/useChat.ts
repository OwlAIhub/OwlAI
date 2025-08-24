import { useState, useCallback, useEffect, useRef } from "react";
import { ChatMessage } from "@/types";
import { logger } from "@/utils/logger";
import config from "@/config";

interface UseChatReturn {
  message: string;
  setMessage: (message: string) => void;
  chatMessages: ChatMessage[];
  loading: boolean;
  isInterrupted: boolean;
  copiedIndex: number | null;
  messageCount: number;
  handleSendMessage: () => void;
  handleCopyMessage: (index: number) => void;
  handleFeedback: (index: number, type: string, remark?: string) => void;
  handleStopTyping: () => void;
}

export const useChat = (
  sessionId: string | null,
  setSessionId: (id: string) => void,
  isLoggedIn: boolean
): UseChatReturn => {
  const [message, setMessage] = useState("");
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>(() => {
    const savedMessages = sessionId
      ? localStorage.getItem(`chatMessages-${sessionId}`)
      : null;
    return savedMessages ? JSON.parse(savedMessages) : [];
  });
  const [loading, setLoading] = useState(false);
  const [isInterrupted, setIsInterrupted] = useState(false);
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);
  const [messageCount, setMessageCount] = useState(0);
  const abortControllerRef = useRef<AbortController | null>(null);

  // Save messages to localStorage
  useEffect(() => {
    if (sessionId) {
      localStorage.setItem(
        `chatMessages-${sessionId}`,
        JSON.stringify(chatMessages)
      );
    }
  }, [chatMessages, sessionId]);

  // Handle copy message
  const handleCopyMessage = useCallback(
    (index: number) => {
      const messageToCopy = chatMessages[index];
      if (messageToCopy) {
        navigator.clipboard.writeText(messageToCopy.content);
        setCopiedIndex(index);
        setTimeout(() => setCopiedIndex(null), 2000);
      }
    },
    [chatMessages]
  );

  // Handle feedback
  const handleFeedback = useCallback(
    async (index: number, type: string, remark?: string) => {
      try {
        const messageToFeedback = chatMessages[index];
        if (!messageToFeedback) return;

        const feedbackData = {
          chat_id: sessionId,
          message_index: index,
          feedback_type: type,
          remark: remark || "",
          timestamp: new Date().toISOString(),
        };

        const response = await fetch(`${config.apiUrl}/feedback`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(feedbackData),
        });

        if (response.ok) {
          // Update message with feedback
          setChatMessages((prev) =>
            prev.map((msg, i) =>
              i === index ? { ...msg, feedback: type } : msg
            )
          );
        }
      } catch (error) {
        logger.error("Feedback error", "useChat", error);
      }
    },
    [chatMessages, sessionId]
  );

  // Handle stop typing
  const handleStopTyping = useCallback(() => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
      setIsInterrupted(true);
      setLoading(false);
    }
  }, []);

  // Handle send message
  const handleSendMessage = useCallback(async () => {
    if (!message.trim() || loading) return;

    // Check message limit for non-logged users
    if (!isLoggedIn && messageCount >= 4) {
      logger.warn("Message limit reached for non-logged user", "useChat");
      return;
    }

    setIsInterrupted(false);
    const userMessage = message.trim();
    setMessage("");

    // Add user message
    const userChatMessage: ChatMessage = {
      role: "user",
      content: userMessage,
      timestamp: new Date().toISOString(),
    };

    setChatMessages((prev) => [...prev, userChatMessage]);
    setMessageCount((prev) => prev + 1);
    setLoading(true);

    try {
      // Create new abort controller
      abortControllerRef.current = new AbortController();

      const response = await fetch(`${config.apiUrl}/ask`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          query: userMessage,
          session_id: sessionId,
        }),
        signal: abortControllerRef.current.signal,
      });

      if (!response.ok) {
        throw new Error(`API request failed with status ${response.status}`);
      }

      const data = await response.json();
      const botMessage: ChatMessage = {
        role: "bot",
        content: data.response || "Sorry, I couldn't generate a response.",
        isMarkdown: true,
        timestamp: new Date().toISOString(),
      };

      setChatMessages((prev) => [...prev, botMessage]);
    } catch (error) {
      if (error instanceof Error && error.name === "AbortError") {
        // Request was aborted, don't show error
        return;
      }

      logger.error("Error sending message", "useChat", error);

      const errorMessage: ChatMessage = {
        role: "bot",
        content:
          "I'm having trouble connecting to the server. Please try again later.",
        timestamp: new Date().toISOString(),
      };

      setChatMessages((prev) => [...prev, errorMessage]);
    } finally {
      setLoading(false);
      abortControllerRef.current = null;
    }
  }, [message, loading, isLoggedIn, messageCount, sessionId]);

  return {
    message,
    setMessage,
    chatMessages,
    loading,
    isInterrupted,
    copiedIndex,
    messageCount,
    handleSendMessage,
    handleCopyMessage: handleCopyMessage,
    handleFeedback,
    handleStopTyping,
  };
};
