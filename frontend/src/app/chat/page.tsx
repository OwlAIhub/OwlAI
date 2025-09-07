'use client';

import { AppSidebar } from '@/components/sidebar/app-sidebar';
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '@/components/ui/breadcrumb';
import { Separator } from '@/components/ui/separator';
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from '@/components/ui/sidebar';
import { getAuthUser } from '@/lib/auth';
import { Copy, RefreshCw, Send, ThumbsDown, ThumbsUp } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { Button } from '../../components/ui/button';
import { Textarea } from '../../components/ui/textarea';

interface Message {
  id: number;
  text: string;
  isUser: boolean;
  timestamp: Date;
}

const starterPrompts = [
  'Explain Teaching Aptitude concepts',
  'Generate UGC NET Paper 1 MCQs',
  'Summarize Research Methodology',
  'Help with Communication topics',
];

const placeholderTexts = [
  "Ask me anything about UGC NET Paper 1 preparation and I'll help you succeed...",
  'Explain Teaching Aptitude concepts like learning theories and teaching methods...',
  'Generate practice MCQs for UGC NET Paper 1 with detailed explanations...',
  'Help me understand Research Methodology and data analysis techniques...',
  'Summarize Communication topics including verbal and non-verbal communication...',
  'Create comprehensive study notes for Higher Education System topics...',
  'What are the latest trends and policies in Indian Higher Education?',
  'Help me master Data Interpretation with charts, graphs, and statistics...',
  'Explain Logical Reasoning concepts and analytical thinking strategies...',
  'Guide me through Information and Communication Technology basics...',
  'Help me understand People and Environment topics for UGC NET...',
  'Create practice questions for Mathematical Reasoning and aptitude...',
];

