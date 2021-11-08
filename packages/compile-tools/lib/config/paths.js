/*
 * @Descripttion: 
 * @Author: OwenWong
 * @Email: owen.cq.cn@gmail.com
 * @Date: 2021-06-03 21:41:28
 */
const path = require("path");

const workDir = process.cwd();
const distDir = path.resolve(workDir, "dist");
const staticDir = path.resolve(workDir, "static");
const tplFile = path.resolve(workDir, "index.html");
const entry = path.resolve(workDir, "src/index");
const pkgPath = path.resolve(workDir, "package.json");

module.exports = {
  workDir,
  distDir,
  staticDir,
  tplFile,
  entry,
  pkgPath,
};
