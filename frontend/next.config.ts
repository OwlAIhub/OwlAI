const nextConfig = {
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
  },
  // Turbopack configuration (moved from experimental.turbo)
  turbopack: {
    rules: {
      '*.svg': {
        loaders: ['@svgr/webpack'],
        as: '*.js',
      },
    },
    // Set root directory to avoid lockfile warnings
    root: './',
  },
  // Handle hydration issues caused by browser extensions
  reactStrictMode: true,
  images: {
    // Allow using quality=95 in <Image /> and custom components
    qualities: [95],
    formats: ['image/webp', 'image/avif'],
    minimumCacheTTL: 31536000, // 1 year
  },
  // Compiler optimizations
  compiler: {
    removeConsole: process.env.NODE_ENV === 'production',
  },
  // Bundle optimization
  webpack: (
    config: any,
    { dev, isServer }: { dev: boolean; isServer: boolean }
  ) => {
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
