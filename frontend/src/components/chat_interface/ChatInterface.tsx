'use client';

import { createNewChat, getCurrentChatId } from '@/lib/chats';
import { sendUserMessage } from '@/lib/messages';
import { subscribeToMessages, type MessageModel } from '@/lib/realtime';
import {
  BookOpen,
  Check as CheckIcon,
  Copy as CopyIcon,
  Lightbulb,
  MessageSquare,
  Sparkles,
  ThumbsDown,
  ThumbsUp,
  Zap,
} from 'lucide-react';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { MarkdownRenderer } from './MarkdownRenderer';

// Firebase imports removed - not needed in production
import { ChatSearchBar } from './index';

const starterPrompts = [
  {
    icon: <BookOpen className='w-5 h-5' />,
    title: 'Teaching Aptitude',
    description: 'Define and explain importance for teachers',
    prompt:
      'Define teaching aptitude and explain its importance for a teacher.',
  },
  {
    icon: <Lightbulb className='w-5 h-5' />,
    title: 'Research Methodology',
    description: 'Explain qualitative vs quantitative research',
    prompt:
      'Explain the difference between qualitative and quantitative research methods with examples.',
  },
  {
    icon: <Zap className='w-5 h-5' />,
    title: 'Educational Psychology',
    description: 'Learning theories and their applications',
    prompt:
      'Discuss the major learning theories in educational psychology and their practical applications.',
  },
  {
    icon: <Sparkles className='w-5 h-5' />,
    title: 'Curriculum Development',
    description: 'Modern approaches to curriculum design',
    prompt:
      'Explain modern approaches to curriculum development and design principles.',
  },
];

