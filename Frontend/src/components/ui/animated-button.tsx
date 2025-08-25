import React from "react";
import { Button, buttonVariants } from "@/components/ui/button";
import { ButtonLoader } from "@/components/ui/loading";
import { cn } from "@/lib/utils";
import { VariantProps } from "class-variance-authority";

interface AnimatedButtonProps
  extends React.ComponentProps<"button">,
    VariantProps<typeof buttonVariants> {
  loading?: boolean;
  loadingText?: string;
  animation?: "none" | "glow" | "float" | "scale" | "shimmer";
  icon?: React.ReactNode;
  iconPosition?: "left" | "right";
  children?: React.ReactNode;
  asChild?: boolean;
}

export const AnimatedButton: React.FC<AnimatedButtonProps> = ({
  children,
  loading = false,
  loadingText,
  animation = "scale",
  icon,
  iconPosition = "left",
  className,
  disabled,
  ...props
}) => {
  const animationClasses = {
    none: "",
    glow: "hover:animate-glow",
    float: "hover:animate-float",
    scale: "hover:scale-105 active:scale-95 transition-transform duration-200",
    shimmer:
      "relative overflow-hidden before:absolute before:inset-0 before:bg-gradient-to-r before:from-transparent before:via-white/10 before:to-transparent before:animate-shimmer",
  };

  const isDisabled = disabled || loading;

  return (
    <Button
      {...props}
      disabled={isDisabled}
      className={cn(
        "transition-all duration-200 ease-out",
        !isDisabled && animationClasses[animation],
        // Special effects for loading state
        loading && "cursor-not-allowed",
        className
      )}
    >
      <div className={cn("flex items-center gap-2", loading && "opacity-80")}>
        {/* Loading spinner */}
        {loading && <ButtonLoader size="sm" />}

        {/* Left icon */}
        {!loading && icon && iconPosition === "left" && (
          <span className="flex-shrink-0 transition-transform group-hover:scale-110 duration-200">
            {icon}
          </span>
        )}

        {/* Button text */}
        <span
          className={cn(
            "transition-all duration-200",
            loading && "animate-pulse"
          )}
        >
          {loading && loadingText ? loadingText : children}
        </span>

        {/* Right icon */}
        {!loading && icon && iconPosition === "right" && (
          <span className="flex-shrink-0 transition-transform group-hover:scale-110 duration-200">
            {icon}
          </span>
        )}
      </div>
    </Button>
  );
};

// Specialized button variants
export const PrimaryAnimatedButton: React.FC<
  Omit<AnimatedButtonProps, "variant">
> = props => (
  <AnimatedButton
    variant="default"
    className="bg-owl-primary hover:bg-owl-primary-dark"
    animation="scale"
    {...props}
  />
);

export const GlowButton: React.FC<
  Omit<AnimatedButtonProps, "animation">
> = props => (
  <AnimatedButton
    animation="glow"
    className="bg-owl-primary hover:bg-owl-primary-dark shadow-lg"
    {...props}
  />
);

export const FloatingActionButton: React.FC<
  Omit<AnimatedButtonProps, "animation" | "size">
> = props => (
  <AnimatedButton
    size="sm"
    animation="float"
    className="rounded-full h-12 w-12 p-0 shadow-lg hover:shadow-xl"
    {...props}
  />
);
