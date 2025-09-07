/**
 * MarketingSourceSelection Step Component
 * Step 6: How did you hear about us (optional)
 */

'use client';

import { MARKETING_CONFIGS } from '@/lib/config/questionnaire';
import { MarketingSource } from '@/lib/types/user';
import { motion } from 'framer-motion';
import {
  Check,
  GraduationCap,
  HelpCircle,
  Instagram,
  Search,
  Users,
  Youtube,
} from 'lucide-react';
import { useState } from 'react';

interface MarketingSourceSelectionProps {
  selectedSource?: MarketingSource;
  onSelect: (source: MarketingSource | null) => void;
  className?: string;
}

export default function MarketingSourceSelection({
  selectedSource,
  onSelect,
  className = '',
}: MarketingSourceSelectionProps) {
  const [hoveredSource, setHoveredSource] = useState<MarketingSource | null>(
    null
  );

  const handleSourceSelect = (source: MarketingSource) => {
    onSelect(source);
  };

  const handleSkip = () => {
    onSelect(null);
  };

  const getSourceIcon = (source: MarketingSource) => {
    switch (source) {
      case 'Google Search':
        return <Search className='w-6 h-6' />;
      case 'Instagram Reel':
        return <Instagram className='w-6 h-6' />;
      case 'YouTube':
        return <Youtube className='w-6 h-6' />;
      case 'Friend / Senior':
        return <Users className='w-6 h-6' />;
      case 'Teacher / Coaching':
        return <GraduationCap className='w-6 h-6' />;
      case 'Other':
        return <HelpCircle className='w-6 h-6' />;
      default:
        return <HelpCircle className='w-6 h-6' />;
    }
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'organic':
        return 'text-blue-600 bg-blue-50 border-blue-200';
      case 'social':
        return 'text-pink-600 bg-pink-50 border-pink-200';
      case 'referral':
        return 'text-green-600 bg-green-50 border-green-200';
      case 'other':
        return 'text-gray-600 bg-gray-50 border-gray-200';
      default:
        return 'text-gray-600 bg-gray-50 border-gray-200';
    }
  };

  return (
    <div className={`w-full max-w-4xl mx-auto ${className}`}>
      {/* Header */}
      <div className='text-center mb-8'>
        <p className='text-gray-600'>
          Help us understand how you discovered OwlAI (optional)
        </p>
      </div>

      {/* Marketing Sources Grid */}
      <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-6'>
        {Object.entries(MARKETING_CONFIGS).map(([sourceKey, config]) => {
          const source = sourceKey as MarketingSource;
          const isSelected = selectedSource === source;
          const isHovered = hoveredSource === source;

          return (
            <motion.div
              key={source}
              className={`
                relative p-6 rounded-lg border-2 cursor-pointer transition-all duration-300
                ${
                  isSelected
                    ? 'border-teal-500 bg-teal-50 shadow-md'
                    : isHovered
                      ? 'border-teal-300 bg-teal-25 shadow-sm'
                      : 'border-gray-200 bg-white hover:border-gray-300'
                }
              `}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => handleSourceSelect(source)}
              onMouseEnter={() => setHoveredSource(source)}
              onMouseLeave={() => setHoveredSource(null)}
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

              {/* Source Icon */}
              <div className='text-center mb-4'>
                <div className='w-12 h-12 mx-auto bg-gradient-to-br from-teal-500 to-teal-600 rounded-xl flex items-center justify-center text-white mb-3'>
                  {getSourceIcon(source)}
                </div>
                <h3 className='font-semibold text-gray-900 text-sm'>
                  {source}
                </h3>
              </div>

              {/* Category Badge */}
              <div className='text-center'>
                <div
                  className={`
                    inline-flex items-center px-2 py-1 rounded-full text-xs font-medium border
                    ${getCategoryColor(config.category)}
                  `}
                >
                  {config.category === 'organic' && '🔍 Organic'}
                  {config.category === 'social' && '📱 Social Media'}
                  {config.category === 'referral' && '👥 Referral'}
                  {config.category === 'other' && '❓ Other'}
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
          Skip this question
        </button>
      </div>

      {/* Selection Feedback */}
      {selectedSource && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className='mb-6 p-4 bg-teal-50 border border-teal-200 rounded-lg'
        >
          <div className='flex items-center space-x-3'>
            <div className='w-8 h-8 bg-teal-500 rounded-full flex items-center justify-center text-white'>
              {getSourceIcon(selectedSource)}
            </div>
            <div>
              <p className='font-medium text-teal-900'>
                Selected: {selectedSource}
              </p>
              <p className='text-sm text-teal-700'>
                {MARKETING_CONFIGS[selectedSource].category} source
              </p>
            </div>
          </div>
        </motion.div>
      )}

      {/* Help Text */}
      <div className='text-center'>
        <p className='text-sm text-gray-500'>
          This helps us improve our marketing and reach more students like you
        </p>
        <p className='text-xs text-gray-400 mt-1'>
          Your information is kept private and used only for analytics
        </p>
      </div>
    </div>
  );
}
