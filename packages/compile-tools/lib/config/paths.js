const path = require("path");

const workDir = process.cwd();
const distDir = path.resolve(workDir, "dist");
const staticDir = path.resolve(workDir, "static");
const tplFile = path.resolve(workDir, "index.html");
const entry = path.resolve(workDir, "src/index.ts");

module.exports = {
  workDir,
  distDir,
  staticDir,
  tplFile,
  entry,
};
