import React from "react";
import { motion } from "framer-motion";

interface QuestionnaireNavigationProps {
  currentStep: number;
  totalSteps: number;
  onNext: () => void;
  onPrevious: () => void;
  canProceed: boolean;
  isLoading?: boolean;
}

export const QuestionnaireNavigation: React.FC<
  QuestionnaireNavigationProps
> = ({
  currentStep,
  totalSteps,
  onNext,
  onPrevious,
  canProceed,
  isLoading = false,
}) => {
  return (
    <div className="flex justify-between items-center mt-8 pt-6 border-t border-gray-200">
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={onPrevious}
        disabled={currentStep === 1}
        className={`px-6 py-3 rounded-lg font-medium transition-colors ${
          currentStep === 1
            ? "bg-gray-200 text-gray-500 cursor-not-allowed"
            : "bg-gray-100 text-gray-700 hover:bg-gray-200"
        }`}
      >
        Previous
      </motion.button>

      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={onNext}
        disabled={!canProceed || isLoading}
        className={`px-8 py-3 rounded-lg font-medium transition-colors ${
          !canProceed || isLoading
            ? "bg-gray-200 text-gray-500 cursor-not-allowed"
            : "bg-[#009688] text-white hover:bg-[#00796B]"
        }`}
      >
        {isLoading ? (
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
            Loading...
          </div>
        ) : currentStep === totalSteps ? (
          "Complete Setup"
        ) : (
          "Next"
        )}
      </motion.button>
    </div>
  );
};
