import React from "react";
import { Button } from "@/shared/components/ui/button";
import { Card, CardContent } from "@/shared/components/ui/card";
import { 
  GraduationCap, 
  BookOpen, 
  Brain, 
  Lightbulb,
  Sparkles 
} from "lucide-react";
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
    id: "study-help",
    title: "Study Help",
    description: "Get help with concepts and explanations",
    prompt: "Help me understand a complex topic I'm studying",
    icon: <GraduationCap className="h-5 w-5" />,
    gradient: "from-blue-500 to-blue-600"
  },
  {
    id: "exam-prep",
    title: "Exam Preparation", 
    description: "Practice questions and exam strategies",
    prompt: "Create practice questions for my upcoming exam",
    icon: <BookOpen className="h-5 w-5" />,
    gradient: "from-green-500 to-green-600"
  },
  {
    id: "concept-clarity",
    title: "Concept Clarity",
    description: "Break down difficult concepts simply",
    prompt: "Explain this concept in simple terms with examples",
    icon: <Brain className="h-5 w-5" />,
    gradient: "from-purple-500 to-purple-600"
  },
  {
    id: "quick-tips",
    title: "Study Tips",
    description: "Get effective learning strategies",
    prompt: "Give me study tips to improve my learning efficiency",
    icon: <Lightbulb className="h-5 w-5" />,
    gradient: "from-orange-500 to-orange-600"
  }
];

export const ChatStarter: React.FC<ChatStarterProps> = ({ onPromptSelect }) => {
  return (
    <div className="flex-1 flex flex-col items-center justify-center p-8 max-w-4xl mx-auto">
      {/* Logo and Welcome */}
      <div className="text-center mb-12 animate-in fade-in slide-in-from-bottom-8 duration-700">
        <div className="w-20 h-20 mx-auto mb-6 bg-gradient-to-br from-teal-500/95 to-teal-600/95 backdrop-blur-sm flex items-center justify-center rounded-3xl shadow-xl border border-white/10">
          <img
            src={owlLogo}
            alt="OwlAI Logo"
            className="w-12 h-12 object-contain filter brightness-110"
          />
        </div>
        
        <h1 className="text-4xl font-bold text-foreground mb-3 tracking-tight">
          Welcome to <span className="text-transparent bg-clip-text bg-gradient-to-r from-teal-500 to-teal-600">OwlAI</span>
        </h1>
        
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto leading-relaxed">
          Your intelligent study companion. Choose a starting point below or ask me anything to begin our conversation.
        </p>
      </div>

      {/* Starter Prompts */}
      <div className="w-full max-w-3xl">
        <div className="flex items-center justify-center mb-6">
          <div className="flex items-center space-x-2 text-sm text-muted-foreground bg-muted/30 px-4 py-2 rounded-full">
            <Sparkles className="h-4 w-4 text-teal-600" />
            <span>Quick Start</span>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {starterPrompts.map((prompt, index) => (
            <Card 
              key={prompt.id}
              className="group cursor-pointer border border-border/60 hover:border-teal-500/50 transition-all duration-300 hover:shadow-lg hover:shadow-teal-500/10 animate-in fade-in slide-in-from-bottom-4"
              style={{ 
                animationDelay: `${index * 100}ms`,
                animationFillMode: 'both'
              }}
              onClick={() => onPromptSelect(prompt.prompt)}
            >
              <CardContent className="p-6">
                <div className="flex items-start space-x-4">
                  <div className={`p-3 rounded-2xl bg-gradient-to-br ${prompt.gradient} text-white shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                    {prompt.icon}
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-foreground mb-1 group-hover:text-teal-600 transition-colors duration-300">
                      {prompt.title}
                    </h3>
                    <p className="text-sm text-muted-foreground leading-relaxed">
                      {prompt.description}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Bottom hint */}
      <div className="mt-12 text-center animate-in fade-in duration-1000 delay-500">
        <p className="text-xs text-muted-foreground/60">
          Click on a card above or type your question below to get started
        </p>
      </div>
    </div>
  );
};
