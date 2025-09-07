# PERFORMANCE OPTIMIZATION RULES

# Comprehensive guidelines for generating high-performance, scalable code

## CORE PERFORMANCE PRINCIPLES

### Performance Budget Targets (Production Requirements)

- **First Contentful Paint (FCP)**: < 1.8s
- **Largest Contentful Paint (LCP)**: < 2.5s
- **First Input Delay (FID)**: < 100ms
- **Cumulative Layout Shift (CLS)**: < 0.1
- **Time to Interactive (TTI)**: < 3.8s
- **Total Blocking Time (TBT)**: < 200ms
- **Bundle Size**: < 250KB gzipped for initial load
- **Memory Usage**: < 50MB for typical web apps
- **Database Query Time**: < 100ms for simple queries, < 500ms for complex

### Performance Philosophy

- **Optimize for the critical path**: Prioritize loading and rendering essential content
- **Measure first, optimize second**: Use real performance data to guide optimization
- **Progressive enhancement**: Start with core functionality, enhance with features
- **Budget-conscious development**: Every feature addition must justify its performance cost

## FRONTEND PERFORMANCE OPTIMIZATION

### React Performance Patterns

```typescript
import React, { memo, useMemo, useCallback, lazy, Suspense } from 'react';
import { FixedSizeList as List } from 'react-window';

// ✅ Memoization for expensive computations
const ExpensiveComponent = memo<{ data: DataType[]; filter: string }>(({ data, filter }) => {
  // Memoize expensive calculations
  const processedData = useMemo(() => {
    console.time('Data processing');
    const result = data
      .filter(item => item.name.toLowerCase().includes(filter.toLowerCase()))
      .sort((a, b) => a.priority - b.priority)
      .slice(0, 100); // Limit results for performance
    console.timeEnd('Data processing');
    return result;
  }, [data, filter]);

  // Memoize event handlers to prevent unnecessary re-renders
  const handleItemClick = useCallback((id: string) => {
    // Optimistic UI update
    setSelectedId(id);
    // Async operation
    updateSelectedItem(id);
  }, []);

  const handleBatchOperation = useCallback(async (items: string[]) => {
    // Batch operations for better performance
    const batchSize = 10;
    for (let i = 0; i < items.length; i += batchSize) {
      const batch = items.slice(i, i + batchSize);
      await processBatch(batch);

      // Yield control to prevent blocking UI
      await new Promise(resolve => setTimeout(resolve, 0));
    }
  }, []);

  return (
    <div>
      {processedData.map(item => (
        <ItemComponent
          key={item.id}
          item={item}
          onClick={handleItemClick}
        />
      ))}
    </div>
  );
});

// ✅ Code splitting with lazy loading
const HeavyChartComponent = lazy(() =>
  import('./charts/HeavyChart').then(module => ({
    default: module.HeavyChart
  }))
);

const LazyComponentWithFallback = () => (
  <Suspense fallback={<ChartSkeleton />}>
    <HeavyChartComponent />
  </Suspense>
);

// ✅ Virtualization for large lists
interface VirtualizedListProps {
  items: ListItem[];
  height: number;
  itemHeight: number;
}

const VirtualizedList: React.FC<VirtualizedListProps> = ({
  items,
  height,
  itemHeight
}) => {
  const Row = useCallback(({ index, style }: { index: number; style: React.CSSProperties }) => (
    <div style={style}>
      <ListItemComponent item={items[index]} />
    </div>
  ), [items]);

  return (
    <List
      height={height}
      itemCount={items.length}
      itemSize={itemHeight}
      itemData={items}
      overscanCount={5} // Render 5 extra items for smooth scrolling
    >
      {Row}
    </List>
  );
};

// ✅ Optimized state updates
const useOptimizedState = <T>(initialValue: T) => {
  const [state, setState] = useState(initialValue);

  // Batch state updates
  const batchedSetState = useCallback((updates: Partial<T>[]) => {
    setState(prevState => {
      return updates.reduce((acc, update) => ({ ...acc, ...update }), prevState);
    });
  }, []);

  // Debounced state updates for high-frequency changes
  const debouncedSetState = useMemo(
    () => debounce((newState: T) => setState(newState), 300),
    []
  );

  return [state, setState, batchedSetState, debouncedSetState] as const;
};

// ✅ Intersection Observer for lazy loading
const LazyImage: React.FC<{ src: string; alt: string; className?: string }> = ({
  src,
  alt,
  className
}) => {
  const [imageSrc, setImageSrc] = useState<string>();
  const [imageRef, setImageRef] = useState<HTMLImageElement | null>(null);

  useEffect(() => {
    let observer: IntersectionObserver;

    if (imageRef && imageSrc !== src) {
      observer = new IntersectionObserver(
        entries => {
          entries.forEach(entry => {
            if (entry.isIntersecting) {
              setImageSrc(src);
              observer.unobserve(imageRef);
            }
          });
        },
        { threshold: 0.1 }
      );
      observer.observe(imageRef);
    }

    return () => observer?.disconnect();
  }, [imageRef, src, imageSrc]);

  return (
    <img
      ref={setImageRef}
      src={imageSrc || 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjZGRkIi8+PC9zdmc+'}
      alt={alt}
      className={className}
      loading="lazy"
      decoding="async"
    />
  );
};
```

