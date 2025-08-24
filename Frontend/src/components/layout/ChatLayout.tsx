import React from "react";
import { AnimatePresence, motion } from "framer-motion";
import { MainContent } from "@/components/features/chat/MainContent";
import { Sidebar } from "@/components/layout/Sidebar";
import { cn } from "@/lib/utils";

interface ChatLayoutProps {
  darkMode: boolean; // Keep for backward compatibility temporarily
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
  darkMode, // Keeping for compatibility
  isSidebarOpen,
  toggleSidebar,
  currentChatTitle,
  sessionId,
  setSessionId,
  onLogout,
  toggleDarkMode,
  onUserProfileClick,
  onNewChat,
}) => {
  return (
    <div className="flex h-screen bg-background overflow-hidden">
      {/* Sidebar with responsive behavior */}
      <AnimatePresence mode="wait">
        {isSidebarOpen && (
          <motion.div
            initial={{ x: -320, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: -320, opacity: 0 }}
            transition={{
              type: "spring",
              damping: 30,
              stiffness: 300,
              opacity: { duration: 0.2 },
            }}
            className="relative z-30 lg:z-auto"
          >
            <Sidebar
              isOpen={isSidebarOpen}
              onClose={toggleSidebar}
              darkMode={darkMode}
              currentUser={{ plan: "free" }}
              onUserProfileClick={onUserProfileClick}
              onNewChat={onNewChat}
              setSesssionId={setSessionId}
              activeChatId={sessionId}
              chats={[]}
              setChats={() => {}}
              onSelectChat={() => {}}
            />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Backdrop for mobile */}
      <AnimatePresence>
        {isSidebarOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-20 lg:hidden"
            onClick={toggleSidebar}
          />
        )}
      </AnimatePresence>

      {/* Main Content Area */}
      <div
        className={cn(
          "flex-1 flex flex-col min-w-0",
          "transition-all duration-300 ease-in-out",
          // Responsive margins based on sidebar state
          isSidebarOpen ? "lg:ml-0" : "ml-0"
        )}
      >
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
    </div>
  );
};
