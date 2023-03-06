import terser from '@rollup/plugin-terser'
import commonjs from '@rollup/plugin-commonjs'
import json from '@rollup/plugin-json'
import resolve from '@rollup/plugin-node-resolve'
import babel from '@rollup/plugin-babel'
import replace from '@rollup/plugin-replace'
import generatePackageJson from 'rollup-plugin-generate-package-json-v2'
import copy from 'rollup-plugin-copy'
import pdata from './package.json' assert { type: 'json' }

pdata.main = 'server.js'
pdata.scripts = {
  start: "NODE_ENV='production' node server.js",
  migrate: 'sequelize-cli db:migrate',
  seed: 'sequelize-cli db:seed:all',
}

delete pdata.devDependencies

const distDirectory = './dist'

console.log(`NODE_ENV: ${process.env.NODE_ENV}`)

export default {
  input: 'src/server.js',
  external: [
    'dotenv',
    'express',
    'express-validator',
    'mongoose',
    /src\/database/,
    /src\/services\/logger/,
  ],
  output: {
    dir: distDirectory,
    format: 'cjs',
  },
  plugins: [
    replace({
      preventAssignment: true,
      delimiters: ['', ''],
      values: {
        'process.env.NODE_ENV': process.env.NODE_ENV
          ? `"${process.env.NODE_ENV}"`
          : '"development"',
        '../mails/': './mails/',
        __buildDate__: () => JSON.stringify(new Date()),
      },
    }),
    resolve({ preferBuiltins: true }),
    commonjs({
      exclude: ['node_modules/**'],
      ignoreDynamicRequires: true,
    }),
    json(),
    babel({ babelHelpers: 'bundled' }),
    copy({
      targets: [
        { src: 'src/mails', dest: 'dist/' },
        { src: 'src/database', dest: 'dist/' },
        { src: 'src/services/logger.js', dest: 'dist/services' },
        { src: 'src/config.js', dest: 'dist/' },
        {
          src: '.sequelizerc',
          dest: 'dist/',
          transform: (contents, filename) =>
            contents.toString().replaceAll('./src/', './'),
        },
      ],
    }),
    process.env.NODE_ENV === 'production'
          ? terser()
          : null,
    // terser(),
    writePackageJson(pdata),
  ],
}

function writePackageJson(package_data) {
  return {
    name: 'writePackageJson',
    async generateBundle() {
      this.emitFile({
        type: 'asset',
        fileName: 'package.json',
        source: JSON.stringify(package_data, null, '  '),
      })
    },
  }
}
