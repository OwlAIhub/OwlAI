'use client';

import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { auth, createRecaptchaVerifier } from '@/lib/firebase';
import {
  PhoneAuthProvider,
  signInWithCredential,
  signInWithPhoneNumber,
} from 'firebase/auth';
import { ArrowLeft, Phone, Shield } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

export default function AuthPage() {
  const [phoneNumber, setPhoneNumber] = useState('');
  const [verificationCode, setVerificationCode] = useState('');
  const [step, setStep] = useState<'phone' | 'verify'>('phone');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [verificationId, setVerificationId] = useState('');
  const router = useRouter();

  useEffect(() => {
    // Create reCAPTCHA verifier for Enterprise
    const verifier = createRecaptchaVerifier('recaptcha-container');
    verifier.render();
    return () => {
      verifier.clear();
    };
  }, []);

  const handleSendCode = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!phoneNumber.trim()) {
      setError('Please enter a valid phone number');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const appVerifier = createRecaptchaVerifier('recaptcha-container');
      const confirmationResult = await signInWithPhoneNumber(
        auth,
        phoneNumber,
        appVerifier
      );
      setVerificationId(confirmationResult.verificationId);
      setStep('verify');
    } catch (error: unknown) {
      let errorMessage = 'Failed to send verification code';

      if (error instanceof Error) {
        if (error.message.includes('reCAPTCHA')) {
          errorMessage = 'reCAPTCHA verification failed. Please try again.';
        } else if (error.message.includes('invalid-phone-number')) {
          errorMessage = 'Please enter a valid phone number.';
        } else {
          errorMessage = error.message;
        }
      }

      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyCode = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!verificationCode.trim()) {
      setError('Please enter the verification code');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const credential = PhoneAuthProvider.credential(
        verificationId,
        verificationCode
      );
      await signInWithCredential(auth, credential);

      // Redirect to chat after successful authentication
      router.push('/chat');
    } catch (error: unknown) {
      setError(
        error instanceof Error ? error.message : 'Invalid verification code'
      );
    } finally {
      setLoading(false);
    }
  };

  const formatPhoneNumber = (value: string) => {
    // Remove all non-digits
    const digits = value.replace(/\D/g, '');

    // Add country code if not present
    if (digits.length > 0 && !digits.startsWith('+')) {
      return `+${digits}`;
    }

    return digits;
  };

  return (
    <div className='min-h-screen bg-gradient-to-br from-teal-50 to-white flex items-center justify-center p-4'>
      <div className='w-full max-w-md'>
        {/* Back Button */}
        <Link
          href='/'
          className='inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground mb-6 transition-colors'
        >
          <ArrowLeft className='w-4 h-4' />
          Back to Home
        </Link>

        <Card className='border-0 shadow-xl'>
          <CardHeader className='text-center pb-6'>
            <div className='mx-auto w-12 h-12 bg-teal-100 rounded-full flex items-center justify-center mb-4'>
              <Shield className='w-6 h-6 text-teal-600' />
            </div>
            <CardTitle className='text-2xl font-bold text-gray-900'>
              {step === 'phone' ? 'Get Started' : 'Verify Phone'}
            </CardTitle>
            <CardDescription className='text-gray-600'>
              {step === 'phone'
                ? 'Enter your phone number to continue with OWL AI'
                : 'Enter the verification code sent to your phone'}
            </CardDescription>
          </CardHeader>

          <CardContent className='space-y-6'>
            {step === 'phone' ? (
              <form onSubmit={handleSendCode} className='space-y-4'>
                <div className='space-y-2'>
                  <label
                    htmlFor='phone'
                    className='text-sm font-medium text-gray-700'
                  >
                    Phone Number
                  </label>
                  <div className='relative'>
                    <Phone className='absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400' />
                    <Input
                      id='phone'
                      type='tel'
                      placeholder='+1 (555) 123-4567'
                      value={phoneNumber}
                      onChange={e =>
                        setPhoneNumber(formatPhoneNumber(e.target.value))
                      }
                      className='pl-10'
                      required
                    />
                  </div>
                </div>

                {error && (
                  <div className='text-sm text-red-600 bg-red-50 p-3 rounded-md'>
                    {error}
                  </div>
                )}

                <Button
                  type='submit'
                  className='w-full bg-teal-600 hover:bg-teal-700 text-white'
                  disabled={loading}
                >
                  {loading ? 'Sending...' : 'Send Verification Code'}
                </Button>
              </form>
            ) : (
              <form onSubmit={handleVerifyCode} className='space-y-4'>
                <div className='space-y-2'>
                  <label
                    htmlFor='code'
                    className='text-sm font-medium text-gray-700'
                  >
                    Verification Code
                  </label>
                  <Input
                    id='code'
                    type='text'
                    placeholder='123456'
                    value={verificationCode}
                    onChange={e =>
                      setVerificationCode(e.target.value.replace(/\D/g, ''))
                    }
                    maxLength={6}
                    className='text-center text-lg tracking-widest'
                    required
                  />
                  <p className='text-xs text-gray-500 text-center'>
                    Code sent to {phoneNumber}
                  </p>
                </div>

                {error && (
                  <div className='text-sm text-red-600 bg-red-50 p-3 rounded-md'>
                    {error}
                  </div>
                )}

                <div className='space-y-3'>
                  <Button
                    type='submit'
                    className='w-full bg-teal-600 hover:bg-teal-700 text-white'
                    disabled={loading}
                  >
                    {loading ? 'Verifying...' : 'Verify & Continue'}
                  </Button>

                  <Button
                    type='button'
                    variant='outline'
                    className='w-full'
                    onClick={() => setStep('phone')}
                    disabled={loading}
                  >
                    Change Phone Number
                  </Button>
                </div>
              </form>
            )}

            {/* reCAPTCHA Container */}
            <div id='recaptcha-container' className='flex justify-center'></div>

            <div className='text-center'>
              <p className='text-xs text-gray-500'>
                By continuing, you agree to our Terms of Service and Privacy
                Policy
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
