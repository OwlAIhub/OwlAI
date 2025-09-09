"use client";

import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Send, Mic, Square, Paperclip } from "lucide-react";
import { cn } from "@/lib/utils";

export interface ChatInputProps {
  onSendMessage: (message: string) => void;
  disabled?: boolean;
  loading?: boolean;
  placeholder?: string;
  maxLength?: number;
  className?: string;
}

export function ChatInput({
  onSendMessage,
  disabled = false,
  loading = false,
  placeholder = "Ask me anything about your studies...",
  maxLength = 2000,
  className,
}: ChatInputProps) {
  const [message, setMessage] = useState("");
  const [isFocused, setIsFocused] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Auto-resize textarea
  useEffect(() => {
    const textarea = textareaRef.current;
    if (textarea) {
      textarea.style.height = "auto";
      textarea.style.height = `${Math.min(textarea.scrollHeight, 120)}px`;
    }
  }, [message]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (message.trim() && !disabled && !loading) {
      onSendMessage(message.trim());
      setMessage("");
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  const canSend = message.trim().length > 0 && !disabled && !loading;
  const isOverLimit = message.length > maxLength;

  return (
    <div className={cn("bg-gradient-to-t from-white via-white to-transparent", className)}>
      {/* Modern Input Container */}
      <div className="px-4 pb-6 pt-4">
        <div className="max-w-4xl mx-auto">
          <form onSubmit={handleSubmit} className="relative">
            {/* Main Input Area */}
            <motion.div
              animate={{
                boxShadow: isFocused
                  ? "0 8px 30px rgba(0, 0, 0, 0.12), 0 0 0 1px rgba(59, 130, 246, 0.3)"
                  : "0 4px 20px rgba(0, 0, 0, 0.08)"
              }}
              transition={{ duration: 0.2 }}
              className={cn(
                "relative flex items-end gap-3 p-4 bg-white rounded-2xl border transition-all duration-200",
                isFocused
                  ? "border-blue-200 bg-blue-50/30"
                  : "border-gray-200 hover:border-gray-300",
                disabled && "opacity-50 cursor-not-allowed",
                isOverLimit && "border-red-300",
              )}
            >
              {/* Text Input */}
              <div className="flex-1 relative">
                <textarea
                  ref={textareaRef}
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  onKeyDown={handleKeyDown}
                  onFocus={() => setIsFocused(true)}
                  onBlur={() => setIsFocused(false)}
                  placeholder={placeholder}
                  disabled={disabled}
                  rows={1}
                  className={cn(
                    "w-full resize-none border-0 bg-transparent text-base placeholder-gray-400 focus:outline-none focus:ring-0",
                    "scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-transparent",
                    "leading-relaxed py-1"
                  )}
                  style={{
                    minHeight: "24px",
                    maxHeight: "120px",
                  }}
                />

                {/* Character Count */}
                <AnimatePresence>
                  {(message.length > maxLength * 0.8 || isOverLimit) && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 10 }}
                      className={cn(
                        "absolute -top-8 right-0 text-xs px-3 py-1 rounded-full backdrop-blur-sm",
                        isOverLimit
                          ? "text-red-600 bg-red-100/80 border border-red-200"
                          : "text-gray-500 border-gray-200",
                      )}
                    >
                      {message.length}/{maxLength}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center gap-2">
                {/* Attachment Button */}
                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="h-9 w-9 p-0 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-xl"
                    disabled={disabled}
                  >
                    <Paperclip className="w-4 h-4" />
                  </Button>
                </motion.div>

                {/* Voice Input Button */}
                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="h-9 w-9 p-0 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-xl"
                    disabled={disabled}
                  >
                    <Mic className="w-4 h-4" />
                  </Button>
                </motion.div>

                {/* Send Button */}
                <motion.div
                  animate={{
                    scale: canSend ? 1 : 0.9,
                    opacity: canSend ? 1 : 0.6,
                  }}
                  transition={{ duration: 0.2 }}
                  whileHover={{ scale: canSend ? 1.05 : 0.9 }}
                  whileTap={{ scale: canSend ? 0.95 : 0.9 }}
                >
                  <Button
                    type="submit"
                    size="sm"
                    disabled={!canSend || isOverLimit}
                    className={cn(
                      "h-9 w-9 p-0 rounded-xl transition-all duration-200",
                      canSend
                        ? "bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white shadow-lg shadow-blue-500/25"
                        : "bg-gray-200 cursor-not-allowed",
                    )}
                  >
                    {loading ? (
                      <motion.div
                        animate={{ rotate: 360 }}
                        transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                      >
                        <Square className="w-4 h-4" />
                      </motion.div>
                    ) : (
                      <Send className="w-4 h-4" />
                    )}
                  </Button>
                </motion.div>
              </div>
            </motion.div>

            {/* Quick Actions & Helper Text */}
            <div className="flex items-center justify-between mt-3 px-2">
              {/* Helper Text */}
              <div className="text-xs text-gray-400">
                Press <kbd className="px-1.5 py-0.5 text-xs bg-gray-100 rounded border">Enter</kbd> to send
              </div>

              {/* Quick Action Pills */}
              <div className="flex items-center gap-2">
                {[
                  { label: "UGC NET", message: "Can you help me with UGC NET preparation?" },
                  { label: "Research", message: "Explain research methodology concepts" },
                  { label: "Study Plan", message: "Create a study plan for me" }
                ].map((action) => (
                  <motion.button
                    key={action.label}
                    type="button"
                    whileHover={{ scale: 1.05, y: -1 }}
                    whileTap={{ scale: 0.95 }}
                    className="text-xs px-3 py-1.5 text-gray-500 hover:text-blue-600 hover:bg-blue-50 rounded-full border border-gray-200 hover:border-blue-200 transition-all duration-200"
                    onClick={() => setMessage(action.message)}
                  >
                    {action.label}
                  </motion.button>
                ))}
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
