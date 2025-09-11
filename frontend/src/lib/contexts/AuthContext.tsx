"use client";

import {
  ConfirmationResult,
  signOut as firebaseSignOut,
  onAuthStateChanged,
  RecaptchaVerifier,
  signInWithPhoneNumber,
  User,
} from "firebase/auth";
import type { ReactNode } from "react";
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";
import { auth } from "../firebase/config";
import {
  createUserProfile,
  getUserProfile,
  UserProfile,
} from "../services/userService";

interface AuthContextType {
  user: User | null;
  userProfile: UserProfile | null;
  loading: boolean;
  authError: string | null;
  signInWithPhone: (phoneNumber: string) => Promise<ConfirmationResult>;
  verifyOTP: (
    confirmationResult: ConfirmationResult,
    otp: string,
  ) => Promise<void>;
  signOut: () => Promise<void>;
  recaptchaVerifier: RecaptchaVerifier | null;
  setRecaptchaVerifier: (verifier: RecaptchaVerifier | null) => void;
  refreshUserProfile: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [authInitialized, setAuthInitialized] = useState(false); // eslint-disable-line @typescript-eslint/no-unused-vars
  const [authError, setAuthError] = useState<string | null>(null);
  const [recaptchaVerifier, setRecaptchaVerifierState] =
    useState<RecaptchaVerifier | null>(null);

  // Stable setRecaptchaVerifier function to prevent infinite re-renders
  const setRecaptchaVerifier = useCallback(
    (verifier: RecaptchaVerifier | null) => {
      setRecaptchaVerifierState(verifier);
    },
    [],
  );

  useEffect(() => {
    let mounted = true;

    // Set a reduced timeout to prevent infinite loading if Firebase fails
    const authTimeout = setTimeout(() => {
      if (loading && mounted) {
        console.warn(
          "Auth initialization timeout - Firebase may be misconfigured",
        );
        setAuthError(
          "Authentication service unavailable. Please check your connection and try again.",
        );
        setLoading(false);
        setAuthInitialized(true);
      }
    }, 5000); // Reduced to 5 second timeout

    // Check if auth is available before setting up listener
    if (!auth) {
      console.error("Firebase auth not available");
      if (mounted) {
        setAuthError("Firebase authentication is not properly configured");
        setLoading(false);
        setAuthInitialized(true);
      }
      return;
    }

    const unsubscribe = onAuthStateChanged(
      auth,
      async (user) => {
        if (!mounted) return;

        clearTimeout(authTimeout);
        console.log(
          "Auth state changed:",
          user ? "User logged in" : "User logged out",
        );
        setUser(user);
        setAuthError(null);

        if (user) {
          try {
            // Add timeout for user profile creation
            const profilePromise = createUserProfile(user);
            const timeoutPromise = new Promise((_, reject) => {
              setTimeout(
                () => reject(new Error("Profile creation timeout")),
                3000,
              );
            });

            const profile = (await Promise.race([
              profilePromise,
              timeoutPromise,
            ])) as UserProfile;
            if (mounted) {
              setUserProfile(profile);
              console.log("User profile loaded:", profile.displayName);
            }
          } catch (error) {
            console.error("Error managing user profile:", error);
            if (mounted) {
              setUserProfile(null);
              // Don't set this as a blocking error - user can still use the app
              console.warn(
                "Failed to load user profile, continuing with limited functionality",
              );
            }
          }
        } else {
          if (mounted) {
            setUserProfile(null);
          }
        }

        if (mounted) {
          setAuthInitialized(true);
          setLoading(false);
        }
      },
      (error) => {
        if (!mounted) return;

        clearTimeout(authTimeout);
        console.error("Firebase auth error:", error);
        setAuthError("Authentication failed: " + error.message);
        setLoading(false);
        setAuthInitialized(true);
      },
    );

    return () => {
      mounted = false;
      unsubscribe();
      clearTimeout(authTimeout);
    };
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const signInWithPhone = async (
    phoneNumber: string,
  ): Promise<ConfirmationResult> => {
    if (!recaptchaVerifier) {
      throw new Error("Recaptcha verifier not initialized");
    }

    try {
      const confirmationResult = await signInWithPhoneNumber(
        auth,
        phoneNumber,
        recaptchaVerifier,
      );
      return confirmationResult;
    } catch (error) {
      console.error("Error sending OTP:", error);
      throw error;
    }
  };

  const verifyOTP = async (
    confirmationResult: ConfirmationResult,
    otp: string,
  ): Promise<void> => {
    try {
      await confirmationResult.confirm(otp);
    } catch (error) {
      console.error("Error verifying OTP:", error);
      throw error;
    }
  };

  const signOut = async (): Promise<void> => {
    try {
      await firebaseSignOut(auth);
    } catch (error) {
      console.error("Error signing out:", error);
      throw error;
    }
  };

  const refreshUserProfile = async (): Promise<void> => {
    if (user) {
      try {
        const profile = await getUserProfile(user.uid);
        setUserProfile(profile);
      } catch (error) {
        console.error("Error refreshing user profile:", error);
      }
    }
  };

  const value: AuthContextType = {
    user,
    userProfile,
    loading,
    authError,
    signInWithPhone,
    verifyOTP,
    signOut,
    recaptchaVerifier,
    setRecaptchaVerifier,
    refreshUserProfile,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth(): AuthContextType {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
