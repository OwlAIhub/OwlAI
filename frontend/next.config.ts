import type { NextConfig } from 'next';

// Import configuration to validate environment variables
// Avoid importing app code here to prevent Turbopack from resolving app paths during dev

const isProduction = process.env.NODE_ENV === 'production';
const isDevelopment = process.env.NODE_ENV === 'development';

const nextConfig: NextConfig = {
  // Firebase Hosting configuration (Static Export)
  output: 'export',
  trailingSlash: true,
  distDir: 'out',
  outputFileTracingRoot: __dirname,

  // Performance optimizations
  experimental: {
    optimizePackageImports: [
      'lucide-react',
      'framer-motion',
      '@radix-ui/react-accordion',
      '@radix-ui/react-avatar',
      '@radix-ui/react-collapsible',
      '@radix-ui/react-dialog',
      '@radix-ui/react-dropdown-menu',
      '@radix-ui/react-label',
      '@radix-ui/react-separator',
      '@radix-ui/react-slot',
      '@radix-ui/react-tooltip',
    ],
    // Enable faster page transitions
    scrollRestoration: true,
    // Optimize client-side navigation
    optimizeCss: isProduction,
  },

  // Handle hydration issues caused by browser extensions
  reactStrictMode: true,

  images: {
    // Disable image optimization for Firebase Hosting compatibility
    unoptimized: true,
    // Configure qualities to avoid warnings
    qualities: [95],
    // Allow external domains for images
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'assets.aceternity.com',
        port: '',
        pathname: '/**',
      },
    ],
  },

  // Compiler optimizations
  compiler: {
    removeConsole: isProduction
      ? {
          exclude: ['error', 'warn'],
        }
      : false,
  },

  // Bundle optimization
  webpack: (config, { dev, isServer }: { dev: boolean; isServer: boolean }) => {
    if (!dev && !isServer) {
      config.optimization.splitChunks = {
        chunks: 'all',
        cacheGroups: {
          vendor: {
            test: /[\\/]node_modules[\\/]/,
            name: 'vendors',
            chunks: 'all',
          },
          firebase: {
            test: /[\\/]node_modules[\\/](firebase|@firebase)[\\/]/,
            name: 'firebase',
            chunks: 'all',
            priority: 10,
          },
          ui: {
            test: /[\\/]node_modules[\\/](@radix-ui|lucide-react)[\\/]/,
            name: 'ui',
            chunks: 'all',
            priority: 9,
          },
        },
      };
    }
    return config;
  },

  // Security headers
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'X-Frame-Options',
            value: 'DENY',
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
          {
            key: 'Referrer-Policy',
            value: 'origin-when-cross-origin',
          },
          {
            key: 'Permissions-Policy',
            value:
              'camera=(), microphone=(), geolocation=(), payment=(), usb=()',
          },
          {
            key: 'Strict-Transport-Security',
            value: 'max-age=31536000; includeSubDomains',
          },
          {
            key: 'X-XSS-Protection',
            value: '1; mode=block',
          },
        ],
      },
      {
        source: '/static/(.*)',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable',
          },
        ],
      },
    ];
  },

  // Redirects for production
  async redirects() {
    return [
      {
        source: '/dashboard',
        destination: '/chat',
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
