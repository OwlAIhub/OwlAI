import React from "react";
import { motion } from "framer-motion";
import { colors, theme } from "./color-scheme";

// Base Card Component
interface BaseCardProps {
  children: React.ReactNode;
  className?: string;
  variant?: "default" | "elevated" | "outlined" | "ghost";
  size?: "sm" | "md" | "lg" | "xl";
  hover?: boolean;
  interactive?: boolean;
  darkMode?: boolean;
  onClick?: () => void;
}

export const BaseCard: React.FC<BaseCardProps> = ({
  children,
  className = "",
  variant = "default",
  size = "md",
  hover = false,
  interactive = false,
  darkMode = false,
  onClick,
}) => {
  const getVariantStyles = () => {
    const baseStyles = "rounded-xl border transition-all duration-200";

    switch (variant) {
      case "default":
        return `${baseStyles} bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 shadow-sm`;
      case "elevated":
        return `${baseStyles} bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 shadow-md hover:shadow-lg`;
      case "outlined":
        return `${baseStyles} bg-transparent border-gray-300 dark:border-gray-600 shadow-none`;
      case "ghost":
        return `${baseStyles} bg-gray-50 dark:bg-gray-900/50 border-transparent shadow-none`;
      default:
        return `${baseStyles} bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 shadow-sm`;
    }
  };

  const getSizeStyles = () => {
    switch (size) {
      case "sm":
        return "p-3";
      case "md":
        return "p-4";
      case "lg":
        return "p-6";
      case "xl":
        return "p-8";
      default:
        return "p-4";
    }
  };

  const getHoverStyles = () => {
    if (!hover) return "";

    return "hover:shadow-lg hover:border-gray-300 dark:hover:border-gray-600 hover:-translate-y-0.5";
  };

  const getInteractiveStyles = () => {
    if (!interactive) return "";

    return "cursor-pointer active:scale-95 focus:outline-none focus:ring-2 focus:ring-[#52B788] focus:ring-offset-2 dark:focus:ring-offset-gray-800";
  };

  const CardComponent = interactive ? motion.div : "div";

  return (
    <CardComponent
      className={`${getVariantStyles()} ${getSizeStyles()} ${getHoverStyles()} ${getInteractiveStyles()} ${className}`}
      onClick={onClick}
      whileHover={interactive ? { scale: 1.02 } : undefined}
      whileTap={interactive ? { scale: 0.98 } : undefined}
    >
      {children}
    </CardComponent>
  );
};

// Message Card - Specifically for chat messages
interface MessageCardProps {
  children: React.ReactNode;
  isUser: boolean;
  isStreaming?: boolean;
  hasError?: boolean;
  className?: string;
  darkMode?: boolean;
}

export const MessageCard: React.FC<MessageCardProps> = ({
  children,
  isUser,
  isStreaming = false,
  hasError = false,
  className = "",
  darkMode = false,
}) => {
  const getMessageStyles = () => {
    const baseStyles =
      "rounded-2xl border transition-all duration-200 max-w-[85%] sm:max-w-3xl";

    if (isUser) {
      return `${baseStyles} bg-gradient-to-r from-[#52B788] to-[#40916C] text-white border-[#52B788] shadow-sm hover:shadow-md`;
    } else {
      const bgColor = darkMode ? "bg-gray-800" : "bg-white";
      const borderColor = hasError
        ? "border-red-300 dark:border-red-600"
        : isStreaming
          ? "border-[#52B788]"
          : "border-gray-200 dark:border-gray-700";
      const textColor = darkMode ? "text-white" : "text-gray-900";

      return `${baseStyles} ${bgColor} ${borderColor} ${textColor} shadow-sm hover:shadow-md`;
    }
  };

  const getStreamingStyles = () => {
    if (isStreaming && !isUser) {
      return "animate-pulse border-[#52B788]";
    }
    return "";
  };

  const getErrorStyles = () => {
    if (hasError && !isUser) {
      return "border-red-500 bg-red-50 dark:bg-red-900/20";
    }
    return "";
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className={`${getMessageStyles()} ${getStreamingStyles()} ${getErrorStyles()} ${className}`}
    >
      {children}
    </motion.div>
  );
};

// Feature Card - For showcasing features
interface FeatureCardProps {
  icon?: React.ReactNode;
  title: string;
  description: string;
  variant?: "default" | "featured" | "minimal";
  className?: string;
  darkMode?: boolean;
  onClick?: () => void;
}

export const FeatureCard: React.FC<FeatureCardProps> = ({
  icon,
  title,
  description,
  variant = "default",
  className = "",
  darkMode = false,
  onClick,
}) => {
  const getVariantStyles = () => {
    switch (variant) {
      case "featured":
        return "bg-gradient-to-br from-[#52B788] to-[#40916C] text-white border-[#52B788] shadow-lg hover:shadow-xl";
      case "minimal":
        return "bg-transparent border-gray-200 dark:border-gray-700 shadow-none hover:bg-gray-50 dark:hover:bg-gray-800/50";
      default:
        return "bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 shadow-sm hover:shadow-md";
    }
  };

  const getIconStyles = () => {
    if (variant === "featured") {
      return "text-white";
    }
    return "text-[#52B788]";
  };

  const getTextStyles = () => {
    if (variant === "featured") {
      return "text-white";
    }
    return darkMode ? "text-white" : "text-gray-900";
  };

  return (
    <BaseCard
      variant="default"
      size="lg"
      hover={true}
      interactive={!!onClick}
      darkMode={darkMode}
      className={`${getVariantStyles()} ${className}`}
      onClick={onClick}
    >
      <div className="space-y-4">
        {icon && (
          <div
            className={`w-12 h-12 rounded-lg bg-[#52B788]/10 flex items-center justify-center ${getIconStyles()}`}
          >
            {icon}
          </div>
        )}
        <div className="space-y-2">
          <h3 className={`text-lg font-semibold ${getTextStyles()}`}>
            {title}
          </h3>
          <p
            className={`text-sm leading-relaxed ${variant === "featured" ? "text-white/90" : "text-gray-600 dark:text-gray-400"}`}
          >
            {description}
          </p>
        </div>
      </div>
    </BaseCard>
  );
};

