const path = require('path');

module.exports = (env, argv) => {
  const isDevelopment = argv.mode === 'development';
  
  return {
    entry: './src/index.js',
    output: {
      path: path.resolve(__dirname, 'dist'),
      filename: isDevelopment ? 'bundle.js' : 'bundle.[contenthash].js',
      clean: true
    },
    devtool: isDevelopment ? 'eval-source-map' : 'source-map'
  };
};
