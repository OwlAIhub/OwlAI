import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FiCheck, FiX, FiArrowRight, FiStar, FiZap, FiChevronRight } from "react-icons/fi";
import { useNavigate } from "react-router-dom";
import Header from "../Components/Header";

const SubscriptionPlans = ({ onClose, darkMode = true }) => {
  const [isSuccess, setIsSuccess] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

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
    cardBorder: "#415A77"
  };

  const plan = {
    id: "unlimited",
    name: "Unlimited Pro",
    price: "₹199",
    features: [
      "Unlimited AI conversations",
      "Priority access to all models",
      "Faster response times",
      "Advanced customization",
      "24/7 premium support",
      "Cancel anytime"
    ]
  };

  // Animation variants
  const backdropVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: { 
        duration: 0.5,
        ease: [0.33, 1, 0.68, 1]
      }
    },
    exit: { 
      opacity: 0,
      transition: { 
        duration: 0.3,
        ease: [0.33, 1, 0.68, 1]
      }
    }
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.3
      }
    }
  };

  const titleVariants = {
    hidden: { opacity: 0, y: -20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.8,
        ease: [0.33, 1, 0.68, 1]
      }
    }
  };

  const cardVariants = {
    hidden: { opacity: 0, y: 30, rotateX: -10 },
    visible: {
      opacity: 1,
      y: 0,
      rotateX: 0,
      transition: {
        duration: 0.8,
        ease: [0.33, 1, 0.68, 1],
        delay: 0.4
      }
    },
    hover: {
      y: -5,
      scale: 1.02,
      boxShadow: "0 25px 50px -12px rgba(0, 150, 136, 0.25)",
      transition: {
        type: "spring",
        stiffness: 300,
        damping: 10
      }
    },
    tap: {
      scale: 0.98,
      transition: {
        type: "spring",
        stiffness: 500
      }
    }
  };

  const featureItemVariants = {
    hidden: { opacity: 0, x: -20 },
    visible: (i) => ({
      opacity: 1,
      x: 0,
      transition: {
        delay: i * 0.1 + 0.6,
        duration: 0.6,
        ease: [0.33, 1, 0.68, 1]
      }
    }),
    hover: {
      x: 5,
      transition: {
        type: "spring",
        stiffness: 300
      }
    }
  };

  const badgeVariants = {
    hidden: { scale: 0, opacity: 0 },
    visible: {
      scale: 1,
      opacity: 1,
      transition: {
        delay: 0.8,
        type: "spring",
        stiffness: 500,
        damping: 15
      }
    },
    hover: {
      scale: 1.05,
      rotate: [0, 5, -5, 0],
      transition: {
        duration: 0.6
      }
    }
  };

  const buttonVariants = {
    hover: {
      backgroundPosition: "100% 0%",
      transition: {
        duration: 0.6,
        ease: [0.33, 1, 0.68, 1]
      }
    },
    tap: {
      scale: 0.96
    }
  };

  const successVariants = {
    hidden: { opacity: 0, scale: 0.9 },
    visible: {
      opacity: 1,
      scale: 1,
      transition: {
        type: "spring",
        stiffness: 300,
        damping: 15
      }
    }
  };

  const checkmarkVariants = {
    hidden: { pathLength: 0, opacity: 0 },
    visible: {
      pathLength: 1,
      opacity: 1,
      transition: {
        duration: 0.8,
        ease: [0.33, 1, 0.68, 1]
      }
    }
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
          <Header darkMode={darkMode} />
        </div>
        
        <motion.div 
          className="flex-1 flex flex-col items-center px-4 py-8 mt-16"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          {!isSuccess ? (
            <>
              <motion.div 
                className="text-center mb-8 md:mb-12 w-full max-w-3xl"
                variants={titleVariants}
              >
                <motion.h2
                  className="text-4xl md:text-5xl font-bold mb-4"
                  style={{ color: colors.text }}
                >
                  Unlimited AI Power
                </motion.h2>
                <motion.p
                  className="text-xl md:text-2xl max-w-2xl mx-auto"
                  style={{ color: colors.secondaryText }}
                >
                  Premium access for one simple price
                </motion.p>
              </motion.div>

              <motion.div
                variants={cardVariants}
                initial="hidden"
                animate="visible"
                whileHover="hover"
                whileTap="tap"
                className="relative rounded-2xl p-8 w-full max-w-lg border"
                style={{ 
                  backgroundColor: colors.cardBg,
                  borderColor: colors.cardBorder,
                  transformStyle: "preserve-3d"
                }}
              >
                <motion.div
                  variants={badgeVariants}
                  whileHover="hover"
                  className="absolute -top-4 left-1/2 transform -translate-x-1/2 bg-gradient-to-r from-accent to-accentDark text-gray-900 text-sm font-bold px-4 py-2 rounded-full flex items-center shadow-lg"
                  style={{ backgroundColor: colors.accent }}
                >
                  <FiStar className="mr-2" /> MOST POPULAR
                </motion.div>

                <div className="flex flex-col items-center mb-8">
                  <h3 
                    className="text-3xl font-bold mb-2 text-center"
                    style={{ color: colors.primaryLight }}
                  >
                    {plan.name}
                  </h3>
                  <div className="flex items-end mb-4">
                    <span 
                      className="text-5xl font-bold mr-2"
                      style={{ color: colors.text }}
                    >
                      {plan.price}
                    </span>
                    <span 
                      className="text-lg pb-1"
                      style={{ color: colors.secondaryText }}
                    >
                      /month
                    </span>
                  </div>
                  <p 
                    className="text-sm"
                    style={{ color: colors.secondaryText }}
                  >
                    Billed monthly. No commitment.
                  </p>
                </div>

                <ul className="space-y-4 mb-10">
                  {plan.features.map((feature, i) => (
                    <motion.li 
                      key={feature} 
                      custom={i}
                      variants={featureItemVariants}
                      whileHover="hover"
                      className="flex items-start"
                      style={{ color: colors.text }}
                    >
                      <motion.div
                        className="flex-shrink-0 mr-3 mt-1"
                        whileHover={{ scale: 1.2 }}
                      >
                        <FiCheck 
                          className="text-lg" 
                          style={{ color: colors.primary }} 
                        />
                      </motion.div>
                      <span className="text-lg">{feature}</span>
                    </motion.li>
                  ))}
                </ul>

                <motion.button
                  onClick={handleSubscribe}
                  disabled={isLoading}
                  variants={buttonVariants}
                  whileHover="hover"
                  whileTap="tap"
                  className={`w-full py-4 rounded-xl font-bold text-lg text-white transition-all ${
                    isLoading ? "cursor-not-allowed" : ""
                  }`}
                  style={{ 
                    background: `linear-gradient(90deg, ${colors.primary} 0%, ${colors.primaryDark} 100%)`,
                    backgroundSize: "200% 100%"
                  }}
                >
                  {isLoading ? (
                    <motion.div
                      animate={{ rotate: 360 }}
                      transition={{ 
                        duration: 1, 
                        repeat: Infinity, 
                        ease: "linear" 
                      }}
                      className="w-6 h-6 border-3 border-white border-t-transparent rounded-full mx-auto"
                    />
                  ) : (
                    <div className="flex items-center justify-center">
                      Get Started <FiChevronRight className="ml-2 text-xl" />
                    </div>
                  )}
                </motion.button>
              </motion.div>

              <motion.div 
                className="text-center mt-8 max-w-lg"
                variants={titleVariants}
                transition={{ delay: 0.8 }}
              >
                <p 
                  className="text-sm"
                  style={{ color: colors.secondaryText }}
                >
                  Secure payment processing. 7-day money back guarantee.
                </p>
              </motion.div>
            </>
          ) : (
            <motion.div
              variants={successVariants}
              initial="hidden"
              animate="visible"
              className="max-w-md mx-auto text-center py-12 px-8 rounded-2xl"
              style={{ 
                backgroundColor: colors.cardBg,
                borderColor: colors.cardBorder
              }}
            >
              <motion.div
                initial={{ scale: 0 }}
                animate={{
                  scale: [1, 1.1, 1],
                  transition: {
                    duration: 0.8,
                    ease: [0.33, 1, 0.68, 1]
                  }
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
                You're All Set!
              </motion.h3>
              
              <motion.p
                className="mb-8 text-lg"
                style={{ color: colors.secondaryText }}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.4 }}
              >
                Your Unlimited Pro subscription is now active. Enjoy premium access!
              </motion.p>
              
              <motion.button
                onClick={handleClose}
                whileHover={{ 
                  scale: 1.05,
                  boxShadow: `0 10px 20px -5px rgba(0, 150, 136, 0.3)`
                }}
                whileTap={{ scale: 0.95 }}
                className="px-8 py-3 rounded-xl font-bold text-white transition-all"
                style={{ 
                  backgroundColor: colors.primary,
                  boxShadow: `0 4px 15px -5px ${colors.primary}`
                }}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6 }}
              >
                Start Exploring
              </motion.button>
            </motion.div>
          )}
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default SubscriptionPlans;