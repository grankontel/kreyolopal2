/** @type {import('next').NextConfig} */
const nextConfig = {
  transpilePackages: ['@kreyolopal/web-ui'],
  reactStrictMode: true,
  output: 'export',
  poweredByHeader: false, 

}

module.exports = nextConfig
