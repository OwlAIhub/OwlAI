"use client";

import { ChatSidebar } from "@/components/chat/ChatSidebar";
import { RealtimeChatContainer } from "@/components/chat/RealtimeChatContainer";
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { useAuth } from "@/lib/contexts/AuthContext";
import { Menu } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";

function ChatContent() {
  const { user } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();
  const sessionId = searchParams.get("session");

  useEffect(() => {
    if (!user) {
      router.push("/login");
    }
  }, [user, router]);

  if (!user) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <SidebarProvider>
      <div className="flex h-screen w-full">
        {/* Sidebar */}
        <ChatSidebar />
        
        {/* Main Chat Area */}
        <SidebarInset className="flex-1">
          <div className="flex h-full flex-col">
            {/* Header */}
            <header className="flex h-16 shrink-0 items-center gap-2 border-b px-4">
              <SidebarTrigger className="-ml-1">
                <Menu className="h-4 w-4" />
              </SidebarTrigger>
              <div className="flex flex-1 items-center gap-2 px-3">
                <h1 className="text-lg font-semibold">OwlAI Chat</h1>
              </div>
            </header>

            {/* Real-time Chat Container */}
            <div className="flex-1 min-h-0">
              <RealtimeChatContainer 
                sessionId={sessionId || undefined}
                className="h-full"
              />
            </div>
          </div>
        </SidebarInset>
      </div>
    </SidebarProvider>
  );
}

export default function ChatPage() {
  return (
    <Suspense fallback={
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    }>
      <ChatContent />
    </Suspense>
  );
}
