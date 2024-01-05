/* eslint-env node */

import autoprefixer from "autoprefixer";
import postcssCustomProperties from "postcss-custom-properties";
import postcssGlobalData from "@csstools/postcss-global-data";
import yargs from "yargs";
import { hideBin } from "yargs/helpers";

function getThemeFiles() {
  const themeFiles = ["src/css/default-theme.css"];
  const argTheme = yargs(hideBin(process.argv)).string("theme").argv.theme;
  if (argTheme !== undefined) {
    themeFiles.push(argTheme);
  }
  return themeFiles;
}

export default {
  plugins: [
    postcssGlobalData({ files: getThemeFiles() }),
    postcssCustomProperties({ preserve: false }),
    autoprefixer(),
  ],
};
