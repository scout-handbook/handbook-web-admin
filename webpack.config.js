/* eslint-env node */

module.exports = {
  mode: "development",
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
};
