import React from "react";
import { cn } from "@/lib/utils";

interface LoadingProps {
  variant?: "default" | "dots" | "spinner" | "owl" | "shimmer";
  size?: "sm" | "md" | "lg";
  className?: string;
  text?: string;
}

export const Loading: React.FC<LoadingProps> = ({
  variant = "default",
  size = "md",
  className,
  text,
}) => {
  const sizeClasses = {
    sm: "w-4 h-4",
    md: "w-6 h-6",
    lg: "w-8 h-8",
  };

  const renderVariant = () => {
    switch (variant) {
      case "dots":
        return (
          <div className="flex items-center gap-1">
            {[0, 1, 2].map(i => (
              <div
                key={i}
                className={cn(
                  "bg-owl-primary rounded-full animate-typing-dots",
                  size === "sm"
                    ? "w-1.5 h-1.5"
                    : size === "lg"
                      ? "w-3 h-3"
                      : "w-2 h-2"
                )}
                style={{
                  animationDelay: `${i * 0.2}s`,
                }}
              />
            ))}
          </div>
        );

      case "spinner":
        return (
          <div
            className={cn(
              "border-2 border-current border-t-transparent rounded-full animate-spin",
              sizeClasses[size]
            )}
          />
        );

      case "owl":
        return (
          <div className="flex flex-col items-center gap-2">
            <div
              className={cn(
                "bg-owl-primary rounded-full animate-pulse-slow",
                size === "sm"
                  ? "w-8 h-8"
                  : size === "lg"
                    ? "w-16 h-16"
                    : "w-12 h-12"
              )}
            />
            <div
              className={cn(
                "bg-owl-primary/60 rounded-full animate-float",
                size === "sm"
                  ? "w-6 h-6"
                  : size === "lg"
                    ? "w-12 h-12"
                    : "w-8 h-8"
              )}
              style={{ animationDelay: "0.5s" }}
            />
          </div>
        );

      case "shimmer":
        return (
          <div
            className={cn(
              "relative overflow-hidden bg-muted rounded",
              sizeClasses[size]
            )}
          >
            <div
              className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent animate-shimmer"
              style={{ width: "200%" }}
            />
          </div>
        );

      default:
        return (
          <div
            className={cn(
              "border-4 border-owl-primary/30 border-t-owl-primary rounded-full animate-spin",
              sizeClasses[size]
            )}
          />
        );
    }
  };

  return (
    <div className={cn("flex flex-col items-center gap-2", className)}>
      {renderVariant()}
      {text && (
        <p
          className={cn(
            "text-muted-foreground animate-pulse-slow",
            size === "sm" ? "text-xs" : size === "lg" ? "text-base" : "text-sm"
          )}
        >
          {text}
        </p>
      )}
    </div>
  );
};

// Pre-built loading states
export const TypingIndicator: React.FC<{ className?: string }> = ({
  className,
}) => <Loading variant="dots" size="sm" className={className} />;

export const PageLoader: React.FC<{ text?: string }> = ({
  text = "Loading...",
}) => (
  <div className="fixed inset-0 bg-background/80 backdrop-blur-sm flex items-center justify-center z-50">
    <Loading variant="owl" size="lg" text={text} className="animate-fade-in" />
  </div>
);

export const ButtonLoader: React.FC<{ size?: "sm" | "md" | "lg" }> = ({
  size = "sm",
}) => <Loading variant="spinner" size={size} />;
