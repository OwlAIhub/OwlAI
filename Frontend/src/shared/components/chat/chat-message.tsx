import React from "react";
import { Bot, User, Copy, ThumbsUp, ThumbsDown } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/shared/components/ui/avatar";
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
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <div className={`flex items-start space-x-3 group animate-in fade-in slide-in-from-bottom-4 duration-500 ${
      isBot ? 'flex-row' : 'flex-row-reverse space-x-reverse'
    }`}>
      {/* Avatar */}
      <Avatar className={`w-8 h-8 border-2 transition-all duration-300 ${
        isBot 
          ? 'border-teal-500/30 bg-gradient-to-br from-teal-500 to-teal-600' 
          : 'border-blue-500/30 bg-gradient-to-br from-blue-500 to-blue-600'
      }`}>
        {isBot ? (
          <AvatarImage src={owlLogo} alt="OwlAI" className="p-1" />
        ) : (
          <AvatarFallback className="text-white text-xs font-semibold">
            <User className="h-4 w-4" />
          </AvatarFallback>
        )}
      </Avatar>

      {/* Message Content */}
      <div className={`flex-1 max-w-[70%] ${isBot ? 'mr-12' : 'ml-12'}`}>
        <div className={`rounded-2xl px-4 py-3 transition-all duration-300 ${
          isBot 
            ? 'bg-muted/60 hover:bg-muted/80 border border-border/40' 
            : 'bg-gradient-to-r from-teal-500 to-teal-600 text-white shadow-lg'
        }`}>
          <p className={`text-sm leading-relaxed ${
            isBot ? 'text-foreground' : 'text-white'
          }`}>
            {message.content}
          </p>
        </div>

        {/* Message Actions & Timestamp */}
        <div className={`flex items-center mt-2 space-x-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300 ${
          isBot ? 'justify-start' : 'justify-end'
        }`}>
          <span className="text-xs text-muted-foreground">
            {formatTime(message.timestamp)}
          </span>
          
          {isBot && (
            <div className="flex items-center space-x-1">
              <Button
                variant="ghost"
                size="icon"
                className="h-6 w-6 hover:bg-muted/60"
                onClick={handleCopy}
              >
                <Copy className="h-3 w-3" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                className="h-6 w-6 hover:bg-muted/60 hover:text-green-600"
              >
                <ThumbsUp className="h-3 w-3" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                className="h-6 w-6 hover:bg-muted/60 hover:text-red-600"
              >
                <ThumbsDown className="h-3 w-3" />
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
