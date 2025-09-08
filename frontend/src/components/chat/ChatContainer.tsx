'use client';

import { useAuth } from '@/components/auth/providers/AuthProvider';
import { useChatManager } from '@/hooks/useChatManager';
import { useSimpleChat } from '@/hooks/useSimpleChat';
import { flowiseAPI } from '@/lib/services/flowise-api';
import { cn } from '@/lib/utils';
import NextImage from 'next/image';
import { useRouter } from 'next/navigation';
// Removed embedded ChatHistory; we rely on the app's main sidebar
import { useEffect, useState } from 'react';
import { StarterPrompts } from './StarterPrompts';
import { ChatInput } from './input/ChatInput';
import { ChatMessages } from './messages/ChatMessages';

export interface Message {
  id: string | number;
  type: 'user' | 'bot';
  content: string;
  timestamp: Date;
  error?: boolean;
}

interface ChatContainerProps {
  className?: string;
}

export function ChatContainer({ className }: ChatContainerProps) {
  const { user } = useAuth();
  const { currentConversation, startNewChat } = useChatManager();
  const {
    messages,
    isLoading,
    sendMessage,
    retryLastMessage,
    updateMessage,
    addFeedback,
    hasMore,
    loadMore,
    deleteMessage,
    restoreMessage,
    cooldownMs,
  } = useSimpleChat(currentConversation);
  const router = useRouter();
  // Removed embedded ChatHistory; we rely on the app's main sidebar

  // Guest mode state (local, non-persistent)
  const [guestMessages, setGuestMessages] = useState<Message[]>([]);
  const [guestLoading, setGuestLoading] = useState(false);
  // Queue for first message until conversation exists (fixes disappearing prompts)
  const [pendingMessage, setPendingMessage] = useState<string | null>(null);

  const handleGuestSend = async (message: string) => {
    // Enforce 3-prompt limit for guests
    try {
      const raw =
        typeof window !== 'undefined'
          ? localStorage.getItem('guest_prompt_count')
          : '0';
      const count = raw ? parseInt(raw, 10) || 0 : 0;
      if (count >= 3) {
        router.push('/signup');
        return;
      }

      const safeContent = message.trim();
      if (!safeContent || guestLoading) return;

      // Increment counter
      if (typeof window !== 'undefined') {
        localStorage.setItem('guest_prompt_count', String(count + 1));
      }

      // Add user message locally
      const userMsg: Message = {
        id: Date.now().toString(),
        type: 'user',
        content: safeContent,
        timestamp: new Date(),
      };
      setGuestMessages(prev => [...prev, userMsg]);

      setGuestLoading(true);

      const tempId = (Date.now() + 1).toString();
      let accumulated = '';
      let started = false;

      await flowiseAPI.queryStream(
        { question: safeContent, history: [] },
        {
          onToken: chunk => {
            accumulated += chunk;
            if (!started) {
              started = true;
              setGuestMessages(prev => [
                ...prev,
                {
                  id: tempId,
                  type: 'bot',
                  content: chunk,
                  timestamp: new Date(),
                },
              ]);
            } else {
              setGuestMessages(prev =>
                prev.map(m =>
                  m.id === tempId ? { ...m, content: accumulated } : m
                )
              );
            }
          },
          onDone: () => {
            setGuestLoading(false);
          },
          onError: () => {
            setGuestMessages(prev => [
              ...prev.filter(m => m.id !== tempId),
              {
                id: (Date.now() + 2).toString(),
                type: 'bot',
                content: 'Sorry, I encountered an error. Please try again.',
                timestamp: new Date(),
                error: true,
              },
            ]);
            setGuestLoading(false);
          },
        }
      );
    } catch {
      // Fail-safe redirect to signup if storage or stream fails repeatedly
      router.push('/signup');
    }
  };

  const handleSendMessage = async (message: string) => {
    // If not authenticated, use guest mode
    if (!user?.id) {
      await handleGuestSend(message);
      return;
    }
    if (!currentConversation) {
      setPendingMessage(message);
      await startNewChat();
      return;
    }
    await sendMessage(message);
  };

  const isGuest = !user?.id;
  const displayMessages = isGuest ? guestMessages : messages;
  const displayLoading = isGuest ? guestLoading : isLoading;

  // When a conversation becomes available and we have a queued message, send it
  useEffect(() => {
    const sendPending = async () => {
      if (user?.id && currentConversation && pendingMessage) {
        const toSend = pendingMessage;
        setPendingMessage(null);
        await sendMessage(toSend);
      }
    };
    void sendPending();
  }, [user?.id, currentConversation, pendingMessage, sendMessage]);

  // Removed handleNewChat and handleSelectConversation

  return (
    <div className={cn('h-full bg-white flex flex-col min-h-0', className)}>
      {displayMessages.length === 0 ? (
        /* ChatGPT-style welcome screen - Scrollable */
        <div className='flex-1 overflow-y-auto'>
          <div className='flex flex-col items-center justify-center min-h-full px-4 py-8'>
            {/* Welcome Message */}
            <div className='text-center mb-8 max-w-2xl'>
              <div className='mx-auto mb-6 flex items-center justify-center'>
                <NextImage
                  src='/owl-ai-logo.png'
                  alt='OwlAI Logo'
                  width={64}
                  height={64}
                  className='object-contain'
                />
              </div>
              <h1 className='text-3xl font-bold text-gray-900 mb-4'>
                Welcome to OwlAI
              </h1>
              <p className='text-lg text-gray-600 mb-2'>
                Your intelligent study companion for UGC NET and competitive
                exams
              </p>
              <p className='text-base text-gray-500 mb-8'>
                Get personalized guidance, solve practice questions, and master
                your subjects with AI-powered learning
              </p>
            </div>

            {/* Starter Prompts */}
            <div className='w-full mb-8'>
              <StarterPrompts onPromptClick={handleSendMessage} />
            </div>

            {/* Input as part of scrollable content */}
            <div className='w-full max-w-3xl mb-8'>
              <ChatInput
                onSendMessage={handleSendMessage}
                isLoading={displayLoading}
                placeholder='Message OwlAI...'
                className='w-full'
              />
            </div>

            {/* Extra space to ensure scrolling */}
            <div className='h-20'></div>
          </div>
        </div>
      ) : (
        /* ChatGPT-style chat layout */
        <>
          {/* Messages Area - Scrollable */}
          <div className='flex-1 overflow-y-auto min-h-0'>
            <ChatMessages
              messages={displayMessages}
              isLoading={displayLoading}
              onRetry={retryLastMessage}
              onEdit={updateMessage}
              onFeedback={addFeedback}
              onLoadMore={loadMore}
              hasMore={hasMore}
              onDelete={deleteMessage}
              onRestore={restoreMessage}
            />
          </div>

          {/* Fixed Input Area - Always at bottom */}
          <div className='flex-shrink-0 pb-6 pt-4 bg-white border-t border-gray-100 safe-bottom'>
            <ChatInput
              onSendMessage={handleSendMessage}
              isLoading={displayLoading}
              placeholder='Message OwlAI...'
              cooldownMs={cooldownMs}
            />
          </div>
        </>
      )}
    </div>
  );
}
