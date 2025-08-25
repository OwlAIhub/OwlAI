import React, { useState } from "react";
import { motion } from "framer-motion";
import { IconCheck, IconCrown, IconStar, IconBolt } from "@tabler/icons-react";

const plans = [
  {
    name: "Free",
    price: "₹0",
    period: "forever",
    description: "Perfect for getting started with AI learning",
    features: [
      "5 questions per day",
      "Basic AI responses",
      "Access to study materials",
      "Community support",
      "Mobile app access",
    ],
    icon: <IconStar className="w-5 h-5" />,
    gradient: "from-gray-500 to-gray-600",
    bgGradient: "from-gray-50 to-gray-100",
    popular: false,
    buttonText: "Get Started Free",
    buttonStyle: "bg-gray-600 hover:bg-gray-700",
  },
  {
    name: "Pro",
    price: "₹499",
    period: "per month",
    description: "Most popular choice for serious students",
    features: [
      "Unlimited questions",
      "Advanced AI responses",
      "Priority support",
      "Practice tests & mock exams",
      "Performance analytics",
      "Multi-language support",
      "Download study materials",
      "24/7 AI assistance",
    ],
    icon: <IconCrown className="w-5 h-5" />,
    gradient: "from-teal-500 to-teal-600",
    bgGradient: "from-teal-50 to-teal-100",
    popular: true,
    buttonText: "Start Pro Trial",
    buttonStyle:
      "bg-gradient-to-r from-teal-500 to-teal-600 hover:from-teal-600 hover:to-teal-700",
  },
  {
    name: "Premium",
    price: "₹999",
    period: "per month",
    description: "Complete exam preparation solution",
    features: [
      "Everything in Pro",
      "Personal AI tutor",
      "Custom study plans",
      "Live doubt sessions",
      "Exam strategy coaching",
      "Progress tracking",
      "Priority customer support",
      "Early access to features",
    ],
    icon: <IconBolt className="w-5 h-5" />,
    gradient: "from-black to-gray-800",
    bgGradient: "from-gray-50 to-gray-100",
    popular: false,
    buttonText: "Go Premium",
    buttonStyle:
      "bg-gradient-to-r from-black to-gray-800 hover:from-gray-800 hover:to-gray-900",
  },
];

