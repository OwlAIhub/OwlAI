# Performance Optimization Guide

This document outlines the performance optimizations implemented to improve the Lighthouse scores for Owl AI.

## Current Lighthouse Scores

- **Performance**: 55 → Target: 90+
- **Accessibility**: 92 → Target: 95+
- **Best Practices**: 78 → Target: 90+
- **SEO**: 100 → Excellent

## Implemented Optimizations

### 1. Image Optimization

#### WebP Conversion
- Converted large PNG images to WebP format (30-70% smaller)
- Implemented fallback to PNG for older browsers
- Created responsive image sizes for different screen sizes

#### Lazy Loading
- Implemented intersection observer for lazy loading
- Added loading="lazy" attribute to non-critical images
- Created OptimizedImage component with WebP support

#### Image Sizes
- Thumbnail: 150px
- Small: 300px
- Medium: 600px
- Large: 1200px

### 2. Build Optimizations

#### Vite Configuration
- Enhanced chunk splitting for better caching
- Disabled sourcemaps in production
- Optimized asset file naming
- Added compression (gzip + brotli)

#### Bundle Splitting
```javascript
manualChunks: {
  vendor: ["react", "react-dom", "react-router-dom"],
  ui: ["@radix-ui/*"],
  animations: ["framer-motion"],
  utils: ["clsx", "class-variance-authority"],
  forms: ["react-hook-form", "react-toastify"],
  icons: ["@tabler/icons-react", "lucide-react"],
  firebase: ["firebase"],
  auth: ["@hookform/resolvers", "zod"],
}
```

### 3. Service Worker & Caching

#### PWA Implementation
- Service worker for offline functionality
- Cache-first strategy for static assets
- Network-first strategy for dynamic content
- Background sync for offline actions

#### Cache Strategy
- Static assets: Cache-first
- API requests: Network-first
- HTML pages: Network-first

### 4. Resource Hints

#### Preconnect & DNS Prefetch
```html
<link rel="dns-prefetch" href="https://fonts.googleapis.com" />
<link rel="preconnect" href="https://fonts.googleapis.com" crossorigin />
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
```

#### Critical CSS
- Inlined critical CSS in HTML head
- Added loading spinner for better perceived performance

### 5. Performance Monitoring

#### Core Web Vitals
- First Contentful Paint (FCP)
- Largest Contentful Paint (LCP)
- First Input Delay (FID)
- Cumulative Layout Shift (CLS)
- Time to First Byte (TTFB)

#### Performance Utilities
- Debounce and throttle functions
- Scroll optimization
- Image optimization helpers

## Usage

### Running Optimizations

```bash
# Optimize images (requires ImageMagick)
pnpm run optimize-images

# Build with optimizations
pnpm run build:optimized

# Regular build
pnpm run build
```

### Using OptimizedImage Component

```tsx
import { OptimizedImage } from "@/shared/components/ui/optimized-image";

<OptimizedImage
  src="/path/to/image.png"
  alt="Description"
  width={300}
  height={200}
  priority={false}
  sizes="(max-width: 768px) 100vw, 50vw"
/>
```

### Performance Monitoring

```tsx
import { monitorCoreWebVitals } from "@/utils/performance";

monitorCoreWebVitals((metrics) => {
  console.log("Performance metrics:", metrics);
});
```

## Maintenance

### Regular Tasks

1. **Image Optimization**
   - Run `pnpm run optimize-images` after adding new images
   - Ensure WebP versions exist for all images
   - Monitor image file sizes

2. **Bundle Analysis**
   - Check bundle size after adding new dependencies
   - Use `pnpm run build` to analyze chunks
   - Monitor vendor bundle size

3. **Performance Monitoring**
   - Run Lighthouse audits regularly
   - Monitor Core Web Vitals in production
   - Check for performance regressions

### Best Practices

1. **Images**
   - Always use WebP format when possible
   - Implement lazy loading for below-the-fold images
   - Use appropriate image sizes for different devices

2. **Code Splitting**
   - Split large components into smaller chunks
   - Use dynamic imports for route-based splitting
   - Avoid large vendor bundles

3. **Caching**
   - Use appropriate cache headers
   - Implement service worker caching strategies
   - Monitor cache hit rates

## Troubleshooting

### Common Issues

1. **Large Bundle Size**
   - Check for unused dependencies
   - Analyze bundle with `pnpm run build`
   - Consider code splitting

2. **Slow Image Loading**
   - Ensure WebP images exist
   - Check lazy loading implementation
   - Verify image sizes are appropriate

3. **Poor Core Web Vitals**
   - Monitor LCP (Largest Contentful Paint)
   - Check for layout shifts
   - Optimize critical rendering path

### Performance Tools

- **Lighthouse**: Run audits in Chrome DevTools
- **WebPageTest**: Detailed performance analysis
- **Bundle Analyzer**: Analyze JavaScript bundles
- **ImageOptim**: Manual image optimization

## Future Improvements

1. **Advanced Caching**
   - Implement stale-while-revalidate
   - Add cache warming strategies
   - Optimize cache invalidation

2. **Image Optimization**
   - Implement AVIF format support
   - Add automatic responsive images
   - Implement image CDN

3. **Performance Monitoring**
   - Add Real User Monitoring (RUM)
   - Implement performance budgets
   - Add automated performance testing

## Resources

- [Web.dev Performance](https://web.dev/performance/)
- [Lighthouse Documentation](https://developers.google.com/web/tools/lighthouse)
- [Vite Performance Guide](https://vitejs.dev/guide/performance.html)
- [WebP Documentation](https://developers.google.com/speed/webp)
