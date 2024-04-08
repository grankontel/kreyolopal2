const esbuild = require('esbuild')
const config = require('./esbuild.config')

if (process.argv.indexOf('--watch') > 0) {
  esbuild
    .context(config)
    .then((ctx) => ctx.watch())
    .catch(() => process.exit(1))
  console.log('watching...')
} else {
  esbuild
    .build(config)
    .then(() => {
      console.log('⚡ Done')
    })
    .catch(() => process.exit(1))
}
