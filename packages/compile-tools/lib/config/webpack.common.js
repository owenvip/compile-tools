const path = require("path");
const webpack = require("webpack");
const { VueLoaderPlugin } = require("vue-loader/dist/index");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const { resolve } = require("path");
const CopyWebpackPlugin = require("copy-webpack-plugin");
const ForkTsCheckerWebpackPlugin = require("fork-ts-checker-webpack-plugin");
const WorkboxPlugin = require("workbox-webpack-plugin");

module.exports = {
  entry: ["./src/index.ts"],
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
      template: path.resolve(__dirname, "../index.html"),
    }),
    new CopyWebpackPlugin({
      patterns: [
        {
          from: path.resolve(__dirname, "../static"),
          to: "static",
        },
      ],
    }),
    new webpack.DefinePlugin({
      "process.env": {
        BASE_URL: JSON.stringify("http://localhost:9000"),
      },
      __VUE_OPTIONS_API__: true,
      __VUE_PROD_DEVTOOLS__: false,
    }),
    new WorkboxPlugin.GenerateSW({
      clientsClaim: true,
      skipWaiting: true,
      exclude: [/\.map$/, /asset-manifest\.json$/],
      maximumFileSizeToCacheInBytes: 5000000,
    }),
    new ForkTsCheckerWebpackPlugin(),
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
      "@": resolve("src"),
    },
  },
};
