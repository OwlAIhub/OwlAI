import React, { useState, useEffect } from "react";
import OwlLogo from "../assets/owlMascot.png";

const studyTips = [
  "Start with high-weightage chapters. Let strategy guide your effort.",
  "Study in short, focused sessions—25 minutes of deep work beats 2 hours of distractions",
  "Use the 'Recall Method': Close your notes and try explaining the topic to yourself.",
  "Master concepts first, then practice MCQs. Understanding > Memorizing.",
  "Avoid multitasking—learn one topic well before moving to the next.",
  "Elimination is your best friend in MCQs—cut down the confusion.",
  "In exams, read the question twice. You'll find clues hiding in plain sight.",
  "One mock test a week > Panic two weeks before the exam.",
  "Stuck on a concept? Type 'Explain [topic]' and let OwlAI break it down.",
  "Every hour of prep today is a step closer to your goal tomorrow.",
  "Focus on progress, not perfection. You're doing better than you think.",
  "Remember, it's not about speed. It's about consistency.",
  "Small steps daily beat big leaps rarely.",
  "Before asking your friend... ask OwlAI.",
  "Tired of searching scattered notes? Just ask here.",
  "This isn't just a chat. It's your preparation partner."
];

const OwlLoader = ({ darkMode }) => {
  const [randomTip, setRandomTip] = useState("");

  useEffect(() => {
    // Select a random tip when component mounts
    const randomIndex = Math.floor(Math.random() * studyTips.length);
    setRandomTip(studyTips[randomIndex]);
    
    // Optional: Rotate tips if loader stays visible for a long time
    const interval = setInterval(() => {
      const newIndex = Math.floor(Math.random() * studyTips.length);
      setRandomTip(studyTips[newIndex]);
    }, 8000); // Change tip every 8 seconds
    
    return () => clearInterval(interval);
  }, []);

  return (
    <div className={`fixed inset-0 z-50 flex items-center justify-center ${
      darkMode 
        ? "bg-gradient-to-br from-gray-900 via-slate-900 to-gray-800" 
        : "bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50"
    }`}>
      {/* Animated background particles */}
      <div className="absolute inset-0 overflow-hidden">
        {[...Array(20)].map((_, i) => (
          <div
            key={i}
            className={`absolute rounded-full ${
              darkMode ? "bg-blue-400/20" : "bg-blue-300/30"
            }`}
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              width: `${Math.random() * 4 + 2}px`,
              height: `${Math.random() * 4 + 2}px`,
              animation: `float ${Math.random() * 3 + 2}s ease-in-out infinite`,
              animationDelay: `${Math.random() * 2}s`
            }}
          />
        ))}
      </div>

      {/* Main loader container */}
      <div className="relative">
        {/* Glassmorphism backdrop */}
        <div className={`absolute inset-0 rounded-3xl ${
          darkMode 
            ? "bg-white/5 backdrop-blur-xl border border-white/10" 
            : "bg-white/40 backdrop-blur-xl border border-white/20"
        } shadow-2xl`} 
        style={{
          transform: "scale(1.2)",
          zIndex: -1
        }} />

        {/* Content container */}
        <div className="relative px-12 py-16">
          {/* Rotating ring around owl */}
          <div className="relative w-40 h-40 mx-auto mb-8">
            {/* Outer rotating ring */}
            <div className={`absolute inset-0 rounded-full border-2 ${
              darkMode ? "border-blue-400/30" : "border-blue-500/30"
            }`}
            style={{
              animation: "spin 3s linear infinite",
              borderTopColor: darkMode ? "#60a5fa" : "#3b82f6"
            }} />
            
            {/* Inner pulsing ring */}
            <div className={`absolute inset-2 rounded-full border ${
              darkMode ? "border-purple-400/40" : "border-purple-500/40"
            }`}
            style={{
              animation: "pulse 2s ease-in-out infinite",
              borderTopColor: darkMode ? "#c084fc" : "#a855f7"
            }} />

            {/* Owl image with enhanced effects */}
            <div className="absolute inset-4 flex items-center justify-center">
              <div className={`relative w-24 h-24 rounded-full ${
                darkMode ? "bg-gradient-to-br from-blue-400/20 to-purple-400/20" : "bg-gradient-to-br from-blue-100 to-purple-100"
              } flex items-center justify-center p-3`}
              style={{
                animation: "breathe 2s ease-in-out infinite",
                boxShadow: darkMode 
                  ? "0 0 30px rgba(59, 130, 246, 0.3), 0 0 60px rgba(168, 85, 247, 0.2)" 
                  : "0 0 30px rgba(59, 130, 246, 0.2), 0 0 60px rgba(168, 85, 247, 0.1)"
              }}>
                <img 
                  src={OwlLogo} 
                  alt="Loading..." 
                  className={`w-full h-full object-contain transition-all duration-300 ${
                    darkMode ? "filter brightness-110 contrast-110" : "filter brightness-95 contrast-105"
                  }`}
                  style={{
                    animation: "owlFloat 3s ease-in-out infinite",
                    filter: darkMode 
                      ? "brightness(1.1) contrast(1.1) drop-shadow(0 0 10px rgba(59, 130, 246, 0.3))" 
                      : "brightness(0.95) contrast(1.05) drop-shadow(0 0 8px rgba(59, 130, 246, 0.2))"
                  }}
                />
              </div>
            </div>
          </div>

          {/* Enhanced loading text */}
          <div className="text-center">
            <div className={`text-2xl font-bold bg-gradient-to-r ${
              darkMode 
                ? "from-blue-400 via-purple-400 to-pink-400" 
                : "from-blue-600 via-purple-600 to-pink-600"
            } bg-clip-text text-transparent mb-3`}
            style={{
              animation: "shimmer 2s ease-in-out infinite"
            }}>
              Preparing Your Wisdom
            </div>
            
            <div className={`text-sm ${
              darkMode ? "text-gray-400" : "text-gray-600"
            } mb-6 font-medium tracking-wide max-w-xs mx-auto`}>
              {randomTip || "Loading study wisdom..."}
            </div>

            {/* Modern progress indicator */}
            <div className="relative w-64 h-1 mx-auto rounded-full overflow-hidden">
              <div className={`absolute inset-0 ${
                darkMode ? "bg-gray-700" : "bg-gray-200"
              } rounded-full`} />
              <div className={`absolute inset-0 bg-gradient-to-r ${
                darkMode 
                  ? "from-blue-400 via-purple-400 to-pink-400" 
                  : "from-blue-500 via-purple-500 to-pink-500"
              } rounded-full`}
              style={{
                animation: "progressWave 2s ease-in-out infinite",
                transformOrigin: "left center"
              }} />
            </div>

            {/* Floating dots */}
            <div className="flex justify-center space-x-2 mt-8">
              {[...Array(4)].map((_, i) => (
                <div
                  key={i}
                  className={`w-3 h-3 rounded-full bg-gradient-to-r ${
                    darkMode 
                      ? "from-blue-400 to-purple-400" 
                      : "from-blue-500 to-purple-500"
                  }`}
                  style={{
                    animation: `floatDot 1.5s ease-in-out infinite ${i * 0.15}s`,
                    boxShadow: darkMode 
                      ? "0 0 10px rgba(59, 130, 246, 0.5)" 
                      : "0 0 8px rgba(59, 130, 246, 0.3)"
                  }}
                />
              ))}
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
        @keyframes pulse {
          0%, 100% { transform: scale(1); opacity: 1; }
          50% { transform: scale(1.05); opacity: 0.8; }
        }
        @keyframes breathe {
          0%, 100% { transform: scale(1); }
          50% { transform: scale(1.1); }
        }
        @keyframes shimmer {
          0%, 100% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
        }
        @keyframes progressWave {
          0% { transform: scaleX(0); }
          50% { transform: scaleX(0.7); }
          100% { transform: scaleX(1); }
        }
        @keyframes floatDot {
          0%, 100% { transform: translateY(0px) scale(1); }
          50% { transform: translateY(-8px) scale(1.2); }
        }
        @keyframes owlFloat {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          25% { transform: translateY(-3px) rotate(1deg); }
          50% { transform: translateY(-5px) rotate(0deg); }
          75% { transform: translateY(-3px) rotate(-1deg); }
        }
        @keyframes float {
          0%, 100% { transform: translateY(0) translateX(0); }
          25% { transform: translateY(-5px) translateX(2px); }
          50% { transform: translateY(-10px) translateX(0); }
          75% { transform: translateY(-5px) translateX(-2px); }
        }
      `}</style>
    </div>
  );
};

export default OwlLoader;