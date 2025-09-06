'use client';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { motion } from 'framer-motion';
import { ArrowLeft, LogOut, MessageSquare, Send } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { clearAuthUser, getAuthUser } from '../../lib/auth';

export default function ChatPage() {
  const router = useRouter();
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState([
    {
      id: 1,
      text: "Hello! I'm your AI study partner. How can I help you today?",
      isUser: false,
      timestamp: new Date(),
    },
  ]);

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!message.trim()) return;

    const newMessage = {
      id: messages.length + 1,
      text: message,
      isUser: true,
      timestamp: new Date(),
    };

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

  const handleBackToHome = () => {
    router.push('/');
  };

  const handleLogout = () => {
    clearAuthUser();
    router.push('/');
  };

  // Check if user is authenticated
  const user = getAuthUser();
  if (!user?.isAuthenticated) {
    router.push('/login');
    return null;
  }

  return (
    <div className='min-h-screen bg-gradient-to-br from-background via-background to-primary/5'>
      {/* Header */}
      <motion.header
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5 }}
        className='relative z-10 p-4 border-b border-border/10 bg-white/80 backdrop-blur-sm'
      >
        <div className='max-w-4xl mx-auto flex items-center justify-between'>
          <div className='flex items-center space-x-4'>
            <Button
              variant='ghost'
              size='sm'
              onClick={handleBackToHome}
              className='text-muted-foreground hover:text-foreground'
            >
              <ArrowLeft className='w-4 h-4 mr-2' />
              Back to Home
            </Button>
            <div className='flex items-center space-x-2'>
              <div className='w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center'>
                <MessageSquare className='w-4 h-4 text-primary' />
              </div>
              <h1 className='text-lg font-semibold text-foreground'>
                Chat with AI
              </h1>
            </div>
          </div>
          <Button
            variant='ghost'
            size='sm'
            onClick={handleLogout}
            className='text-muted-foreground hover:text-foreground'
          >
            <LogOut className='w-4 h-4 mr-2' />
            Logout
          </Button>
        </div>
      </motion.header>

      {/* Chat Interface */}
      <div className='max-w-4xl mx-auto p-4 h-[calc(100vh-80px)] flex flex-col'>
        {/* Messages */}
        <div className='flex-1 overflow-y-auto space-y-4 mb-4'>
          {messages.map(msg => (
            <motion.div
              key={msg.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
              className={`flex ${msg.isUser ? 'justify-end' : 'justify-start'}`}
            >
              <div
                className={`max-w-[70%] p-3 rounded-2xl ${
                  msg.isUser
                    ? 'bg-primary text-white'
                    : 'bg-white/80 backdrop-blur-sm border border-border/20'
                }`}
              >
                <p className='text-sm'>{msg.text}</p>
                <p
                  className={`text-xs mt-1 ${
                    msg.isUser ? 'text-white/70' : 'text-muted-foreground'
                  }`}
                >
                  {msg.timestamp.toLocaleTimeString()}
                </p>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Message Input */}
        <motion.form
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          onSubmit={handleSendMessage}
          className='flex space-x-2'
        >
          <Input
            value={message}
            onChange={e => setMessage(e.target.value)}
            placeholder='Type your message...'
            className='flex-1 h-12 bg-white/80 backdrop-blur-sm border-border/20'
          />
          <Button
            type='submit'
            size='sm'
            className='h-12 px-4 bg-primary hover:bg-primary/90'
            disabled={!message.trim()}
          >
            <Send className='w-4 h-4' />
          </Button>
        </motion.form>
      </div>
    </div>
  );
}
