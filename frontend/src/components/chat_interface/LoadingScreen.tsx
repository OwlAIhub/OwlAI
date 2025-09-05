'use client';

import { motion } from 'framer-motion';
import { MessageSquare } from 'lucide-react';

interface LoadingScreenProps {
  isLoading: boolean;
  children: React.ReactNode;
}

export function LoadingScreen({ isLoading, children }: LoadingScreenProps) {
  if (!isLoading) {
    return <>{children}</>;
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
      className='min-h-screen bg-background flex items-center justify-center'
    >
      <div className='flex flex-col items-center space-y-4'>
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className='w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center'
        >
          <MessageSquare className='w-8 h-8 text-primary' />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className='text-center'
        >
          <h2 className='text-lg font-semibold text-foreground mb-2'>OWL AI</h2>
          <p className='text-sm text-muted-foreground'>
            Loading your intelligent study partner...
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className='flex space-x-1'
        >
          <div className='w-2 h-2 bg-primary rounded-full animate-bounce' />
          <div
            className='w-2 h-2 bg-primary rounded-full animate-bounce'
            style={{ animationDelay: '0.1s' }}
          />
          <div
            className='w-2 h-2 bg-primary rounded-full animate-bounce'
            style={{ animationDelay: '0.2s' }}
          />
        </motion.div>
      </div>
    </motion.div>
  );
}
