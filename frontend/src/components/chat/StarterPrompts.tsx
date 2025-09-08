'use client';

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
      <div className='grid grid-cols-1 md:grid-cols-2 gap-3'>
        {starterPrompts.map((prompt, index) => (
          <button
            key={index}
            onClick={() => onPromptClick(prompt.prompt)}
            className='flex items-center gap-3 p-3 border rounded-lg hover:bg-gray-50 text-left'
          >
            <div className='w-8 h-8 bg-teal-100 rounded flex items-center justify-center text-teal-600'>
              {prompt.icon}
            </div>
            <div className='min-w-0'>
              <div className='font-medium text-gray-900'>{prompt.title}</div>
              <div className='text-xs text-gray-600'>{prompt.description}</div>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}
