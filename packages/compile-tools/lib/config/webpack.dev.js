const { merge } = require("webpack-merge");
const common = require("./webpack.common.js");
const { distDir, tplFile } = require("./paths.js");

module.exports = merge(common, {
  mode: "development",
  target: "web",
  devtool: "eval-cheap-module-source-map",
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
          {
            loader: "css-loader",
            options: {
              sourceMap: true,
              modules: {
                localIdentName: "[path][name]__[local]",
                exportLocalsConvention: "camelCaseOnly",
                auto: true,
              },
            },
          },
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
