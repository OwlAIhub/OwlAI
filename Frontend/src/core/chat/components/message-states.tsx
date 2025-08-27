import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  CheckCircle,
  Clock,
  AlertCircle,
  RotateCcw,
  Send,
  Loader2,
  Wifi,
  WifiOff,
} from "lucide-react";

export type MessageState =
  | "sending"
  | "sent"
  | "streaming"
  | "complete"
  | "error"
  | "retrying"
  | "offline";

interface MessageStateIndicatorProps {
  state: MessageState;
  isUser: boolean;
  darkMode?: boolean;
  onRetry?: () => void;
  className?: string;
}

export const MessageStateIndicator: React.FC<MessageStateIndicatorProps> = ({
  state,
  isUser,
  darkMode = false,
  onRetry,
  className = "",
}) => {
  const getStateConfig = () => {
    switch (state) {
      case "sending":
        return {
          icon: <Loader2 className="w-4 h-4 animate-spin" />,
          text: "Sending...",
          color: "text-blue-500",
          bgColor: "bg-blue-50 dark:bg-blue-900/20",
          borderColor: "border-blue-200 dark:border-blue-700",
        };
      case "sent":
        return {
          icon: <CheckCircle className="w-4 h-4" />,
          text: "Sent",
          color: "text-green-500",
          bgColor: "bg-green-50 dark:bg-green-900/20",
          borderColor: "border-green-200 dark:border-green-700",
        };
      case "streaming":
        return {
          icon: (
            <div className="flex space-x-1">
              <div className="w-1.5 h-1.5 bg-[#52B788] rounded-full animate-pulse"></div>
              <div
                className="w-1.5 h-1.5 bg-[#52B788] rounded-full animate-pulse"
                style={{ animationDelay: "0.2s" }}
              ></div>
              <div
                className="w-1.5 h-1.5 bg-[#52B788] rounded-full animate-pulse"
                style={{ animationDelay: "0.4s" }}
              ></div>
            </div>
          ),
          text: "AI is thinking...",
          color: "text-[#52B788]",
          bgColor: "bg-green-50 dark:bg-green-900/20",
          borderColor: "border-green-200 dark:border-green-700",
        };
      case "complete":
        return {
          icon: <CheckCircle className="w-4 h-4" />,
          text: "Complete",
          color: "text-green-500",
          bgColor: "bg-green-50 dark:bg-green-900/20",
          borderColor: "border-green-200 dark:border-green-700",
        };
      case "error":
        return {
          icon: <AlertCircle className="w-4 h-4" />,
          text: "Failed",
          color: "text-red-500",
          bgColor: "bg-red-50 dark:bg-red-900/20",
          borderColor: "border-red-200 dark:border-red-700",
        };
      case "retrying":
        return {
          icon: <RotateCcw className="w-4 h-4 animate-spin" />,
          text: "Retrying...",
          color: "text-yellow-500",
          bgColor: "bg-yellow-50 dark:bg-yellow-900/20",
          borderColor: "border-yellow-200 dark:border-yellow-700",
        };
      case "offline":
        return {
          icon: <WifiOff className="w-4 h-4" />,
          text: "Offline",
          color: "text-gray-500",
          bgColor: "bg-gray-50 dark:bg-gray-900/20",
          borderColor: "border-gray-200 dark:border-gray-700",
        };
      default:
        return {
          icon: <Send className="w-4 h-4" />,
          text: "Ready",
          color: "text-gray-500",
          bgColor: "bg-gray-50 dark:bg-gray-900/20",
          borderColor: "border-gray-200 dark:border-gray-700",
        };
    }
  };

  const config = getStateConfig();

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={state}
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.8 }}
        transition={{ duration: 0.2 }}
        className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-medium border ${config.bgColor} ${config.borderColor} ${config.color} ${className}`}
      >
        <span className="flex items-center justify-center">{config.icon}</span>
        <span>{config.text}</span>

        {state === "error" && onRetry && (
          <button
            onClick={onRetry}
            className="ml-2 p-1 hover:bg-red-100 dark:hover:bg-red-800/30 rounded-full transition-colors"
            title="Retry"
          >
            <RotateCcw className="w-3 h-3" />
          </button>
        )}
      </motion.div>
    </AnimatePresence>
  );
};

interface MessageStatusBarProps {
  states: Array<{
    id: string;
    state: MessageState;
    timestamp: Date;
    isUser: boolean;
  }>;
  darkMode?: boolean;
  onRetry?: (id: string) => void;
}

export const MessageStatusBar: React.FC<MessageStatusBarProps> = ({
  states,
  darkMode = false,
  onRetry,
}) => {
  return (
    <div className="flex flex-wrap gap-2 p-3 bg-gray-50 dark:bg-gray-800/50 rounded-lg border border-gray-200 dark:border-gray-700">
      {states.map(({ id, state, timestamp, isUser }) => (
        <div key={id} className="flex items-center gap-2">
          <MessageStateIndicator
            state={state}
            isUser={isUser}
            darkMode={darkMode}
            onRetry={() => onRetry?.(id)}
          />
          <span className="text-xs text-gray-500 dark:text-gray-400">
            {timestamp.toLocaleTimeString()}
          </span>
        </div>
      ))}
    </div>
  );
};

interface ConnectionStatusProps {
  isOnline: boolean;
  darkMode?: boolean;
}

export const ConnectionStatus: React.FC<ConnectionStatusProps> = ({
  isOnline,
  darkMode = false,
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      className={`fixed top-4 right-4 z-50 flex items-center gap-2 px-3 py-2 rounded-full text-sm font-medium shadow-lg ${
        isOnline
          ? "bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300 border border-green-200 dark:border-green-700"
          : "bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300 border border-red-200 dark:border-red-700"
      }`}
    >
      {isOnline ? (
        <Wifi className="w-4 h-4" />
      ) : (
        <WifiOff className="w-4 h-4" />
      )}
      <span>{isOnline ? "Connected" : "Offline"}</span>
    </motion.div>
  );
};
