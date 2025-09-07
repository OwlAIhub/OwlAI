'use client';

import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { QuestionnaireData } from '@/lib/auth';
import { cn } from '@/lib/utils';
import { motion } from 'framer-motion';
import { Check, Search } from 'lucide-react';
import { useState } from 'react';

interface QuestionnaireStep2Props {
  data: QuestionnaireData;
  updateData: (updates: Partial<QuestionnaireData>) => void;
}

const SUBJECTS = {
  'UGC NET': [
    'Computer Science and Applications',
    'Economics',
    'History',
    'Law',
    'Commerce',
    'Political Science',
    'Psychology',
    'Management',
    'Education',
    'Other (Type)',
  ],
  'CSIR NET': [
    'Chemical Sciences',
    'Earth Sciences',
    'Life Sciences',
    'Mathematical Sciences',
    'Physical Sciences',
  ],
};

export function QuestionnaireStep2({
  data,
  updateData,
}: QuestionnaireStep2Props) {
  const [subjectSearch, setSubjectSearch] = useState('');
  const [customSubject, setCustomSubject] = useState('');

  const subjects = data.exam ? SUBJECTS[data.exam] : [];
  const filteredSubjects = subjects.filter(subject =>
    subject.toLowerCase().includes(subjectSearch.toLowerCase())
  );

  return (
    <div className='space-y-6'>
      <div className='text-center space-y-2'>
        <h2 className='text-xl font-bold text-foreground'>
          Select your subject
        </h2>
      </div>

      {/* Search */}
      <div className='relative'>
        <Search className='absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4' />
        <Input
          placeholder='Search subjects...'
          value={subjectSearch}
          onChange={e => setSubjectSearch(e.target.value)}
          className='pl-10'
        />
      </div>

      {/* Subject Selection */}
      <div className='grid grid-cols-1 sm:grid-cols-2 gap-3'>
        {filteredSubjects.map(subject => (
          <motion.div
            key={subject}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <Card
              className={cn(
                'cursor-pointer transition-all duration-200',
                data.subject === subject
                  ? 'ring-2 ring-primary bg-primary/5 border-primary'
                  : 'hover:border-primary/50'
              )}
              onClick={() => updateData({ subject })}
            >
              <CardContent className='p-4'>
                <div className='flex items-center justify-between'>
                  <span className='text-sm font-medium text-foreground'>
                    {subject}
                  </span>
                  {data.subject === subject && (
                    <Check className='w-4 h-4 text-primary' />
                  )}
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Custom Subject Input */}
      {data.subject === 'Other (Type)' && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          className='space-y-2'
        >
          <Label htmlFor='customSubject'>Enter your subject</Label>
          <Input
            id='customSubject'
            placeholder='Type your subject here...'
            value={customSubject}
            onChange={e => setCustomSubject(e.target.value)}
          />
        </motion.div>
      )}
    </div>
  );
}
