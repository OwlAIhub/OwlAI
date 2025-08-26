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
  displayedText: string;
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
  const [displayedText, setDisplayedText] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const abortControllerRef = useRef<AbortController | null>(null);
  const typingIntervalRef = useRef<NodeJS.Timeout | null>(null);

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
          setChatMessages(prev =>
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
    if (typingIntervalRef.current) {
      clearInterval(typingIntervalRef.current);
      typingIntervalRef.current = null;
      setIsTyping(false);
    }
  }, []);

  // Typing animation function
  const animateTyping = useCallback(
    (fullText: string, onComplete: () => void) => {
      let currentIndex = 0;
      setDisplayedText("");
      setIsTyping(true);

      const typeNextChar = () => {
        if (currentIndex < fullText.length) {
          setDisplayedText(prev => prev + fullText[currentIndex]);
          currentIndex++;
          typingIntervalRef.current = setTimeout(typeNextChar, 5); // Much faster - 5ms per character
        } else {
          setIsTyping(false);
          onComplete();
        }
      };

      typeNextChar();
    },
    []
  );

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

    setChatMessages(prev => [...prev, userChatMessage]);
    setMessageCount(prev => prev + 1);
    setLoading(true);

    try {
      // Create new abort controller
      abortControllerRef.current = new AbortController();

      // Use Flowise API directly
      const response = await fetch(
        "http://34.47.149.141/api/v1/prediction/086aebf7-e250-41e6-b437-061f747041d2",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            question: userMessage,
          }),
          signal: abortControllerRef.current.signal,
        }
      );

      if (!response.ok) {
        throw new Error(`API request failed with status ${response.status}`);
      }

      const result = await response.json();

      // Debug: Log the raw response from Flowise
      console.log("Raw Flowise response:", result);

      // Handle different response formats from Flowise
      let botResponse = "Sorry, I couldn't generate a response.";
      if (typeof result === "string") {
        botResponse = result;
      } else if (result && typeof result === "object") {
        // Check for common Flowise response formats
        if (result.text) {
          botResponse = result.text;
        } else if (result.response) {
          botResponse = result.response;
        } else if (result.answer) {
          botResponse = result.answer;
        } else if (result.message) {
          botResponse = result.message;
        } else {
          // If no standard field found, use the first string value or stringify
          const stringValues = Object.values(result).filter(
            val => typeof val === "string"
          );
          if (stringValues.length > 0) {
            botResponse = stringValues[0] as string;
          } else {
            botResponse = JSON.stringify(result);
          }
        }
      }

      // Debug: Log the processed response
      console.log("Processed bot response:", botResponse);

      // Start typing animation
      animateTyping(botResponse, () => {
        const botMessage: ChatMessage = {
          role: "bot",
          content: botResponse,
          isMarkdown: true,
          timestamp: new Date().toISOString(),
        };

        setChatMessages(prev => [...prev, botMessage]);
        setDisplayedText("");
      });
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

      setChatMessages(prev => [...prev, errorMessage]);
    } finally {
      setLoading(false);
      abortControllerRef.current = null;
    }
  }, [message, loading, isLoggedIn, messageCount, animateTyping]);

  // Cleanup typing interval on unmount
  useEffect(() => {
    return () => {
      if (typingIntervalRef.current) {
        clearInterval(typingIntervalRef.current);
      }
    };
  }, []);

  return {
    message,
    setMessage,
    chatMessages,
    loading,
    isInterrupted,
    copiedIndex,
    messageCount,
    displayedText,
    handleSendMessage,
    handleCopyMessage: handleCopyMessage,
    handleFeedback,
    handleStopTyping,
  };
};
