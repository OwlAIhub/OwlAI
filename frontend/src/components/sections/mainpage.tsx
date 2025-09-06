'use client';

import { Footer } from '@/components/layout/Footer';
import { AboutSection } from './AboutSection';
import { ContactSection } from './ContactSection';
import { ExamsSection } from './ExamsSection';
import { FAQSection } from './FAQSection';
import { HeroSection } from './HeroSection';
import { KeyFeaturesSection } from './KeyFeaturesSection';
import { WhyOwlSection } from './WhyOwlSection';

const MainPage = () => {
  return (
    <div suppressHydrationWarning>
      <HeroSection />
      <AboutSection />
      <WhyOwlSection />
      <ExamsSection />
      <KeyFeaturesSection />
      <FAQSection />
      <ContactSection />
      <Footer />
    </div>
  );
};

export default MainPage;
