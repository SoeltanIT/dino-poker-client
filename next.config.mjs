const imageDomains = process.env.NEXT_PUBLIC_IMAGE_REMOTE_PATTERN?.split(',') || []

const MAIN_API_URL = process.env.NEXT_PUBLIC_API_BASE_URL
const TRANSACTION_API_URL = process.env.NEXT_PUBLIC_API_TRANS_URL
const PROMOTION_API_URL = process.env.NEXT_PUBLIC_API_PROMOTION_URL

/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'standalone',
  images: {
    remotePatterns: imageDomains.map(domain => ({
      protocol: 'https',
      hostname: domain
    }))
  },
  async rewrites() {
    return [
      {
        source: `/proxy/users/:path*`,
        destination: MAIN_API_URL + '/:path*'
      },
      {
        source: `/proxy/transactions/:path*`,
        destination: TRANSACTION_API_URL + '/:path*'
      },
      {
        source: `/proxy/promotion/:path*`,
        destination: PROMOTION_API_URL + '/:path*'
      }
    ]
  }
}

export default nextConfig
