/*
 * @Descripttion:
 * @Author: OwenWong
 * @Email: owen.cq.cn@gmail.com
 * @Date: 2021-06-03 21:41:28
 */
"use strict";
const fs = require("fs");
const path = require("path");
const tscfgPath = path.resolve(process.cwd(), "tsconfig.json");

const extendsPlugins = ["plugin:vue/vue3-essential", "eslint:recommended"];
let rules = {
  "default-case": "off",
  "no-dupe-class-members": "off",
  "no-undef": "off",
  "no-array-constructor": "off",
  "no-use-before-define": "off",
  "no-useless-constructor": "off",
  "prettier/prettier": "error",
  "standard/no-callback-literal": "off",
};
const tsRules = {
  "default-case": "off",
  "@typescript-eslint/consistent-type-assertions": "warn",
  "@typescript-eslint/no-array-constructor": "warn",
  "@typescript-eslint/no-namespace": "error",
  "@typescript-eslint/no-use-before-define": [
    "error",
    {
      functions: false,
      classes: false,
      variables: false,
      typedefs: false,
    },
  ],
  "@typescript-eslint/no-unused-vars": [
    "error",
    {
      args: "none",
      ignoreRestSiblings: true,
    },
  ],
  "@typescript-eslint/no-useless-constructor": "warn",
  "@typescript-eslint/explicit-function-return-type": "off",
  "@typescript-eslint/explicit-module-boundary-types": "off",
  "@typescript-eslint/member-delimiter-style": "off",
  "@typescript-eslint/no-explicit-any": "off",
};
if (fs.existsSync(tscfgPath)) {
  extendsPlugins.push("@vue/typescript");
  rules = Object.assign(rules, tsRules);
}

const config = {
  root: true,
  env: {
    node: true,
  },
  ignorePatterns: ["**/dist/**", "**/build/**", "**/static/**"],
  extends: extendsPlugins,
  plugins: ["prettier"],
  parserOptions: {
    ecmaVersion: 2020,
  },
  rules,
  overrides: [
    {
      files: [
        "**/__tests__/*.{j,t}s?(x)",
        "**/tests/unit/**/*.spec.{j,t}s?(x)",
      ],
      env: {
        jest: true,
      },
    },
  ],
};

module.exports = config;
