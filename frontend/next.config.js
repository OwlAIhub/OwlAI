/** @type {import('next').NextConfig} */
const nextConfig = {
  // Full production mode - no static export
  trailingSlash: true,
  images: {
    unoptimized: true,
  },

  // Enable experimental features for production
  experimental: {
    serverComponentsExternalPackages: ['firebase-admin'],
  },

  // Security headers - handled by middleware now
  // async headers() {
  //   return [
  //     {
  //       source: '/(.*)',
  //       headers: [
  //         {
  //           key: 'X-Frame-Options',
  //           value: 'DENY',
  //         },
  //         {
  //           key: 'X-Content-Type-Options',
  //           value: 'nosniff',
  //         },
  //         {
  //           key: 'Referrer-Policy',
  //           value: 'origin-when-cross-origin',
  //         },
  //         {
  //           key: 'Permissions-Policy',
  //           value:
  //             'camera=(), microphone=(), geolocation=(), payment=(), usb=()',
  //         },
  //       ],
  //     },
  //     {
  //       source: '/api/(.*)',
  //       headers: [
  //         {
  //           key: 'Cache-Control',
  //           value: 'no-cache, no-store, must-revalidate',
  //         },
  //       ],
  //     },
  //   ];
  // },

  // Redirects disabled for static export
  // async redirects() {
  //   return [
  //     {
  //       source: '/dashboard',
  //       destination: '/chat',
  //       permanent: true,
  //     },
  //   ];
  // },

  // Environment variables validation
  env: {
    CUSTOM_KEY: process.env.CUSTOM_KEY,
  },

  // Webpack configuration for better security
  webpack: (config, { dev, isServer }) => {
    // Disable source maps in production
    if (!dev && !isServer) {
      config.devtool = false;
    }

    return config;
  },

  // Experimental features for better performance
  experimental: {
    optimizeCss: true,
    optimizePackageImports: ['lucide-react', 'framer-motion'],
  },
};

module.exports = nextConfig;
