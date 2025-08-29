import React, { useState, useRef, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { motion } from "framer-motion";
import { toast } from "react-toastify";
import { useAuth } from "@/hooks/useAuth";
import {
  FiPhone,
  FiShield,
  FiArrowLeft,
  FiRefreshCw,
  FiUser,
  FiLogIn,
} from "react-icons/fi";
import Logo from "@/assets/owl-ai-logo.png";

type AuthMode = "login" | "signup";

export default function Auth() {
  const navigate = useNavigate();
  const [mode, setMode] = useState<AuthMode>("login");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [otpCode, setOtpCode] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [step, setStep] = useState<"phone" | "otp">("phone");

  const {
    sendVerificationCode,
    verifyCode,
    error,
    clearError,
    resetPhoneAuth,
    recaptchaContainerRef,
  } = useAuth();

  const phoneInputRef = useRef<HTMLInputElement>(null);
  const otpInputRef = useRef<HTMLInputElement>(null);

  // Focus input on step change
  useEffect(() => {
    if (step === "phone") {
      phoneInputRef.current?.focus();
    } else if (step === "otp") {
      otpInputRef.current?.focus();
    }
  }, [step]);

  // Clear error when input changes (debounced to prevent flickering)
  useEffect(() => {
    const timer = setTimeout(() => {
      if (error) {
        clearError();
      }
    }, 300);

    return () => clearTimeout(timer);
  }, [phoneNumber, otpCode, error, clearError]);

  const handlePhoneSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!phoneNumber.trim()) {
      toast.error("Please enter your phone number");
      return;
    }

    setIsLoading(true);
    try {
      await sendVerificationCode(phoneNumber);
      setStep("otp");
      toast.success("Verification code sent!");
    } catch (error) {
      // Error is already handled in the hook
    } finally {
      setIsLoading(false);
    }
  };

  const handleOtpSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!otpCode.trim()) {
      toast.error("Please enter the verification code");
      return;
    }

    if (otpCode.length !== 6) {
      toast.error("Please enter a 6-digit verification code");
      return;
    }

    setIsLoading(true);
    try {
      await verifyCode(otpCode);

      toast.success(
        mode === "login"
          ? "Successfully logged in!"
          : "Account created successfully!"
      );

      // Navigate to chat
      navigate("/chat", { replace: true });
    } catch (error) {
      // Error is already handled in the hook
      console.error("OTP verification failed:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleResendCode = async () => {
    if (!phoneNumber) return;

    setIsLoading(true);
    try {
      await sendVerificationCode(phoneNumber);
      toast.success("New verification code sent!");
    } catch (error) {
      // Error is already handled in the hook
    } finally {
      setIsLoading(false);
    }
  };

  const handleBackToPhone = () => {
    setStep("phone");
    setOtpCode("");
    resetPhoneAuth();
  };

  const handleModeToggle = () => {
    setMode(mode === "login" ? "signup" : "login");
    setStep("phone");
    setPhoneNumber("");
    setOtpCode("");
    resetPhoneAuth();
  };

  const formatPhoneNumber = (value: string) => {
    // Remove all non-digits
    const cleaned = value.replace(/\D/g, "");

    // Add + if it starts with a digit and doesn't already have +
    if (cleaned && !value.startsWith("+")) {
      return `+${cleaned}`;
    }

    return value;
  };

  const formatOTP = (value: string) => {
    // Only allow digits and limit to 6 characters
    return value.replace(/\D/g, "").slice(0, 6);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50 flex">
      {/* Left Side - Auth Form */}
      <div className="flex-1 flex flex-col justify-center px-6 sm:px-12 lg:px-16 xl:px-24">
        <div className="max-w-md w-full mx-auto">
          {/* Back Button */}
          <div className="mb-8">
            <Link
              to="/OwlAi"
              className="inline-flex items-center text-gray-600 hover:text-gray-900 transition-colors"
            >
              <FiArrowLeft className="w-4 h-4 mr-2" />
              Back to Home
            </Link>
          </div>

          {/* Header */}
          <div className="text-center mb-12">
            <div className="flex items-center justify-center mb-6">
              <div className="w-12 h-12 bg-teal-600 rounded-xl flex items-center justify-center shadow-lg">
                <img src={Logo} alt="Owl AI" className="w-7 h-7" />
              </div>
            </div>
            <h1 className="text-3xl font-bold text-gray-900 mb-3">
              {mode === "login" ? "Welcome back" : "Create your account"}
            </h1>
            <p className="text-gray-600 text-base">
              {mode === "login"
                ? "Sign in to your Owl AI account to continue learning"
                : "Join Owl AI to start your learning journey"}
            </p>
          </div>

          {/* Mode Toggle */}
          <div className="flex bg-gray-100 rounded-lg p-1 mb-8">
            <button
              onClick={() => setMode("login")}
              className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors flex items-center justify-center ${
                mode === "login"
                  ? "bg-white text-teal-600 shadow-sm"
                  : "text-gray-600 hover:text-gray-900"
              }`}
            >
              <FiLogIn className="w-4 h-4 mr-2" />
              Sign In
            </button>
            <button
              onClick={() => setMode("signup")}
              className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors flex items-center justify-center ${
                mode === "signup"
                  ? "bg-white text-teal-600 shadow-sm"
                  : "text-gray-600 hover:text-gray-900"
              }`}
            >
              <FiUser className="w-4 h-4 mr-2" />
              Sign Up
            </button>
          </div>

          {/* Auth Form */}
          <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-8">
            {/* reCAPTCHA container */}
            <div
              ref={recaptchaContainerRef}
              id="recaptcha-container"
              className="mb-4"
            />

            <div key={`${mode}-${step}`}>
              {step === "phone" ? (
                <motion.div
                  key={`phone-${mode}`}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.3 }}
                >
                  <div className="text-center mb-6">
                    <div className="w-16 h-16 bg-teal-100 rounded-full flex items-center justify-center mx-auto mb-4">
                      <FiPhone className="w-8 h-8 text-teal-600" />
                    </div>
                    <h2 className="text-xl font-semibold text-gray-900 mb-2">
                      Phone Verification
                    </h2>
                    <p className="text-sm text-gray-600">
                      Enter your phone number to receive a verification code
                    </p>
                  </div>

                  <form onSubmit={handlePhoneSubmit} className="space-y-4">
                    <div>
                      <label
                        htmlFor="phone"
                        className="block text-sm font-medium text-gray-700 mb-2"
                      >
                        Phone Number
                      </label>
                      <div className="relative">
                        <input
                          ref={phoneInputRef}
                          type="tel"
                          id="phone"
                          value={phoneNumber}
                          onChange={e =>
                            setPhoneNumber(formatPhoneNumber(e.target.value))
                          }
                          placeholder="+91 9876543210 (with country code)"
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-colors text-gray-900 bg-white"
                          disabled={isLoading}
                        />
                      </div>
                    </div>

                    <button
                      type="submit"
                      disabled={isLoading || !phoneNumber.trim()}
                      className={`w-full py-3 px-4 rounded-lg font-medium transition-colors ${
                        isLoading || !phoneNumber.trim()
                          ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                          : "bg-teal-600 text-white hover:bg-teal-700 focus:ring-2 focus:ring-teal-500 focus:ring-offset-2"
                      }`}
                    >
                      {isLoading ? (
                        <div className="flex items-center justify-center">
                          <FiRefreshCw className="w-5 h-5 animate-spin mr-2" />
                          Sending Code...
                        </div>
                      ) : (
                        "Send Verification Code"
                      )}
                    </button>
                  </form>
                </motion.div>
              ) : (
                <motion.div
                  key={`otp-${mode}`}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.3 }}
                >
                  <div className="text-center mb-6">
                    <div className="w-16 h-16 bg-teal-100 rounded-full flex items-center justify-center mx-auto mb-4">
                      <FiShield className="w-8 h-8 text-teal-600" />
                    </div>
                    <h2 className="text-xl font-semibold text-gray-900 mb-2">
                      Enter Code
                    </h2>
                    <p className="text-sm text-gray-600">
                      We&apos;ve sent a 6-digit code to {phoneNumber}
                    </p>
                  </div>

                  <form onSubmit={handleOtpSubmit} className="space-y-4">
                    <div>
                      <label
                        htmlFor="otp"
                        className="block text-sm font-medium text-gray-700 mb-2"
                      >
                        Verification Code
                      </label>
                      <input
                        ref={otpInputRef}
                        type="text"
                        id="otp"
                        value={otpCode}
                        onChange={e => setOtpCode(formatOTP(e.target.value))}
                        placeholder="123456"
                        maxLength={6}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg text-center text-lg font-mono focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-colors text-gray-900 bg-white"
                        disabled={isLoading}
                      />
                    </div>

                    <button
                      type="submit"
                      disabled={
                        isLoading || !otpCode.trim() || otpCode.length !== 6
                      }
                      className={`w-full py-3 px-4 rounded-lg font-medium transition-colors ${
                        isLoading || !otpCode.trim() || otpCode.length !== 6
                          ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                          : "bg-teal-600 text-white hover:bg-teal-700 focus:ring-2 focus:ring-teal-500 focus:ring-offset-2"
                      }`}
                    >
                      {isLoading ? (
                        <div className="flex items-center justify-center">
                          <FiRefreshCw className="w-5 h-5 animate-spin mr-2" />
                          Verifying...
                        </div>
                      ) : mode === "login" ? (
                        "Sign In"
                      ) : (
                        "Create Account"
                      )}
                    </button>

                    <div className="flex space-x-2">
                      <button
                        type="button"
                        onClick={handleBackToPhone}
                        className="flex-1 py-2 px-4 rounded-lg font-medium transition-colors flex items-center justify-center text-gray-600 hover:text-gray-800"
                      >
                        <FiArrowLeft className="w-4 h-4 mr-2" />
                        Back
                      </button>
                      <button
                        type="button"
                        onClick={handleResendCode}
                        disabled={isLoading}
                        className={`flex-1 py-2 px-4 rounded-lg font-medium transition-colors ${
                          isLoading
                            ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                            : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                        }`}
                      >
                        Resend
                      </button>
                    </div>
                  </form>
                </motion.div>
              )}
            </div>

            {/* Error display */}
            {error && (
              <motion.div
                key="error"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.2 }}
                className="mt-4 p-3 rounded-lg text-sm bg-red-50 text-red-700"
              >
                {error}
              </motion.div>
            )}
          </div>

          {/* Footer */}
          <div className="text-center mt-8">
            <p className="text-gray-600 text-sm">
              {mode === "login"
                ? "Don't have an account? "
                : "Already have an account? "}
              <button
                onClick={handleModeToggle}
                className="text-teal-600 hover:text-teal-700 font-medium"
              >
                {mode === "login" ? "Sign up" : "Sign in"}
              </button>
            </p>
          </div>
        </div>
      </div>

      {/* Right Side - Image/Illustration */}
      <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-teal-50 to-teal-100 items-center justify-center">
        <div className="text-center">
          <div className="w-32 h-32 bg-teal-600 rounded-full flex items-center justify-center mx-auto mb-8 shadow-2xl">
            <img src={Logo} alt="Owl AI" className="w-16 h-16" />
          </div>
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            Welcome to Owl AI
          </h2>
          <p className="text-lg text-gray-600 max-w-md">
            Your intelligent learning companion powered by advanced AI
            technology
          </p>
        </div>
      </div>
    </div>
  );
}
