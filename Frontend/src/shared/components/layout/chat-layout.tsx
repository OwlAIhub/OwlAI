import React from "react";
import { MainContent } from "../../../core/chat/main-content";
import { Sidebar } from "./sidebar";

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
    <div className="flex h-screen">
      {/* Sidebar */}
      <Sidebar
        isOpen={isSidebarOpen}
        onClose={toggleSidebar}
        onSelectChat={() => {}}
        activeChatId={sessionId}
        setChats={() => {}}
        onUserProfileClick={onUserProfileClick}
        setSesssionId={setSessionId}
      />
      
      {/* Main Content */}
      <MainContent
        currentChatTitle={currentChatTitle}
        darkMode={darkMode}
        isSidebarOpen={isSidebarOpen}
        toggleSidebar={toggleSidebar}
        onLogout={onLogout}
        toggleDarkMode={toggleDarkMode}
        onUserProfileClick={onUserProfileClick}
        onNewChat={onNewChat}
        sessionId={sessionId}
        setSessionId={setSessionId}
        isLoggedIn={isLoggedIn}
      />
    </div>
  );
};
