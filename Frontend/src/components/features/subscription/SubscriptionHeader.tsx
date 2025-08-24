import React from "react";
import { motion } from "framer-motion";
import { FiZap, FiShield, FiClock, FiUsers } from "react-icons/fi";

interface SubscriptionHeaderProps {
  darkMode: boolean;
}

export const SubscriptionHeader: React.FC<SubscriptionHeaderProps> = ({
  darkMode,
}) => {
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

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        duration: 0.8,
        staggerChildren: 0.2,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
      },
    },
  };

  const features = [
    {
      icon: FiZap,
      title: "Lightning Fast",
      description: "Get instant responses to all your questions",
    },
    {
      icon: FiShield,
      title: "Secure & Private",
      description: "Your data is protected with enterprise-grade security",
    },
    {
      icon: FiClock,
      title: "24/7 Available",
      description: "Access your AI tutor anytime, anywhere",
    },
    {
      icon: FiUsers,
      title: "Expert Support",
      description: "Get help from our dedicated support team",
    },
  ];

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="text-center mb-16"
    >
      <motion.h1
        variants={itemVariants}
        className={`text-5xl md:text-6xl font-bold mb-6 ${colors.text}`}
      >
        Choose Your{" "}
        <span className="bg-gradient-to-r from-[#009688] to-[#4DB6AC] bg-clip-text text-transparent">
          Plan
        </span>
      </motion.h1>
      <motion.p
        variants={itemVariants}
        className={`text-xl ${colors.secondaryText} mb-12 max-w-3xl mx-auto`}
      >
        Unlock the full potential of Owl AI with our premium features. Choose the
        plan that best fits your learning needs and accelerate your exam
        preparation journey.
      </motion.p>

      <motion.div
        variants={itemVariants}
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto"
      >
        {features.map((feature, index) => (
          <motion.div
            key={index}
            variants={itemVariants}
            className={`p-6 rounded-xl border-2 border-[${colors.cardBorder}] bg-[${colors.cardBg}] hover:border-[${colors.primary}] transition-colors duration-300`}
          >
            <div className={`w-12 h-12 rounded-full bg-[${colors.primary}] flex items-center justify-center mx-auto mb-4`}>
              <feature.icon className="w-6 h-6 text-white" />
            </div>
            <h3 className={`text-lg font-semibold mb-2 ${colors.text}`}>
              {feature.title}
            </h3>
            <p className={`text-sm ${colors.secondaryText}`}>
              {feature.description}
            </p>
          </motion.div>
        ))}
      </motion.div>
    </motion.div>
  );
};
