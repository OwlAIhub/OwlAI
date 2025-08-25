import { useCallback, useRef, useEffect, useState } from "react";

interface UsePerformanceReturn {
  // Debounced callback
  debounce: <T extends (...args: any[]) => void>(
    callback: T,
    delay: number
  ) => (...args: Parameters<T>) => void;

  // Throttled callback
  throttle: <T extends (...args: any[]) => void>(
    callback: T,
    limit: number
  ) => (...args: Parameters<T>) => void;

  // Intersection observer for lazy loading
  useIntersectionObserver: (
    elementRef: React.RefObject<Element>,
    options?: IntersectionObserverInit
  ) => boolean;

  // Idle callback
  useIdleCallback: (callback: () => void, timeout?: number) => void;
}

export const usePerformance = (): UsePerformanceReturn => {
  // Debounce implementation
  const debounce = useCallback(
    <T extends (...args: any[]) => void>(callback: T, delay: number) => {
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
    },
    []
  );

  // Throttle implementation
  const throttle = useCallback(
    <T extends (...args: any[]) => void>(callback: T, limit: number) => {
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
    },
    []
  );

  // Intersection Observer hook
  const useIntersectionObserver = useCallback(
    (
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
    },
    []
  );

  // Idle callback hook
  const useIdleCallback = useCallback(
    (callback: () => void, timeout: number = 5000) => {
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
    },
    []
  );

  return {
    debounce,
    throttle,
    useIntersectionObserver,
    useIdleCallback,
  };
};
