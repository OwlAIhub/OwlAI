/** @type {import('next').NextConfig} */
const nextConfig = {
  // Cloud Functions configuration
  output: 'standalone',
  trailingSlash: true,
  images: {
    unoptimized: true,
  },
  
  // Enable experimental features for production
  experimental: {
    serverComponentsExternalPackages: ['firebase-admin'],
    outputFileTracingRoot: __dirname,
  },
  
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
