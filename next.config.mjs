import withNextMDX from '@next/mdx'

const imageDomains = process.env.NEXT_PUBLIC_IMAGE_REMOTE_PATTERN?.split(',') || []

/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'standalone',
  images: {
    remotePatterns: imageDomains.map(domain => ({
      protocol: 'https',
      hostname: domain
    }))
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
