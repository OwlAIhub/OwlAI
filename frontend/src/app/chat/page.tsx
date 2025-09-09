"use client";

import { ChatContainer } from "@/components/chat/ChatContainer";
import { ChatSidebar } from "@/components/chat/ChatSidebar";
import { PerformanceMonitor } from "@/components/chat/PerformanceMonitor";
import {
    SidebarInset,
    SidebarProvider,
    SidebarTrigger,
} from "@/components/ui/sidebar";
import { useAuth } from "@/lib/contexts/AuthContext";
import { Menu } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense, useEffect } from "react";

function ChatContent() {
  const { user, loading, authError } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();
  const sessionId = searchParams.get("session"); // eslint-disable-line @typescript-eslint/no-unused-vars

  useEffect(() => {
    // Only redirect if auth is fully loaded and user is definitely not authenticated
    if (!loading && !user) {
      console.log('User not authenticated, redirecting to login...');
      router.push("/auth");
    }
  }, [user, loading, router]);

  // Show error if Firebase config failed
  if (authError) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen p-4">
        <div className="bg-red-50 border border-red-200 rounded-lg p-6 max-w-md text-center">
          <h2 className="text-red-800 font-semibold mb-2">Authentication Error</h2>
          <p className="text-red-600 text-sm mb-4">{authError}</p>
          <p className="text-gray-600 text-xs">Please check your Firebase configuration and try again.</p>
          <div className="mt-4 space-x-2">
            <button
              onClick={() => window.location.reload()}
              className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
            >
              Retry
            </button>
            <button
              onClick={() => router.push('/')}
              className="px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-700"
            >
              Go Home
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Show loading while auth state is being determined
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        <p className="ml-3 text-gray-600">Loading chat...</p>
      </div>
    );
  }

  // Show loading if user state is still being determined
  if (!user) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        <p className="ml-3 text-gray-600">Checking authentication...</p>
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

      {/* Performance Monitor */}
      <PerformanceMonitor />
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
