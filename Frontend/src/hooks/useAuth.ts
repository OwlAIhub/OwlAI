import { useState, useEffect, useCallback, useRef } from "react";
import { toast } from "react-toastify";
import {
  phoneAuthService,
  type User,
  type ConfirmationResult,
} from "@/firebase";
import { storage } from "@/utils";
import { STORAGE_KEYS } from "@/constants";

interface AuthState {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  isPhoneVerified: boolean;
}

interface PhoneAuthState {
  phoneNumber: string;
  verificationId: string | null;
  confirmationResult: ConfirmationResult | null;
  isCodeSent: boolean;
  isVerifying: boolean;
  error: string | null;
}

export const useAuth = () => {
  const [authState, setAuthState] = useState<AuthState>({
    user: null,
    isLoading: true,
    isAuthenticated: false,
    isPhoneVerified: false,
  });

  const [phoneAuthState, setPhoneAuthState] = useState<PhoneAuthState>({
    phoneNumber: "",
    verificationId: null,
    confirmationResult: null,
    isCodeSent: false,
    isVerifying: false,
    error: null,
  });

  const recaptchaContainerRef = useRef<HTMLDivElement>(null);

  // Initialize reCAPTCHA on mount
  useEffect(() => {
    const initializeRecaptcha = async () => {
      try {
        if (recaptchaContainerRef.current) {
          await phoneAuthService.initializeRecaptcha("recaptcha-container");
        }
      } catch (error) {
        console.error("Failed to initialize reCAPTCHA:", error);
        setPhoneAuthState(prev => ({
          ...prev,
          error: "Failed to initialize verification system",
        }));
      }
    };

    initializeRecaptcha();

    // Cleanup on unmount
    return () => {
      phoneAuthService.clearRecaptcha();
    };
  }, []);

  // Listen to auth state changes
  useEffect(() => {
    const unsubscribe = phoneAuthService.onAuthStateChanged(user => {
      setAuthState(prev => ({
        ...prev,
        user,
        isAuthenticated: !!user,
        isPhoneVerified: !!user?.phoneNumber,
        isLoading: false,
      }));

      // Save user to storage if authenticated
      if (user) {
        const userData = {
          uid: user.uid,
          phoneNumber: user.phoneNumber,
          emailVerified: user.emailVerified,
          displayName: user.displayName,
          photoURL: user.photoURL,
          metadata: {
            creationTime: user.metadata.creationTime,
            lastSignInTime: user.metadata.lastSignInTime,
          },
        };
        storage.set(STORAGE_KEYS.USER, userData);
      } else {
        storage.remove(STORAGE_KEYS.USER);
      }
    });

    return unsubscribe;
  }, []);

  // Load user from storage on mount
  useEffect(() => {
    const savedUser = storage.get(STORAGE_KEYS.USER);
    if (savedUser && authState.user) {
      // User is already authenticated via Firebase
      return;
    }
  }, [authState.user]);

  // Send verification code
  const sendVerificationCode = useCallback(async (phoneNumber: string) => {
    try {
      setPhoneAuthState(prev => ({
        ...prev,
        phoneNumber,
        isCodeSent: false,
        isVerifying: false,
        error: null,
      }));

      // Validate phone number format
      if (!isValidPhoneNumber(phoneNumber)) {
        throw new Error("Please enter a valid phone number");
      }

      const confirmationResult =
        await phoneAuthService.sendVerificationCode(phoneNumber);

      setPhoneAuthState(prev => ({
        ...prev,
        confirmationResult,
        isCodeSent: true,
        error: null,
      }));

      toast.success("Verification code sent to your phone");
      return confirmationResult;
    } catch (error) {
      const errorMessage =
        error instanceof Error
          ? error.message
          : "Failed to send verification code";
      setPhoneAuthState(prev => ({
        ...prev,
        error: errorMessage,
        isCodeSent: false,
      }));
      toast.error(errorMessage);
      throw error;
    }
  }, []);

  // Verify OTP code
  const verifyCode = useCallback(
    async (code: string) => {
      try {
        if (!phoneAuthState.confirmationResult) {
          throw new Error(
            "No verification session found. Please request a new code."
          );
        }

        setPhoneAuthState(prev => ({
          ...prev,
          isVerifying: true,
          error: null,
        }));

        // Validate OTP format
        if (!isValidOTP(code)) {
          throw new Error("Please enter a valid 6-digit verification code");
        }

        const user = await phoneAuthService.verifyCode(
          phoneAuthState.confirmationResult,
          code
        );

        setPhoneAuthState(prev => ({
          ...prev,
          isVerifying: false,
          error: null,
        }));

        toast.success("Phone number verified successfully!");
        return user;
      } catch (error) {
        const errorMessage =
          error instanceof Error ? error.message : "Failed to verify code";
        setPhoneAuthState(prev => ({
          ...prev,
          error: errorMessage,
          isVerifying: false,
        }));
        toast.error(errorMessage);
        throw error;
      }
    },
    [phoneAuthState.confirmationResult]
  );

  // Sign out
  const signOut = useCallback(async () => {
    try {
      await phoneAuthService.signOut();
      setPhoneAuthState({
        phoneNumber: "",
        verificationId: null,
        confirmationResult: null,
        isCodeSent: false,
        isVerifying: false,
        error: null,
      });
      toast.info("Signed out successfully");
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "Failed to sign out";
      toast.error(errorMessage);
      throw error;
    }
  }, []);

  // Clear error
  const clearError = useCallback(() => {
    setPhoneAuthState(prev => ({
      ...prev,
      error: null,
    }));
  }, []);

  // Reset phone auth state
  const resetPhoneAuth = useCallback(() => {
    setPhoneAuthState({
      phoneNumber: "",
      verificationId: null,
      confirmationResult: null,
      isCodeSent: false,
      isVerifying: false,
      error: null,
    });
  }, []);

  return {
    // Auth state
    user: authState.user,
    isLoading: authState.isLoading,
    isAuthenticated: authState.isAuthenticated,
    isPhoneVerified: authState.isPhoneVerified,

    // Phone auth state
    phoneNumber: phoneAuthState.phoneNumber,
    isCodeSent: phoneAuthState.isCodeSent,
    isVerifying: phoneAuthState.isVerifying,
    error: phoneAuthState.error,

    // Methods
    sendVerificationCode,
    verifyCode,
    signOut,
    clearError,
    resetPhoneAuth,
    recaptchaContainerRef,
  };
};

// Utility functions
const isValidPhoneNumber = (phoneNumber: string): boolean => {
  // Basic phone number validation - can be enhanced based on your requirements
  const phoneRegex = /^\+?[1-9]\d{1,14}$/;
  return phoneRegex.test(phoneNumber.replace(/\s/g, ""));
};

const isValidOTP = (code: string): boolean => {
  // Validate 6-digit OTP
  const otpRegex = /^\d{6}$/;
  return otpRegex.test(code);
};
