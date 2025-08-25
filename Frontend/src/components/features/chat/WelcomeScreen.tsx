import React from "react";
import { User } from "@/types";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import OwlLogo from "@/assets/owlMascot.png";
import { PREDEFINED_PROMPTS } from "@/constants";
import { dateUtils } from "@/utils";
import { cn } from "@/lib/utils";

interface WelcomeScreenProps {
  isLoggedIn: boolean;
  user?: User | null;
  windowSize: { width: number; height: number };
  onPromptClick: (prompt: string) => void;
}

export const WelcomeScreen: React.FC<WelcomeScreenProps> = ({
  isLoggedIn,
  user,
  windowSize,
  onPromptClick,
}) => {
  const isMobile = windowSize.width < 768;

  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] px-4 py-8">
      <div className="max-w-4xl mx-auto text-center space-y-8">
        {/* User greeting section */}
        {isLoggedIn ? (
          <div className="space-y-4">
            <div className="space-y-2">
              <h1 className="text-3xl md:text-4xl font-bold text-foreground">
                {dateUtils.getGreeting()}, {user?.firstName || "there"}!
              </h1>
              <Badge
                variant="secondary"
                className="bg-owl-primary/10 text-owl-primary border-owl-primary/20"
              >
                Welcome back
              </Badge>
            </div>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Let's continue your preparation journey and make today productive.
            </p>
          </div>
        ) : (
          <div className="space-y-6">
            {/* Logo section */}
            <div
              className={cn("flex justify-center", isMobile ? "mb-4" : "mb-6")}
            >
              <div
                className={cn("relative", isMobile ? "w-32 h-32" : "w-48 h-48")}
              >
                <img
                  src={OwlLogo}
                  alt="OwlAI Mascot"
                  className="w-full h-full object-contain drop-shadow-lg"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-owl-primary/5 to-transparent rounded-full"></div>
              </div>
            </div>

            {/* Welcome message */}
            <div className="space-y-4">
              <h1 className="text-3xl md:text-4xl font-bold text-foreground">
                How may I help you?
              </h1>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                Start your preparation with{" "}
                <span className="text-owl-primary font-semibold">OwlAI</span>{" "}
                and unlock your potential!
              </p>
            </div>
          </div>
        )}

        {/* Predefined prompts section */}
        <div className="mt-12 space-y-6">
          <div className="space-y-2">
            <h3 className="text-xl font-semibold text-foreground">
              Try asking me:
            </h3>
            <p className="text-sm text-muted-foreground">
              Choose from these popular questions to get started
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-3xl mx-auto">
            {PREDEFINED_PROMPTS.map((prompt, index) => (
              <Card
                key={index}
                className="group cursor-pointer transition-all duration-200 hover:shadow-md hover:-translate-y-1 border-muted"
                onClick={() => onPromptClick(prompt)}
              >
                <CardContent className="p-4">
                  <Button
                    variant="ghost"
                    className="w-full h-auto p-0 text-left text-sm text-muted-foreground group-hover:text-foreground transition-colors"
                  >
                    <span className="line-clamp-3">{prompt}</span>
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Call to action for anonymous users */}
        {!isLoggedIn && (
          <div className="mt-12 p-6 bg-muted/30 rounded-lg border border-dashed border-muted">
            <div className="space-y-3">
              <p className="text-sm font-medium text-foreground">
                Want unlimited access?
              </p>
              <p className="text-xs text-muted-foreground">
                Log in to remove message limits and save your conversation
                history
              </p>
              <Button
                variant="outline"
                size="sm"
                className="mt-2 border-teal-600 text-teal-600 hover:bg-teal-600 hover:text-white"
              >
                Create Free Account
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
