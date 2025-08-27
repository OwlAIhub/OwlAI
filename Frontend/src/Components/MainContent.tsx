import React, { useEffect, useRef, useState } from "react";
import OwlLogo from "../assets/owlMascot.png";
import OwlLoader from "./OwlLoader";
import { ChatMessage } from "@/components/features/chat/ChatMessage";
import { PlaceholdersAndVanishInput } from "@/components/ui/placeholders-and-vanish-input";
import { useChat } from "@/hooks/useChat";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

interface MainContentProps {
  currentChatTitle: string;
  darkMode: boolean;
  isSidebarOpen: boolean;
  toggleSidebar: () => void;
  onLogout: () => void;
  toggleDarkMode: () => void;
  sessionId: string | null;
  onUserProfileClick: () => void;
  setSessionId: (id: string | null) => void;
  isLoggedIn: boolean;
  onNewChat: () => void;
}

const MainContent: React.FC<MainContentProps> = ({
  darkMode,
  sessionId,
  setSessionId,
  isLoggedIn,
}) => {
  const [isLoading, setIsLoading] = useState(true);
  const [currentChat, setCurrentChat] = useState<Record<string, unknown> | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Placeholders for the animated input
  const placeholders = [
    "What is Research Methodology?",
    "Explain Teaching Aptitude concepts",
    "How to solve Logical Reasoning questions?",
    "What is Communication in education?",
    "Explain UGC NET syllabus",
    "How to prepare for competitive exams?",
    "What are the types of research?",
    "Explain educational psychology",
  ];

  // Use chat hook for Owl AI
  const {
    message,
    setMessage,
    chatMessages,
    loading,
    isInterrupted,
    copiedIndex,
    displayedText,
    handleSendMessage,
    handleCopyMessage,
    handleFeedback,
  } = useChat(sessionId, setSessionId, isLoggedIn);

  // Load chat data
  useEffect(() => {
    const savedChat = localStorage.getItem("selectedChat");
    if (savedChat) {
      setCurrentChat(JSON.parse(savedChat));
    }
  }, []);

  // Handle storage events
  useEffect(() => {
    const handleStorageEvent = (e: StorageEvent) => {
      if (e.key === "selectedChat") {
        setCurrentChat(e.newValue ? JSON.parse(e.newValue) : null);
      }
    };

    window.addEventListener("storage", handleStorageEvent);
    return () => window.removeEventListener("storage", handleStorageEvent);
  }, []);

  // Handle new session events
  useEffect(() => {
    const handleNewSession = () => {
      // Clear messages for new session
    };

    window.addEventListener("newSessionCreated", handleNewSession);
    return () =>
      window.removeEventListener("newSessionCreated", handleNewSession);
  }, []);

  // Load preset query
  useEffect(() => {
    const presetQuery = localStorage.getItem("presetQuery");
    if (presetQuery) {
      setMessage(presetQuery);
      localStorage.removeItem("presetQuery");
    }
  }, [setMessage]);

  // Handlers for PlaceholdersAndVanishInput
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setMessage(e.target.value);
  };

  const handleInputSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (message.trim() && !loading) {
      handleSendMessage();
    }
  };

  // Scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [chatMessages]);

  // Loading effect
  useEffect(() => {
    const hasData =
      sessionId || currentChat || localStorage.getItem("sessionId");
    if (!hasData) {
      setIsLoading(false);
    } else {
      const timer = setTimeout(() => setIsLoading(false), 1500);
      return () => clearTimeout(timer);
    }
  }, [sessionId, currentChat]);

  if (isLoading) {
    return <OwlLoader darkMode={darkMode} />;
  }

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return "Good Morning";
    if (hour < 18) return "Good Afternoon";
    return "Good Evening";
  };

  return (
    <div className="flex flex-col h-full">
      {/* Main content */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Chat Messages */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {chatMessages.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-center">
              <img
                src={OwlLogo}
                alt="Owl AI"
                className="w-24 h-24 mb-6 opacity-80"
              />
              <h1 className="text-3xl font-bold mb-2 text-teal-600">
                {getGreeting()}! 👋
              </h1>
              <p className="text-lg text-black mb-8 max-w-md">
                I&apos;m your AI learning assistant. Ask me anything about your
                studies, and I&apos;ll help you understand concepts better!
              </p>
              <div className="space-y-2">
                <p className="text-sm text-black">Try asking me:</p>
                <div className="flex flex-wrap gap-2 justify-center">
                  {[
                    "Explain Research Methodology",
                    "What is Teaching Aptitude?",
                    "Explain Logical Reasoning",
                    "What is Communication?",
                  ].map(suggestion => (
                    <button
                      key={suggestion}
                      onClick={() => {
                        setMessage(suggestion);
                        // Add a small delay to ensure the message is set before focusing
                        setTimeout(() => {
                          const textarea = document.querySelector("textarea");
                          if (textarea) {
                            textarea.focus();
                          }
                        }, 100);
                      }}
                      className="px-4 py-2 bg-[#009688] hover:bg-[#00796B] rounded-lg text-sm text-white transition-colors shadow-sm hover:shadow-md"
                    >
                      {suggestion}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              {chatMessages.map((msg, index) => (
                <ChatMessage
                  key={index}
                  message={msg}
                  index={index}
                  darkMode={darkMode}
                  copiedIndex={copiedIndex}
                  onCopy={handleCopyMessage}
                  onFeedback={handleFeedback}
                />
              ))}

              {/* Typing animation display */}
              {displayedText && (
                <div className="flex w-full justify-start mb-6">
                  <div className="max-w-[70%] sm:max-w-2xl rounded-xl shadow-sm border bg-white text-gray-900 border-gray-200">
                    <div className="p-4 sm:p-6">
                      <div className="prose max-w-none text-gray-900 prose-headings:text-gray-900 prose-strong:text-gray-900 prose-p:text-gray-900 prose-li:text-gray-900 prose-ul:text-gray-900 prose-ol:text-gray-900">
                        <ReactMarkdown
                          remarkPlugins={[remarkGfm]}
                          components={{
                            h1: ({ ...props }) => (
                              <h1
                                className="text-xl font-bold text-gray-900 mb-3"
                                {...props}
                              />
                            ),
                            h2: ({ ...props }) => (
                              <h2
                                className="text-lg font-bold text-gray-900 mb-2"
                                {...props}
                              />
                            ),
                            h3: ({ ...props }) => (
                              <h3
                                className="text-base font-bold text-gray-900 mb-2"
                                {...props}
                              />
                            ),
                            p: ({ ...props }) => (
                              <p
                                className="text-gray-900 mb-3 leading-relaxed"
                                {...props}
                              />
                            ),
                            ul: ({ ...props }) => (
                              <ul
                                className="list-disc list-inside text-gray-900 mb-3 space-y-1"
                                {...props}
                              />
                            ),
                            ol: ({ ...props }) => (
                              <ol
                                className="list-decimal list-inside text-gray-900 mb-3 space-y-1"
                                {...props}
                              />
                            ),
                            li: ({ ...props }) => (
                              <li className="text-gray-900" {...props} />
                            ),
                            strong: ({ ...props }) => (
                              <strong
                                className="font-semibold text-gray-900"
                                {...props}
                              />
                            ),
                            em: ({ ...props }) => (
                              <em className="italic text-gray-900" {...props} />
                            ),
                            code: ({ inline, children, ...props }: any) =>
                              inline ? (
                                <code
                                  className="bg-gray-100 px-1.5 py-0.5 rounded text-xs font-mono text-gray-800"
                                  {...props}
                                >
                                  {children}
                                </code>
                              ) : (
                                <code
                                  className="block bg-gray-100 p-3 rounded-lg text-xs font-mono overflow-x-auto text-gray-800"
                                  {...props}
                                >
                                  {children}
                                </code>
                              ),
                            blockquote: ({ ...props }) => (
                              <blockquote
                                className="border-l-4 border-[#009688] pl-4 py-2 my-4 bg-gray-50 rounded-r text-gray-700"
                                {...props}
                              />
                            ),
                          }}
                        >
                          {displayedText}
                        </ReactMarkdown>
                      </div>
                      <div className="flex items-center gap-2 mt-3">
                        <div className="flex items-center gap-1">
                          <div className="w-2 h-2 bg-gray-400 rounded-full animate-pulse"></div>
                          <div
                            className="w-2 h-2 bg-gray-400 rounded-full animate-pulse"
                            style={{ animationDelay: "0.2s" }}
                          ></div>
                          <div
                            className="w-2 h-2 bg-gray-400 rounded-full animate-pulse"
                            style={{ animationDelay: "0.4s" }}
                          ></div>
                        </div>
                        <span className="text-xs text-gray-500">
                          AI is typing...
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {loading && !isInterrupted && !displayedText && (
                <div className="flex w-full justify-start mb-6">
                  <div className="max-w-[70%] sm:max-w-2xl rounded-xl shadow-sm border bg-white text-gray-900 border-gray-200">
                    <div className="p-4 sm:p-6">
                      <div className="flex items-center gap-3">
                        <div className="flex items-center gap-1">
                          <div className="w-2 h-2 bg-gray-400 rounded-full animate-pulse"></div>
                          <div
                            className="w-2 h-2 bg-gray-400 rounded-full animate-pulse"
                            style={{ animationDelay: "0.2s" }}
                          ></div>
                          <div
                            className="w-2 h-2 bg-gray-400 rounded-full animate-pulse"
                            style={{ animationDelay: "0.4s" }}
                          ></div>
                        </div>
                        <span className="text-gray-600">AI is thinking...</span>
                      </div>
                    </div>
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>
          )}
        </div>

        {/* Message Input */}
        <div className="p-4 border-t border-gray-100">
          <PlaceholdersAndVanishInput
            placeholders={placeholders}
            onChange={handleInputChange}
            onSubmit={handleInputSubmit}
          />
        </div>
      </div>
    </div>
  );
};

export default MainContent;
