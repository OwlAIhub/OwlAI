"use client";

import { AnimatePresence, motion } from "framer-motion";
import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { cn } from "../../lib/utils";
import { ChatInput } from "./ChatInput";
import { ChatMessage } from "./ChatMessage";

export interface ChatContainerProps {
  className?: string;
  welcomeMessage?: string;
  starterPrompts?: string[];
}

interface SimpleMessage {
  id: string;
  content: string;
  sender: "user" | "ai";
  timestamp: Date;
  status: "sent";
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
  const [messages, setMessages] = useState<SimpleMessage[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const messagesContainerRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleStarterPromptClick = (prompt: string) => {
    sendMessage(prompt);
  };

  const sendMessage = (content: string) => {
    if (!content.trim()) return;

    // Add user message
    const userMessage: SimpleMessage = {
      id: Date.now().toString(),
      content: content.trim(),
      sender: "user",
      timestamp: new Date(),
      status: "sent",
    };

    setMessages(prev => [...prev, userMessage]);
    setIsLoading(true);

    // Simulate AI response after a delay
    setTimeout(() => {
      const aiMessage: SimpleMessage = {
        id: (Date.now() + 1).toString(),
        content: "I'm a simple chat interface. Database and AI integration have been removed as requested. This is just a UI demonstration.",
        sender: "ai",
        timestamp: new Date(),
        status: "sent",
      };
      setMessages(prev => [...prev, aiMessage]);
      setIsLoading(false);
    }, 1000);
  };

  const handleCopyMessage = (content: string) => {
    navigator.clipboard.writeText(content);
  };

  const handleFeedback = (messageId: string, type: "like" | "dislike") => {
    console.log("Feedback:", messageId, type);
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
              <h2 className="text-xl font-semibold text-gray-900 mb-3 tracking-tight">
                Welcome to OwlAI
              </h2>
              <p className="text-sm text-gray-500 leading-relaxed max-w-lg mx-auto">{welcomeMessage}</p>
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
                onSendMessage={sendMessage}
                disabled={isLoading}
                loading={isLoading}
                placeholder="Ask me anything about your studies..."
              />
            </motion.div>
          </div>
        ) : (
          /* Messages List */
          <div className="py-6 px-4">
            <div className="max-w-4xl mx-auto">
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
                    onRegenerate={() => {}}
                    onFeedback={handleFeedback}
                    onSendMessage={sendMessage}
                  />
                ))}
              </AnimatePresence>
            </div>

            {/* Typing Indicator */}
            {isLoading && (
              <div className="max-w-4xl mx-auto px-4">
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

                  <span className="text-sm text-gray-600 font-medium">OwlAI is thinking...</span>
                </motion.div>
              </div>
            )}

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

          </div>
        </div>
      )}

      {/* Chat Input - Only show when there are messages */}
      {hasMessages && (
        <ChatInput
          onSendMessage={sendMessage}
          disabled={isLoading}
          loading={isLoading}
          placeholder="Ask me anything about your studies..."
        />
      )}
    </div>
  );
}
