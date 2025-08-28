import React from "react";
import { SidebarOnly } from "./sidebar-only";

interface ChatLayoutProps {
  darkMode: boolean;
  isSidebarOpen: boolean;
  toggleSidebar: () => void;
  currentChatTitle: string;
  isLoggedIn: boolean;
  sessionId: string | null;
  setSessionId: (id: string | null) => void;
  onLogout: () => void;
  toggleDarkMode: () => void;
  onUserProfileClick: () => void;
  onNewChat: () => void;
}

export const ChatLayout: React.FC<ChatLayoutProps> = ({
  isSidebarOpen,
  toggleSidebar,
  onNewChat,
}) => {
  return (
    <SidebarOnly
      isSidebarOpen={isSidebarOpen}
      onToggleSidebar={toggleSidebar}
      onNewChat={onNewChat}
    />
  );
};
