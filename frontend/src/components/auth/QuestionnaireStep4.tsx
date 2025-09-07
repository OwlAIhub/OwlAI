'use client';

import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { QuestionnaireData } from '@/lib/auth';
import { cn } from '@/lib/utils';
import { motion } from 'framer-motion';
import { Check } from 'lucide-react';

interface QuestionnaireStep4Props {
  data: QuestionnaireData;
  updateData: (updates: Partial<QuestionnaireData>) => void;
}

const EXAM_CYCLES = ['June 2025', 'Dec 2025', 'Jan 2026', 'June 2026'];

export function QuestionnaireStep4({
  data,
  updateData,
}: QuestionnaireStep4Props) {
  return (
    <div className='space-y-6'>
      <div className='text-center space-y-4'>
        <h2 className='text-2xl font-bold text-foreground'>
          Which exam cycle are you aiming for?
        </h2>
        <p className='text-muted-foreground'>
          Kaun-si exam cycle aapki target hai? (Skip kar sakte ho)
        </p>
      </div>

      <div className='grid grid-cols-2 md:grid-cols-4 gap-3'>
        {EXAM_CYCLES.map(cycle => (
          <motion.div
            key={cycle}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <Card
              className={cn(
                'cursor-pointer transition-all duration-200',
                data.examCycle === cycle
                  ? 'ring-2 ring-primary bg-primary/5 border-primary'
                  : 'hover:border-primary/50'
              )}
              onClick={() => updateData({ examCycle: cycle })}
            >
              <CardContent className='p-4 text-center'>
                <span className='text-sm font-medium text-foreground'>
                  {cycle}
                </span>
                {data.examCycle === cycle && (
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
          onClick={() => updateData({ examCycle: null })}
          className='text-muted-foreground'
        >
          Skip this step
        </Button>
      </div>
    </div>
  );
}
