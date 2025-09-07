/**
 * AttemptSelection Step Component
 * Step 3: Select attempt number (1st, 2nd, 3rd+)
 */

'use client';

import { ATTEMPT_CONFIGS } from '@/lib/config/questionnaire';
import { AttemptType } from '@/lib/types/user';
import { motion } from 'framer-motion';
import { Check } from 'lucide-react';
import { useState } from 'react';

interface AttemptSelectionProps {
  selectedAttempt?: AttemptType;
  onSelect: (attempt: AttemptType) => void;
  className?: string;
}

export default function AttemptSelection({
  selectedAttempt,
  onSelect,
  className = '',
}: AttemptSelectionProps) {
  const [hoveredAttempt, setHoveredAttempt] = useState<AttemptType | null>(
    null
  );

  const handleAttemptSelect = (attempt: AttemptType) => {
    onSelect(attempt);
  };

  return (
    <div className={`w-full max-w-3xl mx-auto ${className}`}>
      {/* Header */}
      <div className='text-center mb-8'>
        <p className='text-gray-600'>
          This helps us personalize your study plan and AI responses
        </p>
      </div>

      {/* Attempt Options */}
      <div className='grid grid-cols-1 md:grid-cols-3 gap-6'>
        {Object.entries(ATTEMPT_CONFIGS).map(([attemptKey, config]) => {
          const attempt = attemptKey as AttemptType;
          const isSelected = selectedAttempt === attempt;
          const isHovered = hoveredAttempt === attempt;

          return (
            <motion.div
              key={attempt}
              className={`
                relative p-8 rounded-xl border-2 cursor-pointer transition-all duration-300
                ${
                  isSelected
                    ? 'border-teal-500 bg-teal-50 shadow-lg'
                    : isHovered
                      ? 'border-teal-300 bg-teal-25 shadow-md'
                      : 'border-gray-200 bg-white hover:border-gray-300'
                }
              `}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => handleAttemptSelect(attempt)}
              onMouseEnter={() => setHoveredAttempt(attempt)}
              onMouseLeave={() => setHoveredAttempt(null)}
            >
              {/* Selection Indicator */}
              {isSelected && (
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className='absolute top-4 right-4 w-6 h-6 bg-teal-500 rounded-full flex items-center justify-center'
                >
                  <Check className='w-4 h-4 text-white' />
                </motion.div>
              )}

              {/* Emoji */}
              <div className='text-center mb-4'>
                <div className='text-4xl mb-2'>{config.emoji}</div>
                <div
                  className='w-12 h-12 mx-auto rounded-full flex items-center justify-center text-white font-bold text-lg'
                  style={{ backgroundColor: config.color }}
                >
                  {attempt === '1st' ? '1' : attempt === '2nd' ? '2' : '3+'}
                </div>
              </div>

              {/* Content */}
              <div className='text-center'>
                <h3 className='text-xl font-bold text-gray-900 mb-2'>
                  {config.title}
                </h3>
                <p className='text-gray-600 mb-4'>{config.description}</p>

                {/* Features */}
                <div className='space-y-2 text-sm text-gray-500'>
                  {attempt === '1st' && (
                    <>
                      <div>• Basic concepts focus</div>
                      <div>• Step-by-step guidance</div>
                      <div>• Foundation building</div>
                    </>
                  )}
                  {attempt === '2nd' && (
                    <>
                      <div>• Advanced topics</div>
                      <div>• Practice strategies</div>
                      <div>• Weakness targeting</div>
                    </>
                  )}
                  {attempt === '3rd+' && (
                    <>
                      <div>• Expert-level prep</div>
                      <div>• Advanced techniques</div>
                      <div>• Performance optimization</div>
                    </>
                  )}
                </div>
              </div>

              {/* Hover Effect */}
              {isHovered && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className='absolute inset-0 bg-teal-500 bg-opacity-5 rounded-xl'
                />
              )}
            </motion.div>
          );
        })}
      </div>

      {/* Selection Feedback */}
      {selectedAttempt && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className='mt-8 p-6 bg-teal-50 border border-teal-200 rounded-lg'
        >
          <div className='flex items-center space-x-4'>
            <div className='text-3xl'>
              {ATTEMPT_CONFIGS[selectedAttempt].emoji}
            </div>
            <div>
              <p className='font-medium text-teal-900'>
                {ATTEMPT_CONFIGS[selectedAttempt].title} Attempt
              </p>
              <p className='text-sm text-teal-700'>
                {ATTEMPT_CONFIGS[selectedAttempt].description}
              </p>
            </div>
          </div>
        </motion.div>
      )}

      {/* Help Text */}
      <div className='mt-6 text-center'>
        <p className='text-sm text-gray-500'>
          Your attempt level helps us customize the AI&apos;s teaching style and
          study recommendations.
        </p>
      </div>
    </div>
  );
}
