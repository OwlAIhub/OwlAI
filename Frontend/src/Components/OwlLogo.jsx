import React, { useEffect, useState } from "react";
import {
  motion,
  useMotionValue,
  useReducedMotion,
} from "framer-motion";

const AnimatedOwlLogo = () => {
  const [isDarkMode, setIsDarkMode] = useState(false);
  const shouldReduceMotion = useReducedMotion();

  const rotateX = useMotionValue(0);
  const rotateY = useMotionValue(0);
  const scale = useMotionValue(1);

  useEffect(() => {
    const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
    const handleChange = (e) => setIsDarkMode(e.matches);

    setIsDarkMode(mediaQuery.matches);

    if (mediaQuery.addEventListener) {
      mediaQuery.addEventListener("change", handleChange);
      return () => mediaQuery.removeEventListener("change", handleChange);
    } else {
      mediaQuery.addListener(handleChange);
      return () => mediaQuery.removeListener(handleChange);
    }
  }, []);

  const handleMouseMove = (e) => {
    const { left, top, width, height } = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - left;
    const y = e.clientY - top;

    const rotateRange = 10;
    rotateY.set(((x / width) - 0.5) * 2 * rotateRange);
    rotateX.set(((y / height) - 0.5) * -2 * rotateRange);
    scale.set(1.05);
  };

  const handleMouseLeave = () => {
    rotateX.set(0);
    rotateY.set(0);
    scale.set(1);
  };

  return (
    <div className="flex justify-center items-center my-12 relative">
      {/* Owl container */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 1.2, ease: "easeOut" }}
        className="w-72 h-80 relative z-10"
        style={{ perspective: 1000 }}
        onMouseMove={!shouldReduceMotion ? handleMouseMove : undefined}
        onMouseLeave={!shouldReduceMotion ? handleMouseLeave : undefined}
      >
        {/* Shadow animation */}
        <motion.div
          className="absolute bottom-0 left-1/2 w-36 h-6 bg-black rounded-full opacity-20 blur-md -translate-x-1/2 z-0"
          animate={{ scaleX: [1, 1.15, 1], opacity: [0.2, 0.1, 0.2] }}
          transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
        />

        {/* Owl image */}
        <motion.img
          src="/owlimg2.png"
          alt="Wisdom Owl Logo"
          className="w-full h-full object-contain select-none pointer-events-none z-10"
          animate={
            !shouldReduceMotion
              ? {
                  y: [0, -4, 0, 4, 0],
                  rotate: [0, 1.5, 0, -1.5, 0],
                  scale: [1, 1.01, 1],
                }
              : {}
          }
          transition={{
            duration: 6,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          style={{
            rotateX: shouldReduceMotion ? 0 : rotateX,
            rotateY: shouldReduceMotion ? 0 : rotateY,
            scale: shouldReduceMotion ? 1 : scale,
            filter: isDarkMode
              ? "brightness(1.1) contrast(1.05) saturate(0.9)"
              : "none",
            transformStyle: "preserve-3d",
            willChange: "transform, filter",
          }}
        />

        {/* Eye blink */}
        {!shouldReduceMotion && (
          <motion.div
            className="absolute top-[calc(50%-30px)] left-[calc(50%-30px)] w-10 h-3 bg-black rounded-full z-20"
            animate={{ scaleY: [1, 0.1, 1], opacity: [0, 0.85, 0] }}
            transition={{
              duration: 0.2,
              repeat: Infinity,
              repeatDelay: 4.5,
              ease: "easeInOut",
            }}
          />
        )}
      </motion.div>
    </div>
  );
};

export default React.memo(AnimatedOwlLogo);
