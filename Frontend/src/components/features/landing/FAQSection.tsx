import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { IconChevronDown, IconHelp } from "@tabler/icons-react";

const faqData = [
  {
    question: "How does Owl AI help with exam preparation?",
    answer:
      "Owl AI provides instant, accurate answers to your study questions using advanced artificial intelligence. It offers personalized explanations, practice questions, mock tests, and comprehensive study materials specifically designed for competitive exams like UGC-NET, CSIR-NET, SSC, and CTET.",
  },
  {
    question: "Is Owl AI available 24/7?",
    answer:
      "Yes! Owl AI is available 24/7, so you can study anytime, anywhere. Whether it's late at night or early morning, our AI assistant is always ready to help you with your exam preparation questions and doubts.",
  },
  {
    question: "What languages does Owl AI support?",
    answer:
      "Owl AI supports multiple languages including English, Hindi, and regional languages. You can ask questions and receive explanations in your preferred language for better understanding and comfort.",
  },
  {
    question: "How accurate are the AI responses?",
    answer:
      "Our AI responses are highly accurate and based on expert-curated content. The system is trained on comprehensive study materials and continuously updated with the latest syllabus and exam patterns to ensure reliability.",
  },
  {
    question: "Can I use Owl AI for multiple exams?",
    answer:
      "Absolutely! Owl AI covers 50+ exam categories including UGC-NET, CSIR-NET, SSC CGL, CTET, State PSC, and banking exams. You can switch between different exam preparations seamlessly.",
  },
  {
    question: "Is my data secure and private?",
    answer:
      "Yes, your data is completely secure and private. We use enterprise-grade security measures to protect your study sessions, questions, and personal information. Your privacy is our top priority.",
  },
  {
    question: "Do you offer practice tests and mock exams?",
    answer:
      "Yes! Owl AI provides comprehensive practice tests, mock exams, and performance tracking. You can assess your preparation level, identify weak areas, and track your progress over time.",
  },
  {
    question: "How do I get started with Owl AI?",
    answer:
      "Getting started is simple! Just sign up, choose your target exam, and start asking questions. Our AI will guide you through your preparation journey with personalized study plans and instant doubt resolution.",
  },
];

interface FAQItemProps {
  question: string;
  answer: string;
  isOpen: boolean;
  onToggle: () => void;
  index: number;
}

const FAQItem: React.FC<FAQItemProps> = ({
  question,
  answer,
  isOpen,
  onToggle,
  index,
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      className="group"
    >
      <div className="bg-white rounded-2xl border border-gray-100 hover:border-teal-200 transition-all duration-300 hover:shadow-lg hover:shadow-teal-50/50 overflow-hidden">
        <button
          onClick={onToggle}
          className="w-full px-6 py-5 text-left flex items-center justify-between hover:bg-gray-50/50 transition-colors duration-300"
        >
          <h3 className="text-lg font-semibold text-gray-900 pr-4 group-hover:text-teal-700 transition-colors duration-300">
            {question}
          </h3>
          <div
            className={`flex-shrink-0 w-6 h-6 transition-transform duration-300 ${
              isOpen ? "rotate-180" : ""
            }`}
          >
            <IconChevronDown className="w-6 h-6 text-gray-500 group-hover:text-teal-600 transition-colors duration-300" />
          </div>
        </button>

        <AnimatePresence>
          {isOpen && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.3, ease: "easeInOut" }}
              className="overflow-hidden"
            >
              <div className="px-6 pb-5">
                <div className="pt-2 border-t border-gray-100">
                  <p className="text-gray-600 leading-relaxed">{answer}</p>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
};

export const FAQSection: React.FC = () => {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const handleToggle = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <section id="faq" className="py-20 bg-white">
      <div className="container mx-auto px-6">
        {/* Header Section */}
        <div className="text-center mb-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="inline-flex items-center space-x-2 bg-teal-50 px-3 py-1.5 rounded-full border border-teal-200 mb-4"
          >
            <IconHelp className="text-teal-600 w-3 h-3" />
            <span className="text-teal-700 text-xs font-medium">
              Frequently Asked Questions
            </span>
          </motion.div>

          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-3xl md:text-4xl font-bold text-gray-900 mb-4"
          >
            Got{" "}
            <span className="relative inline-block">
              <span className="bg-gradient-to-r from-teal-500 to-teal-700 bg-clip-text text-transparent">
                Questions?
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
            Find answers to the most common questions about Owl AI and how it
            can help you excel in your exam preparation.
          </motion.p>
        </div>

        {/* FAQ Grid */}
        <div className="max-w-4xl mx-auto">
          <div className="grid gap-4">
            {faqData.map((faq, index) => (
              <FAQItem
                key={index}
                question={faq.question}
                answer={faq.answer}
                isOpen={openIndex === index}
                onToggle={() => handleToggle(index)}
                index={index}
              />
            ))}
          </div>
        </div>

        {/* Bottom Info */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="text-center mt-12"
        >
          <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100 max-w-3xl mx-auto">
            <h3 className="text-xl font-semibold text-gray-900 mb-3">
              Still have questions?
            </h3>
            <p className="text-gray-600 mb-4">
              Can&apos;t find the answer you&apos;re looking for? Our support
              team is here to help.
            </p>
            <button className="bg-gradient-to-r from-teal-500 to-teal-600 text-white px-6 py-3 rounded-xl font-semibold hover:from-teal-600 hover:to-teal-700 transition-all duration-300 shadow-lg hover:shadow-xl hover:scale-105">
              Contact Support
            </button>
          </div>
        </motion.div>
      </div>
    </section>
  );
};
