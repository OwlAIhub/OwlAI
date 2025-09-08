/**
 * Simple Chat Hook with Database Integration
 * cspell:words Flowise flowise Firestore firestore
 */

import { useAuth } from '@/components/auth/providers/AuthProvider';
import { DatabaseService } from '@/lib/services/baseDatabase';
import { analyticsService, messageService } from '@/lib/services/database';
import { flowiseAPI } from '@/lib/services/flowise-api';
import {
  basicModerationCheck,
  sanitizeHistory,
  sanitizeInput,
} from '@/lib/services/safety';
import { rateLimiter } from '@/lib/services/userService';
import type {
  Conversation,
  ChatMessage as DbMessage,
} from '@/lib/types/database';
import { orderBy, where } from 'firebase/firestore';
import { useCallback, useEffect, useRef, useState } from 'react';

export interface ChatMessage {
  id: string;
  type: 'user' | 'bot';
  content: string;
  timestamp: Date;
  error?: boolean;
}

export interface UseSimpleChatReturn {
  messages: ChatMessage[];
  isLoading: boolean;
  error: string | null;
  sendMessage: (message: string) => Promise<void>;
  updateMessage: (messageId: string, newContent: string) => Promise<void>;
  addFeedback: (messageId: string, rating: 1 | 2 | 3 | 4 | 5) => Promise<void>;
  deleteMessage: (messageId: string) => Promise<void>;
  restoreMessage: (messageId: string) => Promise<void>;
  hasMore: boolean;
  loadMore: () => Promise<void>;
  clearMessages: () => void;
  retryLastMessage: () => Promise<void>;
  cooldownMs: number;
}

