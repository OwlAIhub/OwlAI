import React, { useState } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { ChatMessage as ChatMessageType } from "@/types";
import { getColors } from "@/lib/colors";

interface ChatMessageProps {
  message: ChatMessageType;
  index: number;
  darkMode: boolean;
  copiedIndex: number | null;
  onCopy: (index: number) => void;
  onFeedback: (index: number, type: string, remark?: string) => void;
}

export const ChatMessage: React.FC<ChatMessageProps> = ({
  message,
  index,
  darkMode,
  copiedIndex,
  onCopy,
  onFeedback,
}) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [customRemark, setCustomRemark] = useState("");
  const colors = getColors(darkMode);

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

  return (
    <div
      className={`w-full max-w-3xl rounded-lg p-4 ${
        message.role === "user"
          ? `${colors.bg.userMessage} text-white self-end`
          : `${colors.bg.assistantMessage} ${colors.text.main} self-start`
      }`}
    >
      {message.isMarkdown ? (
        <>
          <div className={`prose ${darkMode ? "prose-invert" : ""} max-w-none`}>
            <ReactMarkdown remarkPlugins={[remarkGfm]}>
              {message.content}
            </ReactMarkdown>
          </div>

          <div className="flex items-center gap-2 mt-3">
            <button
              onClick={() => onCopy(index)}
              className="text-xs opacity-70 hover:opacity-100 transition-opacity"
            >
              {copiedIndex === index ? (
                <>
                  ✔️ <span className="text-sm">Copied</span>
                </>
              ) : (
                <>
                  📋 <span className="text-sm">Copy</span>
                </>
              )}
            </button>

            {message.role === "bot" && (
              <div className="flex items-center gap-1">
                <button
                  onClick={() => handleFeedback("like")}
                  className={`text-xs px-2 py-1 rounded ${
                    message.feedback === "like"
                      ? "bg-green-500 text-white"
                      : "opacity-70 hover:opacity-100"
                  }`}
                >
                  👍
                </button>
                <button
                  onClick={() => handleFeedback("dislike")}
                  className={`text-xs px-2 py-1 rounded ${
                    message.feedback === "dislike"
                      ? "bg-red-500 text-white"
                      : "opacity-70 hover:opacity-100"
                  }`}
                >
                  👎
                </button>
              </div>
            )}
          </div>

          {/* Feedback Modal */}
          {isModalOpen && (
            <div className="fixed inset-0 flex items-center justify-center bg-opacity-40 z-50">
              <div className="bg-gray-800 rounded-lg p-6 w-96 relative shadow-lg">
                <button
                  onClick={() => setIsModalOpen(false)}
                  className="absolute top-2 right-2 text-white hover:text-black text-xl font-bold"
                >
                  ×
                </button>

                <h2 className="text-lg font-semibold mb-4 text-white">
                  Tell us what went wrong
                </h2>

                <div className="flex flex-wrap gap-2 mb-4">
                  {[
                    "Not satisfied",
                    "Too vague",
                    "Irrelevant",
                    "Incomplete",
                    "Wrong answer",
                  ].map((label) => (
                    <button
                      key={label}
                      onClick={() => setCustomRemark(label)}
                      className={`${colors.bg.assistantMessage} text-white text-sm px-3 py-1 rounded hover:opacity-80`}
                    >
                      {label}
                    </button>
                  ))}
                </div>

                <textarea
                  className={`w-full h-24 border rounded p-2 text-sm ${colors.border.primary} text-white bg-gray-700`}
                  placeholder="Write your feedback..."
                  value={customRemark}
                  onChange={(e) => setCustomRemark(e.target.value)}
                />

                <div className="mt-4 flex justify-end gap-2">
                  <button
                    onClick={() => setIsModalOpen(false)}
                    className={`px-4 py-1 text-sm rounded ${colors.bg.primary} text-white ${colors.hover.bgPrimary}`}
                  >
                    Cancel
                  </button>

                  <button
                    onClick={handleSubmitFeedback}
                    className={`px-4 py-1 text-sm rounded ${colors.bg.primary} text-white ${colors.hover.bgPrimary}`}
                  >
                    Submit
                  </button>
                </div>
              </div>
            </div>
          )}
        </>
      ) : (
        message.content
      )}
    </div>
  );
};
