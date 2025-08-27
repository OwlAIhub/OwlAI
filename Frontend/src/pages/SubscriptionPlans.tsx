import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FiCheck, FiChevronRight } from "react-icons/fi";
import { useNavigate } from "react-router-dom";
import Header from "../Components/Header";
import { SubscriptionHeader } from "@/components/features/subscription/SubscriptionHeader";
import { SubscriptionPlanCard } from "@/components/features/subscription/SubscriptionPlanCard";
import { SubscriptionFAQ } from "@/components/features/subscription/SubscriptionFAQ";
import { subscriptionPlans } from "@/data/subscriptionData";

interface SubscriptionPlansProps {
  onClose?: () => void;
  darkMode?: boolean;
}

const SubscriptionPlans = ({
  onClose,
  darkMode = true,
}: SubscriptionPlansProps) => {
  const [isSuccess, setIsSuccess] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  // Color palette
  const colors = {
    base: "#0D1B2A",
    primary: "#009688",
    primaryLight: "#4DB6AC",
    primaryDark: "#00796B",
    accent: "#FFC107",
    accentDark: "#FFA000",
    text: "#E0E1DD",
    secondaryText: "#B0BEC5",
    cardBg: "#1B263B",
    cardBorder: "#415A77",
  };

  // Animation variants
  const backdropVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        duration: 0.5,
      },
    },
    exit: {
      opacity: 0,
      transition: {
        duration: 0.3,
      },
    },
  };

  const successVariants = {
    hidden: { opacity: 0, scale: 0.9 },
    visible: {
      opacity: 1,
      scale: 1,
      transition: {
        duration: 0.6,
      },
    },
  };

  const checkmarkVariants = {
    hidden: { pathLength: 0, opacity: 0 },
    visible: {
      pathLength: 1,
      opacity: 1,
      transition: {
        duration: 0.8,
      },
    },
  };

  const handleClose = () => {
    if (onClose) {
      onClose();
    } else {
      navigate("/");
    }
  };

  const handleSubscribe = () => {
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      setIsSuccess(true);
    }, 1800);
  };

  return (
    <AnimatePresence>
      <motion.div
        key="backdrop"
        initial="hidden"
        animate="visible"
        exit="exit"
        variants={backdropVariants}
        className="fixed inset-0 z-50 flex flex-col overflow-y-auto"
        style={{ backgroundColor: colors.base }}
      >
        <div className="w-full fixed top-0 z-50">
          <Header
            darkMode={darkMode}
            currentChatTitle=""
            onToggleSidebar={() => {}}
            onLogout={() => {}}
            toggleDarkMode={() => {}}
            isLoggedIn={true}
          />
        </div>

        <div className="flex-1 flex flex-col items-center px-4 py-8 mt-16">
          {!isSuccess ? (
            <>
              <SubscriptionHeader darkMode={darkMode} />

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-7xl mx-auto mb-16">
                {subscriptionPlans.map(plan => (
                  <SubscriptionPlanCard
                    key={plan.id}
                    plan={plan}
                    onSelect={handleSubscribe}
                    isLoading={isLoading}
                    darkMode={darkMode}
                  />
                ))}
              </div>

              <SubscriptionFAQ darkMode={darkMode} />
            </>
          ) : (
            <motion.div
              variants={successVariants}
              initial="hidden"
              animate="visible"
              className="max-w-md mx-auto text-center py-12 px-8 rounded-2xl"
              style={{
                backgroundColor: colors.cardBg,
                borderColor: colors.cardBorder,
              }}
            >
              <motion.div
                initial={{ scale: 0 }}
                animate={{
                  scale: [1, 1.1, 1],
                  transition: {
                    duration: 0.8,
                    ease: [0.33, 1, 0.68, 1],
                  },
                }}
                className="w-24 h-24 bg-gradient-to-br from-primary to-primaryDark rounded-full flex items-center justify-center mx-auto mb-8 shadow-lg"
              >
                <svg
                  width="40"
                  height="40"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <motion.path
                    d="M20 6L9 17l-5-5"
                    variants={checkmarkVariants}
                    initial="hidden"
                    animate="visible"
                    stroke="white"
                  />
                </svg>
              </motion.div>

              <motion.h3
                className="text-3xl font-bold mb-4"
                style={{ color: colors.text }}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
              >
                You&apos;re All Set!
              </motion.h3>

              <motion.p
                className="mb-8 text-lg"
                style={{ color: colors.secondaryText }}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.4 }}
              >
                Your Unlimited Pro subscription is now active. Enjoy premium
                access!
              </motion.p>

              <motion.button
                onClick={handleClose}
                whileHover={{
                  scale: 1.05,
                  boxShadow: `0 10px 20px -5px rgba(0, 150, 136, 0.3)`,
                }}
                whileTap={{ scale: 0.95 }}
                className="px-8 py-3 rounded-xl font-bold text-white transition-all"
                style={{
                  backgroundColor: colors.primary,
                  boxShadow: `0 4px 15px -5px ${colors.primary}`,
                }}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6 }}
              >
                Start Exploring
              </motion.button>
            </motion.div>
          )}
        </div>
      </motion.div>
    </AnimatePresence>
  );
};

export default SubscriptionPlans;
