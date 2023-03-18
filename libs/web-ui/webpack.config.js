const nodeExternals = require('webpack-node-externals')
const NodePolyfillPlugin = require('node-polyfill-webpack-plugin')

module.exports = {
  entry: '/src/index.js',
  output: {
    filename: 'main.js',
    libraryTarget: 'umd',
    clean: true,
    globalObject: 'this',
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: ['@babel/preset-react'],
          },
        },
      },
      {
        test: /\.scss$/,
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
      {
        test: /\.(png|jpe?g|gif)$/i,
        loader: 'url-loader',
      },
    ],
  },
  plugins: [new NodePolyfillPlugin()],
  externals: [
    nodeExternals(),
    {
      'classnames': 'classnames',
      'react': 'react', // Case matters here
      'react-dom': 'react-dom', // Case matters here
      'react-bulma-components': 'react-bulma-components',
      'next': 'next',
    },
  ],
}