export function ChatInterface() {
  const [messages, setMessages] = useState<MessageModel[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [showStarterPrompts, setShowStarterPrompts] = useState(true);
  const [selectedPrompt, setSelectedPrompt] = useState('');
  const [prefillQuery, setPrefillQuery] = useState('');
  const [copiedMessageId, setCopiedMessageId] = useState<string | null>(null);
  const [messageFeedback, setMessageFeedback] = useState<
    Record<string, 'up' | 'down'>
  >({});
  const unsubRef = useRef<(() => void) | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const startSub = useCallback((chatId: string) => {
    if (unsubRef.current) unsubRef.current();
    // Hide starter prompts when starting subscription to any chat
    setShowStarterPrompts(false);
    unsubRef.current = subscribeToMessages(chatId, newMessages => {
      setMessages(newMessages);
    });
  }, []);

  // Load current chat on mount
  useEffect(() => {
    const currentChatId = getCurrentChatId();
    if (currentChatId) {
      setShowStarterPrompts(false);
      startSub(currentChatId);
    } else {
      setShowStarterPrompts(true);
    }
  }, [startSub]);

  // Listen for storage changes and custom events
  useEffect(() => {
    const onStorage = (e: StorageEvent) => {
      if (e.key === 'currentChatId' && e.newValue) {
        // Hide starter prompts when loading existing chat
        setShowStarterPrompts(false);
        startSub(e.newValue);
      }
    };
    const onSwitched = (e: Event) => {
      const detail = (e as CustomEvent).detail as {
        chatId?: string;
        showEmptyChat?: boolean;
      };

      if (detail?.showEmptyChat) {
        // Show welcome screen for new chat
        setMessages([]);
        setShowStarterPrompts(true);
        // Clear current chat ID to ensure fresh start
        if (typeof window !== 'undefined') {
          localStorage.removeItem('currentChatId');
        }
        if (unsubRef.current) {
          unsubRef.current();
          unsubRef.current = null;
        }
      } else if (detail?.chatId) {
        // Clear existing messages when switching chats to prevent duplicates
        setMessages([]);
        // Hide starter prompts when switching to existing chat
        setShowStarterPrompts(false);
        startSub(detail.chatId);
      }
    };
    const onReset = () => {
      // Reset to welcome screen
      setMessages([]);
      setShowStarterPrompts(true);
      if (unsubRef.current) {
        unsubRef.current();
        unsubRef.current = null;
      }
    };
    const onInitiateQuery = (e: Event) => {
      const detail = (e as CustomEvent).detail as { query: string };
      if (detail?.query) {
        // Pre-fill the search bar with the query
        setPrefillQuery(detail.query);
        // Hide starter prompts and show empty chat state
        setShowStarterPrompts(false);
        setMessages([]);
        // Clear current chat ID to ensure fresh start
        if (typeof window !== 'undefined') {
          localStorage.removeItem('currentChatId');
        }
        if (unsubRef.current) {
          unsubRef.current();
          unsubRef.current = null;
        }
      }
    };
    window.addEventListener('storage', onStorage);
    document.addEventListener('chat:switched', onSwitched as EventListener);
    document.addEventListener('chat:reset', onReset);
    document.addEventListener(
      'chat:initiate-query',
      onInitiateQuery as EventListener
    );

    return () => {
      if (unsubRef.current) unsubRef.current();
      window.removeEventListener('storage', onStorage);
      document.removeEventListener(
        'chat:switched',
        onSwitched as EventListener
      );
      document.removeEventListener('chat:reset', onReset);
      document.removeEventListener(
        'chat:initiate-query',
        onInitiateQuery as EventListener
      );
    };
  }, []);

  const handleSendMessage = useCallback(
    async (content: string) => {
      if (!content.trim() || isLoading) return;

      setIsLoading(true);
      setShowStarterPrompts(false);

      try {
        let currentChatId = getCurrentChatId();

        // Create a new chat if one doesn't exist
        if (!currentChatId) {
          currentChatId = await createNewChat();
          // Dispatch event to notify sidebar about new chat
          document.dispatchEvent(
            new CustomEvent('chat:switched', {
              detail: { chatId: currentChatId },
            })
          );
        }

        await sendUserMessage(currentChatId, content);

        // Start subscription to load messages for the current chat
        startSub(currentChatId);

        // Also dispatch a custom event to ensure sidebar updates
        document.dispatchEvent(
          new CustomEvent('chat:switched', {
            detail: { chatId: currentChatId },
          })
        );
      } catch (err: unknown) {
        console.error('Failed to send message:', (err as Error)?.name);
      } finally {
        setIsLoading(false);
      }
    },
    [isLoading, startSub]
  );

  const handleStarterPrompt = useCallback(
    (prompt: string) => {
      setSelectedPrompt(prompt);
      setPrefillQuery(prompt);
      setShowStarterPrompts(false);
      handleSendMessage(prompt);
    },
    [handleSendMessage]
  );

  const handleCopyMessage = useCallback(
    (messageId: string, content: string) => {
      navigator.clipboard.writeText(content).then(() => {
        setCopiedMessageId(messageId);
        setTimeout(() => setCopiedMessageId(null), 2000);
      });
    },
    []
  );

  const handleMessageFeedback = useCallback(
    (messageId: string, feedback: 'up' | 'down') => {
      setMessageFeedback(prev => ({ ...prev, [messageId]: feedback }));
    },
    []
  );

  // Memoize starter prompts to prevent unnecessary re-renders
  const memoizedStarterPrompts = useMemo(() => starterPrompts, []);

  return (
    <div className='flex flex-col h-full bg-background'>
      {/* Main Content Area - Scrollable */}
      <div className='flex-1 overflow-y-auto'>
        <div
          className={
            messages.length > 0
              ? 'px-3 sm:px-4 md:px-6 py-4 sm:py-6 md:py-8'
              : 'flex flex-col items-center justify-center h-full px-3 sm:px-4 md:px-6 py-6 sm:py-8 md:py-12'
          }
        >
          {showStarterPrompts ? (
            <>
              {/* Welcome Section */}
              <div className='text-center mb-6 sm:mb-8'>
                <div className='flex items-center justify-center mb-3 sm:mb-4'>
                  <div className='w-10 h-10 sm:w-12 sm:h-12 bg-primary/10 rounded-full flex items-center justify-center'>
                    <MessageSquare className='w-5 h-5 sm:w-6 sm:h-6 text-primary' />
                  </div>
                </div>
                <h1 className='text-xl sm:text-2xl md:text-3xl font-bold text-foreground mb-2'>
                  OWL AI
                </h1>
                <p className='text-sm sm:text-base text-muted-foreground mb-4 sm:mb-6 max-w-lg mx-auto'>
                  Your intelligent study partner for competitive exams and
                  academic success.
                </p>
              </div>

              {/* Starter Prompts Grid */}
              <div className='grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 max-w-3xl mx-auto w-full'>
                {memoizedStarterPrompts.map((prompt, index) => (
                  <button
                    key={index}
                    type='button'
                    onClick={() => handleStarterPrompt(prompt.prompt)}
                    className='group p-3 sm:p-4 rounded-lg border border-border bg-background hover:bg-muted/50 hover:border-border/80 transition-all duration-200 text-left focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2'
                  >
                    <div className='flex items-start gap-2.5 sm:gap-3'>
                      <div className='flex-shrink-0 w-7 h-7 sm:w-8 sm:h-8 bg-primary/10 rounded-md flex items-center justify-center group-hover:bg-primary/20 transition-colors'>
                        {prompt.icon}
                      </div>
                      <div className='flex-1 min-w-0'>
                        <h3 className='text-sm sm:text-base font-semibold text-foreground mb-1 sm:mb-2 group-hover:text-foreground transition-colors'>
                          {prompt.title}
                        </h3>
                        <p className='text-xs sm:text-sm text-muted-foreground group-hover:text-foreground/80 transition-colors leading-relaxed'>
                          {prompt.description}
                        </p>
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            </>
          ) : messages.length === 0 ? (
            /* Empty Chat State - Industry Standard */
            <>
              <div className='text-center'>
                <div className='flex items-center justify-center mb-6'>
                  <div className='w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center'>
                    <MessageSquare className='w-8 h-8 text-primary' />
                  </div>
                </div>
                <h2 className='text-2xl font-semibold text-foreground mb-3'>
                  How can I help you today?
                </h2>
                <p className='text-base text-muted-foreground max-w-md mx-auto leading-relaxed'>
                  Send a message to start a new conversation. I'm here to help
                  with your studies, exam preparation, and academic questions.
                </p>
              </div>
            </>
          ) : null}

          {messages.length > 0 && (
            <div className='w-full max-w-3xl mx-auto'>
              {/* Chat Header */}
              <div className='mb-3 sm:mb-4 px-2 sm:px-0'>
                <h2 className='text-base sm:text-lg font-medium text-foreground'>
                  Chat
                </h2>
              </div>

              {/* Messages Thread */}
              <div className='space-y-2 sm:space-y-3 px-1 sm:px-2 md:px-0'>
                {messages.map(m => {
                  const isUser = m.role === 'user';
                  const isCopied = copiedMessageId === m.id;
                  const feedback = messageFeedback[m.id];

                  return (
                    <div
                      key={m.id}
                      className={`flex gap-2 sm:gap-3 ${
                        isUser ? 'justify-end' : 'justify-start'
                      }`}
                    >
                      <div
                        className={`max-w-[85%] sm:max-w-[80%] md:max-w-[75%] rounded-2xl px-3 sm:px-4 py-2 sm:py-3 ${
                          isUser
                            ? 'bg-primary text-primary-foreground'
                            : 'bg-muted text-foreground'
                        }`}
                      >
                        {isUser ? (
                          <p className='leading-relaxed whitespace-pre-wrap'>
                            {m.text}
                          </p>
                        ) : (
                          <div className='leading-relaxed relative'>
                            <MarkdownRenderer content={m.text} />
                            {
                              <div className='mt-2 flex items-center gap-1 sm:gap-1.5 text-muted-foreground'>
                                <button
                                  type='button'
                                  className='inline-flex items-center gap-1 px-1.5 sm:px-2 py-1 rounded hover:bg-muted/70 transition'
                                  onClick={() =>
                                    handleCopyMessage(m.id, m.text)
                                  }
                                  aria-label='Copy message'
                                >
                                  {isCopied ? (
                                    <CheckIcon className='w-3 h-3' />
                                  ) : (
                                    <CopyIcon className='w-3 h-3' />
                                  )}
                                  <span className='text-xs'>
                                    {isCopied ? 'Copied' : 'Copy'}
                                  </span>
                                </button>
                                <button
                                  type='button'
                                  className={`inline-flex items-center gap-1 px-1.5 sm:px-2 py-1 rounded transition ${
                                    feedback === 'up'
                                      ? 'bg-green-100 text-green-700'
                                      : 'hover:bg-muted/70'
                                  }`}
                                  onClick={() =>
                                    handleMessageFeedback(m.id, 'up')
                                  }
                                  aria-label='Thumbs up'
                                >
                                  <ThumbsUp className='w-3 h-3' />
                                </button>
                                <button
                                  type='button'
                                  className={`inline-flex items-center gap-1 px-1.5 sm:px-2 py-1 rounded transition ${
                                    feedback === 'down'
                                      ? 'bg-red-100 text-red-700'
                                      : 'hover:bg-muted/70'
                                  }`}
                                  onClick={() =>
                                    handleMessageFeedback(m.id, 'down')
                                  }
                                  aria-label='Thumbs down'
                                >
                                  <ThumbsDown className='w-3 h-3' />
                                </button>
                              </div>
                            }
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}

                {/* Loading State */}
                {isLoading && (
                  <div className='flex gap-2 sm:gap-3 justify-start'>
                    <div className='max-w-[85%] sm:max-w-[80%] md:max-w-[75%] rounded-2xl px-3 sm:px-4 py-2 sm:py-3 bg-muted text-foreground'>
                      <div className='flex items-center gap-2'>
                        <div className='flex space-x-1'>
                          <div className='w-2 h-2 bg-muted-foreground rounded-full animate-bounce' />
                          <div
                            className='w-2 h-2 bg-muted-foreground rounded-full animate-bounce'
                            style={{ animationDelay: '0.1s' }}
                          />
                          <div
                            className='w-2 h-2 bg-muted-foreground rounded-full animate-bounce'
                            style={{ animationDelay: '0.2s' }}
                          />
                        </div>
                        <span className='text-sm text-muted-foreground'>
                          Thinking...
                        </span>
                      </div>
                    </div>
                  </div>
                )}
              </div>
              <div ref={messagesEndRef} />
            </div>
          )}
        </div>
      </div>

      {/* Fixed Input Bar - Always visible */}
      <div className='sticky bottom-0 bg-gradient-to-t from-background via-background/90 to-background/60 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-t border-border/70 p-3 sm:p-4'>
        <div className='max-w-3xl mx-auto'>
          <ChatSearchBar
            onSubmit={handleSendMessage}
            placeholder='Ask me anything about your studies...'
            initialValue={prefillQuery}
          />
        </div>
      </div>
    </div>
  );
}
