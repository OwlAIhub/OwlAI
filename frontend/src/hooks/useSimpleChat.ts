/**
 * Simple Chat Hook with Database Integration
 */

import { useAuth } from '@/components/auth/providers/AuthProvider';
import { messageService } from '@/lib/services/database';
import { flowiseAPI } from '@/lib/services/flowise-api';
import type {
  Conversation,
  ChatMessage as DbMessage,
} from '@/lib/types/database';
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
  clearMessages: () => void;
  retryLastMessage: () => Promise<void>;
}

export function useSimpleChat(
  conversation: Conversation | null
): UseSimpleChatReturn {
  const { user } = useAuth();
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const lastUserMessageRef = useRef<string>('');

  const loadMessages = useCallback(async () => {
    if (!conversation?.id) return;

    try {
      const result = await messageService.getConversationMessages(
        conversation.id,
        { limit: 100 }
      );
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
    } catch (error) {
      console.error('Failed to load messages:', error);
    }
  }, [conversation?.id]);

  // Load messages when conversation changes
  useEffect(() => {
    if (conversation?.id && user?.id) {
      loadMessages();
    } else {
      setMessages([]);
    }
  }, [conversation?.id, user?.id, loadMessages]);

  const sendMessage = useCallback(
    async (message: string) => {
      if (!message.trim() || isLoading || !user?.id || !conversation?.id)
        return;

      setError(null);
      setIsLoading(true);

      // Add user message immediately
      const userMessage: ChatMessage = {
        id: Date.now().toString(),
        type: 'user',
        content: message.trim(),
        timestamp: new Date(),
      };

      setMessages(prev => [...prev, userMessage]);
      lastUserMessageRef.current = message.trim();

      try {
        // Save user message to database
        await messageService.createMessage(
          conversation.id,
          user.id,
          'user',
          message.trim()
        );

        // Prepare history for Flowise
        const history = messages
          .filter(msg => !msg.error)
          .slice(-10)
          .map(msg => ({
            type:
              msg.type === 'user'
                ? ('userMessage' as const)
                : ('apiMessage' as const),
            message: msg.content,
          }));

        // Call Flowise API
        const response = await flowiseAPI.queryWithRetry({
          question: message.trim(),
          history,
        });

        // Add bot response
        const botMessage: ChatMessage = {
          id: (Date.now() + 1).toString(),
          type: 'bot',
          content: response.text,
          timestamp: new Date(),
        };

        setMessages(prev => [...prev, botMessage]);

        // Save bot message to database
        await messageService.createMessage(
          conversation.id,
          user.id,
          'bot',
          response.text
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
        setIsLoading(false);
      }
    },
    [isLoading, user?.id, conversation?.id, messages]
  );

  const clearMessages = useCallback(() => {
    setMessages([]);
    setError(null);
    lastUserMessageRef.current = '';
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
    clearMessages,
    retryLastMessage,
  };
}
