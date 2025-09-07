'use client';

import { Button } from '@/components/ui/buttons/button';
import { Input } from '@/components/ui/inputs/input';
import { Label } from '@/components/ui/inputs/label';
import { getAuthUser, setAuthUser } from '@/lib/auth';
import { createUserProfile } from '@/lib/database/users';
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
    recaptchaVerifier?: RecaptchaVerifier;
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
  // Removed unused retryCount state

  // Initialize reCAPTCHA
  useEffect(() => {
    if (typeof window === 'undefined') return;

    // Clear existing verifier
    if (window.recaptchaVerifier) {
      try {
        window.recaptchaVerifier.clear();
      } catch (error) {
        console.warn('Error clearing existing reCAPTCHA:', error);
      }
    }

    // Create new verifier
    try {
      window.recaptchaVerifier = new RecaptchaVerifier(
        auth,
        'recaptcha-container',
        {
          size: 'invisible',
          callback: () => {
            console.log('reCAPTCHA solved');
          },
          'expired-callback': () => {
            console.log('reCAPTCHA expired');
            setError('reCAPTCHA expired. Please try again.');
          },
        }
      );
    } catch (error) {
      console.error('Error initializing reCAPTCHA:', error);
    }

    return () => {
      if (window.recaptchaVerifier) {
        try {
          window.recaptchaVerifier.clear();
        } catch (error) {
          console.warn('Error clearing reCAPTCHA on unmount:', error);
        }
        window.recaptchaVerifier = undefined;
      }
    };
  }, [phoneNumber]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

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

            console.log('Sending OTP to:', phoneNumber);
            const confirmation = await signInWithPhoneNumber(
              auth,
              phoneNumber,
              appVerifier
            );

            console.log('OTP sent successfully');
            setConfirmationResult(confirmation);
            setOtpSent(true);
          } catch (error) {
            console.error('Failed to send OTP:', error);
            if (error instanceof Error) {
              if (error.message.includes('reCAPTCHA')) {
                setError(
                  'reCAPTCHA configuration issue. Please refresh and try again.'
                );
              } else if (error.message.includes('quota')) {
                setError('Daily limit reached. Please try again tomorrow.');
              } else if (error.message.includes('invalid-phone-number')) {
                setError(
                  'Invalid phone number format. Please check and try again.'
                );
              } else {
                setError(
                  'Failed to send OTP. Please check your phone number and try again.'
                );
              }
            } else {
              setError('Failed to send OTP. Please try again.');
            }
          }
        }
      } else {
        // Step 2: Verify OTP
        if (phoneNumber === '+91 98765 43210') {
          // Test number - simulate OTP verification
          console.log('Test mode: Simulating OTP verification');

          // Check if user already exists locally
          const existingUser = getAuthUser();
          const isExistingUser =
            existingUser && existingUser.phoneNumber === phoneNumber;

          if (isExistingUser) {
            // User already exists
            if (mode === 'signup') {
              setError(
                'This phone number is already registered. Please log in instead.'
              );
              setOtpSent(false);
              setOtp('');
              return;
            } else {
              // Login mode - existing user can proceed
              setAuthUser({
                ...existingUser,
                isAuthenticated: true,
              });

              // Check if user needs to complete questionnaire
              if (!existingUser.onboardingCompleted) {
                router.push('/questionnaire');
              } else {
                router.push('/chat');
              }
              return;
            }
          }

          // New user
          if (mode === 'login') {
            setError(
              'This phone number is not registered. Please sign up first.'
            );
            setOtpSent(false);
            setOtp('');
            return;
          } else {
            // Signup mode - create new account
            const userId = `user_${Date.now()}`;
            const newUser = {
              id: userId,
              phoneNumber: phoneNumber,
              isAuthenticated: true,
              createdAt: new Date(),
              lastLoginAt: new Date(),
              onboardingCompleted: false, // New users need to complete questionnaire
            };

            // Create user profile in Firestore for test numbers too
            await createUserProfile(
              userId,
              phoneNumber,
              'User' // Default name, will be updated in questionnaire
            );
            console.log('Test user profile created in Firestore');

            setAuthUser(newUser);
            router.push('/questionnaire');
          }
        } else {
          // Real number - use Firebase verification
          if (confirmationResult) {
            try {
              console.log('Verifying OTP:', otp);
              const result = await confirmationResult.confirm(otp);
              const user = result.user;

              console.log('User authenticated successfully:', user.phoneNumber);

              // Check if user already exists locally
              const existingUser = getAuthUser();
              const isExistingUser =
                existingUser && existingUser.phoneNumber === user.phoneNumber;

              if (isExistingUser) {
                // User already exists
                if (mode === 'signup') {
                  setError(
                    'This phone number is already registered. Please log in instead.'
                  );
                  setOtpSent(false);
                  setOtp('');
                  return;
                } else {
                  // Login mode - existing user can proceed
                  setAuthUser({
                    ...existingUser,
                    isAuthenticated: true,
                  });

                  // Check if user needs to complete questionnaire
                  if (!existingUser.onboardingCompleted) {
                    router.push('/questionnaire');
                  } else {
                    router.push('/chat');
                  }
                  return;
                }
              }

              // New user
              if (mode === 'login') {
                setError(
                  'This phone number is not registered. Please sign up first.'
                );
                setOtpSent(false);
                setOtp('');
                return;
              } else {
                // Signup mode - create new account
                const newUser = {
                  id: user.uid,
                  phoneNumber: user.phoneNumber || phoneNumber,
                  isAuthenticated: true,
                  createdAt: new Date(),
                  lastLoginAt: new Date(),
                  onboardingCompleted: false, // New users need to complete questionnaire
                };

                // Create user profile in Firestore
                await createUserProfile(
                  user.uid,
                  user.phoneNumber || phoneNumber,
                  'User' // Default name, will be updated in questionnaire
                );
                console.log('User profile created in Firestore');

                setAuthUser(newUser);
                router.push('/questionnaire');
              }
            } catch (error) {
              console.error('Failed to verify OTP:', error);
              if (error instanceof Error) {
                if (error.message.includes('invalid-verification-code')) {
                  setError('Invalid OTP. Please check and try again.');
                } else if (error.message.includes('code-expired')) {
                  setError('OTP expired. Please request a new one.');
                } else {
                  setError('Failed to verify OTP. Please try again.');
                }
              } else {
                setError('Failed to verify OTP. Please try again.');
              }
            }
          } else {
            setError('OTP verification failed. Please try again.');
          }
        }
      }
    } catch (error) {
      console.error('Authentication error:', error);
      setError('An unexpected error occurred. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleBack = () => {
    if (otpSent) {
      setOtpSent(false);
      setOtp('');
      setError(null);
    } else if (onBack) {
      onBack();
    }
  };

  const formatPhoneNumber = (value: string) => {
    // Remove all non-digits
    const digits = value.replace(/\D/g, '');

    // Add +91 prefix if not present
    if (digits.length > 0 && !digits.startsWith('91')) {
      return '+91 ' + digits;
    } else if (digits.startsWith('91')) {
      return '+91 ' + digits.substring(2);
    }

    return value;
  };

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formatted = formatPhoneNumber(e.target.value);
    setPhoneNumber(formatted);
  };

  return (
    <div className={cn('w-full max-w-md mx-auto', className)}>
      <form onSubmit={handleSubmit} className='space-y-6'>
        {/* Header */}
        <div className='text-center space-y-2'>
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.3 }}
            className='flex items-center justify-center w-16 h-16 mx-auto bg-primary/10 rounded-full'
          >
            <Smartphone className='w-8 h-8 text-primary' />
          </motion.div>
          <motion.h2
            initial={{ y: 10, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.3, delay: 0.1 }}
            className='text-2xl font-bold text-foreground'
          >
            {mode === 'login' ? 'Welcome Back' : 'Get Started'}
          </motion.h2>
          <motion.p
            initial={{ y: 10, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.3, delay: 0.2 }}
            className='text-muted-foreground'
          >
            {mode === 'login'
              ? 'Enter your phone number to sign in'
              : 'Enter your phone number to create an account'}
          </motion.p>
        </div>

        {/* Error Message */}
        {error && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className='p-3 bg-red-50 border border-red-200 rounded-lg'
          >
            <p className='text-red-600 text-sm text-center'>{error}</p>
          </motion.div>
        )}

        {/* Phone Number Input */}
        {!otpSent && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.3 }}
            className='space-y-2'
          >
            <Label htmlFor='phone' className='text-sm font-medium'>
              Phone Number
            </Label>
            <Input
              id='phone'
              type='tel'
              placeholder='+91 98765 43210'
              value={phoneNumber}
              onChange={handlePhoneChange}
              className='w-full'
              required
              disabled={isLoading}
            />
            <p className='text-xs text-muted-foreground'>
              We&apos;ll send you a verification code
            </p>
          </motion.div>
        )}

        {/* OTP Input */}
        {otpSent && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className='space-y-2'
          >
            <Label htmlFor='otp' className='text-sm font-medium'>
              Verification Code
            </Label>
            <Input
              id='otp'
              type='text'
              placeholder='Enter 6-digit code'
              value={otp}
              onChange={e =>
                setOtp(e.target.value.replace(/\D/g, '').slice(0, 6))
              }
              className='w-full text-center text-lg tracking-widest'
              required
              disabled={isLoading}
            />
            <p className='text-xs text-muted-foreground text-center'>
              Enter the code sent to {phoneNumber}
            </p>
          </motion.div>
        )}

        {/* Submit Button */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.4 }}
        >
          <Button
            type='submit'
            className='w-full'
            disabled={isLoading || (otpSent && otp.length !== 6)}
          >
            {isLoading ? (
              <div className='flex items-center space-x-2'>
                <div className='w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin' />
                <span>{otpSent ? 'Verifying...' : 'Sending...'}</span>
              </div>
            ) : otpSent ? (
              'Verify Code'
            ) : (
              'Send Code'
            )}
          </Button>
        </motion.div>

        {/* Back Button */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3, delay: 0.5 }}
          className='text-center'
        >
          <Button
            type='button'
            variant='ghost'
            size='sm'
            onClick={handleBack}
            className='text-muted-foreground hover:text-foreground'
          >
            <ArrowLeft className='w-4 h-4 mr-2' />
            {otpSent ? 'Change Number' : 'Back'}
          </Button>
        </motion.div>

        {/* Mode Switch */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3, delay: 0.6 }}
          className='text-center text-sm'
        >
          <span className='text-muted-foreground'>
            {mode === 'login'
              ? "Don't have an account? "
              : 'Already have an account? '}
          </span>
          <button
            type='button'
            onClick={() => onModeChange(mode === 'login' ? 'signup' : 'login')}
            className='text-primary hover:underline font-medium'
          >
            {mode === 'login' ? 'Sign up' : 'Sign in'}
          </button>
        </motion.div>
      </form>

      {/* reCAPTCHA Container */}
      <div id='recaptcha-container' className='hidden' />
    </div>
  );
}
