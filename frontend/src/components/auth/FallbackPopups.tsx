'use client';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { motion } from 'framer-motion';
import { AlertCircle, ArrowLeft, BookOpen, GraduationCap } from 'lucide-react';

interface FallbackPopupProps {
  type: 'exam' | 'subject';
  isOpen: boolean;
  onClose: () => void;
  onRedirect: (path: string) => void;
}

export function FallbackPopup({
  type,
  isOpen,
  onClose,
  onRedirect,
}: FallbackPopupProps) {
  const isExam = type === 'exam';

  const content = {
    exam: {
      title: 'Hey Aspirant!',
      message: 'OwlAI is not yet trained for this Exam category.',
      subMessage: "We're actively working to expand into more exams very soon.",
      cta: 'Stay tuned - your prep buddy is on the way!',
      buttonText: 'Change your exam to UGC NET',
      buttonAction: () => onRedirect('/questionnaire'),
      icon: <GraduationCap className='w-12 h-12 text-primary' />,
    },
    subject: {
      title: 'Hey Aspirant!',
      message: 'OwlAI is not yet trained for this Subject.',
      subMessage:
        "We're actively working to expand into more subjects very soon.",
      cta: 'Stay tuned - your prep buddy is on the way!',
      buttonText: 'Practice for Paper - 1',
      buttonAction: () => onRedirect('/questionnaire'),
      icon: <BookOpen className='w-12 h-12 text-primary' />,
    },
  };

  // Don't render if type is null or invalid
  if (!type || !content[type]) {
    return null;
  }

  const currentContent = content[type];

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className='sm:max-w-md'>
        <DialogHeader>
          <DialogTitle className='text-center text-xl font-bold text-foreground'>
            {currentContent.title}
          </DialogTitle>
          <DialogDescription className='text-center text-muted-foreground'>
            We&apos;re here to help you succeed!
          </DialogDescription>
        </DialogHeader>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className='space-y-6'
        >
          {/* Icon */}
          <div className='flex justify-center'>
            <div className='w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center'>
              {currentContent.icon}
            </div>
          </div>

          {/* Message */}
          <div className='text-center space-y-3'>
            <p className='text-foreground font-medium'>
              {currentContent.message}
            </p>
            <p className='text-muted-foreground text-sm'>
              {currentContent.subMessage}
            </p>
            <p className='text-primary font-medium text-sm'>
              {currentContent.cta}
            </p>
          </div>

          {/* Alert */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2 }}
            className='bg-blue-50 border border-blue-200 rounded-lg p-4'
          >
            <div className='flex items-start gap-3'>
              <AlertCircle className='w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0' />
              <div className='text-sm'>
                <p className='text-blue-800 font-medium'>Coming Soon!</p>
                <p className='text-blue-700'>
                  {isExam
                    ? "We're expanding to support more government exams very soon."
                    : "We're adding more subjects to our knowledge base."}
                </p>
              </div>
            </div>
          </motion.div>

          {/* Action Buttons */}
          <div className='space-y-3'>
            <Button
              onClick={currentContent.buttonAction}
              className='w-full bg-primary hover:bg-primary/90 text-white'
            >
              {currentContent.buttonText}
            </Button>

            <Button
              variant='ghost'
              onClick={onClose}
              className='w-full text-muted-foreground'
            >
              <ArrowLeft className='w-4 h-4 mr-2' />
              Go Back
            </Button>
          </div>
        </motion.div>
      </DialogContent>
    </Dialog>
  );
}

// Alternative: Inline fallback component for better UX
export function InlineFallback({
  type,
  onRedirect,
}: {
  type: 'exam' | 'subject';
  onRedirect: (path: string) => void;
}) {
  const isExam = type === 'exam';

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className='w-full max-w-2xl mx-auto'
    >
      <Card className='border-amber-200 bg-amber-50/50'>
        <CardHeader className='text-center pb-4'>
          <div className='w-16 h-16 bg-amber-100 rounded-full flex items-center justify-center mx-auto mb-4'>
            {isExam ? (
              <GraduationCap className='w-8 h-8 text-amber-600' />
            ) : (
              <BookOpen className='w-8 h-8 text-amber-600' />
            )}
          </div>
          <CardTitle className='text-xl text-amber-800'>
            Hey Aspirant!
          </CardTitle>
        </CardHeader>

        <CardContent className='space-y-6'>
          <div className='text-center space-y-3'>
            <p className='text-amber-800 font-medium'>
              {isExam
                ? 'OwlAI is not yet trained for this Exam category.'
                : 'OwlAI is not yet trained for this Subject.'}
            </p>
            <p className='text-amber-700 text-sm'>
              {isExam
                ? "We're actively working to expand into more exams very soon."
                : "We're actively working to expand into more subjects very soon."}
            </p>
            <p className='text-amber-600 font-medium text-sm'>
              Stay tuned - your prep buddy is on the way!
            </p>
          </div>

          <div className='bg-white/80 border border-amber-200 rounded-lg p-4'>
            <div className='flex items-start gap-3'>
              <AlertCircle className='w-5 h-5 text-amber-600 mt-0.5 flex-shrink-0' />
              <div className='text-sm'>
                <p className='text-amber-800 font-medium'>Coming Soon!</p>
                <p className='text-amber-700'>
                  {isExam
                    ? "We're expanding to support more government exams very soon."
                    : "We're adding more subjects to our knowledge base."}
                </p>
              </div>
            </div>
          </div>

          <div className='space-y-3'>
            <Button
              onClick={() => onRedirect('/questionnaire')}
              className='w-full bg-amber-600 hover:bg-amber-700 text-white'
            >
              {isExam
                ? 'Change your exam to UGC NET'
                : 'Practice for Paper - 1'}
            </Button>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}
