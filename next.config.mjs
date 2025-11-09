import withNextMDX from '@next/mdx'

const imageDomains = process.env.NEXT_PUBLIC_IMAGE_REMOTE_PATTERN?.split(',') || []

/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'standalone',
  
  // ============================================================================
  // Image Optimization for Mobile Performance
  // ============================================================================
  images: {
    remotePatterns: imageDomains.map(domain => ({
      protocol: 'https',
      hostname: domain
    })),
    formats: ['image/avif', 'image/webp'], // Modern formats for smaller file sizes
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048], // Mobile-first sizes
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384], // Thumbnail sizes
    minimumCacheTTL: 60 * 60 * 24 * 30, // Cache images for 30 days
    dangerouslyAllowSVG: true,
    contentDispositionType: 'attachment',
    contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;"
  },

  // ============================================================================
  // Compiler Optimizations
  // ============================================================================
  compiler: {
    removeConsole: process.env.NODE_ENV === 'production' ? {
      exclude: ['error', 'warn']
    } : false
  },

  // ============================================================================
  // Experimental Features for Better Performance
  // ============================================================================
  experimental: {
    optimizePackageImports: [
      '@/components/atoms',
      '@/components/molecules', 
      '@/components/organisms',
      'lucide-react',
      'date-fns'
    ]
  },

  pageExtensions: ['js', 'jsx', 'md', 'mdx', 'ts', 'tsx']
}

// Add your next plugins here
const nextPlugins = [
  withNextMDX({
    extension: /\.mdx?$/
  })
]

const composePlugins = nextConfig => nextPlugins.reduce((acc, next) => next(acc), nextConfig)
export default composePlugins(nextConfig)
