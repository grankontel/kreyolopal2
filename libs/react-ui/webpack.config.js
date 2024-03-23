const nodeExternals = require('webpack-node-externals')
const NodePolyfillPlugin = require('node-polyfill-webpack-plugin')
const Dotenv = require('dotenv-webpack')

const path = require('path')

module.exports = {
  entry: './src/index.ts',
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        use: 'ts-loader',
        exclude: /node_modules/,
      },
      {
        test: /\.js?$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: ['@babel/preset-react'],
          },
        },
      },
      {
        test: /\.s[c|a]ss$/,
        exclude: /node_modules/,
        use: [
          {
            loader: 'style-loader',
            options: { injectType: 'singletonStyleTag' },
          },
          'css-loader',
          'sass-loader',
        ],
      },
    ],
  },
  resolve: {
    extensions: ['.tsx', '.ts', '.js'],
  },
  output: {
    filename: 'main.js',
    path: path.resolve(__dirname, 'dist'),
    clean: true,
  },
  plugins: [new Dotenv(), new NodePolyfillPlugin()],
  externals: [
    nodeExternals(),
    {
      react: 'react', // Case matters here
      'react-dom': 'react-dom', // Case matters here
    },
  ],
}
