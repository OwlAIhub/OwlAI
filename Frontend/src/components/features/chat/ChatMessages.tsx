import React from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { ThumbsUp, ThumbsDown, Copy, Check } from "lucide-react";
import { ChatMessage } from "@/types";
import { Button } from "@/components/ui/button";
import { TypingIndicator } from "@/components/ui/loading";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";

interface ChatMessagesProps {
  messages: ChatMessage[];
  copiedIndex: number | null;
  onFeedback: (index: number, type: "like" | "dislike") => void;
  onCopy: (text: string, index: number) => void;
  displayedText?: string;
  loading?: boolean;
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
        "flex w-full mb-6",
        isUser ? "justify-end" : "justify-start"
      )}
    >
      <Card
        className={cn(
          "max-w-[85%] sm:max-w-3xl shadow-sm border-0",
          isUser ? "bg-owl-primary text-white" : "bg-muted/50",
          className
        )}
      >
        <CardContent className="p-4 sm:p-6">{children}</CardContent>
      </Card>
    </div>
  );

  const ThinkingIndicator: React.FC = () => (
    <div className="flex items-center gap-3 text-muted-foreground animate-fade-in-up">
      <span className="text-sm font-medium">Thinking</span>
      <TypingIndicator />
    </div>
  );

  const BotActions: React.FC<{ message: ChatMessage; index: number }> = ({
    message,
    index,
  }) => (
    <div className="flex items-center gap-2 mt-4 pt-3 border-t border-border/50">
      <Button
        variant="ghost"
        size="sm"
        onClick={() => onFeedback(index, "like")}
        className={cn(
          "h-8 px-3 text-xs gap-1.5 hover:bg-green-500/10 hover:text-green-600",
          message.feedback === "like" && "bg-green-500/10 text-green-600"
        )}
      >
        <ThumbsUp className="h-3 w-3" />
        {message.feedback === "like" ? "Thanks!" : "Helpful"}
      </Button>

      <Button
        variant="ghost"
        size="sm"
        onClick={() => onFeedback(index, "dislike")}
        className={cn(
          "h-8 px-3 text-xs gap-1.5 hover:bg-red-500/10 hover:text-red-600",
          message.feedback === "dislike" && "bg-red-500/10 text-red-600"
        )}
      >
        <ThumbsDown className="h-3 w-3" />
        {message.feedback === "dislike" ? "Noted" : "Not helpful"}
      </Button>

      <Button
        variant="ghost"
        size="sm"
        onClick={() => onCopy(message.content, index)}
        className="h-8 px-3 text-xs gap-1.5 hover:bg-blue-500/10 hover:text-blue-600"
      >
        {copiedIndex === index ? (
          <>
            <Check className="h-3 w-3" />
            Copied!
          </>
        ) : (
          <>
            <Copy className="h-3 w-3" />
            Copy
          </>
        )}
      </Button>
    </div>
  );

  const MarkdownContent: React.FC<{ content: string }> = ({ content }) => (
    <div className="prose prose-sm sm:prose-base dark:prose-invert max-w-none prose-headings:text-owl-accent prose-strong:text-owl-primary prose-code:text-owl-primary prose-pre:bg-muted prose-pre:border">
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        components={{
          h1: ({ node, ...props }) => (
            <h1
              className="text-xl sm:text-2xl font-bold my-4 text-owl-accent"
              {...props}
            />
          ),
          h2: ({ node, ...props }) => (
            <h2
              className="text-lg sm:text-xl font-bold my-3 text-owl-accent/80"
              {...props}
            />
          ),
          h3: ({ node, ...props }) => (
            <h3
              className="text-base sm:text-lg font-semibold my-2 text-owl-accent/70"
              {...props}
            />
          ),
          p: ({ node, ...props }) => (
            <p
              className="my-3 leading-relaxed text-sm sm:text-base"
              {...props}
            />
          ),
          strong: ({ node, ...props }) => (
            <strong className="font-bold text-owl-primary" {...props} />
          ),
          em: ({ node, ...props }) => (
            <em className="italic text-muted-foreground" {...props} />
          ),
          ul: ({ node, ...props }) => (
            <ul className="list-disc pl-6 my-3 space-y-1" {...props} />
          ),
          ol: ({ node, ...props }) => (
            <ol className="list-decimal pl-6 my-3 space-y-1" {...props} />
          ),
          li: ({ node, ...props }) => (
            <li className="text-sm sm:text-base" {...props} />
          ),
          code: ({ node, inline, className, children, ...props }: any) =>
            inline ? (
              <code
                className="bg-muted px-1.5 py-0.5 rounded text-xs font-mono"
                {...props}
              >
                {children}
              </code>
            ) : (
              <code
                className="block bg-muted p-3 rounded-lg text-xs font-mono overflow-x-auto"
                {...props}
              >
                {children}
              </code>
            ),
          blockquote: ({ node, ...props }) => (
            <blockquote
              className="border-l-4 border-owl-primary/30 pl-4 py-2 my-4 bg-muted/30 rounded-r"
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
        </MessageCard>
      )}
    </div>
  );
};
