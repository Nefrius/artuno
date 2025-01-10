/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',
  images: {
    unoptimized: true,
  },
  // API rotalarını devre dışı bırak
  experimental: {
    appDir: true,
    disableStaticImages: true
  }
}

module.exports = nextConfig 