import React, { useState, useEffect, useRef } from "react";
import { ChatMessage as ChatMessageType } from "@/types";
import { EnhancedMarkdownRenderer } from "./enhanced-markdown-renderer";
import { MessageStateIndicator, MessageState } from "./message-states";
import {
  CopyButton,
  RegenerateButton,
  EditButton,
  FeedbackButtons,
  MessageActions,
} from "./interactive-elements";
import {
  MessageContainer,
  MessageBubble,
  MessageHeader,
  MessageType,
} from "./visual-hierarchy";

interface EnhancedChatMessageProps {
  message: ChatMessageType;
  index: number;
  darkMode: boolean;
  copiedIndex: number | null;
  onCopy: (index: number) => void;
  onFeedback: (index: number, type: string, remark?: string) => void;
  onRegenerate?: (index: number) => void;
  onEdit?: (index: number, content: string) => void;
  isStreaming?: boolean;
  streamingContent?: string;
}

export const EnhancedChatMessage: React.FC<EnhancedChatMessageProps> = ({
  message,
  index,
  darkMode,
  copiedIndex,
  onCopy,
  onFeedback,
  onRegenerate,
  onEdit,
  isStreaming = false,
  streamingContent = "",
}) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [customRemark, setCustomRemark] = useState("");
  const [isEditing, setIsEditing] = useState(false);
  const [editContent, setEditContent] = useState(message.content);
  const messageRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom when streaming
  useEffect(() => {
    if (isStreaming && messageRef.current) {
      messageRef.current.scrollIntoView({ behavior: "smooth", block: "end" });
    }
  }, [isStreaming, streamingContent]);

  const handleFeedback = (type: string) => {
    if (type === "dislike") {
      setIsModalOpen(true);
    } else {
      onFeedback(index, type);
    }
  };

  const handleSubmitFeedback = () => {
    onFeedback(
      index,
      "dislike",
      customRemark || "Not satisfied with the response"
    );
    setIsModalOpen(false);
    setCustomRemark("");
  };

  const handleCopy = () => {
    const contentToCopy = isStreaming ? streamingContent : message.content;
    navigator.clipboard.writeText(contentToCopy);
    onCopy(index);
  };

  const handleRegenerate = () => {
    if (onRegenerate) {
      onRegenerate(index);
    }
  };

  const handleEdit = () => {
    if (message.role === "user") {
      setIsEditing(true);
      setEditContent(message.content);
    }
  };

  const handleSaveEdit = () => {
    if (onEdit) {
      onEdit(index, editContent);
    }
    setIsEditing(false);
  };

  const handleCancelEdit = () => {
    setIsEditing(false);
    setEditContent(message.content);
  };

  const displayContent = isStreaming ? streamingContent : message.content;
  const isUser = message.role === "user";
  const messageType: MessageType = isUser ? "user" : "assistant";
  const messageState: MessageState = isStreaming ? "streaming" : "complete";

  return (
    <div ref={messageRef}>
      <MessageContainer type={messageType} isUser={isUser} className="mb-6">
        <MessageBubble
          type={messageType}
          isStreaming={isStreaming}
          hasError={message.type === "error"}
        >
          {/* Message Header */}
          <MessageHeader
            type={messageType}
            title={isUser ? "You" : "AI Assistant"}
            timestamp={new Date(message.timestamp).toLocaleTimeString()}
            status={isStreaming ? "Streaming..." : undefined}
          />

          {/* Message Content */}
          <div className="px-4 pb-4">
            {isEditing ? (
              <div className="space-y-3">
                <textarea
                  value={editContent}
                  onChange={e => setEditContent(e.target.value)}
                  className="w-full p-3 border rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-[#52B788] bg-white text-gray-900"
                  rows={Math.max(3, editContent.split("\n").length)}
                />
                <div className="flex gap-2">
                  <button
                    onClick={handleSaveEdit}
                    className="px-4 py-2 bg-[#52B788] text-white rounded-lg hover:bg-[#40916C] transition-colors"
                  >
                    Save
                  </button>
                  <button
                    onClick={handleCancelEdit}
                    className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            ) : (
              <EnhancedMarkdownRenderer
                content={displayContent}
                darkMode={darkMode}
                className={
                  isUser
                    ? "prose-invert text-white"
                    : "text-gray-900 dark:text-white"
                }
                onCopy={text => {
                  console.log("Copied from markdown:", text);
                }}
              />
            )}
          </div>

          {/* Message Actions */}
          {!isEditing && (
            <div className="flex items-center justify-between px-4 pb-4">
              <div className="flex items-center gap-2">
                <CopyButton
                  text={displayContent}
                  onCopy={() => onCopy(index)}
                  size="sm"
                />

                {!isUser && onRegenerate && (
                  <RegenerateButton onRegenerate={handleRegenerate} size="sm" />
                )}

                {isUser && onEdit && (
                  <EditButton onEdit={handleEdit} size="sm" />
                )}
              </div>

              {!isUser && (
                <FeedbackButtons
                  onFeedback={handleFeedback}
                  liked={message.feedback === "like"}
                  disliked={message.feedback === "dislike"}
                  size="sm"
                />
              )}
            </div>
          )}

          {/* Message State Indicator */}
          <div className="px-4 pb-2">
            <MessageStateIndicator
              state={messageState}
              isUser={isUser}
              darkMode={darkMode}
            />
          </div>
        </MessageBubble>
      </MessageContainer>

      {/* Feedback Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 max-w-md w-full">
            <h3 className="text-lg font-semibold mb-4">What went wrong?</h3>
            <textarea
              value={customRemark}
              onChange={e => setCustomRemark(e.target.value)}
              placeholder="Please describe what you didn't like about this response..."
              className="w-full p-3 border rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-[#52B788] mb-4"
              rows={3}
            />
            <div className="flex gap-2 justify-end">
              <button
                onClick={() => setIsModalOpen(false)}
                className="px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleSubmitFeedback}
                className="px-4 py-2 bg-[#52B788] text-white rounded-lg hover:bg-[#40916C] transition-colors"
              >
                Submit
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
