const imageDomains = process.env.NEXT_PUBLIC_IMAGE_REMOTE_PATTERN?.split(',') || []

/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'standalone',
  images: {
    remotePatterns: imageDomains.map(domain => ({
      protocol: 'https',
      hostname: domain
    }))
  }
}

export default nextConfig
