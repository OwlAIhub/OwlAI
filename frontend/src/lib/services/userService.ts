/* eslint-disable @typescript-eslint/no-unused-vars */
import { User } from "firebase/auth";
import {
  Timestamp,
  doc,
  getDoc,
  serverTimestamp,
  setDoc,
  updateDoc,
} from "firebase/firestore";
import { handleFirebaseError } from "../firebaseCheck";
import { db } from "../firebaseConfig";

export interface UserProfile {
  uid: string;
  phoneNumber: string;
  displayName?: string;
  email?: string;
  photoURL?: string;
  createdAt: Timestamp;
  updatedAt: Timestamp;
  lastLoginAt: Timestamp;
  isActive: boolean;
  metadata: {
    signUpMethod: "phone";
    deviceInfo?: string;
    ipAddress?: string;
  };
}

export interface CreateUserData {
  phoneNumber: string;
  displayName?: string;
  email?: string;
}

/**
 * Create or update user profile in Firestore
 */
export const createUserProfile = async (
  user: User,
  additionalData?: Partial<CreateUserData>,
): Promise<UserProfile> => {
  if (!user.uid) {
    throw new Error("User UID is required");
  }

  const userRef = doc(db, "users", user.uid);

  try {
    // Check if user already exists
    const userDoc = await getDoc(userRef);
    const now = serverTimestamp() as Timestamp;

    if (userDoc.exists()) {
      // User exists, update last login
      const updateData = {
        lastLoginAt: now,
        updatedAt: now,
        isActive: true,
        // Update phone number if it changed
        ...(user.phoneNumber && { phoneNumber: user.phoneNumber }),
      };

      await updateDoc(userRef, updateData);

      // Return updated user data
      const updatedDoc = await getDoc(userRef);
      return updatedDoc.data() as UserProfile;
    } else {
      // New user, create profile
      const userProfile: UserProfile = {
        uid: user.uid,
        phoneNumber: user.phoneNumber || additionalData?.phoneNumber || "",
        displayName: additionalData?.displayName || user.displayName || "",
        email: additionalData?.email || user.email || "",
        photoURL: user.photoURL || "",
        createdAt: now,
        updatedAt: now,
        lastLoginAt: now,
        isActive: true,
        metadata: {
          signUpMethod: "phone",
          deviceInfo:
            typeof window !== "undefined" ? navigator.userAgent : undefined,
        },
      };

      await setDoc(userRef, userProfile);
      return userProfile;
    }
  } catch (error) {
    console.error("Error creating/updating user profile:", error);
    const errorMessage = handleFirebaseError(error);
    throw new Error(`Failed to create user profile: ${errorMessage}`);
  }
};

/**
 * Get user profile from Firestore
 */
export const getUserProfile = async (
  uid: string,
): Promise<UserProfile | null> => {
  if (!uid) {
    throw new Error("User UID is required");
  }

  try {
    const userRef = doc(db, "users", uid);
    const userDoc = await getDoc(userRef);

    if (userDoc.exists()) {
      return userDoc.data() as UserProfile;
    }

    return null;
  } catch (error) {
    console.error("Error getting user profile:", error);
    const errorMessage = handleFirebaseError(error);
    throw new Error(`Failed to get user profile: ${errorMessage}`);
  }
};

/**
 * Update user profile
 */
export const updateUserProfile = async (
  uid: string,
  updateData: Partial<UserProfile>,
): Promise<void> => {
  if (!uid) {
    throw new Error("User UID is required");
  }

  try {
    const userRef = doc(db, "users", uid);
    const dataToUpdate = {
      ...updateData,
      updatedAt: serverTimestamp(),
    };

    await updateDoc(userRef, dataToUpdate);
  } catch (error) {
    console.error("Error updating user profile:", error);
    const errorMessage = handleFirebaseError(error);
    throw new Error(`Failed to update user profile: ${errorMessage}`);
  }
};

/**
 * Mark user as inactive (soft delete)
 */
export const deactivateUser = async (uid: string): Promise<void> => {
  if (!uid) {
    throw new Error("User UID is required");
  }

  try {
    await updateUserProfile(uid, {
      isActive: false,
      updatedAt: serverTimestamp() as Timestamp,
    });
  } catch (error) {
    console.error("Error deactivating user:", error);
    throw error;
  }
};

/**
 * Check if phone number is already registered
 */
export const isPhoneNumberRegistered = async (
  _phoneNumber: string,
): Promise<boolean> => {
  // Note: This would require a compound query or phone number index
  // For now, we'll rely on Firebase Auth's built-in duplicate prevention
  // In production, you might want to maintain a separate phone number index
  return false;
};
