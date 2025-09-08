'use client';

import { cn } from '@/lib/utils';
import { Loader2, Send } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import { ChatGPTMessage } from './ChatGPTMessage';

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
  inputBackground: '#2f2f2f',
  inputBorder: '#4a4a4a',
  inputFocus: '#10a37f',
};

interface Message {
  id: string;
  content: string;
  isUser: boolean;
  isError?: boolean;
  timestamp: Date;
}

interface ChatGPTContainerProps {
  className?: string;
  onSendMessage?: (message: string) => Promise<void>;
  isLoading?: boolean;
  messages?: Message[];
}

export function ChatGPTContainer({
  className,
  onSendMessage,
  isLoading = false,
  messages = [],
}: ChatGPTContainerProps) {
  const [inputValue, setInputValue] = useState('');
  const [localMessages, setLocalMessages] = useState<Message[]>(messages);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [localMessages]);

  // Focus input on mount
  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  const handleSend = async () => {
    if (!inputValue.trim() || isLoading) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      content: inputValue.trim(),
      isUser: true,
      timestamp: new Date(),
    };

    setLocalMessages(prev => [...prev, userMessage]);
    setInputValue('');

    if (onSendMessage) {
      try {
        await onSendMessage(userMessage.content);
      } catch {
        const errorMessage: Message = {
          id: (Date.now() + 1).toString(),
          content:
            'Sorry, there was an error processing your request. Please try again.',
          isUser: false,
          isError: true,
          timestamp: new Date(),
        };
        setLocalMessages(prev => [...prev, errorMessage]);
      }
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleRetry = () => {
    // Remove the last error message and resend the last user message
    const lastUserMessage = localMessages.filter(msg => msg.isUser).pop();

    if (lastUserMessage) {
      setLocalMessages(prev => prev.filter(msg => !msg.isError));
      handleSend();
    }
  };

  return (
    <div
      className={cn('flex flex-col h-full', className)}
      style={{ backgroundColor: colors.background }}
    >
      {/* Header */}
      <div
        className='flex-shrink-0 px-6 py-4 border-b'
        style={{
          borderColor: colors.border,
          backgroundColor: colors.surface,
        }}
      >
        <h1 className='text-lg font-semibold' style={{ color: colors.text }}>
          OwlAI Chat
        </h1>
      </div>

      {/* Messages Container */}
      <div
        className='flex-1 overflow-y-auto px-6 py-4 min-h-0'
        style={{ backgroundColor: colors.background }}
      >
        {localMessages.length === 0 ? (
          <div className='flex items-center justify-center h-full'>
            <div className='text-center'>
              <div
                className='w-16 h-16 mx-auto mb-4 rounded-full flex items-center justify-center'
                style={{ backgroundColor: colors.accent }}
              >
                <svg
                  className='w-8 h-8 text-white'
                  fill='currentColor'
                  viewBox='0 0 24 24'
                >
                  <path d='M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z' />
                </svg>
              </div>
              <h2
                className='text-xl font-semibold mb-2'
                style={{ color: colors.text }}
              >
                How can I help you today?
              </h2>
              <p className='text-sm' style={{ color: colors.textMuted }}>
                Start a conversation by typing a message below.
              </p>
            </div>
          </div>
        ) : (
          <div className='max-w-4xl mx-auto'>
            {localMessages.map(message => (
              <ChatGPTMessage
                key={message.id}
                content={message.content}
                isUser={message.isUser}
                isError={message.isError}
                onRetry={message.isError ? handleRetry : undefined}
              />
            ))}

            {/* Loading indicator */}
            {isLoading && (
              <div className='flex justify-start mb-6'>
                <div className='flex-shrink-0 mr-3'>
                  <div
                    className='w-8 h-8 rounded-full flex items-center justify-center'
                    style={{ backgroundColor: colors.accent }}
                  >
                    <Loader2 className='w-5 h-5 text-white animate-spin' />
                  </div>
                </div>
                <div
                  className='rounded-2xl px-4 py-3 shadow-sm'
                  style={{
                    backgroundColor: colors.surface,
                    border: `1px solid ${colors.border}`,
                  }}
                >
                  <div className='flex items-center gap-2'>
                    <div className='flex gap-1'>
                      <div
                        className='w-2 h-2 rounded-full animate-pulse'
                        style={{ backgroundColor: colors.accent }}
                      />
                      <div
                        className='w-2 h-2 rounded-full animate-pulse'
                        style={{ backgroundColor: colors.accent }}
                      />
                      <div
                        className='w-2 h-2 rounded-full animate-pulse'
                        style={{ backgroundColor: colors.accent }}
                      />
                    </div>
                    <span
                      className='text-sm'
                      style={{ color: colors.textMuted }}
                    >
                      Thinking...
                    </span>
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>
        )}
      </div>

      {/* Input Container */}
      <div
        className='flex-shrink-0 px-6 py-4 border-t'
        style={{
          borderColor: colors.border,
          backgroundColor: colors.surface,
        }}
      >
        <div className='max-w-4xl mx-auto'>
          <div className='relative'>
            <textarea
              ref={inputRef}
              value={inputValue}
              onChange={e => setInputValue(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder='Message OwlAI...'
              disabled={isLoading}
              className='w-full px-4 py-3 pr-12 rounded-2xl resize-none focus:outline-none transition-all duration-200'
              style={{
                backgroundColor: colors.inputBackground,
                border: `1px solid ${colors.inputBorder}`,
                color: colors.text,
                minHeight: '48px',
                maxHeight: '120px',
              }}
              onFocus={e => {
                e.target.style.borderColor = colors.inputFocus;
              }}
              onBlur={e => {
                e.target.style.borderColor = colors.inputBorder;
              }}
            />

            <button
              onClick={handleSend}
              disabled={!inputValue.trim() || isLoading}
              className='absolute right-2 top-1/2 transform -translate-y-1/2 p-2 rounded-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed'
              style={{
                backgroundColor:
                  inputValue.trim() && !isLoading
                    ? colors.accent
                    : colors.surfaceHover,
                color: 'white',
              }}
            >
              {isLoading ? (
                <Loader2 className='w-5 h-5 animate-spin' />
              ) : (
                <Send className='w-5 h-5' />
              )}
            </button>
          </div>

          <p
            className='text-xs mt-2 text-center'
            style={{ color: colors.textMuted }}
          >
            Press Enter to send, Shift+Enter for new line
          </p>
        </div>
      </div>
    </div>
  );
}
