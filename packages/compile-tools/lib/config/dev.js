/*
 * @Descripttion:
 * @Author: OwenWong
 * @Email: owen.cq.cn@gmail.com
 * @Date: 2021-11-08 16:42:59
 */
const { merge } = require("webpack-merge");
const common = require("./base");
const { distDir, tplFile } = require("./paths");

module.exports = merge(common, {
  mode: "development",
  target: "web",
  devtool: "inline-source-map",
  cache: {
    type: "filesystem",
  },
  devServer: {
    port: 3000,
    host: "127.0.0.1",
    hot: true,
    contentBase: distDir,
    overlay: true,
    open: true,
    progress: true,
    stats: "errors-only",
    compress: true, // 为每个静态文件开启 gzip compression
    historyApiFallback: {
      rewrites: [{ from: /./, to: tplFile }],
    },
  },
  output: {
    filename: "[name].[chunkhash].js",
  },
  module: {
    rules: [
      {
        test: /\.(le|c)ss$/,
        use: [
          "style-loader",
          "css-loader",
          {
            loader: "less-loader",
            options: {
              sourceMap: true,
              lessOptions: {
                javascriptEnabled: true,
              },
            },
          },
        ],
      },
      {
        test: /\.(png|svg|jpg|gif|cur)$/,
        type: "asset/resource",
      },
    ],
  },
});