### Next.js Performance Optimization

```typescript
import Image from 'next/image';
import dynamic from 'next/dynamic';
import { Metadata } from 'next';

// ✅ Optimized Image component usage
const OptimizedImageGallery: React.FC<{ images: ImageData[] }> = ({ images }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {images.map((image, index) => (
        <div key={image.id} className="relative aspect-square">
          <Image
            src={image.src}
            alt={image.alt}
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            className="object-cover rounded-lg"
            placeholder="blur"
            blurDataURL={image.blurDataURL}
            priority={index < 3} // Only prioritize first 3 images
            quality={85} // Optimize quality vs file size
          />
        </div>
      ))}
    </div>
  );
};

// ✅ Dynamic imports with loading states
const DynamicChart = dynamic(
  () => import('./Chart').then(mod => mod.Chart),
  {
    loading: () => <ChartSkeleton />,
    ssr: false // Skip SSR for heavy client-side components
  }
);

const DynamicEditor = dynamic(
  () => import('./RichTextEditor'),
  {
    loading: () => <div>Loading editor...</div>,
    ssr: false
  }
);

// ✅ Optimized page metadata for SEO and performance
export const metadata: Metadata = {
  title: 'Dashboard | MyApp',
  description: 'User dashboard with analytics and reports',
  robots: {
    index: true,
    follow: true,
  },
  openGraph: {
    title: 'Dashboard | MyApp',
    description: 'User dashboard with analytics and reports',
    images: [
      {
        url: '/og-dashboard.jpg',
        width: 1200,
        height: 630,
        alt: 'Dashboard Preview',
      },
    ],
  },
};

// ✅ Server Component with optimized data fetching
export default async function DashboardPage() {
  // Parallel data fetching for better performance
  const [userData, analyticsData, reportsData] = await Promise.all([
    fetchUserData(),
    fetchAnalyticsData(),
    fetchReportsData(),
  ]);

  return (
    <div className="container mx-auto px-4 py-8">
      <UserInfo user={userData} />

      <Suspense fallback={<AnalyticsSkeleton />}>
        <AnalyticsDashboard data={analyticsData} />
      </Suspense>

      <Suspense fallback={<ReportsSkeleton />}>
        <ReportsSection data={reportsData} />
      </Suspense>

      {/* Load heavy components only when needed */}
      <DynamicChart />
      <DynamicEditor />
    </div>
  );
}

// ✅ Optimized API route with caching
export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const userId = searchParams.get('userId');

  if (!userId) {
    return NextResponse.json({ error: 'Missing userId' }, { status: 400 });
  }

  try {
    // Cache key for this specific request
    const cacheKey = `user-dashboard-${userId}`;

    // Try to get from cache first
    const cached = await redis.get(cacheKey);
    if (cached) {
      return NextResponse.json(JSON.parse(cached), {
        headers: {
          'Cache-Control': 'public, s-maxage=300, stale-while-revalidate=600',
          'X-Cache': 'HIT'
        }
      });
    }

    // Fetch fresh data
    const dashboardData = await getDashboardData(userId);

    // Cache for 5 minutes
    await redis.setex(cacheKey, 300, JSON.stringify(dashboardData));

    return NextResponse.json(dashboardData, {
      headers: {
        'Cache-Control': 'public, s-maxage=300, stale-while-revalidate=600',
        'X-Cache': 'MISS'
      }
    });
  } catch (error) {
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
```

### Bundle Optimization Strategies

```typescript
// ✅ Tree shaking optimization - Import only what you need
import { debounce, throttle } from 'lodash-es'; // Use ES modules version
import { format } from 'date-fns/format'; // Import specific functions
import { Button } from '@/components/ui/button'; // Specific component imports

// ❌ Avoid importing entire libraries
// import _ from 'lodash'; // Imports entire library
// import * as dateFns from 'date-fns'; // Imports everything

// ✅ Webpack bundle analysis configuration
// next.config.js
const withBundleAnalyzer = require('@next/bundle-analyzer')({
  enabled: process.env.ANALYZE === 'true',
});

module.exports = withBundleAnalyzer({
  webpack: (config, { dev, isServer }) => {
    // Optimize bundle splitting
    if (!dev && !isServer) {
      config.optimization.splitChunks = {
        chunks: 'all',
        cacheGroups: {
          vendor: {
            test: /[\\/]node_modules[\\/]/,
            name: 'vendors',
            chunks: 'all',
          },
          common: {
            name: 'common',
            minChunks: 2,
            chunks: 'all',
            enforce: true,
          },
        },
      };
    }
    return config;
  },

  // Enable experimental features for performance
  experimental: {
    optimizeCss: true,
    optimizePackageImports: ['lucide-react', '@radix-ui/react-icons'],
  },

  // Compression and optimization
  compress: true,
  poweredByHeader: false,

  // Image optimization
  images: {
    formats: ['image/webp', 'image/avif'],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
  },
});

// ✅ Dynamic imports for route-based code splitting
const routes = {
  '/dashboard': () => import('./pages/Dashboard'),
  '/profile': () => import('./pages/Profile'),
  '/settings': () => import('./pages/Settings'),
};

const LazyRoute: React.FC<{ path: string }> = ({ path }) => {
  const Component = lazy(routes[path]);

  return (
    <Suspense fallback={<PageSkeleton />}>
      <Component />
    </Suspense>
  );
};

// ✅ Service Worker for caching and performance
// public/sw.js
const CACHE_NAME = 'myapp-v1';
const urlsToCache = [
  '/',
  '/static/css/main.css',
  '/static/js/main.js',
  '/images/logo.png',
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => cache.addAll(urlsToCache))
  );
});

self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request)
      .then((response) => {
        // Return cached version or fetch from network
        return response || fetch(event.request);
      })
  );
});
```

