import React, { useState } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { ChatMessage as ChatMessageType } from "@/types";

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
  copiedIndex,
  onCopy,
  onFeedback,
}) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [customRemark, setCustomRemark] = useState("");

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
      className={`flex w-full mb-4 ${message.role === "user" ? "justify-end" : "justify-start"}`}
    >
      <div
        className={`max-w-[70%] sm:max-w-2xl rounded-xl shadow-sm border ${
          message.role === "user"
            ? "bg-gradient-to-r from-[#009688] to-[#00796B] text-white border-[#009688]"
            : "bg-white text-gray-900 border-gray-200 shadow-md"
        }`}
      >
        <div className="p-4 sm:p-6">
          {message.isMarkdown ? (
            <>
              <div
                className={`prose max-w-none ${
                  message.role === "user"
                    ? "prose-invert text-white"
                    : "text-gray-900"
                }`}
              >
                <ReactMarkdown
                  remarkPlugins={[remarkGfm]}
                  components={{
                    // Main headings - more prominent and distinct
                    h1: ({ node, ...props }) => (
                      <h1
                        className="text-2xl font-bold text-gray-900 mb-5 mt-5 border-b-2 border-[#009688] pb-3 flex items-center gap-3"
                        {...props}
                      >
                        <span className="text-[#009688] text-3xl">📋</span>
                        {props.children}
                      </h1>
                    ),
                    h2: ({ node, ...props }) => (
                      <h2
                        className="text-xl font-bold text-gray-900 mb-4 mt-5 text-[#009688] border-l-4 border-[#009688] pl-4 flex items-center gap-3"
                        {...props}
                      >
                        <span className="text-[#009688] text-xl">🔹</span>
                        {props.children}
                      </h2>
                    ),
                    h3: ({ node, ...props }) => (
                      <h3
                        className="text-lg font-semibold text-gray-900 mb-3 mt-4 text-gray-800 flex items-center gap-2"
                        {...props}
                      >
                        <span className="text-[#009688] text-lg">•</span>
                        {props.children}
                      </h3>
                    ),
                    // Paragraphs with better spacing and distinct styling
                    p: ({ node, ...props }) => (
                      <p
                        className="text-gray-700 mb-3 leading-7 text-base"
                        {...props}
                      />
                    ),
                    // Unordered lists with proper spacing
                    ul: ({ node, ...props }) => (
                      <ul className="list-none space-y-2.5 mb-5" {...props} />
                    ),
                    // Ordered lists with proper spacing
                    ol: ({ node, ...props }) => (
                      <ol
                        className="list-decimal list-inside space-y-2.5 mb-5 ml-4"
                        {...props}
                      />
                    ),
                    // List items with properly aligned dots
                    li: ({ node, ...props }) => (
                      <li
                        className="text-gray-700 leading-7 flex items-start gap-3"
                        {...props}
                      >
                        <span className="mt-2.5 w-2 h-2 bg-[#009688] rounded-full flex-shrink-0"></span>
                        <span className="flex-1">{props.children}</span>
                      </li>
                    ),
                    // Bold text for emphasis
                    strong: ({ node, ...props }) => (
                      <strong className="font-bold text-gray-900" {...props} />
                    ),
                    // Italic text
                    em: ({ node, ...props }) => (
                      <em className="italic text-gray-600" {...props} />
                    ),
                    // Inline code with better spacing
                    code: ({
                      node,
                      inline,
                      className,
                      children,
                      ...props
                    }: any) =>
                      inline ? (
                        <code
                          className="bg-gray-100 px-2 py-1 rounded text-sm font-mono text-gray-800 border"
                          {...props}
                        >
                          {children}
                        </code>
                      ) : (
                        <code
                          className="block bg-gray-50 p-4 rounded-lg text-sm font-mono overflow-x-auto text-gray-800 my-4 border border-gray-200"
                          {...props}
                        >
                          {children}
                        </code>
                      ),
                    // Blockquotes with better spacing
                    blockquote: ({ node, ...props }) => (
                      <blockquote
                        className="border-l-4 border-[#009688] pl-5 py-4 my-5 bg-blue-50 rounded-r-lg"
                        {...props}
                      />
                    ),
                    // Tables with professional styling
                    table: ({ node, ...props }) => (
                      <div className="overflow-x-auto my-5">
                        <table
                          className="min-w-full border border-gray-200 rounded-lg overflow-hidden"
                          {...props}
                        />
                      </div>
                    ),
                    thead: ({ node, ...props }) => (
                      <thead className="bg-gray-50" {...props} />
                    ),
                    tbody: ({ node, ...props }) => (
                      <tbody className="bg-white" {...props} />
                    ),
                    tr: ({ node, ...props }) => (
                      <tr
                        className="border-b border-gray-200 hover:bg-gray-50"
                        {...props}
                      />
                    ),
                    th: ({ node, ...props }) => (
                      <th
                        className="px-4 py-3 text-left text-sm font-semibold text-gray-900 border-r border-gray-200"
                        {...props}
                      />
                    ),
                    td: ({ node, ...props }) => (
                      <td
                        className="px-4 py-3 text-sm text-gray-800 border-r border-gray-200"
                        {...props}
                      />
                    ),
                  }}
                >
                  {message.content}
                </ReactMarkdown>
              </div>

              <div className="flex items-center gap-3 mt-4 pt-3 border-t border-gray-100">
                <button
                  onClick={() => onCopy(index)}
                  className="flex items-center gap-1 text-xs text-gray-500 hover:text-gray-700 transition-colors"
                >
                  {copiedIndex === index ? (
                    <>
                      <span className="text-green-500">✓</span>
                      <span>Copied</span>
                    </>
                  ) : (
                    <>
                      <span>📋</span>
                      <span>Copy</span>
                    </>
                  )}
                </button>

                {message.role === "bot" && (
                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => handleFeedback("like")}
                      className={`text-xs px-2 py-1 rounded transition-colors ${
                        message.feedback === "like"
                          ? "bg-green-100 text-green-700"
                          : "text-gray-500 hover:text-gray-700 hover:bg-gray-100"
                      }`}
                    >
                      👍
                    </button>
                    <button
                      onClick={() => handleFeedback("dislike")}
                      className={`text-xs px-2 py-1 rounded transition-colors ${
                        message.feedback === "dislike"
                          ? "bg-red-100 text-red-700"
                          : "text-gray-500 hover:text-gray-700 hover:bg-gray-100"
                      }`}
                    >
                      👎
                    </button>
                  </div>
                )}
              </div>
            </>
          ) : (
            <span
              className={`${message.role === "user" ? "text-white" : "text-gray-900"}`}
            >
              {message.content}
            </span>
          )}
        </div>

        {/* Feedback Modal */}
        {isModalOpen && (
          <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
            <div className="bg-white rounded-xl p-6 w-96 max-w-[90vw] relative shadow-xl">
              <button
                onClick={() => setIsModalOpen(false)}
                className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 text-xl font-bold transition-colors"
              >
                ×
              </button>

              <h2 className="text-lg font-semibold mb-4 text-gray-900">
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
                    className="bg-gray-100 text-gray-700 text-sm px-3 py-1 rounded-lg hover:bg-gray-200 transition-colors"
                  >
                    {label}
                  </button>
                ))}
              </div>

              <textarea
                className="w-full h-24 border border-gray-300 rounded-lg p-3 text-sm text-gray-900 bg-white focus:outline-none focus:ring-2 focus:ring-[#009688] focus:border-transparent"
                placeholder="Write your feedback..."
                value={customRemark}
                onChange={e => setCustomRemark(e.target.value)}
              />

              <div className="mt-4 flex justify-end gap-2">
                <button
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 text-sm rounded-lg bg-gray-100 text-gray-700 hover:bg-gray-200 transition-colors"
                >
                  Cancel
                </button>

                <button
                  onClick={handleSubmitFeedback}
                  className="px-4 py-2 text-sm rounded-lg bg-[#009688] text-white hover:bg-[#00796B] transition-colors"
                >
                  Submit
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
