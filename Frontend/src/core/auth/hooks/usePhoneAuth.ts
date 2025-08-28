/**
 * Phone Authentication Hook
 * Main hook that combines all phone authentication functionality
 */

import { useState } from "react";
import { User } from "firebase/auth";
import { usePhoneAuthState } from "./usePhoneAuthState";
import { usePhoneAuthActions } from "./usePhoneAuthActions";
import { usePhoneAuthRateLimit } from "./usePhoneAuthRateLimit";
import { usePhoneAuthSession } from "./usePhoneAuthSession";
import type { PhoneAuthState } from "../types/phone-auth.types";

interface UsePhoneAuthReturn {
  // State
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  authState: PhoneAuthState;

  // Actions
  sendVerificationCode: (phoneNumber: string) => Promise<void>;
  verifyCode: (code: string) => Promise<User>;
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
  // Local state for actions
  const [localUser, setLocalUser] = useState<User | null>(null);
  const [localIsAuthenticated, setLocalIsAuthenticated] = useState(false);
  const [localError, setLocalError] = useState<string | null>(null);
  const [localIsLoading, setLocalIsLoading] = useState(false);

  // State management
  const {
    user: stateUser,
    isAuthenticated: stateIsAuthenticated,
    isLoading: stateIsLoading,
    authState,
    error: stateError,
  } = usePhoneAuthState(recaptchaContainerId);

  // Use local state if available, otherwise use state from usePhoneAuthState
  const user = localUser || stateUser;
  const isAuthenticated = localIsAuthenticated || stateIsAuthenticated;
  const isLoading = localIsLoading || stateIsLoading;
  const error = localError || stateError;

  // Actions
  const {
    sendVerificationCode,
    verifyCode,
    signOut,
    clearRecaptcha,
    clearError,
  } = usePhoneAuthActions(
    setLocalUser,
    setLocalIsAuthenticated,
    setLocalError,
    setLocalIsLoading
  );

  // Rate limiting
  const { getRateLimitInfo, isRateLimited } = usePhoneAuthRateLimit();

  // Session
  const { sessionDuration, timeSinceLastActivity } = usePhoneAuthSession();

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
    sessionDuration,
    timeSinceLastActivity,

    // Error handling
    error,
    clearError,
  };
};
