import React, { useEffect, useState } from "react";
import { motion, useMotionValue, useReducedMotion } from "framer-motion";

const AnimatedOwlLogo = () => {
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const shouldReduceMotion = useReducedMotion();

  const rotateX = useMotionValue(0);
  const rotateY = useMotionValue(0);
  const scale = useMotionValue(1);

  useEffect(() => {
    const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
    const handleColorChange = (e) => setIsDarkMode(e.matches);
    const handleResize = () => setIsMobile(window.innerWidth <= 768);

    setIsDarkMode(mediaQuery.matches);
    setIsMobile(window.innerWidth <= 768);

    if (mediaQuery.addEventListener) {
      mediaQuery.addEventListener("change", handleColorChange);
    } else {
      mediaQuery.addListener(handleColorChange);
    }

    window.addEventListener("resize", handleResize);

    return () => {
      if (mediaQuery.removeEventListener) {
        mediaQuery.removeEventListener("change", handleColorChange);
      } else {
        mediaQuery.removeListener(handleColorChange);
      }
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  const handleMouseMove = (e) => {
    if (isMobile) return;
    const { left, top, width, height } = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - left;
    const y = e.clientY - top;

    const rotateRange = 6;
    rotateY.set(((x / width) - 0.5) * 2 * rotateRange);
    rotateX.set(((y / height) - 0.5) * -2 * rotateRange);
    scale.set(1.02);
  };

  const handleMouseLeave = () => {
    if (isMobile) return;
    rotateX.set(0);
    rotateY.set(0);
    scale.set(1);
  };

  return (
    <div className="flex justify-center items-center my-12">
      <motion.div
        className="w-72 h-80 relative"
        style={{ perspective: 1000 }}
        onMouseMove={!shouldReduceMotion ? handleMouseMove : undefined}
        onMouseLeave={!shouldReduceMotion ? handleMouseLeave : undefined}
        whileTap={isMobile ? { scale: 0.96 } : {}}
        initial={{ opacity: 0, scale: 0.96 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 1.2, ease: "easeOut" }}
      >
        <motion.img
          src="/owlimg.png"
          alt="Owl AI Logo"
          className="w-full h-full object-contain select-none pointer-events-none"
          animate={
            shouldReduceMotion
              ? {}
              : isMobile
              ? {
                  y: [0, -5, 0, 5, 0],
                  scale: [1, 1.015, 1],
                }
              : {
                  y: [0, -2, 0, 2, 0],
                }
          }
          transition={{
            duration: isMobile ? 6 : 8,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          style={{
            rotateX: shouldReduceMotion || isMobile ? 0 : rotateX,
            rotateY: shouldReduceMotion || isMobile ? 0 : rotateY,
            scale: shouldReduceMotion ? 1 : scale,
            transformStyle: "preserve-3d",
            willChange: "transform",
            filter: isDarkMode ? "brightness(1.05)" : "none",
          }}
        />
      </motion.div>
    </div>
  );
};

export default React.memo(AnimatedOwlLogo);
