/**
 * NavigationButtons Component
 * Handles questionnaire navigation (Back, Next, Skip)
 */

'use client';

import { Button } from '@/components/ui/buttons/button';
import { motion } from 'framer-motion';
import { ArrowLeft, ArrowRight, SkipForward } from 'lucide-react';

interface NavigationButtonsProps {
  currentStep: number;
  totalSteps: number;
  isStepValid: boolean;
  isStepRequired: boolean;
  isStepCompleted: boolean;
  onPrevious: () => void;
  onNext: () => void;
  onSkip?: () => void;
  isLoading?: boolean;
  className?: string;
}

export default function NavigationButtons({
  currentStep,
  totalSteps,
  isStepValid,
  isStepRequired,
  isStepCompleted,
  onPrevious,
  onNext,
  onSkip,
  isLoading = false,
  className = '',
}: NavigationButtonsProps) {
  const isFirstStep = currentStep === 1;
  const isLastStep = currentStep === totalSteps;
  const canGoNext = isStepValid || (!isStepRequired && !isStepCompleted);
  const showSkip = !isStepRequired && !isStepCompleted;

  return (
    <div className={`flex items-center justify-between ${className}`}>
      {/* Back Button */}
      <motion.div
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.3 }}
      >
        <Button
          variant='outline'
          onClick={onPrevious}
          disabled={isFirstStep || isLoading}
          className='flex items-center space-x-2 px-4 py-2 text-sm'
        >
          <ArrowLeft className='w-4 h-4' />
          <span>Back</span>
        </Button>
      </motion.div>

      {/* Center Actions */}
      <div className='flex items-center space-x-3'>
        {/* Skip Button */}
        {showSkip && onSkip && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.3, delay: 0.1 }}
          >
            <Button
              variant='ghost'
              onClick={onSkip}
              disabled={isLoading}
              className='flex items-center space-x-2 px-3 py-2 text-sm text-gray-500 hover:text-gray-700'
            >
              <SkipForward className='w-4 h-4' />
              <span>Skip</span>
            </Button>
          </motion.div>
        )}

        {/* Next/Complete Button */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.3, delay: 0.2 }}
        >
          <Button
            onClick={onNext}
            disabled={!canGoNext || isLoading}
            className={`
              flex items-center space-x-2 px-4 py-2 text-sm
              ${
                isLastStep
                  ? 'bg-green-600 hover:bg-green-700 text-white'
                  : 'bg-teal-600 hover:bg-teal-700 text-white'
              }
              ${!canGoNext ? 'opacity-50 cursor-not-allowed' : ''}
            `}
          >
            {isLoading ? (
              <div className='w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin' />
            ) : (
              <>
                <span>{isLastStep ? 'Complete' : 'Next'}</span>
                {!isLastStep && <ArrowRight className='w-4 h-4' />}
              </>
            )}
          </Button>
        </motion.div>
      </div>
    </div>
  );
}

// Button variants for different states
export const ButtonStates = {
  enabled: 'bg-teal-600 hover:bg-teal-700 text-white',
  disabled: 'bg-gray-300 text-gray-500 cursor-not-allowed',
  loading: 'bg-teal-500 text-white cursor-wait',
  skip: 'bg-transparent text-gray-500 hover:text-gray-700 border border-gray-300',
  complete: 'bg-green-600 hover:bg-green-700 text-white',
} as const;
