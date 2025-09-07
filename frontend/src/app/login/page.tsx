'use client';

import { PhoneAuthForm } from '@/components/auth/forms/PhoneAuthForm';
import { Button } from '@/components/ui/buttons/button';
import {
  ResponsiveContainer,
  ResponsiveImage,
} from '@/components/ui/responsive-container';
import { motion } from 'framer-motion';
import { ArrowLeft } from 'lucide-react';
import { useRouter } from 'next/navigation';

export default function LoginPage() {
  const router = useRouter();

  const handleBackToHome = () => {
    router.push('/');
  };

  const handleModeChange = (mode: 'login' | 'signup') => {
    if (mode === 'signup') {
      router.push('/signup');
    }
  };

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
              <ResponsiveImage
                src='/owl-ai-logo.png'
                alt='Owl AI - Your Personal AI Study Partner'
                className='w-8 h-8'
                loading='eager'
                priority={true}
              />
              <span>Owl AI</span>
            </motion.a>
          </div>
        </ResponsiveContainer>
      </motion.header>

      {/* Main Content */}
      <div className='relative z-10 flex items-center justify-center min-h-[calc(100vh-80px)] p-4'>
        <ResponsiveContainer maxWidth='md' padding='none'>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className='w-full max-w-md mx-auto'
          >
            {/* Auth Card */}
            <div className='bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border border-white/20 p-8'>
              <PhoneAuthForm
                mode='login'
                onModeChange={handleModeChange}
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
                By continuing, you agree to our{' '}
                <a href='#' className='text-primary hover:underline'>
                  Terms of Service
                </a>{' '}
                and{' '}
                <a href='#' className='text-primary hover:underline'>
                  Privacy Policy
                </a>
              </p>
            </motion.div>
          </motion.div>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
