/* eslint-env node */

const path = require("path");

const sveltePreprocess = require("svelte-preprocess");
const TerserPlugin = require("terser-webpack-plugin");

const mode = "production";

module.exports = {
  mode,
  devtool: "source-map",
  module: {
    rules: [
      {
        test: /\.svelte$/,
        use: {
          loader: "svelte-loader",
          options: {
            compilerOptions: {
              dev: mode === "development",
            },
            preprocess: sveltePreprocess({
              tsconfigFile: "./tsconfig.json",
            }),
          },
        },
      },
      {
        test: /\.ts$/,
        use: {
          loader: "ts-loader",
          options: {
            onlyCompileBundledFiles: true,
          },
        },
      },
    ],
  },
  resolve: {
    alias: {
      svelte: path.resolve("node_modules", "svelte"),
    },
    conditionNames: ["require", "node", "svelte"],
    extensions: [".ts", ".js", ".svelte"],
    mainFields: ["svelte", "browser", "module", "main"],
  },
  output: {
    filename: "[name].js",
  },
  externalsType: "var",
  externals: {
    easymde: "EasyMDE",
    showdown: "showdown",
    xss: "filterXSS",
  },
  optimization: {
    minimize: mode === "production",
    minimizer: [
      new TerserPlugin({
        extractComments: false,
        terserOptions: {
          format: {
            comments: false,
          },
        },
      }),
    ],
  },
};
