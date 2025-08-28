"use client";

import * as React from "react";
import {
  BookOpen,
  Bot,
  MessageCircle,
  Settings,
  HelpCircle,
  Crown,
} from "lucide-react";

import { NavMain } from "./nav-main";
import { NavProjects } from "./nav-projects";
import { NavSecondary } from "./nav-secondary";
import { NavUser } from "./nav-user";
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
          title: "New Chat",
          url: "/chat",
        },
        {
          title: "History",
          url: "/chat/history",
        },
        {
          title: "Starred",
          url: "/chat/starred",
        },
      ],
    },
    {
      title: "Learning",
      url: "#",
      icon: BookOpen,
      items: [
        {
          title: "Study Guide",
          url: "/study",
        },
        {
          title: "Practice Tests",
          url: "/practice",
        },
        {
          title: "Progress",
          url: "/progress",
        },
      ],
    },
    {
      title: "Settings",
      url: "#",
      icon: Settings,
      items: [
        {
          title: "Profile",
          url: "/profile",
        },
        {
          title: "Preferences",
          url: "/settings",
        },
        {
          title: "Subscription",
          url: "/subscription",
        },
      ],
    },
  ],
  navSecondary: [
    {
      title: "Help & Support",
      url: "/support",
      icon: HelpCircle,
    },
    {
      title: "Upgrade Plan",
      url: "/subscription",
      icon: Crown,
    },
  ],
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
                <div className="bg-gradient-to-br from-teal-500 to-teal-600 text-white flex aspect-square size-10 items-center justify-center rounded-xl shadow-lg">
                  <Bot className="size-5" />
                </div>
                <div className="grid flex-1 text-left text-sm leading-tight">
                  <span className="truncate font-bold text-foreground group-hover:text-primary transition-colors">
                    OwlAI
                  </span>
                  <span className="truncate text-xs text-muted-foreground">
                    Chat Assistant
                  </span>
                </div>
              </a>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>

      <SidebarContent className="px-0">
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
