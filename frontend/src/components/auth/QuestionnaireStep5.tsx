'use client';

import { Button } from '@/components/ui/button';
import { QuestionnaireData } from '@/lib/auth';

interface QuestionnaireStep5Props {
  data: QuestionnaireData;
  updateData: (updates: Partial<QuestionnaireData>) => void;
}

export function QuestionnaireStep5({
  data,
  updateData,
}: QuestionnaireStep5Props) {
  return (
    <div className='space-y-6'>
      <div className='text-center space-y-4'>
        <h2 className='text-2xl font-bold text-foreground'>App language?</h2>
        <p className='text-muted-foreground'>
          Kis bhasha mein padhna pasand karoge?
        </p>
      </div>

      <div className='flex justify-center'>
        <div className='bg-muted rounded-lg p-1 flex'>
          {(['English', 'Hinglish'] as const).map(lang => (
            <Button
              key={lang}
              variant={data.language === lang ? 'default' : 'ghost'}
              onClick={() => updateData({ language: lang })}
              className='px-6'
            >
              {lang}
            </Button>
          ))}
        </div>
      </div>
    </div>
  );
}
