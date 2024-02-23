/** @type {import('next').NextConfig} */
const nextConfig = {
  //  transpilePackages: ['@kreyolopal/web-ui'],
  reactStrictMode: true,
  output: 'standalone',
  poweredByHeader: false,
  async rewrites() {
    return {
      // After checking all Next.js pages (including dynamic routes)
      // and static files we proxy any other requests
      fallback: [
        {
          source: '/api/:path*',
          destination: (process.env.API_SERVER || '') + '/api/:path*',
        },
        {
          source: '/postgrest/:path*',
          destination: (process.env.POSTGREST_SERVER || '') + '/:path*',
        },
      ],
    }
  },
}

module.exports = nextConfig
