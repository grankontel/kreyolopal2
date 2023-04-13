const { build } = require('esbuild');
const { replace } = require('esbuild-plugin-replace');

const nodenv = process.env.NODE_ENV || 'development'

build({
    entryPoints: ["src/index.ts"],
    outfile: "build/server.js",
    bundle: true,
    minify: process.env.NODE_ENV === 'production',
    platform: "node",
    loader: {".ts": "ts"},
    plugins: [
      replace({
          'process.env.NODE_ENV': `"${nodenv}"`,
      })
    ]
  })
  .then(() => console.log("⚡ Done"))
  .catch(() => process.exit(1));