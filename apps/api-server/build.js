/* eslint-disable @typescript-eslint/no-var-requires */
const { build } = require('esbuild')
const { replace } = require('esbuild-plugin-replace')
const fs = require('node:fs')
var pdata = require('./package.json')

pdata.main = 'server.js'
pdata.scripts = {
  start: "NODE_ENV='production' node server.js",
}
pdata.bin = {
  "cli": "./cli.js"
}

pdata.dependencies = pdata.peerDependencies
delete pdata.peerDependencies
delete pdata.devDependencies
delete pdata.imports

const nodenv = process.env.NODE_ENV || 'development'

console.log('Building server ...')
build({
  entryPoints: ['src/index.ts'],
  outfile: 'dist/server.js',
  bundle: true,
  minify: process.env.NODE_ENV === 'production',
  platform: 'node',
  loader: { '.ts': 'ts' },
  // packages: 'external',
  external: ['@node-rs', 'uglify-js'],
  sourcemap: nodenv === 'development',
  plugins: [
    replace({
      'process.env.NODE_ENV': `"${nodenv}"`,
    }),
  ],
})
  .then(() => {
    // prettier-ignore
    fs.writeFileSync(
      './dist/package.json',
      JSON.stringify(pdata, null, '  ')
    )
    console.log('⚡ Done')
  })
  .catch(() => process.exit(1))

  console.log('Building cli ...')
  build({
    entryPoints: ['src/cli.ts'],
    outfile: 'dist/_cli.js',
    bundle: true,
    minify: process.env.NODE_ENV === 'production',
    platform: 'node',
    loader: { '.ts': 'ts' },
    // packages: 'external',
    sourcemap: nodenv === 'development',
    plugins: [
      replace({
        'process.env.NODE_ENV': `"${nodenv}"`,
      }),
    ],
  })
  .then(() => {
    // prettier-ignore
    fs.readFile('./dist/_cli.js', {encoding: 'utf-8'}, function(err,data){
      if (!err) {
          fs.writeFileSync('./dist/cli.js', '#!/usr/bin/env node\n\n' + data)
      } else {
          console.log(err);
      }
  });    
    console.log('⚡ Done')
  })
    .catch(() => process.exit(1))
  