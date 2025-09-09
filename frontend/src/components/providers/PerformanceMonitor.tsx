"use client";

import { useEffect } from "react";

// Type definitions for performance monitoring
interface WebVitalMetric {
  name: string;
  value: number;
  rating?: "good" | "needs-improvement" | "poor";
}

interface MemoryMetric {
  name: string;
  usedJSHeapSize: number;
  totalJSHeapSize: number;
  jsHeapSizeLimit: number;
}

interface ErrorMetric {
  name: string;
  message?: string;
  filename?: string;
  lineno?: number;
  colno?: number;
  stack?: string;
  reason?: unknown;
}

type PerformanceMetric = WebVitalMetric | MemoryMetric | ErrorMetric;

// Performance monitoring for production
export function PerformanceMonitor() {
  useEffect(() => {
    // Only run in production
    if (process.env.NODE_ENV !== "production") {
      return;
    }

    // Web Vitals monitoring
    const reportWebVitals = (metric: PerformanceMetric) => {
      // In production, you would send this to your analytics service
      // Example: analytics.track('Web Vital', metric);
      console.log("Web Vital:", metric);
    };

    // Core Web Vitals
    const observePerformance = () => {
      // Largest Contentful Paint (LCP)
      if ("PerformanceObserver" in window) {
        try {
          const lcpObserver = new PerformanceObserver((list) => {
            const entries = list.getEntries();
            const lastEntry = entries[entries.length - 1];
            reportWebVitals({
              name: "LCP",
              value: lastEntry.startTime,
              rating:
                lastEntry.startTime > 4000
                  ? "poor"
                  : lastEntry.startTime > 2500
                    ? "needs-improvement"
                    : "good",
            });
          });
          lcpObserver.observe({ entryTypes: ["largest-contentful-paint"] });

          // First Input Delay (FID)
          const fidObserver = new PerformanceObserver((list) => {
            const entries = list.getEntries();
            entries.forEach((entry) => {
              const fidEntry = entry as PerformanceEntry & {
                processingStart: number;
              };
              const fidValue = fidEntry.processingStart - fidEntry.startTime;
              reportWebVitals({
                name: "FID",
                value: fidValue,
                rating:
                  fidValue > 300
                    ? "poor"
                    : fidValue > 100
                      ? "needs-improvement"
                      : "good",
              });
            });
          });
          fidObserver.observe({ entryTypes: ["first-input"] });

          // Cumulative Layout Shift (CLS)
          let clsValue = 0;
          const clsObserver = new PerformanceObserver((list) => {
            const entries = list.getEntries();
            entries.forEach((entry) => {
              const clsEntry = entry as PerformanceEntry & {
                hadRecentInput: boolean;
                value: number;
              };
              if (!clsEntry.hadRecentInput) {
                clsValue += clsEntry.value;
              }
            });
            reportWebVitals({
              name: "CLS",
              value: clsValue,
              rating:
                clsValue > 0.25
                  ? "poor"
                  : clsValue > 0.1
                    ? "needs-improvement"
                    : "good",
            });
          });
          clsObserver.observe({ entryTypes: ["layout-shift"] });
        } catch (error) {
          console.warn("Performance monitoring failed:", error);
        }
      }
    };

    // Memory usage monitoring
    const monitorMemory = () => {
      if ("memory" in performance) {
        const memoryInfo = (
          performance as {
            memory: {
              usedJSHeapSize: number;
              totalJSHeapSize: number;
              jsHeapSizeLimit: number;
            };
          }
        ).memory;
        reportWebVitals({
          name: "Memory",
          usedJSHeapSize: memoryInfo.usedJSHeapSize,
          totalJSHeapSize: memoryInfo.totalJSHeapSize,
          jsHeapSizeLimit: memoryInfo.jsHeapSizeLimit,
        });
      }
    };

    // Error tracking
    const handleError = (event: ErrorEvent) => {
      reportWebVitals({
        name: "JavaScript Error",
        message: event.message,
        filename: event.filename,
        lineno: event.lineno,
        colno: event.colno,
        stack: event.error?.stack,
      });
    };

    const handleUnhandledRejection = (event: PromiseRejectionEvent) => {
      reportWebVitals({
        name: "Unhandled Promise Rejection",
        reason: event.reason,
      });
    };

    // Start monitoring
    observePerformance();

    // Monitor memory every 30 seconds
    const memoryInterval = setInterval(monitorMemory, 30000);

    // Add error listeners
    window.addEventListener("error", handleError);
    window.addEventListener("unhandledrejection", handleUnhandledRejection);

    // Cleanup
    return () => {
      clearInterval(memoryInterval);
      window.removeEventListener("error", handleError);
      window.removeEventListener(
        "unhandledrejection",
        handleUnhandledRejection,
      );
    };
  }, []);

  return null; // This component doesn't render anything
}

// Hook for manual performance tracking
export function usePerformanceTracking() {
  const trackEvent = (eventName: string, data?: Record<string, unknown>) => {
    if (process.env.NODE_ENV === "production") {
      // In production, send to analytics service
      console.log("Performance Event:", eventName, data);
    }
  };

  const startTiming = (label: string) => {
    performance.mark(`${label}-start`);
  };

  const endTiming = (label: string) => {
    performance.mark(`${label}-end`);
    performance.measure(label, `${label}-start`, `${label}-end`);

    const measure = performance.getEntriesByName(label)[0];
    trackEvent("Custom Timing", {
      name: label,
      duration: measure.duration,
    });
  };

  return { trackEvent, startTiming, endTiming };
}