// Stats Card - For displaying statistics
interface StatsCardProps {
  value: string | number;
  label: string;
  trend?: {
    value: number;
    isPositive: boolean;
  };
  icon?: React.ReactNode;
  className?: string;
  darkMode?: boolean;
}

export const StatsCard: React.FC<StatsCardProps> = ({
  value,
  label,
  trend,
  icon,
  className = "",
  darkMode = false,
}) => {
  return (
    <BaseCard
      variant="default"
      size="md"
      hover={true}
      darkMode={darkMode}
      className={`${className}`}
    >
      <div className="flex items-center justify-between">
        <div className="space-y-1">
          <p className="text-2xl font-bold text-gray-900 dark:text-white">
            {value}
          </p>
          <p className="text-sm text-gray-600 dark:text-gray-400">{label}</p>
          {trend && (
            <div className="flex items-center gap-1">
              <span
                className={`text-xs font-medium ${
                  trend.isPositive
                    ? "text-green-600 dark:text-green-400"
                    : "text-red-600 dark:text-red-400"
                }`}
              >
                {trend.isPositive ? "+" : ""}
                {trend.value}%
              </span>
              <span className="text-xs text-gray-500 dark:text-gray-400">
                from last month
              </span>
            </div>
          )}
        </div>
        {icon && (
          <div className="w-10 h-10 rounded-lg bg-[#52B788]/10 flex items-center justify-center text-[#52B788]">
            {icon}
          </div>
        )}
      </div>
    </BaseCard>
  );
};

// Action Card - For call-to-action elements
interface ActionCardProps {
  title: string;
  description?: string;
  action?: React.ReactNode;
  variant?: "primary" | "secondary" | "success" | "warning";
  className?: string;
  darkMode?: boolean;
  onClick?: () => void;
}

export const ActionCard: React.FC<ActionCardProps> = ({
  title,
  description,
  action,
  variant = "primary",
  className = "",
  darkMode = false,
  onClick,
}) => {
  const getVariantStyles = () => {
    switch (variant) {
      case "primary":
        return "bg-gradient-to-r from-[#52B788] to-[#40916C] text-white border-[#52B788]";
      case "secondary":
        return "bg-white dark:bg-gray-800 text-gray-900 dark:text-white border-gray-200 dark:border-gray-700";
      case "success":
        return "bg-green-50 dark:bg-green-900/20 text-green-900 dark:text-green-100 border-green-200 dark:border-green-700";
      case "warning":
        return "bg-yellow-50 dark:bg-yellow-900/20 text-yellow-900 dark:text-yellow-100 border-yellow-200 dark:border-yellow-700";
      default:
        return "bg-gradient-to-r from-[#52B788] to-[#40916C] text-white border-[#52B788]";
    }
  };

  return (
    <BaseCard
      variant="default"
      size="lg"
      hover={true}
      interactive={!!onClick}
      darkMode={darkMode}
      className={`${getVariantStyles()} ${className}`}
      onClick={onClick}
    >
      <div className="flex items-center justify-between">
        <div className="space-y-1">
          <h3 className="text-lg font-semibold">{title}</h3>
          {description && <p className="text-sm opacity-90">{description}</p>}
        </div>
        {action && <div className="flex-shrink-0">{action}</div>}
      </div>
    </BaseCard>
  );
};

// Loading Card - For skeleton loading states
interface LoadingCardProps {
  variant?: "message" | "feature" | "stats";
  className?: string;
  darkMode?: boolean;
}

export const LoadingCard: React.FC<LoadingCardProps> = ({
  variant = "message",
  className = "",
  darkMode = false,
}) => {
  const getSkeletonContent = () => {
    switch (variant) {
      case "message":
        return (
          <div className="space-y-3">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-gray-200 dark:bg-gray-700 rounded-full animate-pulse" />
              <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-24 animate-pulse" />
            </div>
            <div className="space-y-2">
              <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-full animate-pulse" />
              <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4 animate-pulse" />
              <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/2 animate-pulse" />
            </div>
          </div>
        );
      case "feature":
        return (
          <div className="space-y-4">
            <div className="w-12 h-12 bg-gray-200 dark:bg-gray-700 rounded-lg animate-pulse" />
            <div className="space-y-2">
              <div className="h-5 bg-gray-200 dark:bg-gray-700 rounded w-3/4 animate-pulse" />
              <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-full animate-pulse" />
              <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-2/3 animate-pulse" />
            </div>
          </div>
        );
      case "stats":
        return (
          <div className="flex items-center justify-between">
            <div className="space-y-2">
              <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-16 animate-pulse" />
              <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-20 animate-pulse" />
            </div>
            <div className="w-10 h-10 bg-gray-200 dark:bg-gray-700 rounded-lg animate-pulse" />
          </div>
        );
      default:
        return (
          <div className="space-y-2">
            <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-full animate-pulse" />
            <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4 animate-pulse" />
          </div>
        );
    }
  };

  return (
    <BaseCard
      variant="default"
      size="md"
      darkMode={darkMode}
      className={`animate-pulse ${className}`}
    >
      {getSkeletonContent()}
    </BaseCard>
  );
};

// Export all card components
export {
  BaseCard,
  MessageCard,
  FeatureCard,
  StatsCard,
  ActionCard,
  LoadingCard,
};
