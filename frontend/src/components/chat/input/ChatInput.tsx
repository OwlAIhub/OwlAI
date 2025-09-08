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
  placeholder = 'Ask me anything about your studies...',
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
          'relative flex items-center gap-3 px-5 py-3 bg-white border border-gray-200 rounded-full shadow-lg transition-all duration-300',
          'hover:shadow-xl focus-within:shadow-xl focus-within:border-teal-300 focus-within:ring-2 focus-within:ring-teal-100',
          'backdrop-blur-sm bg-white/95',
          isFocused && 'scale-[1.02] border-teal-300 shadow-xl',
          disabled && 'opacity-50 cursor-not-allowed'
        )}
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.4, ease: [0.4, 0, 0.2, 1] }}
      >
        {/* Input Field */}
        <div className='flex-1 min-h-[24px] flex items-center'>
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
              'text-base leading-6 min-h-[24px] max-h-[160px] font-medium',
              'focus:ring-0 focus:outline-none placeholder:font-normal placeholder:text-gray-400',
              'placeholder:leading-6 placeholder:align-middle py-0'
            )}
            rows={1}
            style={{
              height: 'auto',
              overflow: 'hidden',
            }}
          />
        </div>

        {/* Send Button */}
        <motion.div
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          transition={{ type: 'spring', stiffness: 400, damping: 17 }}
        >
          <Button
            type='submit'
            disabled={!message.trim() || isLoading || disabled}
            size='icon'
            className={cn(
              'h-8 w-8 rounded-full transition-all duration-200',
              'bg-gradient-to-r from-teal-600 to-teal-700 hover:from-teal-700 hover:to-teal-800 text-white',
              'disabled:bg-gray-300 disabled:text-gray-500 disabled:cursor-not-allowed',
              'shadow-md hover:shadow-lg border border-teal-700/20',
              'hover:scale-105 active:scale-95',
              'relative overflow-hidden'
            )}
          >
            {isLoading ? (
              <motion.div
                initial={{ rotate: 0 }}
                animate={{ rotate: 360 }}
                transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
              >
                <Loader2 className='h-4 w-4 text-white' />
              </motion.div>
            ) : (
              <motion.div
                initial={{ scale: 0.8 }}
                animate={{ scale: 1 }}
                transition={{ type: 'spring', stiffness: 400, damping: 17 }}
              >
                <Send className='h-4 w-4 text-white' />
              </motion.div>
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
          Press Enter to send • Shift + Enter for new line
        </p>
      </motion.div>
    </div>
  );
}
