import React from "react";
import { cn } from "../../utils";
import {
  IconBrain,
  IconLanguage,
  IconBook,
  IconBolt,
  IconShield,
  IconTarget,
  IconClock,
  IconUsers,
  IconSparkles,
} from "@tabler/icons-react";
import { motion } from "framer-motion";

export const WhyChooseSection: React.FC = () => {
  return (
    <section
      id="why-choose"
      className="min-h-screen bg-white flex items-center justify-center py-35"
    >
      <div className="container mx-auto px-6">
        {/* Header Section */}
        <div className="text-center mb-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="inline-flex items-center space-x-2 bg-teal-50 px-3 py-1.5 rounded-full border border-teal-200 mb-4"
          >
            <IconSparkles className="text-teal-600 w-3 h-3" />
            <span className="text-teal-700 text-xs font-medium">
              Why Choose Owl AI
            </span>
          </motion.div>

          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-3xl md:text-4xl font-bold text-gray-900 mb-4"
          >
            Experience{" "}
            <span className="relative inline-block">
              <span className="bg-gradient-to-r from-teal-500 to-teal-700 bg-clip-text text-transparent">
                AI-Driven Learning
              </span>
              <div className="absolute -bottom-1 left-0 right-0 h-0.5 bg-gradient-to-r from-teal-400 to-teal-600 rounded-full"></div>
            </span>
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-base text-gray-600 max-w-2xl mx-auto"
          >
            Discover the power of comprehensive features designed for
            competitive exam success. Built for students, by students, with
            cutting-edge AI technology.
          </motion.p>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
        >
          <FeaturesSectionDemo />
        </motion.div>
      </div>
    </section>
  );
};

export function FeaturesSectionDemo() {
  const features = [
    {
      title: "AI-Powered Learning",
      description:
        "Advanced artificial intelligence that understands your learning style and provides personalized explanations for complex topics.",
      icon: <IconBrain />,
    },
    {
      title: "Multi-Language Support",
      description:
        "Study in English, Hindi, or regional languages. Get explanations and answers in your preferred language for better understanding.",
      icon: <IconLanguage />,
    },
    {
      title: "Comprehensive Solutions",
      description:
        "Access thousands of solved problems, step-by-step explanations, and study materials covering all major competitive exam topics.",
      icon: <IconBook />,
    },
    {
      title: "Instant Responses",
      description:
        "Get answers in seconds, not minutes. Our AI delivers quick responses to keep your study momentum going.",
      icon: <IconBolt />,
    },
    {
      title: "100% Secure & Private",
      description:
        "Your data is protected with enterprise-grade security. Your study sessions and questions remain completely private and secure.",
      icon: <IconShield />,
    },
    {
      title: "Exam-Focused Content",
      description:
        "Content specifically curated for UGC-NET, CSIR-NET, SSC, CTET, and other competitive exams with latest syllabus coverage.",
      icon: <IconTarget />,
    },
    {
      title: "24/7 Availability",
      description:
        "Study anytime, anywhere. Our AI assistant is always ready to help you learn, even during late-night study sessions.",
      icon: <IconClock />,
    },
    {
      title: "Community Learning",
      description:
        "Join thousands of students preparing for the same exams. Share insights and learn from the collective knowledge.",
      icon: <IconUsers />,
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 relative z-10 py-10 max-w-7xl mx-auto">
      {features.map((feature, index) => (
        <Feature key={feature.title} {...feature} index={index} />
      ))}
    </div>
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
        "flex flex-col lg:border-r py-10 relative group/feature border-gray-200 h-64",
        index === 4 && "lg:border-l border-gray-200",
        index < 4 && "lg:border-b border-gray-200"
      )}
    >
      {index < 4 && (
        <div className="opacity-0 group-hover/feature:opacity-100 transition duration-200 absolute inset-0 h-full w-full bg-gradient-to-t from-gray-100 to-transparent pointer-events-none" />
      )}
      {index >= 4 && (
        <div className="opacity-0 group-hover/feature:opacity-100 transition duration-200 absolute inset-0 h-full w-full bg-gradient-to-b from-gray-100 to-transparent pointer-events-none" />
      )}
      <div className="mb-4 relative z-10 px-10 text-gray-600">{icon}</div>
      <div className="text-lg font-bold mb-2 relative z-10 px-10">
        <div className="absolute left-0 inset-y-0 h-6 group-hover/feature:h-8 w-1 rounded-tr-full rounded-br-full bg-gray-300 group-hover/feature:bg-teal-500 transition-all duration-200 origin-center" />
        <span className="group-hover/feature:translate-x-2 transition duration-200 inline-block text-gray-800">
          {title}
        </span>
      </div>
      <p className="text-sm text-gray-600 max-w-xs relative z-10 px-10 flex-1">
        {description}
      </p>
    </div>
  );
};
