import React from 'react';
import { FiPlus } from "react-icons/fi";
import { Button } from '@/components/ui/button';

interface NewChatButtonProps {
  onNewChat: () => void;
  darkMode: boolean;
  disabled?: boolean;
}

export const NewChatButton: React.FC<NewChatButtonProps> = ({
  onNewChat,
  darkMode,
  disabled = false,
}) => {
  return (
    <div className="px-3 mb-2">
      <Button
        onClick={onNewChat}
        disabled={disabled}
        className={`w-full flex items-center justify-center py-2.5 font-medium transition-colors shadow-md bg-owl-primary hover:bg-owl-primary-dark text-white`}
      >
        <FiPlus className="mr-2" />
        New Chat
      </Button>
    </div>
  );
};
