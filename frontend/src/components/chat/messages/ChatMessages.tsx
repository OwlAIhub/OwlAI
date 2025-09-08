'use client';

import { cn } from '@/lib/utils';
import { AnimatePresence, motion } from 'framer-motion';
import { Bot, Copy, RotateCcw, ThumbsDown, ThumbsUp, User } from 'lucide-react';
import { useState } from 'react';
import { Button } from '../../ui/buttons/button';
import { ChatGPTRenderer } from '../ChatGPTRenderer';

interface Message {
  id: string | number;
  type: 'user' | 'bot';
  content: string;
  timestamp: Date;
  error?: boolean;
}

interface ChatMessagesProps {
  messages: Message[];
  isLoading?: boolean;
  className?: string;
  onRetry?: () => void;
}

export function ChatMessages({
  messages,
  isLoading = false,
  className,
  onRetry,
}: ChatMessagesProps) {
  if (messages.length === 0 && !isLoading) {
    return null; // Welcome message is now handled in ChatContainer
  }

  return (
    <div
      className={cn(
        'flex-1 overflow-y-auto px-4 py-6 scrollbar-hide min-h-0',
        className
      )}
    >
      <div className='max-w-4xl mx-auto space-y-6'>
        <AnimatePresence>
          {messages.map((message, index) => (
            <MessageBubble
              key={message.id}
              message={message}
              index={index}
              onRetry={onRetry}
            />
          ))}
        </AnimatePresence>

        {/* Beautiful Loading Indicator */}
        {isLoading && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className='flex gap-3 justify-start'
          >
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: 'spring', stiffness: 200 }}
              className='flex-shrink-0 w-8 h-8 bg-gradient-to-br from-teal-500 to-teal-600 rounded-full flex items-center justify-center shadow-sm'
            >
              <Bot className='w-4 h-4 text-white' />
            </motion.div>
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.1, duration: 0.3 }}
              className='bg-white border border-gray-200 rounded-2xl px-4 py-3 shadow-md'
            >
              <div className='flex items-center gap-3'>
                <div className='flex gap-1'>
                  <motion.div
                    className='w-2 h-2 bg-teal-600 rounded-full'
                    animate={{
                      scale: [1, 1.2, 1],
                      opacity: [0.5, 1, 0.5],
                    }}
                    transition={{
                      duration: 1.5,
                      repeat: Infinity,
                      delay: 0,
                    }}
                  />
                  <motion.div
                    className='w-2 h-2 bg-teal-600 rounded-full'
                    animate={{
                      scale: [1, 1.2, 1],
                      opacity: [0.5, 1, 0.5],
                    }}
                    transition={{
                      duration: 1.5,
                      repeat: Infinity,
                      delay: 0.2,
                    }}
                  />
                  <motion.div
                    className='w-2 h-2 bg-teal-600 rounded-full'
                    animate={{
                      scale: [1, 1.2, 1],
                      opacity: [0.5, 1, 0.5],
                    }}
                    transition={{
                      duration: 1.5,
                      repeat: Infinity,
                      delay: 0.4,
                    }}
                  />
                </div>
                <motion.span
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.3 }}
                  className='text-xs text-gray-500 font-medium'
                >
                  OwlAI is thinking...
                </motion.span>
              </div>
            </motion.div>
          </motion.div>
        )}
      </div>
    </div>
  );
}

