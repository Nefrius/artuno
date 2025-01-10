/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: [
      'assets.coingecko.com',
      'lh3.googleusercontent.com'
    ],
    unoptimized: true,
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**'
      }
    ]
  },
  trailingSlash: true,
  env: {
    NEXT_PUBLIC_COINGECKO_API_URL: 'https://api.coingecko.com/api/v3'
  }
}

module.exports = nextConfig 