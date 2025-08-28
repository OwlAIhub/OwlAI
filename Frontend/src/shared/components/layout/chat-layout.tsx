import React from "react";
import { MainContent } from "../../../core/chat/main-content";
import { AppSidebar } from "../sidebar/components/app-sidebar";
import { SidebarProvider, SidebarInset } from "../ui/sidebar";

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
    <SidebarProvider open={isSidebarOpen} onOpenChange={toggleSidebar}>
      <div className="flex h-screen w-full">
        {/* Modern Sidebar */}
        <AppSidebar
          data={{
            user: {
              name: isLoggedIn ? "Current User" : "Guest User",
              email: isLoggedIn ? "user@owlai.com" : "guest@owlai.com",
              plan: "Free",
            },
            recentChats: [], // This can be populated from your chat store
          }}
          onNewChat={onNewChat}
          onChatSelect={chatId => setSessionId(chatId)}
        />

        {/* Main Content Area */}
        <SidebarInset className="flex-1 flex flex-col overflow-hidden">
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
        </SidebarInset>
      </div>
    </SidebarProvider>
  );
};
