const path = require('path')

/** @type {import('next').NextConfig} */
const nextConfig = {
  // Updated for production deployment with sharp and remotePatterns
  output: 'standalone',
  images: {
    remotePatterns: [
      {
        protocol: 'http',
        hostname: 'localhost',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'univio-backend.onrender.com',
        port: '',
        pathname: '/**',
      },
    ],
  },
  env: {
    NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL,
  },
  webpack: (config) => {
    config.resolve.alias = {
      ...config.resolve.alias,
      '@': path.resolve(__dirname, 'src'),
    }
    return config
  },
  async rewrites() {
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'https://univio-backend.onrender.com';
    return [
      // Only rewrite specific backend API routes, not all /api/* routes
      {
        source: '/api/v1/:path*',
        destination: `${apiUrl}/api/v1/:path*`,
      },
      {
        source: '/api/courses/:path*',
        destination: `${apiUrl}/api/v1/courses/:path*`,
      },
      {
        source: '/api/planning/:path*',
        destination: `${apiUrl}/api/v1/planning/:path*`,
      },
      {
        source: '/api/transfer/:path*',
        destination: `${apiUrl}/api/v1/transfer/:path*`,
      },
      // Keep /api/auth/*, /api/users/*, etc. as local Next.js API routes
    ]
  },
}

module.exports = nextConfig 