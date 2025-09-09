'use client';

import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { Check, ChevronDown, ChevronUp, X } from 'lucide-react';
import { useState } from 'react';

interface MCQProps {
  question: string;
  options: string[];
  correctAnswer: number;
  explanation?: string;
}

export function MCQComponent({ question, options, correctAnswer, explanation }: MCQProps) {
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [showResult, setShowResult] = useState(false);
  const [showExplanation, setShowExplanation] = useState(false);

  const handleSubmit = () => {
    if (selectedAnswer !== null) {
      setShowResult(true);
    }
  };

  const isCorrect = selectedAnswer === correctAnswer;

  return (
    <div className='bg-gray-50 border border-gray-200 rounded-lg p-6 my-4'>
      <h4 className='font-bold text-gray-900 mb-4'>{question}</h4>
      <div className='space-y-2 mb-4'>
        {options.map((option, index) => (
          <button
            key={index}
            onClick={() => !showResult && setSelectedAnswer(index)}
            disabled={showResult}
            className={cn(
              'w-full text-left p-3 border transition-all',
              selectedAnswer === index
                ? showResult
                  ? index === correctAnswer
                    ? 'border-green-500 bg-green-50 text-green-800'
                    : 'border-red-500 bg-red-50 text-red-800'
                  : 'border-blue-500 bg-blue-100 text-blue-800'
                : showResult && index === correctAnswer
                ? 'border-green-500 bg-green-50 text-green-800'
                : 'border-gray-300 hover:border-gray-400'
            )}
          >
            <div className='flex items-center gap-3'>
              <div className={cn(
                'w-5 h-5 border flex items-center justify-center text-sm',
                selectedAnswer === index
                  ? showResult
                    ? index === correctAnswer
                      ? 'border-green-500 bg-green-500 text-white'
                      : 'border-red-500 bg-red-500 text-white'
                    : 'border-blue-500 bg-blue-500 text-white'
                  : showResult && index === correctAnswer
                  ? 'border-green-500 bg-green-500 text-white'
                  : 'border-gray-300'
              )}>
                {showResult && selectedAnswer === index && index !== correctAnswer ? (
                  <X className='w-3 h-3' />
                ) : showResult && index === correctAnswer ? (
                  <Check className='w-3 h-3' />
                ) : (
                  String.fromCharCode(65 + index)
                )}
              </div>
              <span className='flex-1'>{option}</span>
            </div>
          </button>
        ))}
      </div>
      
      {!showResult && (
        <Button
          onClick={handleSubmit}
          disabled={selectedAnswer === null}
          className='mb-4'
        >
          Submit Answer
        </Button>
      )}
      
      {showResult && (
        <div className='mt-4'>
          <p className='font-medium mb-2'>
            {isCorrect ? 'Correct!' : 'Incorrect.'} The answer is {String.fromCharCode(65 + correctAnswer)}.
          </p>
          {explanation && (
            <div>
              <Button
                variant='outline'
                size='sm'
                onClick={() => setShowExplanation(!showExplanation)}
                className='mb-2'
              >
                {showExplanation ? 'Hide' : 'Show'} Explanation
                {showExplanation ? <ChevronUp className='w-4 h-4 ml-1' /> : <ChevronDown className='w-4 h-4 ml-1' />}
              </Button>
              {showExplanation && (
                <div className='border-l-2 border-gray-400 pl-3 text-gray-700'>
                  {explanation}
                </div>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
}