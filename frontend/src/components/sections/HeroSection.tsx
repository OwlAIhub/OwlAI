'use client';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/buttons/button';
import {
  ResponsiveContainer,
  ResponsiveImage,
  ResponsiveText,
} from '@/components/ui/responsive-container';
import { motion } from 'framer-motion';
import { CheckCircle, Menu, Search, Sparkles, X } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useCallback, useEffect, useState } from 'react';

const navItems = [
  { name: 'Home', href: '#home' },
  { name: 'About', href: '#about' },
  { name: 'Why Choose Us', href: '#why-choose-us' },
  { name: 'Exams', href: '#exams' },
  { name: 'Features', href: '#features' },
  { name: 'FAQ', href: '#faq' },
  { name: 'Contact', href: '#contact' },
];

export function HeroSection() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [isNavigating] = useState(false);
  const router = useRouter();

  const handleScroll = useCallback(() => {
    const heroSection = document.getElementById('home');
    if (heroSection) {
      const heroBottom = heroSection.offsetTop + heroSection.offsetHeight;
      const currentScroll = window.scrollY;

      // Only show navbar when we've scrolled past the hero section completely
      setIsScrolled(currentScroll >= heroBottom);
    }
  }, []);

  useEffect(() => {
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [handleScroll]);

  return (
    <section
      id='home'
      className='relative min-h-screen flex flex-col overflow-hidden'
    >
      {/* Light Grey Background */}
      <div className='absolute inset-0 bg-gradient-to-br from-gray-50 via-gray-100 to-gray-200' />
      <div className='absolute top-1/4 left-1/4 w-32 h-32 md:w-64 md:h-64 bg-primary/3 rounded-full blur-2xl' />
      <div className='absolute bottom-1/4 right-1/4 w-32 h-32 md:w-64 md:h-64 bg-accent/3 rounded-full blur-2xl' />

      {/* Subtle Grid Pattern */}
      <div className='absolute inset-0 bg-[linear-gradient(rgba(0,0,0,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(0,0,0,0.03)_1px,transparent_1px)] bg-[size:20px_20px] md:bg-[size:30px_30px]' />

      {/* Navigation Bar - Integrated into Hero */}
      <motion.header
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6, ease: 'easeOut' }}
        className={`fixed top-0 left-0 right-0 z-50 w-full transition-all duration-300 ${
          isScrolled
            ? 'bg-white/95 backdrop-blur-md shadow-lg border-b border-border/10'
            : 'bg-transparent'
        }`}
      >
        <ResponsiveContainer maxWidth='6xl' padding='sm'>
          <div className='flex items-center justify-between h-14 relative'>
            {/* Logo */}
            <motion.a
              href='#'
              className='flex items-center space-x-2 text-base md:text-lg font-bold text-foreground z-10'
              whileHover={{ scale: 1.05 }}
              transition={{ duration: 0.2 }}
            >
              <ResponsiveImage
                src='/owl-ai-logo.png'
                alt='Owl AI - Your Personal AI Study Partner'
                className='w-6 h-6 md:w-8 md:h-8'
                loading='eager'
                priority={true}
              />
              <span className='hidden sm:inline'>Owl AI</span>
            </motion.a>

            {/* Desktop Navigation - Centered */}
            <nav className='hidden lg:flex items-center space-x-4 xl:space-x-6 absolute left-1/2 transform -translate-x-1/2'>
              {navItems.map(item => (
                <motion.button
                  key={item.name}
                  onClick={() => {
                    const element = document.getElementById(
                      item.href.replace('#', '')
                    );
                    if (element) {
                      element.scrollIntoView({ behavior: 'smooth' });
                    }
                  }}
                  className='text-sm font-medium text-muted-foreground hover:text-foreground transition-colors bg-transparent border-none cursor-pointer whitespace-nowrap'
                  whileHover={{ y: -1 }}
                  transition={{ duration: 0.2 }}
                >
                  {item.name}
                </motion.button>
              ))}
            </nav>

            {/* Desktop CTA aligned to the right */}
            <div className='hidden lg:flex items-center ml-auto z-10 space-x-3'>
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                transition={{ duration: 0.1, ease: 'easeInOut' }}
              >
                <Button
                  onClick={() => {
                    router.push('/login');
                  }}
                  disabled={isNavigating}
                  size='sm'
                  className='text-sm bg-white text-black hover:bg-white/90 px-3 py-1.5 md:px-4 md:py-2 disabled:opacity-70 transition-all duration-200 active:scale-95'
                >
                  Login
                </Button>
              </motion.div>
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                transition={{ duration: 0.1, ease: 'easeInOut' }}
              >
                <Button
                  onClick={() => {
                    router.push('/signup');
                  }}
                  disabled={isNavigating}
                  size='sm'
                  className='text-sm bg-primary hover:bg-primary/90 px-3 py-1.5 md:px-4 md:py-2 disabled:opacity-70 transition-all duration-200 active:scale-95'
                >
                  {isNavigating ? 'Loading...' : 'Get Started'}
                </Button>
              </motion.div>
            </div>

            {/* Mobile Menu Button */}
            <button
              className='lg:hidden p-2 rounded-md hover:bg-white/20 transition-colors z-20 relative'
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              aria-label='Toggle mobile menu'
            >
              {isMenuOpen ? (
                <X className='w-5 h-5 text-foreground' />
              ) : (
                <Menu className='w-5 h-5 text-foreground' />
              )}
            </button>
          </div>

          {/* Mobile Menu - Improved Responsiveness */}
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{
              opacity: isMenuOpen ? 1 : 0,
              height: isMenuOpen ? 'auto' : 0,
            }}
            transition={{ duration: 0.3, ease: 'easeInOut' }}
            className='lg:hidden overflow-hidden absolute top-full left-0 right-0 z-30'
          >
            <div className='py-4 space-y-2 border-t border-border/10 bg-white/95 backdrop-blur-md rounded-b-lg shadow-lg mx-4'>
              {navItems.map(item => (
                <button
                  key={item.name}
                  onClick={() => {
                    setIsMenuOpen(false);
                    const element = document.getElementById(
                      item.href.replace('#', '')
                    );
                    if (element) {
                      element.scrollIntoView({ behavior: 'smooth' });
                    }
                  }}
                  className='block w-full text-left px-4 py-3 text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-primary/5 rounded-md transition-colors bg-transparent border-none cursor-pointer'
                >
                  {item.name}
                </button>
              ))}
              <div className='px-4 pt-3 border-t border-border/10 space-y-2'>
                <motion.div
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  transition={{ duration: 0.1, ease: 'easeInOut' }}
                >
                  <Button
                    size='sm'
                    className='w-full text-sm bg-white text-black hover:bg-white/90 py-3 disabled:opacity-70 transition-all duration-200 active:scale-95'
                    disabled={isNavigating}
                    onClick={() => {
                      setIsMenuOpen(false);
                      router.push('/login');
                    }}
                  >
                    Login
                  </Button>
                </motion.div>
                <motion.div
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  transition={{ duration: 0.1, ease: 'easeInOut' }}
                >
                  <Button
                    size='sm'
                    className='w-full text-sm bg-primary hover:bg-primary/90 py-3 disabled:opacity-70 transition-all duration-200 active:scale-95'
                    disabled={isNavigating}
                    onClick={() => {
                      setIsMenuOpen(false);
                      router.push('/signup');
                    }}
                  >
                    {isNavigating ? 'Loading...' : 'Get Started'}
                  </Button>
                </motion.div>
              </div>
            </div>
          </motion.div>
        </ResponsiveContainer>
      </motion.header>

      {/* Hero Content */}
      <div className='flex-1 flex items-center justify-center relative z-10 px-4 py-16 sm:py-20 md:py-24 lg:py-0'>
        <ResponsiveContainer maxWidth='4xl' padding='none'>
          <div className='text-center w-full'>
            {/* Main Logo */}
            <motion.div
              initial={{ opacity: 0, y: 20, scale: 0.8 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ duration: 0.6, ease: 'easeOut' }}
              className='mb-6 md:mb-8'
            >
              <ResponsiveImage
                src='/owl-ai-logo.png'
                alt='Owl AI - Your Personal AI Study Partner'
                className='w-16 h-16 md:w-20 md:h-20 mx-auto mb-4'
                loading='eager'
                priority={true}
              />
            </motion.div>

            {/* Badge */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.2 }}
              className='mb-4 md:mb-6'
            >
              <Badge
                variant='secondary'
                className='px-2 py-1 md:px-3 md:py-1 text-xs font-medium bg-primary/10 text-primary border-primary/20 hover:bg-primary/15 transition-colors'
              >
                <Sparkles className='w-3 h-3 mr-1 md:mr-1.5' />
                <span className='hidden sm:inline'>
                  AI-Powered UGC NET Preparation
                </span>
                <span className='sm:hidden'>AI-Powered Learning</span>
              </Badge>
            </motion.div>

            {/* Main Headline */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className='mb-4'
            >
              <ResponsiveText
                as='h1'
                fluid={true}
                clamp={{
                  min: '1.5rem',
                  preferred: '1rem + 5vw',
                  max: '3rem',
                }}
                className='font-bold leading-tight px-2'
              >
                <span className='text-foreground'>Your AI Learning</span>
                <br />
                <span className='bg-gradient-to-r from-primary via-primary to-accent bg-clip-text text-transparent relative'>
                  Assistant
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
            </motion.div>

            {/* Subtitle */}
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.2 }}
              className='text-sm md:text-base lg:text-lg text-muted-foreground max-w-2xl mx-auto mb-4 md:mb-6 leading-relaxed px-4'
            >
              Get instant answers to your study questions. Powered by advanced
              AI to help you excel in your UGC NET and competitive exams.
            </motion.p>

            {/* Search Bar - Optimized for All Screen Sizes */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.3 }}
              className='flex justify-center mb-6 md:mb-8 px-4'
            >
              <div className='relative w-full max-w-xs sm:max-w-sm md:max-w-md lg:max-w-lg'>
                <input
                  type='text'
                  value={searchQuery}
                  onChange={e => setSearchQuery(e.target.value)}
                  onKeyDown={e => {
                    if (e.key === 'Enter' && !isNavigating) {
                      router.push('/chat');
                    }
                  }}
                  placeholder='Ask any UGC NET question...'
                  className='w-full px-4 py-3 pl-10 pr-12 text-sm bg-white/95 backdrop-blur-sm border border-white/30 rounded-full focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary/50 transition-all duration-300 placeholder:text-muted-foreground/70 shadow-lg hover:shadow-xl'
                />
                <Search className='absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground/70' />
                <Button
                  aria-label='Search'
                  disabled={isNavigating}
                  className='absolute right-2 top-1/2 transform -translate-y-1/2 bg-primary hover:bg-primary/90 text-primary-foreground rounded-full h-8 w-8 flex items-center justify-center shadow-lg hover:shadow-xl transition-all duration-200 disabled:opacity-70'
                  onClick={() => {
                    if (!isNavigating) {
                      router.push('/chat');
                    }
                  }}
                >
                  <Search className='w-4 h-4' />
                </Button>
              </div>
            </motion.div>

            {/* Popular Questions */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.4 }}
              className='max-w-4xl mx-auto mb-6 px-4'
            >
              <motion.h3
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: 0.5 }}
                className='text-base md:text-lg font-semibold text-foreground mb-3 md:mb-4 text-center'
              >
                Popular Questions
              </motion.h3>
              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: 0.6 }}
                className='text-xs md:text-sm text-muted-foreground mb-4 md:mb-6 text-center'
              >
                Get started with these commonly asked UGC NET questions
              </motion.p>

              <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 md:gap-4 text-center'>
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: 0.7 }}
                  className='p-3 md:p-4 bg-primary/10 backdrop-blur-sm rounded-xl border border-primary/20 shadow-sm hover:shadow-primary/20 hover:bg-primary/15 transition-all duration-300'
                >
                  <h4 className='font-semibold text-primary text-xs md:text-sm mb-2'>
                    Paper 1 Syllabus
                  </h4>
                  <p className='text-xs text-muted-foreground'>
                    Understanding the complete UGC NET Paper 1 structure and
                    topics
                  </p>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: 0.8 }}
                  className='p-3 md:p-4 bg-primary/10 backdrop-blur-sm rounded-xl border border-primary/20 shadow-sm hover:shadow-primary/20 hover:bg-primary/15 transition-all duration-300'
                >
                  <h4 className='font-semibold text-primary text-xs md:text-sm mb-2'>
                    Teaching Aptitude
                  </h4>
                  <p className='text-xs text-muted-foreground'>
                    Core concepts and principles of effective teaching
                  </p>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: 0.9 }}
                  className='p-3 md:p-4 bg-primary/10 backdrop-blur-sm rounded-xl border border-primary/20 shadow-sm hover:shadow-primary/20 hover:bg-primary/15 transition-all duration-300 sm:col-span-2 lg:col-span-1'
                >
                  <h4 className='font-semibold text-primary text-xs md:text-sm mb-2'>
                    Research Methods
                  </h4>
                  <p className='text-xs text-muted-foreground'>
                    Essential research techniques and methodologies
                  </p>
                </motion.div>
              </div>
            </motion.div>

            {/* Trust Indicators */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.6 }}
              className='flex flex-wrap justify-center items-center gap-3 md:gap-6 text-xs text-muted-foreground mb-4 px-4'
            >
              <div className='flex items-center gap-1 md:gap-2'>
                <div className='w-1 h-1 md:w-1.5 md:h-1.5 bg-primary rounded-full'></div>
                <span className='font-medium text-xs md:text-xs'>
                  10,000+ Students Helped
                </span>
              </div>
              <div className='flex items-center gap-1 md:gap-2'>
                <div className='w-1 h-1 md:w-1.5 md:h-1.5 bg-accent rounded-full'></div>
                <span className='font-medium text-xs md:text-xs'>
                  24/7 AI Support
                </span>
              </div>
              <div className='flex items-center gap-1 md:gap-2'>
                <div className='w-1 h-1 md:w-1.5 md:h-1.5 bg-primary rounded-full'></div>
                <span className='font-medium text-xs md:text-xs'>
                  95% Success Rate
                </span>
              </div>
            </motion.div>

            {/* Trusted by Universities */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.7 }}
              className='text-center mb-4 md:mb-6 px-4'
            >
              <p className='text-xs md:text-sm text-muted-foreground mb-2 md:mb-3'>
                Trusted by students from
              </p>
              <div className='flex flex-wrap justify-center items-center gap-2 md:gap-4 text-xs md:text-sm font-medium text-foreground'>
                <span className='px-2 py-1 md:px-3 md:py-1 bg-primary/10 text-primary rounded-full border border-primary/20 text-xs'>
                  Delhi University
                </span>
                <span className='px-2 py-1 md:px-3 md:py-1 bg-primary/10 text-primary rounded-full border border-primary/20 text-xs'>
                  JNU
                </span>
                <span className='px-2 py-1 md:px-3 md:py-1 bg-primary/10 text-primary rounded-full border border-primary/20 text-xs'>
                  BHU
                </span>
                <span className='px-1 py-1 md:px-1 md:py-1 bg-primary/10 text-primary rounded-full border border-primary/20 text-xs'>
                  AMU
                </span>
                <span className='px-2 py-1 md:px-3 md:py-1 bg-primary/10 text-primary rounded-full border border-primary/20 text-xs'>
                  +50 More
                </span>
              </div>
            </motion.div>

            {/* Social Proof */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.8 }}
              className='flex flex-col sm:flex-row items-center justify-center gap-2 md:gap-4 text-xs text-muted-foreground px-4'
            >
              <div className='flex items-center gap-1 md:gap-2'>
                <CheckCircle className='w-3 h-3 text-primary' />
                <span>Free 7-day trial</span>
              </div>
              <div className='hidden sm:block w-px h-3 bg-border'></div>
              <div className='flex items-center gap-1 md:gap-2'>
                <CheckCircle className='w-3 h-3 text-primary' />
                <span>No credit card required</span>
              </div>
              <div className='hidden sm:block w-px h-3 bg-border'></div>
              <div className='flex items-center gap-1 md:gap-2'>
                <CheckCircle className='w-3 h-3 text-primary' />
                <span>Cancel anytime</span>
              </div>
            </motion.div>
          </div>
        </ResponsiveContainer>
      </div>
    </section>
  );
}
