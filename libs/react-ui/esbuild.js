const esbuild = require('esbuild')
const { Generator } = require('npm-dts')
new Generator({
  entry: 'src/index.ts',
  output: 'dist/index.d.ts',
}).generate()

const config = require('./esbuild.config')

if (process.argv.indexOf('--watch') > 0) {
  esbuild
    .context(config(true))
    .then((ctx) => ctx.watch())
    .catch(() => process.exit(1))
  console.log('watching...')
} else {
  esbuild
    .build(config(false))
    .then(() => {
      console.log('⚡ Done')
    })
    .catch(() => process.exit(1))
}
