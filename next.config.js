/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'standalone',
  images: {
    domains: [
      'assets.coingecko.com', 
      'coin-images.coingecko.com',
      'lh3.googleusercontent.com',
      'raw.githubusercontent.com'
    ],
  }
}

module.exports = nextConfig 