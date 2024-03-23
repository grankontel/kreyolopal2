const esbuild = require('esbuild');
const { nodeExternalsPlugin } = require('esbuild-node-externals');
const { sassPlugin } = require('esbuild-sass-plugin')

esbuild
	.build({
		entryPoints: ['./src/index.ts'],
		outfile: 'dist/index.js',
		bundle: true,
		minify: true,
		treeShaking: true,
		platform: 'node',
		format: 'cjs',
		target: 'node20',
		plugins: [nodeExternalsPlugin(), sassPlugin()],
	})
	.then(() => {
		console.log('⚡ Done')
	})
	.catch(() => process.exit(1));