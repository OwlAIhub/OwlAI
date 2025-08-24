import React from 'react';
import { AnimatePresence } from 'framer-motion';
import { User } from '@/types';
import { MainContent } from '@/components/features/chat/MainContent';
import Sidebar from '@/Components/Sidebar'; // Keep old import for now

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
    <div className="flex h-full">
      {/* Sidebar */}
      <AnimatePresence>
        {isSidebarOpen && (
          <Sidebar
            isOpen={isSidebarOpen}
            onClose={toggleSidebar}
            darkMode={darkMode}
            currentUser={{ plan: "Free" }}
            onUserProfileClick={onUserProfileClick}
            onNewChat={onNewChat}
            sessionId={sessionId}
            setSesssionId={setSessionId}
          />
        )}
      </AnimatePresence>

      {/* Main Content */}
      <MainContent
        currentChatTitle={currentChatTitle}
        darkMode={darkMode}
        isSidebarOpen={isSidebarOpen}
        toggleSidebar={toggleSidebar}
        onLogout={onLogout}
        toggleDarkMode={toggleDarkMode}
        sessionId={sessionId}
        setSesssionId={setSessionId}
        onUserProfileClick={onUserProfileClick}
      />
    </div>
  );
};
