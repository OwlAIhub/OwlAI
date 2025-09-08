"use client";

import { motion } from "framer-motion";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  Copy,
  RotateCcw,
  ThumbsUp,
  ThumbsDown,
  MoreHorizontal,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useState } from "react";
import { cn } from "@/lib/utils";

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
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, ease: "easeOut" }}
      className={cn(
        "group flex gap-3 px-4 py-6 hover:bg-gray-50/50 transition-colors",
        isUser && "flex-row-reverse",
      )}
      onMouseEnter={() => setShowActions(true)}
      onMouseLeave={() => setShowActions(false)}
    >
      {/* Avatar */}
      <div className="flex-shrink-0">
        {isAI ? (
          <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center">
            <svg
              className="w-5 h-5 text-white"
              viewBox="0 0 24 24"
              fill="currentColor"
            >
              <path d="M12 2C13.1 2 14 2.9 14 4C14 5.1 13.1 6 12 6C10.9 6 10 5.1 10 4C10 2.9 10.9 2 12 2ZM21 9V7L15 1L13.5 2.5L16.17 5.17C15.24 5.06 14.32 5 13.4 5C10.2 5 7.13 5.69 4.42 7.01C2.84 7.76 2 9.38 2 11.13V20C2 21.1 2.9 22 4 22H8V19H4V11.13C4 10.76 4.18 10.42 4.5 10.26C6.71 9.2 9.5 8.5 12.4 8.5C13.13 8.5 13.85 8.54 14.56 8.62L12 11.18V22H20C21.1 22 22 21.1 22 20V9H21Z" />
            </svg>
          </div>
        ) : (
          <Avatar className="w-8 h-8">
            <AvatarFallback className="bg-gray-300 text-gray-700 text-sm font-medium">
              You
            </AvatarFallback>
          </Avatar>
        )}
      </div>

      {/* Message Content */}
      <div
        className={cn("flex-1 min-w-0", isUser && "flex flex-col items-end")}
      >
        {/* Message Header */}
        <div
          className={cn(
            "flex items-center gap-2 mb-1",
            isUser && "flex-row-reverse",
          )}
        >
          <span className="text-sm font-medium text-gray-900">
            {isAI ? "OwlAI" : "You"}
          </span>
          <span className="text-xs text-gray-500">{formatTime(timestamp)}</span>
          {status === "sending" && (
            <div className="flex items-center gap-1 text-xs text-gray-500">
              <div className="w-1 h-1 bg-gray-400 rounded-full animate-pulse" />
              Sending...
            </div>
          )}
          {status === "error" && (
            <span className="text-xs text-red-500">Failed to send</span>
          )}
        </div>

        {/* Message Bubble */}
        <div
          className={cn(
            "relative max-w-[85%] rounded-2xl px-4 py-3 text-sm leading-relaxed",
            isUser
              ? "bg-primary text-white ml-auto"
              : "bg-white border border-gray-200 shadow-sm",
            status === "error" && "bg-red-50 border-red-200 text-red-800",
          )}
        >
          {/* Message Text */}
          <div className="whitespace-pre-wrap break-words">{content}</div>

          {/* Status Indicator for User Messages */}
          {isUser && status === "sending" && (
            <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-gray-300 rounded-full animate-pulse" />
          )}
          {isUser && status === "sent" && (
            <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-green-500 rounded-full" />
          )}
        </div>

        {/* Message Actions */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{
            opacity: showActions ? 1 : 0,
            scale: showActions ? 1 : 0.95,
          }}
          transition={{ duration: 0.15 }}
          className={cn(
            "flex items-center gap-1 mt-2",
            isUser ? "justify-end" : "justify-start",
          )}
        >
          {/* Copy Button */}
          <Button
            variant="ghost"
            size="sm"
            onClick={handleCopy}
            className="h-7 px-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100"
          >
            <Copy className="w-3 h-3" />
            {copied && <span className="ml-1 text-xs">Copied!</span>}
          </Button>

          {/* AI Message Actions */}
          {isAI && (
            <>
              {/* Regenerate Button */}
              <Button
                variant="ghost"
                size="sm"
                onClick={handleRegenerate}
                className="h-7 px-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100"
              >
                <RotateCcw className="w-3 h-3" />
              </Button>

              {/* Feedback Buttons */}
              <div className="flex items-center gap-1 ml-1">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleFeedback("like")}
                  className={cn(
                    "h-7 px-2 hover:bg-gray-100",
                    feedback === "like"
                      ? "text-green-600 bg-green-50"
                      : "text-gray-500 hover:text-gray-700",
                  )}
                >
                  <ThumbsUp className="w-3 h-3" />
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleFeedback("dislike")}
                  className={cn(
                    "h-7 px-2 hover:bg-gray-100",
                    feedback === "dislike"
                      ? "text-red-600 bg-red-50"
                      : "text-gray-500 hover:text-gray-700",
                  )}
                >
                  <ThumbsDown className="w-3 h-3" />
                </Button>
              </div>

              {/* More Actions */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-7 px-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100"
                  >
                    <MoreHorizontal className="w-3 h-3" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="start" className="w-40">
                  <DropdownMenuItem onClick={() => handleCopy()}>
                    <Copy className="w-3 h-3 mr-2" />
                    Copy message
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => handleRegenerate()}>
                    <RotateCcw className="w-3 h-3 mr-2" />
                    Regenerate
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </>
          )}
        </motion.div>
      </div>
    </motion.div>
  );
}
