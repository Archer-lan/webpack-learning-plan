const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
  mode: 'development',
  entry: './src/index.js',
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'bundle.js',
    clean: true
  },
  module: {
    rules: [
      // TODO: 配置 CSS 文件的处理规则
      // 提示：test 使用 /\.css$/，use 数组包含 'style-loader' 和 'css-loader'
    ]
  },
  plugins: [
    // TODO: 配置 HtmlWebpackPlugin
    // 提示：template 指向 './src/index.html'
  ]
};
