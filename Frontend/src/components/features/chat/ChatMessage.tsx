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
      className={`flex w-full ${message.role === "user" ? "justify-end" : "justify-start"}`}
    >
      <div
        className={`max-w-3xl rounded-lg p-4 ${
          message.role === "user"
            ? `${colors.bg.userMessage} text-black`
            : `${colors.bg.assistantMessage} text-black`
        }`}
      >
        {message.isMarkdown ? (
          <>
            <div className={`prose max-w-none text-black`}>
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
                        ? "bg-teal-200 text-black"
                        : "opacity-70 hover:opacity-100 text-black"
                    }`}
                  >
                    👍
                  </button>
                  <button
                    onClick={() => handleFeedback("dislike")}
                    className={`text-xs px-2 py-1 rounded ${
                      message.feedback === "dislike"
                        ? "bg-teal-200 text-black"
                        : "opacity-70 hover:opacity-100 text-black"
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
                <div className="bg-white rounded-lg p-6 w-96 relative shadow-lg">
                  <button
                    onClick={() => setIsModalOpen(false)}
                    className="absolute top-2 right-2 text-black hover:opacity-80 text-xl font-bold"
                  >
                    ×
                  </button>

                  <h2 className="text-lg font-semibold mb-4 text-black">
                    Tell us what went wrong
                  </h2>

                  <div className="flex flex-wrap gap-2 mb-4">
                    {[
                      "Not satisfied",
                      "Too vague",
                      "Irrelevant",
                      "Incomplete",
                      "Wrong answer",
                    ].map(label => (
                      <button
                        key={label}
                        onClick={() => setCustomRemark(label)}
                        className="bg-teal-100 text-black text-sm px-3 py-1 rounded hover:bg-teal-200"
                      >
                        {label}
                      </button>
                    ))}
                  </div>

                  <textarea
                    className={`w-full h-24 border rounded p-2 text-sm ${colors.border.primary} text-black bg-white`}
                    placeholder="Write your feedback..."
                    value={customRemark}
                    onChange={e => setCustomRemark(e.target.value)}
                  />

                  <div className="mt-4 flex justify-end gap-2">
                    <button
                      onClick={() => setIsModalOpen(false)}
                      className="px-4 py-1 text-sm rounded bg-teal-100 text-black hover:bg-teal-200"
                    >
                      Cancel
                    </button>

                    <button
                      onClick={handleSubmitFeedback}
                      className="px-4 py-1 text-sm rounded bg-teal-100 text-black hover:bg-teal-200"
                    >
                      Submit
                    </button>
                  </div>
                </div>
              </div>
            )}
          </>
        ) : (
          <span className="text-black">{message.content}</span>
        )}
      </div>
    </div>
  );
};
