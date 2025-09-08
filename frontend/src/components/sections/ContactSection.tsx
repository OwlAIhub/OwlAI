'use client';

import { Button } from '@/components/ui/buttons/button';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/components/ui/cards/card';
import { Input } from '@/components/ui/inputs/input';
import { Label } from '@/components/ui/inputs/label';
import { Textarea } from '@/components/ui/textarea';
import { submitContactForm } from '@/lib/services/contactService';
import { motion } from 'framer-motion';
import { CheckCircle, Mail, MessageSquare, Phone, Send } from 'lucide-react';
import { useState } from 'react';

export function ContactSection() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);

    if (!name.trim() || !email.trim() || !message.trim()) {
      setSubmitting(false);
      return;
    }

    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));

    setSubmitting(false);
    setName('');
    setEmail('');
    setMessage('');
  };

  return (
    <section
      id='contact'
      className='py-16 sm:py-20 px-4 sm:px-6 md:px-8 bg-white'
    >
      <div className='max-w-4xl mx-auto'>
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className='text-center mb-8 sm:mb-12'
        >
          <div className='inline-flex items-center justify-center w-10 h-10 bg-primary/10 rounded-xl mb-3'>
            <MessageSquare className='w-5 h-5 text-primary' />
          </div>
          <h2 className='text-2xl sm:text-3xl font-bold text-foreground mb-3'>
            Get in Touch
          </h2>
          <p className='text-muted-foreground max-w-2xl mx-auto'>
            Ready to transform your learning journey? We&apos;re here to help
            you succeed.
          </p>
        </motion.div>

        {/* Content Grid */}
        <div className='grid grid-cols-1 lg:grid-cols-3 gap-6'>
          {/* Contact Info */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            viewport={{ once: true }}
          >
            <Card className='h-full'>
              <CardHeader className='pb-4'>
                <CardTitle className='text-lg'>Contact Details</CardTitle>
              </CardHeader>
              <CardContent className='space-y-4'>
                <div className='flex items-center gap-3'>
                  <div className='p-2 bg-primary/10 rounded-lg'>
                    <Mail className='w-4 h-4 text-primary' />
                  </div>
                  <div>
                    <p className='text-sm font-medium'>Email</p>
                    <p className='text-sm text-muted-foreground'>
                      hello@owlai.com
                    </p>
                  </div>
                </div>
                <div className='flex items-center gap-3'>
                  <div className='p-2 bg-primary/10 rounded-lg'>
                    <Phone className='w-4 h-4 text-primary' />
                  </div>
                  <div>
                    <p className='text-sm font-medium'>Phone</p>
                    <p className='text-sm text-muted-foreground'>
                      +91 98765 43210
                    </p>
                  </div>
                </div>
                <div className='flex items-center gap-3'>
                  <div className='p-2 bg-primary/10 rounded-lg'>
                    <MessageSquare className='w-4 h-4 text-primary' />
                  </div>
                  <div>
                    <p className='text-sm font-medium'>Response Time</p>
                    <p className='text-sm text-muted-foreground'>
                      Under 24 hours
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Contact Form */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            viewport={{ once: true }}
            className='lg:col-span-2'
          >
            <Card>
              <CardHeader className='pb-4'>
                <CardTitle className='text-lg'>Send us a message</CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={onSubmit} className='space-y-4'>
                  <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
                    <div className='space-y-2'>
                      <Label htmlFor='name'>Name</Label>
                      <Input
                        id='name'
                        value={name}
                        onChange={e => setName(e.target.value)}
                        placeholder='Your name'
                        required
                      />
                    </div>
                    <div className='space-y-2'>
                      <Label htmlFor='email'>Email</Label>
                      <Input
                        id='email'
                        type='email'
                        value={email}
                        onChange={e => setEmail(e.target.value)}
                        placeholder='your@email.com'
                        required
                      />
                    </div>
                  </div>
                  <div className='space-y-2'>
                    <Label htmlFor='message'>Message</Label>
                    <Textarea
                      id='message'
                      value={message}
                      onChange={e => setMessage(e.target.value)}
                      placeholder='Tell us how we can help...'
                      rows={4}
                      required
                    />
                  </div>
                  <Button
                    type='submit'
                    disabled={submitting}
                    className='w-full'
                  >
                    {submitting ? (
                      'Sending...'
                    ) : (
                      <>
                        <Send className='w-4 h-4 mr-2' />
                        Send Message
                      </>
                    )}
                  </Button>
                </form>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
