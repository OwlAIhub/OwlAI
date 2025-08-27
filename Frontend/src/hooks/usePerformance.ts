import React, { useCallback, useRef, useEffect, useState } from "react";

// Utility functions (not hooks)
export const createDebounce = <T extends (...args: unknown[]) => void>(
  callback: T,
  delay: number
) => {
  let timeoutId: ReturnType<typeof setTimeout> | null = null;

  return (...args: Parameters<T>) => {
    if (timeoutId) {
      clearTimeout(timeoutId);
    }

    timeoutId = setTimeout(() => {
      callback(...args);
    }, delay);
  };
};

export const createThrottle = <T extends (...args: unknown[]) => void>(
  callback: T,
  limit: number
) => {
  let lastCall = 0;

  return (...args: Parameters<T>) => {
    const now = Date.now();

    if (now - lastCall >= limit) {
      lastCall = now;
      callback(...args);
    }
  };
};

// Custom hook for debounced callbacks
export const useDebounce = <T extends (...args: unknown[]) => void>(
  callback: T,
  delay: number
) => {
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  return useCallback(
    (...args: Parameters<T>) => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }

      timeoutRef.current = setTimeout(() => {
        callback(...args);
      }, delay);
    },
    [callback, delay]
  );
};

// Custom hook for throttled callbacks
export const useThrottle = <T extends (...args: unknown[]) => void>(
  callback: T,
  limit: number
) => {
  const lastCallRef = useRef<number>(0);

  return useCallback(
    (...args: Parameters<T>) => {
      const now = Date.now();

      if (now - lastCallRef.current >= limit) {
        lastCallRef.current = now;
        callback(...args);
      }
    },
    [callback, limit]
  );
};

// Intersection Observer hook
export const useIntersectionObserver = (
  elementRef: React.RefObject<Element>,
  options: IntersectionObserverInit = {}
): boolean => {
  const [isIntersecting, setIsIntersecting] = useState(false);

  useEffect(() => {
    const element = elementRef.current;
    if (!element) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsIntersecting(entry.isIntersecting);
      },
      {
        threshold: 0.1,
        ...options,
      }
    );

    observer.observe(element);

    return () => {
      observer.unobserve(element);
    };
  }, [elementRef, options]);

  return isIntersecting;
};

// Idle callback hook
export const useIdleCallback = (
  callback: () => void,
  timeout: number = 5000
) => {
  useEffect(() => {
    const requestIdleCallback =
      window.requestIdleCallback ||
      ((cb: () => void) => {
        const start = Date.now();
        return setTimeout(
          () => {
            cb();
          },
          Math.max(0, 50 - (Date.now() - start))
        );
      });

    const handle = requestIdleCallback(callback, { timeout });

    return () => {
      if (window.cancelIdleCallback) {
        window.cancelIdleCallback(handle);
      } else {
        clearTimeout(handle);
      }
    };
  }, [callback, timeout]);
};
