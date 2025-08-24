import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { FiPlus } from "react-icons/fi";
import { toast } from "react-toastify";
// FIREBASE AUTH TEMPORARILY DISABLED FOR DESIGN WORK
// import { auth, db } from "../firebase";
// import { doc, getDoc } from "firebase/firestore";
// import { onAuthStateChanged } from "firebase/auth";
import { SidebarHeader } from "@/components/features/sidebar/SidebarHeader";
import { SidebarSearch } from "@/components/features/sidebar/SidebarSearch";
import { SidebarChatList } from "@/components/features/sidebar/SidebarChatList";
import { SidebarUserProfile } from "@/components/features/sidebar/SidebarUserProfile";

interface Chat {
  id: string;
  title: string;
  lastUpdated: string;
  numChats: number;
  startTime: string;
  starred: boolean;
}

interface User {
  uid: string;
  firstName?: string;
  lastName?: string;
  email?: string;
  plan?: string;
  avatar?: string;
}

interface CurrentUser {
  plan?: string;
  avatar?: string;
}

interface SidebarProps {
  isOpen?: boolean;
  onClose?: () => void;
  onNewChat?: () => void;
  onSelectChat?: (chatId: string | null) => void;
  darkMode?: boolean;
  currentUser?: CurrentUser;
  activeChatId?: string | null;
  chats?: Chat[];
  setChats?: (chats: Chat[] | ((prev: Chat[]) => Chat[])) => void;
  onUserProfileClick?: () => void;
  setSesssionId?: (sessionId: string) => void;
}

const Sidebar: React.FC<SidebarProps> = ({
  isOpen = false,
  onClose = () => {},
  onSelectChat = () => {},
  darkMode = false,
  currentUser = {},
  activeChatId = null,
  setChats = () => {},
  onUserProfileClick = () => {},
  setSesssionId,
}) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [chatStore, setChatStore] = useState<Chat[]>([]);
  const [user, setUser] = useState<User | null>(null);
  const navigate = useNavigate();

  // FIREBASE AUTH TEMPORARILY DISABLED FOR DESIGN WORK
  useEffect(() => {
    // Mock user for design work
    setUser({
      uid: "mock-user-id",
      firstName: "Guest",
      lastName: "User",
      email: "guest@example.com",
      plan: "Free",
      avatar: "",
    });
  }, []);

  const handleNewChat = () => {
    // Create a new chat session
    const newChat: Chat = {
      id: Date.now().toString(),
      title: "New Chat",
      lastUpdated: new Date().toISOString(),
      numChats: 0,
      startTime: new Date().toISOString(),
      starred: false,
    };

    setChatStore((prev) => [newChat, ...prev]);
    setChats((prev) => [newChat, ...(Array.isArray(prev) ? prev : [])]);

    if (setSesssionId) {
      setSesssionId(newChat.id);
    }

    onSelectChat(newChat.id);
    onClose();
  };

  const handleStarToggle = (chatId: string) => {
    setChatStore((prev) =>
      prev.map((chat) =>
        chat.id === chatId ? { ...chat, starred: !chat.starred } : chat
      )
    );
    setChats((prev) =>
      (Array.isArray(prev) ? prev : []).map((chat) =>
        chat.id === chatId ? { ...chat, starred: !chat.starred } : chat
      )
    );
  };

  const handleRenameChat = (chatId: string, newTitle: string) => {
    setChatStore((prev) =>
      prev.map((chat) =>
        chat.id === chatId ? { ...chat, title: newTitle } : chat
      )
    );
    setChats((prev) =>
      (Array.isArray(prev) ? prev : []).map((chat) =>
        chat.id === chatId ? { ...chat, title: newTitle } : chat
      )
    );
  };

  const handleDeleteChat = (chatId: string) => {
    setChatStore((prev) => prev.filter((chat) => chat.id !== chatId));
    setChats((prev) =>
      (Array.isArray(prev) ? prev : []).filter((chat) => chat.id !== chatId)
    );

    if (activeChatId === chatId) {
      onSelectChat(null);
    }

    toast.success("Chat deleted successfully");
  };

  return (
    <div
      className={`flex flex-col h-full ${
        darkMode ? "bg-gray-800 text-white" : "bg-white text-gray-900"
      }`}
    >
      <SidebarHeader onClose={onClose} darkMode={darkMode} />

      <SidebarSearch
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        darkMode={darkMode}
      />

      <div className="flex-1 flex flex-col">
        <div className="p-4">
          <button
            onClick={handleNewChat}
            className={`w-full flex items-center justify-center space-x-2 py-3 px-4 rounded-lg font-medium transition-colors ${
              darkMode
                ? "bg-teal-600 hover:bg-teal-700 text-white"
                : "bg-teal-600 hover:bg-teal-700 text-white"
            }`}
          >
            <FiPlus className="w-4 h-4" />
            <span>New Chat</span>
          </button>
        </div>

        <SidebarChatList
          chats={chatStore}
          activeChatId={activeChatId}
          searchQuery={searchQuery}
          onSelectChat={onSelectChat}
          onStarToggle={handleStarToggle}
          onRenameChat={handleRenameChat}
          onDeleteChat={handleDeleteChat}
          darkMode={darkMode}
        />
      </div>

      <SidebarUserProfile
        user={user}
        onUserProfileClick={onUserProfileClick}
        darkMode={darkMode}
      />
    </div>
  );
};

export default Sidebar;