## BACKEND PERFORMANCE OPTIMIZATION

### Database Query Optimization

```typescript
import { PrismaClient } from '@prisma/client';
import Redis from 'ioredis';

const prisma = new PrismaClient({
  log: ['query', 'info', 'warn', 'error'],
});

const redis = new Redis(process.env.REDIS_URL);

// ✅ Efficient database queries with proper indexing
export class OptimizedUserService {
  // Optimized query with selective field loading
  async getUsersWithPosts(limit: number = 20, offset: number = 0) {
    return prisma.user.findMany({
      take: limit,
      skip: offset,
      select: {
        id: true,
        name: true,
        email: true,
        // Only select needed fields to reduce data transfer
        posts: {
          take: 5, // Limit related data
          select: {
            id: true,
            title: true,
            createdAt: true,
          },
          orderBy: {
            createdAt: 'desc',
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });
  }

  // Pagination with cursor-based approach for better performance
  async getPaginatedPosts(cursor?: string, limit: number = 20) {
    const posts = await prisma.post.findMany({
      take: limit + 1, // Get one extra to determine if there are more
      cursor: cursor ? { id: cursor } : undefined,
      select: {
        id: true,
        title: true,
        content: true,
        createdAt: true,
        author: {
          select: {
            id: true,
            name: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    const hasNextPage = posts.length > limit;
    const items = hasNextPage ? posts.slice(0, -1) : posts;
    const nextCursor = hasNextPage ? items[items.length - 1].id : null;

    return {
      items,
      nextCursor,
      hasNextPage,
    };
  }

  // Optimized search with full-text search and indexing
  async searchUsers(query: string, limit: number = 10) {
    // Use database full-text search for better performance
    return prisma.$queryRaw`
      SELECT id, name, email, ts_rank(search_vector, plainto_tsquery(${query})) as rank
      FROM users
      WHERE search_vector @@ plainto_tsquery(${query})
      ORDER BY rank DESC
      LIMIT ${limit}
    `;
  }

  // Batch operations for better performance
  async batchCreateUsers(users: CreateUserInput[]) {
    const batchSize = 100;
    const results = [];

    for (let i = 0; i < users.length; i += batchSize) {
      const batch = users.slice(i, i + batchSize);
      const batchResult = await prisma.user.createMany({
        data: batch,
        skipDuplicates: true,
      });
      results.push(batchResult);

      // Add small delay to prevent overwhelming the database
      if (i + batchSize < users.length) {
        await new Promise(resolve => setTimeout(resolve, 10));
      }
    }

    return results;
  }

  // Connection pooling and optimization
  async getConnectionStats() {
    return {
      activeConnections: prisma.$metrics.histogram(
        'prisma_client_queries_total'
      ),
      connectionPoolSize: process.env.DATABASE_CONNECTION_LIMIT || 10,
    };
  }
}

// ✅ Advanced caching strategies
export class CacheService {
  // Multi-layer caching with TTL
  async getCachedData<T>(
    key: string,
    fetchFunction: () => Promise<T>,
    options: {
      ttl?: number;
      staleWhileRevalidate?: number;
      tags?: string[];
    } = {}
  ): Promise<T> {
    const { ttl = 3600, staleWhileRevalidate = 300, tags = [] } = options;

    try {
      // Try L1 cache (Redis)
      const cached = await redis.get(key);
      if (cached) {
        const data = JSON.parse(cached);

        // Check if data is stale but still usable
        const cacheTime = await redis.get(`${key}:timestamp`);
        const isStale =
          cacheTime && Date.now() - parseInt(cacheTime) > ttl * 1000;

        if (isStale && staleWhileRevalidate > 0) {
          // Return stale data immediately, refresh in background
          this.refreshCacheInBackground(key, fetchFunction, ttl, tags);
        }

        return data;
      }
    } catch (error) {
      console.warn('Cache read error:', error);
    }

    // Cache miss - fetch fresh data
    const data = await fetchFunction();

    // Store in cache with timestamp
    try {
      await Promise.all([
        redis.setex(key, ttl, JSON.stringify(data)),
        redis.setex(
          `${key}:timestamp`,
          ttl + staleWhileRevalidate,
          Date.now().toString()
        ),
        ...tags.map(tag => redis.sadd(`tag:${tag}`, key)),
      ]);
    } catch (error) {
      console.warn('Cache write error:', error);
    }

    return data;
  }

  private async refreshCacheInBackground<T>(
    key: string,
    fetchFunction: () => Promise<T>,
    ttl: number,
    tags: string[]
  ) {
    try {
      const freshData = await fetchFunction();
      await Promise.all([
        redis.setex(key, ttl, JSON.stringify(freshData)),
        redis.setex(`${key}:timestamp`, ttl + 300, Date.now().toString()),
        ...tags.map(tag => redis.sadd(`tag:${tag}`, key)),
      ]);
    } catch (error) {
      console.error('Background cache refresh error:', error);
    }
  }

  // Cache invalidation by tags
  async invalidateByTag(tag: string) {
    const keys = await redis.smembers(`tag:${tag}`);
    if (keys.length > 0) {
      const pipeline = redis.pipeline();
      keys.forEach(key => {
        pipeline.del(key);
        pipeline.del(`${key}:timestamp`);
      });
      pipeline.del(`tag:${tag}`);
      await pipeline.exec();
    }
  }

  // Distributed locking for cache stampede prevention
  async withLock<T>(
    lockKey: string,
    operation: () => Promise<T>,
    options: { timeout?: number; retryDelay?: number } = {}
  ): Promise<T> {
    const { timeout = 10000, retryDelay = 100 } = options;
    const lockValue = Math.random().toString(36);
    const startTime = Date.now();

    while (Date.now() - startTime < timeout) {
      const acquired = await redis.set(lockKey, lockValue, 'PX', 5000, 'NX');

      if (acquired === 'OK') {
        try {
          return await operation();
        } finally {
          // Release lock safely
          await redis.eval(
            `
            if redis.call("get", KEYS[1]) == ARGV[1] then
              return redis.call("del", KEYS[1])
            else
              return 0
            end
          `,
            1,
            lockKey,
            lockValue
          );
        }
      }

      await new Promise(resolve => setTimeout(resolve, retryDelay));
    }

    throw new Error(`Failed to acquire lock: ${lockKey}`);
  }
}
```

