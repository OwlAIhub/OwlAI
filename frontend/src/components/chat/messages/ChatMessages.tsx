'use client';

import { cn } from '@/lib/utils';
import { AnimatePresence, motion } from 'framer-motion';
import { Bot, User } from 'lucide-react';

interface Message {
  id: string | number;
  type: 'user' | 'bot';
  content: string;
  timestamp: Date;
}

interface ChatMessagesProps {
  messages: Message[];
  isLoading?: boolean;
  className?: string;
}

export function ChatMessages({
  messages,
  isLoading = false,
  className,
}: ChatMessagesProps) {
  if (messages.length === 0 && !isLoading) {
    return null; // Welcome message is now handled in ChatContainer
  }

  return (
    <div className={cn('flex-1 overflow-y-auto px-4 py-6', className)}>
      <div className='max-w-4xl mx-auto space-y-6'>
        <AnimatePresence>
          {messages.map((message, index) => (
            <motion.div
              key={message.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3, delay: index * 0.1 }}
              className={cn(
                'flex gap-3',
                message.type === 'user' ? 'justify-end' : 'justify-start'
              )}
            >
              {/* Avatar */}
              {message.type === 'bot' && (
                <div className='flex-shrink-0 w-8 h-8 bg-gradient-to-br from-teal-500 to-teal-600 rounded-full flex items-center justify-center'>
                  <Bot className='w-4 h-4 text-white' />
                </div>
              )}

              {/* Message Content */}
              <div
                className={cn(
                  'max-w-[80%] rounded-2xl px-4 py-3 shadow-sm',
                  message.type === 'user'
                    ? 'bg-teal-600 text-white'
                    : 'bg-white border border-gray-200 text-gray-900'
                )}
              >
                <p className='text-sm leading-relaxed whitespace-pre-wrap'>
                  {message.content}
                </p>
                <p
                  className={cn(
                    'text-xs mt-2',
                    message.type === 'user' ? 'text-teal-100' : 'text-gray-500'
                  )}
                >
                  {message.timestamp.toLocaleTimeString([], {
                    hour: '2-digit',
                    minute: '2-digit',
                  })}
                </p>
              </div>

              {/* User Avatar */}
              {message.type === 'user' && (
                <div className='flex-shrink-0 w-8 h-8 bg-gray-300 rounded-full flex items-center justify-center'>
                  <User className='w-4 h-4 text-gray-600' />
                </div>
              )}
            </motion.div>
          ))}
        </AnimatePresence>

        {/* Loading Indicator */}
        {isLoading && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className='flex gap-3 justify-start'
          >
            <div className='flex-shrink-0 w-8 h-8 bg-gradient-to-br from-teal-500 to-teal-600 rounded-full flex items-center justify-center'>
              <Bot className='w-4 h-4 text-white' />
            </div>
            <div className='bg-white border border-gray-200 rounded-2xl px-4 py-3 shadow-sm'>
              <div className='flex items-center gap-2'>
                <div className='flex gap-1'>
                  <div
                    className='w-2 h-2 bg-gray-400 rounded-full animate-bounce'
                    style={{ animationDelay: '0ms' }}
                  />
                  <div
                    className='w-2 h-2 bg-gray-400 rounded-full animate-bounce'
                    style={{ animationDelay: '150ms' }}
                  />
                  <div
                    className='w-2 h-2 bg-gray-400 rounded-full animate-bounce'
                    style={{ animationDelay: '300ms' }}
                  />
                </div>
                <span className='text-xs text-gray-500'>
                  OwlAI is typing...
                </span>
              </div>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
}
