'use client';

import { useAuth } from '@/lib/contexts/AuthContext';
import { motion } from 'framer-motion';
import { MessageCircle, User, Phone } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { ChatSidebar } from '@/components/chat/ChatSidebar';
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from '@/components/ui/sidebar';
import { Menu } from 'lucide-react';

export default function ChatPage() {
  const { user, userProfile, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !user) {
      router.push('/login');
    }
  }, [user, loading, router]);



  if (loading) {
    return (
      <div className='min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 via-gray-100 to-gray-200'>
        <div className='animate-spin rounded-full h-12 w-12 border-b-2 border-primary'></div>
      </div>
    );
  }

  if (!user) {
    return null; // Will redirect to login
  }

  return (
    <SidebarProvider>
      <ChatSidebar />
      <SidebarInset>
        {/* Main Content */}
        <div className='flex-1 bg-gradient-to-br from-gray-50 via-gray-100 to-gray-200 relative'>
          {/* Floating Sidebar Toggle */}
          <div className='absolute top-4 left-4 z-20'>
            <SidebarTrigger className='h-10 w-10 p-0 bg-white/95 backdrop-blur-sm border border-border/40 shadow-lg hover:bg-white/98 hover:shadow-xl hover:border-border/60 transition-all duration-200 rounded-md flex items-center justify-center'>
              <Menu className='h-4 w-4' />
            </SidebarTrigger>
          </div>
          
          {/* Background Pattern */}
          <div className='absolute inset-0 bg-[linear-gradient(rgba(0,0,0,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(0,0,0,0.03)_1px,transparent_1px)] bg-[size:20px_20px] md:bg-[size:30px_30px]' />
          
          {/* Decorative Blurs */}
          <div className='absolute top-1/4 left-1/4 w-32 h-32 md:w-64 md:h-64 bg-primary/3 rounded-full blur-2xl' />
          <div className='absolute bottom-1/4 right-1/4 w-32 h-32 md:w-64 md:h-64 bg-accent/3 rounded-full blur-2xl' />
          
          <div className='relative z-10 p-4 h-full pt-20'>
        {/* Welcome Section */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className='mb-8'
        >
          <div className='flex items-center gap-4'>
            <div className='p-3 bg-primary/10 rounded-full'>
              <MessageCircle className='w-6 h-6 text-primary' />
            </div>
            <div>
              <h2 className='text-2xl font-bold text-foreground'>Welcome to OwlAI</h2>
              <p className='text-muted-foreground'>Your personalized AI learning assistant</p>
            </div>
          </div>
        </motion.div>

        {/* User Info Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.1 }}
          className='bg-white/95 backdrop-blur-md rounded-2xl shadow-xl border border-white/20 p-6 mb-8'
        >
          <div className='flex items-center gap-4'>
            <div className='p-3 bg-primary/10 rounded-full'>
              <User className='w-6 h-6 text-primary' />
            </div>
            <div>
              <h2 className='text-lg font-semibold text-foreground'>User Profile</h2>
              <div className='flex items-center gap-2 text-muted-foreground mt-1'>
                <Phone className='w-4 h-4' />
                <span>{userProfile?.phoneNumber || user.phoneNumber || 'Phone number verified'}</span>
              </div>
              {userProfile?.displayName && (
                <p className='text-sm text-foreground mt-1'>
                  Name: {userProfile.displayName}
                </p>
              )}
              <p className='text-sm text-muted-foreground mt-1'>
                User ID: {user.uid}
              </p>
              <p className='text-sm text-muted-foreground'>
                Member since: {userProfile?.createdAt ? new Date(userProfile.createdAt.seconds * 1000).toLocaleDateString() : 'Recently'}
              </p>
              <p className='text-sm text-muted-foreground'>
                Status: {userProfile?.isActive ? '🟢 Active' : '🔴 Inactive'}
              </p>
            </div>
          </div>
        </motion.div>

        {/* Demo Chat Interface */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.2 }}
          className='bg-white/95 backdrop-blur-md rounded-2xl shadow-xl border border-white/20 p-6'
        >
          <div className='flex items-center gap-3 mb-6'>
            <div className='p-2 bg-primary/10 rounded-lg'>
              <MessageCircle className='w-5 h-5 text-primary' />
            </div>
            <h2 className='text-xl font-semibold text-foreground'>AI Chat Assistant</h2>
          </div>
          
          <div className='space-y-4'>
            {/* Demo Messages */}
            <div className='flex justify-start'>
              <div className='bg-gray-100 rounded-2xl rounded-bl-md px-4 py-3 max-w-xs'>
                <p className='text-sm text-gray-800'>
                  Hello! I&apos;m your AI learning assistant. How can I help you study today?
                </p>
              </div>
            </div>
            
            <div className='flex justify-end'>
              <div className='bg-primary rounded-2xl rounded-br-md px-4 py-3 max-w-xs'>
                <p className='text-sm text-white'>
                  Hi! I&apos;d like to prepare for my upcoming exam.
                </p>
              </div>
            </div>
            
            <div className='flex justify-start'>
              <div className='bg-gray-100 rounded-2xl rounded-bl-md px-4 py-3 max-w-xs'>
                <p className='text-sm text-gray-800'>
                  Great! What subject are you studying? I can help create a personalized study plan for you.
                </p>
              </div>
            </div>
          </div>
          
          {/* Demo Input */}
          <div className='mt-6 pt-4 border-t border-gray-200'>
            <div className='flex gap-3'>
              <input
                type='text'
                placeholder='Type your message here... (Demo mode)'
                className='flex-1 px-4 py-3 border border-gray-200 rounded-full focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary/50'
                disabled
              />
              <button
                className='px-6 py-3 bg-primary text-white rounded-full hover:bg-primary/90 transition-colors disabled:opacity-50'
                disabled
              >
                Send
              </button>
            </div>
            <p className='text-xs text-muted-foreground mt-2 text-center'>
              This is a demo interface. Full chat functionality will be implemented soon!
            </p>
          </div>
        </motion.div>
        
        {/* Success Message */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.3 }}
          className='mt-8 text-center'
        >
          <div className='inline-flex items-center gap-2 px-4 py-2 bg-green-50 border border-green-200 rounded-full text-green-800'>
            <div className='w-2 h-2 bg-green-500 rounded-full'></div>
            <span className='text-sm font-medium'>Authentication Successful!</span>
          </div>
        </motion.div>
          </div>
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}