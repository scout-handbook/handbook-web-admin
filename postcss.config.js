import postcssGlobalData from "@csstools/postcss-global-data";
import autoprefixer from "autoprefixer";
import postcssCustomProperties from "postcss-custom-properties";

function getThemeFiles() {
  const themeFiles = ["src/lib/default-theme.css"];
  const argTheme = process.env.VITE_THEME;
  if (argTheme !== undefined && argTheme !== "undefined") {
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
