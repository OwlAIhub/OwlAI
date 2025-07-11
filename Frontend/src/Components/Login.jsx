import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import {
  auth,
  RecaptchaVerifier,
  signInWithPhoneNumber,
  db
} from '../firebase.js';
import { useNavigate } from 'react-router-dom';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import config from '../Config.js';
import axios from 'axios';

export default function Login() {
  const [showPhoneForm, setShowPhoneForm] = useState(false);
  const [otpScreen, setOtpScreen] = useState(false);
  const [phone, setPhone] = useState('');
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [resendTimer, setResendTimer] = useState(30);
  const [confirmationResult, setConfirmationResult] = useState(null);
  const [isSendingOTP, setIsSendingOTP] = useState(false);
  const [isVerifyingOTP, setIsVerifyingOTP] = useState(false);
  const [showCSIRPopup, setShowCSIRPopup] = useState(false);
  const [csirUserData, setCsirUserData] = useState(null);
  const navigate = useNavigate();

  // Redirect logged-in users away from /login
  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (user) {
        navigate('/chat', { replace: true });
      }
    });
    return () => unsubscribe();
  }, [navigate]);

  const isValidPhone = (number) => /^[6-9]\d{9}$/.test(number);
  const fullOtp = otp.join('');
  const otpComplete = fullOtp.length === 6;

  useEffect(() => {
    if (otpComplete && otpScreen) {
      handleVerifyOTP();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [otp]);

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
      if (value && index < 5) {
        document.getElementById(`otp-${index + 1}`).focus();
      }
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

  // --- reCAPTCHA FIX: Always clear previous verifier and DOM before creating new one ---
  const setupRecaptcha = () => {
    if (window.recaptchaVerifier) {
      try {
        window.recaptchaVerifier.clear();
      } catch (e) {}
      window.recaptchaVerifier = null;
      const el = document.getElementById('recaptcha-container');
      if (el) el.innerHTML = '';
    }
    window.recaptchaVerifier = new RecaptchaVerifier(
      auth,
      'recaptcha-container',
      {
        size: 'invisible',
        callback: () => {},
        'expired-callback': () => {
          toast.error('reCAPTCHA expired, please try again.');
        }
      }
    );
    window.recaptchaVerifier.render().catch((error) => {
      console.error('reCAPTCHA render error:', error);
      toast.error('Failed to load reCAPTCHA, please try again.');
    });
  };
  const checkUserProfile = async (uid) => {
    try {
      const userRef = doc(db, 'users', uid);
      const docSnap = await getDoc(userRef);
      
      if (docSnap.exists()) {
        const userData = docSnap.data();
        localStorage.setItem('user', JSON.stringify(userData));
        
        if (userData.csirBlocked) {
          setCsirUserData(userData);
          setShowCSIRPopup(true);
          return;
        }
        
        navigate(userData.questionnaireFilled ? '/chat' : '/questionnaire', {
          state: { showSignInToast: true }
        });
      } else {
        // New user - navigate to questionnaire
        navigate('/questionnaire', {
          state: { 
            newUser: true,
            phone: phone.replace('+91', ''),
            uid: uid
          }
        });
      }
    } catch (error) {
      console.error('Error checking user profile:', error);
      toast.error('Failed to load user data');
    }
  };

  const handleSendOTP = async () => {
    if (!isValidPhone(phone)) {
      toast.error('Invalid phone number');
      return;
    }
    setIsSendingOTP(true);
    setupRecaptcha();

    try {
      const formattedPhone = '+91' + phone;
      const result = await signInWithPhoneNumber(
        auth,
        formattedPhone,
        window.recaptchaVerifier
      );
      setConfirmationResult(result);
      setOtpScreen(true);
      setResendTimer(30);
      setOtp(['', '', '', '', '', '']);
      toast.success('OTP sent!');
    } catch (err) {
      console.error('Error sending OTP:', err.code, err.message);
      toast.error(err.message || 'Failed to send OTP');
    } finally {
      setIsSendingOTP(false);
    }
  };

  const handleVerifyOTP = async () => {
    if (!confirmationResult || !otpComplete) return;
    
    setIsVerifyingOTP(true);
    
    try {
      const result = await confirmationResult.confirm(fullOtp);
      const user = result.user;
      
      // Get Firebase ID token
      const token = await user.getIdToken();
      localStorage.setItem('token', token);
      
      // Check user profile in Firestore
      await checkUserProfile(user.uid);
      
    } catch (err) {
      console.error('OTP verification error:', err);
      
      if (err.code === 'auth/invalid-verification-code') {
        toast.error('Invalid OTP code');
      } else if (err.code === 'auth/code-expired') {
        toast.error('OTP expired. Please request a new one.');
      } else {
        toast.error('OTP verification failed');
      }
    } finally {
      setIsVerifyingOTP(false);
    }
  };



  // Handler for "Change your exam to UGC-NET" in popup
  const handleChangeExamToUGCNet = async () => {
    if (!csirUserData) return;
    const userRef = doc(db, 'users', csirUserData.uid);
    // Only reset curriculum and selectedSubjects, keep other info
    await setDoc(userRef, {
      csirBlocked: false,
      curriculum: '',
      selectedSubjects: [],
      questionnaireFilled: false,
    }, { merge: true });

    // Update localStorage as well
    localStorage.setItem('user', JSON.stringify({
      ...csirUserData,
      csirBlocked: false,
      curriculum: '',
      selectedSubjects: [],
      questionnaireFilled: false,
    }));

    setShowCSIRPopup(false);

    // Go to questionnaire, step 3 (curriculum), prefill previous data
    navigate('/questionnaire', {
      state: {
        step: 3,
        prefill: {
          firstName: csirUserData.firstName || '',
          lastName: csirUserData.lastName || '',
          language: csirUserData.language || '',
          attempt: csirUserData.attempt || '',
          heardFrom: csirUserData.heardFrom || '',
          examCycle: csirUserData.examCycle || '',
        }
      }
    });
  };

  // Handler for logout in popup
  const handleLogout = async () => {
    await auth.signOut();
    setShowCSIRPopup(false);
    navigate('/login');
  };

  const handleLogin = () => setShowPhoneForm(true);

  return (
    <div className="min-h-screen w-full flex flex-col items-center justify-center px-4 py-8 bg-gray-50 dark:bg-[#0D1B2A]">
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
              disabled={!otpComplete || isVerifyingOTP}
              className={`mt-6 w-full py-2 rounded-xl font-semibold transition ${
                otpComplete && !isVerifyingOTP
                  ? 'bg-[#009688] text-white hover:bg-[#00796B]'
                  : 'bg-[#009688] text-gray-800 cursor-not-allowed'
              }`}
            >
              {isVerifyingOTP ? 'Verifying...' : otpComplete ? 'Verify and Continue' : 'Continue'}
            </button>
            {resendTimer > 0 ? (
              <p className="text-sm mt-4 text-gray-500 dark:text-gray-300">
                Resend OTP in 00:{resendTimer.toString().padStart(2, '0')}
              </p>
            ) : (
              <button
                onClick={handleSendOTP}
                disabled={isSendingOTP}
                className={`text-[#009688] hover:text-[#00796B] mt-4 hover:underline ${
                  isSendingOTP ? 'cursor-not-allowed opacity-50' : ''
                }`}
              >
                {isSendingOTP ? 'Sending...' : 'Resend Code'}
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
              disabled={!isValidPhone(phone) || isSendingOTP}
              className={`mt-4 w-full py-2 rounded-xl font-semibold transition ${
                isValidPhone(phone) && !isSendingOTP
                  ? 'bg-[#009688] text-white hover:bg-[#00796B]'
                  : 'bg-[#009688] text-gray-800 cursor-not-allowed'
              }`}
            >
              {isSendingOTP ? 'Sending...' : 'Send OTP'}
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
            <a
              href="#"
              className="underline text-[#009688] hover:text-[#00796B] dark:text-[#009688] dark:hover:text-[#00796B]"
            >
              T&C
            </a>{' '}
            and{' '}
            <a
              href="#"
              className="underline text-[#009688] hover:text-[#00796B] dark:text-[#009688] dark:hover:text-[#00796B]"
            >
              Privacy Policy
            </a>
          </p>
        )}

        <div id="recaptcha-container"></div>
      </div>

      {/* CSIR-NET Blocked Popup */}
      {showCSIRPopup && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
          <div className="bg-white dark:bg-[#1A2A3A] rounded-xl shadow-2xl p-8 max-w-md w-full text-center">
            <h3 className="text-xl font-bold mb-4 text-gray-800 dark:text-white">
              Hey Aspirant,
            </h3>
            <p className="mb-6 text-gray-700 dark:text-gray-200">
              Our AI is not yet trained for this exam category: <b>CSIR-NET</b>.<br />
              We are actively working to expand into more exams very soon.<br />
              Stay tuned - your prep buddy is on the way!
            </p>
            <div className="flex flex-col gap-3">
              <button
                onClick={handleChangeExamToUGCNet}
                className="px-6 py-2 rounded-xl font-semibold bg-[#009688] text-white hover:bg-[#00796B] transition"
              >
                Change your exam to UGC-NET
              </button>
              {/* <button
                onClick={handleLogout}
                className="px-6 py-2 rounded-xl font-semibold bg-gray-200 text-gray-800 hover:bg-gray-300 dark:bg-gray-700 dark:text-white dark:hover:bg-gray-600 transition"
              >
                Log out
              </button> */}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}