/**
 * Real-time Chat Hook
 * Comprehensive hook for real-time chat functionality with conversations and messages
 */

import { useState, useEffect, useCallback, useRef } from "react";
import { conversationService } from "../services/conversation.service";
import { messageService } from "../services/message.service";
import { logger } from "../../../shared/utils/logger";
import type {
  ConversationDocument,
  MessageDocument,
  PaginationParams,
  RealtimeListener,
} from "../types/database.types";

interface UseRealtimeChatReturn {
  // State
  conversations: ConversationDocument[];
  currentConversation: ConversationDocument | null;
  messages: MessageDocument[];
  isLoading: boolean;
  isSending: boolean;

  // Actions
  createConversation: (
    title?: string,
    type?: string
  ) => Promise<ConversationDocument>;
  selectConversation: (conversationId: string) => void;
  sendMessage: (
    content: string,
    role?: "user" | "assistant"
  ) => Promise<MessageDocument>;
  updateConversation: (updates: Partial<ConversationDocument>) => Promise<void>;
  archiveConversation: (conversationId: string) => Promise<void>;
  deleteConversation: (conversationId: string) => Promise<void>;

  // Message actions
  updateMessage: (
    messageId: string,
    updates: Partial<MessageDocument>
  ) => Promise<void>;
  deleteMessage: (messageId: string) => Promise<void>;
  addReaction: (messageId: string, reaction: string) => Promise<void>;
  removeReaction: (messageId: string) => Promise<void>;

  // Pagination
  loadMoreMessages: () => Promise<void>;
  hasMoreMessages: boolean;

  // Real-time listeners
  startListening: () => void;
  stopListening: () => void;

  // Error handling
  error: string | null;
  clearError: () => void;
}

