import React from "react";
import { AppSidebar } from "../sidebar/components/app-sidebar";
import { SidebarProvider, SidebarInset, SidebarTrigger } from "../ui/sidebar";
import { ChatInterface } from "../chat/chat-interface";

interface SidebarOnlyProps {
  isSidebarOpen?: boolean;
  onToggleSidebar?: () => void;
  onNewChat?: () => void;
}

export const SidebarOnly: React.FC<SidebarOnlyProps> = ({
  isSidebarOpen = true,
  onToggleSidebar = () => {},
  onNewChat = () => console.log("New chat clicked"),
}) => {
  return (
    <SidebarProvider open={isSidebarOpen} onOpenChange={onToggleSidebar}>
      <div className="flex h-screen w-full">
        {/* Our Beautiful Sidebar */}
        <AppSidebar
          data={{
            user: {
              name: "Demo User",
              email: "demo@owlai.com",
              plan: "Free",
            },
            recentChats: [], // Empty for demo
          }}
          onNewChat={onNewChat}
          onChatSelect={chatId => console.log("Chat selected:", chatId)}
        />

        {/* Chat Interface */}
        <SidebarInset className="flex-1 flex flex-col overflow-hidden bg-background">
          <div className="flex items-center justify-between p-4 border-b border-border/40 bg-background/95 backdrop-blur-sm">
            <div className="flex items-center space-x-3">
              <SidebarTrigger className="h-8 w-8 hover:bg-accent hover:text-accent-foreground transition-all duration-300 ease-out hover:scale-110 active:scale-95 hover:rotate-180" />
              <div className="text-sm text-muted-foreground">
                <span className="hover:text-teal-600 transition-colors cursor-pointer">
                  Chat
                </span>
                <span className="mx-2">›</span>
                <span className="font-medium text-foreground">
                  General Chat
                </span>
              </div>
            </div>
          </div>

                    <div className="flex-1 overflow-hidden">
            <ChatInterface />
          </div>
        </SidebarInset>
      </div>
    </SidebarProvider>
  );
};
