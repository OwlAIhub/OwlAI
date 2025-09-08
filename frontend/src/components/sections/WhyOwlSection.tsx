"use client";

import {
  ResponsiveContainer,
  ResponsiveText,
} from "@/components/ui/responsive-container";
import { cn } from "@/lib/utils";
import {
  IconAdjustmentsBolt,
  IconCloud,
  IconCurrencyDollar,
  IconEaseInOut,
  IconHeart,
  IconHelp,
  IconRouteAltLeft,
  IconTerminal2,
} from "@tabler/icons-react";
import { motion } from "framer-motion";
import { Zap } from "lucide-react";

export function WhyOwlSection() {
  const features = [
    {
      title: "Built for students",
      description:
        "Built for students, learners, dreamers, thinkers and achievers preparing for competitive exams.",
      icon: <IconTerminal2 />,
    },
    {
      title: "Ease of learning",
      description:
        "It's as simple as asking a question, and as powerful as having a personal tutor.",
      icon: <IconEaseInOut />,
    },
    {
      title: "Free forever",
      description:
        "Our platform is completely free. No cap, no lock, no credit card required for basic features.",
      icon: <IconCurrencyDollar />,
    },
    {
      title: "99.9% Uptime guarantee",
      description:
        "We ensure our AI is always available when you need to study.",
      icon: <IconCloud />,
    },
    {
      title: "Multi-language Support",
      description:
        "Study in your preferred language - English, Hindi, or regional languages",
      icon: <IconRouteAltLeft />,
    },
    {
      title: "24/7 AI Support",
      description:
        "Our AI assistant is available 100% of the time. Study whenever inspiration strikes.",
      icon: <IconHelp />,
    },
    {
      title: "Exam-focused content",
      description:
        "If you don't like our content, we'll help you find exactly what you need for your exam.",
      icon: <IconAdjustmentsBolt />,
    },
    {
      title: "And everything else",
      description:
        "Comprehensive study materials, practice tests, and expert guidance all in one place.",
      icon: <IconHeart />,
    },
  ];

  return (
    <section
      id="why-choose-us"
      className="min-h-screen flex items-start justify-center px-4 sm:px-6 md:px-8 pt-20 sm:pt-24 md:pt-28 lg:pt-32 pb-12 sm:pb-16 md:pb-20 lg:pb-16 bg-white"
    >
      <ResponsiveContainer maxWidth="7xl" padding="none">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center mb-8 sm:mb-10 md:mb-12 lg:mb-14"
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            viewport={{ once: true }}
            className="inline-flex items-center justify-center w-12 h-12 sm:w-14 sm:h-14 md:w-16 md:h-16 bg-primary/10 rounded-2xl mb-3 sm:mb-4 md:mb-5"
          >
            <Zap className="w-5 h-5 sm:w-6 sm:h-6 md:w-8 md:h-8 text-primary" />
          </motion.div>
          <ResponsiveText
            as="h2"
            fluid={true}
            clamp={{
              min: "1.5rem",
              preferred: "0.875rem + 3vw",
              max: "2.25rem",
            }}
            className="font-bold text-foreground mb-3 sm:mb-4 md:mb-5 leading-tight px-4 text-center max-w-4xl mx-auto"
          >
            <span className="text-foreground">The Ultimate </span>
            <span className="bg-gradient-to-r from-primary via-primary to-accent bg-clip-text text-transparent relative">
              Learning Advantage
              {/* Elegant decorative underline */}
              <div className="absolute -bottom-2 left-0 right-0">
                {/* Main underline with gradient */}
                <div className="w-full h-0.5 bg-gradient-to-r from-transparent via-primary to-transparent opacity-80"></div>
                {/* Subtle accent line */}
                <div className="w-3/4 h-0.5 bg-gradient-to-r from-primary/40 to-accent/40 mx-auto mt-1 rounded-full"></div>
                {/* Decorative dot */}
                <div className="absolute -top-1 left-1/2 transform -translate-x-1/2 w-1 h-1 bg-primary rounded-full"></div>
              </div>
            </span>
          </ResponsiveText>
          <ResponsiveText
            as="p"
            size="lg"
            className="text-muted-foreground max-w-4xl mx-auto leading-relaxed px-4 text-center"
          >
            Discover why thousands of students choose Owl AI for their
            competitive exam preparation journey. From personalized learning
            paths to instant AI-powered assistance, we provide everything you
            need to excel in UGC-NET, CSIR-NET, SSC, CTET, and other competitive
            examinations. Join our community of successful learners who have
            transformed their study experience with cutting-edge technology and
            expert guidance.
          </ResponsiveText>
        </motion.div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 relative z-10 py-10 max-w-7xl mx-auto">
          {features.map((feature, index) => (
            <Feature key={feature.title} {...feature} index={index} />
          ))}
        </div>
      </ResponsiveContainer>
    </section>
  );
}

const Feature = ({
  title,
  description,
  icon,
  index,
}: {
  title: string;
  description: string;
  icon: React.ReactNode;
  index: number;
}) => {
  return (
    <div
      className={cn(
        "flex flex-col lg:border-r py-10 relative group/feature border-neutral-200",
        (index === 0 || index === 4) && "lg:border-l border-neutral-200",
        index < 4 && "lg:border-b border-neutral-200",
      )}
    >
      {index < 4 && (
        <div className="opacity-0 group-hover/feature:opacity-100 transition duration-200 absolute inset-0 h-full w-full bg-gradient-to-t from-neutral-100 to-transparent pointer-events-none" />
      )}
      {index >= 4 && (
        <div className="opacity-0 group-hover/feature:opacity-100 transition duration-200 absolute inset-0 h-full w-full bg-gradient-to-b from-neutral-100 to-transparent pointer-events-none" />
      )}
      <div className="mb-4 relative z-10 px-10 text-neutral-600">{icon}</div>
      <div className="text-lg font-bold mb-2 relative z-10 px-10">
        <div className="absolute left-0 inset-y-0 h-6 group-hover/feature:h-8 w-1 rounded-tr-full rounded-br-full bg-neutral-300 group-hover/feature:bg-teal-500 transition-all duration-200 origin-center" />
        <span className="group-hover/feature:translate-x-2 transition duration-200 inline-block text-neutral-800">
          {title}
        </span>
      </div>
      <p className="text-sm text-neutral-600 max-w-xs relative z-10 px-10">
        {description}
      </p>
    </div>
  );
};
