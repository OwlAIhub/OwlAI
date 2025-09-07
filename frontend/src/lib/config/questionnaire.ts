/**
 * Questionnaire configuration and constants
 * Defines the step-by-step questionnaire flow
 */

import {
  CSIR_NET_SUBJECTS,
  QuestionnaireConfig,
  QuestionnaireStep,
  UGC_NET_SUBJECTS,
} from '../types/user';

// Questionnaire steps configuration
export const QUESTIONNAIRE_STEPS: QuestionnaireStep[] = [
  {
    id: 1,
    title: 'Which Govt. exam are you studying for?',
    description: 'Kaunsa Govt. exam clear karna hai?',
    isRequired: true,
    isCompleted: false,
    component: 'ExamSelection',
  },
  {
    id: 2,
    title: 'Select your Paper-2 subject',
    description: 'Paper-2 ka subject chuniye',
    isRequired: true,
    isCompleted: false,
    component: 'SubjectSelection',
  },
  {
    id: 3,
    title: 'Is this your 1st, 2nd or 3rd+ attempt?',
    description: 'Yeh aap ka pehla, doosra ya teesra + attempt hai?',
    isRequired: true,
    isCompleted: false,
    component: 'AttemptSelection',
  },
  {
    id: 4,
    title: 'Which exam cycle are you aiming for?',
    description: 'Kaun-si exam cycle aapki target hai? (Skip kar sakte ho)',
    isRequired: false,
    isCompleted: false,
    component: 'ExamCycleSelection',
  },
  {
    id: 5,
    title: 'App language?',
    description: 'Kis bhasha mein padhna pasand karoge?',
    isRequired: true,
    isCompleted: false,
    component: 'LanguageSelection',
  },
  {
    id: 6,
    title: 'Where did you find OwlAI?',
    description: 'OwlAI ke barein mein kahan se pata chala?',
    isRequired: false,
    isCompleted: false,
    component: 'MarketingSourceSelection',
  },
];

// Questionnaire configuration
export const QUESTIONNAIRE_CONFIG: QuestionnaireConfig = {
  steps: QUESTIONNAIRE_STEPS,
  totalSteps: 6,
  requiredSteps: [1, 2, 3, 5], // Steps that must be completed
  optionalSteps: [4, 6], // Steps that can be skipped
};

// Exam-specific configurations
export const EXAM_CONFIGS = {
  'UGC-NET': {
    name: 'UGC-NET',
    description: 'Most Popular',
    logo: '/logos/ugc-net.png', // You'll need to add this
    subjects: UGC_NET_SUBJECTS,
    defaultLanguage: 'English' as const,
    supported: true,
  },
  'CSIR-NET': {
    name: 'CSIR-NET',
    description: 'Science Focus',
    logo: '/logos/csir-net.png', // You'll need to add this
    subjects: CSIR_NET_SUBJECTS,
    defaultLanguage: 'Hinglish' as const,
    supported: true,
  },
};

// Attempt configurations
export const ATTEMPT_CONFIGS = {
  '1st': {
    emoji: '🤞',
    title: '1st Attempt',
    description: 'New to this exam',
    color: '#10b981', // Green
  },
  '2nd': {
    emoji: '🔄',
    title: '2nd Attempt',
    description: 'Second time around',
    color: '#f59e0b', // Amber
  },
  '3rd+': {
    emoji: '💪',
    title: '3rd+ Attempt',
    description: 'Pro grinder',
    color: '#ef4444', // Red
  },
};

// Language configurations
export const LANGUAGE_CONFIGS = {
  English: {
    name: 'English',
    flag: '🇺🇸',
    description: 'Full English interface',
  },
  Hinglish: {
    name: 'Hinglish',
    flag: '🇮🇳',
    description: 'Hindi + English mix',
  },
};

// Marketing source configurations
export const MARKETING_CONFIGS = {
  'Google Search': {
    name: 'Google Search',
    icon: '🔍',
    category: 'organic',
  },
  'Instagram Reel': {
    name: 'Instagram Reel',
    icon: '📱',
    category: 'social',
  },
  YouTube: {
    name: 'YouTube',
    icon: '📺',
    category: 'social',
  },
  'Friend / Senior': {
    name: 'Friend / Senior',
    icon: '👥',
    category: 'referral',
  },
  'Teacher / Coaching': {
    name: 'Teacher / Coaching',
    icon: '👨‍🏫',
    category: 'referral',
  },
  Other: {
    name: 'Other',
    icon: '❓',
    category: 'other',
  },
};

