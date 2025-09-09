"use client";

import { cn } from "@/lib/utils";
import { motion } from "framer-motion";
import Image from "next/image";

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
        <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center p-1">
          <Image
            src="/apple-touch-icon.png"
            alt="OwlAI"
            width={32}
            height={32}
            className="w-full h-full object-contain"
            unoptimized
          />
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
