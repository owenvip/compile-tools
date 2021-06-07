const webpack = require("webpack");
const { VueLoaderPlugin } = require("vue-loader/dist/index");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const { resolve } = require("path");
const CopyWebpackPlugin = require("copy-webpack-plugin");
// const ForkTsCheckerWebpackPlugin = require("fork-ts-checker-webpack-plugin");

const { workDir, staticDir, entry, tplFile } = require("./paths.js");

module.exports = {
  entry: ["regenerator-runtime/runtime.js", entry],
  module: {
    rules: [
      {
        test: /\.vue$/,
        loader: "vue-loader",
      },
      {
        test: /\.(woff2?|eot|ttf|otf)(\?.*)?$/,
        type: "asset",
        parser: {
          dataUrlCondition: {
            maxSize: 8 * 1024,
          },
        },
      },
      {
        test: /\.(j|t)sx?$/,
        exclude: /node_modules/,
        use: [
          {
            loader: "babel-loader",
            options: {
              cacheDirectory: true,
            },
          },
          {
            loader: "ts-loader",
            options: {
              transpileOnly: true,
              appendTsSuffixTo: ["\\.vue$"],
              happyPackMode: false,
            },
          },
        ],
      },
    ],
  },
  plugins: [
    new VueLoaderPlugin(),
    new HtmlWebpackPlugin({
      template: tplFile,
    }),
    new CopyWebpackPlugin({
      patterns: [
        {
          from: staticDir,
        },
      ],
    }),
    new webpack.DefinePlugin({
      "process.env": {},
      __VUE_OPTIONS_API__: true,
      __VUE_PROD_DEVTOOLS__: false,
    }),
    // new ForkTsCheckerWebpackPlugin(),
  ],
  resolve: {
    extensions: [
      ".js",
      ".ts",
      ".jsx",
      ".tsx",
      ".vue",
      ".json",
      ".css",
      ".less",
    ],
    alias: {
      "@": resolve(workDir, "src"),
    },
  },
};
