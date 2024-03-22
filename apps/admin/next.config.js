const { PHASE_PRODUCTION_BUILD } = require('next/constants')

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

module.exports = (phase, { defaultConfig }) => {
  if (phase === PHASE_PRODUCTION_BUILD) {
    console.log('***************')
    return {
      /* development only config options here */
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
              destination: 'http://__API_PATH__',
            },
            {
              source: '/postgrest/:path*',
              destination: 'http://__POSTGREST_PATH__',
            },
          ],
        }
      },
    }
  }

  return nextConfig
}
