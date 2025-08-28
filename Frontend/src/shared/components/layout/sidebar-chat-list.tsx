import React, { useState } from "react";
import {
  FiMessageSquare,
  FiStar,
  FiClock,
  FiEdit2,
  FiTrash2,
  FiChevronRight,
} from "react-icons/fi";
import { Star } from "lucide-react";

interface Chat {
  id: string;
  title: string;
  lastUpdated: string;
  numChats: number;
  startTime: string;
  starred: boolean;
}

interface SidebarChatListProps {
  chats: Chat[];
  activeChatId: string | null;
  searchQuery: string;
  onSelectChat: (chatId: string) => void;
  onStarToggle: (chatId: string) => void;
  onRenameChat: (chatId: string, newTitle: string) => void;
  onDeleteChat: (chatId: string) => void;
  darkMode: boolean;
}

export const SidebarChatList: React.FC<SidebarChatListProps> = ({
  chats,
  activeChatId,
  searchQuery,
  onSelectChat,
  onStarToggle,
  onRenameChat,
  onDeleteChat,
  darkMode,
}) => {
  const [editingChatId, setEditingChatId] = useState<string | null>(null);
  const [editedTitle, setEditedTitle] = useState("");

  const filteredChats = chats.filter(chat =>
    chat.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleEditStart = (chat: Chat) => {
    setEditingChatId(chat.id);
    setEditedTitle(chat.title);
  };

  const handleEditSave = () => {
    if (editingChatId && editedTitle.trim()) {
      onRenameChat(editingChatId, editedTitle.trim());
      setEditingChatId(null);
      setEditedTitle("");
    }
  };

  const handleEditCancel = () => {
    setEditingChatId(null);
    setEditedTitle("");
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInHours = (now.getTime() - date.getTime()) / (1000 * 60 * 60);

    if (diffInHours < 24) {
      return date.toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      });
    } else if (diffInHours < 168) {
      return date.toLocaleDateString([], { weekday: "short" });
    } else {
      return date.toLocaleDateString([], { month: "short", day: "numeric" });
    }
  };

  return (
    <div className="flex-1 overflow-y-auto">
      {filteredChats.length === 0 ? (
        <div
          className={`p-4 text-center ${
            darkMode ? "text-gray-400" : "text-gray-500"
          }`}
        >
          {searchQuery ? "No chats found" : "No chats yet"}
        </div>
      ) : (
        <div className="space-y-1 p-2">
          {filteredChats.map(chat => (
            <div
              key={chat.id}
              className={`group relative rounded-lg p-3 cursor-pointer transition-colors ${
                activeChatId === chat.id
                  ? darkMode
                    ? "bg-teal-600 text-white"
                    : "bg-teal-100 text-teal-900"
                  : darkMode
                    ? "hover:bg-gray-700 text-gray-200"
                    : "hover:bg-gray-100 text-gray-700"
              }`}
              onClick={() => onSelectChat(chat.id)}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3 flex-1 min-w-0">
                  <FiMessageSquare className="w-4 h-4 flex-shrink-0" />
                  <div className="flex-1 min-w-0">
                    {editingChatId === chat.id ? (
                      <input
                        type="text"
                        value={editedTitle}
                        onChange={e => setEditedTitle(e.target.value)}
                        onBlur={handleEditSave}
                        onKeyDown={e => {
                          if (e.key === "Enter") handleEditSave();
                          if (e.key === "Escape") handleEditCancel();
                        }}
                        className={`w-full bg-transparent border-none outline-none ${
                          darkMode ? "text-white" : "text-gray-900"
                        }`}
                        autoFocus
                      />
                    ) : (
                      <div className="truncate font-medium">{chat.title}</div>
                    )}
                    <div
                      className={`text-xs ${
                        darkMode ? "text-gray-300" : "text-gray-500"
                      }`}
                    >
                      {formatDate(chat.lastUpdated)}
                    </div>
                  </div>
                </div>

                <div className="flex items-center space-x-1 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button
                    onClick={e => {
                      e.stopPropagation();
                      onStarToggle(chat.id);
                    }}
                    className={`p-1 rounded hover:bg-opacity-20 ${
                      darkMode ? "hover:bg-white" : "hover:bg-black"
                    }`}
                  >
                    {chat.starred ? (
                      <Star className="w-3 h-3 fill-current" />
                    ) : (
                      <FiStar className="w-3 h-3" />
                    )}
                  </button>
                  <button
                    onClick={e => {
                      e.stopPropagation();
                      handleEditStart(chat);
                    }}
                    className={`p-1 rounded hover:bg-opacity-20 ${
                      darkMode ? "hover:bg-white" : "hover:bg-black"
                    }`}
                  >
                    <FiEdit2 className="w-3 h-3" />
                  </button>
                  <button
                    onClick={e => {
                      e.stopPropagation();
                      onDeleteChat(chat.id);
                    }}
                    className={`p-1 rounded hover:bg-opacity-20 ${
                      darkMode ? "hover:bg-white" : "hover:bg-black"
                    }`}
                  >
                    <FiTrash2 className="w-3 h-3" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
