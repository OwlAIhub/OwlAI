import React from "react";
import { Copy, ThumbsUp, ThumbsDown, UserCircle2 } from "lucide-react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/shared/components/ui/avatar";
import { Button } from "@/shared/components/ui/button";
import owlLogo from "@/assets/owl-ai-logo.png";

interface Message {
  id: string;
  type: "user" | "bot";
  content: string;
  timestamp: Date;
}

interface ChatMessageProps {
  message: Message;
}

export const ChatMessage: React.FC<ChatMessageProps> = ({ message }) => {
  const isBot = message.type === "bot";

  const handleCopy = () => {
    navigator.clipboard.writeText(message.content);
    // You can add a toast notification here
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  };

  return (
    <div
      className={`flex items-start space-x-2 group animate-in fade-in slide-in-from-bottom-2 duration-300 ${
        isBot ? "flex-row" : "flex-row-reverse space-x-reverse"
      }`}
    >
      {/* Avatar */}
      <Avatar
        className={`w-8 h-8 border-2 transition-all duration-200 ${
          isBot
            ? "border-teal-400/60 bg-gradient-to-br from-teal-500 to-teal-600"
            : "border-blue-400/60 bg-gradient-to-br from-blue-500 to-blue-600"
        }`}
      >
        {isBot ? (
          <AvatarImage src={owlLogo} alt="OwlAI" className="p-1" />
        ) : (
          <AvatarFallback className="text-white text-sm font-medium">
            <UserCircle2 className="h-5 w-5" />
          </AvatarFallback>
        )}
      </Avatar>

      {/* Message Content */}
      <div
        className={`${
          isBot ? "flex-1 max-w-[85%] mr-4" : "flex-shrink-0 ml-8"
        }`}
      >
        <div
          className={`rounded-xl transition-all duration-200 ${
            isBot
              ? "bg-transparent px-0 py-0"
              : "bg-gradient-to-r from-teal-500 to-teal-600 text-white shadow-sm px-4 py-3 inline-block"
          }`}
        >
          {isBot ? (
            <div className="max-w-none" style={{ color: "#000000" }}>
              <ReactMarkdown
                remarkPlugins={[remarkGfm]}
                components={{
                  h1: ({ children }) => (
                    <h1
                      className="text-2xl font-bold mb-4 mt-6 first:mt-0 pb-2 border-b border-gray-200"
                      style={{ color: "#000000" }}
                    >
                      {children}
                    </h1>
                  ),
                  h2: ({ children }) => (
                    <h2
                      className="text-xl font-bold mb-3 mt-6 first:mt-0"
                      style={{ color: "#000000" }}
                    >
                      {children}
                    </h2>
                  ),
                  h3: ({ children }) => (
                    <h3
                      className="text-lg font-semibold mb-3 mt-5 first:mt-0"
                      style={{ color: "#000000" }}
                    >
                      {children}
                    </h3>
                  ),
                  p: ({ children }) => (
                    <p
                      className="text-base leading-7 mb-4 last:mb-0"
                      style={{ color: "#000000" }}
                    >
                      {children}
                    </p>
                  ),
                  ul: ({ children }) => (
                    <ul
                      className="list-disc ml-6 space-y-2 mb-4 text-base"
                      style={{ color: "#000000" }}
                    >
                      {children}
                    </ul>
                  ),
                  ol: ({ children }) => (
                    <ol
                      className="list-decimal ml-6 space-y-2 mb-4 text-base"
                      style={{ color: "#000000" }}
                    >
                      {children}
                    </ol>
                  ),
                  li: ({ children }) => (
                    <li className="leading-7 pl-2" style={{ color: "#000000" }}>
                      {children}
                    </li>
                  ),
                  strong: ({ children }) => (
                    <strong
                      className="font-semibold"
                      style={{ color: "#000000" }}
                    >
                      {children}
                    </strong>
                  ),
                  code: ({ children }) => (
                    <code
                      className="bg-gray-100 px-2 py-1 rounded text-sm font-mono"
                      style={{ color: "#000000" }}
                    >
                      {children}
                    </code>
                  ),
                  blockquote: ({ children }) => (
                    <blockquote className="border-l-4 border-gray-300 dark:border-gray-600 pl-4 py-2 mb-4 italic text-gray-700 dark:text-gray-300 bg-gray-50 dark:bg-gray-800/50 rounded-r">
                      {children}
                    </blockquote>
                  ),
                  pre: ({ children }) => (
                    <pre className="bg-gray-100 dark:bg-gray-900 p-4 rounded-lg mb-4 overflow-x-auto">
                      <code
                        className="text-sm font-mono"
                        style={{ color: "#000000" }}
                      >
                        {children}
                      </code>
                    </pre>
                  ),
                  table: ({ children }) => (
                    <div className="overflow-x-auto mb-4">
                      <table className="min-w-full border-collapse border border-gray-300 rounded-lg">
                        {children}
                      </table>
                    </div>
                  ),
                  thead: ({ children }) => (
                    <thead className="bg-gray-50">{children}</thead>
                  ),
                  tbody: ({ children }) => (
                    <tbody className="bg-white">{children}</tbody>
                  ),
                  tr: ({ children }) => (
                    <tr className="border-b border-gray-200 hover:bg-gray-50">
                      {children}
                    </tr>
                  ),
                  th: ({ children }) => (
                    <th
                      className="border border-gray-300 px-4 py-3 text-left font-semibold text-sm bg-gray-100"
                      style={{ color: "#000000" }}
                    >
                      {children}
                    </th>
                  ),
                  td: ({ children }) => (
                    <td
                      className="border border-gray-300 px-4 py-3 text-sm"
                      style={{ color: "#000000" }}
                    >
                      {children}
                    </td>
                  ),
                }}
              >
                {message.content}
              </ReactMarkdown>
            </div>
          ) : (
            <p className="text-base leading-relaxed text-white">
              {message.content}
            </p>
          )}
        </div>

        {/* Actions */}
        <div
          className={`flex items-center mt-2 space-x-2 transition-opacity duration-200 ${
            isBot ? "justify-start" : "justify-end"
          }`}
        >
          <span className="text-xs text-gray-500">
            {formatTime(message.timestamp)}
          </span>

          {isBot && (
            <div className="flex items-center space-x-1">
              <Button
                variant="ghost"
                size="icon"
                className="h-7 w-7 hover:bg-gray-100 text-gray-600 hover:text-gray-800"
                onClick={handleCopy}
                title="Copy message"
              >
                <Copy className="h-3.5 w-3.5" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                className="h-7 w-7 hover:bg-gray-100 text-gray-600 hover:text-green-600"
                title="Good response"
              >
                <ThumbsUp className="h-3.5 w-3.5" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                className="h-7 w-7 hover:bg-gray-100 text-gray-600 hover:text-red-600"
                title="Poor response"
              >
                <ThumbsDown className="h-3.5 w-3.5" />
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
