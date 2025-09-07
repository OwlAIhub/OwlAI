/**
 * useQuestionnaire Hook
 * Custom hook for managing questionnaire state and logic
 */

import { STORAGE_KEYS } from '@/lib/config/questionnaire';
import { OnboardingProgress } from '@/lib/types/user';
import { useCallback, useEffect, useState } from 'react';

export function useQuestionnaire() {
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

  // Clear progress
  const clearProgress = useCallback(() => {
    localStorage.removeItem(STORAGE_KEYS.ONBOARDING_PROGRESS);
    setCurrentStep(1);
    setCompletedSteps([]);
    setAnswers({});
    setError(null);
  }, []);

  // Helper function to get answer key for step
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

  // Check if step is completed
  const isStepCompleted = useCallback(
    (stepId: number): boolean => {
      const answerKey = getAnswerKey(stepId);
      return !!answers[answerKey as keyof typeof answers];
    },
    [answers]
  );

  // Check if step is valid
  const isStepValid = useCallback(
    (stepId: number): boolean => {
      return isStepCompleted(stepId);
    },
    [isStepCompleted]
  );

  return {
    // State
    currentStep,
    completedSteps,
    answers,
    isLoading,
    error,

    // Actions
    setCurrentStep,
    handleStepComplete,
    clearProgress,
    setIsLoading,
    setError,

    // Helpers
    isStepCompleted,
    isStepValid,
    getAnswerKey,
  };
}
