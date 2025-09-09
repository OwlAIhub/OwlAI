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
} from "@/components/ui/sidebar";
import { useAuth } from "@/lib/contexts/AuthContext";
import { chatService } from "@/lib/services/chatService";
import {
    OnboardingProfile,
    getOnboardingProfile,
} from "@/lib/services/onboardingService";
import { ClientChatSession } from "@/lib/types/chat";
import {
    ChevronRight,
    History,
    LogOut,
    MessageCircle,
    MoreHorizontal,
    Pin,
    Plus,
    User,
} from "lucide-react";
import Image from "next/image";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";

// Helper function to format timestamp
const formatTimestamp = (date: Date): string => {
  const now = new Date();
  const diffInMs = now.getTime() - date.getTime();
  const diffInMinutes = Math.floor(diffInMs / (1000 * 60));
  const diffInHours = Math.floor(diffInMinutes / 60);
  const diffInDays = Math.floor(diffInHours / 24);

  if (diffInMinutes < 60) {
    return diffInMinutes <= 1 ? "Just now" : `${diffInMinutes} minutes ago`;
  } else if (diffInHours < 24) {
    return diffInHours === 1 ? "1 hour ago" : `${diffInHours} hours ago`;
  } else if (diffInDays < 7) {
    return diffInDays === 1 ? "1 day ago" : `${diffInDays} days ago`;
  } else {
    return date.toLocaleDateString();
  }
};

export function ChatSidebar() {
  const { user, userProfile, signOut } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isHistoryOpen, setIsHistoryOpen] = useState(true);
  const [chatSessions, setChatSessions] = useState<ClientChatSession[]>([]);
  const [loading, setLoading] = useState(true);

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

  // Load chat sessions with proper error handling
  useEffect(() => {
    if (!user?.uid) {
      setChatSessions([]);
      setLoading(false);
      return;
    }

    const loadSessions = async () => {
      try {
        setLoading(true);
        console.log('Loading sessions for user:', user.uid);
        const response = await chatService.getChatSessions(user.uid);
        console.log('Sessions loaded:', response.data);
        setChatSessions(response.data || []);
      } catch (error) {
        console.error('Error loading sessions:', error);
        setChatSessions([]);
        // Don't throw the error, just log it and continue
      } finally {
        setLoading(false);
      }
    };

    loadSessions();
  }, [user?.uid]); // Only depend on user.uid to avoid infinite loops

  const handleSignOut = async () => {
    try {
      await signOut();
      router.push("/");
    } catch (error) {
      console.error("Sign out error:", error);
    }
  };

  const handleNewChat = async () => {
    if (!user?.uid) return;

    try {
      const sessionId = await chatService.createChatSession(user.uid, {
        title: "New Chat",
        category: "general",
      });

      // Navigate to the new chat session
      router.push(`/chat?session=${sessionId}`);
    } catch (error) {
      console.error("Error creating new chat:", error);
    }
  };

  const handleSessionClick = (sessionId: string) => {
    router.push(`/chat?session=${sessionId}`);
  };

  const currentSessionId = searchParams.get("session");

  return (
    <Sidebar className="border-r border-border/40 bg-gradient-to-b from-background/95 to-background/80 backdrop-blur-xl">
      {/* Header */}
      <SidebarHeader className="border-b border-border/40 p-4">
        <div className="flex items-center gap-3">
          <div className="flex h-8 w-8 items-center justify-center">
            <Image
              src="/apple-touch-icon.png"
              alt="OwlAI"
              width={32}
              height={32}
              className="w-full h-full object-contain"
              unoptimized
            />
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
                  {loading ? (
                    <div className="flex items-center justify-center p-4">
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-primary"></div>
                    </div>
                  ) : chatSessions.length === 0 ? (
                    <div className="text-center p-4 text-muted-foreground text-sm">
                      No chat sessions yet
                    </div>
                  ) : (
                    chatSessions && chatSessions.length > 0 ? chatSessions.map((session) => (
                      <SidebarMenuItem key={session.id}>
                        <SidebarMenuButton
                          className={`h-auto p-2 ${
                            currentSessionId === session.id
                              ? "bg-primary/10 text-primary"
                              : "hover:bg-muted/50"
                          }`}
                          onClick={() => handleSessionClick(session.id)}
                        >
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
                                {formatTimestamp(session.lastMessage.timestamp)}
                              </p>
                            </div>
                          </div>
                        </SidebarMenuButton>
                      </SidebarMenuItem>
                    )) : (
                      <div className="text-center p-4 text-muted-foreground text-sm">
                        Loading sessions...
                      </div>
                    )
                  )}
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
