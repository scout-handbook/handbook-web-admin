import postcssGlobalData from "@csstools/postcss-global-data";
import autoprefixer from "autoprefixer";
import postcssCustomProperties from "postcss-custom-properties";

export default {
  plugins: [
    postcssGlobalData({ files: ["src/lib/default-theme.css"] }),
    postcssCustomProperties({ preserve: false }),
    autoprefixer(),
  ],
};
