const path = require('path')
const webpack = require('webpack')
const HappyPack = require('happypack') // 多线程编译
const { merge } = require('webpack-merge')
const baseConfig = require('./webpack.config.base')

const workDir = process.cwd()

module.exports = merge(baseConfig, {
  mode: 'development',
  devtool: 'eval-source-map', // 报错的时候在控制台输出哪一行报错
  module: {
    rules: [
      {
        // 编译前通过eslint检查代码 (注释掉即可取消eslint检测)
        test: /\.(j|t)sx?$/,
        enforce: 'pre',
        use: ['eslint-loader'],
        include: path.resolve(workDir, 'src'),
      },
      {
        test: /\.(j|t)sx?$/,
        use: ['happypack/loader'],
        include: path.resolve(workDir, 'src'),
      },
    ],
  },
  plugins: [
    new webpack.HotModuleReplacementPlugin(), // 热更新插件
    new HappyPack({
      loaders: ['babel-loader'],
    }),
  ],
})
