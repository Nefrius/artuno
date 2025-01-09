/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'standalone',
  images: {
    domains: [
      'assets.coingecko.com',
      'lh3.googleusercontent.com'
    ],
  },
}

module.exports = nextConfig 