import React, { useEffect, useCallback } from "react";
import { useLocation } from "react-router-dom";
import { ChatMessage } from "@/types";
import { api } from "@/services/api";
import { storage } from "@/utils";
import { domUtils } from "@/shared/utils";
import { STORAGE_KEYS, MESSAGE_LIMITS } from "@/constants";

/**
 * Chat effects hook
 * Contains all useEffect hooks for chat functionality
 */
export const useChatEffects = (
  sessionId: string | null,
  chatMessages: ChatMessage[],
  setChatMessages: (messages: ChatMessage[]) => void,
  setCurrentChat: (chat: { id: string } | null) => void,
  setWindowSize: (size: { width: number; height: number }) => void,
  setIsLoading: (loading: boolean) => void,
  setIsHistoryLoaded: (loaded: boolean) => void,
  setMessage: (message: string) => void,
  setMessageCount: (count: number) => void,
  setResponse: (response: string) => void,
  setDisplayedText: (text: string) => void,
  setLoading: (loading: boolean) => void,
  messagesEndRef: React.RefObject<HTMLDivElement>,
  displayedText: string,
  currentChat: { id: string } | null,
  isHistoryLoaded: boolean,
  anonymousSessionId: string | null,
  anonymousUserId: string | null,
  setSesssionId: (id: string | null) => void
) => {
  const location = useLocation();

  // Persist chat messages to storage
  useEffect(() => {
    storage.set(`chatMessages-${sessionId}`, chatMessages);
  }, [chatMessages, sessionId]);

  // Load saved chat on mount
  useEffect(() => {
    const savedChat = storage.get<{ id: string }>(STORAGE_KEYS.SELECTED_CHAT);
    if (savedChat && typeof savedChat.id === "string") {
      setCurrentChat(savedChat);
    }
  }, [setCurrentChat]);

  // Handle storage changes
  useEffect(() => {
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === STORAGE_KEYS.SELECTED_CHAT) {
        setCurrentChat(e.newValue ? JSON.parse(e.newValue) : null);
      }
    };

    window.addEventListener("storage", handleStorageChange);
    return () => window.removeEventListener("storage", handleStorageChange);
  }, [setCurrentChat]);

  // Handle new session events
  useEffect(() => {
    const handleNewSession = () => {
      setChatMessages([]);
      setMessageCount(0);
      setResponse("");
      setDisplayedText("");
      setLoading(false);
    };

    window.addEventListener("newSessionCreated", handleNewSession);
    return () =>
      window.removeEventListener("newSessionCreated", handleNewSession);
  }, [
    setChatMessages,
    setMessageCount,
    setResponse,
    setDisplayedText,
    setLoading,
  ]);

  // Load preset query
  useEffect(() => {
    const presetQuery = storage.get<string>(STORAGE_KEYS.PRESET_QUERY);
    if (presetQuery) {
      setMessage(presetQuery);
    }
  }, [setMessage]);

  // Handle session ID changes
  useEffect(() => {
    const savedSessionId = storage.get<string>(STORAGE_KEYS.SESSION_ID);
    if (savedSessionId && savedSessionId !== sessionId) {
      const savedChats = storage.get<ChatMessage[]>(
        `chatMessages-${savedSessionId}`
      );
      setChatMessages(savedChats || []);
    }
  }, [sessionId, setChatMessages]);

  // Auto-scroll to bottom
  useEffect(() => {
    if (messagesEndRef.current) {
      domUtils.scrollToElement(messagesEndRef.current);
    }
  }, [chatMessages, displayedText, messagesEndRef]);

  // Handle window resize
  useEffect(() => {
    const handleResize = () => {
      setWindowSize({
        width: window.innerWidth,
        height: window.innerHeight,
      });
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [setWindowSize]);

  // Chat history fetching
  const processChatHistory = useCallback(
    (messages: ChatMessage[], chatId?: string) => {
      if (!messages || !Array.isArray(messages)) return;

      const sortedMessages = messages.sort(
        (a, b) =>
          new Date(a.timestamp || 0).getTime() -
          new Date(b.timestamp || 0).getTime()
      );

      setChatMessages(sortedMessages);

      // Use the conversationId from the first message if available, or the provided chatId
      const conversationId =
        sortedMessages[0]?.conversationId || chatId || currentChat?.id;
      if (conversationId) {
        storage.set(STORAGE_KEYS.SESSION_ID, conversationId);
        setSesssionId(conversationId);
        storage.set(`chatMessages-${conversationId}`, sortedMessages);
      }
    },
    [setChatMessages, setSesssionId, currentChat?.id]
  );

  const fetchChatHistory = useCallback(
    async (chatId: string) => {
      if (chatMessages.some(msg => msg.conversationId === chatId)) {
        return;
      }

      try {
        const cacheKey = `chatHistory-${chatId}`;
        const cachedData = storage.get<any>(cacheKey);

        if (cachedData) {
          const { timestamp, data } = cachedData;
          if (Date.now() - timestamp < MESSAGE_LIMITS.CACHE_DURATION) {
            processChatHistory(data, chatId);
            return;
          }
        }

        const response = await api.chat.getMessages(chatId, 1, 50);

        if (response.success && response.data) {
          storage.set(cacheKey, {
            timestamp: Date.now(),
            data: response.data,
          });
          processChatHistory(response.data, chatId);
        }
      } catch (error) {
        console.error("Error fetching chat history:", error);
      } finally {
        setIsHistoryLoaded(true);
      }
    },
    [chatMessages, setIsHistoryLoaded, processChatHistory]
  );

  // Fetch chat history when current chat changes
  useEffect(() => {
    if (!currentChat?.id || isHistoryLoaded) return;

    const timer = setTimeout(() => {
      if (typeof currentChat.id === "string") {
        fetchChatHistory(currentChat.id);
      }
    }, 300);

    return () => clearTimeout(timer);
  }, [currentChat?.id, location.pathname, fetchChatHistory, isHistoryLoaded]);

  // Loading state management
  useEffect(() => {
    const hasData =
      sessionId ||
      currentChat ||
      storage.get(STORAGE_KEYS.SESSION_ID) ||
      storage.get(STORAGE_KEYS.SELECTED_CHAT) ||
      anonymousSessionId ||
      anonymousUserId;

    if (!hasData) {
      setIsLoading(false);
    } else {
      const timer = setTimeout(() => setIsLoading(false), 1500);
      return () => clearTimeout(timer);
    }
  }, [
    sessionId,
    currentChat,
    anonymousSessionId,
    anonymousUserId,
    setIsLoading,
  ]);

  return {
    fetchChatHistory,
    processChatHistory,
  };
};
