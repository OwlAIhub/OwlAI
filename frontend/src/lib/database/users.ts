/**
 * User database operations for Firestore
 * Handles all user-related CRUD operations
 */

import {
  Timestamp,
  deleteDoc,
  doc,
  getDoc,
  setDoc,
  updateDoc,
} from 'firebase/firestore';
import { db } from '../firebase';
import {
  DEFAULT_AVATAR,
  DEFAULT_USER_SETTINGS,
  OnboardingProgress,
  UserAnalytics,
  UserDocument,
  UserProfile,
  UserSettings,
} from '../types/user';

// Collection references
const USERS_COLLECTION = 'users';

/**
 * Create a new user profile after successful authentication
 */
export async function createUserProfile(
  userId: string,
  phoneNumber: string,
  name: string
): Promise<void> {
  try {
    const userRef = doc(db, USERS_COLLECTION, userId);

    const now = new Date();

    const userProfile: UserProfile = {
      phoneNumber,
      name,
      exam: {
        type: 'UGC-NET', // Default, will be updated in questionnaire
        subject: 'Computer Science and Applications', // Default
        attempt: '1st', // Default
        language: 'English', // Default
      },
      marketing: {
        source: 'Other',
        attribution: 'other',
      },
      avatar: {
        ...DEFAULT_AVATAR,
        initials: generateInitials(name),
      },
      createdAt: now,
      updatedAt: now,
      lastActive: now,
      onboardingCompleted: false,
      profileCompleteness: 20, // Basic info only
    };

    const userSettings: UserSettings = {
      ...DEFAULT_USER_SETTINGS,
      language: 'English', // Will be updated in questionnaire
    };

    const userAnalytics: UserAnalytics = {
      totalLogins: 1,
      totalSessions: 1,
      totalMessages: 0,
      lastLoginAt: now,
      lastActiveAt: now,
      sessionDuration: '0m',
      profileViews: 0,
      profileCompleteness: 20,
      onboardingTime: '0s',
      questionnaire: {
        completedAt: now,
        timeToComplete: '0s',
        stepsCompleted: 0,
        totalSteps: 6,
      },
    };

    const onboardingProgress: OnboardingProgress = {
      currentStep: 1,
      completedSteps: [],
      answers: {},
      startedAt: now,
      lastUpdated: now,
      isCompleted: false,
    };

    const userDocument: UserDocument = {
      profile: userProfile,
      settings: userSettings,
      analytics: userAnalytics,
      onboarding: {
        progress: onboardingProgress,
        completed: false,
      },
    };

    await setDoc(userRef, {
      ...userDocument,
      // Convert Dates to Firestore Timestamps
      profile: {
        ...userProfile,
        createdAt: Timestamp.fromDate(userProfile.createdAt),
        updatedAt: Timestamp.fromDate(userProfile.updatedAt),
        lastActive: Timestamp.fromDate(userProfile.lastActive),
      },
      analytics: {
        ...userAnalytics,
        lastLoginAt: Timestamp.fromDate(userAnalytics.lastLoginAt),
        lastActiveAt: Timestamp.fromDate(userAnalytics.lastActiveAt),
        questionnaire: {
          ...userAnalytics.questionnaire,
          completedAt: Timestamp.fromDate(
            userAnalytics.questionnaire.completedAt
          ),
        },
      },
      onboarding: {
        ...userDocument.onboarding,
        progress: {
          ...onboardingProgress,
          startedAt: Timestamp.fromDate(onboardingProgress.startedAt),
          lastUpdated: Timestamp.fromDate(onboardingProgress.lastUpdated),
        },
      },
    });

    console.log('User profile created successfully:', userId);
  } catch (error) {
    console.error('Error creating user profile:', error);
    throw new Error('Failed to create user profile');
  }
}

/**
 * Get user profile by ID
 */
export async function getUserProfile(
  userId: string
): Promise<UserDocument | null> {
  try {
    const userRef = doc(db, USERS_COLLECTION, userId);
    const userSnap = await getDoc(userRef);

    if (!userSnap.exists()) {
      return null;
    }

    const userData = userSnap.data();

    // Convert Firestore Timestamps back to Dates
    return {
      profile: {
        ...userData.profile,
        createdAt: userData.profile.createdAt.toDate(),
        updatedAt: userData.profile.updatedAt.toDate(),
        lastActive: userData.profile.lastActive.toDate(),
      },
      settings: userData.settings,
      analytics: {
        ...userData.analytics,
        lastLoginAt: userData.analytics.lastLoginAt.toDate(),
        lastActiveAt: userData.analytics.lastActiveAt.toDate(),
        questionnaire: {
          ...userData.analytics.questionnaire,
          completedAt: userData.analytics.questionnaire.completedAt.toDate(),
        },
      },
      onboarding: {
        ...userData.onboarding,
        progress: {
          ...userData.onboarding.progress,
          startedAt: userData.onboarding.progress.startedAt.toDate(),
          lastUpdated: userData.onboarding.progress.lastUpdated.toDate(),
        },
      },
    };
  } catch (error) {
    console.error('Error getting user profile:', error);
    throw new Error('Failed to get user profile');
  }
}

/**
 * Update user profile
 */
export async function updateUserProfile(
  userId: string,
  updates: Partial<UserProfile>
): Promise<void> {
  try {
    const userRef = doc(db, USERS_COLLECTION, userId);

    const updateData = {
      ...updates,
      updatedAt: Timestamp.fromDate(new Date()),
    };

    await updateDoc(userRef, {
      profile: updateData,
    });

    console.log('User profile updated successfully:', userId);
  } catch (error) {
    console.error('Error updating user profile:', error);
    throw new Error('Failed to update user profile');
  }
}

