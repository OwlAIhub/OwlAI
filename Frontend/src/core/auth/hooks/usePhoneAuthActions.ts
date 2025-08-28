/**
 * Phone Authentication Actions Hook
 * Handles phone authentication actions (send code, verify, signout)
 */

import { useCallback } from "react";
import { User } from "firebase/auth";
import { phoneAuthService } from "../services/phone-auth.service";
import { sessionService } from "../services/session.service";
import { logger } from "../../../shared/utils/logger";

interface UsePhoneAuthActionsReturn {
  sendVerificationCode: (phoneNumber: string) => Promise<void>;
  verifyCode: (code: string) => Promise<User>;
  signOut: () => Promise<void>;
  clearRecaptcha: () => void;
  clearError: () => void;
}

export const usePhoneAuthActions = (
  setUser: (user: User | null) => void,
  setIsAuthenticated: (authenticated: boolean) => void,
  setError: (error: string | null) => void,
  setIsLoading: (loading: boolean) => void
): UsePhoneAuthActionsReturn => {
  // Send verification code
  const sendVerificationCode = useCallback(async (phoneNumber: string) => {
    try {
      setError(null);
      setIsLoading(true);

      await phoneAuthService.sendVerificationCode(phoneNumber);

      logger.info("Verification code sent", "usePhoneAuthActions", { phoneNumber });
    } catch (error) {
      const errorMessage =
        error instanceof Error
          ? error.message
          : "Failed to send verification code";
      setError(errorMessage);
      logger.error("Failed to send verification code", "usePhoneAuthActions", error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  }, [setError, setIsLoading]);

  // Verify OTP code
  const verifyCode = useCallback(async (code: string): Promise<User> => {
    try {
      setError(null);
      setIsLoading(true);

      const user = await phoneAuthService.verifyCode(code);
      setUser(user);
      setIsAuthenticated(true);

      logger.info("Code verified successfully", "usePhoneAuthActions", {
        uid: user.uid,
      });

      return user;
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "Failed to verify code";
      setError(errorMessage);
      logger.error("Failed to verify code", "usePhoneAuthActions", error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  }, [setError, setIsLoading, setUser, setIsAuthenticated]);

  // Sign out
  const signOut = useCallback(async () => {
    try {
      setError(null);
      setIsLoading(true);

      await sessionService.signOut();
      setUser(null);
      setIsAuthenticated(false);

      logger.info("User signed out", "usePhoneAuthActions");
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "Failed to sign out";
      setError(errorMessage);
      logger.error("Failed to sign out", "usePhoneAuthActions", error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  }, [setError, setIsLoading, setUser, setIsAuthenticated]);

  // Clear reCAPTCHA
  const clearRecaptcha = useCallback(() => {
    phoneAuthService.clearRecaptcha();
  }, []);

  // Clear error
  const clearError = useCallback(() => {
    setError(null);
  }, [setError]);

  return {
    sendVerificationCode,
    verifyCode,
    signOut,
    clearRecaptcha,
    clearError,
  };
};
