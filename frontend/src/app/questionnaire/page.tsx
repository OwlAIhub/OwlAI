/**
 * Questionnaire Page
 * Test page for the questionnaire system
 */

'use client';

import { QuestionnaireContainer } from '@/components/questionnaire';
import { OnboardingProgress } from '@/lib/types/user';
import { useState } from 'react';

export default function QuestionnairePage() {
  const [isCompleted, setIsCompleted] = useState(false);
  const [answers, setAnswers] = useState<OnboardingProgress['answers']>({});

  const handleComplete = async (
    questionnaireAnswers: OnboardingProgress['answers']
  ) => {
    console.log('Questionnaire completed with answers:', questionnaireAnswers);
    setAnswers(questionnaireAnswers);
    setIsCompleted(true);

    // Here you would typically:
    // 1. Save to database
    // 2. Update user profile
    // 3. Redirect to chat
  };

  if (isCompleted) {
    return (
      <div className='min-h-screen bg-gray-50 flex items-center justify-center p-6'>
        <div className='max-w-2xl mx-auto text-center'>
          <div className='w-16 h-16 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-6'>
            <span className='text-2xl'>✅</span>
          </div>
          <h1 className='text-3xl font-bold text-gray-900 mb-4'>
            Questionnaire Completed!
          </h1>
          <p className='text-gray-600 mb-8'>
            Your profile has been set up successfully. You&apos;re ready to
            start your learning journey!
          </p>

          {/* Display Answers */}
          <div className='bg-white rounded-lg p-6 shadow-sm border'>
            <h2 className='text-lg font-semibold mb-4'>Your Answers:</h2>
            <div className='space-y-2 text-left'>
              <div>
                <strong>Exam:</strong> {answers.exam}
              </div>
              <div>
                <strong>Subject:</strong> {answers.subject}
              </div>
              <div>
                <strong>Attempt:</strong> {answers.attempt}
              </div>
              <div>
                <strong>Cycle:</strong> {answers.cycle || 'Not specified'}
              </div>
              <div>
                <strong>Language:</strong> {answers.language}
              </div>
              <div>
                <strong>Source:</strong>{' '}
                {answers.marketingSource || 'Not specified'}
              </div>
            </div>
          </div>

          <button
            onClick={() => {
              setIsCompleted(false);
              setAnswers({});
            }}
            className='mt-6 px-6 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700 transition-colors'
          >
            Start Over
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className='min-h-screen bg-gray-50 py-4'>
      <div className='container mx-auto px-4'>
        {/* Header */}
        <div className='text-center mb-4'>
          <h1 className='text-xl font-bold text-gray-900 mb-1'>
            Welcome to OwlAI
          </h1>
          <p className='text-sm text-gray-600'>
            Let&apos;s set up your personalized learning experience
          </p>
        </div>

        {/* Questionnaire */}
        <QuestionnaireContainer
          onComplete={handleComplete}
          className='bg-white rounded-lg shadow-sm border p-4'
        />
      </div>
    </div>
  );
}
