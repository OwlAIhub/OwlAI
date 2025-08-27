import React, { useEffect, useRef, useState, useCallback } from "react";
import { useLocation } from "react-router-dom";
import { MainContentProps, ChatMessage, User } from "@/types";
import { api } from "@/services/api";
import { storage } from "@/utils";
import { domUtils } from "@/shared/utils";
import { STORAGE_KEYS, MESSAGE_LIMITS, ANIMATION_DURATION } from "@/constants";
import OwlLoader from "@/shared/components/ui/owl-loader";
import { ChatMessages, WelcomeScreen, MessageInput, FeedbackModal } from "./";

export const MainContent: React.FC<MainContentProps> = ({
  currentChatTitle,
  darkMode,
  isSidebarOpen,
  toggleSidebar,
  onLogout,
  toggleDarkMode,
  sessionId,
  setSesssionId,
}) => {
  // State Management
  const [message, setMessage] = useState("");
  const [messageCount, setMessageCount] = useState(0);
  const [showModal, setShowModal] = useState(false);
  const [windowSize, setWindowSize] = useState({
    width: window.innerWidth,
    height: window.innerHeight,
  });
  const [loading, setLoading] = useState(false);
  const [response, setResponse] = useState("");
  const [displayedText, setDisplayedText] = useState("");
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
  const [customRemark, setCustomRemark] = useState("");
  const [isInterrupted, setIsInterrupted] = useState(false);
  const [chatId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isHistoryLoaded, setIsHistoryLoaded] = useState(false);

  const location = useLocation();
  const messagesEndRef = useRef<HTMLDivElement>(null);

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

  // Effects
  useEffect(() => {
    storage.set(`chatMessages-${sessionId}`, chatMessages);
  }, [chatMessages, sessionId]);

  useEffect(() => {
    const savedChat = storage.get<{ id: string }>(STORAGE_KEYS.SELECTED_CHAT);
    if (savedChat && typeof savedChat.id === "string") {
      setCurrentChat(savedChat);
    }
  }, []);

  useEffect(() => {
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === STORAGE_KEYS.SELECTED_CHAT) {
        setCurrentChat(e.newValue ? JSON.parse(e.newValue) : null);
      }
    };

    window.addEventListener("storage", handleStorageChange);
    return () => window.removeEventListener("storage", handleStorageChange);
  }, []);

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
  }, []);

  useEffect(() => {
    const presetQuery = storage.get<string>(STORAGE_KEYS.PRESET_QUERY);
    if (presetQuery) {
      setMessage(presetQuery);
    }
  }, []);

  useEffect(() => {
    const savedSessionId = storage.get<string>(STORAGE_KEYS.SESSION_ID);
    if (savedSessionId && savedSessionId !== sessionId) {
      const savedChats = storage.get<ChatMessage[]>(
        `chatMessages-${savedSessionId}`
      );
      setChatMessages(savedChats || []);
    }
  }, [sessionId]);

  useEffect(() => {
    if (messagesEndRef.current) {
      domUtils.scrollToElement(messagesEndRef.current);
    }
  }, [chatMessages, displayedText]);

  useEffect(() => {
    const handleResize = () => {
      setWindowSize({
        width: window.innerWidth,
        height: window.innerHeight,
      });
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Chat history fetching
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
            processChatHistory(data);
            return;
          }
        }

        const response = await api.chat.getMessages(chatId, 1, 50);

        if (response.success && response.data) {
          storage.set(cacheKey, {
            timestamp: Date.now(),
            data: response.data,
          });
          processChatHistory(response.data);
        }
      } catch (error) {
        console.error("Error fetching chat history:", error);
      } finally {
        setIsHistoryLoaded(true);
      }
    },
    [chatMessages, token]
  );

  const processChatHistory = (messages: ChatMessage[]) => {
    if (!messages || !Array.isArray(messages)) return;

    const sortedMessages = messages.sort(
      (a, b) =>
        new Date(a.timestamp || 0).getTime() -
        new Date(b.timestamp || 0).getTime()
    );

    setChatMessages(sortedMessages);

    // Use the conversationId from the first message if available
    const conversationId = sortedMessages[0]?.conversationId || chatId;
    if (conversationId) {
      storage.set(STORAGE_KEYS.SESSION_ID, conversationId);
      setSesssionId(conversationId);
      storage.set(`chatMessages-${conversationId}`, sortedMessages);
    }
  };

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
  }, [sessionId, currentChat, anonymousSessionId, anonymousUserId]);

  // Message handling
  const handleSendMessage = async () => {
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
    setChatMessages(prev => [...prev, userMessage]);

    storage.remove(STORAGE_KEYS.PRESET_QUERY);

    setMessage("");
    setLoading(true);

    try {
      // Use Flowise API directly
      const response = await fetch(
        "http://34.47.149.141/api/v1/prediction/086aebf7-e250-41e6-b437-061f747041d2",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            question: userMessage.content,
          }),
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

      setResponse(botResponse);
      setDisplayedText("");
    } catch (err) {
      console.error("Error sending message:", err);
      const botMessage: ChatMessage = {
        id: `msg_${Date.now()}_assistant`,
        role: "assistant",
        content:
          "I'm having trouble connecting to the server. Please try again later.",
        timestamp: new Date(),
        conversationId: sessionId || "default",
      };
      setChatMessages(prev => [...prev, botMessage]);
    } finally {
      setLoading(false);
    }
  };

  // Typing animation effect
  useEffect(() => {
    if (!response) return;

    let i = 0;
    setDisplayedText("");
    const interval = setInterval(() => {
      if (i < response.length) {
        setDisplayedText(prev => prev + response[i]);
        i++;
      } else {
        clearInterval(interval);
        setChatMessages(prev => [
          ...prev,
          {
            id: `msg_${Date.now()}_assistant`,
            role: "assistant",
            content: response,
            timestamp: new Date(),
            conversationId: sessionId || "default",
          },
        ]);

        setTimeout(() => {
          setDisplayedText("");
          setResponse("");
        }, 200);
      }
    }, ANIMATION_DURATION.TYPING);

    return () => clearInterval(interval);
  }, [response]);

  // Feedback handling
  const handleFeedback = (index: number, type: "like" | "dislike") => {
    if (type === "dislike") {
      setSelectedIndex(index);
      setIsModalOpen(true);
    } else {
      sendFeedback(index, type, "Satisfied with the response");
    }
  };

  const sendFeedback = async (
    index: number,
    type: "like" | "dislike",
    remarks: string
  ) => {
    if (!chatId || !user?.id) return;

    const score = type === "like" ? 1 : 0;

    try {
      await api.feedback.submitFeedback({
        chat_id: chatId,
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
  };

  const handleCopy = async (text: string, index: number) => {
    const success = await domUtils.copyToClipboard(text);
    if (success) {
      setCopiedIndex(index);
      setTimeout(() => setCopiedIndex(null), 5000);
    }
  };

  const handleStopTyping = () => {
    setIsInterrupted(true);
    setLoading(false);
    if (displayedText) {
      setChatMessages(prev => [
        ...prev,
        {
          id: `msg_${Date.now()}_assistant`,
          role: "assistant",
          content: displayedText,
          timestamp: new Date(),
          conversationId: sessionId || "default",
        },
      ]);
      setDisplayedText("");
    }
  };

  const handleFeedbackSubmit = () => {
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
  };

  const handlePromptClick = (prompt: string) => {
    setMessage(prompt);
  };

  if (isLoading) {
    return <OwlLoader darkMode={darkMode} />;
  }

  return (
    <div className="relative flex w-full h-screen overflow-hidden">
      {/* Main content */}
      <div
        className={`flex-1 flex flex-col overflow-hidden transition-all duration-700 ease-[cubic-bezier(0.25,0.1,0.25,1.1)]
        ${isSidebarOpen ? "md:ml-64 lg:ml-72" : "ml-0"}`}
      >
        <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700">
          <div className="flex items-center space-x-4">
            <button
              onClick={toggleSidebar}
              className="p-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-800"
            >
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 6h16M4 12h16M4 18h16"
                />
              </svg>
            </button>
            <h1 className="text-lg font-semibold">
              {currentChatTitle || "New Chat"}
            </h1>
          </div>
          <div className="flex items-center space-x-2">
            <button
              onClick={toggleDarkMode}
              className="p-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-800"
            >
              {darkMode ? "☀️" : "🌙"}
            </button>
            <button
              onClick={onLogout}
              className="px-3 py-1 text-sm bg-red-600 text-white rounded-md hover:bg-red-700"
            >
              Logout
            </button>
          </div>
        </div>

        <main className="flex-1 overflow-y-auto bg-white">
          <div className="p-4 md:p-6">
            <div className="max-w-4xl mx-auto w-full flex flex-col items-center justify-center min-h-full">
              {/* Welcome Screen */}
              {chatMessages.length === 0 && (
                <WelcomeScreen
                  isLoggedIn={isLoggedIn}
                  user={user}
                  windowSize={windowSize}
                  onPromptClick={handlePromptClick}
                />
              )}

              {/* Chat Messages */}
              <ChatMessages
                messages={chatMessages}
                copiedIndex={copiedIndex}
                onFeedback={handleFeedback}
                onCopy={handleCopy}
                displayedText={displayedText}
                loading={loading && !isInterrupted}
                onStopTyping={handleStopTyping}
              />

              <div ref={messagesEndRef} id="messages-end" />
            </div>
          </div>
        </main>

        {/* Message Input */}
        <MessageInput
          message={message}
          setMessage={setMessage}
          onSendMessage={handleSendMessage}
          onStopTyping={handleStopTyping}
          isSidebarOpen={isSidebarOpen}
          loading={loading}
          isLoggedIn={isLoggedIn}
          messageCount={messageCount}
          showModal={showModal}
          setShowModal={setShowModal}
        />
      </div>

      {/* Feedback Modal */}
      <FeedbackModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        customRemark={customRemark}
        setCustomRemark={setCustomRemark}
        onSubmit={handleFeedbackSubmit}
      />

      {/* Typing animation styles */}
      <style>{`
        .typing-indicator {
          display: flex;
          gap: 4px;
        }

        .typing-indicator span {
          width: 8px;
          height: 8px;
          background-color: currentColor;
          border-radius: 50%;
          animation: bounce 1.2s infinite ease-in-out both;
        }

        .typing-indicator span:nth-child(1) {
          animation-delay: 0s;
        }
        .typing-indicator span:nth-child(2) {
          animation-delay: 0.2s;
        }
        .typing-indicator span:nth-child(3) {
          animation-delay: 0.4s;
        }

        @keyframes bounce {
          0%, 80%, 100% {
            transform: scale(0);
          }
          40% {
            transform: scale(1);
          }
        }
      `}</style>
    </div>
  );
};
