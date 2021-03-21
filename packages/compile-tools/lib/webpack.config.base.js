const fs = require("fs");
const path = require("path");
const webpack = require("webpack");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const AntdDayjsWebpackPlugin = require("antd-dayjs-webpack-plugin");
const CopyPlugin = require("copy-webpack-plugin");
const Webpackbar = require("webpackbar");

const workDir = process.cwd();
const srcDir = path.resolve(workDir, "src");
const publicDir = path.resolve(workDir, "public");
const PROD = process.env.NODE_ENV === "production";
const appConfig = JSON.parse(
  fs.readFileSync(path.join(workDir, "app.json"), "utf8")
);

function getCssLoader() {
  const baseLoaders = [
    PROD ? MiniCssExtractPlugin.loader : "style-loader",
    {
      loader: "css-loader",
      options: {
        sourceMap: true,
        modules: {
          localIdentName: PROD ? "[hash:base64]" : "[path][name]__[local]",
          exportLocalsConvention: "camelCaseOnly",
          auto: true,
        },
      },
    },
    {
      loader: "postcss-loader",
      options: {
        sourceMap: true,
        postcssOptions: {
          plugins: [require("autoprefixer")],
          config: true,
        },
      },
    },
  ];
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
          loader: "less-loader",
          options: {
            lessOptions: {
              javascriptEnabled: true,
              modifyVars: appConfig.antdCustomTheme,
            },
          },
        },
      ],
    },
  ];
}

module.exports = {
  entry: path.resolve(workDir, "src/index"),
  output: {
    path: path.resolve(workDir, "build"),
    publicPath: "/",
    filename: PROD ? "[name].[contenthash].js" : "[name].js",
    chunkFilename: PROD ? "[id].[contenthash].js" : "[id].js",
  },
  devtool: "eval-cheap-module-source-map",
  target: PROD ? "browserslist" : "web",
  module: {
    rules: [
      ...getCssLoader(),
      {
        // 文件解析
        test: /\.(eot|woff|otf|svg|ttf|woff2|appcache|mp3|mp4|pdf)(\?|$)/,
        include: [srcDir],
        use: [
          {
            loader: "file-loader",
            options: {
              name: "assets/[name].[hash:4].[ext]",
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
            loader: "url-loader",
            options: {
              limit: 8192,
              name: "assets/[name].[hash:4].[ext]",
            },
          },
        ],
      },
      {
        // wasm文件解析
        test: /\.wasm$/,
        include: [srcDir],
        type: "webassembly/experimental",
      },
      {
        // xml文件解析
        test: /\.xml$/,
        include: [srcDir],
        use: ["xml-loader"],
      },
    ],
  },
  plugins: [
    new Webpackbar(),
    new AntdDayjsWebpackPlugin(),
    new webpack.DefinePlugin({
      "process.env": PROD ? "prod" : "dev",
    }),
    new HtmlWebpackPlugin({
      filename: "index.html",
      favicon: publicDir + "/favicon.png",
      template: publicDir + "/index.html",
      inject: true,
      hash: !PROD,
    }),
    new CopyPlugin({
      patterns: [
        {
          from: publicDir + "/**/*",
          to: "/",
          globOptions: {
            ignore: ["**/favicon.png", "**/index.html"],
          },
          noErrorOnMissing: true,
        },
      ],
    }),
  ],
  resolve: {
    modules: ["node_modules"],
    extensions: [
      ".ts",
      ".tsx",
      ".js",
      ".jsx",
      ".json",
      ".css",
      ".less",
      ".wasm",
    ],
    alias: {
      "@": srcDir,
    },
  },
};
