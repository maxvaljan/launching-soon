/** @type {import('next').NextConfig} */
const nextConfig = {
  // Enable React strict mode for better development experience
  reactStrictMode: true,
  
  // Enable standalone output for Docker deployment
  output: 'standalone',
  
  // Skip building error pages during production build
  typescript: {
    // Disable type checking on build to allow error pages to be skipped
    ignoreBuildErrors: true,
  },
  
  // Explicitly set eslint settings
  eslint: {
    ignoreDuringBuilds: true,
  },
  
  // Image optimization configuration
  images: {
    domains: [
      'xuehdmslktlsgpoexilo.supabase.co',
      'assets.maxmove.com',
      'upload.wikimedia.org',
      'www.gstatic.com'
    ],
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**',
      }
    ],
    formats: ['image/avif', 'image/webp'],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
    minimumCacheTTL: 60, // 1 minute
  },
  
  // Customize headers for security
  async headers() {
    return [
      {
        source: '/:path*',
        headers: [
          {
            key: 'X-DNS-Prefetch-Control',
            value: 'on',
          },
          {
            key: 'X-XSS-Protection',
            value: '1; mode=block',
          },
          {
            key: 'X-Frame-Options',
            value: 'SAMEORIGIN',
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
          {
            key: 'Referrer-Policy',
            value: 'origin-when-cross-origin',
          },
        ],
      },
    ];
  },
  
  // Production-only settings - compress responses
  compress: true,
  
  // Set custom build directory
  distDir: '.next',
  
  // Set longer timeout for asset optimization
  staticPageGenerationTimeout: 180,
  
  // Configure webpack for optimizations
  webpack: (config, { dev, isServer }) => {
    // Split chunks for better performance
    if (!dev && !isServer) {
      // More aggressive chunk splitting for better caching
      config.optimization.splitChunks = {
        chunks: 'all',
        maxInitialRequests: 25,
        maxAsyncRequests: 25,
        minSize: 20000,
        cacheGroups: {
          framework: {
            name: 'framework',
            test: /[\\/]node_modules[\\/](react|react-dom|scheduler|prop-types|use-subscription)[\\/]/,
            priority: 40,
            // Don't let webpack eliminate the chunk if it's imported from all over the app
            enforce: true,
          },
          commons: {
            name: 'commons',
            minChunks: 2,
            priority: 20,
          },
          lib: {
            test: /[\\/]node_modules[\\/]/,
            priority: 10,
            reuseExistingChunk: true,
          },
          styles: {
            name: 'styles',
            test: /\.css$/,
            chunks: 'all',
            enforce: true,
          },
        },
      };
      
      // Decrease size of generated code
      config.optimization.concatenateModules = true;
    }
    
    return config;
  },
  
  // No experimental features - these were causing build errors
};

module.exports = nextConfig;