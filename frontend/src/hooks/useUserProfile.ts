/**
 * User Profile Hook - Handles user profile initialization and management
 */

import { useAuth } from '@/components/auth/providers/AuthProvider';
import { userService } from '@/lib/services/userService';
import type { UserProfile } from '@/lib/types/database';
import { useCallback, useEffect, useState } from 'react';

export interface UseUserProfileReturn {
  userProfile: UserProfile | null;
  isLoading: boolean;
  error: string | null;
  initializeUser: () => Promise<void>;
  updateProfile: (updates: Partial<UserProfile>) => Promise<void>;
}

export function useUserProfile(): UseUserProfileReturn {
  const { user } = useAuth();
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadUserProfile = useCallback(async () => {
    if (!user?.id) {
      setUserProfile(null);
      setError(null);
      return;
    }

    try {
      setIsLoading(true);
      setError(null);

      // Check if user is authenticated with Firebase
      if (!user.isAuthenticated) {
        throw new Error('User not authenticated with Firebase');
      }

      let profile = await userService.getUserProfile(user.id);

      if (!profile) {
        // Create new user profile
        profile = await userService.createUserProfile({
          id: user.id,
          phoneNumber: user.phoneNumber || '',
          displayName: user.name || undefined,
        });
      } else {
        // Update last login
        await userService.updateLastLogin(user.id);
      }

      setUserProfile(profile);
    } catch (error: unknown) {
      console.error('Failed to load user profile:', error);

      // Provide more specific error messages
      const errorObj = error as { code?: string; message?: string };
      if (errorObj?.code === 'permission-denied') {
        setError(
          'Permission denied. Please ensure you are properly authenticated.'
        );
      } else if (errorObj?.code === 'unauthenticated') {
        setError('Authentication required. Please sign in again.');
      } else if (errorObj?.message?.includes('Firebase')) {
        setError(
          'Firebase connection error. Please check your internet connection.'
        );
      } else {
        setError(errorObj?.message || 'Failed to load user profile');
      }
    } finally {
      setIsLoading(false);
    }
  }, [user?.id, user?.name, user?.phoneNumber, user?.isAuthenticated]);

  useEffect(() => {
    if (user?.id) {
      loadUserProfile();
    } else {
      setUserProfile(null);
    }
  }, [user?.id, loadUserProfile]);

  const initializeUser = async () => {
    await loadUserProfile();
  };

  const updateProfile = async (updates: Partial<UserProfile>) => {
    if (!user?.id || !userProfile) return;

    try {
      const updatedProfile = await userService.updateUserProfile(
        user.id,
        updates
      );
      setUserProfile(updatedProfile);
    } catch (error) {
      console.error('Failed to update profile:', error);
      setError('Failed to update profile');
    }
  };

  return {
    userProfile,
    isLoading,
    error,
    initializeUser,
    updateProfile,
  };
}
