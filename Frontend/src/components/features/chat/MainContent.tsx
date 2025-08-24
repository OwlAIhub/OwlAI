import React, { useEffect, useRef, useState, useCallback } from "react";
import { useLocation } from "react-router-dom";
import { MainContentProps, ChatMessage, User } from '@/types';
import { api } from '@/services/api';
import { storage, formatUtils, domUtils } from '@/utils';
import { STORAGE_KEYS, MESSAGE_LIMITS, ANIMATION_DURATION } from '@/constants';
import { toast } from "react-toastify";
import Header from "@/Components/Header"; // Keep old import for now
import OwlLoader from "@/Components/OwlLoader"; // Keep old import for now
import { ChatMessages, WelcomeScreen, MessageInput, FeedbackModal } from './';

export const MainContent: React.FC<MainContentProps> = ({
  currentChatTitle,
  darkMode,
  isSidebarOpen,
  toggleSidebar,
  onLogout,
  toggleDarkMode,
  sessionId,
  onUserProfileClick,
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
  const [chatId, setChatId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isHistoryLoaded, setIsHistoryLoaded] = useState(false);
  
  const location = useLocation();
  const messagesEndRef = useRef<HTMLDivElement>(null);
  
  // Chat state
  const [currentChat, setCurrentChat] = useState(() => {
    const savedChat = storage.get(STORAGE_KEYS.SELECTED_CHAT);
    return savedChat;
  });

  const [chatMessages, setChatMessages] = useState<ChatMessage[]>(() => {
    const savedMessages = storage.get(`chatMessages-${sessionId}`);
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
    const savedChat = storage.get(STORAGE_KEYS.SELECTED_CHAT);
    if (savedChat) {
      setCurrentChat(savedChat);
    }
  }, []);

  useEffect(() => {
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === STORAGE_KEYS.SELECTED_CHAT) {
        setCurrentChat(e.newValue ? JSON.parse(e.newValue) : null);
      }
    };

    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  useEffect(() => {
    const handleNewSession = () => {
      setChatMessages([]);
      setMessageCount(0);
      setResponse("");
      setDisplayedText("");
      setLoading(false);
    };

    window.addEventListener('newSessionCreated', handleNewSession);
    return () => window.removeEventListener('newSessionCreated', handleNewSession);
  }, []);

  useEffect(() => {
    const presetQuery = storage.get(STORAGE_KEYS.PRESET_QUERY);
    if (presetQuery) {
      setMessage(presetQuery);
    }
  }, []);

  useEffect(() => {
    const savedSessionId = storage.get(STORAGE_KEYS.SESSION_ID);
    if (savedSessionId && savedSessionId !== sessionId) {
      const savedChats = storage.get(`chatMessages-${savedSessionId}`);
      setChatMessages(savedChats || []);
    }
  }, [sessionId]);

  useEffect(() => {
    domUtils.scrollToElement(messagesEndRef.current);
  }, [chatMessages, displayedText]);

  useEffect(() => {
    const handleResize = () => {
      setWindowSize({
        width: window.innerWidth,
        height: window.innerHeight,
      });
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Chat history fetching
  const fetchChatHistory = useCallback(async (chatId: string) => {
    if (chatMessages.some(msg => msg.chatId === chatId)) {
      return;
    }

    try {
      const cacheKey = `chatHistory-${chatId}`;
      const cachedData = storage.get(cacheKey);
      
      if (cachedData) {
        const { timestamp, data } = cachedData;
        if (Date.now() - timestamp < MESSAGE_LIMITS.CACHE_DURATION) {
          processChatHistory(data);
          return;
        }
      }

      const response = await api.chat.getChatHistory(chatId, token);
      
      if (response.status === 'success' && response.data) {
        storage.set(cacheKey, {
          timestamp: Date.now(),
          data: response.data
        });
        processChatHistory(response.data);
      }
    } catch (error) {
      console.error('Error fetching chat history:', error);
    } finally {
      setIsHistoryLoaded(true);
    }
  }, [chatMessages, token]);

  const processChatHistory = (data: any) => {
    storage.set(STORAGE_KEYS.SESSION_ID, data.chat_id);
    setSesssionId(data.chat_id);
    
    const messages: ChatMessage[] = [];
    
    if (data.data && Array.isArray(data.data)) {
      data.data.forEach((messageObj: any) => {
        if (messageObj.question_text) {
          messages.push({
            role: 'user',
            content: messageObj.question_text,
            isMarkdown: false,
            feedback: messageObj.feedback_rating,
            timestamp: messageObj.created_at,
            chatId: data.chat_id
          });
        }
        
        if (messageObj.response_text) {
          messages.push({
            role: 'bot',
            content: messageObj.response_text,
            isMarkdown: true,
            feedback: messageObj.feedback_rating,
            timestamp: messageObj.created_at,
            chatId: data.chat_id
          });
        }
      });
    }
    
    messages.sort((a, b) => new Date(a.timestamp || 0).getTime() - new Date(b.timestamp || 0).getTime());
    setChatMessages(messages);
    storage.set(`chatMessages-${data.chat_id}`, messages);
  };

  useEffect(() => {
    if (!currentChat?.id || isHistoryLoaded) return;

    const timer = setTimeout(() => {
      fetchChatHistory(currentChat.id);
    }, 300);

    return () => clearTimeout(timer);
  }, [currentChat?.id, location.pathname, fetchChatHistory, isHistoryLoaded]);

  // Loading state management
  useEffect(() => {
    const hasData = sessionId || currentChat || 
                   storage.get(STORAGE_KEYS.SESSION_ID) || 
                   storage.get(STORAGE_KEYS.SELECTED_CHAT) || 
                   anonymousSessionId || anonymousUserId;

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
      role: "user", 
      content: message, 
      isMarkdown: true, 
      feedback: null 
    };
    setChatMessages((prev) => [...prev, userMessage]);

    storage.remove(STORAGE_KEYS.PRESET_QUERY);

    setMessage("");
    setLoading(true);

    const currentUserId = isLoggedIn ? user?.uid : anonymousUserId;
    const currentSessionId = isLoggedIn ? storage.get(STORAGE_KEYS.SESSION_ID) : anonymousSessionId;

    try {
      const response = await api.chat.sendMessage(message, currentUserId, currentSessionId);
      
      if (response.status === 'success' && response.data) {
        const fullResponse = response.data.response || "Sorry, no response from AI.";
        const chatId = response.data.chat_id;
        setChatId(chatId);
        const formattedResponse = formatUtils.formatMarkdown(fullResponse);

        if (isLoggedIn) {
          window.dispatchEvent(new CustomEvent('newChatMessage', {
            detail: {
              sessionId: currentSessionId,
              message: message
            }
          }));
        }

        setResponse(formattedResponse);
        setDisplayedText("");
      } else {
        throw new Error(response.error || 'API request failed');
      }
    } catch (err) {
      console.error("Error sending message:", err);
      const botMessage: ChatMessage = {
        role: "bot",
        content: "I'm having trouble connecting to the server. Please try again later.",
      };
      setChatMessages((prev) => [...prev, botMessage]);
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
        setDisplayedText((prev) => prev + response[i]);
        i++;
      } else {
        clearInterval(interval);
        setChatMessages((prev) => [
          ...prev,
          { role: "bot", content: response, isMarkdown: true },
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
  const handleFeedback = (index: number, type: 'like' | 'dislike') => {
    if (type === "dislike") {
      setSelectedIndex(index);
      setIsModalOpen(true);
    } else {
      sendFeedback(index, type, "Satisfied with the response");
    }
  };

  const sendFeedback = async (index: number, type: 'like' | 'dislike', remarks: string) => {
    if (!chatId || !user?.uid) return;

    const score = type === "like" ? 1 : 0;

    try {
      await api.feedback.submitFeedback({
        chat_id: chatId,
        user_id: user.uid,
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
      setChatMessages((prev) => [
        ...prev,
        { role: "bot", content: displayedText }
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
      <div className={`flex-1 flex flex-col overflow-hidden transition-all duration-700 ease-[cubic-bezier(0.25,0.1,0.25,1.1)]
        ${isSidebarOpen ? 'md:ml-64 lg:ml-72' : 'ml-0'}`}>
        
        <Header
          currentChatTitle={currentChatTitle}
          onToggleSidebar={toggleSidebar}
          isLoggedIn={isLoggedIn}
          onLogout={onLogout}
          darkMode={darkMode}
          toggleDarkMode={toggleDarkMode}
        />

        <main className={`flex-1 overflow-auto p-4 md:p-6 flex flex-col ${
          darkMode ? "bg-gray-900" : "bg-gray-50"
        }`}>
          <div className="max-w-4xl mx-auto w-full flex-1 mb-48 flex flex-col items-center justify-center">
            
            {/* Welcome Screen */}
            {chatMessages.length === 0 && (
              <WelcomeScreen
                darkMode={darkMode}
                isLoggedIn={isLoggedIn}
                user={user}
                windowSize={windowSize}
                onPromptClick={handlePromptClick}
              />
            )}

            {/* Chat Messages */}
            <ChatMessages
              messages={chatMessages}
              darkMode={darkMode}
              copiedIndex={copiedIndex}
              onFeedback={handleFeedback}
              onCopy={handleCopy}
              displayedText={displayedText}
              loading={loading && !isInterrupted}
            />

            <div ref={messagesEndRef} />
          </div>
        </main>
        
        {/* Message Input */}
        <MessageInput
          message={message}
          setMessage={setMessage}
          onSendMessage={handleSendMessage}
          onStopTyping={handleStopTyping}
          darkMode={darkMode}
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
        darkMode={darkMode}
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
