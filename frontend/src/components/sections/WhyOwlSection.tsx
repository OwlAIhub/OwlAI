'use client';

import {
  ResponsiveContainer,
  ResponsiveText,
} from '@/components/ui/responsive-container';
import { cn } from '@/lib/utils';
import { motion } from 'framer-motion';
import {
  BookOpen,
  Brain,
  Clock,
  Globe,
  Shield,
  Target,
  Users,
  Zap,
} from 'lucide-react';

export function WhyOwlSection() {
  const features = [
    {
      title: 'AI-Powered Learning',
      description:
        'Advanced artificial intelligence that adapts to your learning style and provides personalized explanations for complex topics with intelligent recommendations.',
      icon: <Brain className='w-5 h-5 sm:w-6 sm:h-6 text-primary' />,
    },
    {
      title: 'Multi-Language Support',
      description:
        'Study in English, Hindi, or regional languages with explanations and answers in your preferred language for enhanced understanding and accessibility.',
      icon: <Globe className='w-5 h-5 sm:w-6 sm:h-6 text-primary' />,
    },
    {
      title: 'Comprehensive Solutions',
      description:
        'Access thousands of solved problems with detailed step-by-step explanations and expert-curated study materials covering all major competitive exam topics.',
      icon: <BookOpen className='w-5 h-5 sm:w-6 sm:h-6 text-primary' />,
    },
    {
      title: 'Instant Responses',
      description:
        'Get accurate answers in seconds with our optimized AI that delivers lightning-fast responses to maintain your study momentum and focus.',
      icon: <Zap className='w-5 h-5 sm:w-6 sm:h-6 text-primary' />,
    },
    {
      title: '100% Secure & Private',
      description:
        'Your data is protected with enterprise-grade security protocols ensuring your study sessions and questions remain completely private and confidential.',
      icon: <Shield className='w-5 h-5 sm:w-6 sm:h-6 text-primary' />,
    },
    {
      title: 'Exam-Focused Content',
      description:
        'Content specifically curated for UGC-NET, CSIR-NET, SSC, CTET, and other competitive exams with comprehensive syllabus coverage and updates.',
      icon: <Target className='w-5 h-5 sm:w-6 sm:h-6 text-primary' />,
    },
    {
      title: '24/7 Availability',
      description:
        "Study anytime, anywhere with our AI assistant that's always ready to help you learn, even during late-night study sessions and weekends.",
      icon: <Clock className='w-5 h-5 sm:w-6 sm:h-6 text-primary' />,
    },
    {
      title: 'Community Learning',
      description:
        'Join thousands of students preparing for the same exams to share insights, discuss strategies, and learn from collective knowledge and experiences.',
      icon: <Users className='w-5 h-5 sm:w-6 sm:h-6 text-primary' />,
    },
  ];

  return (
    <section
      id='why-choose-us'
      className='py-20 bg-white'
    >
      <ResponsiveContainer maxWidth='6xl' padding='md'>
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className='text-center mb-16'
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            viewport={{ once: true }}
            className='inline-flex items-center justify-center w-16 h-16 bg-primary/10 rounded-2xl mb-4'
          >
            <Zap className='w-8 h-8 text-primary' />
          </motion.div>
          <ResponsiveText
            as='h2'
            fluid={true}
            clamp={{
              min: '1.5rem',
              preferred: '0.875rem + 3vw',
              max: '2.25rem',
            }}
            className='font-bold text-foreground mb-4 leading-tight text-center max-w-4xl mx-auto'
          >
            <span className='text-foreground'>The Ultimate </span>
            <span className='bg-gradient-to-r from-primary via-primary to-accent bg-clip-text text-transparent relative'>
              Learning Advantage
              {/* Elegant decorative underline */}
              <div className='absolute -bottom-2 left-0 right-0'>
                {/* Main underline with gradient */}
                <div className='w-full h-0.5 bg-gradient-to-r from-transparent via-primary to-transparent opacity-80'></div>
                {/* Subtle accent line */}
                <div className='w-3/4 h-0.5 bg-gradient-to-r from-primary/40 to-accent/40 mx-auto mt-1 rounded-full'></div>
                {/* Decorative dot */}
                <div className='absolute -top-1 left-1/2 transform -translate-x-1/2 w-1 h-1 bg-primary rounded-full'></div>
              </div>
            </span>
          </ResponsiveText>
          <ResponsiveText
            as='p'
            size='lg'
            className='text-muted-foreground max-w-3xl mx-auto leading-relaxed text-center'
          >
            Discover why thousands of students choose Owl AI for their
            competitive exam preparation journey.
          </ResponsiveText>
        </motion.div>

        {/* Features Grid */}
        <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 relative z-10'>
          {features.map((feature, index) => (
            <Feature key={feature.title} {...feature} index={index} />
          ))}
        </div>
      </ResponsiveContainer>
    </section>
  );
}

const Feature = ({
  title,
  description,
  icon,
  index,
}: {
  title: string;
  description: string;
  icon: React.ReactNode;
  index: number;
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      viewport={{ once: true }}
      className={cn(
        'flex flex-col lg:border-r border-border/50 py-8 relative group/feature',
        (index === 0 || index === 4) && 'lg:border-l border-border/50',
        index < 4 && 'lg:border-b border-border/50'
      )}
    >
      {index < 4 && (
        <div className='opacity-0 group-hover/feature:opacity-100 transition duration-200 absolute inset-0 h-full w-full bg-gradient-to-t from-primary/5 to-transparent pointer-events-none' />
      )}
      {index >= 4 && (
        <div className='opacity-0 group-hover/feature:opacity-100 transition duration-200 absolute inset-0 h-full w-full bg-gradient-to-b from-primary/5 to-transparent pointer-events-none' />
      )}

      <div className='mb-4 relative z-10 px-6 text-primary'>
        {icon}
      </div>

      <div className='text-lg font-bold mb-3 relative z-10 px-6'>
        <div className='absolute left-0 inset-y-0 h-6 group-hover/feature:h-8 w-1 rounded-tr-full rounded-br-full bg-border group-hover/feature:bg-primary transition-all duration-200 origin-center' />
        <span className='group-hover/feature:translate-x-2 transition duration-200 inline-block text-foreground'>
          {title}
        </span>
      </div>

      <ResponsiveText
        as='p'
        size='sm'
        className='text-muted-foreground max-w-xs relative z-10 px-6 leading-relaxed'
      >
        {description}
      </ResponsiveText>
    </motion.div>
  );
};
