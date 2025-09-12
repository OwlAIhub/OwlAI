import { useState, useCallback } from "react";
import { ConfirmationResult } from "firebase/auth";
import { useAuth } from "@/lib/contexts/AuthContext";
import { getFirebaseErrorMessage } from "@/lib/firebase/config";

export function useOtpHandler() {
  const { signInWithPhone, verifyOTP } = useAuth();
  const [confirmationResult, setConfirmationResult] = useState<ConfirmationResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [warning, setWarning] = useState<string | null>(null);

  const sendOTP = useCallback(
    async (
      formattedPhone: string,
      isValid: boolean,
      validationError?: string,
      onRateLimit?: (message: string) => void
    ): Promise<boolean> => {
      try {
        setError(null);
        setWarning(null);
        setLoading(true);

        if (!isValid) {
          setError(validationError || "Please enter a valid phone number");
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
          setError(
            "Security verification is loading. Please try again in a moment.",
          );
          return false;
        }

        const result = await signInWithPhone(formattedPhone);
        setConfirmationResult(result);

        return true;
      } catch (err: unknown) {
        console.error("Phone auth error:", err);
        const errorMessage = getFirebaseErrorMessage(err);
        setError(errorMessage);
        return false;
      } finally {
        setLoading(false);
      }
    },
    [signInWithPhone]
  );

  const verifyCode = useCallback(
    async (code: string): Promise<boolean> => {
      if (!confirmationResult) {
        setError("No confirmation result found. Please request a new code.");
        return false;
      }

      if (code.length !== 6) {
        setError("Please enter a 6-digit verification code");
        return false;
      }

      try {
        setError(null);
        setLoading(true);

        await verifyOTP(confirmationResult, code);
        return true;
      } catch (err: unknown) {
        console.error("OTP verification error:", err);
        const errorMessage = getFirebaseErrorMessage(err);
        setError(errorMessage);
        return false;
      } finally {
        setLoading(false);
      }
    },
    [confirmationResult, verifyOTP]
  );

  return {
    confirmationResult,
    loading,
    error,
    warning,
    setError,
    setWarning,
    sendOTP,
    verifyCode
  };
}