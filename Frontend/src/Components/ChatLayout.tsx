import React from "react";
import { AppSidebar } from "@/components/app-sidebar";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Separator } from "@/components/ui/separator";
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import MainContent from "./MainContent";

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
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <header className="flex h-16 shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-12 border-b border-gray-100 bg-white">
          <div className="flex items-center gap-2 px-4">
            <SidebarTrigger className="-ml-1 text-black hover:bg-gray-100 p-2 rounded-md" />
            <Separator
              orientation="vertical"
              className="mr-2 data-[orientation=vertical]:h-4"
            />
            <Breadcrumb>
              <BreadcrumbList>
                <BreadcrumbItem className="hidden md:block">
                  <BreadcrumbLink href="/chat">Owl AI Chat</BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator className="hidden md:block" />
                <BreadcrumbItem>
                  <BreadcrumbPage>
                    {currentChatTitle || "New Conversation"}
                  </BreadcrumbPage>
                </BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>
          </div>
        </header>
        <div className="flex flex-1 flex-col">
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
      </SidebarInset>
    </SidebarProvider>
  );
};
