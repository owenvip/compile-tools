const fs = require("fs");
const path = require("path");

const pkgPath = path.resolve(process.cwd(), "package.json");
const fileContent = fs.readFileSync(pkgPath, "utf8");
const { dependencies } = JSON.parse(fileContent);

let config = {};

if (typeof dependencies.react === "string") {
  config = require("./react.js");
} else if (typeof dependencies.vue === "string") {
  config = require("./vue.js");
}

module.exports = config;
