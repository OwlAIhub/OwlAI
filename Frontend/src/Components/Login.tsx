import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import {
  Eye,
  EyeOff,
  Mail,
  Lock,
  Github,
  ArrowRight,
  ArrowLeft,
} from "lucide-react";
import Logo from "@/assets/owl_AI_logo.png";

export default function Login() {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    // Simulate API call
    setTimeout(() => {
      const userData = {
        uid: "demo-user-id",
        firstName: "Demo",
        lastName: "User",
        email: formData.email || "demo@example.com",
        plan: "Pro",
      };
      localStorage.setItem("user", JSON.stringify(userData));
      setIsLoading(false);

      // Dispatch auth state change event
      window.dispatchEvent(new CustomEvent("authStateChanged"));

      // Navigate to chat
      navigate("/chat", { replace: true });
    }, 1500);
  };

  const handleGuestLogin = () => {
    const userData = {
      uid: "guest-user-id",
      firstName: "Guest",
      lastName: "User",
      email: "guest@example.com",
      plan: "Free",
    };
    localStorage.setItem("user", JSON.stringify(userData));

    // Dispatch auth state change event
    window.dispatchEvent(new CustomEvent("authStateChanged"));

    navigate("/chat", { replace: true });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50 flex">
      {/* Left Side - Auth Form */}
      <div className="flex-1 flex flex-col justify-center px-6 sm:px-12 lg:px-16 xl:px-24">
        <div className="max-w-md w-full mx-auto">
          {/* Back Button */}
          <div className="mb-8">
            <Link
              to="/OwlAi"
              className="inline-flex items-center text-gray-600 hover:text-gray-900 transition-colors"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Home
            </Link>
          </div>

          {/* Header */}
          <div className="text-center mb-12">
            <h1 className="text-3xl font-bold text-gray-900 mb-3">
              Welcome back
            </h1>
            <p className="text-gray-600 text-base">
              Sign in to your Owl AI account to continue learning
            </p>
          </div>

          {/* Auth Form */}
          <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-8">
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Email Field */}
              <div className="space-y-2">
                <label
                  htmlFor="email"
                  className="text-sm font-medium text-gray-700"
                >
                  Email address
                </label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <input
                    id="email"
                    name="email"
                    type="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    placeholder="Enter your email"
                    className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all duration-200 bg-gray-50/50 text-gray-900 placeholder-gray-500"
                    required
                  />
                </div>
              </div>

              {/* Password Field */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <label
                    htmlFor="password"
                    className="text-sm font-medium text-gray-700"
                  >
                    Password
                  </label>
                  <Link
                    to="#"
                    className="text-sm text-teal-600 hover:text-teal-700 font-medium transition-colors"
                  >
                    Forgot password?
                  </Link>
                </div>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <input
                    id="password"
                    name="password"
                    type={showPassword ? "text" : "password"}
                    value={formData.password}
                    onChange={handleInputChange}
                    placeholder="Enter your password"
                    className="w-full pl-10 pr-12 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all duration-200 bg-gray-50/50 text-gray-900 placeholder-gray-500"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                  >
                    {showPassword ? (
                      <EyeOff className="w-5 h-5" />
                    ) : (
                      <Eye className="w-5 h-5" />
                    )}
                  </button>
                </div>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isLoading}
                className="w-full bg-gradient-to-r from-teal-600 to-teal-700 text-white font-semibold py-3 px-4 rounded-xl hover:from-teal-700 hover:to-teal-800 transition-all duration-200 transform hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none flex items-center justify-center space-x-2"
              >
                {isLoading ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    <span>Signing in...</span>
                  </>
                ) : (
                  <>
                    <span>Sign in</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </form>

            {/* Divider */}
            <div className="relative my-8">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-200"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-4 bg-white text-gray-500">
                  Or continue with
                </span>
              </div>
            </div>

            {/* Social Login */}
            <button
              onClick={handleGuestLogin}
              className="w-full bg-gray-900 text-white font-medium py-3 px-4 rounded-xl hover:bg-gray-800 transition-all duration-200 transform hover:scale-[1.02] flex items-center justify-center space-x-3"
            >
              <Github className="w-5 h-5" />
              <span>Continue with GitHub</span>
            </button>

            {/* Guest Login */}
            <button
              onClick={handleGuestLogin}
              className="w-full mt-4 bg-gray-100 text-gray-700 font-medium py-3 px-4 rounded-xl hover:bg-gray-200 transition-all duration-200 transform hover:scale-[1.02]"
            >
              Continue as Guest
            </button>

            {/* Sign Up Link */}
            <div className="text-center mt-8">
              <p className="text-gray-600 text-sm">
                Don&apos;t have an account?{" "}
                <Link
                  to="/signup"
                  className="text-teal-600 hover:text-teal-700 font-semibold transition-colors"
                >
                  Sign up for free
                </Link>
              </p>
            </div>
          </div>

          {/* Demo Notice */}
          <div className="mt-6 text-center">
            <p className="text-xs text-gray-500">
              Demo mode - No real authentication required
            </p>
          </div>
        </div>
      </div>

      {/* Right Side - Image/Illustration */}
      <div className="hidden lg:block lg:w-1/2 bg-gradient-to-br from-teal-50 to-teal-100 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-teal-600/10 to-teal-700/10"></div>
        <div className="relative h-full flex items-center justify-center p-12">
          <div className="text-center max-w-md">
            <div className="w-24 h-24 bg-teal-600 rounded-3xl flex items-center justify-center mx-auto mb-8 shadow-2xl">
              <img src={Logo} alt="Owl AI" className="w-12 h-12" />
            </div>
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Your AI Learning Journey Starts Here
            </h2>
            <p className="text-gray-600 text-lg leading-relaxed">
              Experience personalized learning with our intelligent AI
              assistant. Get instant help with your studies, exams, and
              educational goals.
            </p>
            <div className="mt-8 flex items-center justify-center space-x-6 text-sm text-gray-500">
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-teal-500 rounded-full"></div>
                <span>24/7 AI Support</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-teal-500 rounded-full"></div>
                <span>Personalized Learning</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
