import {
  FieldValue,
  Timestamp,
  collection,
  deleteDoc,
  doc,
  getDoc,
  getDocs,
  query,
  serverTimestamp,
  setDoc,
  updateDoc,
  where,
} from 'firebase/firestore';
import { QuestionnaireData, User } from './auth';
import { db } from './firebase';

// Firestore collection names
export const COLLECTIONS = {
  USERS: 'users',
  QUESTIONNAIRES: 'questionnaires',
} as const;

// User document interface for Firestore
export interface FirestoreUser {
  id: string;
  phoneNumber: string;
  fullName?: string;
  isAuthenticated: boolean;
  isQuestionnaireComplete: boolean;
  questionnaireData?: QuestionnaireData;
  createdAt: Timestamp | FieldValue; // Firestore timestamp
  updatedAt: Timestamp | FieldValue; // Firestore timestamp
  lastLoginAt?: Timestamp | FieldValue; // Firestore timestamp
}

// Error handling class
export class FirestoreError extends Error {
  constructor(
    message: string,
    public code?: string,
    public originalError?: unknown
  ) {
    super(message);
    this.name = 'FirestoreError';
  }
}

// Firestore service class
export class FirestoreService {
  /**
   * Create a new user document in Firestore
   */
  static async createUser(
    userData: Omit<FirestoreUser, 'createdAt' | 'updatedAt'>
  ): Promise<void> {
    try {
      const userRef = doc(db, COLLECTIONS.USERS, userData.id);
      const now = serverTimestamp();

      const firestoreUser: FirestoreUser = {
        ...userData,
        createdAt: now,
        updatedAt: now,
      };

      await setDoc(userRef, firestoreUser);
      console.log('User created in Firestore:', userData.id);
    } catch (error) {
      console.error('Error creating user in Firestore:', error);
      throw new FirestoreError(
        'Failed to create user account. Please try again.',
        'CREATE_USER_FAILED',
        error
      );
    }
  }

  /**
   * Get user document from Firestore
   */
  static async getUser(userId: string): Promise<FirestoreUser | null> {
    try {
      const userRef = doc(db, COLLECTIONS.USERS, userId);
      const userSnap = await getDoc(userRef);

      if (userSnap.exists()) {
        return userSnap.data() as FirestoreUser;
      }

      return null;
    } catch (error) {
      console.error('Error getting user from Firestore:', error);
      throw new FirestoreError(
        'Failed to retrieve user data. Please try again.',
        'GET_USER_FAILED',
        error
      );
    }
  }

  /**
   * Get user by phone number
   */
  static async getUserByPhone(
    phoneNumber: string
  ): Promise<FirestoreUser | null> {
    try {
      const usersRef = collection(db, COLLECTIONS.USERS);
      const q = query(usersRef, where('phoneNumber', '==', phoneNumber));
      const querySnapshot = await getDocs(q);

      if (!querySnapshot.empty) {
        const userDoc = querySnapshot.docs[0];
        return userDoc.data() as FirestoreUser;
      }

      return null;
    } catch (error) {
      console.error('Error getting user by phone from Firestore:', error);
      throw new FirestoreError(
        'Failed to retrieve user data. Please try again.',
        'GET_USER_BY_PHONE_FAILED',
        error
      );
    }
  }

  /**
   * Update user document in Firestore
   */
  static async updateUser(
    userId: string,
    updates: Partial<FirestoreUser>
  ): Promise<void> {
    try {
      const userRef = doc(db, COLLECTIONS.USERS, userId);
      const updateData = {
        ...updates,
        updatedAt: serverTimestamp(),
      };

      await updateDoc(userRef, updateData);
      console.log('User updated in Firestore:', userId);
    } catch (error) {
      console.error('Error updating user in Firestore:', error);
      throw new FirestoreError(
        'Failed to update user data. Please try again.',
        'UPDATE_USER_FAILED',
        error
      );
    }
  }

  /**
   * Update user's questionnaire data
   */
  static async updateQuestionnaireData(
    userId: string,
    questionnaireData: QuestionnaireData
  ): Promise<void> {
    try {
      const userRef = doc(db, COLLECTIONS.USERS, userId);
      const updateData = {
        questionnaireData,
        isQuestionnaireComplete: true,
        updatedAt: serverTimestamp(),
      };

      await updateDoc(userRef, updateData);
      console.log('Questionnaire data updated in Firestore:', userId);
    } catch (error) {
      console.error('Error updating questionnaire data in Firestore:', error);
      throw new FirestoreError(
        'Failed to save questionnaire data. Please try again.',
        'UPDATE_QUESTIONNAIRE_FAILED',
        error
      );
    }
  }

  /**
   * Update user's last login timestamp
   */
  static async updateLastLogin(userId: string): Promise<void> {
    try {
      const userRef = doc(db, COLLECTIONS.USERS, userId);
      const updateData = {
        lastLoginAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      };

      await updateDoc(userRef, updateData);
      console.log('Last login updated in Firestore:', userId);
    } catch (error) {
      console.error('Error updating last login in Firestore:', error);
      // Don't throw error for last login update - it's not critical
    }
  }

  /**
   * Delete user document from Firestore
   */
  static async deleteUser(userId: string): Promise<void> {
    try {
      const userRef = doc(db, COLLECTIONS.USERS, userId);
      await deleteDoc(userRef);
      console.log('User deleted from Firestore:', userId);
    } catch (error) {
      console.error('Error deleting user from Firestore:', error);
      throw new FirestoreError(
        'Failed to delete user account. Please try again.',
        'DELETE_USER_FAILED',
        error
      );
    }
  }

  /**
   * Convert Firestore user to local User interface
   */
  static convertToLocalUser(firestoreUser: FirestoreUser): User {
    return {
      id: firestoreUser.id,
      phoneNumber: firestoreUser.phoneNumber,
      isAuthenticated: firestoreUser.isAuthenticated,
      isQuestionnaireComplete: firestoreUser.isQuestionnaireComplete,
      questionnaireData: firestoreUser.questionnaireData,
    };
  }

  /**
   * Convert local User to Firestore user interface
   */
  static convertToFirestoreUser(
    localUser: User
  ): Omit<FirestoreUser, 'createdAt' | 'updatedAt'> {
    return {
      id: localUser.id,
      phoneNumber: localUser.phoneNumber,
      fullName: localUser.questionnaireData?.fullName,
      isAuthenticated: localUser.isAuthenticated,
      isQuestionnaireComplete: Boolean(localUser.isQuestionnaireComplete),
      questionnaireData: localUser.questionnaireData,
    };
  }
}

// Helper function to handle Firestore errors gracefully
export function handleFirestoreError(error: unknown): string {
  if (error instanceof FirestoreError) {
    return error.message;
  }

  // Handle specific Firestore error codes
  if (error && typeof error === 'object' && 'code' in error) {
    const firestoreError = error as { code: string };
    switch (firestoreError.code) {
      case 'permission-denied':
        return 'You do not have permission to perform this action.';
      case 'unavailable':
        return 'Service is temporarily unavailable. Please try again later.';
      case 'deadline-exceeded':
        return 'Request timed out. Please check your connection and try again.';
      case 'resource-exhausted':
        return 'Too many requests. Please wait a moment and try again.';
      default:
        return 'An unexpected error occurred. Please try again.';
    }
  }

  return 'An unexpected error occurred. Please try again.';
}
