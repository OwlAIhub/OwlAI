/**
 * ExamCycleSelection Step Component
 * Step 4: Select exam cycle (optional)
 */

'use client';

import { EXAM_CYCLE_CONFIGS } from '@/lib/config/questionnaire';
import { ExamCycleType } from '@/lib/types/user';
import { motion } from 'framer-motion';
import { Calendar, Check, Clock } from 'lucide-react';
import { useState } from 'react';

interface ExamCycleSelectionProps {
  selectedCycle?: ExamCycleType;
  onSelect: (cycle: ExamCycleType | null) => void;
  className?: string;
}

export default function ExamCycleSelection({
  selectedCycle,
  onSelect,
  className = '',
}: ExamCycleSelectionProps) {
  const [hoveredCycle, setHoveredCycle] = useState<ExamCycleType | null>(null);

  const handleCycleSelect = (cycle: ExamCycleType) => {
    onSelect(cycle);
  };

  const handleSkip = () => {
    onSelect(null);
  };

  const getUrgencyColor = (urgency: string) => {
    switch (urgency) {
      case 'high':
        return 'text-red-600 bg-red-50 border-red-200';
      case 'medium':
        return 'text-yellow-600 bg-yellow-50 border-yellow-200';
      case 'low':
        return 'text-green-600 bg-green-50 border-green-200';
      default:
        return 'text-gray-600 bg-gray-50 border-gray-200';
    }
  };

  const getUrgencyIcon = (urgency: string) => {
    switch (urgency) {
      case 'high':
        return '🔥';
      case 'medium':
        return '⏰';
      case 'low':
        return '📅';
      default:
        return '📅';
    }
  };

  return (
    <div className={`w-full max-w-3xl mx-auto ${className}`}>
      {/* Header */}
      <div className='text-center mb-6'>
        <p className='text-sm text-gray-600'>
          This helps us create a personalized study timeline for you
        </p>
      </div>

      {/* Exam Cycles Grid */}
      <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 mb-4'>
        {Object.entries(EXAM_CYCLE_CONFIGS).map(([cycleKey, config]) => {
          const cycle = cycleKey as ExamCycleType;
          const isSelected = selectedCycle === cycle;
          const isHovered = hoveredCycle === cycle;

          return (
            <motion.div
              key={cycle}
              className={`
                relative p-4 rounded-lg border-2 cursor-pointer transition-all duration-200
                ${
                  isSelected
                    ? 'border-teal-500 bg-teal-50 shadow-sm'
                    : isHovered
                      ? 'border-gray-300 bg-gray-50 shadow-sm'
                      : 'border-gray-200 bg-white hover:border-gray-300'
                }
              `}
              whileHover={{ scale: 1.01 }}
              whileTap={{ scale: 0.99 }}
              onClick={() => handleCycleSelect(cycle)}
              onMouseEnter={() => setHoveredCycle(cycle)}
              onMouseLeave={() => setHoveredCycle(null)}
            >
              {/* Selection Indicator */}
              {isSelected && (
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className='absolute top-2 right-2 w-5 h-5 bg-teal-500 rounded-full flex items-center justify-center'
                >
                  <Check className='w-3 h-3 text-white' />
                </motion.div>
              )}

              {/* Cycle Info */}
              <div className='text-center'>
                <div className='text-2xl mb-2'>
                  {getUrgencyIcon(config.urgency)}
                </div>
                <h3 className='font-semibold text-gray-900 mb-2'>
                  {config.name}
                </h3>
                <p className='text-sm text-gray-600 mb-3'>
                  {config.months} preparation
                </p>

                {/* Urgency Badge */}
                <div
                  className={`
                    inline-flex items-center px-2 py-1 rounded-full text-xs font-medium border
                    ${getUrgencyColor(config.urgency)}
                  `}
                >
                  {config.urgency === 'high' && 'High Priority'}
                  {config.urgency === 'medium' && 'Medium Priority'}
                  {config.urgency === 'low' && 'Low Priority'}
                </div>
              </div>

              {/* Hover Effect */}
              {isHovered && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className='absolute inset-0 bg-teal-500 bg-opacity-5 rounded-lg'
                />
              )}
            </motion.div>
          );
        })}
      </div>

      {/* Skip Option */}
      <div className='text-center mb-6'>
        <button
          onClick={handleSkip}
          className='text-gray-500 hover:text-gray-700 text-sm underline'
        >
          Not sure yet - Skip this step
        </button>
      </div>

      {/* Selection Feedback */}
      {selectedCycle && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className='mb-6 p-4 bg-teal-50 border border-teal-200 rounded-lg'
        >
          <div className='flex items-center space-x-3'>
            <div className='w-8 h-8 bg-teal-500 rounded-full flex items-center justify-center'>
              <Calendar className='w-5 h-5 text-white' />
            </div>
            <div>
              <p className='font-medium text-teal-900'>
                Target: {EXAM_CYCLE_CONFIGS[selectedCycle].name}
              </p>
              <p className='text-sm text-teal-700'>
                {EXAM_CYCLE_CONFIGS[selectedCycle].months} preparation time
              </p>
            </div>
          </div>
        </motion.div>
      )}

      {/* Help Text */}
      <div className='text-center'>
        <div className='flex items-center justify-center space-x-2 text-sm text-gray-500 mb-2'>
          <Clock className='w-4 h-4' />
          <span>Study timeline will be customized based on your selection</span>
        </div>
        <p className='text-xs text-gray-400'>
          You can change this later in your profile settings
        </p>
      </div>
    </div>
  );
}
