import React, { useRef, useEffect } from "react";
import { ArrowUp } from "lucide-react";
import { getColors } from "@/lib/colors";

interface MessageInputProps {
  message: string;
  setMessage: (message: string) => void;
  onSendMessage: () => void;
  onStopTyping: () => void;
  isSidebarOpen: boolean;
  loading: boolean;
  isLoggedIn: boolean;
  messageCount: number;
  showModal: boolean;
  setShowModal: (show: boolean) => void;
  darkMode?: boolean;
  disabled?: boolean;
}

export const MessageInput: React.FC<MessageInputProps> = ({
  message,
  setMessage,
  onSendMessage,
  loading,
  darkMode = false,
  disabled = false,
}) => {
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const colors = getColors(darkMode);

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
    }
  }, [message]);

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      if (message.trim() && !loading && !disabled) {
        onSendMessage();
      }
    }
  };

  const handleSendClick = () => {
    if (message.trim() && !loading && !disabled) {
      onSendMessage();
    }
  };

  return (
    <div className="flex items-end gap-2 p-4 border-t border-gray-200 dark:border-gray-700">
      <div className="flex-1 relative">
        <textarea
          ref={textareaRef}
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          onKeyPress={handleKeyPress}
          placeholder="Ask about UGC NET topics like 'What is Teaching Aptitude?' or 'Explain Research Methodology'..."
          className={`w-full p-3 pr-12 border rounded-lg resize-none focus:outline-none focus:ring-2 ${
            colors.focus.ring
          } ${
            darkMode
              ? "bg-gray-800 text-white border-gray-600"
              : "bg-white text-gray-900 border-gray-300"
          }`}
          rows={1}
          maxLength={4000}
          disabled={loading || disabled}
        />
        <div className="absolute bottom-2 right-2 text-xs text-gray-500">
          {message.length}/4000
        </div>
      </div>

      <button
        onClick={handleSendClick}
        disabled={!message.trim() || loading || disabled}
        className={`p-3 rounded-lg transition-colors ${
          message.trim() && !loading && !disabled
            ? "bg-teal-600 text-white hover:bg-teal-700"
            : "bg-gray-300 text-gray-500 cursor-not-allowed"
        }`}
      >
        <ArrowUp className="w-5 h-5" />
      </button>
    </div>
  );
};
