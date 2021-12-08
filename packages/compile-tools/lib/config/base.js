/*
 * @Description:
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
const ESLintPlugin = require("eslint-webpack-plugin");

const {
  workDir,
  staticDir,
  entry,
  tplFile,
  pkgPath,
  tscfgPath,
} = require("./paths");

const { dependencies } = JSON.parse(fs.readFileSync(pkgPath, "utf8"));
const isVue = typeof dependencies.vue === "string";

const rules = [
  {
    test: /\.mjs$/i,
    resolve: { byDependency: { esm: { fullySpecified: false } } },
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
  new ESLintPlugin({
    extensions: ["js", "ts", "jsx", "tsx", "vue", "json"],
    emitError: true,
    emitWarning: true,
    failOnError: true,
    lintDirtyModulesOnly: false,
    overrideConfigFile: resolve(workDir, ".eslintrc.js"),
  }),
];

if (fs.existsSync(tscfgPath)) {
  plugins.push(new ForkTsCheckerWebpackPlugin());
}

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
      ".mjs",
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
