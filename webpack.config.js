/* eslint-env node */

const TerserPlugin = require("terser-webpack-plugin");

module.exports = {
  mode: "production",
  devtool: "source-map",
  module: {
    rules: [
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
    extensions: [".ts", ".js", ".svelte"],
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
    minimize: true,
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
