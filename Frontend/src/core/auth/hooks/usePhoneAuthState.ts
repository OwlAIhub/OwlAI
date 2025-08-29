/**
 * Phone Authentication State Hook
 * Manages state for phone authentication
 */

import { useState, useEffect, useRef } from "react";
import { User } from "firebase/auth";
import { phoneAuthService } from "../services/phone-auth.service";
import { sessionService } from "../services/session.service";
import { logger } from "../../../shared/utils/logger";
import type { PhoneAuthState } from "../types/phone-auth.types";

interface UsePhoneAuthStateReturn {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  authState: PhoneAuthState;
  error: string | null;
  initialized: boolean;
}

export const usePhoneAuthState = (
  recaptchaContainerId: string
): UsePhoneAuthStateReturn => {
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
        // Add a small delay to ensure DOM is ready
        await new Promise(resolve => setTimeout(resolve, 100));
        await phoneAuthService.initializeRecaptcha(recaptchaContainerId);
        initialized.current = true;
        setIsLoading(false);
      } catch (error) {
        logger.error("Failed to initialize phone auth", "usePhoneAuthState", error);
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

  // Update auth state
  useEffect(() => {
    const updateAuthState = () => {
      const currentState = phoneAuthService.getState();
      setAuthState(currentState);

      if (currentState.error) {
        setError(currentState.error);
      }
    };

    updateAuthState();
  }, []);

  // Check session status
  useEffect(() => {
    const checkSession = () => {
      const session = sessionService.getCurrentSession();
      if (session) {
        setIsAuthenticated(true);
      } else {
        setIsAuthenticated(false);
        setUser(null);
      }
    };

    checkSession();
  }, []);

  return {
    user,
    isAuthenticated,
    isLoading,
    authState,
    error,
    initialized: initialized.current,
  };
};
