'use client';

import { useChatManager } from '@/hooks/useChatManager';
import { useSimpleChat } from '@/hooks/useSimpleChat';
import { cn } from '@/lib/utils';
import NextImage from 'next/image';
import { ChatHistory } from './ChatHistory';
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
  const { currentConversation, startNewChat, switchToConversation } =
    useChatManager();
  const { messages, isLoading, sendMessage, retryLastMessage } =
    useSimpleChat(currentConversation);

  const handleSendMessage = async (message: string) => {
    await sendMessage(message);
  };

  const handleNewChat = async () => {
    await startNewChat();
  };

  const handleSelectConversation = (conversation: any) => {
    switchToConversation(conversation);
  };

  return (
    <div className={cn('h-full bg-white flex min-h-0', className)}>
      {/* Chat History Sidebar */}
      <div className='w-80 border-r border-gray-200 flex-shrink-0'>
        <ChatHistory
          onSelectConversation={handleSelectConversation}
          onNewChat={handleNewChat}
          currentConversationId={currentConversation?.id}
        />
      </div>

      {/* Main Chat Area */}
      <div className='flex-1 flex flex-col min-h-0'>
        {messages.length === 0 ? (
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
                  Get personalized guidance, solve practice questions, and
                  master your subjects with AI-powered learning
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
                  isLoading={isLoading}
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
                messages={messages}
                isLoading={isLoading}
                onRetry={retryLastMessage}
              />
            </div>

            {/* Fixed Input Area - Always at bottom */}
            <div className='flex-shrink-0 pb-6 pt-4 bg-white border-t border-gray-100'>
              <ChatInput
                onSendMessage={handleSendMessage}
                isLoading={isLoading}
                placeholder='Message OwlAI...'
              />
            </div>
          </>
        )}
      </div>
    </div>
  );
}