export const useRealtimeChat = (userId: string): UseRealtimeChatReturn => {
  const [conversations, setConversations] = useState<ConversationDocument[]>(
    []
  );
  const [currentConversation, setCurrentConversation] =
    useState<ConversationDocument | null>(null);
  const [messages, setMessages] = useState<MessageDocument[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSending, setIsSending] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [hasMoreMessages, setHasMoreMessages] = useState(true);
  const [lastMessageDoc, setLastMessageDoc] = useState<any>(null);

  // Refs for listeners
  const conversationsListener = useRef<RealtimeListener | null>(null);
  const messagesListener = useRef<RealtimeListener | null>(null);
  const newMessagesListener = useRef<RealtimeListener | null>(null);

  // Initialize conversations listener
  useEffect(() => {
    if (!userId) return;

    const startConversationsListener = () => {
      try {
        conversationsListener.current =
          conversationService.listenToUserConversations(
            userId,
            conversations => {
              setConversations(conversations);
              setIsLoading(false);
            },
            error => {
              logger.error(
                "Conversations listener error",
                "useRealtimeChat",
                error
              );
              setError("Failed to load conversations");
              setIsLoading(false);
            }
          );
      } catch (error) {
        logger.error(
          "Failed to start conversations listener",
          "useRealtimeChat",
          error
        );
        setError("Failed to start conversations listener");
      }
    };

    startConversationsListener();

    return () => {
      if (conversationsListener.current) {
        conversationsListener.current.unsubscribe();
      }
    };
  }, [userId]);

  // Start listening to conversations
  const startListening = useCallback(() => {
    if (!userId) return;

    try {
      // Conversations are already being listened to in useEffect
      logger.info("Real-time chat listening started", "useRealtimeChat", {
        userId,
      });
    } catch (error) {
      logger.error("Failed to start listening", "useRealtimeChat", error);
      setError("Failed to start real-time listening");
    }
  }, [userId]);

  // Stop listening
  const stopListening = useCallback(() => {
    try {
      if (conversationsListener.current) {
        conversationsListener.current.unsubscribe();
        conversationsListener.current = null;
      }
      if (messagesListener.current) {
        messagesListener.current.unsubscribe();
        messagesListener.current = null;
      }
      if (newMessagesListener.current) {
        newMessagesListener.current.unsubscribe();
        newMessagesListener.current = null;
      }

      logger.info("Real-time chat listening stopped", "useRealtimeChat");
    } catch (error) {
      logger.error("Failed to stop listening", "useRealtimeChat", error);
    }
  }, []);

  // Create new conversation
  const createConversation = useCallback(
    async (
      title: string = "New Conversation",
      type: string = "chat"
    ): Promise<ConversationDocument> => {
      try {
        setError(null);
        setIsLoading(true);

        const conversation = await conversationService.createConversation(
          userId,
          {
            title,
            type: type as any,
          }
        );

        // Select the new conversation
        setCurrentConversation(conversation);
        selectConversation(conversation.id);

        logger.info("Conversation created", "useRealtimeChat", {
          conversationId: conversation.id,
        });
        return conversation;
      } catch (error) {
        const errorMessage =
          error instanceof Error
            ? error.message
            : "Failed to create conversation";
        setError(errorMessage);
        logger.error("Failed to create conversation", "useRealtimeChat", error);
        throw error;
      } finally {
        setIsLoading(false);
      }
    },
    [userId]
  );

  // Select conversation
  const selectConversation = useCallback(
    async (conversationId: string) => {
      try {
        setError(null);
        setIsLoading(true);

        // Find conversation in local state
        const conversation = conversations.find(c => c.id === conversationId);
        if (!conversation) {
          throw new Error("Conversation not found");
        }

        setCurrentConversation(conversation);

        // Stop existing messages listener
        if (messagesListener.current) {
          messagesListener.current.unsubscribe();
        }

        // Start listening to messages for this conversation
        messagesListener.current = messageService.listenToConversationMessages(
          conversationId,
          messages => {
            setMessages(messages);
            setIsLoading(false);
          },
          error => {
            logger.error("Messages listener error", "useRealtimeChat", error);
            setError("Failed to load messages");
            setIsLoading(false);
          }
        );

        // Reset pagination
        setHasMoreMessages(true);
        setLastMessageDoc(null);

        logger.info("Conversation selected", "useRealtimeChat", {
          conversationId,
        });
      } catch (error) {
        const errorMessage =
          error instanceof Error
            ? error.message
            : "Failed to select conversation";
        setError(errorMessage);
        logger.error("Failed to select conversation", "useRealtimeChat", error);
      }
    },
    [conversations]
  );

  // Send message
  const sendMessage = useCallback(
    async (
      content: string,
      role: "user" | "assistant" = "user"
    ): Promise<MessageDocument> => {
      if (!currentConversation) {
        throw new Error("No conversation selected");
      }

      try {
        setError(null);
        setIsSending(true);

        const message = await messageService.sendMessage(
          currentConversation.id,
          userId,
          {
            content,
            role,
            type: "text",
          }
        );

        logger.info("Message sent", "useRealtimeChat", {
          messageId: message.id,
          conversationId: currentConversation.id,
        });

        return message;
      } catch (error) {
        const errorMessage =
          error instanceof Error ? error.message : "Failed to send message";
        setError(errorMessage);
        logger.error("Failed to send message", "useRealtimeChat", error);
        throw error;
      } finally {
        setIsSending(false);
      }
    },
    [currentConversation, userId]
  );

  // Update conversation
  const updateConversation = useCallback(
    async (updates: Partial<ConversationDocument>): Promise<void> => {
      if (!currentConversation) {
        throw new Error("No conversation selected");
      }

      try {
        setError(null);
        await conversationService.updateConversation(
          currentConversation.id,
          updates
        );

        // Update local state
        setCurrentConversation(prev => (prev ? { ...prev, ...updates } : null));
        setConversations(prev =>
          prev.map(c =>
            c.id === currentConversation.id ? { ...c, ...updates } : c
          )
        );

        logger.info("Conversation updated", "useRealtimeChat", {
          conversationId: currentConversation.id,
        });
      } catch (error) {
        const errorMessage =
          error instanceof Error
            ? error.message
            : "Failed to update conversation";
        setError(errorMessage);
        logger.error("Failed to update conversation", "useRealtimeChat", error);
        throw error;
      }
    },
    [currentConversation]
  );

  // Archive conversation
  const archiveConversation = useCallback(
    async (conversationId: string): Promise<void> => {
      try {
        setError(null);
        await conversationService.archiveConversation(conversationId);

        // Clear current conversation if it's the one being archived
        if (currentConversation?.id === conversationId) {
          setCurrentConversation(null);
          setMessages([]);
        }

        logger.info("Conversation archived", "useRealtimeChat", {
          conversationId,
        });
      } catch (error) {
        const errorMessage =
          error instanceof Error
            ? error.message
            : "Failed to archive conversation";
        setError(errorMessage);
        logger.error(
          "Failed to archive conversation",
          "useRealtimeChat",
          error
        );
        throw error;
      }
    },
    [currentConversation]
  );

  // Delete conversation
  const deleteConversation = useCallback(
    async (conversationId: string): Promise<void> => {
      try {
        setError(null);
        await conversationService.deleteConversation(conversationId);

        // Clear current conversation if it's the one being deleted
        if (currentConversation?.id === conversationId) {
          setCurrentConversation(null);
          setMessages([]);
        }

        logger.info("Conversation deleted", "useRealtimeChat", {
          conversationId,
        });
      } catch (error) {
        const errorMessage =
          error instanceof Error
            ? error.message
            : "Failed to delete conversation";
        setError(errorMessage);
        logger.error("Failed to delete conversation", "useRealtimeChat", error);
        throw error;
      }
    },
    [currentConversation]
  );

  // Update message
  const updateMessage = useCallback(
    async (
      messageId: string,
      updates: Partial<MessageDocument>
    ): Promise<void> => {
      try {
        setError(null);
        await messageService.updateMessage(messageId, updates);

        // Update local state
        setMessages(prev =>
          prev.map(m => (m.id === messageId ? { ...m, ...updates } : m))
        );

        logger.info("Message updated", "useRealtimeChat", { messageId });
      } catch (error) {
        const errorMessage =
          error instanceof Error ? error.message : "Failed to update message";
        setError(errorMessage);
        logger.error("Failed to update message", "useRealtimeChat", error);
        throw error;
      }
    },
    []
  );

  // Delete message
  const deleteMessage = useCallback(
    async (messageId: string): Promise<void> => {
      try {
        setError(null);
        await messageService.deleteMessage(messageId);

        // Update local state
        setMessages(prev => prev.filter(m => m.id !== messageId));

        logger.info("Message deleted", "useRealtimeChat", { messageId });
      } catch (error) {
        const errorMessage =
          error instanceof Error ? error.message : "Failed to delete message";
        setError(errorMessage);
        logger.error("Failed to delete message", "useRealtimeChat", error);
        throw error;
      }
    },
    []
  );

  // Add reaction
  const addReaction = useCallback(
    async (messageId: string, reaction: string): Promise<void> => {
      try {
        setError(null);
        await messageService.addReaction(messageId, userId, reaction as any);

        // Update local state
        setMessages(prev =>
          prev.map(m => {
            if (m.id === messageId) {
              return {
                ...m,
                reactions: { ...m.reactions, [userId]: reaction as any },
              };
            }
            return m;
          })
        );

        logger.info("Reaction added", "useRealtimeChat", {
          messageId,
          reaction,
        });
      } catch (error) {
        const errorMessage =
          error instanceof Error ? error.message : "Failed to add reaction";
        setError(errorMessage);
        logger.error("Failed to add reaction", "useRealtimeChat", error);
        throw error;
      }
    },
    [userId]
  );

  // Remove reaction
  const removeReaction = useCallback(
    async (messageId: string): Promise<void> => {
      try {
        setError(null);
        await messageService.removeReaction(messageId, userId);

        // Update local state
        setMessages(prev =>
          prev.map(m => {
            if (m.id === messageId) {
              const newReactions = { ...m.reactions };
              delete newReactions[userId];
              return { ...m, reactions: newReactions };
            }
            return m;
          })
        );

        logger.info("Reaction removed", "useRealtimeChat", { messageId });
      } catch (error) {
        const errorMessage =
          error instanceof Error ? error.message : "Failed to remove reaction";
        setError(errorMessage);
        logger.error("Failed to remove reaction", "useRealtimeChat", error);
        throw error;
      }
    },
    [userId]
  );

  // Load more messages
  const loadMoreMessages = useCallback(async (): Promise<void> => {
    if (!currentConversation || !hasMoreMessages) return;

    try {
      setError(null);
      setIsLoading(true);

      const params: PaginationParams = {
        limit: 20,
        startAfter: lastMessageDoc,
      };

      const response = await messageService.getConversationMessages(
        currentConversation.id,
        params
      );

      setMessages(prev => [...response.data, ...prev]);
      setHasMoreMessages(response.hasMore);
      setLastMessageDoc(response.lastDoc);

      logger.info("More messages loaded", "useRealtimeChat", {
        count: response.data.length,
        hasMore: response.hasMore,
      });
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "Failed to load more messages";
      setError(errorMessage);
      logger.error("Failed to load more messages", "useRealtimeChat", error);
    } finally {
      setIsLoading(false);
    }
  }, [currentConversation, hasMoreMessages, lastMessageDoc]);

  // Clear error
  const clearError = useCallback(() => {
    setError(null);
  }, []);

  return {
    // State
    conversations,
    currentConversation,
    messages,
    isLoading,
    isSending,

    // Actions
    createConversation,
    selectConversation,
    sendMessage,
    updateConversation,
    archiveConversation,
    deleteConversation,

    // Message actions
    updateMessage,
    deleteMessage,
    addReaction,
    removeReaction,

    // Pagination
    loadMoreMessages,
    hasMoreMessages,

    // Real-time listeners
    startListening,
    stopListening,

    // Error handling
    error,
    clearError,
  };
};
