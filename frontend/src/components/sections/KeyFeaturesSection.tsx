'use client';

import {
  ResponsiveContainer,
  ResponsiveText,
} from '@/components/ui/responsive-container';
import { motion } from 'framer-motion';
import { Sparkles } from 'lucide-react';
import { useId } from 'react';

export function KeyFeaturesSection() {
  const features = [
    {
      title: 'AI-Powered Learning',
      description:
        'Advanced artificial intelligence that adapts to your learning style and provides personalized explanations for complex topics with intelligent recommendations.',
    },
    {
      title: 'Multi-Language Support',
      description:
        'Study in English, Hindi, or regional languages with explanations and answers in your preferred language for enhanced understanding and accessibility.',
    },
    {
      title: 'Comprehensive Solutions',
      description:
        'Access thousands of solved problems with detailed step-by-step explanations and expert-curated study materials covering all major competitive exam topics.',
    },
    {
      title: 'Exam-Focused Content',
      description:
        'Content specifically curated for UGC-NET, CSIR-NET, SSC, CTET, and other competitive exams with comprehensive syllabus coverage and updates.',
    },
    {
      title: '24/7 Availability',
      description:
        "Study anytime, anywhere with our AI assistant that's always ready to help you learn, even during late-night study sessions and weekends.",
    },
    {
      title: 'Progress Tracking',
      description:
        'Track your study progress and learning journey with detailed insights to identify areas where you need more practice and understanding.',
    },
  ];

  return (
    <section
      id='features'
      className='min-h-screen flex items-start justify-center px-4 sm:px-6 md:px-8 pt-20 sm:pt-24 md:pt-28 lg:pt-32 pb-12 sm:pb-16 md:pb-20 lg:pb-16 bg-white'
    >
      <ResponsiveContainer maxWidth='7xl' padding='none'>
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className='text-center mb-6 sm:mb-8 md:mb-10 lg:mb-12'
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            viewport={{ once: true }}
            className='inline-flex items-center justify-center w-12 h-12 sm:w-14 sm:h-14 md:w-16 md:h-16 bg-primary/10 rounded-2xl mb-3 sm:mb-4 md:mb-5'
          >
            <Sparkles className='w-5 h-5 sm:w-6 sm:h-6 md:w-8 md:h-8 text-primary' />
          </motion.div>
          <ResponsiveText
            as='h2'
            fluid={true}
            clamp={{
              min: '1.5rem',
              preferred: '0.875rem + 3vw',
              max: '2.25rem',
            }}
            className='font-bold text-foreground mb-3 sm:mb-4 md:mb-5 leading-tight px-4'
          >
            <span className='text-foreground'>Powerful </span>
            <span className='bg-gradient-to-r from-primary via-primary to-accent bg-clip-text text-transparent relative'>
              Features
              <div className='absolute -bottom-2 left-0 right-0'>
                <div className='w-full h-0.5 bg-gradient-to-r from-transparent via-primary to-transparent opacity-80'></div>
                <div className='w-3/4 h-0.5 bg-gradient-to-r from-primary/40 to-accent/40 mx-auto mt-1 rounded-full'></div>
                <div className='absolute -top-1 left-1/2 transform -translate-x-1/2 w-1 h-1 bg-primary rounded-full'></div>
              </div>
            </span>
          </ResponsiveText>
          <ResponsiveText
            as='p'
            size='lg'
            className='text-muted-foreground max-w-4xl mx-auto leading-relaxed px-4'
          >
            The essentials that make Owl AI a seamless companion for serious
            learners - blending speed, accuracy, and security with adaptive
            guidance so you can focus on understanding concepts, mastering
            practice, and progressing confidently toward your exam goals.
          </ResponsiveText>
        </motion.div>

        {/* Feature Cards */}
        <div className='py-8 lg:py-16'>
          <div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-2 gap-8 md:gap-6 max-w-6xl mx-auto'>
            {features.map(feature => (
              <div
                key={feature.title}
                className='relative bg-gradient-to-b from-neutral-100 to-white p-6 rounded-3xl overflow-hidden'
              >
                <GridPattern size={20} />
                <p className='text-base font-bold text-neutral-800 relative z-20'>
                  {feature.title}
                </p>
                <p className='text-neutral-600 mt-2 text-sm font-normal relative z-20'>
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </ResponsiveContainer>
    </section>
  );
}

export const GridPattern = ({
  pattern,
  size,
}: {
  pattern?: number[][];
  size?: number;
}) => {
  const p = pattern ?? [
    [7, 1],
    [8, 2],
    [9, 3],
    [10, 4],
    [11, 5],
  ];
  return (
    <div className='pointer-events-none absolute left-1/2 top-0  -ml-20 -mt-8 h-full w-full [mask-image:linear-gradient(white,transparent)]'>
      <div className='absolute inset-0 bg-gradient-to-r  [mask-image:radial-gradient(farthest-side_at_top,white,transparent)] from-zinc-100/30 to-zinc-300/30 opacity-100'>
        <GridSVG
          width={size ?? 20}
          height={size ?? 20}
          x={-12}
          y={-4}
          squares={p}
          className='absolute inset-0 h-full w-full  mix-blend-overlay stroke-black/10 fill-black/10'
        />
      </div>
    </div>
  );
};

export function GridSVG({
  width,
  height,
  x,
  y,
  squares,
  ...props
}: {
  width: number;
  height: number;
  x: number;
  y: number;
  squares?: number[][];
} & React.SVGProps<SVGSVGElement>) {
  const patternId = useId();

  return (
    <svg aria-hidden='true' {...props}>
      <defs>
        <pattern
          id={patternId}
          width={width}
          height={height}
          patternUnits='userSpaceOnUse'
          x={x}
          y={y}
        >
          <path d={`M.5 ${height}V.5H${width}`} fill='none' />
        </pattern>
      </defs>
      <rect
        width='100%'
        height='100%'
        strokeWidth={0}
        fill={`url(#${patternId})`}
      />
      {squares && (
        <svg x={x} y={y} className='overflow-visible'>
          {squares.map((square: number[], index: number) => {
            const [x, y] = square;
            return (
              <rect
                strokeWidth='0'
                key={`${x}-${y}-${index}`}
                width={width + 1}
                height={height + 1}
                x={x * width}
                y={y * height}
              />
            );
          })}
        </svg>
      )}
    </svg>
  );
}
