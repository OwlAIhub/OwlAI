import type { NextConfig } from 'next';

// Environment variable validation for production builds
const validateEnvironmentVariables = () => {
  const requiredVars = [
    'NEXT_PUBLIC_FIREBASE_API_KEY',
    'NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN',
    'NEXT_PUBLIC_FIREBASE_PROJECT_ID',
    'NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET',
    'NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID',
    'NEXT_PUBLIC_FIREBASE_APP_ID',
  ];

  const missingVars = requiredVars.filter(varName => !process.env[varName]);

  if (missingVars.length > 0) {
    console.error(
      '❌ Missing required environment variables:',
      missingVars.join(', ')
    );
    console.error(
      'Please check your .env.local file and ensure all required variables are set.'
    );

    // In production builds, fail the build if environment variables are missing
    if (process.env.NODE_ENV === 'production') {
      throw new Error(
        `Missing required environment variables: ${missingVars.join(', ')}`
      );
    }
  } else {
    console.log('✅ All required environment variables are present');
  }
};

// Validate environment variables during build
validateEnvironmentVariables();

const nextConfig: NextConfig = {
  // Firebase Hosting configuration (Static Export)
  output: 'export',
  trailingSlash: true,
  distDir: 'out',

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
