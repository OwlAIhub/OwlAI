"use client";

import * as React from "react";
import {
  Brain,
  GraduationCap,
  MessageSquare,
  Settings2,
  SquareTerminal,
  Target,
} from "lucide-react";

import { NavMain } from "@/components/nav-main";
import { NavProjects } from "@/components/nav-projects";
import { NavUser } from "@/components/nav-user";
import { TeamSwitcher } from "@/components/team-switcher";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
} from "@/components/ui/sidebar";

// Owl AI themed data
const data = {
  user: {
    name: "Student",
    email: "student@owlai.com",
    avatar: "/avatars/student.jpg",
  },
  teams: [
    {
      name: "UGC NET",
      logo: GraduationCap,
      plan: "Premium",
    },
    {
      name: "CSIR-NET",
      logo: Brain,
      plan: "Pro",
    },
    {
      name: "SSC CGL",
      logo: Target,
      plan: "Free",
    },
  ],
  navMain: [
    {
      title: "AI Chat",
      url: "/chat",
      icon: MessageSquare,
      isActive: true,
      items: [
        {
          title: "New Chat",
          url: "/chat",
        },
        {
          title: "Chat History",
          url: "/chat/history",
        },
        {
          title: "Saved Questions",
          url: "/chat/saved",
        },
      ],
    },
    {
      title: "Practice Tests",
      url: "/tests",
      icon: SquareTerminal,
      items: [
        {
          title: "Mock Exams",
          url: "/tests/mock",
        },
        {
          title: "Previous Papers",
          url: "/tests/previous",
        },
        {
          title: "Custom Tests",
          url: "/tests/custom",
        },
        {
          title: "Performance",
          url: "/tests/performance",
        },
      ],
    },
    {
      title: "Settings",
      url: "/settings",
      icon: Settings2,
      items: [
        {
          title: "Profile",
          url: "/settings/profile",
        },
        {
          title: "Preferences",
          url: "/settings/preferences",
        },
        {
          title: "Notifications",
          url: "/settings/notifications",
        },
        {
          title: "Subscription",
          url: "/settings/subscription",
        },
      ],
    },
  ],
  projects: [],
};

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        <TeamSwitcher teams={data.teams} />
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={data.navMain} />
        <NavProjects projects={data.projects} />
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={data.user} />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}
