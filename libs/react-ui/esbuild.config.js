const { nodeExternalsPlugin } = require('esbuild-node-externals');
const { sassPlugin } = require('esbuild-sass-plugin')

module.exports={
		entryPoints: ['./src/index.ts'],
		outfile: 'dist/index.js',
		bundle: true,
		minify: true,
		treeShaking: true,
		platform: 'node',
		format: 'cjs',
		target: 'node20',
		plugins: [nodeExternalsPlugin(), sassPlugin()],
	}