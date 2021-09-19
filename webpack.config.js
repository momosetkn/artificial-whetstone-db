const webpack = require('webpack');
const path = require("path")

const filterProcessEnv = (keys) => Object.entries(process.env).filter(([k]) =>
    keys.includes(k)).reduce((acc, cur) => ({
  ...acc,
  [cur[0]]: cur[1]
}), {});

module.exports = {
  mode: "development",
  entry: "./src/index.tsx",
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        use: "ts-loader",
        exclude: /node_modules/,
      },
      {
        test: /\.css?$/,
        use: ["style-loader", "css-loader"],
      },
    ],
  },
  resolve: {
    extensions: [".tsx", ".ts", ".js"],
  },
  devtool: "inline-source-map",
  devServer: {
    // contentBase: "./dist",
    static: {
      directory: path.join(__dirname, "dist"),
    },
  },
  output: {
    filename: "bundle.js",
    path: path.resolve(__dirname, "dist"),
  },
  plugins: [
    new webpack.DefinePlugin({
      process: {
        env: JSON.stringify(filterProcessEnv([
          "SEND_MAIL_ENDPOINT",
        ]))
      }
    }),
  ],
}