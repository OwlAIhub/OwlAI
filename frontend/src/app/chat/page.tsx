'use client';

import DashboardPage from '@/app/dashboard/page';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter, useSearchParams } from 'next/navigation';
import { Suspense, useEffect, useState } from 'react';

function ChatPageContent() {
  const [isLoading, setIsLoading] = useState(true);
  const { user, loading } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();
  const q = searchParams.get('q');

  useEffect(() => {
    // Check authentication
    if (!loading && !user) {
      router.push('/auth');
      return;
    }

    // Simulate minimal loading time for better UX
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 100);

    // Only prefill, do not auto-send. ChatInterface listens for this event
    if (q && q.trim()) {
      window.dispatchEvent(
        new CustomEvent('chat:initiate-query', { detail: { query: q.trim() } })
      );
    }

    return () => clearTimeout(timer);
  }, [q, user, loading, router]);

  if (isLoading) {
    return (
      <div className='min-h-screen bg-background flex items-center justify-center'>
        <div className='flex items-center space-x-2'>
          <div className='w-4 h-4 bg-primary rounded-full animate-pulse'></div>
          <div
            className='w-4 h-4 bg-primary rounded-full animate-pulse'
            style={{ animationDelay: '0.1s' }}
          ></div>
          <div
            className='w-4 h-4 bg-primary rounded-full animate-pulse'
            style={{ animationDelay: '0.2s' }}
          ></div>
        </div>
      </div>
    );
  }

  return <DashboardPage />;
}

export default function ChatPage() {
  return (
    <Suspense
      fallback={
        <div className='min-h-screen bg-background flex items-center justify-center'>
          <div className='flex items-center space-x-2'>
            <div className='w-4 h-4 bg-primary rounded-full animate-pulse'></div>
            <div
              className='w-4 h-4 bg-primary rounded-full animate-pulse'
              style={{ animationDelay: '0.1s' }}
            ></div>
            <div
              className='w-4 h-4 bg-primary rounded-full animate-pulse'
              style={{ animationDelay: '0.2s' }}
            ></div>
          </div>
        </div>
      }
    >
      <ChatPageContent />
    </Suspense>
  );
}