### API Response Optimization

```typescript
import compression from 'compression';
import { Transform } from 'stream';

// ✅ Compression middleware with optimization
export const optimizedCompression = compression({
  level: 6, // Balance between compression ratio and CPU usage
  threshold: 1024, // Only compress responses larger than 1KB
  filter: (req, res) => {
    // Don't compress images, videos, or already compressed content
    const contentType = res.getHeader('Content-Type') as string;
    if (
      contentType?.includes('image/') ||
      contentType?.includes('video/') ||
      contentType?.includes('application/pdf')
    ) {
      return false;
    }
    return compression.filter(req, res);
  },
  // Use different compression for different content types
  strategy: (req, res) => {
    const contentType = res.getHeader('Content-Type') as string;
    if (contentType?.includes('application/json')) {
      return compression.constants.Z_BEST_COMPRESSION;
    }
    return compression.constants.Z_DEFAULT_COMPRESSION;
  },
});

// ✅ Response streaming for large datasets
export const streamLargeResponse = (
  data: any[],
  res: Response,
  options: { batchSize?: number; delay?: number } = {}
) => {
  const { batchSize = 100, delay = 0 } = options;

  res.writeHead(200, {
    'Content-Type': 'application/json',
    'Transfer-Encoding': 'chunked',
    'Cache-Control': 'no-cache',
  });

  const writeStream = new Transform({
    writableObjectMode: true,
    transform(chunk, encoding, callback) {
      this.push(JSON.stringify(chunk) + '\n');
      callback();
    },
  });

  writeStream.pipe(res);

  // Stream data in batches
  let index = 0;
  const sendBatch = async () => {
    const batch = data.slice(index, index + batchSize);

    for (const item of batch) {
      writeStream.write(item);
    }

    index += batchSize;

    if (index < data.length) {
      if (delay > 0) {
        setTimeout(sendBatch, delay);
      } else {
        setImmediate(sendBatch);
      }
    } else {
      writeStream.end();
    }
  };

  sendBatch();
};

// ✅ Response caching with smart invalidation
export const createCacheMiddleware = (options: {
  ttl: number;
  varyBy?: string[];
  tags?: string[];
  condition?: (req: Request) => boolean;
}) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    const { ttl, varyBy = [], tags = [], condition } = options;

    // Skip caching based on condition
    if (condition && !condition(req)) {
      return next();
    }

    // Generate cache key based on request
    const keyParts = [
      req.originalUrl,
      ...varyBy.map(header => req.get(header) || ''),
      req.user?.id || 'anonymous',
    ];
    const cacheKey = `response:${Buffer.from(keyParts.join(':')).toString('base64')}`;

    try {
      // Try to get cached response
      const cached = await redis.get(cacheKey);
      if (cached) {
        const { data, headers, status } = JSON.parse(cached);

        // Set original headers
        Object.entries(headers).forEach(([key, value]) => {
          res.setHeader(key, value as string);
        });

        res.setHeader('X-Cache', 'HIT');
        return res.status(status).json(data);
      }
    } catch (error) {
      console.warn('Cache read error:', error);
    }

    // Intercept response to cache it
    const originalJson = res.json;
    res.json = function (data: any) {
      // Cache successful responses
      if (res.statusCode >= 200 && res.statusCode < 300) {
        const cacheData = {
          data,
          headers: res.getHeaders(),
          status: res.statusCode,
        };

        redis
          .setex(cacheKey, ttl, JSON.stringify(cacheData))
          .catch(console.warn);

        // Associate with tags for invalidation
        if (tags.length > 0) {
          const pipeline = redis.pipeline();
          tags.forEach(tag => pipeline.sadd(`tag:${tag}`, cacheKey));
          pipeline.exec().catch(console.warn);
        }
      }

      res.setHeader('X-Cache', 'MISS');
      return originalJson.call(this, data);
    };

    next();
  };
};

// ✅ Request deduplication for identical concurrent requests
const pendingRequests = new Map<string, Promise<any>>();

export const deduplicateRequests = (keyGenerator: (req: Request) => string) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    const key = keyGenerator(req);

    if (pendingRequests.has(key)) {
      // Wait for the existing request to complete
      try {
        const result = await pendingRequests.get(key);
        return res.json(result);
      } catch (error) {
        return next(error);
      }
    }

    // Create a promise for this request
    const requestPromise = new Promise((resolve, reject) => {
      const originalJson = res.json;
      const originalStatus = res.status;

      res.json = function (data: any) {
        pendingRequests.delete(key);
        resolve(data);
        return originalJson.call(this, data);
      };

      res.on('error', error => {
        pendingRequests.delete(key);
        reject(error);
      });

      next();
    });

    pendingRequests.set(key, requestPromise);
  };
};
```

