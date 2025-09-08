/**
 * Enhanced Chat Hook with Database Integration
 * Connects Flowise responses to Firestore storage
 */

import { useAuth } from '@/components/auth/providers/AuthProvider';
import {
  analyticsService,
  conversationService,
  messageService,
  studySessionService,
  userService,
} from '@/lib/services/database';
import { FlowiseAPIError, flowiseAPI } from '@/lib/services/flowise-api';
import type { ChatMessage, Conversation } from '@/lib/types/database';
import { Timestamp } from 'firebase/firestore';
import { useCallback, useEffect, useRef, useState } from 'react';

export interface EnhancedChatMessage extends ChatMessage {
  id: string;
  type: 'user' | 'bot';
  content: string;
  timestamp: Date;
  error?: boolean;
  aiMetadata?: {
    model: string;
    tokens: number;
    responseTime: number;
    confidence?: number;
    sources?: string[];
  };
}

export interface UseEnhancedChatReturn {
  // Current conversation
  currentConversation: Conversation | null;

  // Messages
  messages: EnhancedChatMessage[];
  isLoading: boolean;
  error: string | null;

  // Actions
  sendMessage: (message: string) => Promise<void>;
  startNewConversation: (title?: string, subject?: string) => Promise<void>;
  loadConversation: (conversationId: string) => Promise<void>;
  clearMessages: () => void;
  retryLastMessage: () => Promise<void>;

  // Study session
  currentSession: string | null;
  startStudySession: (
    type: 'chat' | 'practice' | 'review' | 'test'
  ) => Promise<void>;
  endStudySession: () => Promise<void>;

  // Analytics
  updateAnalytics: () => Promise<void>;
}

