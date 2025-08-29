import { useCallback, useEffect } from "react";
import { ChatMessage } from "@/types";
import { api } from "@/services/api";
import { storage } from "@/utils";
import { domUtils } from "@/shared/utils";
import { STORAGE_KEYS, MESSAGE_LIMITS, ANIMATION_DURATION } from "@/constants";
import { flowiseService } from "../api/services/flowise.service";

/**
 * Chat handlers hook
 * Contains all event handlers for chat functionality
 */
export const useChatHandlers = (
  sessionId: string | null,
  message: string,
  setMessage: (message: string) => void,
  messageCount: number,
  setMessageCount: (count: number) => void,
  setLoading: (loading: boolean) => void,
  setResponse: (response: string) => void,
  setDisplayedText: (text: string) => void,
  setIsInterrupted: (interrupted: boolean) => void,
  chatMessages: ChatMessage[],
  setChatMessages: (messages: ChatMessage[]) => void,
  displayedText: string,
  response: string,
  isLoggedIn: boolean,
  _showModal: boolean,
  setShowModal: (show: boolean) => void,
  _isModalOpen: boolean,
  setIsModalOpen: (open: boolean) => void,
  selectedIndex: number | null,
  setSelectedIndex: (index: number | null) => void,
  customRemark: string,
  setCustomRemark: (remark: string) => void,
  _copiedIndex: number | null,
  setCopiedIndex: (index: number | null) => void,
  user: any
) => {
  // Message sending handler with optimizations
  const handleSendMessage = useCallback(async () => {
    setIsInterrupted(false);
    if (!message.trim()) return;

    const nextCount = messageCount + 1;

    if (!isLoggedIn && nextCount > MESSAGE_LIMITS.ANONYMOUS_MAX) {
      setShowModal(true);
      return;
    }

    if (!isLoggedIn) {
      setMessageCount(nextCount);
    }

    const userMessage: ChatMessage = {
      id: `msg_${Date.now()}_user`,
      role: "user",
      content: message,
      timestamp: new Date(),
      conversationId: sessionId || "default",
    };
    setChatMessages([...chatMessages, userMessage]);

    storage.remove(STORAGE_KEYS.PRESET_QUERY);

    setMessage("");
    setLoading(true);

    // Start typing animation immediately for better UX
    setResponse("");
    setDisplayedText("");

    try {
      // Parallel execution: Store user message while getting AI response
      const [, result] = await Promise.all([
        // Store user message in background (don't wait for completion)
        new Promise(resolve => {
          setTimeout(() => resolve(null), 0); // Async execution
        }),
        // Get AI response (priority operation)
        flowiseService.sendMessage(
          userMessage.content,
          sessionId || "default",
          user?.id || "anonymous"
        ),
      ]);

      const botResponse =
        result.text || "Sorry, I couldn't generate a response.";

      // Start streaming the response immediately
      setResponse(botResponse);
      setDisplayedText("");
    } catch (err) {
      console.error("Error sending message:", err);
      const errorMessage =
        err instanceof Error && err.message.includes("timeout")
          ? "The request is taking longer than expected. Please try again."
          : "I'm having trouble connecting to the server. Please try again later.";

      const botMessage: ChatMessage = {
        id: `msg_${Date.now()}_assistant`,
        role: "assistant",
        content: errorMessage,
        timestamp: new Date(),
        conversationId: sessionId || "default",
      };
      setChatMessages([...chatMessages, botMessage]);
    } finally {
      setLoading(false);
    }
  }, [
    message,
    messageCount,
    isLoggedIn,
    sessionId,
    setMessage,
    setMessageCount,
    setLoading,
    setResponse,
    setDisplayedText,
    setIsInterrupted,
    setChatMessages,
    setShowModal,
  ]);

  // Typing animation effect
  useEffect(() => {
    if (!response) return;

    let i = 0;
    setDisplayedText("");
    const interval = setInterval(() => {
      if (i < response.length) {
        setDisplayedText(displayedText + response[i]);
        i++;
      } else {
        clearInterval(interval);
        const assistantMessage: ChatMessage = {
          id: `msg_${Date.now()}_assistant`,
          role: "assistant",
          content: response,
          timestamp: new Date(),
          conversationId: sessionId || "default",
        };
        setChatMessages([...chatMessages, assistantMessage]);

        setTimeout(() => {
          setDisplayedText("");
          setResponse("");
        }, 200);
      }
    }, ANIMATION_DURATION.TYPING);

    return () => clearInterval(interval);
  }, [response, setDisplayedText, setChatMessages, setResponse, sessionId]);

  // Feedback handling
  const handleFeedback = useCallback(
    (index: number, type: "like" | "dislike") => {
      if (type === "dislike") {
        setSelectedIndex(index);
        setIsModalOpen(true);
      } else {
        sendFeedback(index, type, "Satisfied with the response");
      }
    },
    [setSelectedIndex, setIsModalOpen]
  );

  const sendFeedback = useCallback(
    async (index: number, type: "like" | "dislike", remarks: string) => {
      if (!sessionId || !user?.id) return;

      const score = type === "like" ? 1 : 0;

      try {
        await api.feedback.submitFeedback({
          chat_id: sessionId,
          user_id: user.id,
          usefulness_score: score,
          content_quality_score: score,
          msg: remarks,
          flagged_reason: null,
        });

        const updatedMessages = [...chatMessages];
        updatedMessages[index].feedback = type;
        setChatMessages(updatedMessages);
      } catch (error) {
        console.error("Feedback error:", error);
      }
    },
    [sessionId, user, chatMessages, setChatMessages]
  );

  const handleCopy = useCallback(
    async (text: string, index: number) => {
      const success = await domUtils.copyToClipboard(text);
      if (success) {
        setCopiedIndex(index);
        setTimeout(() => setCopiedIndex(null), 5000);
      }
    },
    [setCopiedIndex]
  );

  const handleStopTyping = useCallback(() => {
    setIsInterrupted(true);
    setLoading(false);
    if (displayedText) {
      const assistantMessage: ChatMessage = {
        id: `msg_${Date.now()}_assistant`,
        role: "assistant",
        content: displayedText,
        timestamp: new Date(),
        conversationId: sessionId || "default",
      };
      setChatMessages([...chatMessages, assistantMessage]);
      setDisplayedText("");
    }
  }, [
    setIsInterrupted,
    setLoading,
    displayedText,
    setChatMessages,
    setDisplayedText,
    sessionId,
  ]);

  const handleFeedbackSubmit = useCallback(() => {
    if (selectedIndex !== null) {
      sendFeedback(
        selectedIndex,
        "dislike",
        customRemark || "Not satisfied with the response"
      );
      setIsModalOpen(false);
      setCustomRemark("");
      setSelectedIndex(null);
    }
  }, [
    selectedIndex,
    sendFeedback,
    customRemark,
    setIsModalOpen,
    setCustomRemark,
    setSelectedIndex,
  ]);

  const handlePromptClick = useCallback(
    (prompt: string) => {
      setMessage(prompt);
    },
    [setMessage]
  );

  return {
    handleSendMessage,
    handleFeedback,
    handleCopy,
    handleStopTyping,
    handleFeedbackSubmit,
    handlePromptClick,
  };
};
