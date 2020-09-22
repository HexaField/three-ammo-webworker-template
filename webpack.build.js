const HtmlWebpackPlugin = require('html-webpack-plugin')
const CopyPlugin = require('copy-webpack-plugin')
const webpack = require('webpack')

module.exports = {
  mode: 'production',
  devtool: '',
  target: 'node',
  entry: {
    bundle: './src-offscreen/index.js',
    worker: './src-offscreen/elementProxyReceiver.js'
  },
  output: {
    filename: '[name].js',
    pathinfo: false,
    globalObject: "this"
  },
//   optimization: {
//       splitChunks: {
//           cacheGroups: {
//               commons: {
//                   test: /[\\/]node_modules[\\/]/,
//                   name: 'vendors',
//                   chunks: 'all'
//               }
//           }
//       }
//   },
  plugins: [
    new webpack.optimize.LimitChunkCountPlugin({
        maxChunks: 1
    }),
    new HtmlWebpackPlugin({ template: './src-offscreen/index.html' })
  ]
}