## MONITORING & PROFILING

### Performance Monitoring Setup

```typescript
import { performance, PerformanceObserver } from 'perf_hooks';
import { EventEmitter } from 'events';

// ✅ Comprehensive performance monitoring
export class PerformanceMonitor extends EventEmitter {
  private metrics: Map<string, number[]> = new Map();
  private observer: PerformanceObserver;

  constructor() {
    super();
    this.setupPerformanceObserver();
  }

  private setupPerformanceObserver() {
    this.observer = new PerformanceObserver(list => {
      const entries = list.getEntries();
      entries.forEach(entry => {
        this.recordMetric(entry.name, entry.duration);

        // Alert on slow operations
        if (entry.duration > 1000) {
          this.emit('slowOperation', {
            name: entry.name,
            duration: entry.duration,
            timestamp: Date.now(),
          });
        }
      });
    });

    this.observer.observe({ entryTypes: ['measure', 'function'] });
  }

  // Record custom metrics
  recordMetric(name: string, value: number) {
    if (!this.metrics.has(name)) {
      this.metrics.set(name, []);
    }

    const values = this.metrics.get(name)!;
    values.push(value);

    // Keep only last 100 measurements
    if (values.length > 100) {
      values.shift();
    }
  }

  // Performance timer utility
  timer(label: string) {
    const start = performance.now();

    return {
      end: () => {
        const duration = performance.now() - start;
        this.recordMetric(label, duration);

        if (process.env.NODE_ENV === 'development') {
          console.log(`${label}: ${duration.toFixed(2)}ms`);
        }

        return duration;
      },
    };
  }

  // Async operation timing
  async timeAsync<T>(label: string, operation: () => Promise<T>): Promise<T> {
    const timer = this.timer(label);
    try {
      const result = await operation();
      timer.end();
      return result;
    } catch (error) {
      timer.end();
      throw error;
    }
  }

  // Get performance statistics
  getStats(metricName: string) {
    const values = this.metrics.get(metricName) || [];
    if (values.length === 0) return null;

    const sorted = [...values].sort((a, b) => a - b);
    return {
      count: values.length,
      min: sorted[0],
      max: sorted[sorted.length - 1],
      mean: values.reduce((a, b) => a + b, 0) / values.length,
      median: sorted[Math.floor(sorted.length / 2)],
      p95: sorted[Math.floor(sorted.length * 0.95)],
      p99: sorted[Math.floor(sorted.length * 0.99)],
    };
  }

  // Memory usage monitoring
  getMemoryUsage() {
    const usage = process.memoryUsage();
    return {
      rss: Math.round(usage.rss / 1024 / 1024), // MB
      heapTotal: Math.round(usage.heapTotal / 1024 / 1024), // MB
      heapUsed: Math.round(usage.heapUsed / 1024 / 1024), // MB
      external: Math.round(usage.external / 1024 / 1024), // MB
      arrayBuffers: Math.round(usage.arrayBuffers / 1024 / 1024), // MB
    };
  }

  // CPU usage monitoring
  getCPUUsage() {
    const usage = process.cpuUsage();
    return {
      user: usage.user / 1000, // Convert to milliseconds
      system: usage.system / 1000,
    };
  }

  // Generate performance report
  generateReport() {
    const allMetrics = Array.from(this.metrics.keys()).map(name => ({
      name,
      stats: this.getStats(name),
    }));

    return {
      timestamp: new Date().toISOString(),
      memory: this.getMemoryUsage(),
      cpu: this.getCPUUsage(),
      metrics: allMetrics,
      uptime: process.uptime(),
    };
  }
}

// Global performance monitor instance
export const perfMonitor = new PerformanceMonitor();

// Performance monitoring middleware
export const performanceMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const timer = perfMonitor.timer(
    `${req.method} ${req.route?.path || req.path}`
  );

  res.on('finish', () => {
    const duration = timer.end();

    // Log slow requests
    if (duration > 1000) {
      console.warn(
        `Slow request: ${req.method} ${req.path} - ${duration.toFixed(2)}ms`
      );
    }

    // Track response size
    const contentLength = res.get('Content-Length');
    if (contentLength) {
      perfMonitor.recordMetric('response_size', parseInt(contentLength));
    }
  });

  next();
};
```

