'use client';

import { ChatInterface } from '@/components/chat_interface';
import { AppSidebar } from '@/components/sidebar/app-sidebar';
import { SiteHeader } from '@/components/sidebar/site-header';
import { SidebarInset, SidebarProvider } from '@/components/ui/sidebar';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

export default function Page() {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !user) {
      router.push('/auth');
    }
  }, [user, loading, router]);

  if (loading) {
    return (
      <div className='min-h-screen bg-background flex items-center justify-center'>
        <div className='flex items-center space-x-2'>
          <div className='w-4 h-4 bg-primary rounded-full animate-bounce'></div>
          <div
            className='w-4 h-4 bg-primary rounded-full animate-bounce'
            style={{ animationDelay: '0.1s' }}
          ></div>
          <div
            className='w-4 h-4 bg-primary rounded-full animate-bounce'
            style={{ animationDelay: '0.2s' }}
          ></div>
        </div>
      </div>
    );
  }

  if (!user) {
    return null; // Will redirect to auth
  }

  return (
    <div className='[--header-height:calc(--spacing(14))] h-screen overflow-hidden'>
      <SidebarProvider className='flex flex-col h-full'>
        <SiteHeader />
        <div className='flex flex-1 overflow-hidden'>
          <AppSidebar />
          <SidebarInset className='bg-background flex-1 overflow-hidden'>
            <ChatInterface />
          </SidebarInset>
        </div>
      </SidebarProvider>
    </div>
  );
}
