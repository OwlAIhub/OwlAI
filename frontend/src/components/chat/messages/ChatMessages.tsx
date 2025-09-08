/* eslint-disable @typescript-eslint/no-unused-expressions */
'use client';
// cspell:words KaTeX katex overscan

import { cn } from '@/lib/utils';
import { useVirtualizer } from '@tanstack/react-virtual';
import { AnimatePresence, motion } from 'framer-motion';
import { Bot, Copy, RotateCcw, ThumbsDown, ThumbsUp, User } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import ReactMarkdown from 'react-markdown';
import rehypeHighlight from 'rehype-highlight';
import rehypeKatex from 'rehype-katex';
import rehypeSanitize from 'rehype-sanitize';
import remarkGfm from 'remark-gfm';
import { Button } from '../../ui/buttons/button';

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
  onEdit?: (messageId: string, content: string) => Promise<void>;
  onFeedback?: (messageId: string, rating: 1 | 2 | 3 | 4 | 5) => Promise<void>;
  onLoadMore?: () => Promise<void>;
  hasMore?: boolean;
  onDelete?: (messageId: string) => Promise<void>;
  onRestore?: (messageId: string) => Promise<void>;
}

export function ChatMessages({
  messages,
  isLoading = false,
  className,
  onRetry,
  onLoadMore,
  hasMore = false,
  onEdit,
  onFeedback,
  onDelete,
  onRestore,
}: ChatMessagesProps) {
  const parentRef = useRef<HTMLDivElement>(null);
  const [autoScroll, setAutoScroll] = useState(true);

  const rowVirtualizer = useVirtualizer({
    count: messages.length,
    getScrollElement: () => parentRef.current,
    estimateSize: () => 96,
    overscan: 8,
  });

  // Auto-scroll when near bottom and new tokens/messages arrive
  useEffect(() => {
    if (!autoScroll) return;
    const el = parentRef.current;
    if (!el) return;
    const atBottom =
      Math.abs(el.scrollHeight - el.scrollTop - el.clientHeight) < 64;
    if (atBottom) {
      el.scrollTo({ top: el.scrollHeight, behavior: 'smooth' });
    }
  }, [messages, isLoading, autoScroll]);

  return (
    <div
      className={cn(
        'flex-1 overflow-y-auto px-4 py-6 scrollbar-hide min-h-0',
        className
      )}
      ref={parentRef}
      onScroll={() => {
        const el = parentRef.current;
        if (!el) return;
        const atBottom =
          Math.abs(el.scrollHeight - el.scrollTop - el.clientHeight) < 64;
        setAutoScroll(atBottom);
      }}
    >
      <div className='max-w-4xl mx-auto relative min-h-full'>
        <div
          style={{
            height: rowVirtualizer.getTotalSize(),
            position: 'relative',
          }}
        >
          <div
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              width: '100%',
              transform: `translateY(${rowVirtualizer.getVirtualItems()[0]?.start ?? 0}px)`,
            }}
            className='space-y-6'
          >
            {/* Load more button (pagination) */}
            {hasMore && (
              <div className='flex justify-center'>
                <Button
                  variant='outline'
                  size='sm'
                  onClick={onLoadMore}
                  className='text-xs'
                >
                  Load earlier messages
                </Button>
              </div>
            )}
            <AnimatePresence>
              {rowVirtualizer.getVirtualItems().map(v => {
                const message = messages[v.index];
                return (
                  <div key={message.id} style={{ height: v.size }}>
                    <MessageBubble
                      message={message}
                      index={v.index}
                      onRetry={onRetry}
                      onEdit={onEdit}
                      onFeedback={onFeedback}
                      onDelete={onDelete}
                      onRestore={onRestore}
                    />
                  </div>
                );
              })}
            </AnimatePresence>
          </div>
        </div>

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
  onEdit,
  onFeedback,
  onDelete,
  onRestore,
}: {
  message: Message;
  index: number;
  onRetry?: () => void;
  onEdit?: (messageId: string, content: string) => Promise<void>;
  onFeedback?: (messageId: string, rating: 1 | 2 | 3 | 4 | 5) => Promise<void>;
  onDelete?: (messageId: string) => Promise<void>;
  onRestore?: (messageId: string) => Promise<void>;
}) {
  const [showActions, setShowActions] = useState(false);
  const [copied, setCopied] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editValue, setEditValue] = useState(message.content);
  const [undoVisible, setUndoVisible] = useState(false);
  const undoTimerRef = useRef<number | null>(null);

  const handleCopy = async () => {
    await navigator.clipboard.writeText(message.content);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -8 }}
      transition={{ duration: 0.2, ease: [0.4, 0, 0.2, 1] }}
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
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.2 }}
        className={cn(
          'max-w-[80%] relative group/message',
          message.type === 'user'
            ? 'bg-teal-600 text-white rounded-2xl px-4 py-3'
            : message.error
              ? 'bg-red-50 border border-red-200 text-red-800 rounded-2xl px-4 py-3'
              : 'bg-white border border-gray-200 text-gray-900 rounded-2xl px-4 py-3 shadow-sm'
        )}
      >
        {/* Message Text (supports edit) */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: index * 0.05 + 0.3, duration: 0.5 }}
          className={message.type === 'bot' ? 'pr-12' : ''}
        >
          {isEditing ? (
            <div className='space-y-2'>
              <textarea
                value={editValue}
                onChange={e => setEditValue(e.target.value)}
                className='w-full text-sm rounded-md border border-gray-200 px-2 py-2 focus:ring-2 focus:ring-teal-600 focus:outline-none'
                rows={3}
              />
              <div className='flex gap-2'>
                <Button
                  size='sm'
                  onClick={async () => {
                    if (onEdit) await onEdit(String(message.id), editValue);
                    setIsEditing(false);
                  }}
                >
                  Save
                </Button>
                <Button
                  variant='outline'
                  size='sm'
                  onClick={() => {
                    setIsEditing(false);
                    setEditValue(message.content);
                  }}
                >
                  Cancel
                </Button>
              </div>
            </div>
          ) : (
            <div className='text-sm leading-relaxed markdown-content'>
              {message.type === 'bot' ? (
                <ReactMarkdown
                  remarkPlugins={[remarkGfm]}
                  rehypePlugins={[rehypeSanitize, rehypeHighlight, rehypeKatex]}
                >
                  {message.content}
                </ReactMarkdown>
              ) : (
                <p className='whitespace-pre-wrap'>{message.content}</p>
              )}
            </div>
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

        {/* Message Actions - Minimal like ChatGPT */}
        {!message.error && (
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
            {message.type === 'user' && (
              <button
                onClick={() => setIsEditing(true)}
                className='h-6 w-6 p-0 hover:bg-gray-100 rounded transition-colors'
              >
                ✎
              </button>
            )}
            <button className='h-6 w-6 p-0 hover:bg-gray-100 rounded transition-colors'>
              <ThumbsUp
                className='w-3 h-3 text-gray-500'
                onClick={() => onFeedback && onFeedback(String(message.id), 5)}
              />
            </button>
            <button className='h-6 w-6 p-0 hover:bg-gray-100 rounded transition-colors'>
              <ThumbsDown
                className='w-3 h-3 text-gray-500'
                onClick={() => onFeedback && onFeedback(String(message.id), 1)}
              />
            </button>
            {/* Delete with Undo */}
            <button
              className='h-6 w-6 p-0 hover:bg-gray-100 rounded transition-colors text-red-600'
              onClick={async () => {
                if (!onDelete) return;
                await onDelete(String(message.id));
                // reveal inline undo for 5s using local state
                setShowActions(false);
                setIsEditing(false);
                undoTimerRef.current && clearTimeout(undoTimerRef.current);
                setUndoVisible(true);
                undoTimerRef.current = window.setTimeout(() => {
                  setUndoVisible(false);
                  undoTimerRef.current = null;
                }, 5000);
              }}
              aria-label='Delete message'
              title='Delete'
            >
              ×
            </button>
          </motion.div>
        )}

        {/* Timestamp */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.2 }}
          className={cn(
            'text-xs mt-2 opacity-70',
            message.type === 'user' ? 'text-teal-100' : 'text-gray-500'
          )}
        >
          {message.timestamp.toLocaleTimeString([], {
            hour: '2-digit',
            minute: '2-digit',
          })}
          {/* Inline Undo */}
          {undoVisible && (
            <span className='ml-2 text-gray-600'>
              Deleted •
              <button
                className='ml-1 underline text-teal-700'
                onClick={async () => {
                  if (undoTimerRef.current) {
                    clearTimeout(undoTimerRef.current);
                    undoTimerRef.current = null;
                  }
                  setUndoVisible(false);
                  if (onRestore) await onRestore(String(message.id));
                }}
              >
                Undo
              </button>
            </span>
          )}
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