### Frontend Performance Monitoring

```typescript
import { getCLS, getFID, getFCP, getLCP, getTTFB } from 'web-vitals';

// ✅ Web Vitals monitoring and reporting
export class WebVitalsMonitor {
  private metrics: Map<string, number> = new Map();
  private reportingEndpoint: string;

  constructor(reportingEndpoint: string = '/api/analytics/vitals') {
    this.reportingEndpoint = reportingEndpoint;
    this.setupVitalsCollection();
  }

  private setupVitalsCollection() {
    const reporter = (metric: any) => {
      this.metrics.set(metric.name, metric.value);
      this.reportMetric(metric);

      // Log poor performance
      if (metric.rating === 'poor') {
        console.warn(`Poor ${metric.name}: ${metric.value}`, metric);
      }
    };

    // Collect all Core Web Vitals
    getCLS(reporter);
    getFID(reporter);
    getFCP(reporter);
    getLCP(reporter);
    getTTFB(reporter);
  }

  private async reportMetric(metric: any) {
    try {
      await fetch(this.reportingEndpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: metric.name,
          value: metric.value,
          rating: metric.rating,
          delta: metric.delta,
          id: metric.id,
          url: window.location.href,
          userAgent: navigator.userAgent,
          timestamp: Date.now()
        })
      });
    } catch (error) {
      console.warn('Failed to report metric:', error);
    }
  }

  // Monitor resource loading performance
  monitorResourceLoading() {
    window.addEventListener('load', () => {
      const navigation = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming;
      const resources = performance.getEntriesByType('resource') as PerformanceResourceTiming[];

      // Analyze navigation timing
      const navigationMetrics = {
        domContentLoaded: navigation.domContentLoadedEventEnd - navigation.domContentLoadedEventStart,
        loadComplete: navigation.loadEventEnd - navigation.loadEventStart,
        domProcessing: navigation.domComplete - navigation.domLoading,
        networkLatency: navigation.responseStart - navigation.requestStart,
        serverProcessing: navigation.responseEnd - navigation.responseStart
      };

      // Analyze resource loading
      const resourceMetrics = resources.reduce((acc, resource) => {
        const type = resource.initiatorType;
        if (!acc[type]) acc[type] = { count: 0, totalSize: 0, totalDuration: 0 };

        acc[type].count++;
        acc[type].totalSize += resource.transferSize || 0;
        acc[type].totalDuration += resource.duration;

        return acc;
      }, {} as Record<string, any>);

      // Report comprehensive performance data
      this.reportMetric({
        name: 'navigation_timing',
        value: navigationMetrics,
        rating: navigationMetrics.loadComplete > 3000 ? 'poor' : 'good'
      });

      this.reportMetric({
        name: 'resource_timing',
        value: resourceMetrics,
        rating: 'neutral'
      });
    });
  }

  // Monitor JavaScript errors and their performance impact
  monitorErrorPerformance() {
    window.addEventListener('error', (event) => {
      this.reportMetric({
        name: 'javascript_error',
        value: {
          message: event.message,
          filename: event.filename,
          lineno: event.lineno,
          colno: event.colno,
          timestamp: Date.now()
        },
        rating: 'poor'
      });
    });

    window.addEventListener('unhandledrejection', (event) => {
      this.reportMetric({
        name: 'unhandled_promise_rejection',
        value: {
          reason: event.reason?.toString(),
          timestamp: Date.now()
        },
        rating: 'poor'
      });
    });
  }

  // Monitor long tasks that block the main thread
  monitorLongTasks() {
    if ('PerformanceObserver' in window) {
      const observer = new PerformanceObserver((list) => {
        list.getEntries().forEach((entry) => {
          this.reportMetric({
            name: 'long_task',
            value: {
              duration: entry.duration,
              startTime: entry.startTime,
              attribution: (entry as any).attribution
            },
            rating: entry.duration > 100 ? 'poor' : 'needs-improvement'
          });
        });
      });

      observer.observe({ entryTypes: ['longtask'] });
    }
  }

  // Get current performance snapshot
  getPerformanceSnapshot() {
    return {
      metrics: Object.fromEntries(this.metrics),
      memory: (performance as any).memory ? {
        usedJSHeapSize: (performance as any).memory.usedJSHeapSize,
        totalJSHeapSize: (performance as any).memory.totalJSHeapSize,
        jsHeapSizeLimit: (performance as any).memory.jsHeapSizeLimit
      } : null,
      navigation: performance.getEntriesByType('navigation')[0],
      resources: performance.getEntriesByType('resource').length,
      timestamp: Date.now()
    };
  }
}

// Initialize web vitals monitoring
export const webVitals = new WebVitalsMonitor();

// React component for performance monitoring
export const PerformanceProfiler: React.FC<{
  children: React.ReactNode;
  id: string;
  onRender?: (id: string, phase: string, actualDuration: number) => void;
}> = ({ children, id, onRender }) => {
  const handleRender = useCallback((
    id: string,
    phase: 'mount' | 'update',
    actualDuration: number,
    baseDuration: number,
    startTime: number,
    commitTime: number
  ) => {
    // Log slow renders
    if (actualDuration > 16) { // More than one frame at 60fps
      console.warn(`Slow render in ${id}: ${actualDuration.toFixed(2)}ms`);
    }

    // Custom reporting
    onRender?.(id, phase, actualDuration);

    // Report to monitoring service
    webVitals.reportMetric({
      name: 'react_render',
      value: {
        id,
        phase,
        actualDuration,
        baseDuration,
        startTime,
        commitTime
      },
      rating: actualDuration > 16 ? 'needs-improvement' : 'good'
    } as any);
  }, [onRender]);

  return (
    <Profiler id={id} onRender={handleRender}>
      {children}
    </Profiler>
  );
};
```

