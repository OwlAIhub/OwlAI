'use client';

import { useAuth } from '@/lib/contexts/AuthContext';
import { Button } from '@/components/ui/buttons/button';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, ArrowRight, Check, BookOpen, Target, Globe, Users } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';

interface OnboardingData {
  exam: 'UGC-NET' | 'CSIR-NET' | '';
  subject: string;
  attempt: '1st' | '2nd' | '3rd+' | '';
  examCycle: string;
  language: 'English' | 'Hinglish' | '';
  source: string;
}

const examSubjects = {
  'UGC-NET': [
    'Computer Science and Applications',
    'Economics', 
    'History',
    'Law',
    'Commerce',
    'Political Science',
    'Psychology',
    'Management',
    'Education',
    'Other'
  ],
  'CSIR-NET': [
    'Chemical Sciences',
    'Earth Sciences', 
    'Life Sciences',
    'Mathematical Sciences',
    'Physical Sciences'
  ]
};

const examCycles = ['June 2025', 'Dec 2025', 'Jan 2026', 'June 2026'];

const sources = [
  'Google Search',
  'Instagram Reel', 
  'YouTube',
  'Friend / Senior',
  'Teacher / Coaching',
  'Other'
];

export default function OnboardingPage() {
  const { user, userProfile } = useAuth();
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(1);
  const [data, setData] = useState<OnboardingData>({
    exam: '',
    subject: '',
    attempt: '',
    examCycle: '',
    language: '',
    source: ''
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!user) {
      router.push('/login');
    }
  }, [user, router]);

  const handleNext = () => {
    if (currentStep < 6) {
      setCurrentStep(currentStep + 1);
    } else {
      handleComplete();
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleComplete = async () => {
    setLoading(true);
    // TODO: Save onboarding data to Firestore
    // For now, just redirect to chat
    setTimeout(() => {
      router.push('/chat');
    }, 1000);
  };

  const canProceed = () => {
    switch (currentStep) {
      case 1: return data.exam !== '';
      case 2: return data.subject !== '';
      case 3: return data.attempt !== '';
      case 4: return true; // Optional step
      case 5: return data.language !== '';
      case 6: return true; // Optional step
      default: return false;
    }
  };

  if (!user) return null;

  return (
    <div className='min-h-screen bg-gradient-to-br from-gray-50 via-gray-100 to-gray-200'>
      {/* Background Pattern */}
      <div className='absolute inset-0 bg-[linear-gradient(rgba(0,0,0,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(0,0,0,0.03)_1px,transparent_1px)] bg-[size:20px_20px] md:bg-[size:30px_30px]' />
      
      {/* Decorative Blurs */}
      <div className='absolute top-1/4 left-1/4 w-32 h-32 md:w-64 md:h-64 bg-primary/3 rounded-full blur-2xl' />
      <div className='absolute bottom-1/4 right-1/4 w-32 h-32 md:w-64 md:h-64 bg-accent/3 rounded-full blur-2xl' />
      
      <div className='relative z-10 container mx-auto px-4 py-8 max-w-2xl'>
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className='text-center mb-8'
        >
          <div className='flex items-center justify-center mb-4'>
            <BookOpen className='w-8 h-8 text-primary mr-3' />
            <h1 className='text-2xl font-bold text-foreground'>Let&apos;s Personalize Your Learning</h1>
          </div>
          <p className='text-muted-foreground'>Help us create the perfect study plan for you</p>
          
          {/* Progress Bar */}
          <div className='mt-6 w-full bg-gray-200 rounded-full h-2'>
            <div 
              className='bg-primary h-2 rounded-full transition-all duration-300'
              style={{ width: `${(currentStep / 6) * 100}%` }}
            />
          </div>
          <p className='text-xs text-muted-foreground mt-2'>Step {currentStep} of 6</p>
        </motion.div>

        {/* Question Card */}
        <motion.div
          key={currentStep}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
          className='bg-white/95 backdrop-blur-md rounded-2xl shadow-xl border border-white/20 p-8 mb-8'
        >
          <AnimatePresence mode='wait'>
            {/* Step 1: Exam Selection */}
            {currentStep === 1 && (
              <motion.div key='step1' className='space-y-6'>
                <div className='text-center mb-6'>
                  <Target className='w-12 h-12 text-primary mx-auto mb-4' />
                  <h2 className='text-xl font-semibold text-foreground mb-2'>Which Govt. exam are you studying for?</h2>
                  <p className='text-sm text-muted-foreground'>Kaunsa Govt. exam clear karna hai?</p>
                </div>
                
                <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
                  {['UGC-NET', 'CSIR-NET'].map((exam) => (
                    <button
                      key={exam}
                      onClick={() => setData({ ...data, exam: exam as 'UGC-NET' | 'CSIR-NET' })}
                      className={`p-6 rounded-xl border-2 transition-all duration-200 ${
                        data.exam === exam
                          ? 'border-primary bg-primary/5 shadow-md'
                          : 'border-gray-200 hover:border-primary/50 hover:bg-gray-50'
                      }`}
                    >
                      <div className='text-center'>
                        <div className='w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-3'>
                          <BookOpen className='w-6 h-6 text-primary' />
                        </div>
                        <h3 className='font-semibold text-foreground'>{exam}</h3>
                      </div>
                    </button>
                  ))}
                </div>
              </motion.div>
            )}

            {/* Step 2: Subject Selection */}
            {currentStep === 2 && (
              <motion.div key='step2' className='space-y-6'>
                <div className='text-center mb-6'>
                  <h2 className='text-xl font-semibold text-foreground mb-2'>Select your Paper-2 subject</h2>
                  <p className='text-sm text-muted-foreground'>Paper-2 ka subject chuniye</p>
                </div>
                
                <div className='grid grid-cols-1 sm:grid-cols-2 gap-3'>
                  {examSubjects[data.exam as keyof typeof examSubjects]?.map((subject) => (
                    <button
                      key={subject}
                      onClick={() => setData({ ...data, subject })}
                      className={`p-4 rounded-lg border text-left transition-all duration-200 ${
                        data.subject === subject
                          ? 'border-primary bg-primary/5 text-primary'
                          : 'border-gray-200 hover:border-primary/50 hover:bg-gray-50'
                      }`}
                    >
                      <span className='text-sm font-medium'>{subject}</span>
                    </button>
                  ))}
                </div>
              </motion.div>
            )}

            {/* Step 3: Attempt Selection */}
            {currentStep === 3 && (
              <motion.div key='step3' className='space-y-6'>
                <div className='text-center mb-6'>
                  <h2 className='text-xl font-semibold text-foreground mb-2'>Is this your 1st, 2nd or 3rd+ attempt?</h2>
                  <p className='text-sm text-muted-foreground'>Yeh aap ka pehla, doosra ya teesra + attempt hai?</p>
                </div>
                
                <div className='grid grid-cols-1 sm:grid-cols-3 gap-4'>
                  {[
                    { value: '1st', label: '1st Attempt', emoji: '🤞', desc: 'Newbie' },
                    { value: '2nd', label: '2nd Attempt', emoji: '🔄', desc: 'Returning' },
                    { value: '3rd+', label: '3rd+ Attempt', emoji: '💪', desc: 'Pro Grinder' }
                  ].map((attempt) => (
                    <button
                      key={attempt.value}
                      onClick={() => setData({ ...data, attempt: attempt.value as '1st' | '2nd' | '3rd+' })}
                      className={`p-6 rounded-xl border-2 transition-all duration-200 ${
                        data.attempt === attempt.value
                          ? 'border-primary bg-primary/5 shadow-md'
                          : 'border-gray-200 hover:border-primary/50 hover:bg-gray-50'
                      }`}
                    >
                      <div className='text-center'>
                        <div className='text-2xl mb-2'>{attempt.emoji}</div>
                        <h3 className='font-semibold text-foreground'>{attempt.label}</h3>
                        <p className='text-xs text-muted-foreground mt-1'>{attempt.desc}</p>
                      </div>
                    </button>
                  ))}
                </div>
              </motion.div>
            )}

            {/* Step 4: Exam Cycle (Optional) */}
            {currentStep === 4 && (
              <motion.div key='step4' className='space-y-6'>
                <div className='text-center mb-6'>
                  <h2 className='text-xl font-semibold text-foreground mb-2'>Which exam cycle are you aiming for?</h2>
                  <p className='text-sm text-muted-foreground'>Kaun-si exam cycle aapki target hai? (Skip kar sakte ho)</p>
                </div>
                
                <div className='grid grid-cols-2 sm:grid-cols-4 gap-3'>
                  {examCycles.map((cycle) => (
                    <button
                      key={cycle}
                      onClick={() => setData({ ...data, examCycle: cycle })}
                      className={`p-4 rounded-lg border text-center transition-all duration-200 ${
                        data.examCycle === cycle
                          ? 'border-primary bg-primary/5 text-primary'
                          : 'border-gray-200 hover:border-primary/50 hover:bg-gray-50'
                      }`}
                    >
                      <span className='text-sm font-medium'>{cycle}</span>
                    </button>
                  ))}
                </div>
                
                <div className='text-center'>
                  <button
                    onClick={() => setData({ ...data, examCycle: '' })}
                    className='text-sm text-muted-foreground hover:text-foreground transition-colors'
                  >
                    Not sure yet
                  </button>
                </div>
              </motion.div>
            )}

            {/* Step 5: Language Selection */}
            {currentStep === 5 && (
              <motion.div key='step5' className='space-y-6'>
                <div className='text-center mb-6'>
                  <Globe className='w-12 h-12 text-primary mx-auto mb-4' />
                  <h2 className='text-xl font-semibold text-foreground mb-2'>App language?</h2>
                  <p className='text-sm text-muted-foreground'>Kis bhasha mein padhna pasand karoge?</p>
                </div>
                
                <div className='grid grid-cols-1 sm:grid-cols-2 gap-4'>
                  {[
                    { value: 'English', label: 'English', desc: 'Full English content' },
                    { value: 'Hinglish', label: 'Hinglish', desc: 'Hindi + English mix' }
                  ].map((lang) => (
                    <button
                      key={lang.value}
                      onClick={() => setData({ ...data, language: lang.value as 'English' | 'Hinglish' })}
                      className={`p-6 rounded-xl border-2 transition-all duration-200 ${
                        data.language === lang.value
                          ? 'border-primary bg-primary/5 shadow-md'
                          : 'border-gray-200 hover:border-primary/50 hover:bg-gray-50'
                      }`}
                    >
                      <div className='text-center'>
                        <h3 className='font-semibold text-foreground'>{lang.label}</h3>
                        <p className='text-xs text-muted-foreground mt-1'>{lang.desc}</p>
                      </div>
                    </button>
                  ))}
                </div>
              </motion.div>
            )}

            {/* Step 6: Source (Optional) */}
            {currentStep === 6 && (
              <motion.div key='step6' className='space-y-6'>
                <div className='text-center mb-6'>
                  <Users className='w-12 h-12 text-primary mx-auto mb-4' />
                  <h2 className='text-xl font-semibold text-foreground mb-2'>Where did you find OwlAI?</h2>
                  <p className='text-sm text-muted-foreground'>OwlAI ke barein mein kahan se pata chala?</p>
                </div>
                
                <div className='grid grid-cols-1 sm:grid-cols-2 gap-3'>
                  {sources.map((source) => (
                    <button
                      key={source}
                      onClick={() => setData({ ...data, source })}
                      className={`p-4 rounded-lg border text-left transition-all duration-200 ${
                        data.source === source
                          ? 'border-primary bg-primary/5 text-primary'
                          : 'border-gray-200 hover:border-primary/50 hover:bg-gray-50'
                      }`}
                    >
                      <span className='text-sm font-medium'>{source}</span>
                    </button>
                  ))}
                </div>
                
                <div className='text-center'>
                  <button
                    onClick={() => setData({ ...data, source: '' })}
                    className='text-sm text-muted-foreground hover:text-foreground transition-colors'
                  >
                    Skip this question
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>

        {/* Navigation */}
        <div className='flex justify-between items-center'>
          <Button
            variant='outline'
            onClick={handleBack}
            disabled={currentStep === 1}
            className='flex items-center gap-2'
          >
            <ArrowLeft className='w-4 h-4' />
            Back
          </Button>
          
          <Button
            onClick={handleNext}
            disabled={!canProceed() || loading}
            className='flex items-center gap-2'
          >
            {loading ? (
              'Setting up...'
            ) : currentStep === 6 ? (
              <>
                <Check className='w-4 h-4' />
                Complete Setup
              </>
            ) : (
              <>
                Next
                <ArrowRight className='w-4 h-4' />
              </>
            )}
          </Button>
        </div>
      </div>
    </div>
  );
}