"use client";

import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

export interface TypingIndicatorProps {
  className?: string;
  message?: string;
}

export function TypingIndicator({
  className,
  message = "OwlAI is thinking...",
}: TypingIndicatorProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.3, ease: "easeOut" }}
      className={cn("flex gap-3 px-4 py-6", className)}
    >
      {/* AI Avatar */}
      <div className="flex-shrink-0">
        <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center">
          <svg
            className="w-5 h-5 text-white"
            viewBox="0 0 24 24"
            fill="currentColor"
          >
            <path d="M12 2C13.1 2 14 2.9 14 4C14 5.1 13.1 6 12 6C10.9 6 10 5.1 10 4C10 2.9 10.9 2 12 2ZM21 9V7L15 1L13.5 2.5L16.17 5.17C15.24 5.06 14.32 5 13.4 5C10.2 5 7.13 5.69 4.42 7.01C2.84 7.76 2 9.38 2 11.13V20C2 21.1 2.9 22 4 22H8V19H4V11.13C4 10.76 4.18 10.42 4.5 10.26C6.71 9.2 9.5 8.5 12.4 8.5C13.13 8.5 13.85 8.54 14.56 8.62L12 11.18V22H20C21.1 22 22 21.1 22 20V9H21Z" />
          </svg>
        </div>
      </div>

      {/* Typing Content */}
      <div className="flex-1 min-w-0">
        {/* Header */}
        <div className="flex items-center gap-2 mb-1">
          <span className="text-sm font-medium text-gray-900">OwlAI</span>
          <span className="text-xs text-gray-500">now</span>
        </div>

        {/* Clean Typing Indicator */}
        <div className="flex items-center gap-2">
          {/* Typing Animation */}
          <div className="flex items-center gap-1">
            <motion.div
              className="w-2 h-2 bg-primary rounded-full"
              animate={{
                scale: [1, 1.2, 1],
                opacity: [0.5, 1, 0.5],
              }}
              transition={{
                duration: 1.2,
                repeat: Infinity,
                delay: 0,
              }}
            />
            <motion.div
              className="w-2 h-2 bg-primary rounded-full"
              animate={{
                scale: [1, 1.2, 1],
                opacity: [0.5, 1, 0.5],
              }}
              transition={{
                duration: 1.2,
                repeat: Infinity,
                delay: 0.2,
              }}
            />
            <motion.div
              className="w-2 h-2 bg-primary rounded-full"
              animate={{
                scale: [1, 1.2, 1],
                opacity: [0.5, 1, 0.5],
              }}
              transition={{
                duration: 1.2,
                repeat: Infinity,
                delay: 0.4,
              }}
            />
          </div>

          {/* Typing Message */}
          <span className="text-sm text-gray-600 font-medium">{message}</span>
        </div>
      </div>
    </motion.div>
  );
}

// Alternative compact typing indicator for input areas
export function CompactTypingIndicator({ className }: { className?: string }) {
  return (
    <div
      className={cn("flex items-center gap-2 text-sm text-gray-600", className)}
    >
      <div className="flex items-center gap-1">
        <motion.div
          className="w-1.5 h-1.5 bg-primary rounded-full"
          animate={{
            scale: [1, 1.3, 1],
            opacity: [0.4, 1, 0.4],
          }}
          transition={{
            duration: 1,
            repeat: Infinity,
            delay: 0,
          }}
        />
        <motion.div
          className="w-1.5 h-1.5 bg-primary rounded-full"
          animate={{
            scale: [1, 1.3, 1],
            opacity: [0.4, 1, 0.4],
          }}
          transition={{
            duration: 1,
            repeat: Infinity,
            delay: 0.15,
          }}
        />
        <motion.div
          className="w-1.5 h-1.5 bg-primary rounded-full"
          animate={{
            scale: [1, 1.3, 1],
            opacity: [0.4, 1, 0.4],
          }}
          transition={{
            duration: 1,
            repeat: Infinity,
            delay: 0.3,
          }}
        />
      </div>
    </div>
  );
}

// Pulse typing indicator for minimal spaces
export function PulseTypingIndicator({ className }: { className?: string }) {
  return (
    <motion.div
      className={cn("flex items-center justify-center p-2", className)}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <motion.div
        className="w-3 h-3 bg-primary rounded-full"
        animate={{
          scale: [1, 1.2, 1],
          opacity: [0.6, 1, 0.6],
        }}
        transition={{
          duration: 1.5,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />
    </motion.div>
  );
}
