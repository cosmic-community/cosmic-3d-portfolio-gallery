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
    
    // Fix for React Three Fiber - use resolve.alias instead of dedupe
    if (dev) {
      config.resolve.alias = {
        ...config.resolve.alias,
        'react': require.resolve('react'),
        'react-dom': require.resolve('react-dom'),
        'scheduler': require.resolve('scheduler')
      }
    }
    
    // Use resolve.alias for single React instance instead of deprecated dedupe
    config.resolve.alias = {
      ...config.resolve.alias,
      'react': require.resolve('react'),
      'react-dom': require.resolve('react-dom'),
      'scheduler': require.resolve('scheduler')
    }
    
    return config
  }
}

module.exports = nextConfig