export function useSimpleChat(
  conversation: Conversation | null
): UseSimpleChatReturn {
  const { user } = useAuth();
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [cooldownMs, setCooldownMs] = useState(0);
  const lastUserMessageRef = useRef<string>('');
  const conversationIdRef = useRef<string | null>(null);
  const lastDocRef = useRef<unknown | null>(null);
  const [hasMore, setHasMore] = useState(false);

  useEffect(() => {
    conversationIdRef.current = conversation?.id ?? null;
  }, [conversation?.id]);

  const loadMessages = useCallback(async () => {
    const cid = conversationIdRef.current;
    if (!cid) return;

    try {
      const result = await messageService.getConversationMessages(cid, {
        limit: 50,
      });
      const formattedMessages: ChatMessage[] = result.data.map(
        (msg: DbMessage) => ({
          id: msg.id,
          type: msg.type,
          content: msg.content,
          timestamp: msg.createdAt.toDate(),
          error: false,
        })
      );
      setMessages(formattedMessages);
      lastDocRef.current = result.lastDoc ?? null;
      setHasMore(Boolean(result.hasMore));
    } catch (error) {
      console.error('Failed to load messages:', error);
    }
  }, []);

  // Load messages when conversation changes
  useEffect(() => {
    if (conversation?.id && user?.id) {
      loadMessages();
    } else {
      setMessages([]);
    }
  }, [conversation?.id, user?.id, loadMessages]);

  // Realtime subscription to messages for the active conversation
  useEffect(() => {
    const cid = conversationIdRef.current;
    if (!cid || !user?.id) return;

    const dbService = new DatabaseService();
    const unsubscribe = dbService.subscribe<DbMessage>(
      'messages',
      [
        where('conversationId', '==', cid),
        where('isDeleted', '==', false),
        orderBy('createdAt', 'asc'),
      ],
      data => {
        const incoming: ChatMessage[] = data.map(msg => ({
          id: msg.id,
          type: msg.type,
          content: msg.content,
          timestamp: msg.createdAt.toDate(),
          error: false,
        }));

        // Merge incoming snapshot with existing, preserving older paged messages
        setMessages(prev => {
          const byId = new Map<string | number, ChatMessage>();
          prev.forEach(m => byId.set(m.id, m));
          incoming.forEach(m => byId.set(m.id, m));
          const merged = Array.from(byId.values()).sort(
            (a, b) => a.timestamp.getTime() - b.timestamp.getTime()
          );
          return merged;
        });
      }
    );

    return () => unsubscribe();
  }, [conversation?.id, user?.id]);

  const loadMore = useCallback(async () => {
    const cid = conversationIdRef.current;
    if (!cid || !hasMore || !lastDocRef.current) return;
    try {
      const result = await messageService.getConversationMessages(cid, {
        limit: 50,
        startAfter: lastDocRef.current,
      });
      const older: ChatMessage[] = result.data.map((msg: DbMessage) => ({
        id: msg.id,
        type: msg.type,
        content: msg.content,
        timestamp: msg.createdAt.toDate(),
        error: false,
      }));
      setMessages(prev => [...older, ...prev]);
      lastDocRef.current = result.lastDoc ?? null;
      setHasMore(Boolean(result.hasMore));
    } catch (e) {
      console.error('Failed to load more messages:', e);
    }
  }, [hasMore]);

  const sendMessage = useCallback(
    async (message: string) => {
      const cid = conversationIdRef.current;
      if (!message.trim() || isLoading || !user?.id || !cid) return;

      // Per-user rate limiting
      const limit = rateLimiter.canSendMessage(user.id);
      if (!limit.ok) {
        setError('Rate limit exceeded. Please wait a moment.');
        setCooldownMs(limit.retryAfterMs);
        return;
      } else {
        setCooldownMs(0);
      }

      // Safety & moderation
      const moderated = basicModerationCheck(message);
      if (!moderated.ok) {
        setError(moderated.message || 'Message blocked by safety policy');
        return;
      }
      const safeMessage = sanitizeInput(message);

      setError(null);
      setIsLoading(true);

      // Add user message immediately
      const userMessage: ChatMessage = {
        id: Date.now().toString(),
        type: 'user',
        content: safeMessage.trim(),
        timestamp: new Date(),
      };

      setMessages(prev => [...prev, userMessage]);
      lastUserMessageRef.current = message.trim();

      try {
        // const start = performance.now(); // reserved for latency metrics
        // Save user message to database
        await messageService.createMessage(
          cid,
          user.id,
          'user',
          safeMessage.trim()
        );

        // Prepare history for Flowise
        const history = sanitizeHistory(
          messages
            .filter(msg => !msg.error)
            .slice(-10)
            .map(msg => ({
              type:
                msg.type === 'user'
                  ? ('userMessage' as const)
                  : ('apiMessage' as const),
              message: msg.content,
            }))
        );

        // Streaming response handling
        const tempId = (Date.now() + 1).toString();
        let accumulated = '';
        let started = false;

        await flowiseAPI.queryStream(
          {
            question: safeMessage.trim(),
            history,
          },
          {
            onToken: chunk => {
              accumulated += chunk;
              if (!started) {
                started = true;
                setMessages(prev => [
                  ...prev,
                  {
                    id: tempId,
                    type: 'bot',
                    content: chunk,
                    timestamp: new Date(),
                    error: false,
                  },
                ]);
              } else {
                setMessages(prev =>
                  prev.map(m =>
                    m.id === tempId ? { ...m, content: accumulated } : m
                  )
                );
              }
            },
            onDone: async finalText => {
              // Persist final bot message
              await messageService.createMessage(
                cid,
                user.id,
                'bot',
                finalText
              );
              // const latencyMs = performance.now() - start;
              await analyticsService.updateDailyStats(
                user.id,
                new Date().toISOString().slice(0, 10),
                {
                  questionsAnswered: 1,
                }
              );
              setIsLoading(false);
            },
            onError: () => {
              const errorMessage: ChatMessage = {
                id: (Date.now() + 2).toString(),
                type: 'bot',
                content: 'Sorry, I encountered an error. Please try again.',
                timestamp: new Date(),
                error: true,
              };
              setMessages(prev => [
                ...prev.filter(m => m.id !== tempId),
                errorMessage,
              ]);
              setError('Failed to send message');
              setIsLoading(false);
            },
          }
        );
      } catch (error) {
        console.error('Chat error:', error);

        const errorMessage: ChatMessage = {
          id: (Date.now() + 1).toString(),
          type: 'bot',
          content: 'Sorry, I encountered an error. Please try again.',
          timestamp: new Date(),
          error: true,
        };

        setMessages(prev => [...prev, errorMessage]);
        setError('Failed to send message');
      } finally {
        // setIsLoading is managed in stream callbacks; ensure not stuck
        setTimeout(() => setIsLoading(false), 0);
      }
    },
    [isLoading, user?.id, messages]
  );

  const clearMessages = useCallback(() => {
    setMessages([]);
    setError(null);
    lastUserMessageRef.current = '';
  }, []);

  const updateMessage = useCallback(
    async (messageId: string, newContent: string) => {
      const cid = conversationIdRef.current;
      if (!cid || !user?.id) return;
      try {
        await messageService.updateMessage(messageId, {
          content: newContent,
        });
        setMessages(prev =>
          prev.map(m =>
            m.id === messageId ? { ...m, content: newContent } : m
          )
        );
      } catch (e) {
        console.error('Failed to update message:', e);
      }
    },
    [user?.id]
  );

  const addFeedback = useCallback(
    async (messageId: string, rating: 1 | 2 | 3 | 4 | 5) => {
      try {
        await messageService.addUserFeedback(messageId, { rating });
      } catch (e) {
        console.error('Failed to add feedback:', e);
      }
    },
    []
  );

  const deleteMessage = useCallback(async (messageId: string) => {
    try {
      await messageService.deleteMessage(messageId);
    } catch (e) {
      console.error('Failed to delete message:', e);
    }
  }, []);

  const restoreMessage = useCallback(async (messageId: string) => {
    try {
      await messageService.restoreMessage(messageId);
    } catch (e) {
      console.error('Failed to restore message:', e);
    }
  }, []);

  const retryLastMessage = useCallback(async () => {
    if (lastUserMessageRef.current && !isLoading) {
      setMessages(prev => prev.filter(msg => !msg.error).slice(0, -1));
      await sendMessage(lastUserMessageRef.current);
    }
  }, [isLoading, sendMessage]);

  return {
    messages,
    isLoading,
    error,
    sendMessage,
    updateMessage,
    addFeedback,
    deleteMessage,
    restoreMessage,
    hasMore,
    loadMore,
    clearMessages,
    retryLastMessage,
    cooldownMs,
  };
}
