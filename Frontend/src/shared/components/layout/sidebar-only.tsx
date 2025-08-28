import React from "react";
import { AppSidebar } from "../sidebar/components/app-sidebar";
import { SidebarProvider, SidebarInset, SidebarTrigger } from "../ui/sidebar";

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
          onChatSelect={(chatId) => console.log("Chat selected:", chatId)}
        />

        {/* Simple Main Area with Toggle Button */}
        <SidebarInset className="flex-1 flex flex-col overflow-hidden bg-background">
          <div className="flex items-center p-4 border-b border-border/40">
            <SidebarTrigger className="h-8 w-8 hover:bg-accent hover:text-accent-foreground transition-colors" />
            <div className="flex-1 text-center">
              <h1 className="text-lg font-semibold text-foreground">
                OwlAI Sidebar Demo
              </h1>
            </div>
          </div>
          
          <div className="flex-1 flex items-center justify-center text-muted-foreground">
            <div className="text-center">
              <h2 className="text-xl font-medium mb-2">Sidebar Implementation</h2>
              <p>Toggle the sidebar to see the collapsed state</p>
              <p className="text-sm mt-2">Keyboard shortcut: Ctrl+B (or Cmd+B)</p>
            </div>
          </div>
        </SidebarInset>
      </div>
    </SidebarProvider>
  );
};
