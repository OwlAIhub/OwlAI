/**
 * LanguageSelection Step Component
 * Step 5: Select preferred language (English/Hinglish)
 */

'use client';

import { LANGUAGE_CONFIGS } from '@/lib/config/questionnaire';
import { LanguageType } from '@/lib/types/user';
import { motion } from 'framer-motion';
import { Check, Globe, MessageSquare } from 'lucide-react';
import { useState } from 'react';

interface LanguageSelectionProps {
  selectedLanguage?: LanguageType;
  onSelect: (language: LanguageType) => void;
  className?: string;
}

export default function LanguageSelection({
  selectedLanguage,
  onSelect,
  className = '',
}: LanguageSelectionProps) {
  const [hoveredLanguage, setHoveredLanguage] = useState<LanguageType | null>(
    null
  );

  const handleLanguageSelect = (language: LanguageType) => {
    onSelect(language);
  };

  return (
    <div className={`w-full max-w-3xl mx-auto ${className}`}>
      {/* Header */}
      <div className='text-center mb-8'>
        <p className='text-gray-600'>
          Choose your preferred language for the AI responses and interface
        </p>
      </div>

      {/* Language Options */}
      <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
        {Object.entries(LANGUAGE_CONFIGS).map(([langKey, config]) => {
          const language = langKey as LanguageType;
          const isSelected = selectedLanguage === language;
          const isHovered = hoveredLanguage === language;

          return (
            <motion.div
              key={language}
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
              onClick={() => handleLanguageSelect(language)}
              onMouseEnter={() => setHoveredLanguage(language)}
              onMouseLeave={() => setHoveredLanguage(null)}
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

              {/* Language Flag */}
              <div className='text-center mb-6'>
                <div className='text-4xl mb-3'>{config.flag}</div>
                <div className='w-16 h-16 mx-auto bg-gradient-to-br from-teal-500 to-teal-600 rounded-xl flex items-center justify-center'>
                  <Globe className='w-8 h-8 text-white' />
                </div>
              </div>

              {/* Language Info */}
              <div className='text-center'>
                <h3 className='text-xl font-bold text-gray-900 mb-2'>
                  {config.name}
                </h3>
                <p className='text-gray-600 mb-4'>{config.description}</p>

                {/* Features */}
                <div className='space-y-2 text-sm text-gray-500'>
                  {language === 'English' && (
                    <>
                      <div className='flex items-center justify-center space-x-2'>
                        <MessageSquare className='w-4 h-4' />
                        <span>Full English interface</span>
                      </div>
                      <div className='flex items-center justify-center space-x-2'>
                        <span>📚</span>
                        <span>Academic terminology</span>
                      </div>
                      <div className='flex items-center justify-center space-x-2'>
                        <span>🎯</span>
                        <span>Formal explanations</span>
                      </div>
                    </>
                  )}
                  {language === 'Hinglish' && (
                    <>
                      <div className='flex items-center justify-center space-x-2'>
                        <MessageSquare className='w-4 h-4' />
                        <span>Hindi + English mix</span>
                      </div>
                      <div className='flex items-center justify-center space-x-2'>
                        <span>🇮🇳</span>
                        <span>Indian context</span>
                      </div>
                      <div className='flex items-center justify-center space-x-2'>
                        <span>💬</span>
                        <span>Casual explanations</span>
                      </div>
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
      {selectedLanguage && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className='mt-8 p-6 bg-teal-50 border border-teal-200 rounded-lg'
        >
          <div className='flex items-center space-x-4'>
            <div className='text-3xl'>
              {LANGUAGE_CONFIGS[selectedLanguage].flag}
            </div>
            <div>
              <p className='font-medium text-teal-900'>
                Selected: {LANGUAGE_CONFIGS[selectedLanguage].name}
              </p>
              <p className='text-sm text-teal-700'>
                {LANGUAGE_CONFIGS[selectedLanguage].description}
              </p>
            </div>
          </div>
        </motion.div>
      )}

      {/* Help Text */}
      <div className='mt-6 text-center'>
        <p className='text-sm text-gray-500'>
          The AI will respond in your chosen language. You can change this
          anytime in settings.
        </p>
      </div>
    </div>
  );
}
