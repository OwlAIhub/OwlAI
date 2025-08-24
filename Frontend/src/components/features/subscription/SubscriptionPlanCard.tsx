import React from "react";
import { motion } from "framer-motion";
import { FiCheck, FiStar } from "react-icons/fi";

interface Plan {
  id: string;
  name: string;
  price: string;
  features: string[];
  popular?: boolean;
}

interface SubscriptionPlanCardProps {
  plan: Plan;
  onSelect: (planId: string) => void;
  isLoading: boolean;
  darkMode: boolean;
}

export const SubscriptionPlanCard: React.FC<SubscriptionPlanCardProps> = ({
  plan,
  onSelect,
  isLoading,
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

  const cardVariants = {
    hidden: { opacity: 0, y: 30, rotateX: -10 },
    visible: {
      opacity: 1,
      y: 0,
      rotateX: 0,
      transition: {
        duration: 0.8,
        delay: 0.4,
      },
    },
    hover: {
      y: -5,
      scale: 1.02,
      transition: {
        duration: 0.3,
      },
    },
  };

  return (
    <motion.div
      variants={cardVariants}
      initial="hidden"
      animate="visible"
      whileHover="hover"
      className={`relative rounded-2xl p-8 shadow-2xl border-2 ${
        plan.popular
          ? `border-[${colors.accent}] bg-gradient-to-br from-[${colors.cardBg}] to-[${colors.cardBg}]`
          : `border-[${colors.cardBorder}] bg-[${colors.cardBg}]`
      }`}
      style={{
        background: plan.popular
          ? `linear-gradient(135deg, ${colors.cardBg} 0%, ${colors.primary}20 100%)`
          : colors.cardBg,
      }}
    >
      {plan.popular && (
        <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
          <div className="bg-gradient-to-r from-yellow-400 to-orange-500 text-white px-6 py-2 rounded-full text-sm font-bold flex items-center space-x-1">
            <FiStar className="w-4 h-4" />
            <span>Most Popular</span>
          </div>
        </div>
      )}

      <div className="text-center mb-8">
        <h3 className={`text-3xl font-bold mb-2 ${colors.text}`}>
          {plan.name}
        </h3>
        <div className="mb-4">
          <span className={`text-5xl font-bold ${colors.primary}`}>
            {plan.price}
          </span>
          <span className={`text-lg ${colors.secondaryText}`}>/month</span>
        </div>
      </div>

      <div className="space-y-4 mb-8">
        {plan.features.map((feature, index) => (
          <div key={index} className="flex items-center space-x-3">
            <div
              className={`w-6 h-6 rounded-full bg-[${colors.primary}] flex items-center justify-center flex-shrink-0`}
            >
              <FiCheck className="w-4 h-4 text-white" />
            </div>
            <span className={`${colors.text}`}>{feature}</span>
          </div>
        ))}
      </div>

      <button
        onClick={() => onSelect(plan.id)}
        disabled={isLoading}
        className={`w-full py-4 px-6 rounded-xl font-bold text-lg transition-all duration-300 transform hover:scale-105 ${
          plan.popular
            ? `bg-gradient-to-r from-[${colors.accent}] to-[${colors.accentDark}] text-white shadow-lg`
            : `bg-[${colors.primary}] hover:bg-[${colors.primaryDark}] text-white`
        } ${isLoading ? "opacity-50 cursor-not-allowed" : ""}`}
      >
        {isLoading ? "Processing..." : "Get Started"}
      </button>
    </motion.div>
  );
};
