'use client';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { cn } from '@/lib/utils';
import { motion } from 'framer-motion';
import { ArrowLeft, Smartphone } from 'lucide-react';
import { useState } from 'react';

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
  const [phoneNumber, setPhoneNumber] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [otpSent, setOtpSent] = useState(false);
  const [otp, setOtp] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));

    if (!otpSent) {
      setOtpSent(true);
    } else {
      // Handle OTP verification
      console.log('OTP verified:', otp);
    }

    setIsLoading(false);
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
              We'll send you a verification code via SMS
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
              Didn't receive the code?{' '}
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
    </motion.form>
  );
}
