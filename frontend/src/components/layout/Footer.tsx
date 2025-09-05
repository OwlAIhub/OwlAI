'use client';

import { motion } from 'framer-motion';
import { ArrowUp, Github, Linkedin, Mail, Twitter } from 'lucide-react';
import Image from 'next/image';

const footerLinks = [
  {
    title: 'Product',
    links: [
      { name: 'AI Learning', href: 'features' },
      { name: 'Exam Prep', href: 'features' },
      { name: 'Study Plans', href: 'features' },
      { name: 'Performance', href: 'features' },
    ],
  },
  {
    title: 'Exams',
    links: [
      { name: 'UGC NET', href: 'features' },
      { name: 'CSIR NET', href: 'features' },
      { name: 'SSC', href: 'features' },
      { name: 'CTET', href: 'features' },
    ],
  },
  {
    title: 'Support',
    links: [
      { name: 'Help Center', href: '#' },
      { name: 'Contact', href: '#' },
      { name: 'Privacy', href: '#' },
      { name: 'Terms', href: '#' },
    ],
  },
  {
    title: 'Company',
    links: [
      { name: 'About', href: 'home' },
      { name: 'Blog', href: '#' },
      { name: 'Careers', href: '#' },
      { name: 'Press', href: '#' },
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
    <footer className='bg-black text-white'>
      <div className='container mx-auto px-4 sm:px-6 md:px-8 py-8 sm:py-10 md:py-12'>
        {/* Main Footer Content */}
        <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-6 gap-6 sm:gap-8 mb-6 sm:mb-8'>
          {/* Brand Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
            className='sm:col-span-2 lg:col-span-2 space-y-4 sm:space-y-6'
          >
            <div className='flex items-center space-x-2 sm:space-x-3'>
              <div className='relative w-8 h-8 sm:w-10 sm:h-10 rounded-xl overflow-hidden bg-white/5 ring-1 ring-white/10'>
                <Image
                  src='/owl-ai-logo.png'
                  alt='Owl AI'
                  fill
                  sizes='40px'
                  className='object-contain p-1 sm:p-1.5'
                />
              </div>
              <span className='text-lg sm:text-xl font-bold text-white'>
                Owl AI
              </span>
            </div>
            <p className='text-xs sm:text-sm text-white/70 leading-relaxed max-w-md'>
              Your intelligent study companion for competitive exam preparation.
              Transform your learning with AI-powered personalized assistance
              for UGC NET, CSIR NET, SSC, and CTET.
            </p>
            <div className='flex items-center space-x-3 sm:space-x-4'>
              {socialLinks.map((social, index) => (
                <motion.a
                  key={social.label}
                  href={social.href}
                  initial={{ opacity: 0, scale: 0.8 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.2, delay: 0.1 + index * 0.05 }}
                  viewport={{ once: true }}
                  whileHover={{ scale: 1.1, y: -2 }}
                  className='w-8 h-8 sm:w-10 sm:h-10 bg-white/5 hover:bg-primary/20 rounded-lg flex items-center justify-center transition-all duration-300 group border border-white/10'
                >
                  <social.icon className='w-3 h-3 sm:w-4 sm:h-4 text-white/60 group-hover:text-primary transition-colors' />
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
              transition={{ duration: 0.5, delay: 0.05 + sectionIndex * 0.05 }}
              viewport={{ once: true }}
              className='space-y-3 sm:space-y-4'
            >
              <h3 className='font-bold text-white text-xs sm:text-sm uppercase tracking-wider'>
                {section.title}
              </h3>
              <ul className='space-y-2 sm:space-y-3'>
                {section.links.map((link, linkIndex) => (
                  <motion.li
                    key={link.name}
                    initial={{ opacity: 0, x: -10 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    transition={{
                      duration: 0.2,
                      delay: 0.1 + sectionIndex * 0.05 + linkIndex * 0.02,
                    }}
                    viewport={{ once: true }}
                  >
                    <a
                      href={link.href}
                      className='text-white/60 hover:text-primary transition-colors duration-200 text-xs sm:text-sm font-medium'
                    >
                      {link.name}
                    </a>
                  </motion.li>
                ))}
              </ul>
            </motion.div>
          ))}
        </div>

        {/* Bottom Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          viewport={{ once: true }}
          className='border-t border-white/10 pt-4 sm:pt-6 flex flex-col md:flex-row items-center justify-between space-y-3 sm:space-y-4 md:space-y-0'
        >
          <div className='flex flex-col sm:flex-row items-center space-y-2 sm:space-y-0 sm:space-x-4 md:space-x-6 text-xs sm:text-sm text-white/60'>
            <span>&copy; 2025 Owl AI. All rights reserved.</span>
            <div className='flex items-center space-x-4 sm:space-x-6'>
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
            className='w-8 h-8 sm:w-10 sm:h-10 bg-white/5 hover:bg-primary/20 rounded-lg flex items-center justify-center transition-all duration-300 group border border-white/10'
          >
            <ArrowUp className='w-3 h-3 sm:w-4 sm:h-4 text-white/60 group-hover:text-primary transition-colors' />
          </motion.button>
        </motion.div>
      </div>
    </footer>
  );
}
