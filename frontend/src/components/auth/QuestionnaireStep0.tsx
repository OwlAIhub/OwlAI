'use client';

import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { QuestionnaireData } from '@/lib/auth';
import { motion } from 'framer-motion';
import { User } from 'lucide-react';

interface QuestionnaireStep0Props {
  data: QuestionnaireData;
  updateData: (updates: Partial<QuestionnaireData>) => void;
}

export function QuestionnaireStep0({
  data,
  updateData,
}: QuestionnaireStep0Props) {
  return (
    <div className='space-y-6'>
      <div className='text-center space-y-2'>
        <h2 className='text-xl font-bold text-foreground'>
          What&apos;s your name?
        </h2>
        <p className='text-muted-foreground'>
          We&apos;d love to know what to call you
        </p>
      </div>

      <div className='space-y-4'>
        <div className='flex justify-center'>
          <div className='w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center'>
            <User className='w-8 h-8 text-primary' />
          </div>
        </div>

        <div className='space-y-2'>
          <Label htmlFor='fullName'>Full Name</Label>
          <Input
            id='fullName'
            type='text'
            placeholder='Enter your full name'
            value={data.fullName || ''}
            onChange={e => updateData({ fullName: e.target.value })}
            className='text-center text-lg'
            autoFocus
          />
        </div>

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className='text-center'
        >
          <p className='text-sm text-muted-foreground'>
            This will be displayed in your profile
          </p>
        </motion.div>
      </div>
    </div>
  );
}
