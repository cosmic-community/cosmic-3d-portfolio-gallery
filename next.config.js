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
    
    // Fix for React Three Fiber in development
    if (dev) {
      config.resolve.alias = {
        ...config.resolve.alias,
        'react': require.resolve('react'),
        'react-dom': require.resolve('react-dom'),
        'scheduler': require.resolve('scheduler')
      }
    }
    
    // Ensure single React instance
    config.resolve.dedupe = config.resolve.dedupe || []
    config.resolve.dedupe.push('react', 'react-dom', 'scheduler')
    
    return config
  }
}

module.exports = nextConfig