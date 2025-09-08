'use client';

import { useAuth } from '@/components/auth/providers/AuthProvider';
import { Button } from '@/components/ui/buttons/button';
import { conversationService } from '@/lib/services/database';
import type { Conversation } from '@/lib/types/database';
import { cn } from '@/lib/utils';
import { Archive, MessageSquare, Plus } from 'lucide-react';
import { useCallback, useEffect, useState } from 'react';

interface ChatHistoryProps {
  onSelectConversation: (conversation: Conversation) => void;
  onNewChat: () => void;
  currentConversationId?: string;
  className?: string;
  refreshKey?: number;
}

export function ChatHistory({
  onSelectConversation,
  onNewChat,
  currentConversationId,
  className,
  refreshKey,
}: ChatHistoryProps) {
  const { user } = useAuth();
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const loadConversations = useCallback(async () => {
    if (!user?.id) return;

    try {
      setIsLoading(true);
      const result = await conversationService.getUserConversations(user.id, {
        limit: 20,
      });
      setConversations(result.data);
    } catch (error) {
      console.error('Failed to load conversations:', error);
    } finally {
      setIsLoading(false);
    }
  }, [user?.id, refreshKey]);

  useEffect(() => {
    if (user?.id) {
      loadConversations();
    }
  }, [user?.id, loadConversations, refreshKey]);

  const handleArchiveConversation = async (conversationId: string) => {
    try {
      await conversationService.archiveConversation(conversationId);
      setConversations(prev => prev.filter(c => c.id !== conversationId));
    } catch (error) {
      console.error('Failed to archive conversation:', error);
    }
  };

  if (isLoading) {
    return (
      <div className={cn('p-4', className)}>
        <p className='text-sm text-gray-500'>Loading conversations…</p>
      </div>
    );
  }

  return (
    <div className={cn('flex flex-col h-full', className)}>
      {/* Header */}
      <div className='p-4 border-b border-gray-200'>
        <Button
          onClick={onNewChat}
          className='w-full bg-teal-600 hover:bg-teal-700 text-white'
        >
          <Plus className='w-4 h-4 mr-2' />
          New Chat
        </Button>
      </div>

      {/* Conversations List */}
      <div className='flex-1 overflow-y-auto p-2'>
        {conversations.length === 0 ? (
          <div className='text-center py-8 text-gray-500'>
            <MessageSquare className='w-12 h-12 mx-auto mb-3 text-gray-300' />
            <p>No conversations yet</p>
            <p className='text-sm'>Start a new chat to begin!</p>
          </div>
        ) : (
          <div className='space-y-2'>
            {conversations.map(conversation => (
              <div
                key={conversation.id}
                className={cn(
                  'group flex items-center justify-between p-3 rounded-lg cursor-pointer transition-colors',
                  currentConversationId === conversation.id
                    ? 'bg-teal-100 border border-teal-200'
                    : 'hover:bg-gray-100'
                )}
                onClick={() => onSelectConversation(conversation)}
              >
                <div className='flex-1 min-w-0'>
                  <h3 className='font-medium text-sm truncate'>
                    {conversation.title}
                  </h3>
                  <p className='text-xs text-gray-500'>
                    {conversation.messageCount} messages
                  </p>
                  <p className='text-xs text-gray-400'>
                    {conversation.lastMessageAt.toDate().toLocaleDateString()}
                  </p>
                </div>

                <Button
                  variant='ghost'
                  size='sm'
                  className='opacity-0 group-hover:opacity-100 transition-opacity'
                  onClick={e => {
                    e.stopPropagation();
                    handleArchiveConversation(conversation.id);
                  }}
                >
                  <Archive className='w-4 h-4' />
                </Button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
