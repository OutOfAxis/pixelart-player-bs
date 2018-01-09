module.exports = {
  entry: ['./src/index.js'],
  output: {
    filename: 'bundle.js',
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
        },
      }
    ],
  },
  node: {
    fs: 'empty',
    mkdirp: 'empty',
    net: 'empty',
    tls: 'empty',
  },
};
