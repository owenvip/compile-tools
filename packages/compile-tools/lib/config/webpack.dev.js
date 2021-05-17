const { merge } = require("webpack-merge");
const common = require("./webpack.common.js");
const path = require("path");

module.exports = merge(common, {
  mode: "development",
  target: "web",
  devtool: "inline-source-map",
  cache: {
    type: "filesystem",
  },
  devServer: {
    port: 3000,
    hot: true,
    contentBase: "../dist",
    overlay: true,
    open: true,
    stats: "errors-only",
    compress: true, // 为每个静态文件开启 gzip compression
    historyApiFallback: {
      rewrites: [{ from: /./, to: "/index.html" }],
    },
  },
  output: {
    filename: "js/[name].[chunkhash].js",
    path: path.resolve(__dirname, "../dist"),
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
