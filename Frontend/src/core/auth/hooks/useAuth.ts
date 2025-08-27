/**
 * Authentication Hook
 * Provides authentication state and methods with proper error handling
 */

import { useState, useEffect, useCallback } from "react";
import {
  User,
  onAuthStateChanged,
  signOut as firebaseSignOut,
} from "firebase/auth";
import { auth } from "../../firebase";
import { logger } from "../../../shared/utils/logger";

interface AuthState {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  error: string | null;
}

interface AuthActions {
  signOut: () => Promise<void>;
  refreshUser: () => Promise<void>;
  clearError: () => void;
}

export const useAuth = (): AuthState & AuthActions => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Check if user is authenticated
  const isAuthenticated = !!user;

  // Sign out function
  const signOut = useCallback(async (): Promise<void> => {
    try {
      setIsLoading(true);
      setError(null);
      await firebaseSignOut(auth);
      setUser(null);
      logger.info("User signed out successfully", "useAuth");
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Sign out failed";
      setError(errorMessage);
      logger.error("Sign out failed", "useAuth", err);
      throw new Error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Refresh user data
  const refreshUser = useCallback(async (): Promise<void> => {
    try {
      setError(null);
      const currentUser = auth.currentUser;
      if (currentUser) {
        await currentUser.reload();
        setUser(currentUser);
      }
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Failed to refresh user";
      setError(errorMessage);
      logger.error("Failed to refresh user", "useAuth", err);
    }
  }, []);

  // Clear error
  const clearError = useCallback((): void => {
    setError(null);
  }, []);

  // Listen to auth state changes
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(
      auth,
      currentUser => {
        setUser(currentUser);
        setIsLoading(false);
        setError(null);

        if (currentUser) {
          logger.info("User authenticated", "useAuth", {
            uid: currentUser.uid,
          });
        } else {
          logger.info("User not authenticated", "useAuth");
        }
      },
      err => {
        setError(err.message);
        setIsLoading(false);
        logger.error("Auth state change error", "useAuth", err);
      }
    );

    return () => unsubscribe();
  }, []);

  return {
    user,
    isLoading,
    isAuthenticated,
    error,
    signOut,
    refreshUser,
    clearError,
  };
};
