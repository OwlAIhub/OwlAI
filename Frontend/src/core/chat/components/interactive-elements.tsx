import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Copy,
  Check,
  RotateCcw,
  Edit,
  ThumbsUp,
  ThumbsDown,
  MoreVertical,
  Share2,
  Download,
  Bookmark,
  Flag,
  Trash2,
  MessageSquare,
  ExternalLink,
} from "lucide-react";

interface InteractiveButtonProps {
  icon: React.ReactNode;
  label: string;
  onClick: () => void;
  variant?: "primary" | "secondary" | "danger" | "success";
  size?: "sm" | "md" | "lg";
  disabled?: boolean;
  loading?: boolean;
  className?: string;
}

export const InteractiveButton: React.FC<InteractiveButtonProps> = ({
  icon,
  label,
  onClick,
  variant = "primary",
  size = "md",
  disabled = false,
  loading = false,
  className = "",
}) => {
  const getVariantStyles = () => {
    switch (variant) {
      case "primary":
        return "bg-[#52B788] hover:bg-[#40916C] text-white border-[#52B788]";
      case "secondary":
        return "bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300 border-gray-200 dark:border-gray-600";
      case "danger":
        return "bg-red-100 hover:bg-red-200 dark:bg-red-900/30 dark:hover:bg-red-900/50 text-red-700 dark:text-red-300 border-red-200 dark:border-red-700";
      case "success":
        return "bg-green-100 hover:bg-green-200 dark:bg-green-900/30 dark:hover:bg-green-900/50 text-green-700 dark:text-green-300 border-green-200 dark:border-green-700";
      default:
        return "bg-[#52B788] hover:bg-[#40916C] text-white border-[#52B788]";
    }
  };

  const getSizeStyles = () => {
    switch (size) {
      case "sm":
        return "px-2 py-1 text-xs";
      case "md":
        return "px-3 py-1.5 text-sm";
      case "lg":
        return "px-4 py-2 text-base";
      default:
        return "px-3 py-1.5 text-sm";
    }
  };

  return (
    <motion.button
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      onClick={onClick}
      disabled={disabled || loading}
      className={`inline-flex items-center gap-2 rounded-lg border font-medium transition-all duration-200 ${getVariantStyles()} ${getSizeStyles()} ${
        disabled ? "opacity-50 cursor-not-allowed" : "cursor-pointer"
      } ${className}`}
    >
      {loading ? (
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
        >
          <RotateCcw className="w-4 h-4" />
        </motion.div>
      ) : (
        icon
      )}
      <span>{label}</span>
    </motion.button>
  );
};

interface CopyButtonProps {
  text: string;
  onCopy?: (text: string) => void;
  size?: "sm" | "md" | "lg";
  className?: string;
}

export const CopyButton: React.FC<CopyButtonProps> = ({
  text,
  onCopy,
  size = "md",
  className = "",
}) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      onCopy?.(text);

      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      console.error("Failed to copy text:", error);
    }
  };

  return (
    <InteractiveButton
      icon={
        copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />
      }
      label={copied ? "Copied!" : "Copy"}
      onClick={handleCopy}
      variant="secondary"
      size={size}
      className={className}
    />
  );
};

interface RegenerateButtonProps {
  onRegenerate: () => void;
  loading?: boolean;
  size?: "sm" | "md" | "lg";
  className?: string;
}

export const RegenerateButton: React.FC<RegenerateButtonProps> = ({
  onRegenerate,
  loading = false,
  size = "md",
  className = "",
}) => {
  return (
    <InteractiveButton
      icon={<RotateCcw className="w-4 h-4" />}
      label="Regenerate"
      onClick={onRegenerate}
      variant="primary"
      size={size}
      loading={loading}
      className={className}
    />
  );
};

interface EditButtonProps {
  onEdit: () => void;
  size?: "sm" | "md" | "lg";
  className?: string;
}

export const EditButton: React.FC<EditButtonProps> = ({
  onEdit,
  size = "md",
  className = "",
}) => {
  return (
    <InteractiveButton
      icon={<Edit className="w-4 h-4" />}
      label="Edit"
      onClick={onEdit}
      variant="secondary"
      size={size}
      className={className}
    />
  );
};

interface FeedbackButtonsProps {
  onFeedback: (type: "like" | "dislike") => void;
  liked?: boolean;
  disliked?: boolean;
  size?: "sm" | "md" | "lg";
  className?: string;
}

