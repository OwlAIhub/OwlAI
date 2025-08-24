import React, { useEffect, useRef, useState } from "react";
import Sidebar from "./Sidebar";
import Header from "./Header";
import OwlLogo from "../assets/owlMascot.png";
import OwlLoader from "./OwlLoader";
import { ChatMessage } from "@/components/features/chat/ChatMessage";
import { MessageInput } from "@/components/features/chat/MessageInput";
import { useChat } from "@/hooks/useChat";

interface MainContentProps {
  currentChatTitle: string;
  darkMode: boolean;
  isSidebarOpen: boolean;
  toggleSidebar: () => void;
  onLogout: () => void;
  toggleDarkMode: () => void;
  sessionId: string | null;
  onUserProfileClick: () => void;
  setSesssionId: (id: string) => void;
}

const MainContent: React.FC<MainContentProps> = ({
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
  const [isLoading, setIsLoading] = useState(true);
  const [currentChat, setCurrentChat] = useState<any>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Get user data
  const user = localStorage.getItem("user")
    ? JSON.parse(localStorage.getItem("user")!)
    : null;
  const isLoggedIn = !!user;

  // Use chat hook for all chat functionality
  const {
    message,
    setMessage,
    chatMessages,
    loading,
    isInterrupted,
    copiedIndex,
    messageCount,
    handleSendMessage,
    handleCopyMessage,
    handleFeedback,
  } = useChat(sessionId, setSesssionId, isLoggedIn);

  // Load chat data
  useEffect(() => {
    const savedChat = localStorage.getItem("selectedChat");
    if (savedChat) {
      setCurrentChat(JSON.parse(savedChat));
    }
  }, []);

  // Handle storage events
  useEffect(() => {
    const handleStorageEvent = (e: StorageEvent) => {
      if (e.key === "selectedChat") {
        setCurrentChat(e.newValue ? JSON.parse(e.newValue) : null);
      }
    };

    window.addEventListener("storage", handleStorageEvent);
    return () => window.removeEventListener("storage", handleStorageEvent);
  }, []);

  // Handle new session events
  useEffect(() => {
    const handleNewSession = () => {
      // Clear messages for new session
    };

    window.addEventListener("newSessionCreated", handleNewSession);
    return () =>
      window.removeEventListener("newSessionCreated", handleNewSession);
  }, []);

  // Load preset query
  useEffect(() => {
    const presetQuery = localStorage.getItem("presetQuery");
    if (presetQuery) {
      setMessage(presetQuery);
      localStorage.removeItem("presetQuery");
    }
  }, [setMessage]);

  // Scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [chatMessages]);

  // Loading effect
  useEffect(() => {
    const hasData =
      sessionId || currentChat || localStorage.getItem("sessionId");
    if (!hasData) {
      setIsLoading(false);
    } else {
      const timer = setTimeout(() => setIsLoading(false), 1500);
      return () => clearTimeout(timer);
    }
  }, [sessionId, currentChat]);

  if (isLoading) {
    return <OwlLoader darkMode={darkMode} />;
  }

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return "Good Morning";
    if (hour < 18) return "Good Afternoon";
    return "Good Evening";
  };

  return (
    <div className="relative flex w-full h-screen overflow-hidden">
      {/* Sidebar */}
      <div
        className={`fixed inset-y-0 z-20 ${
          darkMode ? "bg-gray-900" : "bg-white"
        } 
          ${isSidebarOpen ? "translate-x-0 shadow-xl" : "-translate-x-full"} 
          transition-all duration-800 ease-[cubic-bezier(0.25,0.1,0.25,1.1)]
          w-64 lg:w-72
          border-r ${darkMode ? "border-gray-700" : "border-gray-200"}`}
        style={{
          willChange: "transform",
          transitionProperty: "transform, box-shadow",
        }}
      >
        <Sidebar
          isOpen={isSidebarOpen}
          onClose={toggleSidebar}
          darkMode={darkMode}
          currentUser={{ plan: "Free" }}
          onUserProfileClick={onUserProfileClick}
          onNewChat={() => {}}
          onSelectChat={() => {}}
        />
      </div>

      {/* Overlay */}
      {isSidebarOpen && (
        <div
          className={`fixed inset-0 z-10 bg-black transition-opacity duration-600 ease-in-out ${
            isSidebarOpen ? "opacity-50" : "opacity-0 pointer-events-none"
          } md:hidden`}
          onClick={toggleSidebar}
          style={{ willChange: "opacity" }}
        />
      )}

      {/* Main content */}
      <div
        className={`flex-1 flex flex-col min-w-0 transition-all duration-300 ease-in-out ${
          isSidebarOpen ? "lg:ml-0" : "ml-0"
        }`}
      >
        {/* Header */}
        <Header
          currentChatTitle={currentChatTitle}
          onToggleSidebar={toggleSidebar}
          onLogout={onLogout}
          toggleDarkMode={toggleDarkMode}
          isLoggedIn={isLoggedIn}
          darkMode={darkMode}
        />

        {/* Chat Messages */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {chatMessages.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-center">
              <img
                src={OwlLogo}
                alt="Owl AI"
                className="w-24 h-24 mb-6 opacity-80"
              />
              <h1 className="text-3xl font-bold mb-2 text-[#009688]">
                {getGreeting()}! 👋
              </h1>
              <p className="text-lg text-gray-600 dark:text-gray-300 mb-8 max-w-md">
                I'm your AI learning assistant. Ask me anything about your
                studies, and I'll help you understand concepts better!
              </p>
              <div className="space-y-2">
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Try asking me:
                </p>
                <div className="flex flex-wrap gap-2 justify-center">
                  {[
                    "Explain Research Methodology",
                    "What is Teaching Aptitude?",
                    "Explain Logical Reasoning",
                    "What is Communication?",
                  ].map((suggestion) => (
                    <button
                      key={suggestion}
                      onClick={() => setMessage(suggestion)}
                      className="px-4 py-2 bg-gray-100 dark:bg-gray-700 rounded-lg text-sm hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
                    >
                      {suggestion}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              {chatMessages.map((msg, index) => (
                <ChatMessage
                  key={index}
                  message={msg}
                  index={index}
                  darkMode={darkMode}
                  copiedIndex={copiedIndex}
                  onCopy={handleCopyMessage}
                  onFeedback={handleFeedback}
                />
              ))}
              {loading && !isInterrupted && (
                <div className="flex items-center gap-2 text-gray-500 dark:text-gray-400">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-[#009688]"></div>
                  <span>AI is thinking...</span>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>
          )}
        </div>

        {/* Message Input */}
        <MessageInput
          message={message}
          setMessage={setMessage}
          onSendMessage={handleSendMessage}
          onStopTyping={() => {}}
          isSidebarOpen={isSidebarOpen}
          loading={loading}
          isLoggedIn={isLoggedIn}
          messageCount={messageCount}
          showModal={false}
          setShowModal={() => {}}
          darkMode={darkMode}
          disabled={!isLoggedIn && messageCount >= 4}
        />
      </div>
    </div>
  );
};

export default MainContent;
