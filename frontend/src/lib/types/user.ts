/**
 * User-related TypeScript interfaces
 * This file defines all user data structures for the questionnaire system
 */

// Exam types
export type ExamType = 'UGC-NET' | 'CSIR-NET';
export type AttemptType = '1st' | '2nd' | '3rd+';
export type LanguageType = 'English' | 'Hinglish';
export type ExamCycleType = 'June 2025' | 'Dec 2025' | 'Jan 2026' | 'June 2026';

// Subject types
export type UGCNetSubject =
  | 'Computer Science and Applications'
  | 'Economics'
  | 'History'
  | 'Law'
  | 'Commerce'
  | 'Political Science'
  | 'Psychology'
  | 'Management'
  | 'Education'
  | 'Other';

export type CSIRNetSubject =
  | 'Chemical Sciences'
  | 'Earth Sciences'
  | 'Life Sciences'
  | 'Mathematical Sciences'
  | 'Physical Sciences';

export type SubjectType = UGCNetSubject | CSIRNetSubject;

// Marketing source types
export type MarketingSource =
  | 'Google Search'
  | 'Instagram Reel'
  | 'YouTube'
  | 'Friend / Senior'
  | 'Teacher / Coaching'
  | 'Other';

// Avatar types
export type AvatarType = 'initials' | 'upload' | 'ai';
export type ThemeType = 'light' | 'dark' | 'system';

// User profile interface
export interface UserProfile {
  // Basic Info
  phoneNumber: string;
  name: string;
  bio?: string;

  // Onboarding Data
  exam: {
    type: ExamType;
    subject: SubjectType;
    attempt: AttemptType;
    cycle?: ExamCycleType;
    language: LanguageType;
  };

  // Marketing
  marketing: {
    source?: MarketingSource;
    attribution?: 'organic' | 'social' | 'referral' | 'other';
  };

  // Avatar
  avatar: {
    type: AvatarType;
    url?: string;
    initials?: string;
    color?: string;
  };

  // Timestamps
  createdAt: Date;
  updatedAt: Date;
  lastActive: Date;

  // Profile Status
  onboardingCompleted: boolean;
  profileCompleteness: number; // 0-100
}

// User settings interface
export interface UserSettings {
  // App Preferences
  theme: ThemeType;
  language: LanguageType;

  // Notifications
  notifications: {
    enabled: boolean;
    chatMessages: boolean;
    systemUpdates: boolean;
    marketing: boolean;
  };

  // Privacy
  privacy: {
    showOnlineStatus: boolean;
    allowDataAnalytics: boolean;
    shareUsageData: boolean;
  };

  // Chat Preferences
  chat: {
    botPersonality: 'helpful_tutor' | 'strict_teacher' | 'friendly_mentor';
    messageHistory: 'forever' | '30days' | '7days';
    typingIndicators: boolean;
    soundEffects: boolean;
  };
}

// User analytics interface
export interface UserAnalytics {
  // Usage Stats
  totalLogins: number;
  totalSessions: number;
  totalMessages: number;

  // Activity Tracking
  lastLoginAt: Date;
  lastActiveAt: Date;
  sessionDuration: string; // "2h 30m"

  // Profile Stats
  profileViews: number;
  profileCompleteness: number; // 0-100
  onboardingTime: string; // "2m 30s"

  // Questionnaire Analytics
  questionnaire: {
    completedAt: Date;
    timeToComplete: string; // "3m 45s"
    stepsCompleted: number;
    totalSteps: number;
    dropOffStep?: number; // If user didn't complete
  };
}

// Onboarding progress interface
export interface OnboardingProgress {
  currentStep: number;
  completedSteps: number[];
  answers: Partial<{
    exam: ExamType;
    subject: SubjectType;
    attempt: AttemptType;
    cycle: ExamCycleType;
    language: LanguageType;
    marketingSource: MarketingSource;
  }>;
  startedAt: Date;
  lastUpdated: Date;
  isCompleted: boolean;
}

// Complete user document interface
export interface UserDocument {
  profile: UserProfile;
  settings: UserSettings;
  analytics: UserAnalytics;
  onboarding: {
    progress: OnboardingProgress;
    completed: boolean;
  };
}

// Questionnaire step interface
export interface QuestionnaireStep {
  id: number;
  title: string;
  description: string;
  isRequired: boolean;
  isCompleted: boolean;
  component: string; // Component name to render
}

// Questionnaire configuration
export interface QuestionnaireConfig {
  steps: QuestionnaireStep[];
  totalSteps: number;
  requiredSteps: number[];
  optionalSteps: number[];
}

// Default values
export const DEFAULT_USER_SETTINGS: UserSettings = {
  theme: 'system',
  language: 'English',
  notifications: {
    enabled: true,
    chatMessages: true,
    systemUpdates: true,
    marketing: false,
  },
  privacy: {
    showOnlineStatus: true,
    allowDataAnalytics: true,
    shareUsageData: false,
  },
  chat: {
    botPersonality: 'helpful_tutor',
    messageHistory: 'forever',
    typingIndicators: true,
    soundEffects: true,
  },
};

export const DEFAULT_AVATAR = {
  type: 'initials' as AvatarType,
  color: '#0d9488',
};

// Subject lists for validation
export const UGC_NET_SUBJECTS: UGCNetSubject[] = [
  'Computer Science and Applications',
  'Economics',
  'History',
  'Law',
  'Commerce',
  'Political Science',
  'Psychology',
  'Management',
  'Education',
  'Other',
];

export const CSIR_NET_SUBJECTS: CSIRNetSubject[] = [
  'Chemical Sciences',
  'Earth Sciences',
  'Life Sciences',
  'Mathematical Sciences',
  'Physical Sciences',
];

// Marketing sources
export const MARKETING_SOURCES: MarketingSource[] = [
  'Google Search',
  'Instagram Reel',
  'YouTube',
  'Friend / Senior',
  'Teacher / Coaching',
  'Other',
];

// Exam cycles
export const EXAM_CYCLES: ExamCycleType[] = [
  'June 2025',
  'Dec 2025',
  'Jan 2026',
  'June 2026',
];
