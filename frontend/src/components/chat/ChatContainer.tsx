"use client";

import { AnimatePresence, motion } from "framer-motion";
import Image from "next/image";
import { useCallback, useEffect, useRef } from "react";
import { useChat } from "../../lib/contexts/ChatContext";
import { cn } from "../../lib/utils";
import { ChatInput } from "./ChatInput";
import { ChatMessage } from "./ChatMessage";

export interface ChatContainerProps {
  className?: string;
  welcomeMessage?: string;
  starterPrompts?: string[];
}

export function ChatContainer({
  className,
  welcomeMessage = "Hello! I'm OwlAI, your friendly study companion! 🦉 I'm here to help you master UGC NET Paper-1 (Units 1-4) with clear explanations and practice questions. What would you like to explore today?",
  starterPrompts = [
    "What are the key components of teaching aptitude in higher education?",
    "How does research aptitude contribute to effective educational practices?",
    "What are the main elements of effective communication in an educational context?",
    "How do comprehension skills impact learning outcomes in students?",
  ],
}: ChatContainerProps) {
  const { state, sendMessage, regenerateLastMessage } = useChat();
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const messagesContainerRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom when new messages arrive - optimized
  const scrollToBottom = useCallback(() => {
    requestAnimationFrame(() => {
      if (messagesEndRef.current) {
        messagesEndRef.current.scrollIntoView({
          behavior: "smooth",
          block: "end",
        });
      }
    });
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [state.messages, state.isLoading, scrollToBottom]);

  const handleStarterPromptClick = async (prompt: string) => {
    sendMessage(prompt);
  };

  const handleSendMessage = async (content: string) => {
    sendMessage(content);
  };

  const handleCopyMessage = (content: string) => {
    navigator.clipboard.writeText(content);
  };

  const handleFeedback = (messageId: string, type: "like" | "dislike") => {
    console.log("Feedback:", messageId, type);
  };

  const handleRegenerate = async () => {
    regenerateLastMessage();
  };

  const hasMessages = state.messages.length > 0;

  return (
    <div className={cn("flex flex-col h-full bg-white", className)}>
      {/* Messages Area */}
      <div
        ref={messagesContainerRef}
        id="chat-messages-container"
        className="flex-1 overflow-y-auto overflow-x-hidden scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-transparent"
        style={{
          minHeight: 0, // Allow flexbox to control height properly
          scrollBehavior: "smooth",
          WebkitOverflowScrolling: "touch",
        }}
      >
        {!hasMessages ? (
          /* Welcome Screen */
          <div className="flex flex-col items-center justify-center h-full p-8">
            {/* Welcome Message */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="text-center mb-12 max-w-2xl"
            >
              <div className="w-12 h-12 flex items-center justify-center mx-auto mb-6">
                <Image
                  src="/apple-touch-icon.png"
                  alt="OwlAI"
                  width={48}
                  height={48}
                  className="w-full h-full object-contain"
                  unoptimized
                />
              </div>
              <h2 className="text-2xl font-semibold bg-gradient-to-r from-black to-green-600 bg-clip-text text-transparent mb-3 tracking-tight">
                OwlAI Chat
              </h2>
              <p className="text-sm text-gray-500 leading-relaxed max-w-lg mx-auto">
                {welcomeMessage}
              </p>
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

            {/* Search/Input Bar - Right below starter prompts */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.6 }}
              className="w-full max-w-2xl mt-8"
            >
              <ChatInput
                onSendMessage={handleSendMessage}
                disabled={state.isLoading}
                loading={state.isLoading}
                placeholder="Ask me anything about your studies..."
              />
            </motion.div>
          </div>
        ) : (
          /* Messages List */
          <div className="py-8 px-6">
            <div className="max-w-5xl mx-auto space-y-6">
              <AnimatePresence>
                {state.messages.map((message) => (
                  <ChatMessage
                    key={message.id}
                    id={message.id}
                    content={message.content}
                    sender={message.sender}
                    timestamp={message.timestamp}
                    status={message.status}
                    onCopy={handleCopyMessage}
                    onRegenerate={handleRegenerate}
                    onFeedback={handleFeedback}
                    onSendMessage={handleSendMessage}
                  />
                ))}
              </AnimatePresence>
            </div>

            {/* Typing Indicator */}
            {state.isLoading && (
              <div className="max-w-5xl mx-auto px-6">
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="flex items-center gap-3 py-3"
                >
                  {/* AI Avatar */}
                  <div className="w-6 h-6 rounded-full bg-teal-500 flex items-center justify-center flex-shrink-0">
                    <Image
                      src="/apple-touch-icon.png"
                      alt="OwlAI"
                      width={20}
                      height={20}
                      className="w-4 h-4 object-contain"
                      unoptimized
                    />
                  </div>

                  {/* Typing Animation */}
                  <div className="flex items-center gap-1">
                    <motion.div
                      className="w-1.5 h-1.5 bg-teal-500 rounded-full"
                      animate={{
                        scale: [1, 1.3, 1],
                        opacity: [0.4, 1, 0.4],
                      }}
                      transition={{
                        duration: 1.2,
                        repeat: Infinity,
                        delay: 0,
                      }}
                    />
                    <motion.div
                      className="w-1.5 h-1.5 bg-teal-500 rounded-full"
                      animate={{
                        scale: [1, 1.3, 1],
                        opacity: [0.4, 1, 0.4],
                      }}
                      transition={{
                        duration: 1.2,
                        repeat: Infinity,
                        delay: 0.2,
                      }}
                    />
                    <motion.div
                      className="w-1.5 h-1.5 bg-teal-500 rounded-full"
                      animate={{
                        scale: [1, 1.3, 1],
                        opacity: [0.4, 1, 0.4],
                      }}
                      transition={{
                        duration: 1.2,
                        repeat: Infinity,
                        delay: 0.4,
                      }}
                    />
                  </div>

                  <span className="text-sm text-gray-600 font-medium">
                    OwlAI is thinking...
                  </span>
                </motion.div>
              </div>
            )}

            {/* Scroll anchor */}
            <div ref={messagesEndRef} className="h-1" />
          </div>
        )}
      </div>

      {/* Chat Input - Clean at bottom */}
      {hasMessages && (
        <div className="flex-shrink-0">
          <ChatInput
            onSendMessage={handleSendMessage}
            disabled={state.isLoading}
            loading={state.isLoading}
            placeholder="Ask me anything about your studies..."
          />
        </div>
      )}
    </div>
  );
}
