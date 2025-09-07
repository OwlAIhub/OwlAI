/**
 * ExamSelection Step Component
 * Step 1: Select exam type (UGC-NET or CSIR-NET)
 */

'use client';

import { EXAM_CONFIGS } from '@/lib/config/questionnaire';
import { ExamType } from '@/lib/types/user';
import { motion } from 'framer-motion';
import { Check } from 'lucide-react';
import { useEffect, useState } from 'react';

interface ExamSelectionProps {
  selectedExam?: ExamType;
  onSelect: (exam: ExamType) => void;
  className?: string;
}

export default function ExamSelection({
  selectedExam,
  onSelect,
  className = '',
}: ExamSelectionProps) {
  const [hoveredExam, setHoveredExam] = useState<ExamType | null>(null);

  // Auto-select if only one option
  useEffect(() => {
    if (!selectedExam && Object.keys(EXAM_CONFIGS).length === 1) {
      const onlyExam = Object.keys(EXAM_CONFIGS)[0] as ExamType;
      onSelect(onlyExam);
    }
  }, [selectedExam, onSelect]);

  const handleExamSelect = (exam: ExamType) => {
    onSelect(exam);
  };

  return (
    <div className={`w-full max-w-xl mx-auto ${className}`}>
      <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
        {Object.entries(EXAM_CONFIGS).map(([examKey, config]) => {
          const exam = examKey as ExamType;
          const isSelected = selectedExam === exam;
          const isHovered = hoveredExam === exam;
          const isSupported = config.supported;

          return (
            <motion.div
              key={exam}
              className={`
                relative p-4 rounded-lg border-2 cursor-pointer transition-all duration-200
                ${
                  isSelected
                    ? 'border-teal-500 bg-teal-50 shadow-md'
                    : isHovered
                      ? 'border-gray-300 bg-gray-50 shadow-sm'
                      : 'border-gray-200 bg-white hover:border-gray-300'
                }
                ${!isSupported ? 'opacity-50 cursor-not-allowed' : ''}
              `}
              whileHover={{ scale: isSupported ? 1.01 : 1 }}
              whileTap={{ scale: isSupported ? 0.99 : 1 }}
              onClick={() => isSupported && handleExamSelect(exam)}
              onMouseEnter={() => setHoveredExam(exam)}
              onMouseLeave={() => setHoveredExam(null)}
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

              {/* Exam Logo Placeholder */}
              <div className='w-12 h-12 mx-auto mb-3 bg-gradient-to-br from-teal-500 to-teal-600 rounded-lg flex items-center justify-center'>
                <span className='text-lg font-bold text-white'>
                  {exam === 'UGC-NET' ? 'U' : 'C'}
                </span>
              </div>

              {/* Exam Info */}
              <div className='text-center'>
                <h3 className='text-lg font-bold text-gray-900 mb-1'>
                  {config.name}
                </h3>
                <p className='text-sm text-gray-600 mb-3'>
                  {config.description}
                </p>

                {/* Features */}
                <div className='space-y-2'>
                  <div className='flex items-center justify-center space-x-2 text-sm text-gray-500'>
                    <span>📚</span>
                    <span>{config.subjects.length} subjects</span>
                  </div>
                  <div className='flex items-center justify-center space-x-2 text-sm text-gray-500'>
                    <span>🌐</span>
                    <span>{config.defaultLanguage}</span>
                  </div>
                </div>

                {/* Status Badge */}
                <div className='mt-4'>
                  {isSupported ? (
                    <span className='inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800'>
                      ✅ Supported
                    </span>
                  ) : (
                    <span className='inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800'>
                      ⏳ Coming Soon
                    </span>
                  )}
                </div>
              </div>

              {/* Hover Effect */}
              {isHovered && isSupported && (
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
      {selectedExam && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className='mt-6 p-4 bg-teal-50 border border-teal-200 rounded-lg'
        >
          <div className='flex items-center space-x-3'>
            <div className='w-8 h-8 bg-teal-500 rounded-full flex items-center justify-center'>
              <Check className='w-5 h-5 text-white' />
            </div>
            <div>
              <p className='font-medium text-teal-900'>
                Selected: {EXAM_CONFIGS[selectedExam].name}
              </p>
              <p className='text-sm text-teal-700'>
                {EXAM_CONFIGS[selectedExam].subjects.length} subjects available
              </p>
            </div>
          </div>
        </motion.div>
      )}

      {/* Help Text */}
      <div className='mt-6 text-center'>
        <p className='text-sm text-gray-500'>
          Choose the exam you&apos;re preparing for. You can change this later
          in settings.
        </p>
      </div>
    </div>
  );
}
