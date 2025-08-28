import React from "react";
import owlLogo from "@/assets/owl-ai-logo.png";

interface StarterPrompt {
  id: string;
  title: string;
  description: string;
  prompt: string;
  icon: React.ReactNode;
  gradient: string;
}

interface ChatStarterProps {
  onPromptSelect: (prompt: string) => void;
}

const starterPrompts: StarterPrompt[] = [
  {
    id: "teaching-definition",
    title: "",
    description: "",
    prompt: "What is the meaning of Teaching?",
    icon: <></>,
    gradient: "from-blue-500 to-blue-600",
  },
  {
    id: "research-meaning",
    title: "",
    description: "",
    prompt: "What is the fundamental meaning of Research?",
    icon: <></>,
    gradient: "from-green-500 to-green-600",
  },
  {
    id: "logical-reasoning-definition",
    title: "",
    description: "",
    prompt: "What is Logical Reasoning and why is it important?",
    icon: <></>,
    gradient: "from-purple-500 to-purple-600",
  },
  {
    id: "communication-essence",
    title: "",
    description: "",
    prompt: "What is the essence of effective Communication?",
    icon: <></>,
    gradient: "from-orange-500 to-orange-600",
  },
];

export const ChatStarter: React.FC<ChatStarterProps> = ({ onPromptSelect }) => {
  return (
    <div className="flex-1 flex flex-col items-center justify-center p-6 max-w-3xl mx-auto">
      {/* Minimal Logo and Welcome */}
      <div className="text-center mb-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
        <div className="w-12 h-12 mx-auto mb-4 bg-gradient-to-br from-teal-500/90 to-teal-600/90 flex items-center justify-center rounded-2xl shadow-sm border border-white/10">
          <img
            src={owlLogo}
            alt="OwlAI Logo"
            className="w-7 h-7 object-contain filter brightness-110"
          />
        </div>

        <h1 className="text-2xl font-semibold text-foreground mb-2 tracking-tight">
          Welcome to{" "}
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-teal-500 to-teal-600">
            OwlAI
          </span>
        </h1>

        <p className="text-sm text-muted-foreground/80 max-w-md mx-auto">
          Choose a starting point or ask me anything
        </p>
      </div>

      {/* Modern Starter Prompts */}
      <div className="w-full max-w-5xl">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {starterPrompts.map((prompt, index) => (
            <div
              key={prompt.id}
              className="group cursor-pointer relative overflow-hidden rounded-xl border border-gray-300 bg-white/80 hover:border-teal-300 hover:bg-white transition-all duration-200 shadow-sm hover:shadow-md hover:shadow-teal-500/10 animate-in fade-in slide-in-from-bottom-2 hover:-translate-y-1"
              style={{
                animationDelay: `${index * 80}ms`,
                animationFillMode: "both",
              }}
              onClick={() => onPromptSelect(prompt.prompt)}
            >
              {/* Subtle gradient overlay */}
              <div className="absolute inset-0 bg-gradient-to-br from-transparent to-teal-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-200" />

              <div className="relative p-5">
                <p className="text-sm font-medium text-gray-700 group-hover:text-teal-600 transition-colors duration-200 leading-relaxed text-center">
                  {prompt.prompt}
                </p>
              </div>

              {/* Subtle accent line */}
              <div className="absolute bottom-0 left-0 w-full h-0.5 bg-gradient-to-r from-teal-400/0 via-teal-400 to-teal-400/0 scale-x-0 group-hover:scale-x-100 transition-transform duration-200" />
            </div>
          ))}
        </div>
      </div>

      {/* Subtle hint */}
      <div className="mt-6 text-center animate-in fade-in duration-700 delay-300">
        <p className="text-xs text-muted-foreground/50">
          Click a card or type below
        </p>
      </div>
    </div>
  );
};
