'use client';

import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  ResponsiveContainer,
  ResponsiveText,
} from '@/components/ui/responsive-container';
import { Textarea } from '@/components/ui/textarea';
import { motion } from 'framer-motion';
import {
  Github,
  Linkedin,
  Mail,
  MapPin,
  MessageSquare,
  Phone,
  Send,
  Twitter,
} from 'lucide-react';
import { useState } from 'react';

export function ContactSection() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState('');

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSubmitting(true);
    // Basic front-end validation
    if (!name.trim() || !email.trim() || !message.trim()) {
      setError('Please fill out all fields.');
      setSubmitting(false);
      return;
    }

    // Placeholder submission; integrate backend/email later
    setTimeout(() => {
      setSubmitting(false);
      setSent(true);
      setName('');
      setEmail('');
      setMessage('');
      setTimeout(() => setSent(false), 2000);
    }, 900);
  };

  return (
    <section
      id='contact'
      className='relative min-h-screen flex items-start justify-center px-4 sm:px-6 md:px-8 pt-20 sm:pt-24 md:pt-28 lg:pt-32 pb-12 sm:pb-16 md:pb-20 lg:pb-16 bg-white'
    >
      {/* Decorative green glows */}
      <div className='pointer-events-none absolute inset-0'>
        <div className='absolute top-[8%] left-[8%] w-40 h-40 rounded-full bg-primary/10 blur-3xl' />
        <div className='absolute bottom-[12%] right-[10%] w-48 h-48 rounded-full bg-accent/10 blur-3xl' />
      </div>
      <ResponsiveContainer maxWidth='7xl' padding='none'>
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className='text-center mb-6 sm:mb-8 md:mb-10 lg:mb-12'
        >
          <div className='inline-flex items-center justify-center w-12 h-12 sm:w-14 sm:h-14 md:w-16 md:h-16 bg-primary/10 rounded-2xl mb-3 sm:mb-4 md:mb-5'>
            <MessageSquare className='w-5 h-5 sm:w-6 sm:h-6 md:w-8 md:h-8 text-primary' />
          </div>
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
            <span className='text-foreground'>Get in </span>
            <span className='bg-gradient-to-r from-primary via-primary to-accent bg-clip-text text-transparent relative'>
              Touch
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
            We’d love to hear from you. Send a message and we’ll get back soon.
          </ResponsiveText>
        </motion.div>

        {/* Stats Strip */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.15 }}
          viewport={{ once: true }}
          className='px-4 mb-6 sm:mb-8'
        >
          <div className='grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4'>
            <div className='rounded-xl border border-primary/20 bg-primary/5 px-3 sm:px-4 py-3 text-center'>
              <div className='text-xs sm:text-sm text-muted-foreground'>
                Avg. response time
              </div>
              <div className='text-sm sm:text-base text-foreground font-semibold'>
                under 24 hours
              </div>
            </div>
            <div className='rounded-xl border border-primary/20 bg-primary/5 px-3 sm:px-4 py-3 text-center'>
              <div className='text-xs sm:text-sm text-muted-foreground'>
                Support window
              </div>
              <div className='text-sm sm:text-base text-foreground font-semibold'>
                Mon–Sat, 9am–7pm IST
              </div>
            </div>
            <div className='rounded-xl border border-primary/20 bg-primary/5 px-3 sm:px-4 py-3 text-center'>
              <div className='text-xs sm:text-sm text-muted-foreground'>
                Priority
              </div>
              <div className='text-sm sm:text-base text-foreground font-semibold'>
                Students first
              </div>
            </div>
          </div>
        </motion.div>

        {/* Content Grid */}
        <div className='grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-5 md:gap-6 px-4'>
          {/* Info (condensed) */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            viewport={{ once: true }}
            className='space-y-4'
          >
            <Card className='border border-primary/20 bg-primary/5 hover:border-primary/30 transition-all'>
              <CardHeader className='p-4 sm:p-6'>
                <CardTitle className='text-sm sm:text-base'>
                  Contact Details
                </CardTitle>
                <CardDescription className='text-xs sm:text-sm'>
                  Everything in one place
                </CardDescription>
              </CardHeader>
              <CardContent className='p-4 sm:p-6 pt-0'>
                <div className='space-y-3 sm:space-y-4'>
                  <div className='flex items-start gap-2 sm:gap-3'>
                    <div className='p-1.5 sm:p-2 bg-primary/10 rounded-lg'>
                      <Mail className='w-4 h-4 sm:w-5 sm:h-5 text-primary' />
                    </div>
                    <div>
                      <div className='text-xs sm:text-sm font-medium text-foreground'>
                        Email
                      </div>
                      <div className='text-xs sm:text-sm text-muted-foreground'>
                        hello@owlai.com
                      </div>
                    </div>
                  </div>
                  <div className='h-px bg-primary/15' />
                  <div className='flex items-start gap-2 sm:gap-3'>
                    <div className='p-1.5 sm:p-2 bg-primary/10 rounded-lg'>
                      <Phone className='w-4 h-4 sm:w-5 sm:h-5 text-primary' />
                    </div>
                    <div>
                      <div className='text-xs sm:text-sm font-medium text-foreground'>
                        Phone
                      </div>
                      <div className='text-xs sm:text-sm text-muted-foreground'>
                        +91 98765 43210
                      </div>
                    </div>
                  </div>
                  <div className='h-px bg-primary/15' />
                  <div className='flex items-start gap-2 sm:gap-3'>
                    <div className='p-1.5 sm:p-2 bg-primary/10 rounded-lg'>
                      <MapPin className='w-4 h-4 sm:w-5 sm:h-5 text-primary' />
                    </div>
                    <div>
                      <div className='text-xs sm:text-sm font-medium text-foreground'>
                        Address
                      </div>
                      <div className='text-xs sm:text-sm text-muted-foreground'>
                        Bengaluru, India · IST (UTC+5:30)
                      </div>
                    </div>
                  </div>
                  <div className='h-px bg-primary/15' />
                  <div>
                    <div className='text-xs sm:text-sm font-medium text-foreground mb-2'>
                      Social
                    </div>
                    <div className='flex flex-wrap items-center gap-2 sm:gap-3'>
                      <Button
                        variant='outline'
                        size='sm'
                        className='gap-1 sm:gap-1.5 border-primary/30 text-xs sm:text-sm'
                      >
                        <Twitter className='w-3 h-3 sm:w-4 sm:h-4' /> Twitter
                      </Button>
                      <Button
                        variant='outline'
                        size='sm'
                        className='gap-1 sm:gap-1.5 border-primary/30 text-xs sm:text-sm'
                      >
                        <Linkedin className='w-3 h-3 sm:w-4 sm:h-4' /> LinkedIn
                      </Button>
                      <Button
                        variant='outline'
                        size='sm'
                        className='gap-1 sm:gap-1.5 border-primary/30 text-xs sm:text-sm'
                      >
                        <Github className='w-3 h-3 sm:w-4 sm:h-4' /> GitHub
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Form */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.15 }}
            viewport={{ once: true }}
            className='lg:col-span-2'
          >
            <Card className='relative overflow-hidden border border-primary/20 hover:border-primary/30 transition-all'>
              <div className='pointer-events-none absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-accent/5' />
              <CardHeader className='p-4 sm:p-6'>
                <CardTitle className='text-sm sm:text-base'>
                  Send us a message
                </CardTitle>
                <CardDescription className='text-xs sm:text-sm'>
                  We typically reply within 24 hours.
                </CardDescription>
              </CardHeader>
              <CardContent className='p-4 sm:p-6 pt-0'>
                <form
                  onSubmit={onSubmit}
                  className='grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4'
                >
                  <div className='space-y-1.5 sm:space-y-2'>
                    <Label htmlFor='name' className='text-xs sm:text-sm'>
                      Name
                    </Label>
                    <Input
                      id='name'
                      value={name}
                      onChange={e => setName(e.target.value)}
                      placeholder='Your full name'
                      className='text-xs sm:text-sm'
                      required
                    />
                  </div>
                  <div className='space-y-1.5 sm:space-y-2'>
                    <Label htmlFor='email' className='text-xs sm:text-sm'>
                      Email
                    </Label>
                    <Input
                      id='email'
                      type='email'
                      value={email}
                      onChange={e => setEmail(e.target.value)}
                      placeholder='you@example.com'
                      className='text-xs sm:text-sm'
                      required
                    />
                  </div>
                  <div className='space-y-1.5 sm:space-y-2 md:col-span-2'>
                    <Label htmlFor='message' className='text-xs sm:text-sm'>
                      Message
                    </Label>
                    <Textarea
                      id='message'
                      value={message}
                      onChange={e => setMessage(e.target.value)}
                      placeholder='How can we help?'
                      rows={5}
                      className='text-xs sm:text-sm'
                      required
                    />
                    <p className='text-xs text-muted-foreground'>
                      By sending, you agree to our response via email. We
                      respect your privacy.
                    </p>
                  </div>
                  <div className='md:col-span-2'>
                    <Button
                      type='submit'
                      className='w-full md:w-auto bg-primary hover:bg-primary/90 shadow-sm text-xs sm:text-sm'
                      disabled={submitting}
                    >
                      {submitting ? (
                        <span className='inline-flex items-center gap-1.5 sm:gap-2'>
                          <Send className='w-3 h-3 sm:w-4 sm:h-4 animate-pulse' />{' '}
                          Sending…
                        </span>
                      ) : sent ? (
                        'Sent ✓'
                      ) : (
                        <span className='inline-flex items-center gap-1.5 sm:gap-2'>
                          <Send className='w-3 h-3 sm:w-4 sm:h-4' /> Send
                          Message
                        </span>
                      )}
                    </Button>
                    {error && (
                      <div className='mt-3 text-xs sm:text-sm text-red-600 bg-red-50 border border-red-200 rounded-md px-3 py-2'>
                        {error}
                      </div>
                    )}
                  </div>
                </form>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </ResponsiveContainer>
    </section>
  );
}
