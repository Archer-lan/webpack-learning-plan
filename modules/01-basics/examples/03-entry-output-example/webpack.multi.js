const path = require('path');

module.exports = {
  mode: 'development',
  entry: {
    app: './src/app.js',
    admin: './src/admin.js'
  },
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: '[name].bundle.js',
    clean: true
  }
};
