/** @type {import('next').NextConfig} */
const nextConfig = {
  
  reactStrictMode: false, 

  experimental: {
    optimizeCss: true,
    optimizePackageImports: ['framer-motion', 'react-icons'],
  },

  compiler: {
    removeConsole: process.env.NODE_ENV === 'production',
  },

  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'res.cloudinary.com',
        pathname: '/**', // allow all Cloudinary paths
      },
    ],
  },


};

module.exports = nextConfig;
