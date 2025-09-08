/**
 * Chat Manager Hook - Handles conversation switching and management
 */

import { useAuth } from '@/components/auth/providers/AuthProvider';
import { conversationService } from '@/lib/services/database';
import type { Conversation } from '@/lib/types/database';
import { useCallback, useState } from 'react';

export interface UseChatManagerReturn {
  currentConversation: Conversation | null;
  startNewChat: (title?: string) => Promise<void>;
  switchToConversation: (conversation: Conversation) => void;
  archiveConversation: (conversationId: string) => Promise<void>;
}

export function useChatManager(): UseChatManagerReturn {
  const { user } = useAuth();
  const [currentConversation, setCurrentConversation] =
    useState<Conversation | null>(null);

  const startNewChat = useCallback(
    async (title?: string) => {
      if (!user?.id) return;

      try {
        const conversationTitle =
          title || `Chat ${new Date().toLocaleDateString()}`;
        const conversation = await conversationService.createConversation(
          user.id,
          conversationTitle
        );

        setCurrentConversation(conversation);
      } catch (error) {
        console.error('Failed to create new chat:', error);
        throw error;
      }
    },
    [user?.id]
  );

  const switchToConversation = useCallback((conversation: Conversation) => {
    setCurrentConversation(conversation);
  }, []);

  const archiveConversation = useCallback(
    async (conversationId: string) => {
      try {
        await conversationService.archiveConversation(conversationId);

        // If we're archiving the current conversation, clear it
        if (currentConversation?.id === conversationId) {
          setCurrentConversation(null);
        }
      } catch (error) {
        console.error('Failed to archive conversation:', error);
        throw error;
      }
    },
    [currentConversation?.id]
  );

  return {
    currentConversation,
    startNewChat,
    switchToConversation,
    archiveConversation,
  };
}
