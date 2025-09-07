'use client';

import { motion } from 'framer-motion';

interface QuestionnaireProgressProps {
  currentStep: number;
  totalSteps: number;
}

export function QuestionnaireProgress({
  currentStep,
  totalSteps,
}: QuestionnaireProgressProps) {
  return (
    <div className='mb-8'>
      <div className='flex items-center justify-between text-sm text-muted-foreground mb-2'>
        <span>
          Step {currentStep} of {totalSteps}
        </span>
        <span>{Math.round((currentStep / totalSteps) * 100)}%</span>
      </div>
      <div className='w-full bg-muted rounded-full h-2'>
        <motion.div
          className='bg-primary h-2 rounded-full'
          initial={{ width: 0 }}
          animate={{ width: `${(currentStep / totalSteps) * 100}%` }}
          transition={{ duration: 0.3 }}
        />
      </div>
    </div>
  );
}
