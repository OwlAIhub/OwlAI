import React from "react";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";

interface NewChatButtonProps {
  onNewChat: () => void;
  disabled?: boolean;
}

export const NewChatButton: React.FC<NewChatButtonProps> = ({
  onNewChat,
  disabled = false,
}) => {
  return (
    <div className="px-3 mb-3">
      <Button
        onClick={onNewChat}
        disabled={disabled}
        className="w-full bg-teal-600 hover:bg-teal-700 text-white shadow-sm"
        size="default"
      >
        <Plus className="mr-2 h-4 w-4" />
        New Chat
      </Button>
    </div>
  );
};
