import React from "react";
import { Avatar, AvatarImage } from "@/shared/components/ui/avatar";
import owlLogo from "@/assets/owl-ai-logo.png";

export const TypingIndicator: React.FC = () => {
  return (
    <div className="flex items-start space-x-3 animate-in fade-in slide-in-from-bottom-4 duration-500">
      {/* Avatar */}
      <Avatar className="w-8 h-8 border-2 border-teal-500/30 bg-gradient-to-br from-teal-500 to-teal-600">
        <AvatarImage src={owlLogo} alt="OwlAI" className="p-1" />
      </Avatar>

      {/* Typing Animation */}
      <div className="flex-1 max-w-[70%] mr-12">
        <div className="rounded-2xl px-4 py-3 bg-muted/60 border border-border/40 transition-all duration-300">
          <div className="flex items-center space-x-1">
            <span className="text-sm text-muted-foreground mr-2">
              OwlAI is thinking
            </span>
            <div className="flex space-x-1">
              <div className="w-2 h-2 bg-teal-500 rounded-full animate-bounce [animation-delay:-0.3s]"></div>
              <div className="w-2 h-2 bg-teal-500 rounded-full animate-bounce [animation-delay:-0.15s]"></div>
              <div className="w-2 h-2 bg-teal-500 rounded-full animate-bounce"></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
