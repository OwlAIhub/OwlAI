import React from "react";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Separator } from "@/components/ui/separator";
import { MainContent } from "../../../core/chat/main-content";

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
