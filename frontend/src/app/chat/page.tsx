'use client';

import DashboardPage from '@/app/dashboard/page';
import { useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';

export default function ChatPage() {
  const [isLoading, setIsLoading] = useState(true);
  const searchParams = useSearchParams();
  const q = searchParams.get('q');

  useEffect(() => {
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
  }, [q]);

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
