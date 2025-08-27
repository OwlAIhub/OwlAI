/**
 * Phone Authentication Hook
 * Comprehensive hook for phone authentication with all services integrated
 */

import { useState, useEffect, useCallback, useRef } from "react";
import { User } from "firebase/auth";
import { phoneAuthService } from "../services/phone-auth.service";
import { sessionService } from "../services/session.service";
import { rateLimitService } from "../services/rate-limit.service";
import { userProfileService } from "../services/user-profile.service";
import { logger } from "../../../shared/utils/logger";
import type { PhoneAuthState } from "../types/phone-auth.types";

interface UsePhoneAuthReturn {
  // State
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  authState: PhoneAuthState;

  // Actions
  sendVerificationCode: (phoneNumber: string) => Promise<void>;
  verifyCode: (code: string) => Promise<void>;
  signOut: () => Promise<void>;
  clearRecaptcha: () => void;

  // Rate limiting
  getRateLimitInfo: (phoneNumber: string) => any;
  isRateLimited: (phoneNumber: string) => boolean;

  // Session
  sessionDuration: number;
  timeSinceLastActivity: number;

  // Error handling
  error: string | null;
  clearError: () => void;
}

export const usePhoneAuth = (
  recaptchaContainerId: string
): UsePhoneAuthReturn => {
  const [user, setUser] = useState<User | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [authState, setAuthState] = useState<PhoneAuthState>({
    phoneNumber: "",
    confirmationResult: null,
    isCodeSent: false,
    isVerifying: false,
    error: null,
    verificationId: null,
  });

  const initialized = useRef(false);

  // Initialize reCAPTCHA on mount
  useEffect(() => {
    const initializeAuth = async () => {
      try {
        await phoneAuthService.initializeRecaptcha(recaptchaContainerId);
        initialized.current = true;
        setIsLoading(false);
      } catch (error) {
        logger.error("Failed to initialize phone auth", "usePhoneAuth", error);
        setError("Failed to initialize authentication system");
        setIsLoading(false);
      }
    };

    if (!initialized.current) {
      initializeAuth();
    }

    // Cleanup on unmount
    return () => {
      phoneAuthService.clearRecaptcha();
      sessionService.cleanup();
    };
  }, [recaptchaContainerId]);

  // Update auth state from service
  useEffect(() => {
    const updateAuthState = () => {
      const currentState = phoneAuthService.getState();
      setAuthState(currentState);

      if (currentState.error) {
        setError(currentState.error);
      }
    };

    // Update immediately
    updateAuthState();

    // Set up interval to sync state
    const interval = setInterval(updateAuthState, 1000);

    return () => clearInterval(interval);
  }, []);

  // Check session status
  useEffect(() => {
    const checkSession = () => {
      const session = sessionService.getCurrentSession();
      if (session) {
        setIsAuthenticated(true);
        // User will be set by Firebase auth state listener
      } else {
        setIsAuthenticated(false);
        setUser(null);
      }
    };

    checkSession();
    const interval = setInterval(checkSession, 5000);

    return () => clearInterval(interval);
  }, []);

  // Send verification code
  const sendVerificationCode = useCallback(async (phoneNumber: string) => {
    try {
      setError(null);
      setIsLoading(true);

      await phoneAuthService.sendVerificationCode(phoneNumber);

      logger.info("Verification code sent", "usePhoneAuth", { phoneNumber });
    } catch (error) {
      const errorMessage =
        error instanceof Error
          ? error.message
          : "Failed to send verification code";
      setError(errorMessage);
      logger.error("Failed to send verification code", "usePhoneAuth", error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Verify OTP code
  const verifyCode = useCallback(async (code: string) => {
    try {
      setError(null);
      setIsLoading(true);

      const user = await phoneAuthService.verifyCode(code);
      setUser(user);
      setIsAuthenticated(true);

      logger.info("Code verified successfully", "usePhoneAuth", {
        uid: user.uid,
      });
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "Failed to verify code";
      setError(errorMessage);
      logger.error("Failed to verify code", "usePhoneAuth", error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Sign out
  const signOut = useCallback(async () => {
    try {
      setError(null);
      setIsLoading(true);

      await sessionService.signOut();
      setUser(null);
      setIsAuthenticated(false);

      logger.info("User signed out", "usePhoneAuth");
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "Failed to sign out";
      setError(errorMessage);
      logger.error("Failed to sign out", "usePhoneAuth", error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Clear reCAPTCHA
  const clearRecaptcha = useCallback(() => {
    phoneAuthService.clearRecaptcha();
  }, []);

  // Get rate limit info
  const getRateLimitInfo = useCallback((phoneNumber: string) => {
    return rateLimitService.getRateLimitInfo(phoneNumber);
  }, []);

  // Check if rate limited
  const isRateLimited = useCallback((phoneNumber: string) => {
    const check = rateLimitService.checkSMSLimit(phoneNumber);
    return !check.allowed;
  }, []);

  // Clear error
  const clearError = useCallback(() => {
    setError(null);
  }, []);

  return {
    // State
    user,
    isAuthenticated,
    isLoading,
    authState,

    // Actions
    sendVerificationCode,
    verifyCode,
    signOut,
    clearRecaptcha,

    // Rate limiting
    getRateLimitInfo,
    isRateLimited,

    // Session
    sessionDuration: sessionService.getSessionDuration(),
    timeSinceLastActivity: sessionService.getTimeSinceLastActivity(),

    // Error handling
    error,
    clearError,
  };
};
