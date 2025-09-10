"use client";

import { Button } from "@/components/ui/buttons/button";
import { Input } from "@/components/ui/inputs/input";
import { Label } from "@/components/ui/inputs/label";
import { useAuth } from "@/lib/contexts/AuthContext";
import { auth, appConfig, getFirebaseErrorMessage } from "@/lib/firebase/config";
import { hasCompletedOnboarding } from "@/lib/services/onboardingService";
import { validatePhoneNumber, formatPhoneNumber, isTestPhoneNumber } from "@/lib/utils/phoneValidation";
import { ConfirmationResult, RecaptchaVerifier } from "firebase/auth";
import { motion } from "framer-motion";
import { ArrowRight, Check, Loader2, Phone, AlertCircle, RefreshCw } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState, useCallback } from "react";

// Extend Window interface for reCAPTCHA
declare global {
  interface Window {
    recaptchaVerifier?: RecaptchaVerifier;
  }
}

interface PhoneAuthFormProps {
  mode: "login" | "signup";
}

export function PhoneAuthForm({ mode }: PhoneAuthFormProps) {
  const { signInWithPhone, verifyOTP, setRecaptchaVerifier } = useAuth();
  const router = useRouter();
  
  // Form state
  const [phoneNumber, setPhoneNumber] = useState("");
  const [otp, setOtp] = useState("");
  const [step, setStep] = useState<"phone" | "otp">("phone");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [warning, setWarning] = useState<string | null>(null);
  const [confirmationResult, setConfirmationResult] = useState<ConfirmationResult | null>(null);
  
  // Rate limiting state
  const [lastRequestTime, setLastRequestTime] = useState<number>(0);
  const [cooldownRemaining, setCooldownRemaining] = useState<number>(0);
  const [attemptCount, setAttemptCount] = useState<number>(0);
  const [resendLoading, setResendLoading] = useState(false);
  
  // Validation state
  const [phoneValidation, setPhoneValidation] = useState<{
    isValid: boolean;
    formatted: string;
    country?: string;
    error?: string;
  }>({ isValid: false, formatted: '', country: undefined, error: undefined });

  // ========================================
  // PHONE NUMBER VALIDATION
  // ========================================
  
  const validateAndSetPhoneNumber = useCallback((phone: string) => {
    const validation = validatePhoneNumber(phone);
    setPhoneValidation({
      isValid: validation.isValid,
      formatted: validation.formatted,
      country: validation.country,
      error: validation.error,
    });
    
    if (validation.isValid) {
      setWarning(null);
      setError(null);
      
      // Check for test numbers in production
      if (appConfig.environment === 'production' && isTestPhoneNumber(validation.formatted)) {
        setWarning("Test phone numbers are not supported in production. Please use a real phone number.");
      }
    } else if (phone.trim() !== '') {
      setError(validation.error || 'Invalid phone number');
    } else {
      setError(null);
    }
  }, []);

  useEffect(() => {
    validateAndSetPhoneNumber(phoneNumber);
  }, [phoneNumber, validateAndSetPhoneNumber]);

  // ========================================
  // RECAPTCHA INITIALIZATION
  // ========================================
  
  useEffect(() => {
    // Initialize reCAPTCHA verifier with improved timing
    const initRecaptcha = async () => {
      if (typeof window === "undefined") return;

      // Clear any existing verifier first
      if (window.recaptchaVerifier) {
        try {
          window.recaptchaVerifier.clear();
          delete window.recaptchaVerifier;
        } catch (error) {
          console.warn("Error clearing existing verifier:", error);
        }
      }

      // Wait for container to be available
      let attempts = 0;
      const maxAttempts = 20;

      while (attempts < maxAttempts) {
        const container = document.getElementById("recaptcha-container");
        if (container) {
          try {
            console.log("Initializing reCAPTCHA verifier...");
            const verifier = new RecaptchaVerifier(
              auth,
              "recaptcha-container",
              {
                size: "invisible",
                callback: () => {
                  console.log("reCAPTCHA solved successfully");
                },
                "expired-callback": () => {
                  console.warn("reCAPTCHA expired");
                  setError("reCAPTCHA expired. Please try again.");
                },
              },
            );

            // Render the verifier to ensure it's ready
            await verifier.render();

            setRecaptchaVerifier(verifier);
            window.recaptchaVerifier = verifier;
            console.log("reCAPTCHA verifier initialized successfully");
            return;
          } catch (error) {
            console.error("Failed to initialize reCAPTCHA:", error);
            break;
          }
        }

        attempts++;
        await new Promise((resolve) => setTimeout(resolve, 100));
      }

      if (attempts >= maxAttempts) {
        console.error(
          "Failed to find recaptcha-container after",
          maxAttempts,
          "attempts",
        );
      }
    };

    // Initialize with a small delay to ensure DOM is ready
    const timer = setTimeout(initRecaptcha, 100);

    return () => {
      clearTimeout(timer);
      // Cleanup on unmount
      if (window.recaptchaVerifier) {
        try {
          window.recaptchaVerifier.clear();
        } catch (error) {
          console.warn("Failed to clear reCAPTCHA:", error);
        }
        delete window.recaptchaVerifier;
      }
    };
  }, [setRecaptchaVerifier]); // Keep setRecaptchaVerifier dependency but make it stable

  // ========================================
  // RATE LIMITING HELPERS
  // ========================================
  
  const startCooldownTimer = useCallback((remainingSeconds: number) => {
    setCooldownRemaining(remainingSeconds);
    
    const countdown = setInterval(() => {
      setCooldownRemaining(prev => {
        if (prev <= 1) {
          clearInterval(countdown);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    
    return countdown;
  }, []);
  
  const checkRateLimit = useCallback((): { allowed: boolean; remainingTime?: number } => {
    const now = Date.now();
    const cooldownPeriod = appConfig.security.otpCooldownSeconds * 1000;
    const timeSinceLastRequest = now - lastRequestTime;
    
    if (timeSinceLastRequest < cooldownPeriod) {
      const remainingTime = Math.ceil((cooldownPeriod - timeSinceLastRequest) / 1000);
      return { allowed: false, remainingTime };
    }
    
    if (attemptCount >= appConfig.security.maxOtpAttempts) {
      return { allowed: false };
    }
    
    return { allowed: true };
  }, [lastRequestTime, attemptCount]);

  // ========================================
  // SEND OTP FUNCTION (SHARED BY INITIAL SEND & RESEND)
  // ========================================
  
  const sendOTP = useCallback(async (isResend = false): Promise<boolean> => {
    try {
      setError(null);
      setWarning(null);
      
      // Validate phone number first
      if (!phoneValidation.isValid) {
        setError(phoneValidation.error || "Please enter a valid phone number");
        return false;
      }
      
      // Check rate limiting
      const rateCheck = checkRateLimit();
      if (!rateCheck.allowed) {
        if (rateCheck.remainingTime) {
          setError(`Please wait ${rateCheck.remainingTime} seconds before trying again`);
          startCooldownTimer(rateCheck.remainingTime);
        } else {
          setError(`Maximum attempts reached. Please try again later.`);
        }
        return false;
      }
      
      // Wait for reCAPTCHA to be ready
      let retries = 0;
      const maxRetries = 10;
      while (!window.recaptchaVerifier && retries < maxRetries) {
        await new Promise((resolve) => setTimeout(resolve, 500));
        retries++;
      }

      if (!window.recaptchaVerifier) {
        setError("Security verification is loading. Please try again in a moment.");
        return false;
      }

      const result = await signInWithPhone(phoneValidation.formatted);
      setConfirmationResult(result);
      
      // Update state
      const now = Date.now();
      setLastRequestTime(now);
      setAttemptCount(prev => prev + 1);
      
      if (!isResend) {
        setStep("otp");
      }
      
      return true;
      
    } catch (err: unknown) {
      console.error("Phone auth error:", err);
      const errorMessage = getFirebaseErrorMessage(err);
      setError(errorMessage);
      return false;
    }
  }, [phoneValidation, checkRateLimit, startCooldownTimer, signInWithPhone]);

  const handlePhoneSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    setLoading(true);
    await sendOTP(false);
    setLoading(false);
  };

  const handleOtpSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    if (!otp.trim() || otp.length !== 6) {
      setError("Please enter the 6-digit OTP");
      setLoading(false);
      return;
    }

    if (!confirmationResult) {
      setError("Please request a new OTP");
      setLoading(false);
      return;
    }

    try {
      await verifyOTP(confirmationResult, otp);

      // Wait a moment for auth state to update, then check onboarding status
      setTimeout(async () => {
        const currentUser = auth.currentUser;
        if (currentUser) {
          try {
            const completed = await hasCompletedOnboarding(currentUser.uid);
            if (completed) {
              // User has completed onboarding, go to chat
              router.push("/chat");
            } else {
              // User needs to complete onboarding
              router.push("/onboarding");
            }
          } catch (error) {
            console.error("Error checking onboarding status:", error);
            // Fallback to onboarding on error
            router.push("/onboarding");
          }
        } else {
          // Fallback to onboarding if no user
          router.push("/onboarding");
        }
      }, 500);
    } catch (err) {
      console.error("OTP verification error:", err);
      const errorMessage =
        err instanceof Error ? err.message : "Invalid OTP. Please try again.";
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  // ========================================
  // RESEND OTP FUNCTION (ACTUALLY WORKING!)
  // ========================================
  
  const handleResendOtp = async () => {
    setResendLoading(true);
    setError(null);
    
    try {
      const success = await sendOTP(true);
      if (success) {
        // Show success message temporarily
        setWarning("New verification code sent successfully!");
        setTimeout(() => setWarning(null), 3000);
      }
    } catch (err) {
      console.error("Resend OTP error:", err);
      setError("Failed to resend verification code. Please try again.");
    } finally {
      setResendLoading(false);
    }
  };

  if (step === "phone") {
    return (
      <form onSubmit={handlePhoneSubmit} className="space-y-6">
        {/* Phone Input */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.15 }}
          className="space-y-2"
        >
          <Label
            htmlFor="phone"
            className="text-sm font-medium text-foreground"
          >
            Phone Number
          </Label>
          <div className="relative">
            <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              id="phone"
              type="tel"
              value={phoneNumber}
              onChange={(e) => setPhoneNumber(e.target.value)}
              placeholder="+91 98765 43210"
              className={`pl-10 h-12 text-base ${
                phoneValidation.isValid && phoneNumber ? 'border-green-500 focus:border-green-500' : 
                error && phoneNumber ? 'border-red-500 focus:border-red-500' : ''
              }`}
              disabled={loading}
              required
            />
            {phoneValidation.isValid && phoneNumber && (
              <Check className="absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-green-500" />
            )}
            {error && phoneNumber && (
              <AlertCircle className="absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-red-500" />
            )}
          </div>
          
          {/* Phone validation feedback */}
          {phoneValidation.isValid && phoneNumber && (
            <motion.p
              initial={{ opacity: 0, y: -5 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-xs text-green-600 flex items-center gap-1"
            >
              <Check className="w-3 h-3" />
              Valid {phoneValidation.country} number: {formatPhoneNumber(phoneNumber)}
            </motion.p>
          )}
        </motion.div>

        {/* Warning Message */}
        {warning && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="p-3 bg-yellow-50 border border-yellow-200 rounded-lg text-yellow-800 text-sm flex items-start gap-2"
          >
            <AlertCircle className="w-4 h-4 mt-0.5 flex-shrink-0" />
            {warning}
          </motion.div>
        )}

        {/* Error Message */}
        {error && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="p-3 bg-red-50 border border-red-200 rounded-lg text-red-800 text-sm flex items-start gap-2"
          >
            <AlertCircle className="w-4 h-4 mt-0.5 flex-shrink-0" />
            {error}
          </motion.div>
        )}

        {/* Submit Button */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.15, delay: 0.05 }}
        >
          <Button
            type="submit"
            disabled={loading || cooldownRemaining > 0 || !phoneValidation.isValid || !phoneNumber}
            className="w-full h-12 text-base font-medium"
          >
            {loading ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Sending OTP...
              </>
            ) : cooldownRemaining > 0 ? (
              <>
                Wait {cooldownRemaining}s
                <Loader2 className="w-4 h-4 ml-2 animate-spin" />
              </>
            ) : (
              <>
                Send OTP
                <ArrowRight className="w-4 h-4 ml-2" />
              </>
            )}
          </Button>
        </motion.div>

        {/* Info Text */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.15, delay: 0.1 }}
          className="text-xs text-muted-foreground text-center"
        >
          We&apos;ll send you a verification code to confirm your number
        </motion.p>

        {/* reCAPTCHA container */}
        <div id="recaptcha-container"></div>
      </form>
    );
  }

  return (
    <form onSubmit={handleOtpSubmit} className="space-y-6">
      {/* Back to Phone */}
      <motion.button
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        type="button"
        onClick={() => setStep("phone")}
        className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
      >
        <ArrowRight className="w-4 h-4 rotate-180" />
        Change phone number
      </motion.button>

      {/* Phone Display */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center p-4 bg-gray-50 rounded-lg"
      >
        <p className="text-sm text-muted-foreground mb-1">OTP sent to</p>
        <p className="font-medium text-foreground">{formatPhoneNumber(phoneNumber)}</p>
        <p className="text-xs text-muted-foreground mt-1">
          Attempt {attemptCount} of {appConfig.security.maxOtpAttempts}
        </p>
      </motion.div>

      {/* OTP Input */}
      <motion.div
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.15, delay: 0.05 }}
        className="space-y-2"
      >
        <Label htmlFor="otp" className="text-sm font-medium text-foreground">
          Verification Code
        </Label>
        <Input
          id="otp"
          type="text"
          value={otp}
          onChange={(e) =>
            setOtp(e.target.value.replace(/\D/g, "").slice(0, 6))
          }
          placeholder="123456"
          className="h-12 text-base text-center tracking-widest"
          disabled={loading}
          maxLength={6}
          required
        />
      </motion.div>

      {/* Warning Message */}
      {warning && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="p-3 bg-green-50 border border-green-200 rounded-lg text-green-800 text-sm flex items-start gap-2"
        >
          <Check className="w-4 h-4 mt-0.5 flex-shrink-0" />
          {warning}
        </motion.div>
      )}

      {/* Error Message */}
      {error && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="p-3 bg-red-50 border border-red-200 rounded-lg text-red-800 text-sm flex items-start gap-2"
        >
          <AlertCircle className="w-4 h-4 mt-0.5 flex-shrink-0" />
          {error}
        </motion.div>
      )}

      {/* Submit Button */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.15, delay: 0.1 }}
      >
        <Button
          type="submit"
          disabled={loading}
          className="w-full h-12 text-base font-medium"
        >
          {loading ? (
            <>
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              Verifying...
            </>
          ) : (
            <>
              <Check className="w-4 h-4 mr-2" />
              Verify & {mode === "login" ? "Sign In" : "Sign Up"}
            </>
          )}
        </Button>
      </motion.div>

      {/* Resend OTP */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.15, delay: 0.15 }}
        className="text-center"
      >
        <button
          type="button"
          onClick={handleResendOtp}
          disabled={loading || resendLoading || cooldownRemaining > 0 || attemptCount >= appConfig.security.maxOtpAttempts}
          className="text-sm text-primary hover:text-primary/80 font-medium transition-colors disabled:opacity-50 flex items-center justify-center gap-2 mx-auto"
        >
          {resendLoading ? (
            <>
              <Loader2 className="w-3 h-3 animate-spin" />
              Sending...
            </>
          ) : cooldownRemaining > 0 ? (
            <>
              <RefreshCw className="w-3 h-3" />
              Resend in {cooldownRemaining}s
            </>
          ) : attemptCount >= appConfig.security.maxOtpAttempts ? (
            <>
              <AlertCircle className="w-3 h-3" />
              Max attempts reached
            </>
          ) : (
            <>
              <RefreshCw className="w-3 h-3" />
              Didn&apos;t receive code? Resend
            </>
          )}
        </button>
      </motion.div>

      {/* reCAPTCHA container */}
      <div id="recaptcha-container"></div>
    </form>
  );
}
