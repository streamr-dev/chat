const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");

module.exports = {
  entry: path.join(__dirname, "src", "index.js"),
  output: {
    path: path.join(__dirname, "build"),
    filename: "index.bundle.js",
    libraryTarget: "umd",
  },
  mode: process.env.NODE_ENV || "development",
  resolve: {
    modules: [path.resolve(__dirname, "src"), "node_modules"],
    extensions: ["", ".js", ".jsx", ".ts", ".tsx"],
  },
  devServer: { contentBase: path.join(__dirname, "src") },
  module: {
    rules: [
      {
        test: /\.(js|jsx)$/,
        exclude: /node_modules/,
        use: ["babel-loader"],
      },
      {
        test: /\.(css|scss)$/,
        use: ["style-loader", "css-loader"],
      },
      {
        test: /\.(jpg|jpeg|png|gif|mp3|svg)$/,
        use: ["file-loader"],
      },
      {
        test: /\.(ts|tsx)?$/,
        use: "ts-loader",
        exclude: [/node_modules/, /server/],
      },
    ],
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: path.join(__dirname, "src", "index.html"),
      favicon: "./src/assets/streamr.svg",
    }),
  ],
};
