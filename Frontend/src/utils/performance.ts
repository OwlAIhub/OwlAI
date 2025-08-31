/**
 * Performance monitoring and optimization utilities
 */

// Type definitions for performance APIs
interface LayoutShift extends PerformanceEntry {
  value: number;
  hadRecentInput: boolean;
}

interface PerformanceEventTiming extends PerformanceEntry {
  processingStart: number;
  startTime: number;
}

export interface PerformanceMetrics {
  fcp: number | null;
  lcp: number | null;
  fid: number | null;
  cls: number | null;
  ttfb: number | null;
}

/**
 * Monitor Core Web Vitals
 */
export const monitorCoreWebVitals = (
  callback?: (metrics: PerformanceMetrics) => void
) => {
  const metrics: PerformanceMetrics = {
    fcp: null,
    lcp: null,
    fid: null,
    cls: null,
    ttfb: null,
  };

  // First Contentful Paint
  if ("PerformanceObserver" in window) {
    try {
      const fcpObserver = new PerformanceObserver(list => {
        const entries = list.getEntries();
        const fcpEntry = entries[entries.length - 1];
        metrics.fcp = fcpEntry.startTime;
        if (callback) callback(metrics);
      });
      fcpObserver.observe({ entryTypes: ["paint"] });

      // Largest Contentful Paint
      const lcpObserver = new PerformanceObserver(list => {
        const entries = list.getEntries();
        const lcpEntry = entries[entries.length - 1];
        metrics.lcp = lcpEntry.startTime;
        if (callback) callback(metrics);
      });
      lcpObserver.observe({ entryTypes: ["largest-contentful-paint"] });

      // First Input Delay
      const fidObserver = new PerformanceObserver(list => {
        const entries = list.getEntries();
        const fidEntry = entries[entries.length - 1] as PerformanceEventTiming;
        metrics.fid = fidEntry.processingStart - fidEntry.startTime;
        if (callback) callback(metrics);
      });
      fidObserver.observe({ entryTypes: ["first-input"] });

      // Cumulative Layout Shift
      const clsObserver = new PerformanceObserver(list => {
        let clsValue = 0;
        for (const entry of list.getEntries()) {
          const layoutShiftEntry = entry as LayoutShift;
          if (!layoutShiftEntry.hadRecentInput) {
            clsValue += layoutShiftEntry.value;
          }
        }
        metrics.cls = clsValue;
        if (callback) callback(metrics);
      });
      clsObserver.observe({ entryTypes: ["layout-shift"] });
    } catch (error) {
      console.warn("Performance monitoring failed:", error);
    }
  }

  // Time to First Byte
  const navigationEntry = performance.getEntriesByType(
    "navigation"
  )[0] as PerformanceNavigationTiming;
  if (navigationEntry) {
    metrics.ttfb = navigationEntry.responseStart - navigationEntry.requestStart;
    if (callback) callback(metrics);
  }

  return metrics;
};

/**
 * Preload critical resources
 */
export const preloadCriticalResources = () => {
  const criticalResources = [
    "/src/assets/owl-ai-logo.webp",
    "/src/assets/owl-mascot.webp",
  ];

  criticalResources.forEach(resource => {
    const link = document.createElement("link");
    link.rel = "preload";
    link.as = "image";
    link.href = resource;
    document.head.appendChild(link);
  });
};

/**
 * Lazy load non-critical resources
 */
export const lazyLoadResources = () => {
  const lazyImages = document.querySelectorAll("img[data-src]");

  const imageObserver = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const img = entry.target as HTMLImageElement;
        img.src = img.dataset.src || "";
        img.classList.remove("lazy");
        imageObserver.unobserve(img);
      }
    });
  });

  lazyImages.forEach(img => imageObserver.observe(img));
};

/**
 * Optimize images with WebP support
 */
export const optimizeImages = () => {
  const images = document.querySelectorAll("img");

  images.forEach(img => {
    const src = img.getAttribute("src");
    if (src && !src.includes(".webp") && !src.startsWith("data:")) {
      // Add WebP support if available
      if (supportsWebP()) {
        const webpSrc = src.replace(/\.(png|jpg|jpeg)$/i, ".webp");
        img.setAttribute("data-webp", webpSrc);
      }
    }
  });
};

/**
 * Check WebP support
 */
export const supportsWebP = (): boolean => {
  const canvas = document.createElement("canvas");
  canvas.width = 1;
  canvas.height = 1;
  return canvas.toDataURL("image/webp").indexOf("image/webp") === 5;
};

/**
 * Debounce function for performance optimization
 */
export const debounce = <T extends (...args: any[]) => any>(
  func: T,
  wait: number
): ((...args: Parameters<T>) => void) => {
  let timeout: ReturnType<typeof setTimeout>;
  return (...args: Parameters<T>) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), wait);
  };
};

/**
 * Throttle function for performance optimization
 */
export const throttle = <T extends (...args: any[]) => any>(
  func: T,
  limit: number
): ((...args: Parameters<T>) => void) => {
  let inThrottle: boolean;
  return (...args: Parameters<T>) => {
    if (!inThrottle) {
      func(...args);
      inThrottle = true;
      setTimeout(() => (inThrottle = false), limit);
    }
  };
};

/**
 * Measure function execution time
 */
export const measureExecutionTime = <T extends (...args: any[]) => any>(
  func: T,
  name: string
): T => {
  return ((...args: Parameters<T>) => {
    const start = performance.now();
    const result = func(...args);
    const end = performance.now();
    console.log(`${name} execution time: ${end - start}ms`);
    return result;
  }) as T;
};

/**
 * Optimize scroll performance
 */
export const optimizeScroll = () => {
  let ticking = false;

  const updateScroll = () => {
    // Handle scroll updates here
    ticking = false;
  };

  const requestTick = () => {
    if (!ticking) {
      requestAnimationFrame(updateScroll);
      ticking = true;
    }
  };

  window.addEventListener("scroll", requestTick, { passive: true });
};

/**
 * Initialize all performance optimizations
 */
export const initializePerformanceOptimizations = () => {
  preloadCriticalResources();
  optimizeImages();
  optimizeScroll();

  // Initialize lazy loading after DOM is ready
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", lazyLoadResources);
  } else {
    lazyLoadResources();
  }
};
