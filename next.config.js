/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true, // Enable SWC minification
  compiler: {
    removeConsole: process.env.NODE_ENV === 'production', // Remove console.log in production
  },
  // Enable production source maps if needed (disable for smaller bundles)
  productionBrowserSourceMaps: false,
};

module.exports = nextConfig;
