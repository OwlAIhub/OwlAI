'use client';

import { motion } from 'framer-motion';
import { BookOpen, Calculator, Lightbulb, Target } from 'lucide-react';

interface StarterPromptsProps {
  onPromptClick: (prompt: string) => void;
}

const starterPrompts = [
  {
    icon: <BookOpen className='w-5 h-5' />,
    title: 'Study Strategy',
    description: 'Get personalized study plans for UGC NET',
    prompt: 'Help me create a study strategy for UGC NET Paper 1',
  },
  {
    icon: <Calculator className='w-5 h-5' />,
    title: 'Practice Questions',
    description: 'Solve practice problems with explanations',
    prompt: 'Give me 5 practice questions on teaching aptitude',
  },
  {
    icon: <Lightbulb className='w-5 h-5' />,
    title: 'Concept Explanation',
    description: 'Understand complex topics easily',
    prompt: 'Explain research methodology in simple terms',
  },
  {
    icon: <Target className='w-5 h-5' />,
    title: 'Exam Preparation',
    description: 'Get ready for competitive exams',
    prompt: 'What are the key topics for CSIR NET preparation?',
  },
];

export function StarterPrompts({ onPromptClick }: StarterPromptsProps) {
  return (
    <div className='w-full max-w-4xl mx-auto'>
      <h2 className='text-xl font-semibold text-gray-900 mb-6 text-center'>
        Get Started
      </h2>
      <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
        {starterPrompts.map((prompt, index) => (
          <motion.button
            key={index}
            onClick={() => onPromptClick(prompt.prompt)}
            className='group p-4 bg-white border border-gray-200 rounded-xl hover:border-teal-300 hover:shadow-md transition-all duration-200 text-left'
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1, duration: 0.4 }}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <div className='flex items-start gap-3'>
              <div className='flex-shrink-0 w-10 h-10 bg-teal-100 rounded-lg flex items-center justify-center text-teal-600 group-hover:bg-teal-200 transition-colors'>
                {prompt.icon}
              </div>
              <div className='flex-1 min-w-0'>
                <h3 className='font-medium text-gray-900 group-hover:text-teal-700 transition-colors'>
                  {prompt.title}
                </h3>
                <p className='text-sm text-gray-600 mt-1'>
                  {prompt.description}
                </p>
              </div>
            </div>
          </motion.button>
        ))}
      </div>
    </div>
  );
}
