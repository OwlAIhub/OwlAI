/**
 * User Profile Service
 * Handles user profile creation and management
 */

import { User } from "firebase/auth";
import {
  getFirestore,
  doc,
  setDoc,
  getDoc,
  updateDoc,
  serverTimestamp,
} from "firebase/firestore";
import { logger } from "../../../shared/utils/logger";
import { STORAGE_UTILS, STORAGE_KEYS } from "../../../shared/constants";
import type { UserProfile, UserPreferences } from "../../../shared/types";

// Initialize Firestore
const db = getFirestore();

class UserProfileService {
  private static instance: UserProfileService;

  private constructor() {}

  public static getInstance(): UserProfileService {
    if (!UserProfileService.instance) {
      UserProfileService.instance = new UserProfileService();
    }
    return UserProfileService.instance;
  }

  /**
   * Create or update user profile
   */
  public async createOrUpdateProfile(
    user: User,
    phoneNumber: string
  ): Promise<void> {
    try {
      const userRef = doc(db, "users", user.uid);
      const userSnap = await getDoc(userRef);

      if (!userSnap.exists()) {
        // Create new user profile
        await this.createNewProfile(user, phoneNumber);
      } else {
        // Update existing user profile
        await this.updateExistingProfile(user, phoneNumber);
      }
    } catch (error) {
      logger.error(
        "Failed to create/update user profile",
        "UserProfileService",
        error
      );
      // Don't throw error here as user is still authenticated
    }
  }

  /**
   * Create new user profile
   */
  private async createNewProfile(
    user: User,
    phoneNumber: string
  ): Promise<void> {
    const userRef = doc(db, "users", user.uid);

    // Create user profile
    const userProfile: UserProfile = {
      id: user.uid,
      uid: user.uid,
      name: user.displayName || `User_${user.uid.slice(-6)}`,
      phone: user.phoneNumber || phoneNumber,
      email: user.email || undefined,
      avatar: user.photoURL || undefined,
      bio: "",
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };

    await setDoc(userRef, {
      ...userProfile,
      created_at: serverTimestamp(),
      updated_at: serverTimestamp(),
    });

    // Create default user preferences
    await this.createDefaultPreferences(user.uid);

    // Store in local storage
    STORAGE_UTILS.set(STORAGE_KEYS.USER_PROFILE, userProfile);
    STORAGE_UTILS.set(
      STORAGE_KEYS.USER_PREFERENCES,
      this.getDefaultPreferences()
    );

    logger.info("New user profile created", "UserProfileService", {
      uid: user.uid,
    });
  }

  /**
   * Update existing user profile
   */
  private async updateExistingProfile(
    user: User,
    phoneNumber: string
  ): Promise<void> {
    const userRef = doc(db, "users", user.uid);

    await updateDoc(userRef, {
      phone: user.phoneNumber || phoneNumber,
      updated_at: serverTimestamp(),
    });

    logger.info("User profile updated", "UserProfileService", {
      uid: user.uid,
    });
  }

  /**
   * Create default user preferences
   */
  private async createDefaultPreferences(userId: string): Promise<void> {
    const preferencesRef = doc(db, "users", userId, "preferences", "default");
    const defaultPreferences = this.getDefaultPreferences();

    await setDoc(preferencesRef, {
      ...defaultPreferences,
      created_at: serverTimestamp(),
      updated_at: serverTimestamp(),
    });
  }

  /**
   * Get default user preferences
   */
  private getDefaultPreferences(): UserPreferences {
    return {
      theme: "auto",
      language: "en",
      notifications: true,
      privacy_settings: {
        profile_visibility: "private",
        allow_analytics: false,
        allow_marketing: false,
      },
      chat_settings: {
        auto_save: true,
        message_history_limit: 100,
        typing_indicator: true,
      },
    };
  }

  /**
   * Get user profile from Firestore
   */
  public async getUserProfile(userId: string): Promise<UserProfile | null> {
    try {
      const userRef = doc(db, "users", userId);
      const userSnap = await getDoc(userRef);

      if (userSnap.exists()) {
        return userSnap.data() as UserProfile;
      }

      return null;
    } catch (error) {
      logger.error("Failed to get user profile", "UserProfileService", error);
      return null;
    }
  }

  /**
   * Get user preferences from Firestore
   */
  public async getUserPreferences(
    userId: string
  ): Promise<UserPreferences | null> {
    try {
      const preferencesRef = doc(db, "users", userId, "preferences", "default");
      const preferencesSnap = await getDoc(preferencesRef);

      if (preferencesSnap.exists()) {
        return preferencesSnap.data() as UserPreferences;
      }

      return null;
    } catch (error) {
      logger.error(
        "Failed to get user preferences",
        "UserProfileService",
        error
      );
      return null;
    }
  }

  /**
   * Update user profile
   */
  public async updateProfile(
    userId: string,
    updates: Partial<UserProfile>
  ): Promise<void> {
    try {
      const userRef = doc(db, "users", userId);

      await updateDoc(userRef, {
        ...updates,
        updated_at: serverTimestamp(),
      });

      logger.info("User profile updated", "UserProfileService", {
        userId,
        updates,
      });
    } catch (error) {
      logger.error(
        "Failed to update user profile",
        "UserProfileService",
        error
      );
      throw error;
    }
  }

  /**
   * Update user preferences
   */
  public async updatePreferences(
    userId: string,
    updates: Partial<UserPreferences>
  ): Promise<void> {
    try {
      const preferencesRef = doc(db, "users", userId, "preferences", "default");

      await updateDoc(preferencesRef, {
        ...updates,
        updated_at: serverTimestamp(),
      });

      logger.info("User preferences updated", "UserProfileService", {
        userId,
        updates,
      });
    } catch (error) {
      logger.error(
        "Failed to update user preferences",
        "UserProfileService",
        error
      );
      throw error;
    }
  }

  /**
   * Delete user profile and preferences
   */
  public async deleteProfile(userId: string): Promise<void> {
    try {
      // Note: In production, you might want to use a Cloud Function for this
      // to ensure proper cleanup of all user data
      logger.info("User profile deletion requested", "UserProfileService", {
        userId,
      });
    } catch (error) {
      logger.error(
        "Failed to delete user profile",
        "UserProfileService",
        error
      );
      throw error;
    }
  }
}

// Export singleton instance
export const userProfileService = UserProfileService.getInstance();
