'use client';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { getAuthUser, setAuthUser } from '@/lib/auth';
import { auth } from '@/lib/firebase';
import { cn } from '@/lib/utils';
import {
  ConfirmationResult,
  RecaptchaVerifier,
  signInWithPhoneNumber,
} from 'firebase/auth';
import { motion } from 'framer-motion';
import { ArrowLeft, Smartphone } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

// Extend Window interface for reCAPTCHA
declare global {
  interface Window {
    recaptchaVerifier: RecaptchaVerifier;
  }
}

interface PhoneAuthFormProps {
  mode: 'login' | 'signup';
  onModeChange: (mode: 'login' | 'signup') => void;
  onBack?: () => void;
  className?: string;
}

export function PhoneAuthForm({
  className,
  mode,
  onModeChange,
  onBack,
}: PhoneAuthFormProps) {
  const router = useRouter();
  const [phoneNumber, setPhoneNumber] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [otpSent, setOtpSent] = useState(false);
  const [otp, setOtp] = useState('');
  const [confirmationResult, setConfirmationResult] =
    useState<ConfirmationResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  // Setup reCAPTCHA (invisible) - only for real phone numbers
  useEffect(() => {
    if (typeof window !== 'undefined') {
      // Only setup reCAPTCHA for real phone numbers (not test numbers)
      if (phoneNumber && phoneNumber !== '+91 98765 43210') {
        try {
          window.recaptchaVerifier = new RecaptchaVerifier(
            auth,
            'recaptcha-container',
            {
              size: 'invisible',
              callback: () => {
                console.log('reCAPTCHA verified for real number');
              },
              'expired-callback': () => {
                console.log('reCAPTCHA expired');
              },
            }
          );
          console.log('reCAPTCHA setup for real number:', phoneNumber);
        } catch (error) {
          console.error('reCAPTCHA setup failed:', error);
          // Don't throw error, let the user try anyway
        }
      } else {
        console.log('Test number detected, skipping reCAPTCHA setup');
      }
    }
  }, [phoneNumber]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null); // Clear previous errors

    try {
      if (!otpSent) {
        // Step 1: Send OTP to phone number
        if (phoneNumber === '+91 98765 43210') {
          // Test number - simulate OTP sending
          console.log('Test mode: Simulating OTP send to:', phoneNumber);
          setOtpSent(true);
        } else {
          // Real number - use Firebase with reCAPTCHA
          try {
            const appVerifier = window.recaptchaVerifier;
            if (!appVerifier) {
              throw new Error('reCAPTCHA not initialized');
            }

            const confirmation = await signInWithPhoneNumber(
              auth,
              phoneNumber,
              appVerifier
            );

            setConfirmationResult(confirmation);
            setOtpSent(true);
            console.log('Real OTP sent to:', phoneNumber);
          } catch (error) {
            console.error('Failed to send OTP:', error);
            if (
              error instanceof Error &&
              (error.message.includes('reCAPTCHA') ||
                error.message.includes('site key'))
            ) {
              setError(
                'reCAPTCHA configuration issue. Please try again or contact support.'
              );
            } else {
              setError(
                'Failed to send OTP. Please check your phone number and try again.'
              );
            }
          }
        }
      } else {
        // Step 2: Verify OTP
        if (phoneNumber === '+91 98765 43210') {
          // Test number - simulate OTP verification
          console.log(
            'Test mode: Simulating OTP verification for:',
            phoneNumber
          );

          // Check if user already exists and has completed questionnaire
          const existingUser = getAuthUser();
          const isNewUser =
            !existingUser || existingUser.phoneNumber !== phoneNumber;

          setAuthUser({
            id: `user_${Date.now()}`,
            phoneNumber: phoneNumber,
            isAuthenticated: true,
            isQuestionnaireComplete:
              existingUser?.isQuestionnaireComplete || false,
          });

          // Only show questionnaire for new users or users who haven't completed it
          if (isNewUser || !existingUser?.isQuestionnaireComplete) {
            router.push('/questionnaire');
          } else {
            router.push('/chat');
          }
        } else {
          // Real number - use Firebase verification
          if (confirmationResult) {
            try {
              const result = await confirmationResult.confirm(otp);
              const user = result.user;

              console.log('Real user authenticated:', user.phoneNumber);

              // Check if user already exists and has completed questionnaire
              const existingUser = getAuthUser();
              const isNewUser =
                !existingUser ||
                existingUser.phoneNumber !== (user.phoneNumber || phoneNumber);

              setAuthUser({
                id: user.uid,
                phoneNumber: user.phoneNumber || phoneNumber,
                isAuthenticated: true,
                isQuestionnaireComplete:
                  existingUser?.isQuestionnaireComplete || false,
              });

              // Only show questionnaire for new users or users who haven't completed it
              if (isNewUser || !existingUser?.isQuestionnaireComplete) {
                router.push('/questionnaire');
              } else {
                router.push('/chat');
              }
            } catch (error) {
              console.error('OTP verification failed:', error);
              setError('Invalid OTP. Please check the code and try again.');
            }
          }
        }
      }
    } catch (error) {
      console.error('Authentication error:', error);
      // You can add error handling UI here
    } finally {
      setIsLoading(false);
    }
  };

  const handleBack = () => {
    if (otpSent) {
      setOtpSent(false);
      setOtp('');
    } else if (onBack) {
      onBack();
    }
  };

  return (
    <motion.form
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className={cn('flex flex-col gap-6', className)}
      onSubmit={handleSubmit}
    >
      {/* Header */}
      <div className='flex flex-col items-center gap-2 text-center'>
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}
          className='w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mb-4'
        >
          <Smartphone className='w-8 h-8 text-primary' />
        </motion.div>

        <h1 className='text-2xl font-bold text-foreground'>
          {otpSent
            ? 'Verify your phone'
            : `${mode === 'login' ? 'Login' : 'Sign up'} with phone`}
        </h1>
        <p className='text-muted-foreground text-sm text-balance max-w-sm'>
          {otpSent
            ? `Enter the 6-digit code sent to ${phoneNumber}`
            : 'Enter your phone number to get started'}
        </p>
      </div>

      {/* Back Button */}
      {(otpSent || onBack) && (
        <Button
          type='button'
          variant='ghost'
          size='sm'
          onClick={handleBack}
          className='self-start -ml-2 text-muted-foreground hover:text-foreground'
        >
          <ArrowLeft className='w-4 h-4 mr-2' />
          Back
        </Button>
      )}

      {/* Error Message */}
      {error && (
        <div className='p-3 bg-red-50 border border-red-200 rounded-lg'>
          <p className='text-sm text-red-600'>{error}</p>
        </div>
      )}

      {/* Form Fields */}
      <div className='grid gap-6'>
        {!otpSent ? (
          <div className='grid gap-3'>
            <Label htmlFor='phone' className='text-sm font-medium'>
              Phone Number
            </Label>
            <Input
              id='phone'
              type='tel'
              placeholder='+91 98765 43210'
              value={phoneNumber}
              onChange={e => setPhoneNumber(e.target.value)}
              required
              className='h-12 text-base'
            />
            <p className='text-xs text-muted-foreground'>
              We&apos;ll send you a verification code via SMS
            </p>
          </div>
        ) : (
          <div className='grid gap-3'>
            <Label htmlFor='otp' className='text-sm font-medium'>
              Verification Code
            </Label>
            <Input
              id='otp'
              type='text'
              placeholder='123456'
              value={otp}
              onChange={e =>
                setOtp(e.target.value.replace(/\D/g, '').slice(0, 6))
              }
              required
              className='h-12 text-center text-2xl tracking-widest'
              maxLength={6}
            />
            <p className='text-xs text-muted-foreground text-center'>
              Did not receive the code?{' '}
              <button
                type='button'
                className='text-primary hover:underline'
                onClick={() => {
                  // Resend OTP logic
                  console.log('Resending OTP to:', phoneNumber);
                }}
              >
                Resend
              </button>
            </p>
          </div>
        )}

        <Button
          type='submit'
          className='w-full h-12 bg-primary hover:bg-primary/90 text-white font-medium'
          disabled={
            isLoading ||
            (!otpSent && !phoneNumber) ||
            (otpSent && otp.length !== 6)
          }
        >
          {isLoading ? (
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
              className='w-5 h-5 border-2 border-white border-t-transparent rounded-full'
            />
          ) : otpSent ? (
            'Verify & Continue'
          ) : (
            `Send ${mode === 'login' ? 'Login' : 'Verification'} Code`
          )}
        </Button>
      </div>

      {/* Mode Toggle */}
      {!otpSent && (
        <div className='text-center text-sm'>
          {mode === 'login'
            ? "Don't have an account? "
            : 'Already have an account? '}
          <button
            type='button'
            className='text-primary hover:underline font-medium'
            onClick={() => onModeChange(mode === 'login' ? 'signup' : 'login')}
          >
            {mode === 'login' ? 'Sign up' : 'Login'}
          </button>
        </div>
      )}

      {/* reCAPTCHA container (invisible) */}
      <div id='recaptcha-container'></div>
    </motion.form>
  );
}