export const PricingSection: React.FC = () => {
  const [billingCycle, setBillingCycle] = useState<"monthly" | "yearly">(
    "monthly"
  );

  const getPrice = (basePrice: string) => {
    if (billingCycle === "yearly") {
      const price = parseInt(basePrice.replace("₹", ""));
      const yearlyPrice = Math.round(price * 10); // 2 months free
      return `₹${yearlyPrice}`;
    }
    return basePrice;
  };

  const getPeriod = () => {
    return billingCycle === "yearly" ? "per year" : "per month";
  };

  return (
    <section id="pricing" className="py-20 bg-white">
      <div className="container mx-auto px-6">
        {/* Header Section */}
        <div className="text-center mb-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="inline-flex items-center space-x-2 bg-teal-50 px-3 py-1.5 rounded-full border border-teal-200 mb-4"
          >
            <IconCrown className="text-teal-600 w-3 h-3" />
            <span className="text-teal-700 text-xs font-medium">
              Choose Your Plan
            </span>
          </motion.div>

          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-3xl md:text-4xl font-bold text-gray-900 mb-4"
          >
            Simple{" "}
            <span className="relative inline-block">
              <span className="bg-gradient-to-r from-teal-500 to-teal-700 bg-clip-text text-transparent">
                Pricing
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
            Choose the perfect plan for your exam preparation journey. Start
            free and upgrade as you grow.
          </motion.p>

          {/* Billing Toggle */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="flex items-center justify-center space-x-4 mt-8"
          >
            <span
              className={`text-sm font-medium ${
                billingCycle === "monthly" ? "text-gray-900" : "text-gray-500"
              }`}
            >
              Monthly
            </span>
            <button
              onClick={() =>
                setBillingCycle(
                  billingCycle === "monthly" ? "yearly" : "monthly"
                )
              }
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors duration-200 ${
                billingCycle === "yearly" ? "bg-teal-600" : "bg-gray-200"
              }`}
            >
              <span
                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform duration-200 ${
                  billingCycle === "yearly" ? "translate-x-6" : "translate-x-1"
                }`}
              />
            </button>
            <span
              className={`text-sm font-medium ${
                billingCycle === "yearly" ? "text-gray-900" : "text-gray-500"
              }`}
            >
              Yearly
              <span className="ml-1 text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded-full">
                Save 20%
              </span>
            </span>
          </motion.div>
        </div>

        {/* Pricing Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto mb-16">
          {plans.map((plan, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              className={`relative group ${
                plan.popular ? "md:-mt-4 md:mb-4" : ""
              }`}
            >
              {plan.popular && (
                <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                  <span className="bg-gradient-to-r from-teal-500 to-teal-600 text-white text-xs font-semibold px-4 py-2 rounded-full shadow-lg">
                    Most Popular
                  </span>
                </div>
              )}

              <div
                className={`bg-white rounded-2xl border-2 transition-all duration-300 h-full flex flex-col ${
                  plan.popular
                    ? "border-teal-200 shadow-xl shadow-teal-50/50"
                    : "border-gray-100 hover:border-gray-200 hover:shadow-lg"
                }`}
              >
                {/* Header */}
                <div className="p-8 border-b border-gray-100">
                  <div className="flex items-center justify-between mb-4">
                    <div
                      className={`w-12 h-12 bg-gradient-to-r ${plan.gradient} rounded-xl flex items-center justify-center text-white shadow-lg`}
                    >
                      {plan.icon}
                    </div>
                    {plan.popular && (
                      <div className="text-teal-600 text-sm font-semibold">
                        BEST VALUE
                      </div>
                    )}
                  </div>

                  <h3 className="text-2xl font-bold text-gray-900 mb-2">
                    {plan.name}
                  </h3>
                  <p className="text-gray-600 text-sm mb-6">
                    {plan.description}
                  </p>

                  <div className="flex items-baseline">
                    <span className="text-4xl font-bold text-gray-900">
                      {getPrice(plan.price)}
                    </span>
                    <span className="text-gray-500 ml-2">/{getPeriod()}</span>
                  </div>
                </div>

                {/* Features */}
                <div className="p-8 flex-grow">
                  <ul className="space-y-4">
                    {plan.features.map((feature, featureIndex) => (
                      <li
                        key={featureIndex}
                        className="flex items-start space-x-3"
                      >
                        <div
                          className={`w-5 h-5 bg-gradient-to-r ${plan.gradient} rounded-full flex items-center justify-center flex-shrink-0 mt-0.5`}
                        >
                          <IconCheck className="w-3 h-3 text-white" />
                        </div>
                        <span className="text-gray-700 text-sm">{feature}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Button */}
                <div className="p-8 pt-0">
                  <button
                    className={`w-full py-3 px-6 rounded-xl font-semibold text-white transition-all duration-300 shadow-lg hover:shadow-xl hover:scale-105 ${plan.buttonStyle}`}
                  >
                    {plan.buttonText}
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Bottom CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.6 }}
          className="text-center mt-16"
        >
          <div className="bg-gradient-to-r from-teal-50 to-cyan-50 rounded-2xl p-8 border border-teal-100 max-w-4xl mx-auto relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-teal-100/30 to-transparent rounded-full -translate-y-16 translate-x-16"></div>

            <div className="relative z-10">
              <h3 className="text-2xl font-bold text-gray-900 mb-4">
                Ready to Start Your Success Journey?
              </h3>
              <p className="text-gray-600 mb-6 max-w-2xl mx-auto text-base">
                Join thousands of students who have already transformed their
                exam preparation with Owl AI. Start your free trial today!
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <button className="bg-gradient-to-r from-teal-500 to-teal-600 text-white px-8 py-3 rounded-xl font-semibold hover:from-teal-600 hover:to-teal-700 transition-all duration-300 shadow-lg hover:shadow-xl hover:scale-105">
                  Start Free Trial
                </button>
                <button className="border-2 border-teal-500 text-teal-600 px-8 py-3 rounded-xl font-semibold hover:bg-teal-50 transition-all duration-300">
                  View All Plans
                </button>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};
