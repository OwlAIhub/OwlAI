"use client";

import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/buttons/button";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { useAuth } from "@/lib/contexts/AuthContext";
import {
  OnboardingProfile,
  getOnboardingProfile,
} from "@/lib/services/onboardingService";
import {
  ChevronRight,
  History,
  LogOut,
  MessageCircle,
  MoreHorizontal,
  Pin,
  Plus,
  Settings,
  User,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

// Mock data for chat sessions
const chatSessions = [
  {
    id: "1",
    title: "UGC NET Computer Science Prep",
    timestamp: "2 hours ago",
    isPinned: true,
    category: "study",
  },
  {
    id: "2",
    title: "Data Structures & Algorithms",
    timestamp: "1 day ago",
    isPinned: false,
    category: "study",
  },
  {
    id: "3",
    title: "Previous Year Questions",
    timestamp: "3 days ago",
    isPinned: false,
    category: "practice",
  },
  {
    id: "4",
    title: "Mock Test Discussion",
    timestamp: "1 week ago",
    isPinned: false,
    category: "practice",
  },
];

export function ChatSidebar() {
  const { user, userProfile, signOut } = useAuth();
  const router = useRouter();
  const [isHistoryOpen, setIsHistoryOpen] = useState(true);

  const [onboardingProfile, setOnboardingProfile] =
    useState<OnboardingProfile | null>(null);

  useEffect(() => {
    const loadOnboardingProfile = async () => {
      if (user?.uid) {
        try {
          const profile = await getOnboardingProfile(user.uid);
          setOnboardingProfile(profile);
        } catch (error) {
          console.error("Error loading onboarding profile:", error);
        }
      }
    };

    loadOnboardingProfile();
  }, [user?.uid]);

  const handleSignOut = async () => {
    try {
      await signOut();
      router.push("/");
    } catch (error) {
      console.error("Sign out error:", error);
    }
  };

  const handleNewChat = () => {
    // TODO: Create new chat session
    console.log("Creating new chat...");
  };

  return (
    <Sidebar className="border-r border-border/40 bg-gradient-to-b from-background/95 to-background/80 backdrop-blur-xl">
      {/* Header */}
      <SidebarHeader className="border-b border-border/40 p-4">
        <div className="flex items-center gap-3">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10">
            <svg
              className="h-5 w-5 text-primary"
              viewBox="0 0 24 24"
              fill="currentColor"
            >
              <path d="M12 2C13.1 2 14 2.9 14 4C14 5.1 13.1 6 12 6C10.9 6 10 5.1 10 4C10 2.9 10.9 2 12 2ZM21 9V7L15 1L13.5 2.5L16.17 5.17C15.24 5.06 14.32 5 13.4 5C10.2 5 7.13 5.69 4.42 7.01C2.84 7.76 2 9.38 2 11.13V20C2 21.1 2.9 22 4 22H8V19H4V11.13C4 10.76 4.18 10.42 4.5 10.26C6.71 9.2 9.5 8.5 12.4 8.5C13.13 8.5 13.85 8.54 14.56 8.62L12 11.18V22H20C21.1 22 22 21.1 22 20V9H21Z" />
            </svg>
          </div>
          <div className="flex flex-col">
            <h2 className="text-sm font-semibold text-foreground">OwlAI</h2>
            <p className="text-xs text-muted-foreground">
              Your Study Companion
            </p>
          </div>
        </div>

        {/* New Chat Button */}
        <Button
          onClick={handleNewChat}
          className="mt-3 w-full justify-start gap-2 bg-primary/10 text-primary hover:bg-primary/20 hover:text-primary"
          variant="ghost"
        >
          <Plus className="h-4 w-4" />
          New Chat
        </Button>
      </SidebarHeader>

      {/* Content */}
      <SidebarContent className="px-2">
        {/* Chat History */}
        <SidebarGroup>
          <Collapsible open={isHistoryOpen} onOpenChange={setIsHistoryOpen}>
            <SidebarGroupLabel asChild>
              <CollapsibleTrigger className="group/collapsible flex w-full items-center justify-between p-2 text-sm font-medium text-muted-foreground hover:text-foreground">
                <div className="flex items-center gap-2">
                  <History className="h-4 w-4" />
                  Recent Chats
                </div>
                <ChevronRight className="h-4 w-4 transition-transform group-data-[state=open]/collapsible:rotate-90" />
              </CollapsibleTrigger>
            </SidebarGroupLabel>
            <CollapsibleContent>
              <SidebarGroupContent>
                <SidebarMenu>
                  {chatSessions.map((session) => (
                    <SidebarMenuItem key={session.id}>
                      <SidebarMenuButton className="h-auto p-2">
                        <div className="flex items-start gap-2 min-w-0 flex-1">
                          <MessageCircle className="h-4 w-4 mt-0.5 text-muted-foreground flex-shrink-0" />
                          <div className="min-w-0 flex-1">
                            <div className="flex items-center gap-1">
                              <p className="text-sm font-medium text-foreground truncate">
                                {session.title}
                              </p>
                              {session.isPinned && (
                                <Pin className="h-3 w-3 text-primary flex-shrink-0" />
                              )}
                            </div>
                            <p className="text-xs text-muted-foreground">
                              {session.timestamp}
                            </p>
                          </div>
                        </div>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  ))}
                </SidebarMenu>
              </SidebarGroupContent>
            </CollapsibleContent>
          </Collapsible>
        </SidebarGroup>
      </SidebarContent>

      {/* Footer */}
      <SidebarFooter className="border-t border-border/40 p-4">
        <div className="flex items-center gap-3">
          <Avatar className="h-8 w-8">
            <AvatarFallback className="bg-primary/10 text-primary text-xs font-medium">
              {user?.phoneNumber?.slice(-2) || "U"}
            </AvatarFallback>
          </Avatar>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-foreground truncate">
              {userProfile?.phoneNumber || user?.phoneNumber || "User"}
            </p>
            <p className="text-xs text-muted-foreground">
              {onboardingProfile?.exam || "Student"}
            </p>
          </div>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-48">
              <DropdownMenuItem onClick={() => router.push("/profile")}>
                <User className="h-4 w-4 mr-2" />
                Profile Settings
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                onClick={handleSignOut}
                className="text-destructive focus:text-destructive"
              >
                <LogOut className="h-4 w-4 mr-2" />
                Sign Out
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </SidebarFooter>
    </Sidebar>
  );
}
