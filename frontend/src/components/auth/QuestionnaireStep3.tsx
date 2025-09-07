'use client';

import { Card, CardContent } from '@/components/ui/card';
import { QuestionnaireData } from '@/lib/auth';
import { cn } from '@/lib/utils';
import { motion } from 'framer-motion';
import { Check } from 'lucide-react';

interface QuestionnaireStep3Props {
  data: QuestionnaireData;
  updateData: (updates: Partial<QuestionnaireData>) => void;
}

const ATTEMPTS = [
  {
    value: '1st',
    label: '1st attempt',
    emoji: '🤞',
    description: 'New to the exam',
  },
  {
    value: '2nd',
    label: '2nd attempt',
    emoji: '🔄',
    description: 'Giving it another shot',
  },
  {
    value: '3rd+',
    label: '3rd+ attempt',
    emoji: '💪',
    description: 'Pro grinder',
  },
];

export function QuestionnaireStep3({
  data,
  updateData,
}: QuestionnaireStep3Props) {
  return (
    <div className='space-y-6'>
      <div className='text-center space-y-4'>
        <h2 className='text-2xl font-bold text-foreground'>
          Is this your 1st, 2nd or 3rd+ attempt?
        </h2>
        <p className='text-muted-foreground'>
          Is this your first, second, or third+ attempt?
        </p>
      </div>

      <div className='grid grid-cols-1 md:grid-cols-3 gap-4'>
        {ATTEMPTS.map(attempt => (
          <motion.div
            key={attempt.value}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <Card
              className={cn(
                'cursor-pointer transition-all duration-200 hover:shadow-lg',
                data.attempt === attempt.value
                  ? 'ring-2 ring-primary bg-primary/5 border-primary'
                  : 'hover:border-primary/50'
              )}
              onClick={() =>
                updateData({ attempt: attempt.value as '1st' | '2nd' | '3rd+' })
              }
            >
              <CardContent className='p-6 text-center space-y-4'>
                <div className='text-4xl'>{attempt.emoji}</div>
                <div>
                  <h3 className='text-lg font-semibold text-foreground'>
                    {attempt.label}
                  </h3>
                  <p className='text-sm text-muted-foreground'>
                    {attempt.description}
                  </p>
                </div>
                {data.attempt === attempt.value && (
                  <div className='flex items-center justify-center text-primary'>
                    <Check className='w-5 h-5' />
                  </div>
                )}
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
