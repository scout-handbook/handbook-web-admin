/* eslint-env node */

module.exports = {
  mode: "development",
  module: {
    rules: [
      {
        test: /\.ts$/,
        use: {
          loader: "ts-loader",
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
