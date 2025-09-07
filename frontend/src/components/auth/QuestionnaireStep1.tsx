'use client';

import { Card, CardContent } from '@/components/ui/card';
import { QuestionnaireData } from '@/lib/auth';
import { cn } from '@/lib/utils';
import { motion } from 'framer-motion';
import { Check } from 'lucide-react';
import NextImage from 'next/image';

interface QuestionnaireStep1Props {
  data: QuestionnaireData;
  updateData: (updates: Partial<QuestionnaireData>) => void;
}

const EXAMS = {
  'UGC NET': {
    name: 'UGC NET',
    description: 'University Grants Commission National Eligibility Test',
    logo: '/UGC.png',
  },
  'CSIR NET': {
    name: 'CSIR NET',
    description: 'Council of Scientific and Industrial Research',
    logo: '/CSIR.webp',
  },
};

export function QuestionnaireStep1({
  data,
  updateData,
}: QuestionnaireStep1Props) {
  return (
    <div className='space-y-6'>
      <div className='text-center space-y-2'>
        <h2 className='text-xl font-bold text-foreground'>
          Which exam are you preparing for?
        </h2>
      </div>

      <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
        {Object.entries(EXAMS).map(([key, exam]) => (
          <motion.div
            key={key}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <Card
              className={cn(
                'cursor-pointer transition-all duration-200 hover:shadow-lg',
                data.exam === key
                  ? 'ring-2 ring-primary bg-primary/5 border-primary'
                  : 'hover:border-primary/50'
              )}
              onClick={() =>
                updateData({ exam: key as 'UGC NET' | 'CSIR NET' })
              }
            >
              <CardContent className='p-4 text-center space-y-3'>
                <div className='w-12 h-12 mx-auto bg-primary/10 rounded-lg flex items-center justify-center'>
                  <NextImage
                    src={exam.logo}
                    alt={exam.name}
                    width={24}
                    height={24}
                    className='object-contain'
                  />
                </div>
                <div>
                  <h3 className='text-base font-semibold text-foreground'>
                    {exam.name}
                  </h3>
                </div>
                {data.exam === key && (
                  <div className='flex items-center justify-center text-primary'>
                    <Check className='w-4 h-4' />
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
