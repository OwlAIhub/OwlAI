import React from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { ChatMessage } from '@/types';
import { Button } from '@/components/ui/button';

interface ChatMessagesProps {
  messages: ChatMessage[];
  darkMode: boolean;
  copiedIndex: number | null;
  onFeedback: (index: number, type: 'like' | 'dislike') => void;
  onCopy: (text: string, index: number) => void;
  displayedText?: string;
  loading?: boolean;
}

export const ChatMessages: React.FC<ChatMessagesProps> = ({
  messages,
  darkMode,
  copiedIndex,
  onFeedback,
  onCopy,
  displayedText,
  loading,
}) => {
  return (
    <div className="space-y-4">
      {/* Render all messages */}
      {messages.map((msg, index) => (
        <div
          key={index}
          className={`w-fit max-w-3xl rounded-xl mb-4 px-4 py-2 text-md break-words
            ${msg.role === "user"
              ? darkMode
                ? "bg-gradient-to-r from-indigo-600 to-purple-700 text-white self-end"
                : "bg-gray-200 text-gray-800 self-end"
              : darkMode
              ? "text-gray-100 self-start"
              : "text-gray-900 self-start"
            }`}
          style={{
            boxShadow: darkMode
              ? "0 2px 10px rgba(255,255,255,0.05)"
              : "0 2px 10px rgba(0,0,0,0.1)",
          }}
        >
          {msg.role === "bot" ? (
            <>
              <div className="prose dark:prose-invert max-w-none">
                <ReactMarkdown 
                  remarkPlugins={[remarkGfm]}
                  components={{
                    h1: ({node, ...props}) => <h1 className="text-2xl font-bold my-4 text-blue-600 dark:text-blue-400" {...props} />,
                    h2: ({node, ...props}) => <h2 className="text-xl font-bold my-3 text-blue-500 dark:text-blue-300" {...props} />,
                    h3: ({node, ...props}) => <h3 className="text-lg font-semibold my-2 text-blue-400 dark:text-blue-200" {...props} />,
                    p: ({node, ...props}) => <p className="my-3 leading-relaxed" {...props} />,
                    strong: ({node, ...props}) => <strong className="font-bold text-yellow-600 dark:text-yellow-400" {...props} />,
                    em: ({node, ...props}) => <em className="italic" {...props} />,
                    ul: ({node, ...props}) => <ul className="list-disc pl-5 my-2" {...props} />,
                    ol: ({node, ...props}) => <ol className="list-decimal pl-5 my-2" {...props} />,
                    li: ({node, ...props}) => <li className="my-1" {...props} />,
                  }}
                >
                  {msg.content}
                </ReactMarkdown>
              </div>

              {/* Bot message actions */}
              <div className="flex gap-4 mt-2 text-sm text-gray-500">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => onFeedback(index, "like")}
                  className={`hover:text-green-500 transition cursor-pointer ${
                    msg.feedback === "like" ? "text-green-600 font-semibold" : ""
                  }`}
                >
                  👍 {msg.feedback === "like" && "Thanks!"}
                </Button>

                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => onFeedback(index, "dislike")}
                  className={`hover:text-red-500 transition cursor-pointer ${
                    msg.feedback === "dislike" ? "text-red-600 font-semibold" : ""
                  }`}
                >
                  👎 {msg.feedback === "dislike" && "Noted"}
                </Button>

                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => onCopy(msg.content, index)}
                  className="hover:text-blue-500 transition flex items-center gap-1 cursor-pointer"
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
                </Button>
              </div>
            </>
          ) : (
            msg.content
          )}
        </div>
      ))}

      {/* Loading indicator */}
      {loading && (
        <div
          className={`w-full max-w-3xl rounded-lg p-4 ${
            darkMode ? "text-gray-100 self-start" : "text-gray-900 self-start"
          }`}
          style={{
            fontStyle: "italic",
            fontWeight: "500",
            display: "flex",
            alignItems: "center",
            gap: "8px",
          }}
        >
          Thinking
          <div className="typing-indicator">
            <span></span>
            <span></span>
            <span></span>
          </div>
        </div>
      )}

      {/* Streaming text display */}
      {displayedText && !loading && (
        <div className={`w-fit max-w-3xl rounded-xl mb-4 px-4 py-2 text-md break-words ${
          darkMode ? "text-gray-100 self-start" : "text-gray-900 self-start"
        }`} style={{
          boxShadow: darkMode
            ? "0 2px 10px rgba(255,255,255,0.05)"
            : "0 2px 10px rgba(0,0,0,0.1)",
        }}>
          <div className="prose dark:prose-invert max-w-none">
            <ReactMarkdown 
              remarkPlugins={[remarkGfm]}
              components={{
                h1: ({node, ...props}) => <h1 className="text-2xl font-bold my-4 text-blue-600 dark:text-blue-400" {...props} />,
                h2: ({node, ...props}) => <h2 className="text-xl font-bold my-3 text-blue-500 dark:text-blue-300" {...props} />,
                h3: ({node, ...props}) => <h3 className="text-lg font-semibold my-2 text-blue-400 dark:text-blue-200" {...props} />,
                p: ({node, ...props}) => <p className="my-3 leading-relaxed" {...props} />,
                strong: ({node, ...props}) => <strong className="font-bold text-yellow-600 dark:text-yellow-400" {...props} />,
                em: ({node, ...props}) => <em className="italic" {...props} />,
                ul: ({node, ...props}) => <ul className="list-disc pl-5 my-2" {...props} />,
                ol: ({node, ...props}) => <ol className="list-decimal pl-5 my-2" {...props} />,
                li: ({node, ...props}) => <li className="my-1" {...props} />,
              }}
            >
              {displayedText}
            </ReactMarkdown>
          </div>
        </div>
      )}
    </div>
  );
};