## DATABASE PERFORMANCE OPTIMIZATION

### Advanced Database Patterns

```typescript
// ✅ Connection pooling optimization
const prisma = new PrismaClient({
  datasources: {
    db: {
      url: process.env.DATABASE_URL,
    },
  },
  log: [
    { emit: 'event', level: 'query' },
    { emit: 'event', level: 'error' },
    { emit: 'event', level: 'info' },
    { emit: 'event', level: 'warn' },
  ],
});

// Log slow queries for optimization
prisma.$on('query', e => {
  if (e.duration > 100) {
    // Log queries taking more than 100ms
    console.warn(`Slow query (${e.duration}ms):`, {
      query: e.query,
      params: e.params,
      duration: e.duration,
      timestamp: e.timestamp,
    });
  }
});

// ✅ Query optimization patterns
export class OptimizedDataService {
  // Use database views for complex queries
  async getAnalyticsDashboard(userId: string) {
    // Use a pre-computed database view for better performance
    return prisma.$queryRaw`
      SELECT * FROM user_analytics_view
      WHERE user_id = ${userId}
      AND date_range = 'last_30_days'
    `;
  }

  // Implement read replicas for query optimization
  async getReadOnlyData(query: string, params: any[]) {
    // Route read queries to read replica
    const readReplica = new PrismaClient({
      datasources: {
        db: { url: process.env.DATABASE_READ_REPLICA_URL },
      },
    });

    try {
      return await readReplica.$queryRawUnsafe(query, ...params);
    } finally {
      await readReplica.$disconnect();
    }
  }

  // Implement database result streaming for large datasets
  async streamLargeDataset(
    query: string,
    batchSize: number = 1000,
    callback: (batch: any[]) => Promise<void>
  ) {
    let offset = 0;
    let hasMore = true;

    while (hasMore) {
      const batch = await prisma.$queryRawUnsafe(
        `${query} LIMIT ${batchSize} OFFSET ${offset}`
      );

      if (Array.isArray(batch) && batch.length > 0) {
        await callback(batch);
        offset += batchSize;
        hasMore = batch.length === batchSize;
      } else {
        hasMore = false;
      }

      // Prevent overwhelming the database
      await new Promise(resolve => setTimeout(resolve, 10));
    }
  }

  // Implement materialized views for complex aggregations
  async refreshMaterializedViews() {
    const views = [
      'user_statistics_mv',
      'daily_metrics_mv',
      'monthly_reports_mv',
    ];

    for (const view of views) {
      const timer = perfMonitor.timer(`refresh_${view}`);
      await prisma.$executeRawUnsafe(`REFRESH MATERIALIZED VIEW ${view}`);
      timer.end();
    }
  }

  // Database transaction optimization
  async performComplexTransaction(operations: Array<() => Promise<any>>) {
    return prisma.$transaction(
      async tx => {
        const results = [];

        // Execute operations with batch processing
        for (let i = 0; i < operations.length; i += 5) {
          const batch = operations.slice(i, i + 5);
          const batchResults = await Promise.all(batch.map(op => op()));
          results.push(...batchResults);

          // Checkpoint for long transactions
          if (i > 0 && i % 50 === 0) {
            await tx.$executeRaw`SELECT pg_sleep(0.01)`; // Micro-break
          }
        }

        return results;
      },
      {
        maxWait: 10000, // Maximum wait time
        timeout: 30000, // Transaction timeout
      }
    );
  }
}
```

