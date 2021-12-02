/*
 * @Descripttion:
 * @Author: OwenWong
 * @Email: owen.cq.cn@gmail.com
 * @Date: 2021-06-03 21:41:28
 */
"use strict";
const path = require("path");
const tscfgPath = path.resolve(process.cwd(), "tsconfig.json");

const extendsPlugins = ["plugin:vue/vue3-essential", "eslint:recommended"];
if (fs.existsSync(tscfgPath)) {
  extendsPlugins.push("@vue/typescript");
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
  rules: {
    "default-case": "off",
    "no-dupe-class-members": "off",
    "no-undef": "off",
    "@typescript-eslint/consistent-type-assertions": "warn",
    "no-array-constructor": "off",
    "@typescript-eslint/no-array-constructor": "warn",
    "@typescript-eslint/no-namespace": "error",
    "no-use-before-define": "off",
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
    "no-useless-constructor": "off",
    "@typescript-eslint/no-useless-constructor": "warn",
    "prettier/prettier": "error",
    "standard/no-callback-literal": "off",
    "@typescript-eslint/explicit-function-return-type": "off",
    "@typescript-eslint/explicit-module-boundary-types": "off",
    "@typescript-eslint/member-delimiter-style": "off",
    "@typescript-eslint/no-explicit-any": "off",
  },
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