export function useEnhancedChat(): UseEnhancedChatReturn {
  const { user } = useAuth();
  const [currentConversation, setCurrentConversation] =
    useState<Conversation | null>(null);
  const [messages, setMessages] = useState<EnhancedChatMessage[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [currentSession, setCurrentSession] = useState<string | null>(null);

  const lastUserMessageRef = useRef<string>('');
  const sessionStartTimeRef = useRef<Date | null>(null);

  // Load conversation messages
  const loadConversationMessages = useCallback(
    async (conversationId: string) => {
      try {
        const result = await messageService.getConversationMessages(
          conversationId,
          { limit: 100 }
        );
        const formattedMessages: EnhancedChatMessage[] = result.data.map(
          (msg: ChatMessage) => ({
            ...msg,
            timestamp: msg.createdAt.toDate(),
          })
        );
        setMessages(formattedMessages);
      } catch (error) {
        console.error('Failed to load conversation messages:', error);
        setError('Failed to load conversation messages');
      }
    },
    []
  );

  // Start new conversation
  const startNewConversation = useCallback(
    async (title?: string, subject?: string) => {
      if (!user?.id) return;

      try {
        const conversationTitle =
          title || `Chat ${new Date().toLocaleDateString()}`;
        const conversation = await conversationService.createConversation(
          user.id,
          conversationTitle,
          subject
        );

        setCurrentConversation(conversation);
        setMessages([]);
        setError(null);
      } catch (error) {
        console.error('Failed to create conversation:', error);
        setError('Failed to create new conversation');
      }
    },
    [user?.id]
  );

  // Load existing conversation
  const loadConversation = useCallback(
    async (conversationId: string) => {
      try {
        const conversation = await conversationService.getById<Conversation>(
          'conversations',
          conversationId
        );
        if (conversation) {
          setCurrentConversation(conversation);
          await loadConversationMessages(conversationId);
          setError(null);
        }
      } catch (error) {
        console.error('Failed to load conversation:', error);
        setError('Failed to load conversation');
      }
    },
    [loadConversationMessages]
  );

  // Start study session
  const startStudySession = useCallback(
    async (type: 'chat' | 'practice' | 'review' | 'test') => {
      if (!user?.id) return;

      try {
        const session = await studySessionService.createStudySession(
          user.id,
          type,
          currentConversation?.subject
        );
        setCurrentSession(session.id);
        sessionStartTimeRef.current = new Date();
      } catch (error) {
        console.error('Failed to start study session:', error);
      }
    },
    [user?.id, currentConversation?.subject]
  );

  // End study session
  const endStudySession = useCallback(async () => {
    if (!currentSession || !sessionStartTimeRef.current) return;

    try {
      const endTime = new Date();
      const questionsAnswered = messages.filter(m => m.type === 'user').length;
      const correctAnswers = messages.filter(
        m => m.type === 'bot' && !m.error
      ).length;

      await studySessionService.endStudySession(
        currentSession,
        Timestamp.fromMillis(endTime.getTime()),
        {
          questionsAnswered,
          correctAnswers,
          conversationsUsed: currentConversation
            ? [currentConversation.id]
            : [],
        }
      );

      setCurrentSession(null);
      sessionStartTimeRef.current = null;
    } catch (error) {
      console.error('Failed to end study session:', error);
    }
  }, [currentSession, messages, currentConversation]);

  // Send message
  const sendMessage = useCallback(
    async (message: string) => {
      if (!message.trim() || isLoading || !user?.id) return;

      // Clear any previous errors
      setError(null);
      setIsLoading(true);

      // Ensure we have a conversation
      if (!currentConversation) {
        await startNewConversation();
      }

      // Add user message to local state immediately
      const userMessage: EnhancedChatMessage = {
        id: Date.now().toString(),
        type: 'user',
        content: message.trim(),
        timestamp: new Date(),
        conversationId: currentConversation?.id || '',
        userId: user.id,
        isEdited: false,
        isDeleted: false,
        createdAt: Timestamp.fromDate(new Date()),
        updatedAt: Timestamp.fromDate(new Date()),
      };

      setMessages(prev => [...prev, userMessage]);
      lastUserMessageRef.current = message.trim();

      try {
        // Save user message to database
        if (currentConversation) {
          await messageService.createMessage(
            currentConversation.id,
            user.id,
            'user',
            message.trim()
          );
        }

        // Prepare conversation history for Flowise
        const history = messages
          .filter(msg => !msg.error)
          .slice(-10) // Last 10 messages for context
          .map(msg => ({
            type:
              msg.type === 'user'
                ? ('userMessage' as const)
                : ('apiMessage' as const),
            message: msg.content,
          }));

        // Call Flowise API
        const startTime = Date.now();
        const response = await flowiseAPI.queryWithRetry({
          question: message.trim(),
          history,
        });
        const responseTime = Date.now() - startTime;

        // Create bot message
        const botMessage: EnhancedChatMessage = {
          id: (Date.now() + 1).toString(),
          type: 'bot',
          content: response.text,
          timestamp: new Date(),
          conversationId: currentConversation?.id || '',
          userId: user.id,
          aiMetadata: {
            model: 'flowise',
            tokens: response.text.length, // Approximate
            responseTime,
            confidence: 0.9, // Default confidence
          },
          isEdited: false,
          isDeleted: false,
          createdAt: Timestamp.fromDate(new Date()),
          updatedAt: Timestamp.fromDate(new Date()),
        };

        // Add bot message to local state
        setMessages(prev => [...prev, botMessage]);

        // Save bot message to database
        if (currentConversation) {
          await messageService.createMessage(
            currentConversation.id,
            user.id,
            'bot',
            response.text,
            botMessage.aiMetadata
          );
        }

        // Update analytics
        const today = new Date().toISOString().split('T')[0];
        await analyticsService.updateDailyStats(user.id, today, {
          conversationsStarted: 1,
          questionsAnswered: 1,
        });
      } catch (error) {
        console.error('Flowise API Error:', error);

        let errorMessage = 'Sorry, I encountered an error. Please try again.';

        if (error instanceof FlowiseAPIError) {
          if (error.status === 429) {
            errorMessage =
              'Too many requests. Please wait a moment and try again.';
          } else if (error.status && error.status >= 500) {
            errorMessage =
              'Service temporarily unavailable. Please try again later.';
          } else if (error.message.includes('timeout')) {
            errorMessage = 'Request timed out. Please try again.';
          }
        }

        // Add error message
        const errorBotMessage: EnhancedChatMessage = {
          id: (Date.now() + 1).toString(),
          type: 'bot',
          content: errorMessage,
          timestamp: new Date(),
          conversationId: currentConversation?.id || '',
          userId: user.id,
          error: true,
          isEdited: false,
          isDeleted: false,
          createdAt: Timestamp.fromDate(new Date()),
          updatedAt: Timestamp.fromDate(new Date()),
        };

        setMessages(prev => [...prev, errorBotMessage]);
        setError(errorMessage);
      } finally {
        setIsLoading(false);
      }
    },
    [isLoading, user?.id, currentConversation, messages, startNewConversation]
  );

  // Update analytics
  const updateAnalytics = useCallback(async () => {
    if (!user?.id) return;

    try {
      const today = new Date().toISOString().split('T')[0];
      await analyticsService.updateDailyStats(user.id, today, {
        conversationsStarted: 1,
        questionsAnswered: 1,
      });
    } catch (error) {
      console.error('Failed to update analytics:', error);
    }
  }, [user?.id]);

  // Clear messages
  const clearMessages = useCallback(() => {
    setMessages([]);
    setError(null);
    lastUserMessageRef.current = '';
  }, []);

  // Retry last message
  const retryLastMessage = useCallback(async () => {
    if (lastUserMessageRef.current && !isLoading) {
      // Remove the last user message and any error response
      setMessages(prev => {
        const filtered = prev.filter(msg => !msg.error);
        return filtered.slice(0, -1); // Remove last message (user message)
      });

      // Retry the last message
      await sendMessage(lastUserMessageRef.current);
    }
  }, [isLoading, sendMessage]);

  // Auto-start study session when conversation starts
  useEffect(() => {
    if (currentConversation && !currentSession && user?.id) {
      startStudySession('chat');
    }
  }, [currentConversation, currentSession, user?.id, startStudySession]);

  // Update user's last login
  useEffect(() => {
    if (user?.id) {
      userService.updateLastLogin(user.id).catch(console.error);
    }
  }, [user?.id]);

  return {
    currentConversation,
    messages,
    isLoading,
    error,
    sendMessage,
    startNewConversation,
    loadConversation,
    clearMessages,
    retryLastMessage,
    currentSession,
    startStudySession,
    endStudySession,
    updateAnalytics,
  };
}
