"use client";

import { ChatContainer } from "@/components/chat/ChatContainer";
import { ChatSidebar } from "@/components/chat/ChatSidebar";
import { PerformanceMonitor } from "@/components/chat/PerformanceMonitor";
import { ErrorBoundary } from "@/components/ErrorBoundary";
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
  const demoMode = searchParams.get("demo") === "true";

  useEffect(() => {
    // Only redirect if auth is fully loaded and user is definitely not authenticated
    // Also check for auth errors - if auth is broken, don't redirect
    // Skip redirect if in demo mode
    if (!loading && !user && !authError && !demoMode) {
      console.log('User not authenticated, redirecting to login...');
      router.push("/auth");
    }
  }, [user, loading, router, authError, demoMode]);

  // Show error if Firebase config failed
  if (authError) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen p-4">
        <div className="bg-red-50 border border-red-200 rounded-lg p-6 max-w-md text-center">
          <h2 className="text-red-800 font-semibold mb-2">Connection Error</h2>
          <p className="text-red-600 text-sm mb-4">{authError}</p>
          <p className="text-gray-600 text-xs">This might be a temporary network issue or configuration problem.</p>
          <div className="mt-4 space-y-2">
            <div className="flex space-x-2">
              <button
                onClick={() => window.location.reload()}
                className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 text-sm"
              >
                Try Again
              </button>
              <button
                onClick={() => router.push('/')}
                className="px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-700 text-sm"
              >
                Go Home
              </button>
            </div>
            <button
              onClick={() => {
                // Provide a way to continue without auth (if the chat can work offline)
                router.push('/chat?demo=true');
              }}
              className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 text-sm w-full"
            >
              Continue with Demo Mode
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

  // Show loading if user state is still being determined (unless in demo mode)
  if (!user && !demoMode) {
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
                <h1 className="text-lg font-semibold bg-gradient-to-r from-black to-green-600 bg-clip-text text-transparent">
                  OwlAI Chat
                  {demoMode && (
                    <span className="ml-2 text-xs bg-orange-100 text-orange-800 px-2 py-1 rounded-full">
                      Demo Mode
                    </span>
                  )}
                </h1>
              </div>
            </header>

            {/* Chat Container */}
            <div className="flex-1 min-h-0">
              <ChatContainer
                className="h-full"
                welcomeMessage="Hello! I'm OwlAI, your friendly study companion! 🦉 I'm here to help you master UGC NET Paper-1 (Units 1-4) with clear explanations and practice questions. What would you like to explore today?"
                starterPrompts={[
                  "What are the key components of teaching aptitude in higher education?",
                  "How does research aptitude contribute to effective educational practices?",
                  "What are the main elements of effective communication in an educational context?",
                  "How do comprehension skills impact learning outcomes in students?"
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
    <ErrorBoundary>
      <Suspense fallback={
        <div className="flex items-center justify-center min-h-screen">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        </div>
      }>
        <ChatContent />
      </Suspense>
    </ErrorBoundary>
  );
}