export default function ChatPage() {
  const router = useRouter();
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState<Message[]>([]);
  const [lastMessage, setLastMessage] = useState('');
  const [currentPlaceholder, setCurrentPlaceholder] = useState(0);

  // Check if user is authenticated
  const user = getAuthUser();

  // Cycle through placeholder texts
  useEffect(() => {
    if (messages.length === 0 && !message) {
      const interval = setInterval(() => {
        setCurrentPlaceholder(prev => (prev + 1) % placeholderTexts.length);
      }, 3000);
      return () => clearInterval(interval);
    }
  }, [messages.length, message]);

  if (!user?.isAuthenticated) {
    router.push('/login');
    return null;
  }

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!message.trim()) return;

    const newMessage = {
      id: messages.length + 1,
      text: message,
      isUser: true,
      timestamp: new Date(),
    };

    setLastMessage(message);
    setMessages(prev => [...prev, newMessage]);
    setMessage('');

    // Simulate AI response
    setTimeout(() => {
      const aiResponse = {
        id: messages.length + 2,
        text: "That's a great question! Let me help you with that. Could you provide more details about what specific topic you'd like to study?",
        isUser: false,
        timestamp: new Date(),
      };
      setMessages(prev => [...prev, aiResponse]);
    }, 1000);
  };

  const handleStarterPrompt = (prompt: string) => {
    setMessage(prompt);
  };

  const handleRecallLastMessage = () => {
    if (lastMessage) {
      setMessage(lastMessage);
    }
  };

  const handleCopyMessage = (text: string) => {
    navigator.clipboard.writeText(text);
  };

  const handleRegenerateResponse = () => {
    // Regenerate logic would go here
  };

  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <header className='flex h-16 shrink-0 items-center gap-2'>
          <div className='flex items-center gap-2 px-4'>
            <SidebarTrigger className='-ml-1' />
            <Separator
              orientation='vertical'
              className='mr-2 data-[orientation=vertical]:h-4'
            />
            <Breadcrumb>
              <BreadcrumbList>
                <BreadcrumbItem className='hidden md:block'>
                  <BreadcrumbLink href='#'>Owl AI</BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator className='hidden md:block' />
                <BreadcrumbItem>
                  <BreadcrumbPage>Chat</BreadcrumbPage>
                </BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>
          </div>
        </header>
        <div className='flex flex-1 flex-col gap-4 p-4 pt-0'>
          {/* Messages */}
          {messages.length > 0 && (
            <div className='flex-1 overflow-y-auto space-y-4 mb-4'>
              {messages.map(msg => (
                <div
                  key={msg.id}
                  className={`flex ${msg.isUser ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`max-w-[70%] p-4 rounded-2xl ${
                      msg.isUser
                        ? 'bg-primary text-white'
                        : 'bg-white/90 backdrop-blur-sm border border-border/20 shadow-sm'
                    }`}
                  >
                    <p className='text-sm leading-relaxed'>{msg.text}</p>

                    {/* Message Actions */}
                    <div
                      className={`flex items-center justify-between mt-3 ${
                        msg.isUser ? 'text-white/70' : 'text-muted-foreground'
                      }`}
                    >
                      <span className='text-xs'>
                        {msg.timestamp.toLocaleTimeString()}
                      </span>

                      {!msg.isUser && (
                        <div className='flex items-center space-x-2'>
                          <button
                            onClick={() => handleCopyMessage(msg.text)}
                            className='p-1 hover:bg-white/20 rounded transition-colors'
                            title='Copy'
                          >
                            <Copy className='w-3 h-3' />
                          </button>
                          <button
                            onClick={handleRegenerateResponse}
                            className='p-1 hover:bg-white/20 rounded transition-colors'
                            title='Regenerate'
                          >
                            <RefreshCw className='w-3 h-3' />
                          </button>
                          <button
                            className='p-1 hover:bg-white/20 rounded transition-colors'
                            title='Like'
                          >
                            <ThumbsUp className='w-3 h-3' />
                          </button>
                          <button
                            className='p-1 hover:bg-white/20 rounded transition-colors'
                            title='Dislike'
                          >
                            <ThumbsDown className='w-3 h-3' />
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* ChatGPT-style Input */}
          <div className='flex items-center justify-center min-h-[calc(100vh-200px)]'>
            <div className='w-full max-w-2xl'>
              {/* Welcome Text */}
              {messages.length === 0 && (
                <div className='text-center mb-8'>
                  <h1 className='text-4xl font-bold text-primary mb-4'>
                    Owl AI
                  </h1>
                  <h2 className='text-2xl font-semibold text-foreground mb-2'>
                    How can I help you today?
                  </h2>
                  <p className='text-muted-foreground mb-6'>
                    Ask me anything about your studies, exams, or learning
                    goals.
                  </p>

                  {/* Starter Prompts */}
                  <div className='grid grid-cols-2 gap-3 max-w-md mx-auto'>
                    {starterPrompts.map((prompt, index) => (
                      <button
                        key={index}
                        onClick={() => handleStarterPrompt(prompt)}
                        className='p-3 text-sm bg-white/80 hover:bg-white/90 border border-border/20 rounded-xl text-left transition-all duration-200 hover:shadow-sm'
                      >
                        {prompt}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              <form onSubmit={handleSendMessage} className='relative'>
                <div className='relative'>
                  <Textarea
                    value={message}
                    onChange={e => setMessage(e.target.value)}
                    placeholder={placeholderTexts[currentPlaceholder]}
                    className='w-full min-h-[52px] max-h-[200px] pr-12 pl-4 py-3 bg-white/90 backdrop-blur-sm border border-border/30 rounded-2xl resize-none shadow-sm text-center placeholder:text-center placeholder:text-muted-foreground/70'
                    rows={1}
                    onKeyDown={e => {
                      if (e.key === 'Enter' && !e.shiftKey) {
                        e.preventDefault();
                        handleSendMessage(e);
                      } else if (e.key === 'ArrowUp' && !message.trim()) {
                        e.preventDefault();
                        handleRecallLastMessage();
                      }
                    }}
                  />

                  <Button
                    type='submit'
                    size='sm'
                    className='absolute right-2 top-1/2 -translate-y-1/2 h-8 w-8 p-0 bg-primary hover:bg-primary/90 rounded-xl'
                    disabled={!message.trim()}
                  >
                    <Send className='w-4 h-4' />
                  </Button>
                </div>

                {/* Input Hints */}
                <div className='flex items-center justify-center mt-2 text-xs text-muted-foreground space-x-4'>
                  <span>Press Enter to send</span>
                  <span>↑ to recall last message</span>
                </div>
              </form>
            </div>
          </div>
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}
