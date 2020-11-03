const path = require("path");
const webpack = require("webpack");
const HappyPack = require("happypack");
const { merge } = require("webpack-merge");
const baseConfig = require("./webpack.config.base");

const workDir = process.cwd();

module.exports = merge(baseConfig, {
  mode: "development",
  devtool: "eval-source-map",
  module: {
    rules: [
      {
        test: /\.(j|t)sx?$/,
        enforce: "pre",
        use: ["eslint-loader"],
        include: path.resolve(workDir, "src"),
      },
      {
        test: /\.(j|t)sx?$/,
        use: ["happypack/loader"],
        include: path.resolve(workDir, "src"),
      },
    ],
  },
  plugins: [
    new webpack.HotModuleReplacementPlugin(),
    new HappyPack({
      loaders: ["babel-loader"],
    }),
  ],
  devServer: {
    contentBase: path.resolve(workDir, "build"),
    compress: true,
    historyApiFallback: true,
    port: 3000,
    hot: true,
    open: true,
    inline: true,
  },
});
