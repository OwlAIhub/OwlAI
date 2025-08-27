import React, { useRef, useEffect, useState } from "react";
import { ArrowUp, Square, Send, Mic, Paperclip, Smile } from "lucide-react";
import { getColors } from "../../../lib/colors";

interface EnhancedMessageInputProps {
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
  isStreaming?: boolean;
  onRegenerate?: () => void;
}

export const EnhancedMessageInput: React.FC<EnhancedMessageInputProps> = ({
  message,
  setMessage,
  onSendMessage,
  onStopTyping,
  loading,
  darkMode = false,
  disabled = false,
  isStreaming = false,
  onRegenerate,
}) => {
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const [isFocused, setIsFocused] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const colors = getColors(darkMode);

  // Auto-resize textarea
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
      const scrollHeight = textareaRef.current.scrollHeight;
      const maxHeight = 200; // Maximum height before scrolling
      textareaRef.current.style.height = `${Math.min(scrollHeight, maxHeight)}px`;
    }
  }, [message]);

  // Auto-focus textarea when message is set
  useEffect(() => {
    if (message && textareaRef.current) {
      textareaRef.current.focus();
      textareaRef.current.setSelectionRange(message.length, message.length);
    }
  }, [message]);

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      if (message.trim() && !loading && !disabled && !isStreaming) {
        onSendMessage();
      }
    }
  };

  const handleSendClick = () => {
    if (message.trim() && !loading && !disabled && !isStreaming) {
      onSendMessage();
    }
  };

  const handleStopClick = () => {
    onStopTyping();
  };

  const handleRegenerateClick = () => {
    if (onRegenerate) {
      onRegenerate();
    }
  };

  // Quick suggestions for common queries
  const suggestions = [
    "What is Teaching Aptitude?",
    "Explain Research Methodology",
    "How to prepare for UGC NET?",
    "What are learning theories?",
    "Explain Bloom's Taxonomy",
  ];

  const handleSuggestionClick = (suggestion: string) => {
    setMessage(suggestion);
    setShowSuggestions(false);
    textareaRef.current?.focus();
  };

  return (
    <div className="border-t border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800">
      {/* Suggestions */}
      {showSuggestions && !message && (
        <div className="p-4 border-b border-gray-100 dark:border-gray-700">
          <div className="flex flex-wrap gap-2">
            {suggestions.map((suggestion, index) => (
              <button
                key={index}
                onClick={() => handleSuggestionClick(suggestion)}
                className="px-3 py-1.5 text-sm bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
              >
                {suggestion}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Main Input Area */}
      <div className="p-4">
        <div className="flex items-end gap-3">
          {/* Input Container */}
          <div className="flex-1 relative">
            <div
              className={`relative rounded-2xl border transition-all duration-200 ${
                isFocused
                  ? "border-[#52B788] ring-2 ring-[#52B788]/20"
                  : "border-gray-300 dark:border-gray-600"
              } ${
                darkMode ? "bg-gray-700 text-white" : "bg-white text-gray-900"
              }`}
            >
              {/* Textarea */}
              <textarea
                ref={textareaRef}
                value={message}
                onChange={e => setMessage(e.target.value)}
                onKeyPress={handleKeyPress}
                onFocus={() => setIsFocused(true)}
                onBlur={() => setIsFocused(false)}
                placeholder={
                  isStreaming
                    ? "AI is responding..."
                    : "Ask about UGC NET topics like 'What is Teaching Aptitude?' or 'Explain Research Methodology'..."
                }
                className={`w-full p-4 pr-12 resize-none focus:outline-none bg-transparent ${
                  darkMode
                    ? "text-white placeholder-gray-400"
                    : "text-gray-900 placeholder-gray-500"
                }`}
                rows={1}
                maxLength={4000}
                disabled={loading || disabled || isStreaming}
              />

              {/* Character Count */}
              <div className="absolute bottom-2 right-2 text-xs text-gray-500 dark:text-gray-400">
                {message.length}/4000
              </div>

              {/* Action Buttons */}
              <div className="absolute top-2 right-2 flex items-center gap-1">
                {!isStreaming && !loading && (
                  <>
                    <button
                      className="p-1.5 text-gray-500 hover:text-gray-700 dark:hover:text-gray-300 transition-colors rounded-lg hover:bg-gray-100 dark:hover:bg-gray-600"
                      title="Attach file"
                    >
                      <Paperclip className="w-4 h-4" />
                    </button>
                    <button
                      className="p-1.5 text-gray-500 hover:text-gray-700 dark:hover:text-gray-300 transition-colors rounded-lg hover:bg-gray-100 dark:hover:bg-gray-600"
                      title="Voice input"
                    >
                      <Mic className="w-4 h-4" />
                    </button>
                    <button
                      className="p-1.5 text-gray-500 hover:text-gray-700 dark:hover:text-gray-300 transition-colors rounded-lg hover:bg-gray-100 dark:hover:bg-gray-600"
                      title="Emoji"
                    >
                      <Smile className="w-4 h-4" />
                    </button>
                  </>
                )}
              </div>
            </div>

            {/* Suggestions Toggle */}
            {!message && !loading && !isStreaming && (
              <button
                onClick={() => setShowSuggestions(!showSuggestions)}
                className="mt-2 text-xs text-[#52B788] hover:text-[#40916C] transition-colors"
              >
                {showSuggestions ? "Hide suggestions" : "Show suggestions"}
              </button>
            )}
          </div>

          {/* Send/Stop Button */}
          <div className="flex flex-col gap-2">
            {isStreaming ? (
              // Stop button during streaming
              <button
                onClick={handleStopClick}
                className="p-3 rounded-xl transition-all duration-200 bg-red-100 text-red-600 hover:bg-red-200 border border-red-200 hover:shadow-md"
                title="Stop generating"
              >
                <Square className="w-5 h-5" />
              </button>
            ) : loading ? (
              // Loading state
              <button
                disabled
                className="p-3 rounded-xl transition-all duration-200 bg-gray-100 text-gray-400 border border-gray-200 cursor-not-allowed"
                title="Processing..."
              >
                <div className="w-5 h-5 border-2 border-[#52B788] border-t-transparent rounded-full animate-spin"></div>
              </button>
            ) : (
              // Send button
              <button
                onClick={handleSendClick}
                disabled={!message.trim() || disabled}
                className={`p-3 rounded-xl transition-all duration-200 ${
                  message.trim() && !disabled
                    ? "bg-[#52B788] text-white hover:bg-[#40916C] hover:shadow-md"
                    : "bg-gray-100 text-gray-400 border border-gray-200 cursor-not-allowed"
                }`}
                title="Send message"
              >
                <Send className="w-5 h-5" />
              </button>
            )}

            {/* Regenerate Button */}
            {onRegenerate && !isStreaming && !loading && (
              <button
                onClick={handleRegenerateClick}
                className="p-2 rounded-lg transition-all duration-200 bg-gray-100 text-gray-600 hover:bg-gray-200 border border-gray-200 hover:shadow-sm"
                title="Regenerate last response"
              >
                <ArrowUp className="w-4 h-4 rotate-180" />
              </button>
            )}
          </div>
        </div>

        {/* Streaming Indicator */}
        {isStreaming && (
          <div className="mt-3 flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
            <div className="flex items-center gap-1">
              <div className="w-2 h-2 bg-[#52B788] rounded-full animate-pulse"></div>
              <div
                className="w-2 h-2 bg-[#52B788] rounded-full animate-pulse"
                style={{ animationDelay: "0.2s" }}
              ></div>
              <div
                className="w-2 h-2 bg-[#52B788] rounded-full animate-pulse"
                style={{ animationDelay: "0.4s" }}
              ></div>
            </div>
            <span>AI is thinking and typing...</span>
          </div>
        )}

        {/* Help Text */}
        {!message && !loading && !isStreaming && (
          <div className="mt-2 text-xs text-gray-500 dark:text-gray-400">
            Press Enter to send, Shift+Enter for new line
          </div>
        )}
      </div>
    </div>
  );
};
