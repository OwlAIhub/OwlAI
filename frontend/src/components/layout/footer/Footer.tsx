'use client';

import { motion } from 'framer-motion';
import { ArrowUp, Github, Linkedin, Mail, Twitter } from 'lucide-react';
import Image from 'next/image';

const footerLinks = [
  {
    title: 'Product',
    links: [
      { name: 'AI Learning', href: '#features' },
      { name: 'Exam Prep', href: '#exams' },
      { name: 'Study Plans', href: '#features' },
      { name: 'Progress Tracking', href: '#features' },
    ],
  },
  {
    title: 'Exams',
    links: [
      { name: 'UGC NET', href: '#exams' },
      { name: 'CSIR NET', href: '#exams' },
      { name: 'SSC', href: '#exams' },
      { name: 'CTET', href: '#exams' },
    ],
  },
  {
    title: 'Support',
    links: [
      { name: 'Help Center', href: '#contact' },
      { name: 'Contact Us', href: '#contact' },
      { name: 'Privacy Policy', href: '#' },
      { name: 'Terms of Service', href: '#' },
    ],
  },
  {
    title: 'Company',
    links: [
      { name: 'About Us', href: '#about' },
      { name: 'Blog', href: '#' },
      { name: 'Careers', href: '#' },
      { name: 'Press Kit', href: '#' },
    ],
  },
];

const socialLinks = [
  { icon: Twitter, href: '#', label: 'Twitter' },
  { icon: Linkedin, href: '#', label: 'LinkedIn' },
  { icon: Github, href: '#', label: 'GitHub' },
  { icon: Mail, href: '#', label: 'Email' },
];

export function Footer() {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className='bg-gradient-to-br from-gray-900 via-black to-gray-900 text-white relative overflow-hidden'>
      {/* Background Pattern */}
      <div className='absolute inset-0 opacity-5'>
        <div className='absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_50%_50%,rgba(34,197,94,0.1),transparent_50%)]' />
      </div>

      <div className='relative z-10'>
        {/* Main Footer Content */}
        <div className='container mx-auto px-4 sm:px-6 md:px-8 py-8 sm:py-12'>
          <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-6 gap-8 sm:gap-12'>
            {/* Brand Section */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
              className='sm:col-span-2 lg:col-span-2 space-y-6'
            >
              <div className='flex items-center space-x-3'>
                <div className='relative w-10 h-10 rounded-xl overflow-hidden bg-white/10 ring-1 ring-white/20'>
                  <Image
                    src='/owl-ai-logo.png'
                    alt='Owl AI'
                    fill
                    sizes='40px'
                    className='object-contain p-2'
                  />
                </div>
                <span className='text-xl font-bold text-white'>Owl AI</span>
              </div>

              <p className='text-sm text-white/80 leading-relaxed max-w-md'>
                Your intelligent study companion for competitive exam
                preparation. Transform your learning with AI-powered
                personalized assistance for UGC NET, CSIR NET, SSC, and CTET.
              </p>

              <div className='flex items-center space-x-4'>
                {socialLinks.map((social, index) => (
                  <motion.a
                    key={social.label}
                    href={social.href}
                    initial={{ opacity: 0, scale: 0.8 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.3, delay: index * 0.1 }}
                    viewport={{ once: true }}
                    whileHover={{ scale: 1.1, y: -2 }}
                    className='w-10 h-10 bg-white/10 hover:bg-primary/20 rounded-lg flex items-center justify-center transition-all duration-300 group border border-white/20'
                  >
                    <social.icon className='w-4 h-4 text-white/70 group-hover:text-primary transition-colors' />
                  </motion.a>
                ))}
              </div>
            </motion.div>

            {/* Footer Links */}
            {footerLinks.map((section, sectionIndex) => (
              <motion.div
                key={section.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: sectionIndex * 0.1 }}
                viewport={{ once: true }}
                className='space-y-4'
              >
                <h3 className='font-semibold text-white text-sm uppercase tracking-wider'>
                  {section.title}
                </h3>
                <ul className='space-y-3'>
                  {section.links.map((link, linkIndex) => (
                    <motion.li
                      key={link.name}
                      initial={{ opacity: 0, x: -10 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      transition={{
                        duration: 0.3,
                        delay: sectionIndex * 0.1 + linkIndex * 0.05,
                      }}
                      viewport={{ once: true }}
                    >
                      <a
                        href={link.href}
                        className='text-white/70 hover:text-primary transition-colors duration-200 text-sm font-medium block'
                      >
                        {link.name}
                      </a>
                    </motion.li>
                  ))}
                </ul>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Bottom Section */}
        <div className='border-t border-white/10'>
          <div className='container mx-auto px-4 sm:px-6 md:px-8 py-6'>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              viewport={{ once: true }}
              className='flex flex-col md:flex-row items-center justify-between space-y-4 md:space-y-0'
            >
              <div className='flex flex-col sm:flex-row items-center space-y-2 sm:space-y-0 sm:space-x-6 text-sm text-white/60'>
                <span>&copy; 2025 Owl AI. All rights reserved.</span>
                <div className='flex items-center space-x-6'>
                  <a
                    href='#privacy'
                    className='hover:text-primary transition-colors font-medium'
                  >
                    Privacy Policy
                  </a>
                  <a
                    href='#terms'
                    className='hover:text-primary transition-colors font-medium'
                  >
                    Terms of Service
                  </a>
                </div>
              </div>

              <motion.button
                onClick={scrollToTop}
                whileHover={{ scale: 1.05, y: -2 }}
                whileTap={{ scale: 0.95 }}
                className='w-10 h-10 bg-white/10 hover:bg-primary/20 rounded-lg flex items-center justify-center transition-all duration-300 group border border-white/20'
              >
                <ArrowUp className='w-4 h-4 text-white/70 group-hover:text-primary transition-colors' />
              </motion.button>
            </motion.div>
          </div>
        </div>
      </div>
    </footer>
  );
}
