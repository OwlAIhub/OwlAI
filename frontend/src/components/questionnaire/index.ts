/**
 * Questionnaire Components Export
 * Centralized exports for all questionnaire components
 */

// Main container
export { default as QuestionnaireContainer } from './QuestionnaireContainer';

// UI components
export { default as NavigationButtons } from './NavigationButtons';
export { default as ProgressBar } from './ProgressBar';

// Step components
export { default as AttemptSelection } from './steps/AttemptSelection';
export { default as ExamCycleSelection } from './steps/ExamCycleSelection';
export { default as ExamSelection } from './steps/ExamSelection';
export { default as LanguageSelection } from './steps/LanguageSelection';
export { default as MarketingSourceSelection } from './steps/MarketingSourceSelection';
export { default as SubjectSelection } from './steps/SubjectSelection';

// Re-export types for convenience
export type {
  AttemptType,
  ExamCycleType,
  ExamType,
  LanguageType,
  MarketingSource,
  OnboardingProgress,
  SubjectType,
} from '@/lib/types/user';

// Re-export configuration
export {
  ATTEMPT_CONFIGS,
  EXAM_CONFIGS,
  EXAM_CYCLE_CONFIGS,
  LANGUAGE_CONFIGS,
  MARKETING_CONFIGS,
  QUESTIONNAIRE_CONFIG,
  QUESTIONNAIRE_STEPS,
  calculateProgress,
  getNextStep,
  getPreviousStep,
  getStepById,
  getSubjectsForExam,
  isExamSupported,
  isStepOptional,
  isStepRequired,
  isSubjectSupportedForExam,
} from '@/lib/config/questionnaire';
