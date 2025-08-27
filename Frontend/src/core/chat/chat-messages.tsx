import React from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { Copy, Check } from "lucide-react";
import { ChatMessage } from "@/types";
import { Button } from "../../shared/components/ui/button";
import { cn } from "../../lib/utils";

interface ChatMessagesProps {
  messages: ChatMessage[];
  copiedIndex: number | null;
  onFeedback: (index: number, type: "like" | "dislike") => void;
  onCopy: (text: string, index: number) => void;
  displayedText?: string;
  loading?: boolean;
  onStopTyping?: () => void;
}

export const ChatMessages: React.FC<ChatMessagesProps> = ({
  messages,
  copiedIndex,
  onFeedback,
  onCopy,
  displayedText,
  loading,
}) => {
  const MessageCard: React.FC<{
    children: React.ReactNode;
    isUser: boolean;
    className?: string;
  }> = ({ children, isUser, className }) => (
    <div
      className={cn(
        "flex w-full mb-4",
        isUser ? "justify-end" : "justify-start"
      )}
    >
      <div
        className={cn(
          "max-w-[70%] sm:max-w-2xl rounded-xl shadow-sm border",
          isUser
            ? "bg-gradient-to-r from-[#009688] to-[#00796B] text-white border-[#009688]"
            : "bg-white text-gray-900 border-gray-200 shadow-md",
          className
        )}
      >
        <div className="p-4 sm:p-6">{children}</div>
      </div>
    </div>
  );

  const ThinkingIndicator: React.FC = () => (
    <div className="flex items-center gap-3 text-gray-600">
      <div className="flex items-center gap-1">
        <div className="w-2 h-2 bg-gray-400 rounded-full animate-pulse"></div>
        <div
          className="w-2 h-2 bg-gray-400 rounded-full animate-pulse"
          style={{ animationDelay: "0.2s" }}
        ></div>
        <div
          className="w-2 h-2 bg-gray-400 rounded-full animate-pulse"
          style={{ animationDelay: "0.4s" }}
        ></div>
      </div>
      <span className="text-sm font-medium">AI is thinking...</span>
    </div>
  );

  const BotActions: React.FC<{ message: ChatMessage; index: number }> = ({
    message,
    index,
  }) => (
    <div className="flex items-center gap-3 mt-4 pt-3 border-t border-gray-100">
      <Button
        variant="ghost"
        size="sm"
        onClick={() => onCopy(message.content, index)}
        className="flex items-center gap-1 text-xs text-gray-500 hover:text-gray-700 transition-colors"
      >
        {copiedIndex === index ? (
          <>
            <Check className="h-3 w-3 text-green-500" />
            Copied
          </>
        ) : (
          <>
            <Copy className="h-3 w-3" />
            Copy
          </>
        )}
      </Button>

      <div className="flex items-center gap-1">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => onFeedback(index, "like")}
          className={`text-xs px-2 py-1 rounded transition-colors ${
            message.feedback === "like"
              ? "bg-green-100 text-green-700"
              : "text-gray-500 hover:text-gray-700 hover:bg-gray-100"
          }`}
        >
          👍
        </Button>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => onFeedback(index, "dislike")}
          className={`text-xs px-2 py-1 rounded transition-colors ${
            message.feedback === "dislike"
              ? "bg-red-100 text-red-700"
              : "text-gray-500 hover:text-gray-700 hover:bg-gray-100"
          }`}
        >
          👎
        </Button>
      </div>
    </div>
  );

  const MarkdownContent: React.FC<{ content: string }> = ({ content }) => (
    <div className="prose max-w-none text-gray-900">
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        components={{
          // Main headings - more prominent and distinct
          h1: ({ ...props }) => (
            <h1
              className="text-2xl font-bold text-gray-900 mb-5 mt-5 border-b-2 border-[#009688] pb-3 flex items-center gap-3"
              {...props}
            >
              <span className="text-[#009688] text-3xl">📋</span>
              {props.children}
            </h1>
          ),
          h2: ({ ...props }) => (
            <h2
              className="text-xl font-bold mb-4 mt-5 text-[#009688] border-l-4 border-[#009688] pl-4 flex items-center gap-3"
              {...props}
            >
              <span className="text-[#009688] text-xl">🔹</span>
              {props.children}
            </h2>
          ),
          h3: ({ ...props }) => (
            <h3
              className="text-lg font-semibold mb-3 mt-4 text-gray-800 flex items-center gap-2"
              {...props}
            >
              <span className="text-[#009688] text-lg">•</span>
              {props.children}
            </h3>
          ),
          // Paragraphs with better spacing and distinct styling
          p: ({ ...props }) => (
            <p className="text-gray-700 mb-3 leading-7 text-base" {...props} />
          ),
          // Unordered lists with proper spacing
          ul: ({ ...props }) => (
            <ul className="list-none space-y-2.5 mb-5" {...props} />
          ),
          // Ordered lists with proper spacing
          ol: ({ ...props }) => (
            <ol
              className="list-decimal list-inside space-y-2.5 mb-5 ml-4"
              {...props}
            />
          ),
          // List items with properly aligned dots
          li: ({ ...props }) => (
            <li
              className="text-gray-700 leading-7 flex items-start gap-3"
              {...props}
            >
              <span className="mt-2.5 w-2 h-2 bg-[#009688] rounded-full flex-shrink-0"></span>
              <span className="flex-1">{props.children}</span>
            </li>
          ),
          // Bold text for emphasis
          strong: ({ ...props }) => (
            <strong className="font-bold text-gray-900" {...props} />
          ),
          // Italic text
          em: ({ ...props }) => (
            <em className="italic text-gray-600" {...props} />
          ),
          // Inline code with better spacing
          code: ({ inline, children, ...props }: any) =>
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
          blockquote: ({ ...props }) => (
            <blockquote
              className="border-l-4 border-[#009688] pl-5 py-4 my-5 bg-blue-50 rounded-r-lg"
              {...props}
            />
          ),
          // Tables with professional styling
          table: ({ ...props }) => (
            <div className="overflow-x-auto my-5">
              <table
                className="min-w-full border border-gray-200 rounded-lg overflow-hidden"
                {...props}
              />
            </div>
          ),
          thead: ({ ...props }) => <thead className="bg-gray-50" {...props} />,
          tbody: ({ ...props }) => <tbody className="bg-white" {...props} />,
          tr: ({ ...props }) => (
            <tr
              className="border-b border-gray-200 hover:bg-gray-50"
              {...props}
            />
          ),
          th: ({ ...props }) => (
            <th
              className="px-4 py-3 text-left text-sm font-semibold text-gray-900 border-r border-gray-200"
              {...props}
            />
          ),
          td: ({ ...props }) => (
            <td
              className="px-4 py-3 text-sm text-gray-800 border-r border-gray-200"
              {...props}
            />
          ),
        }}
      >
        {content}
      </ReactMarkdown>
    </div>
  );

  return (
    <div className="space-y-0 px-4 sm:px-6">
      {/* Render all messages */}
      {messages.map((message, index) => (
        <MessageCard key={index} isUser={message.role === "user"}>
          {message.role === "user" ? (
            <div className="text-sm sm:text-base font-medium">
              {message.content}
            </div>
          ) : (
            <>
              <MarkdownContent content={message.content} />
              <BotActions message={message} index={index} />
            </>
          )}
        </MessageCard>
      ))}

      {/* Loading indicator */}
      {loading && (
        <MessageCard isUser={false}>
          <ThinkingIndicator />
        </MessageCard>
      )}

      {/* Streaming text display */}
      {displayedText && !loading && (
        <MessageCard isUser={false}>
          <MarkdownContent content={displayedText} />
          <div className="flex items-center justify-between mt-4 pt-3 border-t border-gray-100">
            <div className="flex items-center gap-2">
              <div className="flex items-center gap-1">
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-pulse"></div>
                <div
                  className="w-2 h-2 bg-gray-400 rounded-full animate-pulse"
                  style={{ animationDelay: "0.2s" }}
                ></div>
                <div
                  className="w-2 h-2 bg-gray-400 rounded-full animate-pulse"
                  style={{ animationDelay: "0.4s" }}
                ></div>
              </div>
              <span className="text-xs text-gray-500">AI is typing...</span>
            </div>
          </div>
        </MessageCard>
      )}
    </div>
  );
};
