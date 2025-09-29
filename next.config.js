/** @type {import('next').NextConfig} */
const path = require('path');
const nextConfig = {
  reactStrictMode: true,
  output: 'standalone',
  experimental: {
    outputFileTracingRoot: path.join(__dirname),
  },
  async rewrites() {
    return [
      {
        source: '/admin/:path*',
        destination: '/admin-dashboard/:path*',
      },
      {
        source: '/customer/:path*',
        destination: '/customer-portal/:path*',
      },
    ];
  },
};

module.exports = nextConfig;
