/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  experimental: {
    esmExternals: false
  },
  images: {
    domains: ['cdn.cosmicjs.com', 'imgix.cosmicjs.com'],
    dangerouslyAllowSVG: true,
  },
  typescript: {
    ignoreBuildErrors: false,
  },
  eslint: {
    ignoreDuringBuilds: false,
  },
  webpack: (config, { isServer, dev }) => {
    // Handle canvas module for server-side
    if (isServer) {
      config.externals.push('canvas')
    }
    
    // Ensure proper handling of ES modules
    config.module.rules.push({
      test: /\.mjs$/,
      include: /node_modules/,
      type: 'javascript/auto'
    })

    // Fix for three.js imports
    config.resolve.alias = {
      ...config.resolve.alias,
      'three/examples/jsm': 'three/examples/jsm'
    }
    
    return config
  }
}

module.exports = nextConfig