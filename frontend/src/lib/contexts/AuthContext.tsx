"use client";

import {
  createContext,
  useContext,
  useEffect,
  useState,
  useCallback,
} from "react";
import type { ReactNode } from "react";
import {
  User,
  onAuthStateChanged,
  signInWithPhoneNumber,
  RecaptchaVerifier,
  ConfirmationResult,
  signOut as firebaseSignOut,
} from "firebase/auth";
import { auth } from "../firebase/config";
import {
  createUserProfile,
  getUserProfile,
  UserProfile,
} from "../services/userService";
import { chatService } from "../services/chatService";
import { ClientUser } from "../types/chat";

interface AuthContextType {
  user: User | null;
  userProfile: UserProfile | null;
  chatUser: ClientUser | null;
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
  initializeChatUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [chatUser, setChatUser] = useState<ClientUser | null>(null);
  const [loading, setLoading] = useState(true);
  const [authInitialized, setAuthInitialized] = useState(false); // eslint-disable-line @typescript-eslint/no-unused-vars
  const [authError, setAuthError] = useState<string | null>(null);
  const [recaptchaVerifier, setRecaptchaVerifierState] =
    useState<RecaptchaVerifier | null>(null);

  // Stable setRecaptchaVerifier function to prevent infinite re-renders
  const setRecaptchaVerifier = useCallback((verifier: RecaptchaVerifier | null) => {
    setRecaptchaVerifierState(verifier);
  }, []);

  // Initialize chat user in Firestore
  const initializeChatUser = useCallback(async (): Promise<void> => {
    if (!user || !userProfile) return;

    try {
      // Check if chat user already exists
      let existingChatUser = await chatService.getUser(user.uid);

      if (!existingChatUser) {
        // Create new chat user from auth user and profile
        await chatService.createUser(user.uid, {
          id: user.uid,
          email: user.email || userProfile.email || "",
          displayName: user.displayName || userProfile.displayName || "User",
          photoURL: user.photoURL || userProfile.photoURL,
          preferences: {
            theme: "light",
            notifications: true,
            autoSave: true,
          },
          subscription: {
            plan: "free",
            features: ["basic_chat", "limited_sessions"],
          },
        });

        // Fetch the newly created user
        existingChatUser = await chatService.getUser(user.uid);
      }

      setChatUser(existingChatUser);
    } catch (error) {
      console.error("Error initializing chat user:", error);
    }
  }, [user, userProfile]);

  useEffect(() => {
    let timeoutId: NodeJS.Timeout; // eslint-disable-line @typescript-eslint/no-unused-vars
    
    // Set a timeout to prevent infinite loading if Firebase fails
    const authTimeout = setTimeout(() => {
      if (loading) {
        console.warn('Auth initialization timeout - Firebase may be misconfigured');
        setAuthError('Authentication service unavailable');
        setLoading(false);
        setAuthInitialized(true);
      }
    }, 10000); // 10 second timeout

    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      clearTimeout(authTimeout);
      console.log('Auth state changed:', user ? 'User logged in' : 'User logged out');
      setUser(user);
      setAuthError(null);

      if (user) {
        try {
          // Create or update user profile in Firestore
          const profile = await createUserProfile(user);
          setUserProfile(profile);
          console.log('User profile loaded:', profile.displayName);
        } catch (error) {
          console.error("Error managing user profile:", error);
          setUserProfile(null);
          setAuthError('Failed to load user profile');
        }
      } else {
        setUserProfile(null);
        setChatUser(null);
      }

      setAuthInitialized(true);
      setLoading(false);
    }, (error) => {
      clearTimeout(authTimeout);
      console.error('Firebase auth error:', error);
      setAuthError('Authentication failed: ' + error.message);
      setLoading(false);
      setAuthInitialized(true);
    });

    return () => {
      unsubscribe();
      clearTimeout(authTimeout);
    };
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  // Initialize chat user when user and profile are ready
  useEffect(() => {
    if (user && userProfile && !chatUser) {
      initializeChatUser();
    }
  }, [user, userProfile, chatUser, initializeChatUser]);

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
      setChatUser(null);
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
    chatUser,
    loading,
    authError,
    signInWithPhone,
    verifyOTP,
    signOut,
    recaptchaVerifier,
    setRecaptchaVerifier,
    refreshUserProfile,
    initializeChatUser,
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
