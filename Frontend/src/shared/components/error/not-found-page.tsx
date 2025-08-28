import React from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Home, ArrowLeft } from "lucide-react";
import Logo from "@/assets/owl-ai-logo.png";

export const NotFoundPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white relative overflow-hidden">
      {/* Subtle background elements */}
      <div className="absolute inset-0">
        <div className="absolute top-20 left-20 w-32 h-32 bg-teal-100 rounded-full opacity-20 blur-xl animate-pulse"></div>
        <div className="absolute bottom-20 right-20 w-40 h-40 bg-blue-100 rounded-full opacity-20 blur-xl animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/4 w-24 h-24 bg-emerald-100 rounded-full opacity-15 blur-xl animate-pulse delay-500"></div>
      </div>

      <div className="relative z-10 min-h-screen flex items-center justify-center px-6">
        <div className="max-w-lg mx-auto text-center">
          {/* Logo */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="mb-8"
          >
            <div className="flex items-center justify-center space-x-3 mb-6">
              <div className="w-12 h-12 bg-gradient-to-br from-teal-500 to-teal-600 rounded-xl flex items-center justify-center shadow-lg">
                <img src={Logo} alt="Owl AI" className="w-7 h-7" />
              </div>
              <span className="text-2xl font-bold text-gray-900">Owl AI</span>
            </div>
          </motion.div>

          {/* 404 Number with decoration */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="mb-8 relative"
          >
            <div className="relative inline-block">
              <h1 className="text-8xl font-bold bg-gradient-to-r from-teal-600 via-blue-600 to-emerald-600 bg-clip-text text-transparent">
                404
              </h1>
              <div className="absolute -top-4 -right-4 w-8 h-8 bg-yellow-400 rounded-full opacity-80 animate-bounce"></div>
              <div className="absolute -bottom-2 -left-2 w-6 h-6 bg-pink-400 rounded-full opacity-70 animate-pulse"></div>
            </div>
          </motion.div>

          {/* Message */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="mb-10"
          >
            <h2 className="text-2xl font-bold text-gray-900 mb-3">
              Oops! Page Not Found
            </h2>
            <p className="text-gray-600 max-w-md mx-auto leading-relaxed">
              The page you&apos;re looking for seems to have wandered off.
              Don&apos;t worry, let&apos;s get you back on track!
            </p>
          </motion.div>

          {/* Simple illustration */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.5 }}
            className="mb-8"
          >
            <div className="w-48 h-32 mx-auto relative">
              <svg
                viewBox="0 0 200 120"
                className="w-full h-full"
                aria-hidden="true"
              >
                {/* Simple book/document */}
                <rect
                  x="60"
                  y="30"
                  width="80"
                  height="60"
                  rx="8"
                  fill="#f3f4f6"
                  stroke="#e5e7eb"
                  strokeWidth="2"
                />
                <line
                  x1="70"
                  y1="45"
                  x2="130"
                  y2="45"
                  stroke="#d1d5db"
                  strokeWidth="2"
                />
                <line
                  x1="70"
                  y1="55"
                  x2="125"
                  y2="55"
                  stroke="#d1d5db"
                  strokeWidth="2"
                />
                <line
                  x1="70"
                  y1="65"
                  x2="120"
                  y2="65"
                  stroke="#d1d5db"
                  strokeWidth="2"
                />

                {/* Question mark */}
                <circle cx="100" cy="75" r="15" fill="#14b8a6" opacity="0.1" />
                <text
                  x="100"
                  y="82"
                  textAnchor="middle"
                  fontSize="20"
                  fill="#14b8a6"
                  fontWeight="bold"
                >
                  ?
                </text>

                {/* Floating elements */}
                <circle cx="40" cy="40" r="3" fill="#fbbf24" opacity="0.7" />
                <circle cx="160" cy="50" r="4" fill="#ec4899" opacity="0.6" />
                <circle cx="170" cy="80" r="2" fill="#8b5cf6" opacity="0.8" />
              </svg>
            </div>
          </motion.div>

          {/* Action Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.6 }}
            className="flex flex-col sm:flex-row gap-4 justify-center"
          >
            <motion.button
              whileHover={{ scale: 1.05, y: -2 }}
              whileTap={{ scale: 0.95 }}
              className="flex items-center justify-center space-x-2 bg-gradient-to-r from-teal-500 to-teal-600 text-white px-8 py-3 rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all duration-300"
              onClick={() => window.history.back()}
            >
              <ArrowLeft className="w-5 h-5" />
              <span>Go Back</span>
            </motion.button>

            <Link to="/OwlAi">
              <motion.button
                whileHover={{ scale: 1.05, y: -2 }}
                whileTap={{ scale: 0.95 }}
                className="flex items-center justify-center space-x-2 bg-white text-gray-700 px-8 py-3 rounded-xl font-semibold shadow-lg hover:shadow-xl border border-gray-200 hover:bg-gray-50 transition-all duration-300"
              >
                <Home className="w-5 h-5" />
                <span>Go Home</span>
              </motion.button>
            </Link>
          </motion.div>

          {/* Footer message */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.8 }}
            className="mt-8"
          >
            <p className="text-gray-500 text-sm">
              Need help? Contact our support team
            </p>
          </motion.div>
        </div>
      </div>
    </div>
  );
};
