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
  darkMode,
  isSidebarOpen,
  toggleSidebar,
  currentChatTitle,
  isLoggedIn,
  sessionId,
  setSessionId,
  onLogout,
  toggleDarkMode,
  onUserProfileClick,
  onNewChat,
}) => {
  return (
    <SidebarOnly
      darkMode={darkMode}
      isSidebarOpen={isSidebarOpen}
      onToggleSidebar={toggleSidebar}
      currentChatTitle={currentChatTitle}
      isLoggedIn={isLoggedIn}
      sessionId={sessionId}
      setSessionId={setSessionId}
      onLogout={onLogout}
      toggleDarkMode={toggleDarkMode}
      onUserProfileClick={onUserProfileClick}
      onNewChat={onNewChat}
    />
  );
};