// Beautiful Message Bubble Component
function MessageBubble({
  message,
  index,
  onRetry,
}: {
  message: Message;
  index: number;
  onRetry?: () => void;
}) {
  const [showActions, setShowActions] = useState(false);
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    await navigator.clipboard.writeText(message.content);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{
        duration: 0.4,
        delay: index * 0.05,
        ease: [0.4, 0, 0.2, 1],
      }}
      className={cn(
        'flex gap-3 group',
        message.type === 'user' ? 'justify-end' : 'justify-start'
      )}
      onMouseEnter={() => setShowActions(true)}
      onMouseLeave={() => setShowActions(false)}
    >
      {/* Bot Avatar */}
      {message.type === 'bot' && (
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{
            delay: index * 0.05 + 0.2,
            type: 'spring',
            stiffness: 200,
          }}
          className='flex-shrink-0 w-8 h-8 bg-gradient-to-br from-teal-500 to-teal-600 rounded-full flex items-center justify-center shadow-sm'
        >
          <Bot className='w-4 h-4 text-white' />
        </motion.div>
      )}

      {/* Message Content */}
      <motion.div
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ delay: index * 0.05 + 0.1, duration: 0.3 }}
        className={cn(
          'max-w-[80%] relative group/message',
          message.type === 'user'
            ? 'bg-teal-600 text-white rounded-2xl px-4 py-3'
            : message.error
              ? 'bg-red-50 border border-red-200 text-red-800 rounded-2xl px-4 py-3'
              : 'text-gray-900' // No background, no borders - minimal like ChatGPT
        )}
      >
        {/* Message Text */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: index * 0.05 + 0.3, duration: 0.5 }}
          className={message.type === 'bot' ? 'pr-12' : ''}
        >
          {message.type === 'bot' ? (
            <ChatGPTRenderer content={message.content} />
          ) : (
            <p className='text-sm leading-relaxed whitespace-pre-wrap'>
              {message.content}
            </p>
          )}
        </motion.div>

        {/* Error Actions */}
        {message.error && onRetry && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.05 + 0.4 }}
            className='mt-3 flex justify-end'
          >
            <Button
              onClick={onRetry}
              size='sm'
              variant='outline'
              className='h-7 px-3 text-xs border-red-200 text-red-600 hover:bg-red-50 transition-colors duration-200'
            >
              <RotateCcw className='w-3 h-3 mr-1' />
              Retry
            </Button>
          </motion.div>
        )}

        {/* Message Actions (for bot messages) - Minimal like ChatGPT */}
        {message.type === 'bot' && !message.error && (
          <motion.div
            initial={{ opacity: 0, y: 5 }}
            animate={{ opacity: showActions ? 1 : 0, y: showActions ? 0 : 5 }}
            transition={{ duration: 0.2 }}
            className={cn(
              'absolute top-3 right-3 flex gap-1',
              showActions ? 'pointer-events-auto' : 'pointer-events-none'
            )}
          >
            <button
              onClick={handleCopy}
              className='h-6 w-6 p-0 hover:bg-gray-100 rounded transition-colors'
            >
              {copied ? (
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className='w-3 h-3 text-green-600'
                >
                  ✓
                </motion.div>
              ) : (
                <Copy className='w-3 h-3 text-gray-500' />
              )}
            </button>
            <button className='h-6 w-6 p-0 hover:bg-gray-100 rounded transition-colors'>
              <ThumbsUp className='w-3 h-3 text-gray-500' />
            </button>
            <button className='h-6 w-6 p-0 hover:bg-gray-100 rounded transition-colors'>
              <ThumbsDown className='w-3 h-3 text-gray-500' />
            </button>
          </motion.div>
        )}

        {/* Timestamp */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: index * 0.05 + 0.5 }}
          className={cn(
            'text-xs mt-2 opacity-70',
            message.type === 'user' ? 'text-teal-100' : 'text-gray-500'
          )}
        >
          {message.timestamp.toLocaleTimeString([], {
            hour: '2-digit',
            minute: '2-digit',
          })}
        </motion.p>
      </motion.div>

      {/* User Avatar */}
      {message.type === 'user' && (
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{
            delay: index * 0.05 + 0.2,
            type: 'spring',
            stiffness: 200,
          }}
          className='flex-shrink-0 w-8 h-8 bg-gradient-to-br from-gray-400 to-gray-500 rounded-full flex items-center justify-center shadow-sm'
        >
          <User className='w-4 h-4 text-white' />
        </motion.div>
      )}
    </motion.div>
  );
}
