/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    outputFileTracingRoot: undefined,
  },
  images: {
    domains: ['localhost'],
  },
}

module.exports = nextConfig