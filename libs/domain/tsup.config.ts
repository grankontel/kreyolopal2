import { defineConfig } from 'tsup'

export default defineConfig((options) => {
  return {
    entry: ['./src/index.ts'],
    splitting: false,
    minify: !options.watch,
    sourcemap: options.watch,
    clean: true,
    format: ['cjs', 'esm'],
    dts: true,
  }
})
