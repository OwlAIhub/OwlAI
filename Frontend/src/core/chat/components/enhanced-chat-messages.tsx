import React, { useEffect, useRef, useState } from "react";
import { EnhancedChatMessage } from "./enhanced-chat-message";
import { ChatMessage as ChatMessageType } from "@/types";
import { motion, AnimatePresence } from "framer-motion";

interface EnhancedChatMessagesProps {
  messages: ChatMessageType[];
  darkMode: boolean;
  copiedIndex: number | null;
  onCopy: (index: number) => void;
  onFeedback: (index: number, type: string, remark?: string) => void;
  onRegenerate?: (index: number) => void;
  onEdit?: (index: number, content: string) => void;
  isStreaming?: boolean;
  streamingContent?: string;
  loading?: boolean;
}

export const EnhancedChatMessages: React.FC<EnhancedChatMessagesProps> = ({
  messages,
  darkMode,
  copiedIndex,
  onCopy,
  onFeedback,
  onRegenerate,
  onEdit,
  isStreaming = false,
  streamingContent = "",
  loading = false,
}) => {
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [showScrollToBottom, setShowScrollToBottom] = useState(false);

  // Auto-scroll to bottom when new messages arrive or streaming
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({
        behavior: "smooth",
        block: "end",
      });
    }
  }, [messages, isStreaming, streamingContent]);

  // Handle scroll events to show/hide scroll to bottom button
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const handleScroll = () => {
      const { scrollTop, scrollHeight, clientHeight } = container;
      const isNearBottom = scrollHeight - scrollTop - clientHeight < 100;
      setShowScrollToBottom(!isNearBottom);
    };

    container.addEventListener("scroll", handleScroll);
    return () => container.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToBottom = () => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({
        behavior: "smooth",
        block: "end",
      });
    }
  };

  // Loading indicator component
  const LoadingIndicator = () => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex justify-start mb-6"
    >
      <div className="max-w-[85%] sm:max-w-3xl rounded-2xl bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 shadow-md p-4">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-[#52B788] flex items-center justify-center">
            🤖
          </div>
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-1">
              <div className="w-2 h-2 bg-[#52B788] rounded-full animate-pulse"></div>
              <div
                className="w-2 h-2 bg-[#52B788] rounded-full animate-pulse"
                style={{ animationDelay: "0.2s" }}
              ></div>
              <div
                className="w-2 h-2 bg-[#52B788] rounded-full animate-pulse"
                style={{ animationDelay: "0.4s" }}
              ></div>
            </div>
            <span className="text-sm text-gray-600 dark:text-gray-400">
              AI is thinking...
            </span>
          </div>
        </div>
      </div>
    </motion.div>
  );

  // Empty state component
  const EmptyState = () => (
    <div className="flex flex-col items-center justify-center h-full text-center px-4">
      <div className="w-16 h-16 bg-[#52B788]/10 rounded-full flex items-center justify-center mb-4">
        <span className="text-2xl">🤖</span>
      </div>
      <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
        Welcome to OwlAI Assistant
      </h3>
      <p className="text-gray-600 dark:text-gray-400 mb-6 max-w-md">
        I&apos;m here to help you with UGC NET preparation. Ask me anything
        about teaching aptitude, research methodology, or any other topics!
      </p>

      {/* Quick Start Suggestions */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-w-lg w-full">
        {[
          "What is Teaching Aptitude?",
          "Explain Research Methodology",
          "How to prepare for UGC NET?",
          "What are learning theories?",
        ].map((suggestion, index) => (
          <motion.button
            key={index}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="p-3 text-left bg-gray-50 dark:bg-gray-700 rounded-lg border border-gray-200 dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors text-sm text-gray-700 dark:text-gray-300"
            onClick={() => {
              // This would trigger a message send - you'll need to implement this
              console.log("Suggestion clicked:", suggestion);
            }}
          >
            {suggestion}
          </motion.button>
        ))}
      </div>
    </div>
  );

  return (
    <div className="relative flex-1 overflow-hidden">
      {/* Messages Container */}
      <div
        ref={containerRef}
        className="h-full overflow-y-auto scroll-smooth px-4 py-6"
      >
        <AnimatePresence>
          {messages.length === 0 && !loading && !isStreaming ? (
            <EmptyState />
          ) : (
            <>
              {/* Messages */}
              {messages.map((message, index) => (
                <motion.div
                  key={`${message.role}-${index}-${message.content.substring(0, 20)}`}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.3 }}
                >
                  <EnhancedChatMessage
                    message={message}
                    index={index}
                    darkMode={darkMode}
                    copiedIndex={copiedIndex}
                    onCopy={onCopy}
                    onFeedback={onFeedback}
                    onRegenerate={onRegenerate}
                    onEdit={onEdit}
                  />
                </motion.div>
              ))}

              {/* Streaming Message */}
              {isStreaming && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="flex justify-start mb-6"
                >
                  <div className="max-w-[85%] sm:max-w-3xl rounded-2xl bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 shadow-md">
                    <div className="flex items-center justify-between p-4 pb-2">
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-full bg-[#52B788] flex items-center justify-center">
                          🤖
                        </div>
                        <span className="text-sm font-medium">
                          OwlAI Assistant
                        </span>
                        <div className="flex items-center gap-1">
                          <div className="w-2 h-2 bg-[#52B788] rounded-full animate-pulse"></div>
                          <span className="text-xs text-gray-500">
                            typing...
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className="px-4 pb-4">
                      <div className="prose max-w-none text-gray-900 dark:text-white">
                        <div className="whitespace-pre-wrap">
                          {streamingContent}
                          <span className="inline-block w-2 h-4 bg-[#52B788] animate-pulse ml-1"></span>
                        </div>
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}

              {/* Loading Indicator */}
              {loading && <LoadingIndicator />}
            </>
          )}
        </AnimatePresence>

        {/* Scroll anchor */}
        <div ref={messagesEndRef} />
      </div>

      {/* Scroll to Bottom Button */}
      <AnimatePresence>
        {showScrollToBottom && (
          <motion.button
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            onClick={scrollToBottom}
            className="absolute bottom-4 right-4 p-3 bg-[#52B788] text-white rounded-full shadow-lg hover:bg-[#40916C] transition-colors z-10"
            title="Scroll to bottom"
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
                d="M19 14l-7 7m0 0l-7-7m7 7V3"
              />
            </svg>
          </motion.button>
        )}
      </AnimatePresence>

      {/* Connection Status */}
      <div className="absolute top-4 right-4 flex items-center gap-2 text-xs text-gray-500 dark:text-gray-400">
        <div className="w-2 h-2 bg-green-500 rounded-full"></div>
        <span>Connected</span>
      </div>
    </div>
  );
};
