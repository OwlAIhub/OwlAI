"use client";

import * as React from "react";
import { MessageCircle, Plus } from "lucide-react";

import owlLogo from "@/assets/owl-ai-logo.png";

import { NavMain } from "./nav-main";
import { NavProjects } from "./nav-projects";
import { NavSecondary } from "./nav-secondary";
import { NavUser } from "./nav-user";
import { Button } from "@/shared/components/ui/button";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/shared/components/ui/sidebar";

interface SidebarData {
  user: {
    name: string;
    email: string;
    avatar?: string;
    plan?: string;
  };
  navMain: Array<{
    title: string;
    url: string;
    icon: any;
    isActive?: boolean;
    items?: Array<{
      title: string;
      url: string;
      isActive?: boolean;
    }>;
  }>;
  navSecondary: Array<{
    title: string;
    url: string;
    icon: any;
  }>;
  recentChats: Array<{
    id: string;
    title: string;
    lastMessage: string;
    timestamp: string;
    isStarred?: boolean;
  }>;
}

// Default data - will be replaced with props
const defaultData: SidebarData = {
  user: {
    name: "Guest User",
    email: "guest@owlai.com",
    plan: "Free",
  },
  navMain: [
    {
      title: "Chat",
      url: "/chat",
      icon: MessageCircle,
      isActive: true,
      items: [
        {
          title: "History",
          url: "/chat/history",
        },
      ],
    },
  ],
  navSecondary: [],
  recentChats: [],
};

interface AppSidebarProps extends React.ComponentProps<typeof Sidebar> {
  data?: Partial<SidebarData>;
  onNewChat?: () => void;
  onChatSelect?: (chatId: string) => void;
}

export function AppSidebar({
  data: propData,
  onNewChat,
  onChatSelect,
  ...props
}: AppSidebarProps) {
  const data = { ...defaultData, ...propData };

  return (
    <Sidebar className="border-r-0 bg-background" {...props}>
      <SidebarHeader className="border-b border-border/40">
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton size="lg" asChild>
              <a href="/chat" className="group">
                <div className="bg-gradient-to-br from-teal-500/95 to-teal-600/95 backdrop-blur-sm text-white flex aspect-square size-11 items-center justify-center rounded-2xl shadow-md hover:shadow-lg transition-all duration-200 overflow-hidden border border-white/10">
                  <img
                    src={owlLogo}
                    alt="OwlAI Logo"
                    className="size-8 object-contain filter brightness-110"
                  />
                </div>
                <div className="grid flex-1 text-left leading-tight ml-1">
                  <span className="truncate font-semibold text-lg text-foreground group-hover:text-teal-600 transition-colors duration-200 tracking-tight">
                    OwlAI
                  </span>
                  <span className="truncate text-xs text-muted-foreground/80 font-medium tracking-wide">
                    AI Assistant
                  </span>
                </div>
              </a>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>

      <SidebarContent className="px-0">
        {/* New Chat Button */}
        <div className="px-3 py-2">
          <Button
            onClick={onNewChat}
            className="w-full h-8 bg-gradient-to-r from-teal-500/90 to-teal-600/90 hover:from-teal-500 hover:to-teal-600 text-white text-sm font-medium border-0 shadow-sm hover:shadow-md transition-all duration-150 ease-out rounded-lg"
            size="sm"
          >
            <Plus className="size-4 mr-1.5" />
            New Chat
          </Button>
        </div>

        <NavMain items={data.navMain} />
        {data.recentChats && data.recentChats.length > 0 && (
          <NavProjects
            projects={data.recentChats.map(chat => ({
              name: chat.title,
              url: `/chat/${chat.id}`,
              icon: MessageCircle,
            }))}
          />
        )}
        <NavSecondary items={data.navSecondary} className="mt-auto" />
      </SidebarContent>

      <SidebarFooter className="border-t border-border/40">
        <NavUser user={{ ...data.user, avatar: data.user.avatar || "" }} />
      </SidebarFooter>
    </Sidebar>
  );
}