export const FeedbackButtons: React.FC<FeedbackButtonsProps> = ({
  onFeedback,
  liked = false,
  disliked = false,
  size = "md",
  className = "",
}) => {
  return (
    <div className={`flex items-center gap-2 ${className}`}>
      <motion.button
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        onClick={() => onFeedback("like")}
        className={`p-2 rounded-full transition-colors ${
          liked
            ? "bg-green-100 text-green-600 dark:bg-green-900/30 dark:text-green-400"
            : "bg-gray-100 text-gray-600 hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-400 dark:hover:bg-gray-600"
        }`}
        title="Like this response"
      >
        <ThumbsUp className="w-4 h-4" />
      </motion.button>

      <motion.button
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        onClick={() => onFeedback("dislike")}
        className={`p-2 rounded-full transition-colors ${
          disliked
            ? "bg-red-100 text-red-600 dark:bg-red-900/30 dark:text-red-400"
            : "bg-gray-100 text-gray-600 hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-400 dark:hover:bg-gray-600"
        }`}
        title="Dislike this response"
      >
        <ThumbsDown className="w-4 h-4" />
      </motion.button>
    </div>
  );
};

interface MessageActionsProps {
  messageId: string;
  onCopy?: () => void;
  onRegenerate?: () => void;
  onEdit?: () => void;
  onShare?: () => void;
  onDownload?: () => void;
  onBookmark?: () => void;
  onReport?: () => void;
  onDelete?: () => void;
  isUser?: boolean;
  darkMode?: boolean;
  className?: string;
}

export const MessageActions: React.FC<MessageActionsProps> = ({
  messageId,
  onCopy,
  onRegenerate,
  onEdit,
  onShare,
  onDownload,
  onBookmark,
  onReport,
  onDelete,
  isUser = false,
  darkMode = false,
  className = "",
}) => {
  const [showMenu, setShowMenu] = useState(false);

  const actions = [
    ...(onCopy
      ? [{ icon: <Copy className="w-4 h-4" />, label: "Copy", onClick: onCopy }]
      : []),
    ...(onRegenerate && !isUser
      ? [
          {
            icon: <RotateCcw className="w-4 h-4" />,
            label: "Regenerate",
            onClick: onRegenerate,
          },
        ]
      : []),
    ...(onEdit && isUser
      ? [{ icon: <Edit className="w-4 h-4" />, label: "Edit", onClick: onEdit }]
      : []),
    ...(onShare
      ? [
          {
            icon: <Share2 className="w-4 h-4" />,
            label: "Share",
            onClick: onShare,
          },
        ]
      : []),
    ...(onDownload
      ? [
          {
            icon: <Download className="w-4 h-4" />,
            label: "Download",
            onClick: onDownload,
          },
        ]
      : []),
    ...(onBookmark
      ? [
          {
            icon: <Bookmark className="w-4 h-4" />,
            label: "Bookmark",
            onClick: onBookmark,
          },
        ]
      : []),
    ...(onReport
      ? [
          {
            icon: <Flag className="w-4 h-4" />,
            label: "Report",
            onClick: onReport,
          },
        ]
      : []),
    ...(onDelete && isUser
      ? [
          {
            icon: <Trash2 className="w-4 h-4" />,
            label: "Delete",
            onClick: onDelete,
          },
        ]
      : []),
  ];

  return (
    <div className={`relative ${className}`}>
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => setShowMenu(!showMenu)}
        className="p-2 rounded-full bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-600 dark:text-gray-400 transition-colors"
        title="More actions"
      >
        <MoreVertical className="w-4 h-4" />
      </motion.button>

      <AnimatePresence>
        {showMenu && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: -10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: -10 }}
            transition={{ duration: 0.15 }}
            className="absolute right-0 top-full mt-2 w-48 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 py-2 z-50"
          >
            {actions.map((action, index) => (
              <motion.button
                key={index}
                whileHover={{
                  backgroundColor: darkMode ? "#374151" : "#F3F4F6",
                }}
                onClick={() => {
                  action.onClick();
                  setShowMenu(false);
                }}
                className="w-full flex items-center gap-3 px-4 py-2 text-left text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
              >
                {action.icon}
                <span>{action.label}</span>
              </motion.button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

interface QuickActionsProps {
  onCopy: () => void;
  onRegenerate?: () => void;
  onEdit?: () => void;
  isUser?: boolean;
  className?: string;
}

export const QuickActions: React.FC<QuickActionsProps> = ({
  onCopy,
  onRegenerate,
  onEdit,
  isUser = false,
  className = "",
}) => {
  return (
    <div className={`flex items-center gap-2 ${className}`}>
      <CopyButton text="" onCopy={onCopy} size="sm" />
      {onRegenerate && !isUser && (
        <RegenerateButton onRegenerate={onRegenerate} size="sm" />
      )}
      {onEdit && isUser && <EditButton onEdit={onEdit} size="sm" />}
    </div>
  );
};
