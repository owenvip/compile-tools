const fs = require('fs')
const path = require('path')
const webpack = require('webpack')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const AntdDayjsWebpackPlugin = require('antd-dayjs-webpack-plugin')
const CopyPlugin = require('copy-webpack-plugin')
const Webpackbar = require('webpackbar')

const workDir = process.cwd()
const srcDir = path.resolve(workDir, 'src')
const publicDir = path.resolve(workDir, 'public')
const entries = [path.resolve(workDir, 'src/index')]
const PROD = process.env.NODE_ENV === 'production'
const appConfig = JSON.parse(
  fs.readFileSync(path.join(workDir, 'app.json'), 'utf8')
)

PROD ||
  entries.push('webpack-hot-middleware/client?reload=true&path=/__webpack_hmr')

function getCssLoader() {
  const baseLoaders = [
    PROD ? MiniCssExtractPlugin.loader : 'style-loader',
    {
      loader: 'css-loader',
      options: {
        sourceMap: true,
        modules: {
          localIdentName: PROD ? '[hash:base64]' : '[path][name]__[local]',
          exportLocalsConvention: 'camelCaseOnly',
          auto: true,
        },
      },
    },
    {
      loader: 'postcss-loader',
      options: {
        sourceMap: true,
        postcssOptions: {
          plugins: [require('autoprefixer')],
          config: true,
        },
      },
    },
  ]
  return [
    {
      test: /\.css$/,
      use: [...baseLoaders],
    },
    {
      test: /\.less$/,
      use: [
        ...baseLoaders,
        {
          loader: 'less-loader',
          options: {
            lessOptions: {
              javascriptEnabled: true,
              modifyVars: appConfig.antdCustomTheme,
            },
          },
        },
      ],
    },
  ]
}

module.exports = {
  entry: entries,
  output: {
    path: path.resolve(workDir, 'build'), // 将文件打包到此目录下
    publicPath: '/', // 在生成的html中，文件的引入路径会相对于此地址，生成的css中，以及各类图片的URL都会相对于此地址
    filename: 'dist/[name].[chunkhash:8].js',
    chunkFilename: 'dist/[name].[chunkhash:8].chunk.js',
  },
  devtool: 'eval-source-map', // 报错的时候在控制台输出哪一行报错
  optimization: {
    splitChunks: {
      chunks: 'all',
    },
  },
  module: {
    rules: [
      ...getCssLoader(),
      {
        // 文件解析
        test: /\.(eot|woff|otf|svg|ttf|woff2|appcache|mp3|mp4|pdf)(\?|$)/,
        include: [srcDir],
        use: [
          {
            loader: 'file-loader',
            options: {
              name: 'assets/[name].[hash:4].[ext]',
            },
          },
        ],
      },
      {
        // 图片解析
        test: /\.(png|jpg|jpeg|gif)$/i,
        include: [srcDir],
        use: [
          {
            loader: 'url-loader',
            options: {
              limit: 8192,
              name: 'assets/[name].[hash:4].[ext]',
            },
          },
        ],
      },
      {
        // wasm文件解析
        test: /\.wasm$/,
        include: [srcDir],
        type: 'webassembly/experimental',
      },
      {
        // xml文件解析
        test: /\.xml$/,
        include: [srcDir],
        use: ['xml-loader'],
      },
    ],
  },
  plugins: [
    new Webpackbar(),
    new AntdDayjsWebpackPlugin(), // dayjs 替代 momentjs
    new webpack.DefinePlugin({
      'process.env': PROD ? 'prod' : 'dev',
    }),
    new HtmlWebpackPlugin({
      // 根据模板插入css/js等生成最终HTML
      filename: 'index.html', // 生成的html存放路径，相对于 output.path
      favicon: publicDir + '/favicon.png', // 自动把根目录下的favicon.ico图片加入html
      template: publicDir + '/index.html', // html模板路径
      inject: true, // 是否将js放在body的末尾
      hash: !PROD,
    }),
    // 拷贝public中的文件到最终打包文件夹里
    new CopyPlugin({
      patterns: [
        {
          from: publicDir + '/**/*',
          to: '/',
          globOptions: {
            ignore: ['**/favicon.png', '**/index.html'],
          },
          noErrorOnMissing: true,
        },
      ],
    }),
  ],
  resolve: {
    modules: ['node_modules'],
    extensions: [
      '.ts',
      '.tsx',
      '.js',
      '.jsx',
      '.json',
      '.css',
      '.less',
      '.wasm',
    ], // 后缀名自动补全
    alias: {
      '@': srcDir,
    },
  },
}
