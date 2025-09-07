'use client';

import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { QuestionnaireData } from '@/lib/auth';
import { cn } from '@/lib/utils';
import { motion } from 'framer-motion';
import { Check } from 'lucide-react';

interface QuestionnaireStep6Props {
  data: QuestionnaireData;
  updateData: (updates: Partial<QuestionnaireData>) => void;
}

const MARKETING_SOURCES = [
  'Google Search',
  'Instagram Reel',
  'YouTube',
  'Friend / Senior',
  'Teacher / Coaching',
  'Other',
];

export function QuestionnaireStep6({
  data,
  updateData,
}: QuestionnaireStep6Props) {
  return (
    <div className='space-y-6'>
      <div className='text-center space-y-4'>
        <h2 className='text-2xl font-bold text-foreground'>
          Where did you find OwlAI?
        </h2>
        <p className='text-muted-foreground'>
          OwlAI ke barein mein kahan se pata chala?
        </p>
      </div>

      <div className='grid grid-cols-2 md:grid-cols-3 gap-3'>
        {MARKETING_SOURCES.map(source => (
          <motion.div
            key={source}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <Card
              className={cn(
                'cursor-pointer transition-all duration-200',
                data.marketingSource === source
                  ? 'ring-2 ring-primary bg-primary/5 border-primary'
                  : 'hover:border-primary/50'
              )}
              onClick={() => updateData({ marketingSource: source })}
            >
              <CardContent className='p-4 text-center'>
                <span className='text-sm font-medium text-foreground'>
                  {source}
                </span>
                {data.marketingSource === source && (
                  <div className='flex items-center justify-center text-primary mt-2'>
                    <Check className='w-4 h-4' />
                  </div>
                )}
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      <div className='text-center'>
        <Button
          variant='ghost'
          onClick={() => updateData({ marketingSource: null })}
          className='text-muted-foreground'
        >
          Skip this step
        </Button>
      </div>
    </div>
  );
}
