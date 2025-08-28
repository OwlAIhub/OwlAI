import React from "react";
import { User, Copy, ThumbsUp, ThumbsDown } from "lucide-react";
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
      {/* Compact Avatar */}
      <Avatar
        className={`w-6 h-6 border transition-all duration-200 ${
          isBot
            ? "border-teal-400/40 bg-gradient-to-br from-teal-500 to-teal-600"
            : "border-blue-400/40 bg-gradient-to-br from-blue-500 to-blue-600"
        }`}
      >
        {isBot ? (
          <AvatarImage src={owlLogo} alt="OwlAI" className="p-0.5" />
        ) : (
          <AvatarFallback className="text-white text-xs font-medium">
            <User className="h-3 w-3" />
          </AvatarFallback>
        )}
      </Avatar>

      {/* Message Content */}
      <div
        className={`flex-1 ${isBot ? "max-w-[85%] mr-4" : "max-w-[75%] ml-8"}`}
      >
        <div
          className={`rounded-xl transition-all duration-200 ${
            isBot
              ? "bg-muted/40 hover:bg-muted/60 border border-border/30 px-4 py-3"
              : "bg-gradient-to-r from-teal-500 to-teal-600 text-white shadow-sm px-3 py-2"
          }`}
        >
          {isBot ? (
            <div className="prose prose-sm max-w-none prose-slate dark:prose-invert overflow-hidden break-words">
              <ReactMarkdown
                remarkPlugins={[remarkGfm]}
                components={{
                  h1: ({ children }) => (
                    <h1 className="text-lg font-bold mb-3 text-foreground">
                      {children}
                    </h1>
                  ),
                  h2: ({ children }) => (
                    <h2 className="text-base font-semibold mb-2 text-foreground">
                      {children}
                    </h2>
                  ),
                  h3: ({ children }) => (
                    <h3 className="text-sm font-semibold mb-2 text-foreground">
                      {children}
                    </h3>
                  ),
                  p: ({ children }) => (
                    <p className="text-sm leading-relaxed mb-2 text-foreground last:mb-0">
                      {children}
                    </p>
                  ),
                  ul: ({ children }) => (
                    <ul className="list-disc ml-4 space-y-1 mb-2 text-sm">
                      {children}
                    </ul>
                  ),
                  ol: ({ children }) => (
                    <ol className="list-decimal ml-4 space-y-1 mb-2 text-sm">
                      {children}
                    </ol>
                  ),
                  li: ({ children }) => (
                    <li className="text-foreground leading-relaxed pl-2">
                      {children}
                    </li>
                  ),
                  strong: ({ children }) => (
                    <strong className="font-semibold text-foreground">
                      {children}
                    </strong>
                  ),
                  code: ({ children }) => (
                    <code className="bg-muted px-1 py-0.5 rounded text-xs font-mono">
                      {children}
                    </code>
                  ),
                  blockquote: ({ children }) => (
                    <blockquote className="border-l-2 border-teal-500 pl-3 italic text-muted-foreground">
                      {children}
                    </blockquote>
                  ),
                }}
              >
                {message.content}
              </ReactMarkdown>
            </div>
          ) : (
            <p className="text-sm leading-relaxed text-white">
              {message.content}
            </p>
          )}
        </div>

        {/* Compact Actions */}
        <div
          className={`flex items-center mt-1 space-x-1 opacity-0 group-hover:opacity-100 transition-opacity duration-200 ${
            isBot ? "justify-start" : "justify-end"
          }`}
        >
          <span className="text-xs text-muted-foreground/70">
            {formatTime(message.timestamp)}
          </span>

          {isBot && (
            <div className="flex items-center space-x-0.5">
              <Button
                variant="ghost"
                size="icon"
                className="h-5 w-5 hover:bg-muted/40"
                onClick={handleCopy}
              >
                <Copy className="h-2.5 w-2.5" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                className="h-5 w-5 hover:bg-muted/40 hover:text-green-600"
              >
                <ThumbsUp className="h-2.5 w-2.5" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                className="h-5 w-5 hover:bg-muted/40 hover:text-red-600"
              >
                <ThumbsDown className="h-2.5 w-2.5" />
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
