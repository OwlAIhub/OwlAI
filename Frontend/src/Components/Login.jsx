import React, { useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import { auth, RecaptchaVerifier, signInWithPhoneNumber } from '../firebase.js';
import { useNavigate } from 'react-router-dom';

export default function Login() {
  const [showPhoneForm, setShowPhoneForm] = useState(false);
  const [otpScreen, setOtpScreen] = useState(false);
  const [phone, setPhone] = useState('');
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [resendTimer, setResendTimer] = useState(30);
  const [confirmationResult, setConfirmationResult] = useState(null);
  const navigate = useNavigate();

  const isValidPhone = (number) => /^[6-9]\d{9}$/.test(number);
  const fullOtp = otp.join('');
  const otpComplete = fullOtp.length === 6;

  useEffect(() => {
    let timer;
    if (otpScreen && resendTimer > 0) {
      timer = setInterval(() => setResendTimer((prev) => prev - 1), 1000);
    }
    return () => clearInterval(timer);
  }, [otpScreen, resendTimer]);

  const handleOtpChange = (value, index) => {
    if (/^\d?$/.test(value)) {
      const newOtp = [...otp];
      newOtp[index] = value;
      setOtp(newOtp);
      if (value && index < 5) document.getElementById(`otp-${index + 1}`).focus();
    }
  };

  const handleOtpKeyDown = (e, index) => {
    if (e.key === 'Backspace') {
      if (otp[index]) {
        const newOtp = [...otp];
        newOtp[index] = '';
        setOtp(newOtp);
      } else if (index > 0) {
        document.getElementById(`otp-${index - 1}`).focus();
      }
    }
  };

  const setupRecaptcha = () => {
    if (!window.recaptchaVerifier) {
      window.recaptchaVerifier = new RecaptchaVerifier(
        auth,
        'recaptcha-container',
        {
          size: 'invisible',
          callback: () => {
            console.log('reCAPTCHA verified');
          },
          'expired-callback': () => {
            console.log('reCAPTCHA expired');
          },
        }
      );
      window.recaptchaVerifier.render().catch(console.error);
    }
  };

  const handleSendOTP = async () => {
    if (!isValidPhone(phone)) {
      toast.error('Invalid phone number');
      return;
    }
    setupRecaptcha();
    try {
      const result = await signInWithPhoneNumber(
        auth,
        '+91' + phone,
        window.recaptchaVerifier
      );
      setConfirmationResult(result);
      setOtpScreen(true);
      setResendTimer(30);
      toast.success('OTP sent!');
    } catch (err) {
      console.error('Error sending OTP:', err);
      toast.error(err.message || 'Failed to send OTP');
    }
  };

  const handleVerifyOTP = async () => {
    if (!confirmationResult || !otpComplete) return;
    try {
      const result = await confirmationResult.confirm(fullOtp);
      const isNewUser = result?.additionalUserInfo?.isNewUser;

      toast.success(isNewUser ? 'Welcome new user!' : 'Welcome back!');
      if (isNewUser) {
        navigate('/questionnaire');
      } else {
        navigate('/main');
      }
    } catch (err) {
      console.error('OTP Verification Error:', err);
      toast.error('Invalid OTP');
    }
  };

  const handleLogin = () => setShowPhoneForm(true);

  return (
    <div className="flex-1 flex flex-col items-center justify-center px-4 py-8 bg-gray-50 dark:bg-[#0D1B2A]">
      <div className="max-w-md w-full space-y-8 text-center">
        <div>
          <h1
            className={`text-4xl font-bold text-gray-800 dark:text-white ${
              otpScreen ? 'mb-2 text-2xl' : ''
            }`}
          >
            Owl AI
          </h1>
          {!otpScreen && (
            <>
              <h2 className="text-2xl font-semibold text-gray-800 dark:text-white mt-4">
                Let's get started!
              </h2>
              <p className="mt-1 text-sm text-gray-500 dark:text-gray-300">
                Create account or sign in by entering your mobile number
              </p>
            </>
          )}
        </div>

        {otpScreen ? (
          <>
            <div>
              <h2 className="text-xl font-semibold text-gray-800 dark:text-white">
                We sent you a code
              </h2>
              <p className="text-sm text-gray-500 dark:text-gray-300 mb-4">
                Enter 6-digit code sent to +91 {phone}
              </p>
            </div>
            <form autoComplete="one-time-code">
              <div className="flex justify-center space-x-2">
                {otp.map((d, i) => (
                  <input
                    key={i}
                    id={`otp-${i}`}
                    name={`otp-${i}`}
                    type="text"
                    inputMode="numeric"
                    maxLength="1"
                    autoComplete="one-time-code"
                    className="w-12 h-12 text-center border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-[#1A2A3A] text-gray-800 dark:text-white focus:outline-none focus:border-[#009688]"
                    value={d}
                    onChange={(e) => handleOtpChange(e.target.value, i)}
                    onKeyDown={(e) => handleOtpKeyDown(e, i)}
                  />
                ))}
              </div>
            </form>
            <button
              onClick={handleVerifyOTP}
              disabled={!otpComplete}
              className={`mt-6 w-full py-2 rounded-xl font-semibold transition ${
                otpComplete
                  ? 'bg-[#009688] text-white hover:bg-[#00796B]'
                  : 'bg-[#009688] text-gray-800 cursor-not-allowed'
              }`}
            >
              {otpComplete ? 'Verify and Continue' : 'Continue'}
            </button>
            {resendTimer > 0 ? (
              <p className="text-sm mt-4 text-gray-500 dark:text-gray-300">
                Resend OTP in 00:{resendTimer.toString().padStart(2, '0')}
              </p>
            ) : (
              <button
                onClick={handleSendOTP}
                className="text-[#009688] hover:text-[#00796B] mt-4 hover:underline"
              >
                Resend Code
              </button>
            )}
          </>
        ) : showPhoneForm ? (
          <>
            <label className="block text-sm text-left text-gray-600 dark:text-gray-300 mb-1">
              Enter your phone number
            </label>
            <div className="flex items-center border border-gray-300 dark:border-gray-700 rounded-full overflow-hidden bg-white dark:bg-[#1A2A3A]">
              <span className="px-4 text-gray-500 dark:text-gray-300">+91</span>
              <input
                type="tel"
                className="flex-1 py-2 px-2 focus:outline-none bg-white dark:bg-[#1A2A3A] text-gray-800 dark:text-white"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
              />
            </div>
            <button
              onClick={handleSendOTP}
              disabled={!isValidPhone(phone)}
              className={`mt-4 w-full py-2 rounded-xl font-semibold transition ${
                isValidPhone(phone)
                  ? 'bg-[#009688] text-white hover:bg-[#00796B]'
                  : 'bg-[#009688] text-gray-800 cursor-not-allowed'
              }`}
            >
              Send OTP
            </button>
          </>
        ) : (
          <button
            onClick={handleLogin}
            className="w-full py-2 rounded-xl font-semibold bg-[#009688] text-white hover:bg-[#00796B] transition"
          >
            Continue
          </button>
        )}

        {!otpScreen && (
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-6">
            By creating an account, you agree to Owl AI's{' '}
            <a href="#" className="underline text-[#009688] hover:text-[#00796B] dark:text-[#009688] dark:hover:text-[#00796B]">
              T&C
            </a>{' '}
            and{' '}
            <a href="#" className="underline text-[#009688] hover:text-[#00796B] dark:text-[#009688] dark:hover:text-[#00796B]">
              Privacy Policy
            </a>
          </p>
        )}

        <div id="recaptcha-container"></div>
      </div>
    </div>
  );
}
