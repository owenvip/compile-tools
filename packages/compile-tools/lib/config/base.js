/*
 * @Descripttion:
 * @Author: OwenWong
 * @Email: owen.cq.cn@gmail.com
 * @Date: 2021-06-03 21:41:28
 */
const fs = require("fs");
const webpack = require("webpack");
const { VueLoaderPlugin } = require("vue-loader/dist/index");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const { resolve } = require("path");
const CopyWebpackPlugin = require("copy-webpack-plugin");
const ForkTsCheckerWebpackPlugin = require("fork-ts-checker-webpack-plugin");

const { workDir, staticDir, entry, tplFile, pkgPath } = require("./paths");

const { dependencies } = JSON.parse(fs.readFileSync(pkgPath, "utf8"));
const isVue = typeof dependencies.vue === "string";

const rules = [
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
];

const plugins = [
  new HtmlWebpackPlugin({
    template: tplFile,
  }),
  new CopyWebpackPlugin({
    patterns: [
      {
        from: staticDir,
        to: "static",
      },
    ],
  }),
  new webpack.DefinePlugin({
    "process.env": {},
    __VUE_OPTIONS_API__: true,
    __VUE_PROD_DEVTOOLS__: false,
  }),
  new ForkTsCheckerWebpackPlugin(),
];

if (isVue) {
  rules.push({
    test: /\.vue$/,
    loader: "vue-loader",
  });
  plugins.push(new VueLoaderPlugin());
}

module.exports = {
  entry: ["regenerator-runtime/runtime.js", entry],
  module: {
    rules,
  },
  plugins,
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
