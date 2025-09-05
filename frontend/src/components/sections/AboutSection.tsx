'use client';

import {
  ResponsiveContainer,
  ResponsiveImage,
  ResponsiveText,
} from '@/components/ui/responsive-container';
import { motion } from 'framer-motion';
import { BookOpen, Clock, Globe, Target } from 'lucide-react';

const features = [
  {
    icon: Clock,
    title: '24/7 AI-powered assistance',
    description: 'for uninterrupted learning',
  },
  {
    icon: BookOpen,
    title: 'Specialized content for competitive exams',
    description: 'with expert-curated materials',
  },
  {
    icon: Globe,
    title: 'Multi-language support',
    description: 'for diverse learning preferences',
  },
  {
    icon: Target,
    title: 'Personalized learning paths',
    description: 'based on your progress and performance',
  },
];

export function AboutSection() {
  return (
    <section
      id='about'
      className='min-h-screen flex items-center px-4 sm:px-6 md:px-8 py-16 sm:py-20 md:py-24 lg:py-0 bg-white'
    >
      <ResponsiveContainer maxWidth='5xl' padding='none'>
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className='text-center mb-8 sm:mb-10 md:mb-12 lg:mb-16'
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            viewport={{ once: true }}
            className='inline-flex items-center justify-center w-14 h-14 sm:w-16 sm:h-16 bg-primary/10 rounded-2xl mb-4 sm:mb-6'
          >
            <BookOpen className='w-6 h-6 sm:w-8 sm:h-8 text-primary' />
          </motion.div>
          <ResponsiveText
            as='h2'
            fluid={true}
            clamp={{
              min: '1.5rem',
              preferred: '0.875rem + 3vw',
              max: '2.25rem',
            }}
            className='font-bold text-foreground mb-3 sm:mb-4 leading-tight px-4'
          >
            <span className='text-foreground'>About </span>
            <span className='bg-gradient-to-r from-primary via-primary to-accent bg-clip-text text-transparent relative'>
              Owl AI?
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
            className='text-muted-foreground max-w-2xl mx-auto leading-relaxed px-4'
          >
            Discover how Owl AI revolutionizes your exam preparation with
            cutting-edge technology and personalized learning experiences.
          </ResponsiveText>
        </motion.div>

        {/* Content */}
        <div className='grid grid-cols-1 md:grid-cols-2 gap-8 sm:gap-10 md:gap-12 lg:gap-16 items-center'>
          {/* Content Side */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            viewport={{ once: true }}
            className='space-y-6 sm:space-y-7 md:space-y-8 order-2 md:order-1'
          >
            {/* Main Description */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.4 }}
              viewport={{ once: true }}
              className='space-y-4 sm:space-y-5 px-4 md:px-0'
            >
              <ResponsiveText
                as='p'
                size='base'
                className='text-muted-foreground leading-relaxed'
              >
                Owl AI is your intelligent study companion designed specifically
                for competitive exam preparation. Our advanced AI technology
                provides instant, accurate answers to your questions, helping
                you understand complex concepts and prepare more effectively for
                exams like UGC-NET, CSIR-NET, SSC, and CTET.
              </ResponsiveText>
              <ResponsiveText
                as='p'
                size='base'
                className='text-muted-foreground leading-relaxed'
              >
                With years of research in educational technology and natural
                language processing, we&apos;ve created a platform that
                understands your learning needs and adapts to your study
                patterns, making exam preparation more efficient and enjoyable.
              </ResponsiveText>
            </motion.div>

            {/* Features List */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.5 }}
              viewport={{ once: true }}
              className='px-4 md:px-0'
            >
              <div className='space-y-4 sm:space-y-5'>
                {features.map((feature, index) => (
                  <motion.div
                    key={feature.title}
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.4, delay: 0.6 + index * 0.1 }}
                    viewport={{ once: true }}
                    className='flex items-start gap-3 sm:gap-4'
                  >
                    <div className='flex-shrink-0 w-5 h-5 sm:w-6 sm:h-6 bg-primary/10 rounded-full flex items-center justify-center mt-0.5'>
                      <feature.icon className='w-2.5 h-2.5 sm:w-3 sm:h-3 text-primary' />
                    </div>
                    <div className='flex-1'>
                      <ResponsiveText
                        as='h4'
                        size='base'
                        className='font-semibold text-foreground mb-1 sm:mb-1.5'
                      >
                        {feature.title}
                      </ResponsiveText>
                      <ResponsiveText
                        as='p'
                        size='sm'
                        className='text-muted-foreground leading-relaxed'
                      >
                        {feature.description}
                      </ResponsiveText>
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </motion.div>

          {/* Image Side - Moved more to the right */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            viewport={{ once: true }}
            className='flex items-center justify-center md:justify-end order-1 md:order-2 px-4 md:px-0'
          >
            <div className='w-full max-w-xs sm:max-w-sm md:max-w-md lg:max-w-lg'>
              <ResponsiveImage
                src='/about-section.png'
                alt='Owl AI - Intelligent Learning Assistant for Competitive Exam Preparation'
                className='w-full h-auto object-contain'
                loading='lazy'
              />
            </div>
          </motion.div>
        </div>
      </ResponsiveContainer>
    </section>
  );
}
