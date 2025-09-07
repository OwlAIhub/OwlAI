/**
 * QuestionnaireContainer Component
 * Main wrapper for the questionnaire flow
 */

'use client';

import { updateUserProfile } from '@/lib/auth';
import {
  QUESTIONNAIRE_CONFIG,
  STORAGE_KEYS,
  getNextStep,
  getPreviousStep,
  getStepById,
  isStepOptional,
  isStepRequired,
} from '@/lib/config/questionnaire';
import { OnboardingProgress } from '@/lib/types/user';
import { AnimatePresence, motion } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { useCallback, useEffect, useState } from 'react';
import NavigationButtons from './NavigationButtons';
import ProgressBar from './ProgressBar';
import AttemptSelection from './steps/AttemptSelection';
import ExamCycleSelection from './steps/ExamCycleSelection';
import ExamSelection from './steps/ExamSelection';
import LanguageSelection from './steps/LanguageSelection';
import MarketingSourceSelection from './steps/MarketingSourceSelection';
import SubjectSelection from './steps/SubjectSelection';

interface QuestionnaireContainerProps {
  onComplete?: (answers: OnboardingProgress['answers']) => void;
  className?: string;
}

export default function QuestionnaireContainer({
  onComplete,
  className = '',
}: QuestionnaireContainerProps) {
  const router = useRouter();

  // State management
  const [currentStep, setCurrentStep] = useState(1);
  const [completedSteps, setCompletedSteps] = useState<number[]>([]);
  const [answers, setAnswers] = useState<OnboardingProgress['answers']>({});
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Load progress from localStorage
  const loadProgress = useCallback(() => {
    try {
      const savedProgress = localStorage.getItem(
        STORAGE_KEYS.ONBOARDING_PROGRESS
      );
      if (savedProgress) {
        const progress: OnboardingProgress = JSON.parse(savedProgress);
        setCurrentStep(progress.currentStep);
        setCompletedSteps(progress.completedSteps);
        setAnswers(progress.answers);
      }
    } catch (error) {
      console.warn('Failed to load progress from localStorage:', error);
    }
  }, []);

  // Save progress to localStorage
  const saveProgress = useCallback(() => {
    try {
      const progress: OnboardingProgress = {
        currentStep,
        completedSteps,
        answers,
        startedAt: new Date(),
        lastUpdated: new Date(),
        isCompleted: false,
      };
      localStorage.setItem(
        STORAGE_KEYS.ONBOARDING_PROGRESS,
        JSON.stringify(progress)
      );
    } catch (error) {
      console.warn('Failed to save progress to localStorage:', error);
    }
  }, [currentStep, completedSteps, answers]);

  // Load progress from localStorage on mount
  useEffect(() => {
    loadProgress();
  }, [loadProgress]);

  // Save progress to localStorage whenever it changes
  useEffect(() => {
    saveProgress();
  }, [saveProgress]);

  // Helper functions
  const getAnswerKey = (stepId: number): string => {
    const keyMap: Record<number, string> = {
      1: 'exam',
      2: 'subject',
      3: 'attempt',
      4: 'cycle',
      5: 'language',
      6: 'marketingSource',
    };
    return keyMap[stepId] || '';
  };

  const isStepCompleted = useCallback(
    (stepId: number): boolean => {
      const answerKey = getAnswerKey(stepId);
      return !!answers[answerKey as keyof typeof answers];
    },
    [answers]
  );

  const isStepValid = (stepId: number): boolean => {
    return isStepCompleted(stepId);
  };

  // Handle step completion
  const handleStepComplete = useCallback(
    (stepId: number, answer: unknown) => {
      setAnswers(prev => ({ ...prev, [getAnswerKey(stepId)]: answer }));

      if (!completedSteps.includes(stepId)) {
        setCompletedSteps(prev => [...prev, stepId]);
      }

      setError(null);
    },
    [completedSteps]
  );

  // Handle completion
  const handleComplete = useCallback(async () => {
    setIsLoading(true);
    try {
      // Call completion handler
      if (onComplete) {
        await onComplete(answers);
      }

      // Mark onboarding as completed in user profile
      updateUserProfile({ onboardingCompleted: true });

      // Clear localStorage
      localStorage.removeItem(STORAGE_KEYS.ONBOARDING_PROGRESS);

      // Redirect to chat
      router.push('/chat');
    } catch {
      setError('Failed to complete questionnaire. Please try again.');
    } finally {
      setIsLoading(false);
    }
  }, [answers, onComplete, router]);

  // Handle navigation
  const handlePrevious = useCallback(() => {
    const previousStep = getPreviousStep(currentStep);
    if (previousStep) {
      setCurrentStep(previousStep.id);
      setError(null);
    }
  }, [currentStep]);

  const handleNext = useCallback(() => {
    const currentStepData = getStepById(currentStep);
    if (!currentStepData) return;

    // Validate current step
    if (isStepRequired(currentStep) && !isStepCompleted(currentStep)) {
      setError('Please complete this step before continuing');
      return;
    }

    const nextStep = getNextStep(currentStep);
    if (nextStep) {
      setCurrentStep(nextStep.id);
      setError(null);
    } else {
      // Questionnaire completed
      handleComplete();
    }
  }, [currentStep, handleComplete, isStepCompleted]);

  const handleSkip = useCallback(() => {
    const nextStep = getNextStep(currentStep);
    if (nextStep) {
      setCurrentStep(nextStep.id);
      setError(null);
    }
  }, [currentStep]);

  const currentStepData = getStepById(currentStep);

  if (!currentStepData) {
    return <div>Invalid step</div>;
  }

  return (
    <div className={`max-w-3xl mx-auto p-4 ${className}`}>
      {/* Progress Bar */}
      <ProgressBar
        currentStep={currentStep}
        totalSteps={QUESTIONNAIRE_CONFIG.totalSteps}
        completedSteps={completedSteps}
        className='mb-4'
      />

      {/* Error Message */}
      {error && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className='mb-4 p-3 bg-red-50 border border-red-200 rounded-lg'
        >
          <p className='text-red-600 text-sm'>{error}</p>
        </motion.div>
      )}

      {/* Step Content */}
      <AnimatePresence mode='wait'>
        <motion.div
          key={currentStep}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
          transition={{ duration: 0.2 }}
          className='mb-4'
        >
          {/* Step Header */}
          <div className='text-center mb-6'>
            <h2 className='text-xl font-bold text-gray-900 mb-2'>
              {currentStepData.title}
            </h2>
            <p className='text-sm text-gray-600'>
              {currentStepData.description}
            </p>
          </div>

          {/* Step Component */}
          <div className='min-h-[150px]'>
            {currentStep === 1 && (
              <ExamSelection
                selectedExam={answers.exam}
                onSelect={exam => handleStepComplete(1, exam)}
              />
            )}
            {currentStep === 2 && (
              <SubjectSelection
                selectedExam={answers.exam || 'UGC-NET'}
                selectedSubject={answers.subject}
                onSelect={subject => handleStepComplete(2, subject)}
              />
            )}
            {currentStep === 3 && (
              <AttemptSelection
                selectedAttempt={answers.attempt}
                onSelect={attempt => handleStepComplete(3, attempt)}
              />
            )}
            {currentStep === 4 && (
              <ExamCycleSelection
                selectedCycle={answers.cycle}
                onSelect={cycle => handleStepComplete(4, cycle)}
              />
            )}
            {currentStep === 5 && (
              <LanguageSelection
                selectedLanguage={answers.language}
                onSelect={language => handleStepComplete(5, language)}
              />
            )}
            {currentStep === 6 && (
              <MarketingSourceSelection
                selectedSource={answers.marketingSource}
                onSelect={source => handleStepComplete(6, source)}
              />
            )}
          </div>
        </motion.div>
      </AnimatePresence>

      {/* Navigation */}
      <NavigationButtons
        currentStep={currentStep}
        totalSteps={QUESTIONNAIRE_CONFIG.totalSteps}
        isStepValid={isStepValid(currentStep)}
        isStepRequired={isStepRequired(currentStep)}
        isStepCompleted={isStepCompleted(currentStep)}
        onPrevious={handlePrevious}
        onNext={handleNext}
        onSkip={isStepOptional(currentStep) ? handleSkip : undefined}
        isLoading={isLoading}
        className='mt-4'
      />
    </div>
  );
}
