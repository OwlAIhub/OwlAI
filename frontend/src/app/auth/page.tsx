"use client";

import { PhoneAuthForm } from "@/components/auth/PhoneAuthForm";
import {
  ResponsiveContainer,
  ResponsiveImage,
} from "@/components/ui/responsive-container";
import { useAuth } from "@/lib/contexts/AuthContext";
import { motion } from "framer-motion";
import { ArrowLeft, LogIn, UserPlus } from "lucide-react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";

export default function AuthPage() {
  const { user, loading, authError } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();
  const [mode, setMode] = useState<"login" | "signup">("login");

  useEffect(() => {
    // Check URL parameter for mode
    const urlMode = searchParams.get("mode");
    if (urlMode === "signup" || urlMode === "login") {
      setMode(urlMode);
    }
  }, [searchParams]);

  useEffect(() => {
    // Only redirect if auth is fully loaded and user is definitely authenticated
    if (!loading && user) {
      console.log('User already authenticated, redirecting to chat...');
      router.push("/chat");
    }
  }, [user, loading, router]);

  // Show error if Firebase config failed
  if (authError) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen p-4">
        <div className="bg-red-50 border border-red-200 rounded-lg p-6 max-w-md text-center">
          <h2 className="text-red-800 font-semibold mb-2">Authentication Error</h2>
          <p className="text-red-600 text-sm mb-4">{authError}</p>
          <p className="text-gray-600 text-xs">Please check your Firebase configuration and try again.</p>
          <div className="mt-4 space-x-2">
            <button
              onClick={() => window.location.reload()}
              className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
            >
              Retry
            </button>
            <button
              onClick={() => router.push('/')}
              className="px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-700"
            >
              Go Home
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Show loading while auth state is being determined
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        <p className="ml-3 text-gray-600">Loading authentication...</p>
      </div>
    );
  }

  // Show loading if user state is still being determined
  if (user) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        <p className="ml-3 text-gray-600">Redirecting to chat...</p>
      </div>
    );
  }

  const toggleMode = () => {
    setMode(mode === "login" ? "signup" : "login");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-gray-100 to-gray-200 flex items-center justify-center p-4">
      {/* Background Pattern */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(0,0,0,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(0,0,0,0.03)_1px,transparent_1px)] bg-[size:20px_20px] md:bg-[size:30px_30px]" />

      {/* Decorative Blurs */}
      <div className="absolute top-1/4 left-1/4 w-32 h-32 md:w-64 md:h-64 bg-primary/3 rounded-full blur-2xl" />
      <div className="absolute bottom-1/4 right-1/4 w-32 h-32 md:w-64 md:h-64 bg-accent/3 rounded-full blur-2xl" />

      <ResponsiveContainer maxWidth="md" className="relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.2 }}
          className="w-full max-w-md mx-auto"
        >
          {/* Back Button */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.15, delay: 0.05 }}
            className="mb-6"
          >
            <Link
              href="/"
              className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              Back to Home
            </Link>
          </motion.div>

          {/* Auth Card */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.2, delay: 0.1 }}
            className="bg-white/95 backdrop-blur-md rounded-2xl shadow-xl border border-white/20 p-8"
          >
            {/* Mode Toggle */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.15, delay: 0.1 }}
              className="flex bg-gray-100 rounded-lg p-1 mb-8"
            >
              <button
                type="button"
                onClick={() => setMode("login")}
                className={`flex-1 flex items-center justify-center gap-2 py-2 px-4 rounded-md text-sm font-medium transition-all duration-200 ${
                  mode === "login"
                    ? "bg-white text-primary shadow-sm"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                <LogIn className="w-4 h-4" />
                Sign In
              </button>
              <button
                type="button"
                onClick={() => setMode("signup")}
                className={`flex-1 flex items-center justify-center gap-2 py-2 px-4 rounded-md text-sm font-medium transition-all duration-200 ${
                  mode === "signup"
                    ? "bg-white text-primary shadow-sm"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                <UserPlus className="w-4 h-4" />
                Sign Up
              </button>
            </motion.div>

            {/* Header */}
            <div className="text-center mb-8">
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.15, delay: 0.15 }}
                className="flex items-center justify-center mb-4"
              >
                <ResponsiveImage
                  src="/apple-touch-icon.png"
                  alt="Owl AI"
                  className="w-12 h-12"
                  loading="eager"
                />
              </motion.div>

              <motion.h1
                key={mode}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.15, delay: 0.2 }}
                className="text-2xl font-bold text-foreground mb-2"
              >
                {mode === "login" ? "Welcome Back" : "Create Account"}
              </motion.h1>

              <motion.p
                key={`${mode}-desc`}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.15, delay: 0.25 }}
                className="text-muted-foreground"
              >
                {mode === "login"
                  ? "Sign in to continue your learning journey"
                  : "Join thousands of learners and start your AI-powered study journey"}
              </motion.p>
            </div>

            {/* Phone Auth Form */}
            <motion.div
              key={`form-${mode}`}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.2, delay: 0.3 }}
            >
              <PhoneAuthForm mode={mode} />
            </motion.div>

            {/* Terms (only for signup) */}
            {mode === "signup" && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.15, delay: 0.35 }}
                className="mt-6 text-center"
              >
                <p className="text-xs text-muted-foreground">
                  By signing up, you agree to our{" "}
                  <Link
                    href="#"
                    className="text-primary hover:text-primary/80 font-medium"
                  >
                    Terms of Service
                  </Link>{" "}
                  and{" "}
                  <Link
                    href="#"
                    className="text-primary hover:text-primary/80 font-medium"
                  >
                    Privacy Policy
                  </Link>
                </p>
              </motion.div>
            )}

            {/* Footer */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.15, delay: 0.4 }}
              className="mt-8 text-center"
            >
              <p className="text-sm text-muted-foreground">
                {mode === "login" ? (
                  <>
                    Don&apos;t have an account?{" "}
                    <button
                      type="button"
                      onClick={toggleMode}
                      className="text-primary hover:text-primary/80 font-medium transition-colors"
                    >
                      Sign up
                    </button>
                  </>
                ) : (
                  <>
                    Already have an account?{" "}
                    <button
                      type="button"
                      onClick={toggleMode}
                      className="text-primary hover:text-primary/80 font-medium transition-colors"
                    >
                      Sign in
                    </button>
                  </>
                )}
              </p>
            </motion.div>
          </motion.div>
        </motion.div>
      </ResponsiveContainer>
    </div>
  );
}
