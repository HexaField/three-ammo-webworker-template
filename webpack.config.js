const HtmlWebpackPlugin = require('html-webpack-plugin')
const CopyPlugin = require('copy-webpack-plugin')
const webpack = require('webpack');

module.exports = {
  mode: 'development',
  devtool: 'inline-source-map',
  target: 'node', 
  entry: {
    bundle: './example/index.js',
    worker: './example/elementProxyReceiver.js'
  },
  output: {
    filename: '[name].js',
    pathinfo: false,
    globalObject: "this"
  },
  devServer: {
    port: 8081
  },
  plugins: [
    new webpack.optimize.LimitChunkCountPlugin({
        maxChunks: 1
    }),
    new HtmlWebpackPlugin({ template: './example/index.html' })
  ]
}
