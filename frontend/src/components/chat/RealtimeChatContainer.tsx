/* eslint-disable @next/next/no-img-element */
// Real-time chat container with Firebase integration

"use client";

import { AnimatePresence, motion } from "framer-motion";
import {
    Archive,
    Check,
    Edit3,
    MessageCircle,
    MoreHorizontal,
    Pin,
    Plus,
    Search,
    Trash2,
} from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";
import { useRealtimeChat } from "../../hooks/useRealtimeChat";
import { useAuth } from "../../lib/contexts/AuthContext";
import { chatService } from "../../lib/services/chatService";
import { cn } from "../../lib/utils";
import { Badge } from "../ui/badge";
import { Button } from "../ui/buttons/button";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import { ChatInput } from "./ChatInput";
import { ChatMessage } from "./ChatMessage";
import { TypingIndicator } from "./TypingIndicator";

export interface RealtimeChatContainerProps {
  className?: string;
  sessionId?: string;
}

export function RealtimeChatContainer({
  className,
  sessionId: initialSessionId,
}: RealtimeChatContainerProps) {
  const { user, chatUser, initializeChatUser } = useAuth();
  const [showSessionList, setShowSessionList] = useState(false);
  const [editingSessionId, setEditingSessionId] = useState<string | null>(null);
  const [editingTitle, setEditingTitle] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const observerRef = useRef<IntersectionObserver | null>(null);
  const visibleMessagesRef = useRef<Set<string>>(new Set());

  const {
    sessions,
    currentSession,
    messages,
    createSession,
    updateSession,
    deleteSession,
    switchSession,
    sendMessage,
    loadMoreMessages,
    isLoading,
    isSending,
    isTyping,
    error,
    hasMoreMessages,
    clearError,
    retryLastMessage,
  } = useRealtimeChat({
    sessionId: initialSessionId,
    autoLoadMessages: true,
    messageLimit: 50,
  });

  // Initialize chat user if not already done
  useEffect(() => {
    if (user && !chatUser) {
      initializeChatUser();
    }
  }, [user, chatUser, initializeChatUser]);

  // Setup intersection observer for read receipts
  const setupIntersectionObserver = useCallback(() => {
    if (observerRef.current) {
      observerRef.current.disconnect();
    }

    observerRef.current = new IntersectionObserver(
      (entries) => {
        const newVisibleMessages = new Set(visibleMessagesRef.current);
        let hasChanges = false;

        entries.forEach((entry) => {
          const messageId = entry.target.getAttribute("data-message-id");
          if (!messageId) return;

          if (entry.isIntersecting) {
            if (!newVisibleMessages.has(messageId)) {
              newVisibleMessages.add(messageId);
              hasChanges = true;
            }
          } else {
            if (newVisibleMessages.has(messageId)) {
              newVisibleMessages.delete(messageId);
              hasChanges = true;
            }
          }
        });

        if (hasChanges) {
          visibleMessagesRef.current = newVisibleMessages;

          // Mark AI messages as read when they become visible
          const aiMessagesToMarkRead = messages
            .filter(
              (msg) =>
                msg.sender === "ai" &&
                msg.status !== "read" &&
                newVisibleMessages.has(msg.id),
            )
            .map((msg) => msg.id);

          if (aiMessagesToMarkRead.length > 0 && user && currentSession) {
            chatService
              .markMessagesAsRead(
                user.uid,
                currentSession.id,
                aiMessagesToMarkRead,
              )
              .catch(console.error);
          }
        }
      },
      {
        threshold: 0.5,
        rootMargin: "0px 0px -50px 0px",
      },
    );
  }, [messages, user, currentSession]);

  // Setup observer when messages change
  useEffect(() => {
    setupIntersectionObserver();

    return () => {
      if (observerRef.current) {
        observerRef.current.disconnect();
      }
    };
  }, [setupIntersectionObserver]);

  // Observe message elements
  useEffect(() => {
    if (!observerRef.current) return;

    const messageElements = document.querySelectorAll("[data-message-id]");
    messageElements.forEach((element) => {
      observerRef.current?.observe(element);
    });

    return () => {
      if (observerRef.current) {
        messageElements.forEach((element) => {
          observerRef.current?.unobserve(element);
        });
      }
    };
  }, [messages]);

  // Handle new session creation
  const handleNewSession = async () => {
    try {
      await createSession({
        title: "New Chat",
        category: "general",
      });
      setShowSessionList(false);
    } catch (error) {
      console.error("Failed to create new session:", error);
    }
  };

  // Handle session actions
  const handlePinSession = async (sessionId: string, isPinned: boolean) => {
    try {
      await updateSession(sessionId, { isPinned: !isPinned });
    } catch (error) {
      console.error("Failed to update session:", error);
    }
  };

  const handleArchiveSession = async (sessionId: string) => {
    try {
      await updateSession(sessionId, { isArchived: true });
    } catch (error) {
      console.error("Failed to archive session:", error);
    }
  };

  const handleDeleteSession = async (sessionId: string) => {
    if (
      !confirm(
        "Are you sure you want to delete this chat? This action cannot be undone.",
      )
    ) {
      return;
    }

    try {
      await deleteSession(sessionId);
    } catch (error) {
      console.error("Failed to delete session:", error);
    }
  };

  // Handle session title editing
  const handleEditTitle = (sessionId: string, currentTitle: string) => {
    setEditingSessionId(sessionId);
    setEditingTitle(currentTitle);
  };

  const handleSaveTitle = async (sessionId: string) => {
    if (!editingTitle.trim()) return;

    try {
      await updateSession(sessionId, { title: editingTitle.trim() });
      setEditingSessionId(null);
      setEditingTitle("");
    } catch (error) {
      console.error("Failed to update session title:", error);
    }
  };

  const handleCancelEdit = () => {
    setEditingSessionId(null);
    setEditingTitle("");
  };

  // Filter sessions based on search query
  const filteredSessions = sessions.filter(
    (session) =>
      session.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      session.lastMessage.content
        .toLowerCase()
        .includes(searchQuery.toLowerCase()),
  );

  // Handle message sending
  const handleSendMessage = async (content: string) => {
    if (!currentSession) {
      // Create new session if none exists
      await handleNewSession();
    }

    try {
      await sendMessage(content);
    } catch (error) {
      console.error("Failed to send message:", error);
    }
  };

  // Loading state
  if (!user) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-center">
          <MessageCircle className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-600">Please sign in to start chatting</p>
        </div>
      </div>
    );
  }

  if (isLoading && !currentSession) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-center">
          <div className="animate-spin w-8 h-8 border-2 border-primary border-t-transparent rounded-full mx-auto mb-4" />
          <p className="text-gray-600">Loading your chats...</p>
        </div>
      </div>
    );
  }

  return (
    <div className={cn("flex flex-col h-full bg-white", className)}>
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-gray-200">
        <div className="flex items-center gap-3">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setShowSessionList(!showSessionList)}
            className="lg:hidden"
          >
            <MessageCircle className="w-4 h-4" />
          </Button>

          {currentSession ? (
            <div className="flex items-center gap-2">
              <h2 className="font-semibold text-gray-900 truncate max-w-xs">
                {currentSession.title}
              </h2>
              {currentSession.isPinned && (
                <Pin className="w-4 h-4 text-primary" />
              )}
              <Badge variant="secondary" className="text-xs">
                {currentSession.category}
              </Badge>
            </div>
          ) : (
            <h2 className="font-semibold text-gray-900">OwlAI Chat</h2>
          )}
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={handleNewSession}
            disabled={isLoading}
          >
            <Plus className="w-4 h-4" />
          </Button>

          {currentSession && (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="sm">
                  <MoreHorizontal className="w-4 h-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem
                  onClick={() =>
                    handlePinSession(currentSession.id, currentSession.isPinned)
                  }
                >
                  <Pin className="w-4 h-4 mr-2" />
                  {currentSession.isPinned ? "Unpin" : "Pin"} Chat
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() => handleArchiveSession(currentSession.id)}
                >
                  <Archive className="w-4 h-4 mr-2" />
                  Archive Chat
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  onClick={() => handleDeleteSession(currentSession.id)}
                  className="text-destructive"
                >
                  Delete Chat
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          )}
        </div>
      </div>

      {/* Error Display */}
      {error && (
        <div className="p-4 bg-red-50 border-b border-red-200">
          <div className="flex items-center justify-between">
            <p className="text-sm text-red-700">{error.message}</p>
            <div className="flex gap-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={retryLastMessage}
                className="text-red-700 hover:text-red-800"
              >
                Retry
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={clearError}
                className="text-red-700 hover:text-red-800"
              >
                Dismiss
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Session List (Mobile) */}
      <AnimatePresence>
        {showSessionList && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="border-b border-gray-200 bg-gray-50 lg:hidden"
          >
            <div className="p-4 max-h-96 overflow-y-auto">
              <div className="flex items-center justify-between mb-3">
                <h3 className="font-medium text-gray-900">Recent Chats</h3>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleNewSession}
                  className="h-8 w-8 p-0"
                >
                  <Plus className="w-4 h-4" />
                </Button>
              </div>

              {/* Search Bar */}
              <div className="relative mb-3">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search chats..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                />
              </div>

              <div className="space-y-2">
                {filteredSessions.map((session) => (
                  <div
                    key={session.id}
                    className={cn(
                      "p-3 rounded-lg border transition-colors",
                      currentSession?.id === session.id
                        ? "bg-primary/10 border-primary/20"
                        : "bg-white border-gray-200 hover:bg-gray-50",
                    )}
                  >
                    <div className="flex items-start justify-between">
                      <div
                        className="flex-1 min-w-0 cursor-pointer"
                        onClick={() => {
                          switchSession(session.id);
                          setShowSessionList(false);
                        }}
                      >
                        {editingSessionId === session.id ? (
                          <div className="flex items-center gap-2 mb-2">
                            <input
                              type="text"
                              value={editingTitle}
                              onChange={(e) => setEditingTitle(e.target.value)}
                              onKeyDown={(e) => {
                                if (e.key === "Enter") {
                                  handleSaveTitle(session.id);
                                } else if (e.key === "Escape") {
                                  handleCancelEdit();
                                }
                              }}
                              className="flex-1 text-sm font-medium border border-gray-300 rounded px-2 py-1 focus:outline-none focus:ring-1 focus:ring-primary"
                              autoFocus
                            />
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleSaveTitle(session.id)}
                              className="h-6 w-6 p-0"
                            >
                              <Check className="w-3 h-3" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={handleCancelEdit}
                              className="h-6 w-6 p-0"
                            >
                              ×
                            </Button>
                          </div>
                        ) : (
                          <p className="font-medium text-sm text-gray-900 truncate mb-1">
                            {session.title}
                          </p>
                        )}
                        <p className="text-xs text-gray-500 truncate">
                          {session.lastMessage.content}
                        </p>
                      </div>

                      <div className="flex items-center gap-1 ml-2">
                        {session.isPinned && (
                          <Pin className="w-3 h-3 text-primary" />
                        )}
                        <Badge variant="secondary" className="text-xs">
                          {session.messageCount}
                        </Badge>

                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button
                              variant="ghost"
                              size="sm"
                              className="h-6 w-6 p-0"
                            >
                              <MoreHorizontal className="w-3 h-3" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end" className="w-40">
                            <DropdownMenuItem
                              onClick={() =>
                                handleEditTitle(session.id, session.title)
                              }
                            >
                              <Edit3 className="w-3 h-3 mr-2" />
                              Rename
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              onClick={() =>
                                handlePinSession(session.id, session.isPinned)
                              }
                            >
                              <Pin className="w-3 h-3 mr-2" />
                              {session.isPinned ? "Unpin" : "Pin"}
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              onClick={() => handleArchiveSession(session.id)}
                            >
                              <Archive className="w-3 h-3 mr-2" />
                              Archive
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem
                              onClick={() => handleDeleteSession(session.id)}
                              className="text-destructive"
                            >
                              <Trash2 className="w-3 h-3 mr-2" />
                              Delete
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                    </div>
                  </div>
                ))}

                {filteredSessions.length === 0 && searchQuery && (
                  <div className="text-center py-4 text-gray-500 text-sm">
                    No chats found matching &ldquo;{searchQuery}&rdquo;
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto px-4 py-6 min-h-0">
        {!currentSession ? (
          /* Welcome Screen */
          <div className="flex flex-col items-center justify-center h-full max-w-2xl mx-auto text-center">
            <div className="w-16 h-16 flex items-center justify-center mx-auto mb-6">
              <img
                src="/apple-touch-icon.png"
                alt="OwlAI Logo"
                className="w-full h-full object-contain"
              />
            </div>
            <h1 className="text-2xl font-bold text-gray-900 mb-3">
              Welcome to OwlAI
            </h1>
            <p className="text-gray-600 mb-6">
              Your personalized AI learning assistant for competitive exams
            </p>
            <Button onClick={handleNewSession} disabled={isLoading}>
              <Plus className="w-4 h-4 mr-2" />
              Start New Chat
            </Button>
          </div>
        ) : (
          /* Messages */
          <div className="space-y-6">
            {/* Load More Button */}
            {hasMoreMessages && (
              <div className="text-center">
                <Button
                  variant="ghost"
                  onClick={loadMoreMessages}
                  disabled={isLoading}
                >
                  {isLoading ? "Loading..." : "Load More Messages"}
                </Button>
              </div>
            )}

            {/* Message List */}
            <AnimatePresence>
              {messages.map((message) => (
                <motion.div
                  key={message.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.3 }}
                >
                  <ChatMessage
                    id={message.id}
                    content={message.content}
                    sender={message.sender}
                    timestamp={message.createdAt}
                    status={message.status}
                    onCopy={(content) => {
                      navigator.clipboard.writeText(content);
                    }}
                    onRegenerate={(messageId) => {
                      // TODO: Implement message regeneration
                      console.log("Regenerate message:", messageId);
                    }}
                    onFeedback={(messageId, type) => {
                      // TODO: Implement feedback
                      console.log("Feedback:", messageId, type);
                    }}
                  />
                </motion.div>
              ))}
            </AnimatePresence>

            {/* Typing Indicator */}
            {isTyping && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
              >
                <TypingIndicator />
              </motion.div>
            )}
          </div>
        )}
      </div>

      {/* Chat Input */}
      <div className="border-t border-gray-200 p-4">
        <ChatInput
          onSendMessage={handleSendMessage}
          disabled={isSending || isLoading}
          placeholder={
            currentSession
              ? "Ask me anything about your studies..."
              : "Start a new conversation..."
          }
        />
      </div>
    </div>
  );
}

export default RealtimeChatContainer;
