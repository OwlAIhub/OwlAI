import { doc, setDoc, getDoc, updateDoc, serverTimestamp, Timestamp } from 'firebase/firestore';
import { User } from 'firebase/auth';
import { db } from '../firebaseConfig';
import { handleFirebaseError } from '../firebaseCheck';

export interface OnboardingData {
  exam: 'UGC-NET' | 'CSIR-NET' | '';
  subject: string;
  attempt: '1st' | '2nd' | '3rd+' | '';
  examCycle: string;
  language: 'English' | 'Hinglish' | '';
  source: string;
}

export interface OnboardingProfile {
  uid: string;
  exam: 'UGC-NET' | 'CSIR-NET';
  subject: string;
  attempt: '1st' | '2nd' | '3rd+';
  examCycle?: string;
  language: 'English' | 'Hinglish';
  source?: string;
  completedAt: Timestamp;
  createdAt: Timestamp;
  updatedAt: Timestamp;
  isComplete: boolean;
  metadata: {
    userAgent?: string;
    completionTime?: number; // Time taken to complete onboarding in seconds
  };
}

// Supported exams and subjects
export const SUPPORTED_EXAMS = ['UGC-NET'] as const;
export const SUPPORTED_SUBJECTS = {
  'UGC-NET': [
    'Computer Science and Applications',
    'Economics',
    'History',
    'Law',
    'Commerce',
    'Political Science',
    'Psychology',
    'Management',
    'Education'
    // Note: 'Other' is not supported for now
  ],
  'CSIR-NET': [
    // CSIR-NET is not supported yet
  ]
} as const;

/**
 * Check if exam is supported
 */
export const isExamSupported = (exam: string): exam is typeof SUPPORTED_EXAMS[number] => {
  return SUPPORTED_EXAMS.includes(exam as typeof SUPPORTED_EXAMS[number]);
};

/**
 * Check if subject is supported for given exam
 */
export const isSubjectSupported = (exam: string, subject: string): boolean => {
  if (!isExamSupported(exam)) return false;
  const supportedSubjects = SUPPORTED_SUBJECTS[exam];
  return supportedSubjects.includes(subject as typeof supportedSubjects[number]);
};

/**
 * Get validation error message for unsupported exam/subject
 */
export const getValidationError = (exam: string, subject: string): string | null => {
  if (!isExamSupported(exam)) {
    return `Hey Aspirant,\n\nOwlAI is not yet trained for ${exam} category.\nWe're actively working to expand into more exams very soon.\nStay tuned - your prep buddy is on the way!`;
  }
  
  if (!isSubjectSupported(exam, subject)) {
    return `Hey Aspirant,\n\nOwlAI is not yet trained for ${subject} subject.\nWe're actively working to expand into more subjects very soon.\nStay tuned - your prep buddy is on the way!`;
  }
  
  return null;
};

/**
 * Check if user has completed onboarding
 */
export const hasCompletedOnboarding = async (uid: string): Promise<boolean> => {
  if (!uid) return false;
  
  try {
    const onboardingRef = doc(db, 'onboarding', uid);
    const onboardingDoc = await getDoc(onboardingRef);
    
    if (onboardingDoc.exists()) {
      const data = onboardingDoc.data() as OnboardingProfile;
      return data.isComplete === true;
    }
    
    return false;
  } catch (error) {
    console.error('Error checking onboarding status:', error);
    return false;
  }
};

/**
 * Get user's onboarding profile
 */
export const getOnboardingProfile = async (uid: string): Promise<OnboardingProfile | null> => {
  if (!uid) return null;
  
  try {
    const onboardingRef = doc(db, 'onboarding', uid);
    const onboardingDoc = await getDoc(onboardingRef);
    
    if (onboardingDoc.exists()) {
      return onboardingDoc.data() as OnboardingProfile;
    }
    
    return null;
  } catch (error) {
    console.error('Error getting onboarding profile:', error);
    return null;
  }
};

/**
 * Save onboarding responses to Firestore
 */
export const saveOnboardingData = async (
  user: User, 
  data: OnboardingData, 
  startTime?: number
): Promise<OnboardingProfile> => {
  if (!user.uid) {
    throw new Error('User UID is required');
  }

  // Validate required fields
  if (!data.exam || !data.subject || !data.attempt || !data.language) {
    throw new Error('Missing required onboarding data');
  }

  // Check if exam and subject are supported
  const validationError = getValidationError(data.exam, data.subject);
  if (validationError) {
    throw new Error(validationError);
  }

  const onboardingRef = doc(db, 'onboarding', user.uid);
  const now = serverTimestamp() as Timestamp;
  
  try {
    const onboardingProfile: OnboardingProfile = {
      uid: user.uid,
      exam: data.exam as 'UGC-NET' | 'CSIR-NET',
      subject: data.subject,
      attempt: data.attempt as '1st' | '2nd' | '3rd+',
      examCycle: data.examCycle || undefined,
      language: data.language as 'English' | 'Hinglish',
      source: data.source || undefined,
      completedAt: now,
      createdAt: now,
      updatedAt: now,
      isComplete: true,
      metadata: {
        userAgent: typeof window !== 'undefined' ? navigator.userAgent : undefined,
        completionTime: startTime ? Math.round((Date.now() - startTime) / 1000) : undefined
      }
    };
    
    await setDoc(onboardingRef, onboardingProfile);
    return onboardingProfile;
  } catch (error) {
    console.error('Error saving onboarding data:', error);
    const errorMessage = handleFirebaseError(error);
    throw new Error(`Failed to save onboarding data: ${errorMessage}`);
  }
};

/**
 * Update onboarding profile
 */
export const updateOnboardingData = async (
  uid: string, 
  updateData: Partial<OnboardingData>
): Promise<void> => {
  if (!uid) {
    throw new Error('User UID is required');
  }

  try {
    const onboardingRef = doc(db, 'onboarding', uid);
    const dataToUpdate = {
      ...updateData,
      updatedAt: serverTimestamp()
    };
    
    await updateDoc(onboardingRef, dataToUpdate);
  } catch (error) {
    console.error('Error updating onboarding data:', error);
    const errorMessage = handleFirebaseError(error);
    throw new Error(`Failed to update onboarding data: ${errorMessage}`);
  }
};

/**
 * Get onboarding completion statistics (for analytics)
 */
export const getOnboardingStats = async (uid: string): Promise<{
  hasCompleted: boolean;
  completedAt?: Date;
  exam?: string;
  subject?: string;
  attempt?: string;
  language?: string;
}> => {
  try {
    const profile = await getOnboardingProfile(uid);
    
    if (profile && profile.isComplete) {
      return {
        hasCompleted: true,
        completedAt: new Date(profile.completedAt.seconds * 1000),
        exam: profile.exam,
        subject: profile.subject,
        attempt: profile.attempt,
        language: profile.language
      };
    }
    
    return { hasCompleted: false };
  } catch (error) {
    console.error('Error getting onboarding stats:', error);
    return { hasCompleted: false };
  }
};