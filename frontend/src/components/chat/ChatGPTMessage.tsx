'use client';

import { cn } from '@/lib/utils';
import { Check, Copy, RotateCcw, ThumbsDown, ThumbsUp } from 'lucide-react';
import { useState } from 'react';
import { ChatGPTRenderer } from './ChatGPTRenderer';

// ChatGPT exact colors
const colors = {
  background: '#212121',
  surface: '#2f2f2f',
  surfaceHover: '#3a3a3a',
  border: '#4a4a4a',
  text: '#ececec',
  textSecondary: '#b4b4b4',
  textMuted: '#8e8e8e',
  accent: '#10a37f',
  accentHover: '#0d8f6f',
  success: '#10a37f',
  error: '#ef4444',
};

interface ChatGPTMessageProps {
  content: string;
  isUser?: boolean;
  isError?: boolean;
  onRetry?: () => void;
  className?: string;
}

export function ChatGPTMessage({
  content,
  isUser = false,
  isError = false,
  onRetry,
  className,
}: ChatGPTMessageProps) {
  const [copied, setCopied] = useState(false);
  const [showActions, setShowActions] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(content);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  if (isUser) {
    return (
      <div className={cn('flex justify-end mb-6', className)}>
        <div
          className='max-w-[80%] rounded-2xl px-4 py-3 shadow-sm'
          style={{
            backgroundColor: colors.accent,
            color: 'white',
          }}
        >
          <p className='text-sm leading-relaxed whitespace-pre-wrap'>
            {content}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div
      className={cn('flex justify-start mb-6 group', className)}
      onMouseEnter={() => setShowActions(true)}
      onMouseLeave={() => setShowActions(false)}
    >
      {/* AI Avatar */}
      <div className='flex-shrink-0 mr-3'>
        <div
          className='w-8 h-8 rounded-full flex items-center justify-center'
          style={{ backgroundColor: colors.accent }}
        >
          <svg
            className='w-5 h-5 text-white'
            fill='currentColor'
            viewBox='0 0 24 24'
          >
            <path d='M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z' />
          </svg>
        </div>
      </div>

      {/* Message Content */}
      <div className='flex-1 max-w-[80%]'>
        <div
          className='rounded-2xl px-4 py-3 shadow-sm relative'
          style={{
            backgroundColor: colors.surface,
            border: `1px solid ${colors.border}`,
          }}
        >
          {/* Message Content */}
          <div className='pr-12'>
            {isError ? (
              <div className='space-y-3'>
                <p
                  className='text-sm leading-relaxed'
                  style={{ color: colors.error }}
                >
                  {content}
                </p>
                {onRetry && (
                  <button
                    onClick={onRetry}
                    className='flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-colors'
                    style={{
                      backgroundColor: colors.surfaceHover,
                      color: colors.text,
                    }}
                  >
                    <RotateCcw className='w-4 h-4' />
                    Try again
                  </button>
                )}
              </div>
            ) : (
              <ChatGPTRenderer content={content} />
            )}
          </div>

          {/* Action Buttons */}
          <div
            className={cn(
              'absolute top-3 right-3 flex gap-1 transition-opacity duration-200',
              showActions ? 'opacity-100' : 'opacity-0'
            )}
          >
            <button
              onClick={handleCopy}
              className='p-2 rounded-lg transition-all duration-200 hover:scale-105'
              style={{
                backgroundColor: colors.surfaceHover,
                color: copied ? colors.success : colors.textMuted,
              }}
              title={copied ? 'Copied!' : 'Copy'}
            >
              {copied ? (
                <Check className='w-4 h-4' />
              ) : (
                <Copy className='w-4 h-4' />
              )}
            </button>

            <button
              className='p-2 rounded-lg transition-all duration-200 hover:scale-105'
              style={{
                backgroundColor: colors.surfaceHover,
                color: colors.textMuted,
              }}
              title='Good response'
            >
              <ThumbsUp className='w-4 h-4' />
            </button>

            <button
              className='p-2 rounded-lg transition-all duration-200 hover:scale-105'
              style={{
                backgroundColor: colors.surfaceHover,
                color: colors.textMuted,
              }}
              title='Bad response'
            >
              <ThumbsDown className='w-4 h-4' />
            </button>
          </div>
        </div>

        {/* Timestamp */}
        <div className='text-xs mt-2 ml-4' style={{ color: colors.textMuted }}>
          {new Date().toLocaleTimeString([], {
            hour: '2-digit',
            minute: '2-digit',
          })}
        </div>
      </div>
    </div>
  );
}
