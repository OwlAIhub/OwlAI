/**
 * ProgressBar Component
 * Shows questionnaire completion progress
 */

'use client';

import { motion } from 'framer-motion';
import { Check } from 'lucide-react';

interface ProgressBarProps {
  currentStep: number;
  totalSteps: number;
  completedSteps: number[];
  className?: string;
}

export default function ProgressBar({
  currentStep,
  totalSteps,
  completedSteps,
  className = '',
}: ProgressBarProps) {
  const progressPercentage = Math.round(
    (completedSteps.length / totalSteps) * 100
  );

  return (
    <div className={`w-full ${className}`}>
      {/* Progress Header */}
      <div className='flex items-center justify-between mb-4'>
        <div className='flex items-center space-x-2'>
          <span className='text-sm font-medium text-gray-600'>
            Step {currentStep} of {totalSteps}
          </span>
          <span className='text-xs text-gray-400'>
            ({progressPercentage}% complete)
          </span>
        </div>
        <div className='text-sm font-semibold text-teal-600'>
          {progressPercentage}%
        </div>
      </div>

      {/* Progress Bar */}
      <div className='relative'>
        {/* Background Bar */}
        <div className='w-full h-2 bg-gray-200 rounded-full overflow-hidden'>
          {/* Progress Fill */}
          <motion.div
            className='h-full bg-gradient-to-r from-teal-500 to-teal-600 rounded-full'
            initial={{ width: 0 }}
            animate={{ width: `${progressPercentage}%` }}
            transition={{ duration: 0.5, ease: 'easeOut' }}
          />
        </div>

        {/* Step Indicators */}
        <div className='flex justify-between mt-3'>
          {Array.from({ length: totalSteps }, (_, index) => {
            const stepNumber = index + 1;
            const isCompleted = completedSteps.includes(stepNumber);
            const isCurrent = stepNumber === currentStep;
            const isPast = stepNumber < currentStep;

            return (
              <div
                key={stepNumber}
                className='flex flex-col items-center space-y-1'
              >
                {/* Step Circle */}
                <motion.div
                  className={`
                    w-8 h-8 rounded-full flex items-center justify-center text-xs font-semibold
                    transition-all duration-300
                    ${
                      isCompleted
                        ? 'bg-teal-500 text-white'
                        : isCurrent
                          ? 'bg-teal-100 text-teal-600 border-2 border-teal-500'
                          : isPast
                            ? 'bg-gray-300 text-gray-600'
                            : 'bg-gray-200 text-gray-400'
                    }
                  `}
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                >
                  {isCompleted ? <Check className='w-4 h-4' /> : stepNumber}
                </motion.div>

                {/* Step Label (Mobile) */}
                <span className='text-xs text-gray-500 hidden sm:block'>
                  Step {stepNumber}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Progress Text */}
      <div className='mt-4 text-center'>
        <p className='text-sm text-gray-600'>
          {isCompleted() ? (
            <span className='text-teal-600 font-medium'>
              ✅ Step {currentStep} completed
            </span>
          ) : (
            <span className='text-gray-500'>
              Complete step {currentStep} to continue
            </span>
          )}
        </p>
      </div>
    </div>
  );
}

// Helper function
function isCompleted(): boolean {
  // This will be passed from parent component
  return false;
}
