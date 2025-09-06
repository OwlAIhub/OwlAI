'use client';

import {
  ResponsiveContainer,
  ResponsiveText,
} from '@/components/ui/responsive-container';
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
      className='min-h-screen flex items-start justify-center px-4 sm:px-6 md:px-8 pt-20 sm:pt-24 md:pt-28 lg:pt-32 pb-12 sm:pb-16 md:pb-20 lg:pb-16 bg-white'
    >
      <ResponsiveContainer maxWidth='7xl' padding='none'>
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className='text-center mb-8 sm:mb-10 md:mb-12 lg:mb-14'
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            viewport={{ once: true }}
            className='inline-flex items-center justify-center w-12 h-12 sm:w-14 sm:h-14 md:w-16 md:h-16 bg-primary/10 rounded-2xl mb-3 sm:mb-4 md:mb-5'
          >
            <Zap className='w-5 h-5 sm:w-6 sm:h-6 md:w-8 md:h-8 text-primary' />
          </motion.div>
          <ResponsiveText
            as='h2'
            fluid={true}
            clamp={{
              min: '1.5rem',
              preferred: '0.875rem + 3vw',
              max: '2.25rem',
            }}
            className='font-bold text-foreground mb-3 sm:mb-4 md:mb-5 leading-tight px-4 text-center max-w-4xl mx-auto'
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
            className='text-muted-foreground max-w-3xl mx-auto leading-relaxed px-4 text-center'
          >
            Discover why thousands of students choose Owl AI for their
            competitive exam preparation journey.
          </ResponsiveText>
        </motion.div>

        {/* Features Grid */}
        <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 md:gap-8 relative z-10 py-6 sm:py-8 md:py-10 max-w-7xl mx-auto'>
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
      initial={{ opacity: 0, y: 30, scale: 0.95 }}
      whileInView={{ opacity: 1, y: 0, scale: 1 }}
      transition={{
        duration: 0.6,
        delay: index * 0.1,
        type: 'spring',
        stiffness: 100,
        damping: 15,
      }}
      viewport={{ once: true }}
      whileHover={{
        y: -8,
        scale: 1.02,
        transition: { duration: 0.3, ease: 'easeOut' },
      }}
      className='group/feature relative'
    >
      {/* Card Container */}
      <div className='relative h-full bg-white/80 backdrop-blur-sm border border-border/20 rounded-2xl p-6 sm:p-8 shadow-lg hover:shadow-2xl transition-all duration-500 overflow-hidden'>
        {/* Animated Background Gradient */}
        <div className='absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-accent/5 opacity-0 group-hover/feature:opacity-100 transition-opacity duration-500' />

        {/* Floating Particles Effect */}
        <div className='absolute inset-0 overflow-hidden'>
          <div className='absolute top-4 right-4 w-2 h-2 bg-primary/20 rounded-full opacity-0 group-hover/feature:opacity-100 group-hover/feature:animate-ping transition-opacity duration-500' />
          <div className='absolute bottom-6 left-6 w-1.5 h-1.5 bg-accent/30 rounded-full opacity-0 group-hover/feature:opacity-100 group-hover/feature:animate-pulse transition-opacity duration-700' />
          <div className='absolute top-1/2 right-8 w-1 h-1 bg-primary/40 rounded-full opacity-0 group-hover/feature:opacity-100 group-hover/feature:animate-bounce transition-opacity duration-600' />
        </div>

        {/* Icon Container with Enhanced Styling */}
        <motion.div
          className='relative mb-6'
          whileHover={{ rotate: 5, scale: 1.1 }}
          transition={{ duration: 0.3 }}
        >
          <div className='inline-flex items-center justify-center w-14 h-14 sm:w-16 sm:h-16 bg-gradient-to-br from-primary/10 to-accent/10 rounded-2xl border border-primary/20 group-hover/feature:border-primary/40 transition-all duration-300'>
            <div className='text-primary group-hover/feature:text-accent transition-colors duration-300'>
              {icon}
            </div>
          </div>

          {/* Icon Glow Effect */}
          <div className='absolute inset-0 bg-gradient-to-br from-primary/20 to-accent/20 rounded-2xl blur-xl opacity-0 group-hover/feature:opacity-50 transition-opacity duration-500' />
        </motion.div>

        {/* Title with Enhanced Typography */}
        <motion.h3
          className='text-lg sm:text-xl font-bold text-foreground mb-4 leading-tight group-hover/feature:text-primary transition-colors duration-300'
          whileHover={{ x: 4 }}
          transition={{ duration: 0.2 }}
        >
          {title}
        </motion.h3>

        {/* Description with Better Spacing */}
        <p className='text-sm sm:text-base text-muted-foreground leading-relaxed group-hover/feature:text-foreground/80 transition-colors duration-300'>
          {description}
        </p>

        {/* Bottom Accent Line */}
        <div className='absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-primary/30 to-transparent opacity-0 group-hover/feature:opacity-100 transition-opacity duration-500' />

        {/* Corner Decoration */}
        <div className='absolute top-4 right-4 w-6 h-6 border-t-2 border-r-2 border-primary/20 rounded-tr-lg opacity-0 group-hover/feature:opacity-100 group-hover/feature:border-primary/60 transition-all duration-500' />
        <div className='absolute bottom-4 left-4 w-6 h-6 border-b-2 border-l-2 border-accent/20 rounded-bl-lg opacity-0 group-hover/feature:opacity-100 group-hover/feature:border-accent/60 transition-all duration-500' />
      </div>
    </motion.div>
  );
};
