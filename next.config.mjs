/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'standalone',
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'staging-dino-esport-bucket.s3.amazonaws.com'
      },
      {
        protocol: 'https',
        hostname: 'staging-dino-bucket.s3.amazonaws.com'
      },
      {
        protocol: 'https',
        hostname: 'staging-athena-bucket.s3.amazonaws.com'
      },
      {
        protocol: 'https',
        hostname: 'staging-agg-storage.s3.ap-southeast-1.amazonaws.com'
      }
    ]
  }
}

export default nextConfig
