"use client";

import { Button } from "@/components/ui/button";
import { Markdown } from "@/components/ui/markdown";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";
import {
  Check,
  Copy,
  RotateCcw,
  ThumbsDown,
  ThumbsUp,
} from "lucide-react";
import { useState } from "react";

export interface ChatMessageProps {
  id: string;
  content: string;
  sender: "user" | "ai";
  timestamp: Date;
  status?: "sending" | "sent" | "error";
  onCopy?: (content: string) => void;
  onRegenerate?: (messageId: string) => void;
  onFeedback?: (messageId: string, type: "like" | "dislike") => void;
}

export function ChatMessage({
  id,
  content,
  sender,
  timestamp,
  status = "sent",
  onCopy,
  onRegenerate,
  onFeedback,
}: ChatMessageProps) {
  const [showActions, setShowActions] = useState(false);
  const [copied, setCopied] = useState(false);
  const [feedback, setFeedback] = useState<"like" | "dislike" | null>(null);

  const isUser = sender === "user";
  const isAI = sender === "ai";

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(content);
      setCopied(true);
      onCopy?.(content);
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      console.error("Failed to copy text:", error);
    }
  };

  const handleRegenerate = () => {
    onRegenerate?.(id);
  };

  const handleFeedback = (type: "like" | "dislike") => {
    const newFeedback = feedback === type ? null : type;
    setFeedback(newFeedback);
    if (newFeedback) {
      onFeedback?.(id, newFeedback);
    }
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: false,
    });
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.15, ease: [0.25, 0.1, 0.25, 1] }}
      className={cn(
        "group relative px-3 sm:px-6 py-4 sm:py-8 transition-all duration-150",
        isUser
          ? "bg-transparent"
          : "bg-gradient-to-r from-gray-50/40 to-transparent border-l-2 border-primary/10 hover:border-primary/20 hover:bg-gray-50/60"
      )}
      onMouseEnter={() => setShowActions(true)}
      onMouseLeave={() => setShowActions(false)}
    >
      <div className={cn(
        "max-w-5xl mx-auto flex gap-3 sm:gap-6",
        isUser && "flex-row-reverse"
      )}>
        {/* Avatar */}
        <div className={cn(
          "flex-shrink-0 mt-1",
          isUser && "ml-2 sm:ml-4"
        )}>
          {isAI ? (
            <div className="w-7 h-7 sm:w-9 sm:h-9 rounded-lg sm:rounded-xl bg-gradient-to-br from-primary to-primary/80 flex items-center justify-center shadow-sm ring-1 ring-primary/20">
              <svg className="w-4 h-4 sm:w-5 sm:h-5 text-white" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 2C13.1 2 14 2.9 14 4C14 5.1 13.1 6 12 6C10.9 6 10 5.1 10 4C10 2.9 10.9 2 12 2ZM21 9V7L15 1L13.5 2.5L16.17 5.17C15.24 5.06 14.32 5 13.4 5C10.2 5 7.13 5.69 4.42 7.01C2.84 7.76 2 9.38 2 11.13V20C2 21.1 2.9 22 4 22H8V19H4V11.13C4 10.76 4.18 10.42 4.5 10.26C6.71 9.2 9.5 8.5 12.4 8.5C13.13 8.5 13.85 8.54 14.56 8.62L12 11.18V22H20C21.1 22 22 21.1 22 20V9H21Z" />
              </svg>
            </div>
          ) : (
            <div className="w-7 h-7 sm:w-9 sm:h-9 rounded-lg sm:rounded-xl bg-gradient-to-br from-gray-600 to-gray-700 flex items-center justify-center shadow-sm ring-1 ring-gray-300/30">
              <span className="text-white text-xs sm:text-sm font-semibold">You</span>
            </div>
          )}
        </div>

        {/* Message Content */}
        <div className={cn(
          "flex-1 min-w-0 max-w-full sm:max-w-4xl",
          isUser && "text-right"
        )}>
          {/* Message Header */}
          <div className={cn(
            "flex items-center gap-2 sm:gap-3 mb-2 sm:mb-3",
            isUser && "flex-row-reverse justify-start"
          )}>
            <span className="text-sm sm:text-base font-bold text-gray-900 tracking-tight">
              {isAI ? "OwlAI Learning Assistant" : "You"}
            </span>
            <span className="text-xs text-gray-500 font-medium">
              {formatTime(timestamp)}
            </span>
            {status === "sending" && (
              <div className="flex items-center gap-2 text-xs text-gray-500">
                <div className="flex gap-1">
                  <div className="w-1.5 h-1.5 bg-primary rounded-full animate-pulse" />
                  <div className="w-1.5 h-1.5 bg-primary rounded-full animate-pulse" style={{animationDelay: '0.2s'}} />
                  <div className="w-1.5 h-1.5 bg-primary rounded-full animate-pulse" style={{animationDelay: '0.4s'}} />
                </div>
                <span className="font-medium">Thinking...</span>
              </div>
            )}
            {status === "error" && (
              <span className="text-xs text-red-600 font-semibold bg-red-50 px-2 py-1 rounded-full">Failed to send</span>
            )}
            {status === "sent" && isUser && (
              <div className="flex items-center gap-1 text-xs text-green-600 font-medium">
                <Check className="w-3 h-3" />
                <span>Delivered</span>
              </div>
            )}
          </div>

          {/* Message Body */}
          <div className={cn(
            "text-gray-900 leading-relaxed",
            isUser ? "text-right" : "text-left"
          )}>
            {isUser ? (
              <div className="inline-block max-w-2xl bg-primary text-white px-6 py-4 rounded-2xl rounded-tr-md shadow-sm">
                <div className="text-base font-medium leading-relaxed whitespace-pre-wrap break-words">
                  {content}
                </div>
              </div>
            ) : (
              <div className="prose prose-lg max-w-none">
                <Markdown content={content} className="text-base leading-7" />
              </div>
            )}
          </div>

          {/* Quick Actions for AI Messages */}
          {isAI && (
            <div className="mt-4 flex flex-wrap gap-2">
              <Button
                variant="outline"
                size="sm"
                className="h-9 px-4 text-sm font-medium border-primary/20 text-primary hover:bg-primary/5 hover:border-primary/30 transition-all duration-150"
                onClick={() => console.log('Tell me more')}
              >
                Tell me more
              </Button>
              <Button
                variant="outline"
                size="sm"
                className="h-9 px-4 text-sm font-medium border-primary/20 text-primary hover:bg-primary/5 hover:border-primary/30 transition-all duration-150"
                onClick={() => console.log('Give example')}
              >
                Give an example
              </Button>
              <Button
                variant="outline"
                size="sm"
                className="h-9 px-4 text-sm font-medium border-primary/20 text-primary hover:bg-primary/5 hover:border-primary/30 transition-all duration-150"
                onClick={() => console.log('Quiz me')}
              >
                Quiz me on this
              </Button>
            </div>
          )}

          {/* Message Actions */}
          <motion.div
            initial={{ opacity: 0, y: 4 }}
            animate={{ opacity: showActions ? 1 : 0, y: showActions ? 0 : 4 }}
            transition={{ duration: 0.15 }}
            className={cn(
              "flex items-center gap-2 mt-4",
              isUser ? "justify-end" : "justify-start"
            )}
          >
            {/* Copy Button */}
            <Button
              variant="ghost"
              size="sm"
              onClick={handleCopy}
              className={cn(
                "h-9 px-3 text-gray-600 hover:text-gray-800 hover:bg-gray-100 transition-all duration-150 rounded-lg",
                copied && "text-green-600 bg-green-50"
              )}
            >
              {copied ? (
                <>
                  <Check className="w-4 h-4 mr-2" />
                  <span className="text-sm font-medium">Copied!</span>
                </>
              ) : (
                <>
                  <Copy className="w-4 h-4 mr-2" />
                  <span className="text-sm font-medium">Copy</span>
                </>
              )}
            </Button>

            {/* AI Message Actions */}
            {isAI && (
              <>
                {/* Regenerate Button */}
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleRegenerate}
                  className="h-9 px-3 text-gray-600 hover:text-gray-800 hover:bg-gray-100 transition-all duration-150 rounded-lg"
                >
                  <RotateCcw className="w-4 h-4 mr-2" />
                  <span className="text-sm font-medium">Regenerate</span>
                </Button>

                {/* Feedback Buttons */}
                <div className="flex items-center gap-1 ml-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleFeedback("like")}
                    className={cn(
                      "h-9 px-3 transition-all duration-150 rounded-lg",
                      feedback === "like"
                        ? "text-green-600 bg-green-50 hover:bg-green-100"
                        : "text-gray-600 hover:text-gray-800 hover:bg-gray-100"
                    )}
                  >
                    <ThumbsUp className="w-4 h-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleFeedback("dislike")}
                    className={cn(
                      "h-9 px-3 transition-all duration-150 rounded-lg",
                      feedback === "dislike"
                        ? "text-red-600 bg-red-50 hover:bg-red-100"
                        : "text-gray-600 hover:text-gray-800 hover:bg-gray-100"
                    )}
                  >
                    <ThumbsDown className="w-4 h-4" />
                  </Button>
                </div>
              </>
            )}
          </motion.div>
        </div>
      </div>
    </motion.div>
  );
}
