'use client';

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { Badge } from '@/components/ui/badge';
import {
  ResponsiveContainer,
  ResponsiveText,
} from '@/components/ui/responsive-container';
import { motion } from 'framer-motion';
import { HelpCircle } from 'lucide-react';

const faqs = [
  {
    question: 'How does Owl AI work?',
    answer:
      'Owl AI is a chat-based study assistant that helps you with questions about competitive exams like UGC-NET, CSIR-NET, SSC, and CTET. You can ask questions and get explanations to help with your exam preparation.',
  },
  {
    question: 'What subjects does Owl AI cover?',
    answer:
      'Owl AI focuses on competitive exam preparation including UGC-NET, CSIR-NET, SSC, CTET, and other similar exams. It can help with various subjects typically covered in these exams.',
  },
  {
    question: 'Is my data secure and private?',
    answer:
      'Yes, we take privacy seriously. Your chat conversations are protected with standard security measures, and we respect your privacy by keeping your study sessions confidential.',
  },
  {
    question: "How accurate are Owl AI's responses?",
    answer:
      'Owl AI provides helpful explanations based on its training data. While we strive for accuracy, you should always verify important information and use it as a study aid alongside other resources.',
  },
  {
    question: 'Can I use Owl AI on my phone?',
    answer:
      'Yes! Owl AI works on web browsers and mobile devices, so you can access your study assistant from your phone, tablet, or computer whenever you need help.',
  },
  {
    question: 'What makes Owl AI different?',
    answer:
      'Owl AI is specifically designed for competitive exam preparation with a focus on UGC-NET, CSIR-NET, SSC, and CTET. It provides a simple chat interface to help you study and understand concepts relevant to these exams.',
  },
];

export function FAQSection() {
  return (
    <section
      id='faq'
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
            <HelpCircle className='w-5 h-5 sm:w-6 sm:h-6 md:w-8 md:h-8 text-primary' />
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
            <span className='text-foreground'>Frequently Asked </span>
            <span className='bg-gradient-to-r from-primary via-primary to-accent bg-clip-text text-transparent relative'>
              Questions
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
            className='text-muted-foreground max-w-2xl mx-auto leading-relaxed px-4'
          >
            Everything you need to know about Owl AI and how it can transform
            your learning experience.
          </ResponsiveText>
        </motion.div>

        {/* FAQ Accordion */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          viewport={{ once: true }}
        >
          <Accordion
            type='single'
            collapsible
            className='space-y-3 sm:space-y-4'
          >
            {faqs.map((faq, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.4 + index * 0.1 }}
                viewport={{ once: true }}
              >
                <AccordionItem
                  value={`item-${index}`}
                  className='border border-border/50 rounded-xl bg-card/50 backdrop-blur-sm overflow-hidden hover:bg-card/80 transition-all duration-300'
                >
                  <AccordionTrigger className='px-4 sm:px-6 py-3 sm:py-4 text-left hover:no-underline group'>
                    <div className='flex items-start space-x-3 sm:space-x-4'>
                      <Badge
                        variant='outline'
                        className='text-xs font-medium border-primary/30 text-primary/80 mt-1 flex-shrink-0'
                      >
                        Q{index + 1}
                      </Badge>
                      <span className='font-semibold text-sm sm:text-base text-foreground group-hover:text-primary transition-colors'>
                        {faq.question}
                      </span>
                    </div>
                  </AccordionTrigger>
                  <AccordionContent className='px-4 sm:px-6 pb-3 sm:pb-4'>
                    <div className='pl-10 sm:pl-12'>
                      <p className='text-xs sm:text-sm text-muted-foreground leading-relaxed'>
                        {faq.answer}
                      </p>
                    </div>
                  </AccordionContent>
                </AccordionItem>
              </motion.div>
            ))}
          </Accordion>
        </motion.div>

        {/* Subtle CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.2 }}
          viewport={{ once: true }}
          className='text-center mt-6 sm:mt-8'
        >
          <div className='flex items-center justify-center gap-2 sm:gap-3 text-xs sm:text-sm text-muted-foreground'>
            <div className='w-1 h-1 bg-primary rounded-full' />
            <span>
              Didn’t find your answer? Check the FAQs above or explore more
              sections.
            </span>
            <div className='w-1 h-1 bg-primary rounded-full' />
          </div>
        </motion.div>
      </ResponsiveContainer>
    </section>
  );
}
