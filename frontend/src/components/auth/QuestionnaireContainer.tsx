'use client';

import { QuestionnaireData } from '@/lib/auth';
import { cn } from '@/lib/utils';
import { motion } from 'framer-motion';
import { useState } from 'react';
import { QuestionnaireNavigation } from './QuestionnaireNavigation';
import { QuestionnaireProgress } from './QuestionnaireProgress';
import { QuestionnaireStep0 } from './QuestionnaireStep0';
import { QuestionnaireStep1 } from './QuestionnaireStep1';
import { QuestionnaireStep2 } from './QuestionnaireStep2';
import { QuestionnaireStep3 } from './QuestionnaireStep3';
import { QuestionnaireStep4 } from './QuestionnaireStep4';
import { QuestionnaireStep5 } from './QuestionnaireStep5';
import { QuestionnaireStep6 } from './QuestionnaireStep6';

interface QuestionnaireContainerProps {
  onComplete: (data: QuestionnaireData) => void;
  onBack?: () => void;
  className?: string;
  isSaving?: boolean;
}

export function QuestionnaireContainer({
  onComplete,
  onBack,
  className,
  isSaving = false,
}: QuestionnaireContainerProps) {
  const [currentStep, setCurrentStep] = useState(1);
  const [data, setData] = useState<QuestionnaireData>({
    fullName: '',
    exam: null,
    subject: null,
    attempt: null,
    examCycle: null,
    language: 'English',
    marketingSource: null,
  });

  const totalSteps = 7;

  const updateData = (updates: Partial<QuestionnaireData>) => {
    setData(prev => ({ ...prev, ...updates }));
  };

  const nextStep = () => {
    if (currentStep < totalSteps) {
      setCurrentStep(prev => prev + 1);
    } else {
      onComplete(data);
    }
  };

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(prev => prev - 1);
    } else if (onBack) {
      onBack();
    }
  };

  const canProceed = () => {
    switch (currentStep) {
      case 1:
        return data.fullName.trim().length > 0;
      case 2:
        return data.exam !== null;
      case 3:
        return data.subject !== null;
      case 4:
        return data.attempt !== null;
      case 5:
        return true; // Optional
      case 6:
        return true; // Always has default
      case 7:
        return true; // Optional
      default:
        return false;
    }
  };

  const renderCurrentStep = () => {
    const commonProps = { data, updateData };

    switch (currentStep) {
      case 1:
        return <QuestionnaireStep0 {...commonProps} />;
      case 2:
        return <QuestionnaireStep1 {...commonProps} />;
      case 3:
        return <QuestionnaireStep2 {...commonProps} />;
      case 4:
        return <QuestionnaireStep3 {...commonProps} />;
      case 5:
        return <QuestionnaireStep4 {...commonProps} />;
      case 6:
        return <QuestionnaireStep5 {...commonProps} />;
      case 7:
        return <QuestionnaireStep6 {...commonProps} />;
      default:
        return null;
    }
  };

  return (
    <div className={cn('w-full max-w-lg mx-auto', className)}>
      <QuestionnaireProgress
        currentStep={currentStep}
        totalSteps={totalSteps}
      />

      <motion.div
        key={currentStep}
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        exit={{ opacity: 0, x: -20 }}
        transition={{ duration: 0.3 }}
      >
        {renderCurrentStep()}
      </motion.div>

      <QuestionnaireNavigation
        currentStep={currentStep}
        totalSteps={totalSteps}
        canProceed={canProceed()}
        onNext={nextStep}
        onPrev={prevStep}
        isSaving={isSaving}
      />
    </div>
  );
}
