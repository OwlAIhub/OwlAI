import React from "react";
import Questionnaire from "./questionnaire";

const AuthPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-teal-50 to-emerald-50 dark:from-gray-900 dark:to-gray-800">
      <div className="container mx-auto px-4 py-8">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
            Welcome to Owl AI
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-400">
            Let&apos;s get to know you better to personalize your learning
            experience
          </p>
        </div>

        <Questionnaire />
      </div>
    </div>
  );
};

export default AuthPage;
