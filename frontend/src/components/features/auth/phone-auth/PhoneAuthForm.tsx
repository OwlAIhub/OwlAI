"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { AlertCircle } from "lucide-react";
import { RecaptchaVerifier } from "firebase/auth";

import { useAuth } from "@/lib/contexts/AuthContext";
import { auth, appConfig } from "@/lib/firebase/config";
import { hasCompletedOnboarding } from "@/lib/services/onboardingService";
import { isTestPhoneNumber } from "@/lib/utils/phoneValidation";

import { usePhoneValidation } from "./hooks/usePhoneValidation";
import { useRateLimit } from "./hooks/useRateLimit";
import { useOtpHandler } from "./hooks/useOtpHandler";
import { PhoneInputStep } from "./components/PhoneInputStep";
import { OtpVerificationStep } from "./components/OtpVerificationStep";

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
  const { setRecaptchaVerifier } = useAuth();
  const router = useRouter();

  // Form state
  const [phoneNumber, setPhoneNumber] = useState("");
  const [otp, setOtp] = useState("");
  const [step, setStep] = useState<"phone" | "otp">("phone");
  const [resendLoading, setResendLoading] = useState(false);

  // Custom hooks
  const { validation, validateAndSetPhoneNumber } = usePhoneValidation();
  const { 
    cooldownRemaining, 
    checkRateLimit, 
    startCooldownTimer, 
    updateRequestTime, 
    resetAttempts 
  } = useRateLimit();
  const { 
    confirmationResult, 
    loading, 
    error, 
    warning, 
    setError, 
    setWarning, 
    sendOTP, 
    verifyCode 
  } = useOtpHandler();

  // Initialize reCAPTCHA on component mount
  useEffect(() => {
    const initializeRecaptcha = async () => {
      try {
        if (window.recaptchaVerifier) {
          window.recaptchaVerifier.clear();
        }

        const verifier = new RecaptchaVerifier(auth, "recaptcha-container", {
          size: "invisible",
          callback: () => {
            console.log("reCAPTCHA solved");
          },
          "expired-callback": () => {
            console.log("reCAPTCHA expired");
            setError("Security verification expired. Please try again.");
          },
        });

        window.recaptchaVerifier = verifier;
        setRecaptchaVerifier(verifier);

        await verifier.render();
      } catch (error) {
        console.error("reCAPTCHA initialization error:", error);
        setError("Failed to initialize security verification");
      }
    };

    initializeRecaptcha();

    return () => {
      if (window.recaptchaVerifier) {
        window.recaptchaVerifier.clear();
        delete window.recaptchaVerifier;
      }
    };
  }, [setRecaptchaVerifier, setError]);

  const handleSendOTP = async (isResend = false) => {
    const rateCheck = checkRateLimit();
    if (!rateCheck.allowed) {
      if (rateCheck.remainingTime) {
        setError(
          `Please wait ${rateCheck.remainingTime} seconds before trying again`
        );
        startCooldownTimer(rateCheck.remainingTime);
      } else {
        setError("Maximum attempts reached. Please try again later.");
      }
      return;
    }

    if (isResend) {
      setResendLoading(true);
    }

    const success = await sendOTP(
      validation.formatted,
      validation.isValid,
      validation.error
    );

    if (success) {
      updateRequestTime();
      if (!isResend) {
        setStep("otp");
      }

      // Check if it's a test number and show warning
      if (isTestPhoneNumber(validation.formatted)) {
        setWarning(
          "⚠️ Test phone number detected. Use code '123456' for testing."
        );
      }
    }

    if (isResend) {
      setResendLoading(false);
    }
  };

  const handleVerifyOTP = async () => {
    const success = await verifyCode(otp);
    
    if (success) {
      try {
        const onboardingCompleted = await hasCompletedOnboarding();
        if (onboardingCompleted) {
          router.push("/chat");
        } else {
          router.push("/onboarding");
        }
      } catch (error) {
        console.error("Navigation error:", error);
        router.push("/chat");
      }
    }
  };

  const handleBack = () => {
    setStep("phone");
    setOtp("");
    setError(null);
    setWarning(null);
  };

  return (
    <div className="w-full max-w-md mx-auto">
      {/* Error Display */}
      <AnimatePresence>
        {error && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="mb-4 p-4 bg-destructive/10 border border-destructive/20 rounded-lg flex items-start gap-3"
          >
            <AlertCircle className="w-5 h-5 text-destructive shrink-0 mt-0.5" />
            <p className="text-sm text-destructive">{error}</p>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Warning Display */}
      <AnimatePresence>
        {warning && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="mb-4 p-4 bg-yellow-500/10 border border-yellow-500/20 rounded-lg flex items-start gap-3"
          >
            <AlertCircle className="w-5 h-5 text-yellow-600 shrink-0 mt-0.5" />
            <p className="text-sm text-yellow-700 dark:text-yellow-600">
              {warning}
            </p>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Form Steps */}
      <AnimatePresence mode="wait">
        {step === "phone" ? (
          <PhoneInputStep
            key="phone"
            phoneNumber={phoneNumber}
            setPhoneNumber={setPhoneNumber}
            validation={validation}
            validateAndSetPhoneNumber={validateAndSetPhoneNumber}
            onSubmit={() => handleSendOTP(false)}
            loading={loading}
            mode={mode}
          />
        ) : (
          <OtpVerificationStep
            key="otp"
            otp={otp}
            setOtp={setOtp}
            phoneNumber={validation.formatted}
            onVerify={handleVerifyOTP}
            onResend={() => handleSendOTP(true)}
            onBack={handleBack}
            loading={loading}
            resendLoading={resendLoading}
            cooldownRemaining={cooldownRemaining}
            mode={mode}
          />
        )}
      </AnimatePresence>

      {/* reCAPTCHA container */}
      <div id="recaptcha-container"></div>
    </div>
  );
}