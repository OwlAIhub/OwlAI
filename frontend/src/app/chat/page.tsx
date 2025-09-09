"use client";

import { ChatSidebar } from "@/components/chat/ChatSidebar";
import { ChatContainer } from "@/components/chat/ChatContainer";
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

            {/* Chat Container */}
            <div className="flex-1 min-h-0">
              <ChatContainer 
                className="h-full"
                welcomeMessage="Hello! I'm your AI learning assistant. How can I help you study today?"
                starterPrompts={[
                  "Research methodology for UGC NET",
                  "UGC NET Paper 1 strategies", 
                  "30-day study plan for Economics",
                  "Teaching aptitude section tips"
                ]}
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