/**
 * Update user settings
 */
export async function updateUserSettings(
  userId: string,
  updates: Partial<UserSettings>
): Promise<void> {
  try {
    const userRef = doc(db, USERS_COLLECTION, userId);

    await updateDoc(userRef, {
      settings: updates,
    });

    console.log('User settings updated successfully:', userId);
  } catch (error) {
    console.error('Error updating user settings:', error);
    throw new Error('Failed to update user settings');
  }
}

/**
 * Update onboarding progress
 */
export async function updateOnboardingProgress(
  userId: string,
  progress: Partial<OnboardingProgress>
): Promise<void> {
  try {
    const userRef = doc(db, USERS_COLLECTION, userId);

    const updateData = {
      ...progress,
      lastUpdated: Timestamp.fromDate(new Date()),
    };

    await updateDoc(userRef, {
      'onboarding.progress': updateData,
    });

    console.log('Onboarding progress updated successfully:', userId);
  } catch (error) {
    console.error('Error updating onboarding progress:', error);
    throw new Error('Failed to update onboarding progress');
  }
}

/**
 * Complete onboarding and update profile
 */
export async function completeOnboarding(
  userId: string,
  questionnaireAnswers: OnboardingProgress['answers']
): Promise<void> {
  try {
    const userRef = doc(db, USERS_COLLECTION, userId);
    const now = new Date();

    // Calculate profile completeness
    const profileCompleteness =
      calculateProfileCompleteness(questionnaireAnswers);

    // Update profile with questionnaire answers
    const profileUpdates = {
      exam: {
        type: questionnaireAnswers.exam,
        subject: questionnaireAnswers.subject,
        attempt: questionnaireAnswers.attempt,
        cycle: questionnaireAnswers.cycle,
        language: questionnaireAnswers.language,
      },
      marketing: {
        source: questionnaireAnswers.marketingSource,
        attribution: getMarketingAttribution(
          questionnaireAnswers.marketingSource
        ),
      },
      onboardingCompleted: true,
      profileCompleteness,
      updatedAt: Timestamp.fromDate(now),
      lastActive: Timestamp.fromDate(now),
    };

    // Update onboarding status
    const onboardingUpdates = {
      progress: {
        currentStep: 6,
        completedSteps: [1, 2, 3, 4, 5, 6],
        answers: questionnaireAnswers,
        isCompleted: true,
        lastUpdated: Timestamp.fromDate(now),
      },
      completed: true,
    };

    // Update analytics
    const analyticsUpdates = {
      profileCompleteness,
      lastActiveAt: Timestamp.fromDate(now),
      questionnaire: {
        completedAt: Timestamp.fromDate(now),
        timeToComplete: '0s', // Will be calculated
        stepsCompleted: 6,
        totalSteps: 6,
      },
    };

    await updateDoc(userRef, {
      profile: profileUpdates,
      onboarding: onboardingUpdates,
      analytics: analyticsUpdates,
    });

    console.log('Onboarding completed successfully:', userId);
  } catch (error) {
    console.error('Error completing onboarding:', error);
    throw new Error('Failed to complete onboarding');
  }
}

/**
 * Update user analytics
 */
export async function updateUserAnalytics(
  userId: string,
  updates: Partial<UserAnalytics>
): Promise<void> {
  try {
    const userRef = doc(db, USERS_COLLECTION, userId);

    const updateData = {
      ...updates,
      lastActiveAt: Timestamp.fromDate(new Date()),
    };

    await updateDoc(userRef, {
      analytics: updateData,
    });

    console.log('User analytics updated successfully:', userId);
  } catch (error) {
    console.error('Error updating user analytics:', error);
    throw new Error('Failed to update user analytics');
  }
}

/**
 * Delete user profile
 */
export async function deleteUserProfile(userId: string): Promise<void> {
  try {
    const userRef = doc(db, USERS_COLLECTION, userId);
    await deleteDoc(userRef);

    console.log('User profile deleted successfully:', userId);
  } catch (error) {
    console.error('Error deleting user profile:', error);
    throw new Error('Failed to delete user profile');
  }
}

/**
 * Check if user exists
 */
export async function userExists(userId: string): Promise<boolean> {
  try {
    const userRef = doc(db, USERS_COLLECTION, userId);
    const userSnap = await getDoc(userRef);
    return userSnap.exists();
  } catch (error) {
    console.error('Error checking if user exists:', error);
    return false;
  }
}

// Helper functions
function generateInitials(name: string): string {
  return name
    .split(' ')
    .map(word => word.charAt(0))
    .join('')
    .toUpperCase()
    .substring(0, 2);
}

function calculateProfileCompleteness(
  answers: OnboardingProgress['answers']
): number {
  let completeness = 20; // Basic info (name, phone)

  if (answers.exam) completeness += 15;
  if (answers.subject) completeness += 15;
  if (answers.attempt) completeness += 15;
  if (answers.language) completeness += 15;
  if (answers.cycle) completeness += 10;
  if (answers.marketingSource) completeness += 10;

  return Math.min(completeness, 100);
}

function getMarketingAttribution(
  source?: string
): 'organic' | 'social' | 'referral' | 'other' {
  if (!source) return 'other';

  if (source === 'Google Search') return 'organic';
  if (source === 'Instagram Reel' || source === 'YouTube') return 'social';
  if (source === 'Friend / Senior' || source === 'Teacher / Coaching')
    return 'referral';

  return 'other';
}