## PRODUCTION DEPLOYMENT OPTIMIZATION

### Docker and Container Optimization

```dockerfile
# ✅ Multi-stage Docker build for optimal performance
FROM node:18-alpine AS base
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production && npm cache clean --force

FROM node:18-alpine AS build
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

FROM node:18-alpine AS production
WORKDIR /app

# Create non-root user for security
RUN addgroup -g 1001 -S nodejs
RUN adduser -S nextjs -u 1001

# Copy built application
COPY --from=build --chown=nextjs:nodejs /app/.next ./.next
COPY --from=base --chown=nextjs:nodejs /app/node_modules ./node_modules
COPY --from=build --chown=nextjs:nodejs /app/public ./public
COPY --from=build --chown=nextjs:nodejs /app/package.json ./package.json

USER nextjs

EXPOSE 3000

# Health check for container orchestration
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD node healthcheck.js

CMD ["npm", "start"]
```

```javascript
// healthcheck.js - Container health check
const http = require('http');

const options = {
  hostname: 'localhost',
  port: 3000,
  path: '/api/health',
  timeout: 2000,
};

const request = http.request(options, res => {
  if (res.statusCode === 200) {
    process.exit(0);
  } else {
    process.exit(1);
  }
});

request.on('error', () => {
  process.exit(1);
});

request.end();
```

### CDN and Caching Strategy

```typescript
// ✅ Advanced CDN configuration
export const cdnConfig = {
  // Static asset optimization
  staticAssets: {
    images: {
      maxAge: '1y',
      immutable: true,
      formats: ['webp', 'avif', 'jpg'],
      sizes: [640, 750, 828, 1080, 1200, 1920],
      quality: 85,
    },
    scripts: {
      maxAge: '1y',
      immutable: true,
      compression: 'br',
    },
    styles: {
      maxAge: '1y',
      immutable: true,
      minification: true,
    },
  },

  // API response caching
  apiCaching: {
    public: {
      maxAge: '5m',
      staleWhileRevalidate: '1h',
    },
    private: {
      maxAge: '1m',
      noStore: true,
    },
    static: {
      maxAge: '1d',
      immutable: true,
    },
  },
};

// Cache header middleware
export const setCacheHeaders = (type: keyof typeof cdnConfig.apiCaching) => {
  return (req: Request, res: Response, next: NextFunction) => {
    const config = cdnConfig.apiCaching[type];

    res.setHeader('Cache-Control', `public, max-age=${config.maxAge}`);

    if (config.staleWhileRevalidate) {
      res.setHeader(
        'Cache-Control',
        `${res.getHeader('Cache-Control')}, stale-while-revalidate=${config.staleWhileRevalidate}`
      );
    }

    if (config.immutable) {
      res.setHeader(
        'Cache-Control',
        `${res.getHeader('Cache-Control')}, immutable`
      );
    }

    if (config.noStore) {
      res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate');
    }

    next();
  };
};
```

## CODE GENERATION PERFORMANCE RULES

### Mandatory Performance Checklist for All Generated Code

When generating ANY code, ALWAYS ensure:

1. **Lazy Loading**: Implement lazy loading for non-critical resources
2. **Memoization**: Use React.memo, useMemo, useCallback for expensive operations
3. **Bundle Optimization**: Use dynamic imports and code splitting
4. **Database Efficiency**: Use selective field loading and proper indexing
5. **Caching Strategy**: Implement appropriate caching at multiple levels
6. **Compression**: Enable compression for responses and assets
7. **Monitoring**: Add performance monitoring and logging
8. **Memory Management**: Prevent memory leaks and optimize garbage collection
9. **Network Optimization**: Minimize requests and optimize payload sizes
10. **Progressive Loading**: Implement progressive enhancement and skeleton screens

### Performance Code Generation Prompts

Use these prompts to ensure performant code generation:

- "Generate this component with React.memo and proper memoization"
- "Create this API with caching, compression, and performance monitoring"
- "Build this database query with proper indexing and selective loading"
- "Implement this feature with lazy loading and code splitting"
- "Add performance monitoring and optimization to this function"
- "Create this component with virtualization for large datasets"
- "Optimize this code for Core Web Vitals and page speed"
- "Implement this with proper error boundaries and performance budgets"

### Performance Review Checklist

Before deploying generated code, verify:

- [ ] Critical resources are prioritized and optimized
- [ ] Non-critical resources are lazy loaded
- [ ] Database queries use proper indexing and field selection
- [ ] Caching is implemented at appropriate levels
- [ ] Bundle size is within performance budget
- [ ] Memory usage is optimized and monitored
- [ ] Performance monitoring is in place
- [ ] Images and assets are optimized
- [ ] Network requests are minimized and batched
- [ ] Error handling doesn't impact performance
