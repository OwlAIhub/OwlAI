import { cn } from '@/lib/utils';
import Image from 'next/image';
import { ElementType, ReactNode } from 'react';

interface ResponsiveContainerProps {
  children: ReactNode;
  className?: string;
  as?: ElementType;
  maxWidth?:
    | 'sm'
    | 'md'
    | 'lg'
    | 'xl'
    | '2xl'
    | '3xl'
    | '4xl'
    | '5xl'
    | '6xl'
    | '7xl'
    | 'full';
  padding?: 'none' | 'sm' | 'md' | 'lg' | 'xl';
  fluid?: boolean;
  containerQuery?: boolean;
}

const maxWidthClasses = {
  sm: 'max-w-sm',
  md: 'max-w-md',
  lg: 'max-w-lg',
  xl: 'max-w-xl',
  '2xl': 'max-w-2xl',
  '3xl': 'max-w-3xl',
  '4xl': 'max-w-4xl',
  '5xl': 'max-w-5xl',
  '6xl': 'max-w-6xl',
  '7xl': 'max-w-7xl',
  full: 'max-w-full',
};

const paddingClasses = {
  none: '',
  sm: 'px-4 sm:px-6',
  md: 'px-6 sm:px-8',
  lg: 'px-8 sm:px-12',
  xl: 'px-12 sm:px-16',
};

export function ResponsiveContainer({
  children,
  className,
  as: Component = 'div',
  maxWidth = '6xl',
  padding = 'md',
  fluid = false,
  containerQuery = false,
  ...props
}: ResponsiveContainerProps) {
  return (
    <Component
      className={cn(
        'mx-auto w-full',
        !fluid && maxWidthClasses[maxWidth],
        paddingClasses[padding],
        containerQuery && 'container-query',
        className
      )}
      {...props}
    >
      {children}
    </Component>
  );
}

// Fluid Grid Component for intrinsic responsiveness
interface FluidGridProps {
  children: ReactNode;
  className?: string;
  minWidth?: string;
  gap?: 'sm' | 'md' | 'lg' | 'xl';
  columns?: number;
  autoFit?: boolean;
}

const gapClasses = {
  sm: 'gap-3',
  md: 'gap-4',
  lg: 'gap-6',
  xl: 'gap-8',
};

export function FluidGrid({
  children,
  className,
  minWidth = '250px',
  gap = 'md',
  columns,
  autoFit = true,
  ...props
}: FluidGridProps) {
  const gridStyle = autoFit
    ? { gridTemplateColumns: `repeat(auto-fit, minmax(${minWidth}, 1fr))` }
    : { gridTemplateColumns: `repeat(${columns}, 1fr)` };

  return (
    <div
      className={cn('grid', gapClasses[gap], className)}
      style={gridStyle}
      {...props}
    >
      {children}
    </div>
  );
}

// Responsive Text Component with fluid typography
interface ResponsiveTextProps {
  children: ReactNode;
  className?: string;
  as?: ElementType;
  size?: 'xs' | 'sm' | 'base' | 'lg' | 'xl' | '2xl' | '3xl' | '4xl' | '5xl';
  fluid?: boolean;
  clamp?: {
    min: string;
    preferred: string;
    max: string;
  };
}

const sizeClasses = {
  xs: 'text-xs',
  sm: 'text-sm',
  base: 'text-base',
  lg: 'text-lg',
  xl: 'text-xl',
  '2xl': 'text-2xl',
  '3xl': 'text-3xl',
  '4xl': 'text-4xl',
  '5xl': 'text-5xl',
};

export function ResponsiveText({
  children,
  className,
  as: Component = 'p',
  size = 'base',
  fluid = false,
  clamp,
  ...props
}: ResponsiveTextProps) {
  const fluidStyle =
    fluid && clamp
      ? { fontSize: `clamp(${clamp.min}, ${clamp.preferred}, ${clamp.max})` }
      : {};

  return (
    <Component
      className={cn(!fluid && sizeClasses[size], className)}
      style={fluidStyle}
      {...props}
    >
      {children}
    </Component>
  );
}

// Container Query Component for component-level responsiveness
interface ContainerQueryProps {
  children: ReactNode;
  className?: string;
  type?: 'inline-size' | 'size' | 'normal';
  name?: string;
}

export function ContainerQuery({
  children,
  className,
  type = 'inline-size',
  name,
  ...props
}: ContainerQueryProps) {
  const containerStyle = {
    containerType: type,
    ...(name && { containerName: name }),
  };

  return (
    <div
      className={cn('container-query', className)}
      style={containerStyle}
      {...props}
    >
      {children}
    </div>
  );
}

// Responsive Image Component
interface ResponsiveImageProps {
  src: string;
  alt: string;
  className?: string;
  aspectRatio?: 'square' | 'video' | 'auto' | string;
  loading?: 'lazy' | 'eager';
  priority?: boolean;
  width?: number;
  height?: number;
}

export function ResponsiveImage({
  src,
  alt,
  className,
  aspectRatio = 'auto',
  loading = 'lazy',
  priority = false,
  width = 800,
  height = 600,
  ...props
}: ResponsiveImageProps) {
  const aspectRatioClasses = {
    square: 'aspect-square',
    video: 'aspect-video',
    auto: '',
  };

  return (
    <Image
      src={src}
      alt={alt}
      className={cn(
        'w-full h-auto object-cover',
        aspectRatio !== 'auto' &&
          aspectRatioClasses[aspectRatio as keyof typeof aspectRatioClasses],
        className
      )}
      loading={priority ? 'eager' : loading}
      width={width}
      height={height}
      quality={95}
      sizes='(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw'
      {...props}
    />
  );
}
