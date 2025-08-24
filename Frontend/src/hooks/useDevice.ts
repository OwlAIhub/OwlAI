import { useState, useEffect } from "react";
import { deviceUtils } from "@/utils";

interface UseDeviceReturn {
  isMobile: boolean;
  isTablet: boolean;
  isDesktop: boolean;
  isMidRange: boolean;
  windowSize: { width: number; height: number };
}

export const useDevice = (): UseDeviceReturn => {
  const [windowSize, setWindowSize] = useState({
    width: window.innerWidth,
    height: window.innerHeight,
  });

  const [deviceState, setDeviceState] = useState({
    isMobile: deviceUtils.isMobile(),
    isTablet: deviceUtils.isTablet(),
    isDesktop: deviceUtils.isDesktop(),
    isMidRange: deviceUtils.isMidRange(),
  });

  useEffect(() => {
    const handleResize = () => {
      const newSize = {
        width: window.innerWidth,
        height: window.innerHeight,
      };

      setWindowSize(newSize);
      setDeviceState({
        isMobile: deviceUtils.isMobile(),
        isTablet: deviceUtils.isTablet(),
        isDesktop: deviceUtils.isDesktop(),
        isMidRange: deviceUtils.isMidRange(),
      });
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return {
    ...deviceState,
    windowSize,
  };
};
