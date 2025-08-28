import React, { useRef } from "react";
import { MainContentProps } from "@/types";
import OwlLoader from "@/shared/components/ui/owl-loader";
import { MessageInput, FeedbackModal } from "./";
import { ChatHeader } from "./ChatHeader";
import { ChatBody } from "./ChatBody";
import { useChatState } from "./ChatState";
import { useChatEffects } from "./ChatEffects";
import { useChatHandlers } from "./ChatHandlers";

/**
 * Chat container component
 * Main orchestrator for all chat functionality
 */
export const ChatContainer: React.FC<MainContentProps> = ({
  currentChatTitle,
  darkMode,
  isSidebarOpen,
  toggleSidebar,
  onLogout,
  toggleDarkMode,
  sessionId,
  setSesssionId,
}) => {
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // State management
  const {
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
    isModalOpen,
    setIsModalOpen,
    selectedIndex,
    setSelectedIndex,
    customRemark,
    setCustomRemark,
    windowSize,
    setWindowSize,
    isLoading,
    setIsLoading,
    isHistoryLoaded,
    setIsHistoryLoaded,
    currentChat,
    setCurrentChat,
    chatMessages,
    setChatMessages,
    user,
    isLoggedIn,
    token,
    anonymousUserId,
    anonymousSessionId,
  } = useChatState(sessionId);

  // Effects
  const { fetchChatHistory, processChatHistory } = useChatEffects(
    sessionId,
    chatMessages,
    setChatMessages,
    setCurrentChat,
    setWindowSize,
    setIsLoading,
    setIsHistoryLoaded,
    setMessage,
    setMessageCount,
    setResponse,
    setDisplayedText,
    setLoading,
    messagesEndRef,
    displayedText,
    currentChat,
    isHistoryLoaded,
    anonymousSessionId,
    anonymousUserId,
    setSesssionId
  );

  // Handlers
  const {
    handleSendMessage,
    handleFeedback,
    handleCopy,
    handleStopTyping,
    handleFeedbackSubmit,
    handlePromptClick,
  } = useChatHandlers(
    sessionId,
    message,
    setMessage,
    messageCount,
    setMessageCount,
    setLoading,
    setResponse,
    setDisplayedText,
    setIsInterrupted,
    chatMessages,
    setChatMessages,
    displayedText,
    response,
    isLoggedIn,
    showModal,
    setShowModal,
    isModalOpen,
    setIsModalOpen,
    selectedIndex,
    setSelectedIndex,
    customRemark,
    setCustomRemark,
    copiedIndex,
    setCopiedIndex,
    user
  );

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
        {/* Header */}
        <ChatHeader
          currentChatTitle={currentChatTitle}
          isSidebarOpen={isSidebarOpen}
          toggleSidebar={toggleSidebar}
          toggleDarkMode={toggleDarkMode}
          onLogout={onLogout}
          darkMode={darkMode}
        />

        {/* Chat Body */}
        <ChatBody
          chatMessages={chatMessages}
          copiedIndex={copiedIndex}
          onFeedback={handleFeedback}
          onCopy={handleCopy}
          displayedText={displayedText}
          loading={loading && !isInterrupted}
          onStopTyping={handleStopTyping}
          isLoggedIn={isLoggedIn}
          user={user}
          windowSize={windowSize}
          onPromptClick={handlePromptClick}
          messagesEndRef={messagesEndRef}
          isHistoryLoaded={isHistoryLoaded}
        />

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
