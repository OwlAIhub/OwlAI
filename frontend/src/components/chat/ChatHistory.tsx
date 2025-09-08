'use client';
// cspell:words unsubscribe toMillis

import { useAuth } from '@/components/auth/providers/AuthProvider';
import { Button } from '@/components/ui/buttons/button';
import { conversationService } from '@/lib/services/database';
import type { Conversation } from '@/lib/types/database';
import { cn } from '@/lib/utils';
import {
  Archive,
  Edit2,
  MessageSquare,
  Plus,
  Search,
  Trash,
} from 'lucide-react';
import { useEffect, useState } from 'react';

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
  const [query, setQuery] = useState('');
  const [renamingId, setRenamingId] = useState<string | null>(null);
  const [renameValue, setRenameValue] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [showArchived, setShowArchived] = useState(false);

  useEffect(() => {
    if (!user?.id) return;

    const unsubscribe = conversationService.subscribe<Conversation>(
      'conversations',
      [],
      data => {
        const mine = data
          .filter(
            c =>
              c.userId === user.id &&
              (showArchived ? c.isArchived : !c.isArchived)
          )
          .sort(
            (a, b) => b.lastMessageAt.toMillis() - a.lastMessageAt.toMillis()
          );
        setConversations(mine);
        setIsLoading(false);
      }
    );

    return () => unsubscribe();
  }, [user?.id, refreshKey, showArchived]);

  const handleArchiveConversation = async (conversationId: string) => {
    try {
      await conversationService.archiveConversation(conversationId);
      setConversations(prev => prev.filter(c => c.id !== conversationId));
    } catch (error) {
      console.error('Failed to archive conversation:', error);
    }
  };

  const handleRename = async (conversationId: string) => {
    try {
      await conversationService.renameConversation(conversationId, renameValue);
      setRenamingId(null);
      setRenameValue('');
    } catch (error) {
      console.error('Failed to rename conversation:', error);
    }
  };

  const handleDelete = async (conversationId: string) => {
    try {
      await conversationService.deleteConversation(conversationId);
      setConversations(prev => prev.filter(c => c.id !== conversationId));
    } catch (error) {
      console.error('Failed to delete conversation:', error);
    }
  };

  const handleRestoreConversation = async (conversationId: string) => {
    try {
      await conversationService.updateConversation(conversationId, {
        isArchived: false,
      });
      setConversations(prev => prev.filter(c => c.id !== conversationId));
    } catch (error) {
      console.error('Failed to restore conversation:', error);
    }
  };

  const filtered = query
    ? conversations.filter(c =>
        c.title.toLowerCase().includes(query.toLowerCase())
      )
    : conversations;

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
      <div className='p-4 border-b border-gray-200 space-y-2'>
        <Button
          onClick={onNewChat}
          className='w-full bg-teal-600 hover:bg-teal-700 text-white'
        >
          <Plus className='w-4 h-4 mr-2' />
          New Chat
        </Button>

        {/* Search */}
        <div className='relative'>
          <Search className='absolute left-2 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400' />
          <input
            type='text'
            value={query}
            onChange={e => setQuery(e.target.value)}
            placeholder='Search conversations'
            className='w-full pl-8 pr-3 py-1.5 text-sm rounded-md border border-gray-200 focus:ring-2 focus:ring-teal-600 focus:outline-none'
          />
        </div>

        {/* Filter: All / Archived */}
        <div className='flex items-center gap-2'>
          <Button
            variant={showArchived ? 'outline' : 'secondary'}
            size='sm'
            onClick={() => setShowArchived(false)}
            className='text-xs'
          >
            All
          </Button>
          <Button
            variant={showArchived ? 'secondary' : 'outline'}
            size='sm'
            onClick={() => setShowArchived(true)}
            className='text-xs'
          >
            Archived
          </Button>
        </div>
      </div>

      {/* Conversations List */}
      <div className='flex-1 overflow-y-auto p-2'>
        {filtered.length === 0 ? (
          <div className='text-center py-8 text-gray-500'>
            <MessageSquare className='w-12 h-12 mx-auto mb-3 text-gray-300' />
            <p>No conversations yet</p>
            <p className='text-sm'>Start a new chat to begin!</p>
          </div>
        ) : (
          <div className='space-y-2'>
            {filtered.map(conversation => {
              const hasUnread = conversation.lastOpenedAt
                ? conversation.lastMessageAt.toMillis() >
                  conversation.lastOpenedAt.toMillis()
                : conversation.messageCount > 0;
              const isActive = currentConversationId === conversation.id;
              return (
                <div
                  key={conversation.id}
                  className={cn(
                    'group flex items-center justify-between p-3 rounded-lg cursor-pointer transition-colors border',
                    isActive
                      ? 'bg-teal-50 border-teal-200'
                      : 'hover:bg-gray-50 border-transparent'
                  )}
                  onClick={() => {
                    onSelectConversation(conversation);
                    conversationService.markOpened(conversation.id);
                  }}
                >
                  <div className='flex-1 min-w-0 pr-2'>
                    {renamingId === conversation.id ? (
                      <input
                        autoFocus
                        value={renameValue}
                        onChange={e => setRenameValue(e.target.value)}
                        onBlur={() => handleRename(conversation.id)}
                        onKeyDown={e => {
                          if (e.key === 'Enter') handleRename(conversation.id);
                          if (e.key === 'Escape') setRenamingId(null);
                        }}
                        className='w-full text-sm rounded-md border border-gray-200 px-2 py-1 focus:ring-2 focus:ring-teal-600 focus:outline-none'
                      />
                    ) : (
                      <>
                        <h3 className='font-medium text-sm truncate flex items-center gap-2'>
                          {conversation.title}
                          {hasUnread && (
                            <span
                              className='inline-flex items-center justify-center min-w-5 h-5 px-1 rounded-full bg-teal-600 text-white text-[10px]'
                              aria-label='unread-count'
                            >
                              {conversation.messageCount > 99
                                ? '99+'
                                : conversation.messageCount}
                            </span>
                          )}
                        </h3>
                        <p className='text-xs text-gray-500'>
                          {conversation.messageCount} messages ·{' '}
                          {conversation.lastMessageAt
                            .toDate()
                            .toLocaleDateString()}
                        </p>
                      </>
                    )}
                  </div>

                  <div className='flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity'>
                    <Button
                      variant='ghost'
                      size='sm'
                      onClick={e => {
                        e.stopPropagation();
                        setRenamingId(conversation.id);
                        setRenameValue(conversation.title);
                      }}
                    >
                      <Edit2 className='w-4 h-4' />
                    </Button>
                    {showArchived ? (
                      <Button
                        variant='ghost'
                        size='sm'
                        onClick={e => {
                          e.stopPropagation();
                          handleRestoreConversation(conversation.id);
                        }}
                      >
                        Restore
                      </Button>
                    ) : (
                      <Button
                        variant='ghost'
                        size='sm'
                        onClick={e => {
                          e.stopPropagation();
                          handleArchiveConversation(conversation.id);
                        }}
                      >
                        <Archive className='w-4 h-4' />
                      </Button>
                    )}
                    <Button
                      variant='ghost'
                      size='sm'
                      onClick={e => {
                        e.stopPropagation();
                        handleDelete(conversation.id);
                      }}
                    >
                      <Trash className='w-4 h-4 text-red-600' />
                    </Button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
