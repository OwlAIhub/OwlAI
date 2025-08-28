import React from "react";
import { ChatMessage } from "@/types";
import { ChatMessages, WelcomeScreen } from "./";

/**
 * Chat body component
 * Contains the main chat area with messages and welcome screen
 */
interface ChatBodyProps {
  chatMessages: ChatMessage[];
  copiedIndex: number | null;
  onFeedback: (index: number, type: "like" | "dislike") => void;
  onCopy: (text: string, index: number) => void;
  displayedText: string;
  loading: boolean;
  onStopTyping: () => void;
  isLoggedIn: boolean;
  user: any;
  windowSize: { width: number; height: number };
  onPromptClick: (prompt: string) => void;
  messagesEndRef: React.RefObject<HTMLDivElement>;
}

export const ChatBody: React.FC<ChatBodyProps> = ({
  chatMessages,
  copiedIndex,
  onFeedback,
  onCopy,
  displayedText,
  loading,
  onStopTyping,
  isLoggedIn,
  user,
  windowSize,
  onPromptClick,
  messagesEndRef,
}) => {
  return (
    <main className="flex-1 overflow-y-auto bg-white dark:bg-gray-900">
      <div className="p-4 md:p-6">
        <div className="max-w-4xl mx-auto w-full flex flex-col items-center justify-center min-h-full">
          {/* Welcome Screen */}
          {chatMessages.length === 0 && (
            <WelcomeScreen
              isLoggedIn={isLoggedIn}
              user={user}
              windowSize={windowSize}
              onPromptClick={onPromptClick}
            />
          )}

          {/* Chat Messages */}
          <ChatMessages
            messages={chatMessages}
            copiedIndex={copiedIndex}
            onFeedback={onFeedback}
            onCopy={onCopy}
            displayedText={displayedText}
            loading={loading}
            onStopTyping={onStopTyping}
          />

          <div ref={messagesEndRef} id="messages-end" />
        </div>
      </div>
    </main>
  );
};
