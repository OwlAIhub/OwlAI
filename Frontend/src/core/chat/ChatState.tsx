import { useState } from "react";
import { ChatMessage, User } from "@/types";
import { storage } from "@/utils";
import { STORAGE_KEYS } from "@/constants";

/**
 * Chat state management hook
 * Centralizes all chat-related state
 */
export const useChatState = (sessionId: string | null) => {
  // Message state
  const [message, setMessage] = useState("");
  const [messageCount, setMessageCount] = useState(0);
  const [showModal, setShowModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const [response, setResponse] = useState("");
  const [displayedText, setDisplayedText] = useState("");
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);
  const [isInterrupted, setIsInterrupted] = useState(false);

  // Modal state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
  const [customRemark, setCustomRemark] = useState("");

  // Window state
  const [windowSize, setWindowSize] = useState({
    width: window.innerWidth,
    height: window.innerHeight,
  });

  // Loading state
  const [isLoading, setIsLoading] = useState(true);
  const [isHistoryLoaded, setIsHistoryLoaded] = useState(false);

  // Chat state
  const [currentChat, setCurrentChat] = useState<{ id: string } | null>(() => {
    const savedChat = storage.get<{ id: string }>(STORAGE_KEYS.SELECTED_CHAT);
    return savedChat || null;
  });

  const [chatMessages, setChatMessages] = useState<ChatMessage[]>(() => {
    const savedMessages = storage.get<ChatMessage[]>(
      `chatMessages-${sessionId}`
    );
    return savedMessages || [];
  });

  // User data
  const user = storage.get<User>(STORAGE_KEYS.USER);
  const isLoggedIn = !!user;
  const token = storage.get(STORAGE_KEYS.USER_PROFILE);
  const anonymousUserId = storage.get(STORAGE_KEYS.ANONYMOUS_USER_ID);
  const anonymousSessionId = storage.get(STORAGE_KEYS.ANONYMOUS_SESSION_ID);

  return {
    // Message state
    message,
    setMessage,
    messageCount,
    setMessageCount,
    showModal,
    setShowModal,
    loading,
    setLoading,
    response,
    setResponse,
    displayedText,
    setDisplayedText,
    copiedIndex,
    setCopiedIndex,
    isInterrupted,
    setIsInterrupted,

    // Modal state
    isModalOpen,
    setIsModalOpen,
    selectedIndex,
    setSelectedIndex,
    customRemark,
    setCustomRemark,

    // Window state
    windowSize,
    setWindowSize,

    // Loading state
    isLoading,
    setIsLoading,
    isHistoryLoaded,
    setIsHistoryLoaded,

    // Chat state
    currentChat,
    setCurrentChat,
    chatMessages,
    setChatMessages,

    // User data
    user,
    isLoggedIn,
    token,
    anonymousUserId,
    anonymousSessionId,
  };
};
