const path = require('path');

module.exports = {
  mode: 'development',
  entry: './src/index.js',
  module: {
    rules: [
      {
        test: /\.s[ac]ss$/i,
        use: ["style-loader", "css-loader", "sass-loader"],
      },
    ],
  },
  resolve: {
    extensions: ['.js', '.css'],
  },
  devServer: {
    static: {
      directory: path.join(__dirname, ''),
    },
    watchFiles: ['src/**/*.js','styles/**/*.scss'],
    compress: true,
    port: 9000,
  },
};