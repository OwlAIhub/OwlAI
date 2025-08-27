import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FiChevronDown, FiChevronUp } from "react-icons/fi";

interface SubscriptionFAQProps {
  darkMode: boolean;
}

interface FAQItem {
  question: string;
  answer: string;
}

export const SubscriptionFAQ: React.FC<SubscriptionFAQProps> = ({
  darkMode,
}) => {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const colors = {
    base: darkMode ? "#0D1B2A" : "#ffffff",
    primary: "#009688",
    primaryLight: "#4DB6AC",
    primaryDark: "#00796B",
    accent: "#FFC107",
    accentDark: "#FFA000",
    text: darkMode ? "#E0E1DD" : "#1a202c",
    secondaryText: darkMode ? "#B0BEC5" : "#4a5568",
    cardBg: darkMode ? "#1B263B" : "#f7fafc",
    cardBorder: darkMode ? "#415A77" : "#e2e8f0",
  };

  const faqs: FAQItem[] = [
    {
      question: "Can I cancel my subscription anytime?",
      answer:
        "Yes, you can cancel your subscription at any time. Your access will continue until the end of your current billing period.",
    },
    {
      question: "What payment methods do you accept?",
      answer:
        "We accept all major credit cards, debit cards, and digital wallets including PayPal, Apple Pay, and Google Pay.",
    },
    {
      question: "Is there a free trial available?",
      answer:
        "Yes, we offer a 7-day free trial for all premium plans. You can upgrade anytime during the trial period.",
    },
    {
      question: "Can I switch between plans?",
      answer:
        "Absolutely! You can upgrade or downgrade your plan at any time. Changes will be reflected in your next billing cycle.",
    },
    {
      question: "What happens if I exceed my monthly limit?",
      answer:
        "You'll receive a notification when you're close to your limit. You can either upgrade your plan or wait until the next billing cycle.",
    },
    {
      question: "Is my data secure?",
      answer:
        "Yes, we use enterprise-grade encryption and security measures to protect your data. We never share your information with third parties.",
    },
  ];

  const toggleFAQ = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, delay: 0.6 }}
      className="max-w-4xl mx-auto"
    >
      <div className="text-center mb-12">
        <h2 className={`text-4xl font-bold mb-4 ${colors.text}`}>
          Frequently Asked Questions
        </h2>
        <p className={`text-lg ${colors.secondaryText}`}>
          Everything you need to know about our subscription plans
        </p>
      </div>

      <div className="space-y-4">
        {faqs.map((faq, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
            className={`border-2 border-[${colors.cardBorder}] rounded-xl overflow-hidden`}
          >
            <button
              onClick={() => toggleFAQ(index)}
              className={`w-full px-6 py-4 text-left flex items-center justify-between hover:bg-[${colors.cardBg}] transition-colors duration-200`}
            >
              <span className={`font-semibold text-lg ${colors.text}`}>
                {faq.question}
              </span>
              {openIndex === index ? (
                <FiChevronUp className={`w-5 h-5 ${colors.primary}`} />
              ) : (
                <FiChevronDown className={`w-5 h-5 ${colors.secondaryText}`} />
              )}
            </button>
            <AnimatePresence>
              {openIndex === index && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.3 }}
                  className={`px-6 pb-4 ${colors.secondaryText}`}
                >
                  {faq.answer}
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
};
