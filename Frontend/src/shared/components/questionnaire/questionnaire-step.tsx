import React from "react";
import { motion } from "framer-motion";

interface QuestionnaireStepProps {
  step: number;
  totalSteps: number;
  title: string;
  description: string;
  children: React.ReactNode;
  isActive: boolean;
}

export const QuestionnaireStep: React.FC<QuestionnaireStepProps> = ({
  step,
  totalSteps,
  title,
  description,
  children,
  isActive,
}) => {
  if (!isActive) return null;

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      transition={{ duration: 0.3 }}
      className="w-full max-w-2xl mx-auto"
    >
      {/* Progress Bar */}
      <div className="mb-8">
        <div className="flex justify-between items-center mb-2">
          <span className="text-sm font-medium text-gray-600">
            Step {step} of {totalSteps}
          </span>
          <span className="text-sm font-medium text-gray-600">
            {Math.round((step / totalSteps) * 100)}%
          </span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div
            className="bg-[#009688] h-2 rounded-full transition-all duration-300"
            style={{ width: `${(step / totalSteps) * 100}%` }}
          />
        </div>
      </div>

      {/* Step Content */}
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold text-gray-900 mb-4">{title}</h2>
        <p className="text-lg text-gray-600 max-w-md mx-auto">{description}</p>
      </div>

      {/* Step Form */}
      <div className="bg-white rounded-lg shadow-lg p-8">{children}</div>
    </motion.div>
  );
};
