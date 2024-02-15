/** @type {import('next').NextConfig} */
const nextConfig = {
  transpilePackages: ['@kreyolopal/web-ui'],
  reactStrictMode: true,
  output: 'export',
  poweredByHeader: false, 
  distDir: 'build',

}

module.exports = nextConfig
