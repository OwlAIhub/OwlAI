import React, { useState, useRef, useEffect, useCallback } from "react";
import { Send } from "lucide-react";
import { Button } from "@/shared/components/ui/button";
import { Input } from "@/shared/components/ui/input";
import { ScrollArea } from "@/shared/components/ui/scroll-area";
import { ChatMessage } from "./chat-message";
import { ChatStarter } from "./chat-starter";
import { TypingIndicator } from "./typing-indicator";
import { flowiseService } from "../../../core/api/services/flowise.service";

interface Message {
  id: string;
  type: "user" | "bot";
  content: string;
  timestamp: Date;
}

export const ChatInterface: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [hasStarted, setHasStarted] = useState(false);
  const scrollAreaRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const scrollToBottom = () => {
    if (scrollAreaRef.current) {
      const scrollContainer = scrollAreaRef.current.querySelector(
        "[data-radix-scroll-area-viewport]"
      );
      if (scrollContainer) {
        scrollContainer.scrollTop = scrollContainer.scrollHeight;
      }
    }
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

  // Check for preset query from hero section
  useEffect(() => {
    const presetQuery = localStorage.getItem("presetQuery");
    if (presetQuery && !hasStarted) {
      // Clear the preset query from localStorage
      localStorage.removeItem("presetQuery");
      // Auto-send the message
      handleSendMessage(presetQuery);
    }
  }, [hasStarted]);

  const handlePromptSelect = useCallback((prompt: string) => {
    setInputValue(prompt);
    handleSendMessage(prompt);
  }, []);

  const handleSendMessage = async (content?: string) => {
    const messageContent = content || inputValue.trim();
    if (!messageContent) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      type: "user",
      content: messageContent,
      timestamp: new Date(),
    };

    if (!hasStarted) {
      const greetingMessage: Message = {
        id: "greeting",
        type: "bot",
        content:
          "Hello! I'm OwlAI, your intelligent assistant. How can I help you today?",
        timestamp: new Date(),
      };
      setMessages([greetingMessage, userMessage]);
      setHasStarted(true);
    } else {
      setMessages(prev => [...prev, userMessage]);
    }

    setInputValue("");
    setIsTyping(true);

    // Use Flowise service for real AI responses
    try {
      const result = await flowiseService.sendMessage(
        messageContent,
        "default-session",
        "anonymous-user"
      );

      const botMessage: Message = {
        id: (Date.now() + 1).toString(),
        type: "bot",
        content: result.text || "Sorry, I couldn't generate a response.",
        timestamp: new Date(),
      };
      setMessages(prev => [...prev, botMessage]);
    } catch (error) {
      console.error("Error getting AI response:", error);
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        type: "bot",
        content: "I'm having trouble connecting right now. Please try again.",
        timestamp: new Date(),
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsTyping(false);
    }
  };

  const handleKeyPress = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === "Enter" && !e.shiftKey) {
        e.preventDefault();
        handleSendMessage();
      }
    },
    [inputValue]
  );

  return (
    <div className="flex flex-col h-full bg-background">
      {/* Messages Area */}
      {!hasStarted ? (
        <ChatStarter onPromptSelect={handlePromptSelect} />
      ) : (
        <ScrollArea ref={scrollAreaRef} className="flex-1 px-3 py-2">
          <div className="space-y-3 pb-3 max-w-4xl mx-auto">
            {messages.map(message => (
              <ChatMessage key={message.id} message={message} />
            ))}
            {isTyping && <TypingIndicator />}
          </div>
        </ScrollArea>
      )}

      {/* Input Area at Bottom - ChatGPT Style */}
      <div className="border-t border-border/20 p-4 bg-background/98 backdrop-blur-sm">
        <div className="flex items-center space-x-3 max-w-4xl mx-auto">
          <div className="flex-1 relative">
            <Input
              ref={inputRef}
              value={inputValue}
              onChange={e => setInputValue(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Message OwlAI..."
              className="h-12 pr-12 rounded-2xl border-border/40 focus:border-teal-400 transition-all duration-200 text-sm bg-background shadow-sm focus:shadow-md"
              disabled={isTyping}
            />
            <Button
              onClick={() => handleSendMessage()}
              disabled={!inputValue.trim() || isTyping}
              size="icon"
              className="absolute right-2 top-1/2 transform -translate-y-1/2 h-8 w-8 rounded-xl bg-gradient-to-r from-teal-500 to-teal-600 hover:from-teal-600 hover:to-teal-700 transition-all duration-200 hover:scale-105 disabled:opacity-50 disabled:hover:scale-100"
            >
              <Send className="h-4 w-4" />
            </Button>
          </div>
        </div>
        <div className="text-xs text-muted-foreground/60 text-center mt-2">
          OwlAI can make mistakes. Consider checking important information.
        </div>
      </div>
    </div>
  );
};
