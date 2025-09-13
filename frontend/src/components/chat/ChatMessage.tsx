"use client";

import { Button } from "@/components/ui/button";
import { Markdown } from "@/components/ui/markdown";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";
import {
  AlertCircle,
  Check,
  CheckCheck,
  Clock,
  Copy,
  RotateCcw,
  ThumbsDown,
  ThumbsUp,
} from "lucide-react";
import Image from "next/image";
import { useState } from "react";

export interface ChatMessageProps {
  id: string;
  content: string;
  sender: "user" | "ai";
  timestamp: Date;
  status?: "sending" | "sent" | "delivered" | "read" | "error";
  onCopy?: (content: string) => void;
  onRegenerate?: (messageId: string) => void;
  onFeedback?: (messageId: string, type: "like" | "dislike") => void;
  onSendMessage?: (message: string) => void;
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
  onSendMessage,
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
        "group relative px-6 py-6 transition-all duration-200",
        isUser
          ? "bg-transparent"
          : "bg-gradient-to-r from-gray-50/30 to-transparent border-l-4 border-primary/15 hover:border-primary/25 hover:bg-gray-50/50 rounded-r-lg",
      )}
      onMouseEnter={() => setShowActions(true)}
      onMouseLeave={() => setShowActions(false)}
    >
      <div
        className={cn(
          "max-w-5xl mx-auto flex gap-6",
          isUser && "flex-row-reverse",
        )}
      >
        {/* Avatar */}
        <div className={cn("flex-shrink-0 mt-1", isUser && "ml-2")}>
          {isAI ? (
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary to-primary/80 flex items-center justify-center shadow-sm ring-1 ring-primary/20 p-1">
              <Image
                src="/apple-touch-icon.png"
                alt="OwlAI"
                width={32}
                height={32}
                className="w-full h-full object-contain"
                unoptimized
              />
            </div>
          ) : (
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-gray-600 to-gray-700 flex items-center justify-center shadow-sm ring-1 ring-gray-300/30">
              <span className="text-white text-xs font-semibold">You</span>
            </div>
          )}
        </div>

        {/* Message Content */}
        <div className={cn("flex-1 min-w-0", isUser && "text-right")}>
          {/* Message Header */}
          <div
            className={cn(
              "flex items-center gap-2 mb-2",
              isUser && "flex-row-reverse justify-start",
            )}
          >
            <span className="text-sm font-bold text-gray-900 tracking-tight">
              {isAI ? "OwlAI Learning Assistant" : "You"}
            </span>
            <span className="text-xs text-gray-500 font-medium">
              {formatTime(timestamp)}
            </span>
            {/* Enhanced Status Indicators */}
            {status === "sending" && (
              <div className="flex items-center gap-2 text-xs text-gray-500">
                <Clock className="w-3 h-3 animate-pulse" />
                <span>Sending...</span>
              </div>
            )}
            {status === "sent" && (
              <div className="flex items-center gap-1 text-xs text-gray-500">
                <Check className="w-3 h-3" />
                <span>Sent</span>
              </div>
            )}
            {status === "delivered" && (
              <div className="flex items-center gap-1 text-xs text-blue-600">
                <CheckCheck className="w-3 h-3" />
                <span>Delivered</span>
              </div>
            )}
            {status === "read" && (
              <div className="flex items-center gap-1 text-xs text-green-600">
                <CheckCheck className="w-3 h-3 text-green-600" />
                <span>Read</span>
              </div>
            )}
            {status === "error" && (
              <div className="flex items-center gap-1 text-xs text-red-500">
                <AlertCircle className="w-3 h-3" />
                <span>Failed to send</span>
              </div>
            )}
          </div>

          {/* Message Body */}
          <div
            className={cn(
              "text-gray-900 leading-relaxed",
              isUser ? "text-right" : "text-left",
            )}
          >
            {isUser ? (
              <div className="inline-block max-w-2xl bg-primary text-white px-6 py-4 rounded-2xl rounded-tr-md shadow-sm">
                <div className="text-base font-medium leading-relaxed whitespace-pre-wrap break-words">
                  {content}
                </div>
              </div>
            ) : (
              <div className="prose prose-lg max-w-none">
                <Markdown content={content} className="text-base leading-7 max-w-full" />
              </div>
            )}
          </div>

          {/* Quick Actions for AI Messages */}
          {isAI && onSendMessage && (
            <div className="mt-4 flex flex-wrap gap-2">
              <Button
                variant="outline"
                size="sm"
                className="h-9 px-4 text-sm font-medium border-teal-200/60 text-teal-700 hover:bg-teal-50 hover:border-teal-300 hover:text-teal-800 transition-all duration-150"
                onClick={() => onSendMessage("Tell me more about this topic")}
              >
                Tell me more
              </Button>
              <Button
                variant="outline"
                size="sm"
                className="h-9 px-4 text-sm font-medium border-teal-200/60 text-teal-700 hover:bg-teal-50 hover:border-teal-300 hover:text-teal-800 transition-all duration-150"
                onClick={() =>
                  onSendMessage("Can you give me a practical example?")
                }
              >
                Give an example
              </Button>
              <Button
                variant="outline"
                size="sm"
                className="h-9 px-4 text-sm font-medium border-teal-200/60 text-teal-700 hover:bg-teal-50 hover:border-teal-300 hover:text-teal-800 transition-all duration-150"
                onClick={() => onSendMessage("Quiz me on this topic")}
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
              isUser ? "justify-end" : "justify-start",
            )}
          >
            {/* Copy Button */}
            <Button
              variant="ghost"
              size="sm"
              onClick={handleCopy}
              className={cn(
                "h-9 px-3 text-gray-600 hover:text-gray-800 hover:bg-gray-100 transition-all duration-150 rounded-lg",
                copied && "text-green-600 bg-green-50",
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
                        : "text-gray-600 hover:text-gray-800 hover:bg-gray-100",
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
                        : "text-gray-600 hover:text-gray-800 hover:bg-gray-100",
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
