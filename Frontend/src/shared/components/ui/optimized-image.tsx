import React, { useState, useEffect, useCallback } from "react";

interface OptimizedImageProps {
  src: string;
  alt: string;
  className?: string;
  width?: number;
  height?: number;
  priority?: boolean;
  placeholder?: string;
  sizes?: string;
  quality?: number;
}

export const OptimizedImage: React.FC<OptimizedImageProps> = ({
  src,
  alt,
  className = "",
  width,
  height,
  priority = false,
  placeholder = "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTAwIiBoZWlnaHQ9IjEwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwIiBoZWlnaHQ9IjEwMCIgZmlsbD0iI2YzZjRmNiIvPjwvc3ZnPg==",
  sizes = "100vw",
  quality = 85,
}) => {
  const [imageSrc, setImageSrc] = useState(placeholder);
  const [imageRef, setImageRef] = useState<HTMLImageElement | null>(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const [hasError, setHasError] = useState(false);

  // Generate optimized src with WebP support
  const getOptimizedSrc = useCallback((originalSrc: string) => {
    // If it's already a data URL or external URL, return as is
    if (originalSrc.startsWith("data:") || originalSrc.startsWith("http")) {
      return originalSrc;
    }

    // For local images, prefer WebP if available
    const webpSrc = originalSrc.replace(/\.(png|jpg|jpeg)$/i, ".webp");
    return webpSrc;
  }, []);

  useEffect(() => {
    let observer: IntersectionObserver;
    let didCancel = false;

    if (imageRef && imageSrc === placeholder && !hasError) {
      if (IntersectionObserver) {
        observer = new IntersectionObserver(
          entries => {
            entries.forEach(entry => {
              if (
                !didCancel &&
                (entry.intersectionRatio > 0 || entry.isIntersecting)
              ) {
                const optimizedSrc = getOptimizedSrc(src);
                setImageSrc(optimizedSrc);
                observer.unobserve(imageRef);
              }
            });
          },
          {
            threshold: 0.01,
            rootMargin: priority ? "0px" : "50px", // Load earlier for non-priority images
          }
        );
        observer.observe(imageRef);
      } else {
        // Fallback for older browsers
        setImageSrc(getOptimizedSrc(src));
      }
    }
    return () => {
      didCancel = true;
      if (observer && observer.unobserve && imageRef) {
        observer.unobserve(imageRef);
      }
    };
  }, [src, imageSrc, imageRef, hasError, priority, getOptimizedSrc]);

  const handleLoad = useCallback(() => {
    setIsLoaded(true);
    setHasError(false);
  }, []);

  const handleError = useCallback(() => {
    // Fallback to original src if WebP fails
    if (imageSrc.includes(".webp") && !hasError) {
      const fallbackSrc = imageSrc.replace(".webp", ".png");
      setImageSrc(fallbackSrc);
      setHasError(true);
    } else if (imageSrc !== src) {
      // Final fallback to original src
      setImageSrc(src);
      setHasError(true);
    }
  }, [imageSrc, src, hasError]);

  return (
    <img
      ref={setImageRef}
      src={imageSrc}
      alt={alt}
      className={`${className} ${isLoaded ? "opacity-100" : "opacity-0"} transition-opacity duration-300`}
      width={width}
      height={height}
      loading={priority ? "eager" : "lazy"}
      decoding={priority ? "sync" : "async"}
      sizes={sizes}
      onLoad={handleLoad}
      onError={handleError}
      style={{
        backgroundColor: "#f3f4f6",
        ...(width && height ? { aspectRatio: `${width}/${height}` } : {}),
      }}
    />
  );
};
