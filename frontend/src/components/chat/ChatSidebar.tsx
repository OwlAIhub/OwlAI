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
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { useAuth } from "@/lib/contexts/AuthContext";
import { useChat } from "@/lib/contexts/ChatContext";
import {
  ChevronRight,
  History,
  LogOut,
  MoreHorizontal,
  Plus,
  Trash2,
  User,
} from "lucide-react";
import Image from "next/image";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";

export function ChatSidebar() {
  const { user, userProfile, signOut } = useAuth();
  const { state, createNewSession, loadSession, deleteSession } = useChat();
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isHistoryOpen, setIsHistoryOpen] = useState(true);

  const currentSessionId = searchParams.get("session");

  // Load current session on mount
  useEffect(() => {
    if (currentSessionId && currentSessionId !== state.currentSession?.id) {
      loadSession(currentSessionId);
    }
  }, [currentSessionId, state.currentSession?.id, loadSession]);

  const handleSignOut = async () => {
    try {
      await signOut();
      router.push("/auth?mode=signup");
    } catch (error) {
      console.error("Sign out error:", error);
    }
  };

  const handleNewChat = async () => {
    try {
      const newSession = await createNewSession();
      router.push(`/chat?session=${newSession.id}`);
    } catch (error) {
      console.error("Error creating new chat:", error);
    }
  };

  const handleSelectSession = (sessionId: string) => {
    router.push(`/chat?session=${sessionId}`);
  };

  const handleDeleteSession = async (
    sessionId: string,
    event: React.MouseEvent,
  ) => {
    event.stopPropagation();
    try {
      await deleteSession(sessionId);
      if (currentSessionId === sessionId) {
        router.push("/chat");
      }
    } catch (error) {
      console.error("Error deleting session:", error);
    }
  };

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
            <h2 className="text-sm font-semibold bg-gradient-to-r from-black to-green-600 bg-clip-text text-transparent">
              OwlAI
            </h2>
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
                  {state.isLoadingSessions ? (
                    <div className="text-center p-4 text-muted-foreground text-sm">
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-primary mx-auto mb-2"></div>
                      Loading chats...
                    </div>
                  ) : state.sessions.length === 0 ? (
                    <div className="text-center p-4 text-muted-foreground text-sm">
                      No chat history yet
                      <br />
                      <span className="text-xs">Start a new conversation!</span>
                    </div>
                  ) : (
                    state.sessions.map((session) => (
                      <SidebarMenuItem key={session.id}>
                        <div
                          onClick={() => handleSelectSession(session.id)}
                          className={`group w-full flex items-center justify-between px-3 py-2 rounded-md cursor-pointer transition-all ${
                            currentSessionId === session.id
                              ? "bg-gray-100 text-gray-900"
                              : "text-gray-700 hover:bg-gray-50"
                          }`}
                        >
                          <div className="min-w-0 flex-1">
                            <p className="text-sm truncate font-medium">
                              {session.title}
                            </p>
                          </div>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-5 w-5 p-0 opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-50 hover:text-red-600"
                            onClick={(e) => handleDeleteSession(session.id, e)}
                          >
                            <Trash2 className="h-3 w-3" />
                          </Button>
                        </div>
                      </SidebarMenuItem>
                    ))
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
            <p className="text-xs text-muted-foreground">Student</p>
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
                className="text-destructive focus:text-destructive hover:bg-red-50 hover:text-red-600"
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
