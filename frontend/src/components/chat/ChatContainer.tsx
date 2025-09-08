"use client";

import { useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChatMessage } from "./ChatMessage";
import { ChatInput } from "./ChatInput";
import { TypingIndicator } from "./TypingIndicator";
import { useChat } from "../../hooks/useChat";
import { Button } from "../ui/button";
import { RefreshCw, Trash2, AlertCircle } from "lucide-react";
import { cn } from "../../lib/utils";

export interface ChatContainerProps {
  className?: string;
  welcomeMessage?: string;
  starterPrompts?: string[];
}

export function ChatContainer({
  className,
  welcomeMessage = "Hello! I'm your AI learning assistant. How can I help you study today?",
  starterPrompts = [
    "Research methodology for UGC NET",
    "UGC NET Paper 1 strategies",
    "30-day study plan for Economics",
    "Teaching aptitude section tips",
  ],
}: ChatContainerProps) {
  const {
    messages,
    isLoading,
    error,
    sendMessage,
    regenerateMessage,
    clearMessages,
    retryLastMessage,
    isTyping,
  } = useChat({
    onError: (error) => {
      console.error("Chat error:", error);
    },
    onMessageSent: (message) => {
      console.log("Message sent:", message);
    },
    onMessageReceived: (message) => {
      console.log("Message received:", message);
    },
  });

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const messagesContainerRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isTyping]);

  const handleStarterPromptClick = (prompt: string) => {
    sendMessage(prompt);
  };

  const handleCopyMessage = (content: string) => {
    // Copy functionality is handled in ChatMessage component
    console.log("Message copied:", content);
  };

  const handleFeedback = (messageId: string, type: "like" | "dislike") => {
    console.log("Feedback:", messageId, type);
    // TODO: Implement feedback storage
  };

  const hasMessages = messages.length > 0;

  return (
    <div className={cn("flex flex-col h-full bg-white", className)}>
      {/* Messages Area */}
      <div
        ref={messagesContainerRef}
        id="chat-messages-container"
        className="flex-1 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-transparent"
      >
        {!hasMessages ? (
          /* Welcome Screen */
          <div className="flex flex-col items-center justify-center h-full p-8">
            {/* Welcome Message */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="text-center mb-8 max-w-2xl"
            >
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg
                  className="w-8 h-8 text-primary"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                >
                  <path d="M12 2C13.1 2 14 2.9 14 4C14 5.1 13.1 6 12 6C10.9 6 10 5.1 10 4C10 2.9 10.9 2 12 2ZM21 9V7L15 1L13.5 2.5L16.17 5.17C15.24 5.06 14.32 5 13.4 5C10.2 5 7.13 5.69 4.42 7.01C2.84 7.76 2 9.38 2 11.13V20C2 21.1 2.9 22 4 22H8V19H4V11.13C4 10.76 4.18 10.42 4.5 10.26C6.71 9.2 9.5 8.5 12.4 8.5C13.13 8.5 13.85 8.54 14.56 8.62L12 11.18V22H20C21.1 22 22 21.1 22 20V9H21Z" />
                </svg>
              </div>
              <h2 className="text-2xl font-semibold text-gray-900 mb-2">
                Welcome to OwlAI
              </h2>
              <p className="text-gray-600 leading-relaxed">{welcomeMessage}</p>
            </motion.div>

            {/* Starter Prompts */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="w-full max-w-2xl"
            >
              <h3 className="text-lg font-medium text-gray-900 mb-4 text-center">
                Try asking about:
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {starterPrompts.map((prompt, index) => (
                  <motion.button
                    key={prompt}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, delay: 0.3 + index * 0.1 }}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => handleStarterPromptClick(prompt)}
                    className="text-left p-4 rounded-xl border border-gray-200 hover:border-primary/50 hover:bg-primary/5 transition-all duration-200 group"
                  >
                    <p className="text-sm text-gray-700 group-hover:text-primary transition-colors">
                      {prompt}
                    </p>
                  </motion.button>
                ))}
              </div>
            </motion.div>
          </div>
        ) : (
          /* Messages List */
          <div className="py-4">
            <AnimatePresence>
              {messages.map((message) => (
                <ChatMessage
                  key={message.id}
                  id={message.id}
                  content={message.content}
                  sender={message.sender}
                  timestamp={message.timestamp}
                  status={message.status}
                  onCopy={handleCopyMessage}
                  onRegenerate={regenerateMessage}
                  onFeedback={handleFeedback}
                />
              ))}
            </AnimatePresence>

            {/* Typing Indicator */}
            <AnimatePresence>{isTyping && <TypingIndicator />}</AnimatePresence>

            {/* Error Message */}
            <AnimatePresence>
              {error && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  className="mx-4 my-2 p-4 bg-red-50 border border-red-200 rounded-lg flex items-center gap-3"
                >
                  <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0" />
                  <div className="flex-1">
                    <p className="text-sm text-red-800 font-medium">Error</p>
                    <p className="text-sm text-red-700">{error}</p>
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={retryLastMessage}
                    className="text-red-700 border-red-300 hover:bg-red-100"
                  >
                    <RefreshCw className="w-4 h-4 mr-1" />
                    Retry
                  </Button>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Scroll anchor */}
            <div ref={messagesEndRef} />
          </div>
        )}
      </div>

      {/* Chat Actions (when there are messages) */}
      {hasMessages && (
        <div className="border-t border-gray-100 px-4 py-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="text-xs text-gray-500">
                {messages.length} message{messages.length !== 1 ? "s" : ""}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={clearMessages}
                className="text-gray-500 hover:text-red-600 hover:bg-red-50"
              >
                <Trash2 className="w-4 h-4 mr-1" />
                Clear
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Chat Input */}
      <ChatInput
        onSendMessage={sendMessage}
        disabled={isLoading}
        loading={isLoading}
        placeholder="Ask me anything about your studies..."
      />
    </div>
  );
}
