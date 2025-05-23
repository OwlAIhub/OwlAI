import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FiCheck, FiX, FiArrowRight, FiStar } from "react-icons/fi";
import { useNavigate } from "react-router-dom";
import Header from "../Components/Header";

const SubscriptionPlans = ({ onClose, darkMode = true }) => {
  const [selectedPlan, setSelectedPlan] = useState(null);
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

  const plans = [
    {
      id: "basic",
      name: "Basic",
      price: "$9.99",
      credits: 100,
      features: [
        "100 credits/month",
        "Access to basic models",
        "Standard response speed",
        "Email support",
      ],
      popular: false,
    },
    {
      id: "pro",
      name: "Professional",
      price: "$19.99",
      credits: 250,
      features: [
        "250 credits/month",
        "Access to advanced models",
        "Faster response speed",
        "Priority email support",
        "Early access to features",
      ],
      popular: true,
    },
    {
      id: "enterprise",
      name: "Enterprise",
      price: "$49.99",
      credits: 750,
      features: [
        "750 credits/month",
        "Access to all models",
        "Highest priority speed",
        "24/7 dedicated support",
        "Custom model training",
        "API access",
      ],
      popular: false,
    },
  ];

  // Animation variants
  const backdropVariants = {
    hidden: { opacity: 0, backdropFilter: "blur(0px)" },
    visible: { 
      opacity: 1, 
      backdropFilter: "blur(8px)",
      transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] }
    },
    exit: { 
      opacity: 0, 
      backdropFilter: "blur(0px)",
      transition: { duration: 0.3, ease: [0.22, 1, 0.36, 1] }
    }
  };

  const modalVariants = {
    hidden: { opacity: 0, y: isMobile ? 20 : 50, scale: 0.95 },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: {
        type: "spring",
        damping: isMobile ? 30 : 25,
        stiffness: isMobile ? 350 : 300,
        mass: 0.5,
        delay: 0.1
      }
    },
    exit: {
      opacity: 0,
      y: isMobile ? 20 : 30,
      scale: 0.95,
      transition: {
        duration: 0.3,
        ease: [0.22, 1, 0.36, 1]
      }
    }
  };

  const cardVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: (i) => ({
      opacity: 1,
      y: 0,
      transition: {
        delay: i * 0.1 + 0.3,
        duration: 0.6,
        ease: [0.22, 1, 0.36, 1]
      }
    }),
    hover: {
      y: -8,
      scale: 1.02,
      boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)",
      transition: { 
        type: "spring", 
        stiffness: 400, 
        damping: 10,
        duration: 0.3
      }
    },
    tap: { 
      scale: 0.98,
      transition: { duration: 0.1 } 
    }
  };

  const mobileCardVariants = {
    hidden: { opacity: 0, x: -30, scale: 0.95 },
    visible: (i) => ({
      opacity: 1,
      x: 0,
      scale: 1,
      transition: {
        delay: i * 0.15 + 0.3,
        duration: 0.7,
        ease: [0.22, 1, 0.36, 1],
        type: "spring",
        stiffness: 300,
        damping: 15
      }
    }),
    tap: { 
      scale: 0.96,
      transition: { 
        type: "spring",
        stiffness: 500,
        damping: 20,
        duration: 0.15
      } 
    }
  };

  const mobileHeaderVariants = {
    hidden: { opacity: 0, y: -20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        delay: 0.2,
        duration: 0.6,
        ease: [0.22, 1, 0.36, 1]
      }
    }
  };

  const mobileFeatureItemVariants = {
    hidden: { opacity: 0, x: -10 },
    visible: (i) => ({
      opacity: 1,
      x: 0,
      transition: {
        delay: i * 0.05 + 0.5,
        duration: 0.5,
        ease: [0.22, 1, 0.36, 1]
      }
    }),
    tap: {
      scale: 0.98,
      transition: { duration: 0.1 }
    }
  };

  const mobileSuccessVariants = {
    hidden: { opacity: 0, scale: 0.8 },
    visible: {
      opacity: 1,
      scale: 1,
      transition: {
        type: "spring",
        stiffness: 300,
        damping: 15,
        duration: 0.7
      }
    }
  };

  const successCheckVariants = {
    hidden: { pathLength: 0, opacity: 0 },
    visible: {
      pathLength: 1,
      opacity: 1,
      transition: {
        duration: 0.8,
        ease: [0.22, 1, 0.36, 1]
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
    }, 1500);
  };

  return (
    <AnimatePresence>
      <motion.div
        key="backdrop"
        initial="hidden"
        animate="visible"
        exit="exit"
        variants={backdropVariants}
        className={`fixed inset-0 z-50 flex flex-col ${darkMode ? "bg-gray-900/95" : "bg-white/95"}`}
      >
        <div className="w-full fixed top-0 z-50">
          <Header darkMode={darkMode} />
        </div>
        
        <div className="flex-1 overflow-y-auto pt-16 pb-4">
          <motion.div
            key="modal"
            variants={modalVariants}
            className={`relative rounded-xl shadow-2xl w-full mx-auto overflow-hidden ${
              darkMode ? "bg-gray-800 text-gray-100" : "bg-white text-gray-800"
            }`}
            style={{ 
              maxWidth: "min(90vw, 1200px)",
              marginTop: "2rem",
              marginBottom: "2rem"
            }}
          >
            <motion.button
              onClick={handleClose}
              whileHover={{ scale: 1.1, rotate: 90 }}
              whileTap={{ scale: 0.95 }}
              className={`absolute top-4 right-4 p-2 rounded-full ${
                darkMode ? "hover:bg-gray-700" : "hover:bg-gray-200"
              } transition z-50`}
              aria-label="Close subscription modal"
            >
              <FiX className="text-xl" />
            </motion.button>

            <div className="p-4 sm:p-6 md:p-8 overflow-y-auto">
              {!isSuccess ? (
                <>
                  <motion.div 
                    className="text-center mb-6 md:mb-8"
                    variants={isMobile ? mobileHeaderVariants : {}}
                  >
                    <motion.h2
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ 
                        delay: isMobile ? 0.3 : 0.2, 
                        type: "spring",
                        stiffness: isMobile ? 350 : 300
                      }}
                      className="text-2xl md:text-3xl font-bold mb-2"
                    >
                      Choose Your Plan
                    </motion.h2>
                    <motion.p
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ 
                        delay: isMobile ? 0.5 : 0.4,
                        ease: [0.22, 1, 0.36, 1]
                      }}
                      className={`max-w-lg mx-auto ${
                        darkMode ? "text-gray-400" : "text-gray-600"
                      } text-sm md:text-base`}
                    >
                      Get access to premium features with our credit-based subscription
                      plans.
                    </motion.p>
                  </motion.div>

                  {!selectedPlan ? (
                    <motion.div 
                      className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6 mb-8"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 0.2 }}
                    >
                      {plans.map((plan, i) => (
                        <motion.div
                          key={plan.id}
                          custom={i}
                          initial="hidden"
                          animate="visible"
                          whileHover={!isMobile ? "hover" : undefined}
                          whileTap={isMobile ? "tap" : undefined}
                          variants={isMobile ? mobileCardVariants : cardVariants}
                          className={`relative rounded-lg border-2 p-4 md:p-6 ${
                            plan.popular
                              ? "border-teal-500 shadow-lg shadow-teal-500/10"
                              : darkMode
                              ? "border-gray-700"
                              : "border-gray-300"
                          } ${
                            darkMode ? "bg-gray-900" : "bg-gray-50"
                          } transition-all duration-300 flex flex-col`}
                        >
                          {plan.popular && (
                            <motion.div 
                              initial={{ scale: 0.8, opacity: 0 }}
                              animate={{ scale: 1, opacity: 1 }}
                              transition={{ 
                                delay: i * 0.15 + 0.5,
                                type: "spring",
                                stiffness: 400
                              }}
                              className="absolute top-0 right-4 transform -translate-y-1/2 bg-amber-400 text-gray-900 text-xs font-bold px-3 py-1 rounded-full flex items-center"
                            >
                              <FiStar className="mr-1" /> POPULAR
                            </motion.div>
                          )}
                          <div className="flex-grow">
                            <h3 className="text-lg md:text-xl font-bold mb-2">{plan.name}</h3>
                            <div className="mb-3 md:mb-4">
                              <span className="text-2xl md:text-3xl font-bold">{plan.price}</span>
                              <span
                                className={`text-sm ${
                                  darkMode ? "text-gray-400" : "text-gray-600"
                                }`}
                              >
                                /month
                              </span>
                            </div>
                            <div className="mb-4 md:mb-6">
                              <span className="text-xl md:text-2xl font-bold text-teal-500">
                                {plan.credits}
                              </span>{" "}
                              <span
                                className={`text-sm ${
                                  darkMode ? "text-gray-400" : "text-gray-600"
                                }`}
                              >
                                credits
                              </span>
                            </div>
                            <ul className="space-y-2 md:space-y-3 mb-4 md:mb-6">
                              {plan.features.map((feature, j) => (
                                <motion.li 
                                  key={feature} 
                                  custom={j}
                                  variants={isMobile ? mobileFeatureItemVariants : {}}
                                  className="flex items-start"
                                  whileHover={!isMobile ? { x: 5 } : undefined}
                                  whileTap={isMobile ? "tap" : undefined}
                                  transition={{ 
                                    type: "spring", 
                                    stiffness: isMobile ? 400 : 300 
                                  }}
                                >
                                  <FiCheck className="text-teal-500 mt-0.5 mr-2 flex-shrink-0" />
                                  <span className="text-sm md:text-base">{feature}</span>
                                </motion.li>
                              ))}
                            </ul>
                          </div>
                          <motion.button
                            onClick={() => setSelectedPlan(plan)}
                            whileHover={!isMobile ? { scale: 1.03 } : undefined}
                            whileTap={{ 
                              scale: isMobile ? 0.96 : 0.98,
                              transition: { 
                                type: "spring",
                                stiffness: isMobile ? 500 : 400,
                                damping: isMobile ? 20 : 10
                              }
                            }}
                            className={`w-full py-2 md:py-3 rounded-lg font-medium ${
                              plan.popular
                                ? "bg-teal-600 hover:bg-teal-500 text-white"
                                : darkMode
                                ? "bg-gray-700 hover:bg-gray-600 text-white"
                                : "bg-gray-200 hover:bg-gray-300 text-gray-800"
                            } transition text-sm md:text-base`}
                          >
                            Select Plan
                          </motion.button>
                        </motion.div>
                      ))}
                    </motion.div>
                  ) : (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ duration: 0.5 }}
                      className="max-w-2xl mx-auto"
                    >
                      <div className="flex flex-col sm:flex-row items-center justify-between mb-6 md:mb-8 gap-4">
                        <motion.button
                          onClick={() => setSelectedPlan(null)}
                          whileHover={{ x: -3 }}
                          whileTap={{ scale: 0.95 }}
                          className={`flex items-center text-sm md:text-base ${
                            darkMode ? "text-teal-400" : "text-teal-600"
                          }`}
                        >
                          <FiArrowRight className="transform rotate-180 mr-1" /> Back
                          to plans
                        </motion.button>
                        <div
                          className={`px-3 py-1 md:px-4 md:py-2 rounded-full text-sm md:text-base ${
                            darkMode ? "bg-gray-700" : "bg-gray-200"
                          }`}
                        >
                          Selected: {selectedPlan.name} Plan
                        </div>
                      </div>

                      <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                        className={`bg-opacity-20 ${
                          darkMode ? "bg-teal-900" : "bg-teal-200"
                        } rounded-lg p-4 md:p-6 mb-6 md:mb-8`}
                      >
                        <h4 className="font-bold mb-3 text-lg">Order Summary</h4>
                        <div className="space-y-2">
                          <div className="flex justify-between">
                            <span
                              className={`${
                                darkMode ? "text-gray-400" : "text-gray-600"
                              }`}
                            >
                              Plan
                            </span>
                            <span>{selectedPlan.name}</span>
                          </div>
                          <div className="flex justify-between">
                            <span
                              className={`${
                                darkMode ? "text-gray-400" : "text-gray-600"
                              }`}
                            >
                              Credits
                            </span>
                            <span>{selectedPlan.credits}/month</span>
                          </div>
                          <div className="border-t border-gray-500 border-opacity-30 my-2"></div>
                          <div className="flex justify-between font-bold text-lg">
                            <span>Total</span>
                            <span>{selectedPlan.price}/month</span>
                          </div>
                        </div>
                      </motion.div>

                      <motion.button
                        onClick={handleSubscribe}
                        disabled={isLoading}
                        whileHover={!isLoading ? { scale: 1.02 } : {}}
                        whileTap={!isLoading ? { scale: 0.98 } : {}}
                        className={`w-full py-3 rounded-lg font-medium bg-teal-600 hover:bg-teal-500 text-white transition flex items-center justify-center ${
                          isLoading ? "opacity-75 cursor-not-allowed" : ""
                        }`}
                      >
                        {isLoading ? (
                          <motion.div
                            animate={{ rotate: 360 }}
                            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                            className="w-5 h-5 border-2 border-white border-t-transparent rounded-full"
                          />
                        ) : (
                          <>
                            Subscribe Now <FiArrowRight className="ml-2" />
                          </>
                        )}
                      </motion.button>
                    </motion.div>
                  )}
                </>
              ) : (
                <motion.div
                  initial="hidden"
                  animate="visible"
                  variants={isMobile ? mobileSuccessVariants : {}}
                  className="max-w-md mx-auto text-center py-8 md:py-12"
                >
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{
                      scale: [1, 1.1, 1],
                      rotate: [0, 10, -10, 0],
                    }}
                    transition={{ 
                      duration: 0.8, 
                      type: "spring",
                      stiffness: isMobile ? 350 : 300,
                      damping: isMobile ? 15 : 10
                    }}
                    className="w-16 h-16 md:w-20 md:h-20 bg-teal-600 rounded-full flex items-center justify-center mx-auto mb-6"
                  >
                    <svg
                      width="32"
                      height="32"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <motion.path
                        d="M20 6L9 17l-5-5"
                        variants={successCheckVariants}
                        initial="hidden"
                        animate="visible"
                        stroke="white"
                      />
                    </svg>
                  </motion.div>
                  <motion.h3 
                    className="text-xl md:text-2xl font-bold mb-4"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: isMobile ? 0.3 : 0.2 }}
                  >
                    Subscription Successful!
                  </motion.h3>
                  <motion.p
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: isMobile ? 0.5 : 0.4 }}
                    className={`mb-6 md:mb-8 text-sm md:text-base ${
                      darkMode ? "text-gray-400" : "text-gray-600"
                    }`}
                  >
                    You've successfully subscribed to the {selectedPlan.name} Plan.
                    You now have {selectedPlan.credits} credits available.
                  </motion.p>
                  <motion.button
                    onClick={handleClose}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ 
                      scale: 0.95,
                      transition: { 
                        type: "spring",
                        stiffness: isMobile ? 500 : 400,
                        damping: isMobile ? 20 : 15
                      }
                    }}
                    className={`px-6 py-3 rounded-lg font-medium bg-teal-600 hover:bg-teal-500 text-white transition text-sm md:text-base`}
                  >
                    Start Using Credits
                  </motion.button>
                </motion.div>
              )}
            </div>
          </motion.div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
};

export default SubscriptionPlans;