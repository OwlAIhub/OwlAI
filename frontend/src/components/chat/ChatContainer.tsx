'use client';

import { cn } from '@/lib/utils';
import { useState } from 'react';
import { ChatInput } from './input/ChatInput';
import { ChatMessages } from './messages/ChatMessages';

export interface Message {
  id: string | number;
  type: 'user' | 'bot';
  content: string;
  timestamp: Date;
}

interface ChatContainerProps {
  className?: string;
  onSendMessage?: (message: string) => Promise<void>;
}

export function ChatContainer({
  className,
  onSendMessage,
}: ChatContainerProps) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const handleSendMessage = async (message: string) => {
    // Add user message immediately
    const userMessage: Message = {
      id: Date.now(),
      type: 'user',
      content: message,
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMessage]);
    setIsLoading(true);

    try {
      // Call custom message handler if provided
      if (onSendMessage) {
        await onSendMessage(message);
      } else {
        // Default demo response
        await new Promise(resolve => setTimeout(resolve, 1000));

        const botMessage: Message = {
          id: Date.now() + 1,
          type: 'bot',
          content:
            "I'm here to help with your studies! This is a demo response. The full AI integration is coming soon.",
          timestamp: new Date(),
        };

        setMessages(prev => [...prev, botMessage]);
      }
    } catch (error) {
      console.error('Error sending message:', error);

      // Add error message
      const errorMessage: Message = {
        id: Date.now() + 1,
        type: 'bot',
        content: 'Sorry, I encountered an error. Please try again.',
        timestamp: new Date(),
      };

      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className={cn('flex flex-col h-full bg-white', className)}>
      {messages.length === 0 ? (
        /* ChatGPT-style centered layout when no messages */
        <div className='flex-1 flex flex-col items-center justify-center px-4'>
          {/* Welcome Message */}
          <div className='text-center mb-8 max-w-2xl'>
            <div className='w-16 h-16 mx-auto mb-6 bg-gradient-to-br from-teal-500 to-teal-600 rounded-2xl flex items-center justify-center'>
              <svg
                className='w-8 h-8 text-white'
                fill='currentColor'
                viewBox='0 0 24 24'
              >
                <path d='M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z' />
              </svg>
            </div>
            <h1 className='text-3xl font-bold text-gray-900 mb-4'>
              Welcome to OwlAI
            </h1>
            <p className='text-lg text-gray-600 mb-8'>
              Your AI study partner is ready to help you excel in your exams.
              Start a conversation below.
            </p>
          </div>

          {/* Centered Input */}
          <div className='w-full max-w-3xl'>
            <ChatInput
              onSendMessage={handleSendMessage}
              isLoading={isLoading}
              placeholder='Message OwlAI...'
              className='w-full'
            />
          </div>
        </div>
      ) : (
        /* Normal chat layout when messages exist */
        <>
          {/* Messages Area */}
          <ChatMessages
            messages={messages}
            isLoading={isLoading}
            className='flex-1'
          />

          {/* Input Area */}
          <div className='flex-shrink-0 pb-6 pt-4 bg-white border-t border-gray-200'>
            <ChatInput
              onSendMessage={handleSendMessage}
              isLoading={isLoading}
              placeholder='Message OwlAI...'
            />
          </div>
        </>
      )}
    </div>
  );
}
