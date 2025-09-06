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
  Clock,
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
            className='text-muted-foreground max-w-3xl mx-auto leading-relaxed px-4'
          >
            Ready to transform your learning journey? We're here to help you
            succeed. Get in touch and let's discuss how Owl AI can accelerate
            your exam preparation.
          </ResponsiveText>
        </motion.div>

        {/* Enhanced Stats Strip */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          viewport={{ once: true }}
          className='px-4 mb-8 sm:mb-10'
        >
          <div className='grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6'>
            {[
              {
                icon: <Clock className='w-4 h-4 sm:w-5 sm:h-5' />,
                label: 'Response Time',
                value: 'Under 24 Hours',
                description: 'Quick support',
              },
              {
                icon: <MessageSquare className='w-4 h-4 sm:w-5 sm:h-5' />,
                label: 'Support Hours',
                value: 'Mon–Sat, 9am–7pm',
                description: 'IST Timezone',
              },
              {
                icon: <Send className='w-4 h-4 sm:w-5 sm:h-5' />,
                label: 'Priority',
                value: 'Students First',
                description: 'Always',
              },
            ].map((stat, index) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 20, scale: 0.95 }}
                whileInView={{ opacity: 1, y: 0, scale: 1 }}
                transition={{
                  duration: 0.5,
                  delay: 0.3 + index * 0.1,
                  type: 'spring',
                  stiffness: 100,
                }}
                viewport={{ once: true }}
                whileHover={{
                  y: -4,
                  scale: 1.02,
                  transition: { duration: 0.2 },
                }}
                className='group relative'
              >
                <div className='relative bg-white/80 backdrop-blur-sm border border-primary/20 rounded-2xl p-4 sm:p-6 shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden'>
                  {/* Animated background */}
                  <div className='absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-accent/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300' />

                  {/* Icon */}
                  <div className='relative flex items-center justify-center w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-primary/10 to-accent/10 rounded-xl mb-3 mx-auto group-hover:scale-110 transition-transform duration-300'>
                    <div className='text-primary group-hover:text-accent transition-colors duration-300'>
                      {stat.icon}
                    </div>
                  </div>

                  {/* Content */}
                  <div className='text-center relative z-10'>
                    <div className='text-xs sm:text-sm text-muted-foreground mb-1'>
                      {stat.label}
                    </div>
                    <div className='text-sm sm:text-base font-bold text-foreground mb-1'>
                      {stat.value}
                    </div>
                    <div className='text-xs text-muted-foreground/70'>
                      {stat.description}
                    </div>
                  </div>

                  {/* Decorative elements */}
                  <div className='absolute top-2 right-2 w-2 h-2 bg-primary/20 rounded-full opacity-0 group-hover:opacity-100 group-hover:animate-ping transition-opacity duration-500' />
                  <div className='absolute bottom-2 left-2 w-1.5 h-1.5 bg-accent/30 rounded-full opacity-0 group-hover:opacity-100 group-hover:animate-pulse transition-opacity duration-700' />
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Content Grid */}
        <div className='grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-5 md:gap-6 px-4'>
          {/* Enhanced Contact Info */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            viewport={{ once: true }}
            className='space-y-4'
          >
            <motion.div
              whileHover={{ y: -4, scale: 1.02 }}
              transition={{ duration: 0.2 }}
              className='group relative'
            >
              <Card className='relative overflow-hidden border border-primary/20 bg-white/80 backdrop-blur-sm hover:border-primary/40 hover:shadow-xl transition-all duration-300'>
                {/* Animated background */}
                <div className='absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-accent/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300' />

                <CardHeader className='relative p-4 sm:p-6'>
                  <div className='flex items-center gap-3 mb-2'>
                    <div className='p-2 bg-gradient-to-br from-primary/10 to-accent/10 rounded-xl'>
                      <MessageSquare className='w-5 h-5 text-primary' />
                    </div>
                    <div>
                      <CardTitle className='text-base sm:text-lg font-bold'>
                        Contact Details
                      </CardTitle>
                      <CardDescription className='text-sm'>
                        Everything in one place
                      </CardDescription>
                    </div>
                  </div>
                </CardHeader>

                <CardContent className='relative p-4 sm:p-6 pt-0'>
                  <div className='space-y-4'>
                    {[
                      {
                        icon: <Mail className='w-4 h-4 sm:w-5 sm:h-5' />,
                        label: 'Email',
                        value: 'hello@owlai.com',
                        href: 'mailto:hello@owlai.com',
                      },
                      {
                        icon: <Phone className='w-4 h-4 sm:w-5 sm:h-5' />,
                        label: 'Phone',
                        value: '+91 98765 43210',
                        href: 'tel:+919876543210',
                      },
                      {
                        icon: <MapPin className='w-4 h-4 sm:w-5 sm:h-5' />,
                        label: 'Location',
                        value: 'Bengaluru, India',
                        subtext: 'IST (UTC+5:30)',
                      },
                    ].map((contact, index) => (
                      <motion.div
                        key={contact.label}
                        initial={{ opacity: 0, x: -20 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.4, delay: 0.4 + index * 0.1 }}
                        viewport={{ once: true }}
                        className='group/contact'
                      >
                        <div className='flex items-start gap-3 p-3 rounded-xl hover:bg-primary/5 transition-colors duration-200'>
                          <div className='p-2 bg-gradient-to-br from-primary/10 to-accent/10 rounded-lg group-hover/contact:scale-110 transition-transform duration-200'>
                            <div className='text-primary group-hover/contact:text-accent transition-colors duration-200'>
                              {contact.icon}
                            </div>
                          </div>
                          <div className='flex-1'>
                            <div className='text-sm font-semibold text-foreground mb-1'>
                              {contact.label}
                            </div>
                            {contact.href ? (
                              <a
                                href={contact.href}
                                className='text-sm text-muted-foreground hover:text-primary transition-colors duration-200 block'
                              >
                                {contact.value}
                              </a>
                            ) : (
                              <div className='text-sm text-muted-foreground'>
                                {contact.value}
                              </div>
                            )}
                            {contact.subtext && (
                              <div className='text-xs text-muted-foreground/70 mt-1'>
                                {contact.subtext}
                              </div>
                            )}
                          </div>
                        </div>
                        {index < 2 && (
                          <div className='h-px bg-gradient-to-r from-transparent via-primary/10 to-transparent my-2' />
                        )}
                      </motion.div>
                    ))}

                    {/* Social Links */}
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.4, delay: 0.7 }}
                      viewport={{ once: true }}
                      className='pt-4 border-t border-primary/10'
                    >
                      <div className='text-sm font-semibold text-foreground mb-3'>
                        Follow Us
                      </div>
                      <div className='flex flex-wrap gap-2'>
                        {[
                          {
                            icon: <Twitter className='w-4 h-4' />,
                            label: 'Twitter',
                            href: '#',
                          },
                          {
                            icon: <Linkedin className='w-4 h-4' />,
                            label: 'LinkedIn',
                            href: '#',
                          },
                          {
                            icon: <Github className='w-4 h-4' />,
                            label: 'GitHub',
                            href: '#',
                          },
                        ].map((social, index) => (
                          <motion.a
                            key={social.label}
                            href={social.href}
                            whileHover={{ scale: 1.05, y: -2 }}
                            whileTap={{ scale: 0.95 }}
                            className='flex items-center gap-2 px-3 py-2 bg-white/50 border border-primary/20 rounded-lg hover:bg-primary/5 hover:border-primary/40 transition-all duration-200 text-sm'
                          >
                            <div className='text-primary'>{social.icon}</div>
                            <span className='text-foreground'>
                              {social.label}
                            </span>
                          </motion.a>
                        ))}
                      </div>
                    </motion.div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </motion.div>

          {/* Enhanced Contact Form */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            viewport={{ once: true }}
            className='lg:col-span-2'
          >
            <motion.div
              whileHover={{ y: -4, scale: 1.01 }}
              transition={{ duration: 0.2 }}
              className='group relative'
            >
              <Card className='relative overflow-hidden border border-primary/20 bg-white/80 backdrop-blur-sm hover:border-primary/40 hover:shadow-xl transition-all duration-300'>
                {/* Animated background */}
                <div className='absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-accent/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300' />

                {/* Floating particles */}
                <div className='absolute inset-0 overflow-hidden pointer-events-none'>
                  <div className='absolute top-6 right-6 w-2 h-2 bg-primary/20 rounded-full opacity-0 group-hover:opacity-100 group-hover:animate-ping transition-opacity duration-500' />
                  <div className='absolute bottom-8 left-8 w-1.5 h-1.5 bg-accent/30 rounded-full opacity-0 group-hover:opacity-100 group-hover:animate-pulse transition-opacity duration-700' />
                </div>

                <CardHeader className='relative p-4 sm:p-6'>
                  <div className='flex items-center gap-3 mb-2'>
                    <div className='p-2 bg-gradient-to-br from-primary/10 to-accent/10 rounded-xl'>
                      <Send className='w-5 h-5 text-primary' />
                    </div>
                    <div>
                      <CardTitle className='text-base sm:text-lg font-bold'>
                        Send us a message
                      </CardTitle>
                      <CardDescription className='text-sm'>
                        We typically reply within 24 hours.
                      </CardDescription>
                    </div>
                  </div>
                </CardHeader>

                <CardContent className='relative p-4 sm:p-6 pt-0'>
                  <form onSubmit={onSubmit} className='space-y-4'>
                    <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
                      <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.4, delay: 0.5 }}
                        viewport={{ once: true }}
                        className='space-y-2'
                      >
                        <Label
                          htmlFor='name'
                          className='text-sm font-semibold text-foreground'
                        >
                          Full Name
                        </Label>
                        <Input
                          id='name'
                          value={name}
                          onChange={e => setName(e.target.value)}
                          placeholder='Enter your full name'
                          className='h-11 bg-white/50 border-primary/20 focus:border-primary/40 focus:ring-primary/20 transition-all duration-200'
                          required
                        />
                      </motion.div>

                      <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.4, delay: 0.6 }}
                        viewport={{ once: true }}
                        className='space-y-2'
                      >
                        <Label
                          htmlFor='email'
                          className='text-sm font-semibold text-foreground'
                        >
                          Email Address
                        </Label>
                        <Input
                          id='email'
                          type='email'
                          value={email}
                          onChange={e => setEmail(e.target.value)}
                          placeholder='your.email@example.com'
                          className='h-11 bg-white/50 border-primary/20 focus:border-primary/40 focus:ring-primary/20 transition-all duration-200'
                          required
                        />
                      </motion.div>
                    </div>

                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.4, delay: 0.7 }}
                      viewport={{ once: true }}
                      className='space-y-2'
                    >
                      <Label
                        htmlFor='message'
                        className='text-sm font-semibold text-foreground'
                      >
                        Your Message
                      </Label>
                      <Textarea
                        id='message'
                        value={message}
                        onChange={e => setMessage(e.target.value)}
                        placeholder='Tell us how we can help you succeed in your exam preparation...'
                        rows={6}
                        className='bg-white/50 border-primary/20 focus:border-primary/40 focus:ring-primary/20 transition-all duration-200 resize-none'
                        required
                      />
                      <p className='text-xs text-muted-foreground'>
                        By sending this message, you agree to receive our
                        response via email. We respect your privacy and won't
                        share your information.
                      </p>
                    </motion.div>

                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.4, delay: 0.8 }}
                      viewport={{ once: true }}
                      className='pt-2'
                    >
                      <Button
                        type='submit'
                        className='w-full bg-gradient-to-r from-primary to-accent hover:from-primary/90 hover:to-accent/90 text-white font-semibold py-3 px-6 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 disabled:opacity-70 disabled:cursor-not-allowed'
                        disabled={submitting}
                      >
                        {submitting ? (
                          <span className='inline-flex items-center gap-2'>
                            <motion.div
                              animate={{ rotate: 360 }}
                              transition={{
                                duration: 1,
                                repeat: Infinity,
                                ease: 'linear',
                              }}
                            >
                              <Send className='w-4 h-4' />
                            </motion.div>
                            Sending your message...
                          </span>
                        ) : sent ? (
                          <span className='inline-flex items-center gap-2'>
                            <motion.div
                              initial={{ scale: 0 }}
                              animate={{ scale: 1 }}
                              transition={{ type: 'spring', stiffness: 200 }}
                            >
                              ✓
                            </motion.div>
                            Message sent successfully!
                          </span>
                        ) : (
                          <span className='inline-flex items-center gap-2'>
                            <Send className='w-4 h-4' />
                            Send Message
                          </span>
                        )}
                      </Button>

                      {error && (
                        <motion.div
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          className='mt-3 p-3 bg-red-50 border border-red-200 rounded-lg'
                        >
                          <p className='text-sm text-red-600'>{error}</p>
                        </motion.div>
                      )}
                    </motion.div>
                  </form>
                </CardContent>
              </Card>
            </motion.div>
          </motion.div>
        </div>
      </ResponsiveContainer>
    </section>
  );
}
