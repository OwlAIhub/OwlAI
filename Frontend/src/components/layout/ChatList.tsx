import React from 'react';
import { 
  FiMessageSquare, 
  FiStar, 
  FiClock, 
  FiEdit2, 
  FiTrash2,
  FiX 
} from "react-icons/fi";
import { Star } from "lucide-react";
import { ChatSession } from '@/types';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

interface ChatListProps {
  chats: ChatSession[];
  darkMode: boolean;
  activeChatId?: string | null;
  searchQuery: string;
  editingChatId: string | null;
  editedTitle: string;
  onChatClick: (chat: ChatSession) => void;
  onStarToggle: (chatId: string, e: React.MouseEvent) => void;
  onEditStart: (chatId: string, currentTitle: string, e: React.MouseEvent) => void;
  onEditChange: (value: string) => void;
  onEditSubmit: (chatId: string) => void;
  onEditCancel: () => void;
  onDelete: (chatId: string) => void;
}

interface ThemeColors {
  text: string;
  secondaryText: string;
  hoverBg: string;
  activeBg: string;
  icon: string;
  star: string;
  accent: string;
  scrollbar: string;
}

export const ChatList: React.FC<ChatListProps> = ({
  chats,
  darkMode,
  activeChatId,
  searchQuery,
  editingChatId,
  editedTitle,
  onChatClick,
  onStarToggle,
  onEditStart,
  onEditChange,
  onEditSubmit,
  onEditCancel,
  onDelete,
}) => {
  const theme: ThemeColors = {
    text: darkMode ? 'text-gray-100' : 'text-gray-800',
    secondaryText: darkMode ? 'text-gray-400' : 'text-gray-600',
    hoverBg: darkMode ? 'hover:bg-gray-800' : 'hover:bg-gray-100',
    activeBg: darkMode ? 'bg-gray-800' : 'bg-gray-100',
    icon: darkMode ? 'text-gray-400' : 'text-gray-500',
    star: darkMode ? 'text-yellow-400' : 'text-yellow-500',
    accent: darkMode ? 'text-teal-400' : 'text-teal-600',
    scrollbar: darkMode ? 'scrollbar-thumb-gray-700' : 'scrollbar-thumb-gray-300',
  };

  const filteredChats = chats.filter(chat =>
    chat?.title?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const starredChats = filteredChats.filter(chat => chat?.starred);
  const regularChats = filteredChats.filter(chat => !chat?.starred);

  const handleKeyPress = (e: React.KeyboardEvent, chatId: string) => {
    if (e.key === 'Enter') {
      onEditSubmit(chatId);
    } else if (e.key === 'Escape') {
      onEditCancel();
    }
  };

  const renderChatItem = (chat: ChatSession) => (
    <div
      key={chat.id}
      onClick={() => onChatClick(chat)}
      className={`flex items-center justify-between px-3 py-2 rounded-lg cursor-pointer transition-colors ${
        activeChatId === chat.id ? theme.activeBg : theme.hoverBg
      }`}
      aria-label={`Open chat: ${chat.title}`}
    >
      <div className="flex items-center min-w-0 flex-1">
        <FiMessageSquare className={`mr-2 flex-shrink-0 ${theme.icon}`} />
        {editingChatId === chat.id ? (
          <Input
            type="text"
            value={editedTitle}
            onChange={(e) => onEditChange(e.target.value)}
            onBlur={() => onEditSubmit(chat.id)}
            onKeyDown={(e) => handleKeyPress(e, chat.id)}
            autoFocus
            className={`flex-1 bg-transparent border-none outline-none ${theme.text} focus:ring-0 p-0 h-auto`}
          />
        ) : (
          <span className={`truncate ${theme.text}`}>{chat.title}</span>
        )}
      </div>
      
      <div className="flex items-center ml-2 space-x-1">
        {/* Star button */}
        <Button
          variant="ghost"
          size="sm"
          onClick={(e) => onStarToggle(chat.id, e)}
          className={`p-1 h-auto hover:bg-gray-200 dark:hover:bg-gray-700 ${theme.icon}`}
          aria-label={chat.starred ? "Unstar chat" : "Star chat"}
        >
          {chat.starred ? (
            <Star className={`${theme.star} w-4 h-4 fill-current`} />
          ) : (
            <Star className={`${theme.icon} w-4 h-4`} />
          )}
        </Button>

        {/* Edit button */}
        <Button
          variant="ghost"
          size="sm"
          onClick={(e) => onEditStart(chat.id, chat.title, e)}
          className={`p-1 h-auto hover:bg-gray-200 dark:hover:bg-gray-700 ${theme.icon}`}
          aria-label="Edit chat title"
        >
          <FiEdit2 size={14} />
        </Button>

        {/* Delete button */}
        <Button
          variant="ghost" 
          size="sm"
          onClick={(e) => {
            e.stopPropagation();
            if (window.confirm("Are you sure you want to delete this chat?")) {
              onDelete(chat.id);
            }
          }}
          className={`p-1 h-auto hover:bg-gray-200 dark:hover:bg-gray-700 ${theme.icon}`}
          aria-label="Delete chat"
        >
          <FiTrash2 size={14} />
        </Button>
      </div>
    </div>
  );

  return (
    <div className={`flex-1 overflow-y-auto py-2 px-1 scrollbar-thin ${theme.scrollbar}`}>
      {/* Starred Chats Section */}
      {starredChats.length > 0 && (
        <div className="mb-4">
          <div className={`text-xs uppercase tracking-wider mb-2 flex items-center px-3 py-1 ${theme.accent}`}>
            <FiStar className="mr-2" /> Starred
          </div>
          {starredChats.map(renderChatItem)}
        </div>
      )}

      {/* Recent Chats Section */}
      <div className="mb-4">
        <div className={`text-xs uppercase tracking-wider mb-2 flex items-center px-3 py-1 ${theme.secondaryText}`}>
          <FiClock className="mr-2" /> Recent
        </div>
        {regularChats.length > 0 ? (
          regularChats.map(renderChatItem)
        ) : (
          <div className={`text-center py-4 text-sm ${theme.secondaryText}`}>
            {searchQuery ? "No matching chats" : "No recent chats"}
          </div>
        )}
      </div>
    </div>
  );
};
