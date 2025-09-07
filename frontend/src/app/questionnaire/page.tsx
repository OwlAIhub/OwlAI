'use client';

import { QuestionnaireContainer } from '@/components/auth/QuestionnaireContainer';
import { Button } from '@/components/ui/button';
import { ResponsiveContainer } from '@/components/ui/responsive-container';
import { QuestionnaireData, getAuthUser, setAuthUser } from '@/lib/auth';
import { motion } from 'framer-motion';
import { ArrowLeft } from 'lucide-react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

export default function QuestionnairePage() {
  const router = useRouter();
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  const handleBackToHome = () => {
    router.push('/');
  };

  const handleQuestionnaireComplete = (data: QuestionnaireData) => {
    // Update user data with questionnaire responses
    if (typeof window !== 'undefined') {
      const currentUser = getAuthUser();
      if (currentUser) {
        const updatedUser = {
          ...currentUser,
          questionnaireData: data,
          isQuestionnaireComplete: true,
        };

        setAuthUser(updatedUser);
        router.push('/chat');
      }
    }
  };

  // Prevent SSR issues by showing loading state
  if (!isClient) {
    return (
      <div className='min-h-screen bg-gradient-to-br from-background via-background to-primary/5 flex items-center justify-center'>
        <div className='text-center'>
          <div className='animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4'></div>
          <p className='text-muted-foreground'>Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className='min-h-screen bg-gradient-to-br from-background via-background to-primary/5'>
      {/* Background Pattern */}
      <div className='absolute inset-0 opacity-5'>
        <div className='absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_50%_50%,rgba(34,197,94,0.1),transparent_50%)]' />
      </div>

      {/* Header */}
      <motion.header
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5 }}
        className='relative z-10 p-4'
      >
        <ResponsiveContainer maxWidth='6xl' padding='none'>
          <div className='flex items-center justify-between'>
            {/* Back Button */}
            <Button
              variant='ghost'
              size='sm'
              onClick={handleBackToHome}
              className='text-muted-foreground hover:text-foreground'
            >
              <ArrowLeft className='w-4 h-4 mr-2' />
              Back to Home
            </Button>

            {/* Logo */}
            <motion.a
              href='/'
              className='flex items-center space-x-2 text-lg font-bold text-foreground'
              whileHover={{ scale: 1.05 }}
              transition={{ duration: 0.2 }}
            >
              <Image
                src='/owl-ai-logo.png'
                alt='Owl AI - Your Personal AI Study Partner'
                width={32}
                height={32}
                className='w-8 h-8'
                priority={true}
              />
              <span>Owl AI</span>
            </motion.a>
          </div>
        </ResponsiveContainer>
      </motion.header>

      {/* Main Content */}
      <div className='relative z-10 flex items-center justify-center min-h-[calc(100vh-80px)] p-4'>
        <ResponsiveContainer maxWidth='4xl' padding='none'>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className='w-full'
          >
            {/* Questionnaire Card */}
            <div className='bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border border-white/20 p-6'>
              <QuestionnaireContainer
                onComplete={handleQuestionnaireComplete}
                onBack={handleBackToHome}
              />
            </div>

            {/* Footer Text */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.8 }}
              className='text-center mt-8'
            >
              <p className='text-sm text-muted-foreground'>
                Help us personalize your learning experience
              </p>
            </motion.div>
          </motion.div>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
