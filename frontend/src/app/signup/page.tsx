'use client';

import { PhoneAuthForm } from '@/components/auth/PhoneAuthForm';
import { motion } from 'framer-motion';
import { ArrowLeft, UserPlus } from 'lucide-react';
import Link from 'next/link';
import { ResponsiveContainer } from '@/components/ui/responsive-container';

export default function SignupPage() {
  return (
    <div className='min-h-screen bg-gradient-to-br from-gray-50 via-gray-100 to-gray-200 flex items-center justify-center p-4'>
      {/* Background Pattern */}
      <div className='absolute inset-0 bg-[linear-gradient(rgba(0,0,0,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(0,0,0,0.03)_1px,transparent_1px)] bg-[size:20px_20px] md:bg-[size:30px_30px]' />

      {/* Decorative Blurs */}
      <div className='absolute top-1/4 left-1/4 w-32 h-32 md:w-64 md:h-64 bg-primary/3 rounded-full blur-2xl' />
      <div className='absolute bottom-1/4 right-1/4 w-32 h-32 md:w-64 md:h-64 bg-accent/3 rounded-full blur-2xl' />

      <ResponsiveContainer maxWidth='md' className='relative z-10'>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className='w-full max-w-md mx-auto'
        >
          {/* Back Button */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.4, delay: 0.1 }}
            className='mb-6'
          >
            <Link
              href='/'
              className='inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors'
            >
              <ArrowLeft className='w-4 h-4' />
              Back to Home
            </Link>
          </motion.div>

          {/* Auth Card */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className='bg-white/95 backdrop-blur-md rounded-2xl shadow-xl border border-white/20 p-8'
          >
            {/* Header */}
            <div className='text-center mb-8'>
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: 0.3 }}
                className='flex items-center justify-center mb-4'
              >
                <div className='p-3 bg-primary/10 rounded-full'>
                  <UserPlus className='w-6 h-6 text-primary' />
                </div>
              </motion.div>

              <motion.h1
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: 0.4 }}
                className='text-2xl font-bold text-foreground mb-2'
              >
                Create Account
              </motion.h1>

              <motion.p
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: 0.5 }}
                className='text-muted-foreground'
              >
                Join thousands of learners and start your AI-powered study journey
              </motion.p>
            </div>

            {/* Phone Auth Form */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.6 }}
            >
              <PhoneAuthForm mode='signup' />
            </motion.div>

            {/* Terms */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.4, delay: 0.7 }}
              className='mt-6 text-center'
            >
              <p className='text-xs text-muted-foreground'>
                By signing up, you agree to our{' '}
                <Link href='#' className='text-primary hover:text-primary/80 font-medium'>
                  Terms of Service
                </Link>{' '}
                and{' '}
                <Link href='#' className='text-primary hover:text-primary/80 font-medium'>
                  Privacy Policy
                </Link>
              </p>
            </motion.div>

            {/* Footer */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.4, delay: 0.8 }}
              className='mt-8 text-center'
            >
              <p className='text-sm text-muted-foreground'>
                Already have an account?{' '}
                <Link
                  href='/login'
                  className='text-primary hover:text-primary/80 font-medium transition-colors'
                >
                  Sign in
                </Link>
              </p>
            </motion.div>
          </motion.div>

          {/* Features Preview */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.9 }}
            className='mt-8 grid grid-cols-2 gap-4 text-center'
          >
            <div className='p-4 bg-white/50 backdrop-blur-sm rounded-xl border border-white/20'>
              <div className='text-2xl font-bold text-primary mb-1'>24/7</div>
              <div className='text-xs text-muted-foreground'>AI Support</div>
            </div>
            <div className='p-4 bg-white/50 backdrop-blur-sm rounded-xl border border-white/20'>
              <div className='text-2xl font-bold text-primary mb-1'>10+</div>
              <div className='text-xs text-muted-foreground'>Exam Types</div>
            </div>
          </motion.div>
        </motion.div>
      </ResponsiveContainer>
    </div>
  );
}
