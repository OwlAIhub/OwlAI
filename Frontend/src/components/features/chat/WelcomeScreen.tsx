import React from 'react';
import { User } from '@/types';
import { Button } from '@/components/ui/button';
import OwlLogo from '@/assets/owlMascot.png';
import { PREDEFINED_PROMPTS } from '@/constants';
import { dateUtils } from '@/utils';

interface WelcomeScreenProps {
  darkMode: boolean;
  isLoggedIn: boolean;
  user?: User | null;
  windowSize: { width: number; height: number };
  onPromptClick: (prompt: string) => void;
}

export const WelcomeScreen: React.FC<WelcomeScreenProps> = ({
  darkMode,
  isLoggedIn,
  user,
  windowSize,
  onPromptClick,
}) => {
  const getLogoContainerStyle = () => {
    if (windowSize.width < 768) {
      return {
        marginBottom: "1rem",
        maxWidth: "90%",
      };
    } else {
      return {
        marginTop: "2rem",
        marginBottom: "0.5rem",
        maxWidth: "28rem",
      };
    }
  };

  return (
    <div className="text-center space-y-6 px-4">
      {/* Logged in user greeting */}
      {isLoggedIn ? (
        <>
          <h1 className={`text-3xl md:text-4xl font-bold ${darkMode ? "text-white" : "text-gray-900"}`}>
            {dateUtils.getGreeting()}, {user?.firstName || "there"}!
          </h1>
          <p className={`text-lg ${darkMode ? "text-gray-300" : "text-gray-600"}`}>
            Let's prepare together and make today productive.
          </p>
        </>
      ) : (
        <>
          {/* Anonymous user welcome */}
          <div className="flex justify-center items-center" style={getLogoContainerStyle()}>
            <img src={OwlLogo} alt="OwlAI Mascot" className="w-2/4" />
          </div>
          <div className="space-y-4 mt-2 md:mt-0">
            <h1 className={`text-2xl md:text-3xl font-bold ${darkMode ? "text-white" : "text-gray-900"}`}>
              How may I help you?
            </h1>
            <p className={`text-base md:text-lg ${darkMode ? "text-gray-300" : "text-gray-600"}`}>
              Start your preparation with OwlAI and unlock your potential!
            </p>
          </div>
        </>
      )}

      {/* Predefined prompts */}
      <div className={`max-w-3xl mx-auto mt-20 ${darkMode ? "text-gray-300" : "text-gray-600"}`}>
        <h3 className="text-lg font-medium mb-3">Try asking me:</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {PREDEFINED_PROMPTS.map((prompt, index) => (
            <Button
              key={index}
              variant="outline"
              onClick={() => onPromptClick(prompt)}
              className={`p-3 h-auto text-left transition-all hover:scale-[1.02] cursor-pointer ${
                darkMode 
                  ? "bg-gray-800 hover:bg-gray-700 border-gray-700 text-gray-300" 
                  : "bg-white hover:bg-gray-100 border-gray-200 text-gray-600"
              }`}
            >
              {prompt}
            </Button>
          ))}
        </div>
      </div>
    </div>
  );
};
