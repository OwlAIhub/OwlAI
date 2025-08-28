/**
 * Combined Authentication Hook
 * Provides both regular Firebase auth and phone authentication functionality
 */

import { useRef } from "react";
import { usePhoneAuth } from "../core/auth/hooks/usePhoneAuth";

export const useAuth = () => {
  const recaptchaContainerRef = useRef<HTMLDivElement>(null);

  const phoneAuth = usePhoneAuth("recaptcha-container");

  // Reset phone auth state
  const resetPhoneAuth = () => {
    phoneAuth.clearRecaptcha();
    // Reset the auth state
    phoneAuth.clearError();
  };

  return {
    // Phone auth methods
    sendVerificationCode: phoneAuth.sendVerificationCode,
    verifyCode: phoneAuth.verifyCode,
    isVerifying: phoneAuth.authState.isVerifying,
    error: phoneAuth.error,
    clearError: phoneAuth.clearError,
    resetPhoneAuth,
    recaptchaContainerRef,

    // Additional auth methods
    user: phoneAuth.user,
    isAuthenticated: phoneAuth.isAuthenticated,
    isLoading: phoneAuth.isLoading,
    signOut: phoneAuth.signOut,
  };
};
