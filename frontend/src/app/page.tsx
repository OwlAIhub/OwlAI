'use client';
import { useAuth } from '@/components/auth/providers/AuthProvider';
import MainPage from '@/components/sections/mainpage';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

export default function Home() {
  const { isAuthenticated } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (isAuthenticated) router.replace('/chat');
  }, [isAuthenticated, router]);

  return <MainPage />;
}
