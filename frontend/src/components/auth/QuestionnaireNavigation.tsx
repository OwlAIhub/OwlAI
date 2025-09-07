'use client';

import { Button } from '@/components/ui/button';
import { ArrowLeft, ArrowRight } from 'lucide-react';

interface QuestionnaireNavigationProps {
  currentStep: number;
  totalSteps: number;
  canProceed: boolean;
  onNext: () => void;
  onPrev: () => void;
  isSaving?: boolean;
}

export function QuestionnaireNavigation({
  currentStep,
  totalSteps,
  canProceed,
  onNext,
  onPrev,
  isSaving = false,
}: QuestionnaireNavigationProps) {
  return (
    <div className='flex items-center justify-between mt-8'>
      <Button
        variant='ghost'
        onClick={onPrev}
        className='flex items-center gap-2'
      >
        <ArrowLeft className='w-4 h-4' />
        Back
      </Button>

      <Button
        onClick={onNext}
        disabled={!canProceed || isSaving}
        className='flex items-center gap-2 bg-primary hover:bg-primary/90'
      >
        {isSaving ? (
          <>
            <div className='animate-spin rounded-full h-4 w-4 border-b-2 border-white'></div>
            Saving...
          </>
        ) : (
          <>
            {currentStep === totalSteps ? 'Complete Setup' : 'Next'}
            <ArrowRight className='w-4 h-4' />
          </>
        )}
      </Button>
    </div>
  );
}
