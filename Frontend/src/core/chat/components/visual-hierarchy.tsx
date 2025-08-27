import React from "react";
import { motion } from "framer-motion";
import {
  User,
  Bot,
  AlertTriangle,
  Info,
  CheckCircle,
  Clock,
  MessageSquare,
  Sparkles,
} from "lucide-react";

export type MessageType =
  | "user"
  | "assistant"
  | "system"
  | "error"
  | "info"
  | "success"
  | "warning";

export type MessagePriority = "low" | "medium" | "high" | "urgent";

interface MessageAvatarProps {
  type: MessageType;
  priority?: MessagePriority;
  size?: "sm" | "md" | "lg";
  className?: string;
}

export const MessageAvatar: React.FC<MessageAvatarProps> = ({
  type,
  priority = "medium",
  size = "md",
  className = "",
}) => {
  const getSizeClasses = () => {
    switch (size) {
      case "sm":
        return "w-6 h-6 text-xs";
      case "md":
        return "w-8 h-8 text-sm";
      case "lg":
        return "w-10 h-10 text-base";
      default:
        return "w-8 h-8 text-sm";
    }
  };

  const getAvatarConfig = () => {
    switch (type) {
      case "user":
        return {
          icon: <User className="w-4 h-4" />,
          bgColor: "bg-[#52B788]",
          textColor: "text-white",
          borderColor: "border-[#52B788]",
          priorityColors: {
            low: "bg-[#52B788]/80",
            medium: "bg-[#52B788]",
            high: "bg-[#40916C]",
            urgent: "bg-[#2D5A3D]",
          },
        };
      case "assistant":
        return {
          icon: <Bot className="w-4 h-4" />,
          bgColor: "bg-gradient-to-br from-[#52B788] to-[#40916C]",
          textColor: "text-white",
          borderColor: "border-[#52B788]",
          priorityColors: {
            low: "bg-gradient-to-br from-[#52B788]/80 to-[#40916C]/80",
            medium: "bg-gradient-to-br from-[#52B788] to-[#40916C]",
            high: "bg-gradient-to-br from-[#40916C] to-[#2D5A3D]",
            urgent: "bg-gradient-to-br from-[#2D5A3D] to-[#1A3D2A]",
          },
        };
      case "system":
        return {
          icon: <Info className="w-4 h-4" />,
          bgColor: "bg-blue-500",
          textColor: "text-white",
          borderColor: "border-blue-500",
          priorityColors: {
            low: "bg-blue-400",
            medium: "bg-blue-500",
            high: "bg-blue-600",
            urgent: "bg-blue-700",
          },
        };
      case "error":
        return {
          icon: <AlertTriangle className="w-4 h-4" />,
          bgColor: "bg-red-500",
          textColor: "text-white",
          borderColor: "border-red-500",
          priorityColors: {
            low: "bg-red-400",
            medium: "bg-red-500",
            high: "bg-red-600",
            urgent: "bg-red-700",
          },
        };
      case "success":
        return {
          icon: <CheckCircle className="w-4 h-4" />,
          bgColor: "bg-green-500",
          textColor: "text-white",
          borderColor: "border-green-500",
          priorityColors: {
            low: "bg-green-400",
            medium: "bg-green-500",
            high: "bg-green-600",
            urgent: "bg-green-700",
          },
        };
      case "warning":
        return {
          icon: <AlertTriangle className="w-4 h-4" />,
          bgColor: "bg-yellow-500",
          textColor: "text-white",
          borderColor: "border-yellow-500",
          priorityColors: {
            low: "bg-yellow-400",
            medium: "bg-yellow-500",
            high: "bg-yellow-600",
            urgent: "bg-yellow-700",
          },
        };
      default:
        return {
          icon: <MessageSquare className="w-4 h-4" />,
          bgColor: "bg-gray-500",
          textColor: "text-white",
          borderColor: "border-gray-500",
          priorityColors: {
            low: "bg-gray-400",
            medium: "bg-gray-500",
            high: "bg-gray-600",
            urgent: "bg-gray-700",
          },
        };
    }
  };

  const config = getAvatarConfig();
  const priorityColor = config.priorityColors[priority];

  return (
    <motion.div
      whileHover={{ scale: 1.05 }}
      className={`${getSizeClasses()} ${priorityColor} ${config.textColor} ${config.borderColor} rounded-full flex items-center justify-center border-2 shadow-sm ${className}`}
    >
      {config.icon}
    </motion.div>
  );
};

interface MessageBubbleProps {
  type: MessageType;
  priority?: MessagePriority;
  children: React.ReactNode;
  className?: string;
  isStreaming?: boolean;
  hasError?: boolean;
}

