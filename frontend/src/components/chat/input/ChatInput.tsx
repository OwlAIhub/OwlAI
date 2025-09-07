'use client';

import { Button } from '@/components/ui/buttons/button';
import { cn } from '@/lib/utils';
import { motion } from 'framer-motion';
import { Loader2, Send } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';

interface ChatInputProps {
  onSendMessage: (message: string) => void;
  isLoading?: boolean;
  placeholder?: string;
  disabled?: boolean;
  className?: string;
}

export function ChatInput({
  onSendMessage,
  isLoading = false,
  placeholder = 'Message OwlAI...',
  disabled = false,
  className,
}: ChatInputProps) {
  const [message, setMessage] = useState('');
  const [isFocused, setIsFocused] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Auto-resize textarea
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
    }
  }, [message]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!message.trim() || isLoading || disabled) return;

    onSendMessage(message.trim());
    setMessage('');
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  return (
    <div className={cn('w-full max-w-4xl mx-auto px-4', className)}>
      <motion.form
        onSubmit={handleSubmit}
        className={cn(
          'relative flex items-end gap-3 p-4 bg-white border border-gray-200 rounded-2xl shadow-sm transition-all duration-200',
          'hover:shadow-md focus-within:shadow-lg focus-within:border-teal-300',
          isFocused && 'ring-2 ring-teal-100',
          disabled && 'opacity-50 cursor-not-allowed'
        )}
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.3 }}
      >
        {/* Input Field */}
        <div className='flex-1 min-h-[24px]'>
          <textarea
            ref={textareaRef}
            value={message}
            onChange={e => setMessage(e.target.value)}
            onKeyDown={handleKeyDown}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
            placeholder={placeholder}
            disabled={disabled || isLoading}
            className={cn(
              'w-full resize-none border-0 outline-none bg-transparent text-gray-900 placeholder-gray-500',
              'text-base leading-6 min-h-[24px] max-h-[200px]',
              'focus:ring-0 focus:outline-none'
            )}
            rows={1}
            style={{
              height: 'auto',
              overflow: 'hidden',
            }}
          />
        </div>

        {/* Send Button */}
        <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
          <Button
            type='submit'
            disabled={!message.trim() || isLoading || disabled}
            size='icon'
            className={cn(
              'h-8 w-8 rounded-lg transition-all duration-200',
              'bg-teal-600 hover:bg-teal-700 text-white',
              'disabled:bg-gray-300 disabled:text-gray-500 disabled:cursor-not-allowed',
              'shadow-sm hover:shadow-md'
            )}
          >
            {isLoading ? (
              <Loader2 className='h-4 w-4 animate-spin' />
            ) : (
              <Send className='h-4 w-4' />
            )}
          </Button>
        </motion.div>
      </motion.form>

      {/* Helper Text */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: isFocused ? 1 : 0 }}
        transition={{ duration: 0.2 }}
        className='mt-2 text-center'
      >
        <p className='text-xs text-gray-500'>
          Press Enter to send, Shift + Enter for new line
        </p>
      </motion.div>
    </div>
  );
}
