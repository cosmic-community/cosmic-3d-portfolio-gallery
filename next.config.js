/** @type {import('next').NextConfig} */
const nextConfig = {
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
  transpilePackages: ['three'],
  experimental: {
    esmExternals: 'loose'
  },
  webpack: (config, { isServer }) => {
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
    
    return config
  }
}

module.exports = nextConfig