'use client';

import { cn } from '@/lib/utils';
import { motion } from 'framer-motion';
import { BookOpen, Brain, Target, Zap } from 'lucide-react';

interface StarterPromptsProps {
  onPromptClick: (prompt: string) => void;
  className?: string;
}

const starterPrompts = [
  {
    id: 1,
    title: 'UGC NET Strategy',
    prompt: 'Help me create a study strategy for UGC NET Paper 1 and Paper 2',
    icon: Target,
  },
  {
    id: 2,
    title: 'Research Methodology',
    prompt: 'Explain research methodology concepts for UGC NET',
    icon: Brain,
  },
  {
    id: 3,
    title: 'Previous Year Papers',
    prompt: 'Help me solve UGC NET previous year questions',
    icon: BookOpen,
  },
  {
    id: 4,
    title: 'Teaching Aptitude',
    prompt: 'Explain teaching aptitude topics for UGC NET',
    icon: Zap,
  },
];

export function StarterPrompts({
  onPromptClick,
  className,
}: StarterPromptsProps) {
  return (
    <div className={cn('w-full max-w-3xl mx-auto', className)}>
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 0.2 }}
        className='grid grid-cols-2 gap-2'
      >
        {starterPrompts.map((prompt, index) => {
          const Icon = prompt.icon;
          return (
            <motion.button
              key={prompt.id}
              onClick={() => onPromptClick(prompt.prompt)}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.2, delay: 0.3 + index * 0.05 }}
              whileHover={{ scale: 1.01 }}
              whileTap={{ scale: 0.99 }}
              className={cn(
                'group flex items-center gap-2 px-3 py-2 rounded-lg border border-gray-200',
                'bg-white hover:bg-gray-50 transition-all duration-200',
                'focus:outline-none focus:ring-1 focus:ring-teal-500',
                'text-left'
              )}
            >
              <Icon className='w-4 h-4 text-gray-500 group-hover:text-teal-600 transition-colors duration-200' />
              <span className='text-sm text-gray-700 group-hover:text-gray-900 transition-colors duration-200'>
                {prompt.title}
              </span>
            </motion.button>
          );
        })}
      </motion.div>
    </div>
  );
}
