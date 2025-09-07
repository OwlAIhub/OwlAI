/**
 * SubjectSelection Step Component
 * Step 2: Select subject based on chosen exam
 */

'use client';

import { getSubjectsForExam } from '@/lib/config/questionnaire';
import { ExamType, SubjectType } from '@/lib/types/user';
import { motion } from 'framer-motion';
import { Check, Search } from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';

interface SubjectSelectionProps {
  selectedExam: ExamType;
  selectedSubject?: SubjectType;
  onSelect: (subject: SubjectType) => void;
  className?: string;
}

export default function SubjectSelection({
  selectedExam,
  selectedSubject,
  onSelect,
  className = '',
}: SubjectSelectionProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [hoveredSubject, setHoveredSubject] = useState<SubjectType | null>(
    null
  );

  // Get subjects for the selected exam
  const availableSubjects = useMemo(() => {
    return getSubjectsForExam(selectedExam);
  }, [selectedExam]);

  // Filter subjects based on search query
  const filteredSubjects = useMemo(() => {
    if (!searchQuery.trim()) return availableSubjects;

    return availableSubjects.filter(subject =>
      subject.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [availableSubjects, searchQuery]);

  // Auto-select if only one subject
  useEffect(() => {
    if (!selectedSubject && filteredSubjects.length === 1) {
      onSelect(filteredSubjects[0] as SubjectType);
    }
  }, [selectedSubject, filteredSubjects, onSelect]);

  const handleSubjectSelect = (subject: SubjectType) => {
    onSelect(subject);
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };

  return (
    <div className={`w-full max-w-3xl mx-auto ${className}`}>
      {/* Search Bar */}
      <div className='mb-4'>
        <div className='relative max-w-sm mx-auto'>
          <Search className='absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400' />
          <input
            type='text'
            placeholder='Search subjects...'
            value={searchQuery}
            onChange={handleSearchChange}
            className='w-full pl-9 pr-4 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-500 focus:border-transparent'
          />
        </div>
      </div>

      {/* Exam Context */}
      <div className='text-center mb-4'>
        <p className='text-sm text-gray-600'>
          Select your{' '}
          <span className='font-semibold text-teal-600'>{selectedExam}</span>{' '}
          Paper-2 subject
        </p>
      </div>

      {/* Subjects Grid */}
      <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3'>
        {filteredSubjects.map(subject => {
          const isSelected = selectedSubject === subject;
          const isHovered = hoveredSubject === subject;

          return (
            <motion.div
              key={subject}
              className={`
                relative p-3 rounded-lg border-2 cursor-pointer transition-all duration-200
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
              onClick={() => handleSubjectSelect(subject as SubjectType)}
              onMouseEnter={() => setHoveredSubject(subject as SubjectType)}
              onMouseLeave={() => setHoveredSubject(null)}
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

              {/* Subject Name */}
              <div className='pr-8'>
                <h3 className='font-medium text-gray-900 text-sm leading-tight'>
                  {subject}
                </h3>
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

      {/* No Results */}
      {filteredSubjects.length === 0 && searchQuery && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className='text-center py-12'
        >
          <div className='text-gray-400 mb-2'>
            <Search className='w-12 h-12 mx-auto' />
          </div>
          <p className='text-gray-500'>
            No subjects found for &quot;{searchQuery}&quot;
          </p>
          <button
            onClick={() => setSearchQuery('')}
            className='mt-2 text-gray-600 hover:text-gray-700 text-sm'
          >
            Clear search
          </button>
        </motion.div>
      )}

      {/* Selection Feedback */}
      {selectedSubject && (
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
                Selected: {selectedSubject}
              </p>
              <p className='text-sm text-teal-700'>
                {selectedExam} Paper-2 subject
              </p>
            </div>
          </div>
        </motion.div>
      )}

      {/* Help Text */}
      <div className='mt-6 text-center'>
        <p className='text-sm text-gray-500'>
          Choose your main subject for {selectedExam}. This helps us personalize
          your study experience.
        </p>
      </div>
    </div>
  );
}
