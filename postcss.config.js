/* eslint-env node */

const yargs = require("yargs");

const autoprefixer = require("autoprefixer");
const postcssCustomProperties = require("postcss-custom-properties");
const postcssGlobalData = require("@csstools/postcss-global-data");

function getThemeFiles() {
  const themeFiles = ["src/css/default-theme.css"];
  const argTheme = yargs.string("theme").argv.theme;
  if (argTheme !== undefined) {
    themeFiles.push(argTheme);
  }
  return themeFiles;
}

module.exports = {
  plugins: [
    postcssGlobalData({ files: getThemeFiles() }),
    postcssCustomProperties({ preserve: false }),
    autoprefixer(),
  ],
};
