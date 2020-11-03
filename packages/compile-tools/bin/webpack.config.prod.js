const path = require('path')
const MiniCssExtractPlugin = require('mini-css-extract-plugin') // 将CSS提取出来，而不是和js混在一起
const CssMinimizerPlugin = require('css-minimizer-webpack-plugin') // 对CSS进行压缩
const { CleanWebpackPlugin } = require('clean-webpack-plugin') // 每次打包前清除旧的build文件夹
const WorkboxPlugin = require('workbox-webpack-plugin')
const FaviconsWebpackPlugin = require('favicons-webpack-plugin') // 自动生成各尺寸的favicon图标 webpack5 wating up
const TerserPlugin = require('terser-webpack-plugin') // 对js进行压缩
const { merge } = require('webpack-merge')
const baseConfig = require('./webpack.config.base')

const workDir = process.cwd()

module.exports = merge(baseConfig, {
  mode: 'production',
  stats: {
    children: false, // 不输出子模块的打包信息
  },
  optimization: {
    minimize: true,
    minimizer: [
      new TerserPlugin({
        parallel: true, // 多线程并行构建
        terserOptions: {
          // https://github.com/terser/terser#minify-options
          compress: {
            warnings: false, // 删除无用代码时是否给出警告
            drop_console: true, // 删除所有的console.*
            drop_debugger: true, // 删除所有的debugger
          },
        },
      }),
      new CssMinimizerPlugin(),
    ],
  },
  module: {
    rules: [
      {
        // .js .jsx用babel解析
        test: /\.(j|t)sx?$/,
        include: path.resolve(workDir, 'src'),
        use: ['babel-loader'],
      },
    ],
  },
  plugins: [
    /**
     * 打包前删除上一次打包留下的旧代码（根据output.path）
     * https://github.com/johnagan/clean-webpack-plugin
     * **/
    new CleanWebpackPlugin(),
    /**
     * 提取CSS等样式生成单独的CSS文件,不然最终文件只有js； css全部包含在js中
     * https://github.com/webpack-contrib/mini-css-extract-plugin
     * **/
    new MiniCssExtractPlugin({
      filename: 'dist/[name].[chunkhash:8].css', // 生成的文件名
    }),
    /**
     * 自动生成各种类型的favicon图标 webpack5 wating up
     * 自动生成manifest.json文件
     * 这么做是为了各种设备上的扩展功能，PWA桌面图标/应用启动图标等，主题等
     * https://github.com/itgalaxy/favicons#usage
     * **/
    new FaviconsWebpackPlugin({
      logo: './public/favicon.png', // 原始图片路径
      // prefix: "", // 自定义目录，把生成的文件存在此目录下
      favicons: {
        appName: 'ReactPWA', // 你的APP全称
        appShortName: 'React', // 你的APP简称，手机某些地方会显示，比如切换多个APP时显示的标题
        appDescription: 'ReactPWA Demo', // 你的APP简介
        background: '#222222', // APP启动页的背景色
        theme_color: '#222222', // APP的主题色
        appleStatusBarStyle: 'black-translucent', // 苹果手机状态栏样式
        display: 'standalone', // 是否显示搜索框，PWA就别显示了
        start_url: '/', // 起始页，‘.’会自动到主页，比'/'好，尤其是网站没有部署到根域名时
        logging: false, // 是否输出日志
        pixel_art: false, // 是否自动锐化一下图标，仅离线模式可用
        loadManifestWithCredentials: false, // 浏览器在获取manifest.json时默认不会代cookie。如果需要请设置true
        icons: {
          // 生成哪些平台需要的图标
          android: true, // 安卓
          appleIcon: false, // 苹果
          appleStartup: false, // 苹果启动页
          coast: false, // opera
          favicons: true, // web小图标
          firefox: false, // 火狐
          windows: false, // windows8 桌面应用
          yandex: false, // Yandex浏览器
        },
      },
    }),

    /**
     * PWA - 自动生成server-worker.js
     * https://developers.google.com/web/tools/workbox/reference-docs/latest/module-workbox-webpack-plugin.GenerateSW?hl=en
     *  */
    new WorkboxPlugin.GenerateSW({
      clientsClaim: true,
      exclude: [/\.map$/, /asset-manifest\.json$/],
      maximumFileSizeToCacheInBytes: 2 * 1024 * 1024,
    }),
  ],
})
