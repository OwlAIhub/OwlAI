import React, { useState, useRef, useEffect } from "react";
import { Send, Bot, User, Sparkles } from "lucide-react";
import { Button } from "@/shared/components/ui/button";
import { Input } from "@/shared/components/ui/input";
import { ScrollArea } from "@/shared/components/ui/scroll-area";
import { Avatar, AvatarFallback, AvatarImage } from "@/shared/components/ui/avatar";
import { ChatMessage } from "./chat-message";
import { ChatHeader } from "./chat-header";
import { TypingIndicator } from "./typing-indicator";
import { ChatStarter } from "./chat-starter";

interface Message {
  id: string;
  type: "user" | "bot";
  content: string;
  timestamp: Date;
}

interface ChatInterfaceProps {
  currentChatTitle?: string;
}

export const ChatInterface: React.FC<ChatInterfaceProps> = ({
  currentChatTitle = "New Chat"
}) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [hasStarted, setHasStarted] = useState(false);
  const scrollAreaRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const scrollToBottom = () => {
    if (scrollAreaRef.current) {
      const scrollContainer = scrollAreaRef.current.querySelector('[data-radix-scroll-area-viewport]');
      if (scrollContainer) {
        scrollContainer.scrollTop = scrollContainer.scrollHeight;
      }
    }
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

  const handleSendMessage = async (messageContent?: string) => {
    const content = messageContent || inputValue.trim();
    if (!content) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      type: "user",
      content: content,
      timestamp: new Date()
    };

    // If this is the first message, add greeting first
    if (!hasStarted) {
      const greetingMessage: Message = {
        id: "greeting",
        type: "bot",
        content: "Hello! I'm OwlAI, your intelligent assistant. How can I help you today?",
        timestamp: new Date()
      };
      setMessages([greetingMessage, userMessage]);
      setHasStarted(true);
    } else {
      setMessages(prev => [...prev, userMessage]);
    }

    setInputValue("");
    setIsTyping(true);

    // Simulate AI response
    setTimeout(() => {
      const botMessage: Message = {
        id: (Date.now() + 1).toString(),
        type: "bot",
        content: `I understand you said: "${content}". This is a demo response from OwlAI. In a real implementation, this would connect to your AI backend.`,
        timestamp: new Date()
      };
      setMessages(prev => [...prev, botMessage]);
      setIsTyping(false);
    }, 1500);
  };

  const handlePromptSelect = (prompt: string) => {
    handleSendMessage(prompt);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <div className="flex flex-col h-full bg-background">
      {/* Messages Area */}
      {!hasStarted ? (
        <ChatStarter onPromptSelect={handlePromptSelect} />
      ) : (
        <ScrollArea ref={scrollAreaRef} className="flex-1 px-4 py-2">
          <div className="space-y-4 pb-4">
            {messages.map((message) => (
              <ChatMessage key={message.id} message={message} />
            ))}
            {isTyping && <TypingIndicator />}
          </div>
        </ScrollArea>
      )}

      {/* Input Area */}
      <div className="border-t border-border/40 p-4 bg-background/95 backdrop-blur-sm">
        <div className="flex items-end space-x-3 max-w-4xl mx-auto">
          <div className="flex-1 relative">
            <Input
              ref={inputRef}
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Ask OwlAI anything..."
              className="min-h-[48px] pr-12 resize-none rounded-2xl border-border/60 focus:border-teal-500 transition-all duration-300 text-base"
              disabled={isTyping}
            />
            <Button
              onClick={handleSendMessage}
              disabled={!inputValue.trim() || isTyping}
              size="icon"
              className="absolute right-2 top-1/2 transform -translate-y-1/2 h-8 w-8 rounded-full bg-gradient-to-r from-teal-500 to-teal-600 hover:from-teal-600 hover:to-teal-700 transition-all duration-300 hover:scale-105 disabled:opacity-50 disabled:hover:scale-100"
            >
              <Send className="h-4 w-4" />
            </Button>
          </div>
        </div>
        <div className="text-xs text-muted-foreground/60 text-center mt-2">
          Press Enter to send • Shift + Enter for new line
        </div>
      </div>
    </div>
  );
};
