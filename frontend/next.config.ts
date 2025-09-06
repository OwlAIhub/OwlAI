const nextConfig = {
  // Static file handling
  trailingSlash: false,
  // Performance optimizations
  experimental: {
    optimizePackageImports: [
      'lucide-react',
      'framer-motion',
      '@radix-ui/react-accordion',
      '@radix-ui/react-label',
      '@radix-ui/react-separator',
      '@radix-ui/react-slot',
    ],
    // Reduce hydration mismatches
    optimizeCss: true,
  },
  // Webpack configuration to fix module resolution issues
  webpack: (config: any, { isServer }: { isServer: boolean }) => {
    if (!isServer) {
      config.resolve.fallback = {
        ...config.resolve.fallback,
        fs: false,
        net: false,
        tls: false,
      };
    }
    return config;
  },
  images: {
    // Disable image optimization for static images to fix Vercel issues
    unoptimized: true,
    // Keep basic configuration
    formats: ['image/webp', 'image/avif'],
    minimumCacheTTL: 31536000,
    remotePatterns: [],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
  },
  // Compiler optimizations
  compiler: {
    removeConsole: process.env.NODE_ENV === 'production',
  },
};

export default nextConfig;
