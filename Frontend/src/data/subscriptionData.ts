export interface Plan {
  id: string;
  name: string;
  price: string;
  features: string[];
  popular?: boolean;
}

export const subscriptionPlans: Plan[] = [
  {
    id: "free",
    name: "Free",
    price: "$0",
    features: [
      "5 questions per day",
      "Basic AI responses",
      "Standard support",
      "Access to basic features",
    ],
  },
  {
    id: "pro",
    name: "Pro",
    price: "$9.99",
    features: [
      "Unlimited questions",
      "Advanced AI responses",
      "Priority support",
      "Access to all features",
      "Custom study plans",
      "Progress tracking",
    ],
    popular: true,
  },
  {
    id: "premium",
    name: "Premium",
    price: "$19.99",
    features: [
      "Everything in Pro",
      "1-on-1 tutoring sessions",
      "Exam-specific preparation",
      "Advanced analytics",
      "Study group access",
      "Mobile app access",
    ],
  },
];

export const features = [
  {
    icon: "FiZap",
    title: "Lightning Fast",
    description: "Get instant responses to all your questions",
  },
  {
    icon: "FiShield",
    title: "Secure & Private",
    description: "Your data is protected with enterprise-grade security",
  },
  {
    icon: "FiClock",
    title: "24/7 Available",
    description: "Access your AI tutor anytime, anywhere",
  },
  {
    icon: "FiUsers",
    title: "Expert Support",
    description: "Get help from our dedicated support team",
  },
];

export const faqs = [
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
