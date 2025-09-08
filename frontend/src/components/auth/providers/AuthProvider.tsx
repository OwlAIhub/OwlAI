'use client';

import { clearAuthUser, getAuthUser, setAuthUser, User } from '@/lib/auth';
import { auth } from '@/lib/firebase';
import {
  User as FirebaseUser,
  onAuthStateChanged,
  signOut,
} from 'firebase/auth';
import { createContext, useContext, useEffect, useState } from 'react';

interface AuthContextType {
  user: User | null;
  firebaseUser: FirebaseUser | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  logout: () => Promise<void>;
  refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

interface AuthProviderProps {
  children: React.ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<User | null>(null);
  const [firebaseUser, setFirebaseUser] = useState<FirebaseUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const refreshUser = async () => {
    if (typeof window === 'undefined') return;

    try {
      const localUser = getAuthUser();
      if (localUser && firebaseUser) {
        // For now, just use local user data
        setUser(localUser);
      }
    } catch (error) {
      console.error('Error refreshing user:', error);
    }
  };

  const logout = async () => {
    try {
      // Sign out from Firebase
      await signOut(auth);

      // Clear local storage
      localStorage.removeItem('owlai_user');

      // Reset state
      setUser(null);
      setFirebaseUser(null);
    } catch (error) {
      console.error('Error during logout:', error);
    }
  };

  useEffect(() => {
    let unsubscribe: (() => void) | undefined;

    const initializeAuth = () => {
      if (typeof window === 'undefined') return;

      unsubscribe = onAuthStateChanged(auth, async firebaseUser => {
        try {
          setFirebaseUser(firebaseUser);

          if (firebaseUser) {
            // Firebase user exists - always use Firebase UID as the primary ID
            const localUser = getAuthUser();

            // Create or update user with Firebase UID
            const authenticatedUser = {
              id: firebaseUser.uid, // Always use Firebase UID
              phoneNumber: firebaseUser.phoneNumber || '',
              name: firebaseUser.displayName || localUser?.name,
              email: firebaseUser.email || localUser?.email,
              isAuthenticated: true,
              createdAt: localUser?.createdAt || new Date(),
              lastLoginAt: new Date(),
              onboardingCompleted: localUser?.onboardingCompleted || false,
            };
            
            setAuthUser(authenticatedUser);
            setUser(authenticatedUser);
          } else {
            // No Firebase user - clear local auth
            clearAuthUser();
            setUser(null);
          }
        } catch (error) {
          console.error('Auth state change error:', error);
          setUser(null);
        } finally {
          setIsLoading(false);
        }
      });
    };

    initializeAuth();

    return () => {
      if (unsubscribe) {
        unsubscribe();
      }
    };
  }, []);

  const value: AuthContextType = {
    user,
    firebaseUser,
    isLoading,
    isAuthenticated: !!user?.isAuthenticated,
    logout,
    refreshUser,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
