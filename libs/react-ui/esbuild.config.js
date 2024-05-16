const { nodeExternalsPlugin } = require('esbuild-node-externals')
const { sassPlugin } = require('esbuild-sass-plugin')

const getConfig = (isDev = false) => ({
  entryPoints: ['./src/index.ts'],
  outfile: 'dist/index.js',
  bundle: true,
  minify: !isDev,
  treeShaking: !isDev,
  sourcemap: isDev,
  platform: 'node',
  format: 'cjs',
  target: 'node20',
  plugins: [nodeExternalsPlugin(), sassPlugin()],
})

module.exports = getConfig
