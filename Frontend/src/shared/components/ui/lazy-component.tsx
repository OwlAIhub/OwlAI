import React, { Suspense, lazy } from "react";

interface LazyComponentProps {
  component: () => Promise<{ default: React.ComponentType<any> }>;
  fallback?: React.ReactNode;
  props?: Record<string, any>;
}

export const LazyComponent: React.FC<LazyComponentProps> = ({
  component,
  fallback = <div className="animate-pulse bg-gray-200 rounded h-32"></div>,
  props = {},
}) => {
  const LazyLoadedComponent = lazy(component);

  return (
    <Suspense fallback={fallback}>
      <LazyLoadedComponent {...props} /> hst
    </Suspense>
  );
};

// Pre-defined lazy components for common heavy imports
// Note: These are utility libraries, not React components, so they shouldn't be lazy loaded this way
// Instead, use dynamic imports in your components when needed
