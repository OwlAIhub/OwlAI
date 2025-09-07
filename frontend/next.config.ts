import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  // Firebase Hosting configuration
  output: 'standalone',
  trailingSlash: true,
  outputFileTracingRoot: __dirname,

  // Firebase Admin SDK support
  serverExternalPackages: ['firebase-admin'],

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
    optimizeCss: true,
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
    removeConsole: process.env.NODE_ENV === 'production',
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
        },
      };
    }
    return config;
  },
};

export default nextConfig;