// Exam cycle configurations
export const EXAM_CYCLE_CONFIGS = {
  'June 2025': {
    name: 'June 2025',
    months: '6 months',
    urgency: 'high',
  },
  'Dec 2025': {
    name: 'Dec 2025',
    months: '12 months',
    urgency: 'medium',
  },
  'Jan 2026': {
    name: 'Jan 2026',
    months: '13 months',
    urgency: 'low',
  },
  'June 2026': {
    name: 'June 2026',
    months: '18 months',
    urgency: 'low',
  },
};

// Validation rules
export const VALIDATION_RULES = {
  name: {
    minLength: 2,
    maxLength: 50,
    pattern: /^[a-zA-Z\s]+$/,
    message: 'Name must be 2-50 characters and contain only letters and spaces',
  },
  phoneNumber: {
    pattern: /^\+[1-9]\d{1,14}$/,
    message: 'Please enter a valid phone number',
  },
};

// Error messages
export const ERROR_MESSAGES = {
  REQUIRED_FIELD: 'This field is required',
  INVALID_SELECTION: 'Please select a valid option',
  NETWORK_ERROR: 'Network error. Please try again.',
  UNSUPPORTED_EXAM: 'This exam is not yet supported. Please choose UGC-NET.',
  UNSUPPORTED_SUBJECT:
    'This subject is not yet supported. Please choose Paper-1.',
  SESSION_EXPIRED: 'Your session has expired. Please start over.',
  VALIDATION_ERROR: 'Please check your input and try again.',
};

// Success messages
export const SUCCESS_MESSAGES = {
  PROFILE_CREATED: 'Profile created successfully!',
  PROFILE_UPDATED: 'Profile updated successfully!',
  ONBOARDING_COMPLETED: 'Welcome to OwlAI! Your profile is ready.',
  PROGRESS_SAVED: 'Your progress has been saved.',
};

// Local storage keys
export const STORAGE_KEYS = {
  ONBOARDING_PROGRESS: 'owlai_onboarding_progress',
  QUESTIONNAIRE_ANSWERS: 'owlai_questionnaire_answers',
  CURRENT_STEP: 'owlai_current_step',
  USER_PREFERENCES: 'owlai_user_preferences',
};

// API endpoints
export const API_ENDPOINTS = {
  CREATE_PROFILE: '/api/users/profile',
  UPDATE_PROFILE: '/api/users/profile',
  GET_PROFILE: '/api/users/profile',
  UPDATE_PROGRESS: '/api/users/onboarding/progress',
  COMPLETE_ONBOARDING: '/api/users/onboarding/complete',
};

// Progress calculation
export function calculateProgress(completedSteps: number[]): number {
  return Math.round(
    (completedSteps.length / QUESTIONNAIRE_CONFIG.totalSteps) * 100
  );
}

// Get step by ID
export function getStepById(stepId: number): QuestionnaireStep | undefined {
  return QUESTIONNAIRE_STEPS.find(step => step.id === stepId);
}

// Get next step
export function getNextStep(currentStep: number): QuestionnaireStep | null {
  const nextStepId = currentStep + 1;
  return getStepById(nextStepId) || null;
}

// Get previous step
export function getPreviousStep(currentStep: number): QuestionnaireStep | null {
  const previousStepId = currentStep - 1;
  return getStepById(previousStepId) || null;
}

// Check if step is required
export function isStepRequired(stepId: number): boolean {
  return QUESTIONNAIRE_CONFIG.requiredSteps.includes(stepId);
}

// Check if step is optional
export function isStepOptional(stepId: number): boolean {
  return QUESTIONNAIRE_CONFIG.optionalSteps.includes(stepId);
}

// Get subjects for exam
export function getSubjectsForExam(examType: string): string[] {
  return EXAM_CONFIGS[examType as keyof typeof EXAM_CONFIGS]?.subjects || [];
}

// Check if exam is supported
export function isExamSupported(examType: string): boolean {
  return (
    EXAM_CONFIGS[examType as keyof typeof EXAM_CONFIGS]?.supported || false
  );
}

// Check if subject is supported for exam
export function isSubjectSupportedForExam(
  examType: string,
  subject: string
): boolean {
  const subjects = getSubjectsForExam(examType);
  return subjects.includes(subject);
}
