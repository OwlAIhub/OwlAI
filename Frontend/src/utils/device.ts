/**
 * Device Detection Utilities
 */

// Breakpoints (matching Tailwind CSS defaults)
export const BREAKPOINTS = {
  xs: 475,
  sm: 640,
  md: 768,
  lg: 1024,
  xl: 1280,
  "2xl": 1400,
} as const;

export type Breakpoint = keyof typeof BREAKPOINTS;

// Device detection functions
export const deviceUtils = {
  // Get current window width
  getWindowWidth: (): number => {
    if (typeof window === "undefined") return 0;
    return window.innerWidth;
  },

  // Get current window height
  getWindowHeight: (): number => {
    if (typeof window === "undefined") return 0;
    return window.innerHeight;
  },

  // Check if current width is below mobile breakpoint
  isMobile: (): boolean => {
    return deviceUtils.getWindowWidth() < BREAKPOINTS.md;
  },

  // Check if current width is tablet range
  isTablet: (): boolean => {
    const width = deviceUtils.getWindowWidth();
    return width >= BREAKPOINTS.md && width < BREAKPOINTS.lg;
  },

  // Check if current width is desktop
  isDesktop: (): boolean => {
    return deviceUtils.getWindowWidth() >= BREAKPOINTS.lg;
  },

  // Check if current width is in mid-range (tablet to desktop)
  isMidRange: (): boolean => {
    const width = deviceUtils.getWindowWidth();
    return width >= BREAKPOINTS.md && width < BREAKPOINTS.xl;
  },

  // Check if current width is above a specific breakpoint
  isAbove: (breakpoint: Breakpoint): boolean => {
    return deviceUtils.getWindowWidth() >= BREAKPOINTS[breakpoint];
  },

  // Check if current width is below a specific breakpoint
  isBelow: (breakpoint: Breakpoint): boolean => {
    return deviceUtils.getWindowWidth() < BREAKPOINTS[breakpoint];
  },

  // Check if current width is between two breakpoints
  isBetween: (min: Breakpoint, max: Breakpoint): boolean => {
    const width = deviceUtils.getWindowWidth();
    return width >= BREAKPOINTS[min] && width < BREAKPOINTS[max];
  },

  // Get current breakpoint
  getCurrentBreakpoint: (): Breakpoint => {
    const width = deviceUtils.getWindowWidth();

    if (width < BREAKPOINTS.xs) return "xs";
    if (width < BREAKPOINTS.sm) return "xs";
    if (width < BREAKPOINTS.md) return "sm";
    if (width < BREAKPOINTS.lg) return "md";
    if (width < BREAKPOINTS.xl) return "lg";
    if (width < BREAKPOINTS["2xl"]) return "xl";
    return "2xl";
  },

  // Check if device has touch capability
  isTouchDevice: (): boolean => {
    if (typeof window === "undefined") return false;

    return (
      "ontouchstart" in window ||
      navigator.maxTouchPoints > 0 ||
      // @ts-ignore
      navigator.msMaxTouchPoints > 0
    );
  },

  // Check if user prefers reduced motion
  prefersReducedMotion: (): boolean => {
    if (typeof window === "undefined") return false;

    return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  },

  // Check if user prefers dark mode
  prefersDarkMode: (): boolean => {
    if (typeof window === "undefined") return false;

    return window.matchMedia("(prefers-color-scheme: dark)").matches;
  },

  // Get device pixel ratio
  getDevicePixelRatio: (): number => {
    if (typeof window === "undefined") return 1;

    return window.devicePixelRatio || 1;
  },

  // Check if device is in landscape mode
  isLandscape: (): boolean => {
    if (typeof window === "undefined") return false;

    return window.innerWidth > window.innerHeight;
  },

  // Check if device is in portrait mode
  isPortrait: (): boolean => {
    return !deviceUtils.isLandscape();
  },

  // Get orientation
  getOrientation: (): "landscape" | "portrait" => {
    return deviceUtils.isLandscape() ? "landscape" : "portrait";
  },

  // Check if browser supports specific features
  supports: {
    localStorage: (): boolean => {
      try {
        return (
          typeof window !== "undefined" &&
          "localStorage" in window &&
          window.localStorage !== null
        );
      } catch {
        return false;
      }
    },

    sessionStorage: (): boolean => {
      try {
        return (
          typeof window !== "undefined" &&
          "sessionStorage" in window &&
          window.sessionStorage !== null
        );
      } catch {
        return false;
      }
    },

    webGL: (): boolean => {
      if (typeof window === "undefined") return false;

      try {
        const canvas = document.createElement("canvas");
        return !!(
          window.WebGLRenderingContext &&
          (canvas.getContext("webgl") ||
            canvas.getContext("experimental-webgl"))
        );
      } catch {
        return false;
      }
    },

    webWorkers: (): boolean => {
      return typeof window !== "undefined" && typeof Worker !== "undefined";
    },

    serviceWorkers: (): boolean => {
      return typeof window !== "undefined" && "serviceWorker" in navigator;
    },

    intersectionObserver: (): boolean => {
      return typeof window !== "undefined" && "IntersectionObserver" in window;
    },

    requestIdleCallback: (): boolean => {
      return typeof window !== "undefined" && "requestIdleCallback" in window;
    },
  },

  // Get user agent info
  getUserAgent: () => {
    if (typeof window === "undefined") return "";
    return navigator.userAgent;
  },

  // Detect browser
  getBrowser: (): string => {
    if (typeof window === "undefined") return "unknown";

    const ua = navigator.userAgent;

    if (ua.includes("Chrome")) return "chrome";
    if (ua.includes("Firefox")) return "firefox";
    if (ua.includes("Safari")) return "safari";
    if (ua.includes("Edge")) return "edge";
    if (ua.includes("Opera")) return "opera";

    return "unknown";
  },

  // Detect OS
  getOS: (): string => {
    if (typeof window === "undefined") return "unknown";

    const ua = navigator.userAgent;

    if (ua.includes("Windows")) return "windows";
    if (ua.includes("Mac")) return "macos";
    if (ua.includes("Linux")) return "linux";
    if (ua.includes("Android")) return "android";
    if (ua.includes("iOS")) return "ios";

    return "unknown";
  },
};
