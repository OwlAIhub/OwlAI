'use client';

import { Button } from '@/components/ui/buttons/button';
import { Input } from '@/components/ui/inputs/input';
import { Label } from '@/components/ui/inputs/label';
import { motion } from 'framer-motion';
import { Phone, ArrowRight, Check, Loader2 } from 'lucide-react';
import { useState } from 'react';

interface PhoneAuthFormProps {
  mode: 'login' | 'signup';
}

export function PhoneAuthForm({ mode }: PhoneAuthFormProps) {
  const [phoneNumber, setPhoneNumber] = useState('');
  const [otp, setOtp] = useState('');
  const [step, setStep] = useState<'phone' | 'otp'>('phone');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handlePhoneSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    
    if (!phoneNumber.trim()) {
      setError('Please enter your phone number');
      return;
    }
    
    // Basic phone validation
    const phoneRegex = /^[+]?[1-9]\d{1,14}$/;
    if (!phoneRegex.test(phoneNumber.replace(/\s/g, ''))) {
      setError('Please enter a valid phone number');
      return;
    }
    
    setLoading(true);
    
    try {
      // Simulate API call for sending OTP
      await new Promise(resolve => setTimeout(resolve, 1500));
      setStep('otp');
    } catch (err) {
      setError('Failed to send OTP. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleOtpSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    
    if (!otp.trim() || otp.length !== 6) {
      setError('Please enter the 6-digit OTP');
      return;
    }
    
    setLoading(true);
    
    try {
      // Simulate OTP verification
      await new Promise(resolve => setTimeout(resolve, 1500));
      // Redirect to dashboard or home
      window.location.href = '/';
    } catch (err) {
      setError('Invalid OTP. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleResendOtp = async () => {
    setError(null);
    setLoading(true);
    
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      // Show success message or handle resend logic
    } catch (err) {
      setError('Failed to resend OTP');
    } finally {
      setLoading(false);
    }
  };

  if (step === 'phone') {
    return (
      <form onSubmit={handlePhoneSubmit} className='space-y-6'>
        {/* Phone Input */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.4 }}
          className='space-y-2'
        >
          <Label htmlFor='phone' className='text-sm font-medium text-foreground'>
            Phone Number
          </Label>
          <div className='relative'>
            <Phone className='absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground' />
            <Input
              id='phone'
              type='tel'
              value={phoneNumber}
              onChange={(e) => setPhoneNumber(e.target.value)}
              placeholder='+91 98765 43210'
              className='pl-10 h-12 text-base'
              disabled={loading}
              required
            />
          </div>
        </motion.div>

        {/* Error Message */}
        {error && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className='p-3 bg-red-50 border border-red-200 rounded-lg text-red-800 text-sm'
          >
            {error}
          </motion.div>
        )}

        {/* Submit Button */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.1 }}
        >
          <Button
            type='submit'
            disabled={loading}
            className='w-full h-12 text-base font-medium'
          >
            {loading ? (
              <>
                <Loader2 className='w-4 h-4 mr-2 animate-spin' />
                Sending OTP...
              </>
            ) : (
              <>
                Send OTP
                <ArrowRight className='w-4 h-4 ml-2' />
              </>
            )}
          </Button>
        </motion.div>

        {/* Info Text */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.4, delay: 0.2 }}
          className='text-xs text-muted-foreground text-center'
        >
          We&apos;ll send you a verification code to confirm your number
        </motion.p>
      </form>
    );
  }

  return (
    <form onSubmit={handleOtpSubmit} className='space-y-6'>
      {/* Back to Phone */}
      <motion.button
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        type='button'
        onClick={() => setStep('phone')}
        className='flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors'
      >
        <ArrowRight className='w-4 h-4 rotate-180' />
        Change phone number
      </motion.button>

      {/* Phone Display */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className='text-center p-4 bg-gray-50 rounded-lg'
      >
        <p className='text-sm text-muted-foreground mb-1'>OTP sent to</p>
        <p className='font-medium text-foreground'>{phoneNumber}</p>
      </motion.div>

      {/* OTP Input */}
      <motion.div
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.4, delay: 0.1 }}
        className='space-y-2'
      >
        <Label htmlFor='otp' className='text-sm font-medium text-foreground'>
          Verification Code
        </Label>
        <Input
          id='otp'
          type='text'
          value={otp}
          onChange={(e) => setOtp(e.target.value.replace(/\D/g, '').slice(0, 6))}
          placeholder='123456'
          className='h-12 text-base text-center tracking-widest'
          disabled={loading}
          maxLength={6}
          required
        />
      </motion.div>

      {/* Error Message */}
      {error && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className='p-3 bg-red-50 border border-red-200 rounded-lg text-red-800 text-sm'
        >
          {error}
        </motion.div>
      )}

      {/* Submit Button */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.2 }}
      >
        <Button
          type='submit'
          disabled={loading}
          className='w-full h-12 text-base font-medium'
        >
          {loading ? (
            <>
              <Loader2 className='w-4 h-4 mr-2 animate-spin' />
              Verifying...
            </>
          ) : (
            <>
              <Check className='w-4 h-4 mr-2' />
              Verify & {mode === 'login' ? 'Sign In' : 'Sign Up'}
            </>
          )}
        </Button>
      </motion.div>

      {/* Resend OTP */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.4, delay: 0.3 }}
        className='text-center'
      >
        <button
          type='button'
          onClick={handleResendOtp}
          disabled={loading}
          className='text-sm text-primary hover:text-primary/80 font-medium transition-colors disabled:opacity-50'
        >
          Didn&apos;t receive code? Resend
        </button>
      </motion.div>
    </form>
  );
}