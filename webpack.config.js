const path = require("path");

module.exports = {
  devtool: "source-map",
  entry: "./src/index.js",
  output: {
    // devtoolLineToLine: true,
    sourceMapFilename: "fretboard.js.map",
    pathinfo: true,
    path: path.resolve(__dirname, "dist"),
    filename: "fretboard.js",
    library: "fretboard",
    libraryTarget: "umd",
  },
  module: {
    rules: [
      {
        test: /\.css$/,
        use: ["style-loader", "css-loader"],
      },
      {
        test: /\.js$/,
        loader: "babel-loader",
      },
    ],
  },
};
