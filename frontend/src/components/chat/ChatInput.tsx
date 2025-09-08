"use client";

import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Send, Mic, Square, Paperclip } from "lucide-react";
import { cn } from "@/lib/utils";
import { CompactTypingIndicator } from "./TypingIndicator";

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
    <div className={cn("border-t border-gray-100 bg-white", className)}>
      {/* Loading Indicator */}
      <AnimatePresence>
        {loading && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="px-4 py-2 border-b border-gray-100"
          >
            <CompactTypingIndicator />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Input Area */}
      <div className="p-4">
        <form onSubmit={handleSubmit} className="relative">
          <div
            className={cn(
              "relative flex items-end gap-3 p-3 border rounded-2xl transition-all duration-200",
              isFocused
                ? "border-primary shadow-sm ring-1 ring-primary/20"
                : "border-gray-200 hover:border-gray-300",
              disabled && "opacity-50 cursor-not-allowed",
              isOverLimit && "border-red-300 ring-1 ring-red-200",
            )}
          >
            {/* Attachment Button */}
            <Button
              type="button"
              variant="ghost"
              size="sm"
              className="flex-shrink-0 h-8 w-8 p-0 text-gray-400 hover:text-gray-600 hover:bg-gray-100"
              disabled={disabled}
            >
              <Paperclip className="w-4 h-4" />
            </Button>

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
                  "w-full resize-none border-0 bg-transparent text-sm placeholder-gray-500 focus:outline-none focus:ring-0",
                  "scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-transparent",
                )}
                style={{
                  minHeight: "20px",
                  maxHeight: "120px",
                }}
              />

              {/* Character Count */}
              <AnimatePresence>
                {(message.length > maxLength * 0.8 || isOverLimit) && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.8 }}
                    className={cn(
                      "absolute -top-6 right-0 text-xs px-2 py-1 rounded bg-white shadow-sm border",
                      isOverLimit
                        ? "text-red-600 border-red-200"
                        : "text-gray-500 border-gray-200",
                    )}
                  >
                    {message.length}/{maxLength}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Voice Input Button */}
            <Button
              type="button"
              variant="ghost"
              size="sm"
              className="flex-shrink-0 h-8 w-8 p-0 text-gray-400 hover:text-gray-600 hover:bg-gray-100"
              disabled={disabled}
            >
              <Mic className="w-4 h-4" />
            </Button>

            {/* Send Button */}
            <motion.div
              animate={{
                scale: canSend ? 1 : 0.8,
                opacity: canSend ? 1 : 0.5,
              }}
              transition={{ duration: 0.15 }}
            >
              <Button
                type="submit"
                size="sm"
                disabled={!canSend || isOverLimit}
                className={cn(
                  "flex-shrink-0 h-8 w-8 p-0 transition-all duration-200",
                  canSend
                    ? "bg-primary hover:bg-primary/90 text-white shadow-sm"
                    : "bg-gray-100 text-gray-400 cursor-not-allowed",
                )}
              >
                {loading ? (
                  <Square className="w-4 h-4" />
                ) : (
                  <Send className="w-4 h-4" />
                )}
              </Button>
            </motion.div>
          </div>

          {/* Helper Text */}
          <div className="flex items-center justify-between mt-2 px-1">
            <div className="text-xs text-gray-500">
              Press Enter to send, Shift + Enter for new line
            </div>

            {/* Quick Actions */}
            <div className="flex items-center gap-2">
              <motion.button
                type="button"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="text-xs text-gray-500 hover:text-primary transition-colors"
                onClick={() =>
                  setMessage("Can you help me with UGC NET preparation?")
                }
              >
                UGC NET
              </motion.button>
              <motion.button
                type="button"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="text-xs text-gray-500 hover:text-primary transition-colors"
                onClick={() =>
                  setMessage("Explain research methodology concepts")
                }
              >
                Research
              </motion.button>
              <motion.button
                type="button"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="text-xs text-gray-500 hover:text-primary transition-colors"
                onClick={() => setMessage("Create a study plan for me")}
              >
                Study Plan
              </motion.button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
