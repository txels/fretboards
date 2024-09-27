const path = require("path");

module.exports = {
  devtool: "source-map",
  entry: "./src/index.js",
  output: {
    path: path.resolve(__dirname, "dist"),
    filename: "fretboard.js",
    library: "fretboard",
    libraryTarget: "umd",
    // devtoolLineToLine: true,
    sourceMapFilename: "fretboard.js.map",
    pathinfo: true,
  },
  mode: "production",
  module: {
    rules: [
      {
        test: /\.css$/,
        use: ["style-loader", "css-loader"],
      },
      {
        test: /\.js$/,
        loader: "babel-loader",
        exclude: /d3-selection/,
      },
    ],
  },
};
