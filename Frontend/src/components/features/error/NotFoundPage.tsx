import React, { useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import {
  Home,
  Search,
  ArrowLeft,
  RefreshCw,
  BookOpen,
  Brain,
  GraduationCap,
} from "lucide-react";
import Logo from "@/assets/owl_AI_logo.png";

export const NotFoundPage: React.FC = () => {
  const [isSearching, setIsSearching] = useState(false);

  const funnyMessages = [
    "Oops! This page stepped out for a quick revision.",
    "404: We couldn't find that page in the syllabus.",
    "Looks like this topic isn't in today's lesson.",
    "Page missing. Focus mode: re-routing you to better things.",
    "Lost in the notes? Let's get you back on track.",
  ];

  const randomMessage =
    funnyMessages[Math.floor(Math.random() * funnyMessages.length)];

  const handleSearch = () => {
    setIsSearching(true);
    setTimeout(() => setIsSearching(false), 2000);
  };

  return (
    <div className="min-h-screen bg-white relative overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        {/* Subtle grid pattern */}
        <div className="absolute inset-0 opacity-[0.04]">
          <div
            className="absolute inset-0"
            style={{
              backgroundImage: `radial-gradient(circle at 1px 1px, rgba(13,148,136,0.5) 1px, transparent 0)`,
              backgroundSize: "36px 36px",
            }}
          />
        </div>

        {/* Teal vector blobs (very subtle) */}
        <motion.div
          aria-hidden
          animate={{ y: [0, -10, 0] }}
          transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
          className="absolute -top-24 -left-24 w-[28rem] h-[28rem] bg-teal-100 rounded-full blur-3xl"
        />
        <motion.div
          aria-hidden
          animate={{ y: [0, 12, 0] }}
          transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
          className="absolute -bottom-24 -right-24 w-[28rem] h-[28rem] bg-teal-50 rounded-full blur-3xl"
        />
      </div>

      {/* Main Content */}
      <div className="relative z-10 min-h-screen flex items-center justify-center px-6">
        <div className="max-w-4xl mx-auto text-center">
          {/* Logo */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="mb-8"
          >
            <div className="flex items-center justify-center space-x-3 mb-6">
              <div className="w-12 h-12 bg-teal-600 rounded-xl flex items-center justify-center shadow-lg">
                <img src={Logo} alt="Owl AI" className="w-7 h-7" />
              </div>
              <span className="text-2xl font-bold text-gray-900">Owl AI</span>
            </div>
          </motion.div>

          {/* 404 Number */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="mb-8"
          >
            <div className="relative">
              <h1 className="text-8xl md:text-9xl font-bold bg-gradient-to-r from-teal-600 to-teal-500 bg-clip-text text-transparent">
                404
              </h1>
            </div>
          </motion.div>

          {/* Funny Message */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="mb-8"
          >
            <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-4">
              Page Not Found
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto leading-relaxed">
              {randomMessage}
            </p>
          </motion.div>

          {/* Clean vector illustration (teal/gray) */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
            className="mb-12"
          >
            <div className="relative w-[320px] h-[220px] mx-auto">
              <svg
                viewBox="0 0 320 220"
                xmlns="http://www.w3.org/2000/svg"
                className="w-full h-full"
                aria-hidden
              >
                {/* Paper */}
                <rect
                  x="40"
                  y="30"
                  width="180"
                  height="140"
                  rx="12"
                  fill="#ffffff"
                  stroke="#e5e7eb"
                />
                {/* Lines */}
                <g stroke="#e5e7eb">
                  <line x1="60" y1="60" x2="200" y2="60" />
                  <line x1="60" y1="85" x2="200" y2="85" />
                  <line x1="60" y1="110" x2="200" y2="110" />
                </g>
                {/* 404 Text */}
                <text
                  x="70"
                  y="145"
                  fontSize="32"
                  fontWeight="700"
                  fill="#0f766e"
                >
                  404
                </text>
                {/* Magnifying glass */}
                <g transform="translate(200,110)">
                  <circle
                    cx="0"
                    cy="0"
                    r="28"
                    fill="none"
                    stroke="#14b8a6"
                    strokeWidth="4"
                  />
                  <line
                    x1="20"
                    y1="20"
                    x2="42"
                    y2="42"
                    stroke="#14b8a6"
                    strokeWidth="5"
                    strokeLinecap="round"
                  />
                </g>
                {/* Subtle dotted accents */}
                <g fill="#99f6e4">
                  <circle cx="260" cy="40" r="3" />
                  <circle cx="275" cy="55" r="3" />
                  <circle cx="260" cy="70" r="3" />
                </g>
              </svg>
            </div>
          </motion.div>

          {/* Action Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.8 }}
            className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-8"
          >
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="flex items-center space-x-2 bg-gradient-to-r from-teal-500 to-teal-600 text-white px-6 py-3 rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all duration-300"
              onClick={() => window.history.back()}
            >
              <ArrowLeft className="w-5 h-5" />
              <span>Go Back</span>
            </motion.button>

            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="flex items-center space-x-2 bg-white text-gray-700 px-6 py-3 rounded-xl font-semibold shadow-lg hover:shadow-xl border border-gray-200 transition-all duration-300"
              onClick={handleSearch}
            >
              {isSearching ? (
                <RefreshCw className="w-5 h-5 animate-spin" />
              ) : (
                <Search className="w-5 h-5" />
              )}
              <span>{isSearching ? "Searching..." : "Search Page"}</span>
            </motion.button>

            <Link to="/OwlAi">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="flex items-center space-x-2 bg-teal-600 hover:bg-teal-700 text-white px-6 py-3 rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all duration-300"
              >
                <Home className="w-5 h-5" />
                <span>Go Home</span>
              </motion.button>
            </Link>
          </motion.div>

          {/* Quick Links */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 1 }}
            className="grid grid-cols-1 md:grid-cols-3 gap-4 max-w-2xl mx-auto"
          >
            <motion.div
              whileHover={{ y: -5 }}
              className="bg-white/80 backdrop-blur-sm rounded-xl p-4 shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-100"
            >
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-teal-100 rounded-lg flex items-center justify-center">
                  <BookOpen className="w-5 h-5 text-teal-600" />
                </div>
                <div className="text-left">
                  <h3 className="font-semibold text-gray-900">
                    Study Materials
                  </h3>
                  <p className="text-sm text-gray-600">Access your courses</p>
                </div>
              </div>
            </motion.div>

            <motion.div
              whileHover={{ y: -5 }}
              className="bg-white/80 backdrop-blur-sm rounded-xl p-4 shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-100"
            >
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                  <Brain className="w-5 h-5 text-blue-600" />
                </div>
                <div className="text-left">
                  <h3 className="font-semibold text-gray-900">AI Chat</h3>
                  <p className="text-sm text-gray-600">Ask questions</p>
                </div>
              </div>
            </motion.div>

            <motion.div
              whileHover={{ y: -5 }}
              className="bg-white/80 backdrop-blur-sm rounded-xl p-4 shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-100"
            >
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                  <GraduationCap className="w-5 h-5 text-purple-600" />
                </div>
                <div className="text-left">
                  <h3 className="font-semibold text-gray-900">Exams</h3>
                  <p className="text-sm text-gray-600">Practice tests</p>
                </div>
              </div>
            </motion.div>
          </motion.div>

          {/* Footer note */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 1.2 }}
            className="mt-12 text-center"
          >
            <p className="text-gray-500 text-sm max-w-md mx-auto">
              The page you’re looking for doesn’t exist. Let’s guide you back to
              the right path.
            </p>
          </motion.div>
        </div>
      </div>
    </div>
  );
};
