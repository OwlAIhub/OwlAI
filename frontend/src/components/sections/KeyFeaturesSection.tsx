'use client';

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  ResponsiveContainer,
  ResponsiveText,
} from '@/components/ui/responsive-container';
import { motion } from 'framer-motion';
import {
  BarChart3,
  Gauge,
  Layout,
  ShieldCheck,
  Sparkles,
  Target,
  Timer,
  Zap,
} from 'lucide-react';

export function KeyFeaturesSection() {
  const features = [
    {
      title: 'Instant Answers',
      description:
        'Get quick responses to your study questions using AI technology. Ask questions about UGC-NET, CSIR-NET, SSC, and CTET topics and receive helpful explanations to support your learning.',
      icon: <Zap className='w-5 h-5 sm:w-6 sm:h-6 text-primary' />,
    },
    {
      title: 'Personalized Learning',
      description:
        'Chat-based learning that adapts to your questions and study needs. The AI remembers your conversation context to provide relevant follow-up explanations and study guidance.',
      icon: <Sparkles className='w-5 h-5 sm:w-6 sm:h-6 text-primary' />,
    },
    {
      title: 'Secure & Private',
      description:
        'Your chat conversations and study data are protected with standard security measures. We respect your privacy and keep your study sessions confidential.',
      icon: <ShieldCheck className='w-5 h-5 sm:w-6 sm:h-6 text-primary' />,
    },
    {
      title: 'Always Available',
      description:
        'Access your study assistant whenever you need help. Available on web browsers and mobile devices for convenient learning support throughout your preparation.',
      icon: <Timer className='w-5 h-5 sm:w-6 sm:h-6 text-primary' />,
    },
    {
      title: 'Exam‑Aligned Content',
      description:
        'Focused on competitive exam preparation including UGC-NET, CSIR-NET, SSC, and CTET. Get explanations and guidance relevant to these exam patterns and syllabus requirements.',
      icon: <Target className='w-5 h-5 sm:w-6 sm:h-6 text-primary' />,
    },
    {
      title: 'Progress Insights',
      description:
        'Track your chat history and study conversations. Review your previous questions and answers to identify areas where you need more practice and understanding.',
      icon: <BarChart3 className='w-6 h-6 text-primary' />,
    },
    {
      title: 'Distraction‑Free UI',
      description:
        'Clean, simple interface designed for focused learning. Easy-to-use chat interface that helps you concentrate on your studies without unnecessary distractions.',
      icon: <Layout className='w-6 h-6 text-primary' />,
    },
    {
      title: 'Lightweight & Fast',
      description:
        'Fast loading and responsive interface that works well on most devices and internet connections. Quick access to your study assistant without technical barriers.',
      icon: <Gauge className='w-6 h-6 text-primary' />,
    },
  ];

  return (
    <section id='features' className='py-20 bg-white'>
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
            <Sparkles className='w-8 h-8 text-primary' />
          </motion.div>
          <ResponsiveText
            as='h2'
            fluid={true}
            clamp={{
              min: '1.5rem',
              preferred: '0.875rem + 3vw',
              max: '2.25rem',
            }}
            className='font-bold text-foreground mb-4 leading-tight'
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
            className='text-muted-foreground max-w-2xl mx-auto leading-relaxed'
          >
            The essentials that make Owl AI a seamless companion for serious
            learners - blending speed, accuracy, and security with adaptive
            guidance so you can focus on understanding concepts, mastering
            practice, and progressing confidently toward your exam goals.
          </ResponsiveText>
        </motion.div>

        {/* Feature Cards */}
        <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6'>
          {features.map((f, index) => (
            <motion.div
              key={f.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: index * 0.08 }}
              viewport={{ once: true }}
            >
              <Card className='h-full border border-border/50 hover:border-primary/30 transition-all'>
                <CardHeader className='flex flex-row items-center gap-3 p-6'>
                  <div className='p-2 bg-primary/10 rounded-lg'>{f.icon}</div>
                  <CardTitle className='text-base'>{f.title}</CardTitle>
                </CardHeader>
                <CardContent className='p-6 pt-0'>
                  <CardDescription className='text-sm leading-relaxed'>
                    {f.description}
                  </CardDescription>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        {/* Subtle CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.2 }}
          viewport={{ once: true }}
          className='text-center mt-8'
        >
          <div className='flex items-center justify-center gap-3 text-sm text-muted-foreground'>
            <div className='w-1 h-1 bg-primary rounded-full' />
            <span>Refine your strengths and close your gaps with Owl AI</span>
            <div className='w-1 h-1 bg-primary rounded-full' />
          </div>
        </motion.div>
      </ResponsiveContainer>
    </section>
  );
}
