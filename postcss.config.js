/* eslint-env node */

import postcssGlobalData from "@csstools/postcss-global-data";
import autoprefixer from "autoprefixer";
import postcssCustomProperties from "postcss-custom-properties";

function getThemeFiles() {
  const themeFiles = ["src/lib/default-theme.css"];
  const argTheme = process.env.THEME;
  if (argTheme !== undefined && argTheme !== "undefined" && argTheme !== "") {
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