export const MessageBubble: React.FC<MessageBubbleProps> = ({
  type,
  priority = "medium",
  children,
  className = "",
  isStreaming = false,
  hasError = false,
}) => {
  const getBubbleStyles = () => {
    const baseStyles =
      "rounded-2xl shadow-sm border transition-all duration-200 hover:shadow-md";

    switch (type) {
      case "user":
        return `${baseStyles} bg-gradient-to-r from-[#52B788] to-[#40916C] text-white border-[#52B788]`;
      case "assistant":
        return `${baseStyles} bg-white text-gray-900 border-gray-200 shadow-md dark:bg-gray-800 dark:border-gray-700 dark:text-white`;
      case "system":
        return `${baseStyles} bg-blue-50 text-blue-900 border-blue-200 dark:bg-blue-900/20 dark:text-blue-100 dark:border-blue-700`;
      case "error":
        return `${baseStyles} bg-red-50 text-red-900 border-red-200 dark:bg-red-900/20 dark:text-red-100 dark:border-red-700`;
      case "success":
        return `${baseStyles} bg-green-50 text-green-900 border-green-200 dark:bg-green-900/20 dark:text-green-100 dark:border-green-700`;
      case "warning":
        return `${baseStyles} bg-yellow-50 text-yellow-900 border-yellow-200 dark:bg-yellow-900/20 dark:text-yellow-100 dark:border-yellow-700`;
      default:
        return `${baseStyles} bg-gray-50 text-gray-900 border-gray-200 dark:bg-gray-800 dark:text-gray-100 dark:border-gray-700`;
    }
  };

  const getPriorityStyles = () => {
    switch (priority) {
      case "low":
        return "opacity-75";
      case "medium":
        return "";
      case "high":
        return "ring-2 ring-[#52B788]/20";
      case "urgent":
        return "ring-2 ring-red-500/30 animate-pulse";
      default:
        return "";
    }
  };

  const getStreamingStyles = () => {
    if (isStreaming) {
      return "animate-pulse border-[#52B788]";
    }
    return "";
  };

  const getErrorStyles = () => {
    if (hasError) {
      return "border-red-500 bg-red-50 dark:bg-red-900/20";
    }
    return "";
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className={`${getBubbleStyles()} ${getPriorityStyles()} ${getStreamingStyles()} ${getErrorStyles()} ${className}`}
    >
      {children}
    </motion.div>
  );
};

interface MessageHeaderProps {
  type: MessageType;
  priority?: MessagePriority;
  title?: string;
  timestamp?: string;
  status?: string;
  className?: string;
}

export const MessageHeader: React.FC<MessageHeaderProps> = ({
  type,
  priority = "medium",
  title,
  timestamp,
  status,
  className = "",
}) => {
  const getTitleConfig = () => {
    switch (type) {
      case "user":
        return {
          icon: <User className="w-4 h-4" />,
          text: title || "You",
          color: "text-white",
        };
      case "assistant":
        return {
          icon: <Bot className="w-4 h-4" />,
          text: title || "AI Assistant",
          color: "text-[#52B788]",
        };
      case "system":
        return {
          icon: <Info className="w-4 h-4" />,
          text: title || "System",
          color: "text-blue-600 dark:text-blue-400",
        };
      case "error":
        return {
          icon: <AlertTriangle className="w-4 h-4" />,
          text: title || "Error",
          color: "text-red-600 dark:text-red-400",
        };
      case "success":
        return {
          icon: <CheckCircle className="w-4 h-4" />,
          text: title || "Success",
          color: "text-green-600 dark:text-green-400",
        };
      case "warning":
        return {
          icon: <AlertTriangle className="w-4 h-4" />,
          text: title || "Warning",
          color: "text-yellow-600 dark:text-yellow-400",
        };
      default:
        return {
          icon: <MessageSquare className="w-4 h-4" />,
          text: title || "Message",
          color: "text-gray-600 dark:text-gray-400",
        };
    }
  };

  const config = getTitleConfig();

  return (
    <div className={`flex items-center justify-between mb-2 ${className}`}>
      <div className="flex items-center gap-2">
        <span className={config.color}>{config.icon}</span>
        <span className={`font-medium text-sm ${config.color}`}>
          {config.text}
        </span>
        {priority === "high" && <Sparkles className="w-3 h-3 text-[#52B788]" />}
        {priority === "urgent" && (
          <AlertTriangle className="w-3 h-3 text-red-500 animate-pulse" />
        )}
      </div>

      <div className="flex items-center gap-2 text-xs text-gray-500 dark:text-gray-400">
        {timestamp && <span>{timestamp}</span>}
        {status && (
          <span className="px-2 py-1 bg-gray-100 dark:bg-gray-700 rounded-full">
            {status}
          </span>
        )}
      </div>
    </div>
  );
};

interface MessageContainerProps {
  type: MessageType;
  priority?: MessagePriority;
  isUser: boolean;
  children: React.ReactNode;
  className?: string;
}

export const MessageContainer: React.FC<MessageContainerProps> = ({
  type,
  priority = "medium",
  isUser,
  children,
  className = "",
}) => {
  return (
    <div
      className={`flex w-full mb-6 ${isUser ? "justify-end" : "justify-start"} ${className}`}
    >
      <div className="flex items-start gap-3 max-w-[85%] sm:max-w-3xl">
        {!isUser && <MessageAvatar type={type} priority={priority} />}

        <div className="flex-1">{children}</div>

        {isUser && <MessageAvatar type={type} priority={priority} />}
      </div>
    </div>
  );
};
