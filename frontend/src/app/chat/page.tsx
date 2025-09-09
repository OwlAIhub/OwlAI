"use client";

import { ChatInput } from "@/components/chat/ChatInput";
import { ChatMessage } from "@/components/chat/ChatMessage";
import { ChatSidebar } from "@/components/chat/ChatSidebar";
import { TypingIndicator } from "@/components/chat/TypingIndicator";
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { useChat } from "@/hooks/useChat";
import { useAuth } from "@/lib/contexts/AuthContext";
import { Menu } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function ChatPage() {
  const { user, loading } = useAuth();
  const router = useRouter();

  const { messages, isLoading, sendMessage, regenerateMessage, isTyping } =
    useChat();

  useEffect(() => {
    if (!loading && !user) {
      router.push("/login");
    }
  }, [user, loading, router]);

  const handleSendMessage = (message: string) => {
    sendMessage(message);
  };

  const handleStarterPromptClick = (prompt: string) => {
    sendMessage(prompt);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 via-gray-100 to-gray-200">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!user) {
    return null; // Will redirect to login
  }

  return (
    <div className="h-screen w-full bg-white overflow-hidden">
      <SidebarProvider className="h-full">
        <ChatSidebar />
        <SidebarInset className="h-full">
        {/* Main Content */}
        <div className="flex-1 bg-white relative flex flex-col h-full">
          {/* Floating Sidebar Toggle */}
          <div className="absolute top-2 left-2 sm:top-4 sm:left-4 z-20">
            <SidebarTrigger className="h-8 w-8 sm:h-10 sm:w-10 p-0 bg-white border border-gray-200 shadow-sm hover:bg-gray-50 hover:shadow-md transition-all duration-200 rounded-md flex items-center justify-center">
              <Menu className="h-3 w-3 sm:h-4 sm:w-4 text-gray-600" />
            </SidebarTrigger>
          </div>

          {/* Chat Interface */}
           <div className='relative z-10 flex-1 flex flex-col w-full h-full max-w-none sm:max-w-4xl sm:mx-auto px-2 sm:px-0'>
             {/* Messages Area - Scrollable */}
             <div 
               id="messages-container"
               className='flex-1 overflow-y-auto overflow-x-hidden px-2 sm:px-4 py-4 sm:py-6 min-h-0 relative'
               style={{
                 height: 'calc(100vh - 120px)',
                 scrollbarWidth: 'thin',
                 scrollbarColor: 'rgba(156, 163, 175, 0.4) transparent',
                 paddingRight: '16px',
                 WebkitOverflowScrolling: 'touch',
                 scrollBehavior: 'smooth',
                 touchAction: 'auto',
                 overscrollBehavior: 'auto'
               }}
               onWheel={(e) => e.stopPropagation()}
               onTouchMove={(e) => e.stopPropagation()}
             >
              {messages.length === 0 ? (
                /* Welcome Content */
                <div className="flex flex-col items-center justify-center h-full max-w-full sm:max-w-3xl mx-auto px-4">
                  <div className="text-center mb-8 sm:mb-12">
                    <div className="w-12 h-12 sm:w-16 sm:h-16 flex items-center justify-center mx-auto mb-4 sm:mb-6">
                      <img
                        src="/owl-ai-logo.png"
                        alt="OwlAI Logo"
                        className="w-full h-full object-contain"
                      />
                    </div>
                    <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 mb-2 sm:mb-3">
                      Welcome to OwlAI
                    </h1>
                    <p className="text-base sm:text-lg text-gray-600 mb-4 sm:mb-6">
                      Your personalized AI learning assistant
                    </p>
                    <div className="max-w-full sm:max-w-2xl mx-auto">
                      <p className="text-sm sm:text-base text-gray-700 leading-relaxed">
                        OwlAI is your dedicated learning companion designed to
                        help you master any subject efficiently. Whether
                        you&apos;re preparing for exams, learning new skills, or
                        seeking in-depth knowledge, I provide tailored study
                        plans, interactive lessons, and expert guidance to
                        enhance your learning experience.
                      </p>
                    </div>
                  </div>

                  {/* Starter Prompts */}
                  <div className="w-full max-w-2xl">
                    <h3 className="text-lg font-medium text-gray-900 mb-4 text-center">
                      Try asking about:
                    </h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <button
                        onClick={() =>
                          handleStarterPromptClick(
                            "Can you explain the key concepts of research methodology for UGC NET?",
                          )
                        }
                        className="text-left p-4 rounded-xl border border-gray-200 hover:border-primary/50 hover:bg-primary/5 transition-all duration-200 group"
                        disabled={isLoading}
                      >
                        <p className="text-sm text-gray-700 group-hover:text-primary transition-colors">
                          Research methodology for UGC NET
                        </p>
                      </button>
                      <button
                        onClick={() =>
                          handleStarterPromptClick(
                            "What are the most effective study strategies for UGC NET Paper 1?",
                          )
                        }
                        className="text-left p-4 rounded-xl border border-gray-200 hover:border-primary/50 hover:bg-primary/5 transition-all duration-200 group"
                        disabled={isLoading}
                      >
                        <p className="text-sm text-gray-700 group-hover:text-primary transition-colors">
                          UGC NET Paper 1 strategies
                        </p>
                      </button>
                      <button
                        onClick={() =>
                          handleStarterPromptClick(
                            "Could you create a 30-day study plan for UGC NET Economics?",
                          )
                        }
                        className="text-left p-4 rounded-xl border border-gray-200 hover:border-primary/50 hover:bg-primary/5 transition-all duration-200 group"
                        disabled={isLoading}
                      >
                        <p className="text-sm text-gray-700 group-hover:text-primary transition-colors">
                          30-day study plan for Economics
                        </p>
                      </button>
                      <button
                        onClick={() =>
                          handleStarterPromptClick(
                            "How should I approach the teaching aptitude section in UGC NET?",
                          )
                        }
                        className="text-left p-4 rounded-xl border border-gray-200 hover:border-primary/50 hover:bg-primary/5 transition-all duration-200 group"
                        disabled={isLoading}
                      >
                        <p className="text-sm text-gray-700 group-hover:text-primary transition-colors">
                          Teaching aptitude section tips
                        </p>
                      </button>
                    </div>
                  </div>
                </div>
              ) : (
                /* Chat Messages */
                <div className="space-y-6">
                  {messages.map((message) => (
                    <ChatMessage
                      key={message.id}
                      id={message.id}
                      content={message.content}
                      sender={message.sender}
                      timestamp={message.timestamp}
                      status={message.status}
                      onCopy={(content) => console.log("Copied:", content)}
                      onRegenerate={regenerateMessage}
                      onFeedback={(id, type) =>
                        console.log("Feedback:", id, type)
                      }
                    />
                  ))}

                  {/* Typing Indicator */}
                  {isTyping && (
                    <TypingIndicator />
                  )}
                </div>
              )}
            </div>

            {/* Fixed Centered Search Bar - ChatGPT Style */}
            <div className="sticky bottom-0 bg-white border-t border-gray-100 p-4">
              <div className="max-w-3xl mx-auto">
                <ChatInput
                  onSendMessage={handleSendMessage}
                  placeholder={
                    messages.length === 0
                      ? "Ask me anything about your studies..."
                      : "Continue the conversation..."
                  }
                  disabled={isLoading}
                  loading={isLoading}
                />
              </div>
            </div>
          </div>
        </div>
      </SidebarInset>
    </SidebarProvider>
    </div>
  );
}
