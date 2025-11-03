const imageHostnames = process.env.NEXT_PUBLIC_IMAGE_REMOTE_PATTERN?.split(',')

/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'standalone',
  images: {
    remotePatterns: imageHostnames.map(hostname => ({
      protocol: 'https',
      hostname: hostname
    }))
  }
}

export default nextConfig
