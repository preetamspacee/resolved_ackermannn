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
        source: '/welcome',
        destination: '/apps/admin-dashboard/welcome',
      },
      {
        source: '/admin/:path*',
        destination: '/apps/admin-dashboard/:path*',
      },
      {
        source: '/customer/:path*',
        destination: '/apps/customer-portal/:path*',
      },
    ];
  },
};

module.exports = nextConfig;