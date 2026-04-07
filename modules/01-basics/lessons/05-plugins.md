# Plugin 基本概念和使用

本课程介绍 webpack plugin 的基本概念和常用 plugin 的使用方法。

预估学习时长：60 分钟

## 关键知识点

- plugin 的作用和工作原理
- plugin 的配置方式
- 常用 plugin 的使用
- plugin 和 loader 的区别

## 课程内容

### 什么是 Plugin

plugin 用于执行范围更广的任务。插件的范围包括，从打包优化和压缩，一直到重新定义环境中的变量。插件接口功能极其强大，可以用来处理各种各样的任务。

### Plugin 和 Loader 的区别

- **Loader**：用于转换某些类型的模块，是一个转换器
- **Plugin**：用于执行更广泛的任务，如打包优化、资源管理、注入环境变量等

### Plugin 的配置

在 `webpack.config.js` 中配置 plugin：

```javascript
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
  plugins: [
    new HtmlWebpackPlugin({
      template: './src/index.html'
    })
  ]
};
```

### 常用 Plugin

#### 1. HtmlWebpackPlugin

自动生成 HTML 文件并注入打包后的资源：

```bash
npm install --save-dev html-webpack-plugin
```

```javascript
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
  plugins: [
    new HtmlWebpackPlugin({
      title: 'My App',
      template: './src/index.html',
      filename: 'index.html',
      minify: {
        collapseWhitespace: true,
        removeComments: true
      }
    })
  ]
};
```

#### 2. MiniCssExtractPlugin

将 CSS 提取到单独的文件：

```bash
npm install --save-dev mini-css-extract-plugin
```

```javascript
const MiniCssExtractPlugin = require('mini-css-extract-plugin');

module.exports = {
  module: {
    rules: [
      {
        test: /\.css$/,
        use: [
          MiniCssExtractPlugin.loader,  // 替代 style-loader
          'css-loader'
        ]
      }
    ]
  },
  plugins: [
    new MiniCssExtractPlugin({
      filename: '[name].[contenthash].css'
    })
  ]
};
```

#### 3. CleanWebpackPlugin

在每次构建前清理输出目录：

```bash
npm install --save-dev clean-webpack-plugin
```

```javascript
const { CleanWebpackPlugin } = require('clean-webpack-plugin');

module.exports = {
  plugins: [
    new CleanWebpackPlugin()
  ]
};
```

**注意**：webpack 5 可以使用内置的 `output.clean` 选项：

```javascript
module.exports = {
  output: {
    clean: true
  }
};
```

#### 4. DefinePlugin

定义环境变量（webpack 内置插件）：

```javascript
const webpack = require('webpack');

module.exports = {
  plugins: [
    new webpack.DefinePlugin({
      'process.env.NODE_ENV': JSON.stringify('production'),
      'process.env.API_URL': JSON.stringify('https://api.example.com')
    })
  ]
};
```

#### 5. CopyWebpackPlugin

复制文件或目录到输出目录：

```bash
npm install --save-dev copy-webpack-plugin
```

```javascript
const CopyWebpackPlugin = require('copy-webpack-plugin');

module.exports = {
  plugins: [
    new CopyWebpackPlugin({
      patterns: [
        { from: 'public', to: 'public' },
        { from: 'assets/images', to: 'images' }
      ]
    })
  ]
};
```

#### 6. ProvidePlugin

自动加载模块（webpack 内置插件）：

```javascript
const webpack = require('webpack');

module.exports = {
  plugins: [
    new webpack.ProvidePlugin({
      $: 'jquery',
      jQuery: 'jquery',
      _: 'lodash'
    })
  ]
};
```

使用后，在代码中可以直接使用 `$` 而无需 import。

#### 7. BannerPlugin

为每个生成的 chunk 添加 banner（webpack 内置插件）：

```javascript
const webpack = require('webpack');

module.exports = {
  plugins: [
    new webpack.BannerPlugin({
      banner: 'Copyright © 2024 My Company'
    })
  ]
};
```

### 实践示例

创建一个完整的 plugin 配置：

```javascript
const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const webpack = require('webpack');

module.exports = {
  entry: './src/index.js',
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: '[name].[contenthash].js'
  },
  module: {
    rules: [
      {
        test: /\.css$/,
        use: [MiniCssExtractPlugin.loader, 'css-loader']
      }
    ]
  },
  plugins: [
    // 清理输出目录
    new CleanWebpackPlugin(),
    
    // 生成 HTML 文件
    new HtmlWebpackPlugin({
      title: 'My Webpack App',
      template: './src/index.html',
      minify: {
        collapseWhitespace: true,
        removeComments: true
      }
    }),
    
    // 提取 CSS
    new MiniCssExtractPlugin({
      filename: '[name].[contenthash].css'
    }),
    
    // 定义环境变量
    new webpack.DefinePlugin({
      'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV || 'development')
    }),
    
    // 添加 banner
    new webpack.BannerPlugin({
      banner: 'Copyright © 2024'
    })
  ]
};
```

### Plugin 的执行时机

plugin 可以在 webpack 构建流程的不同阶段执行：

- **初始化阶段**：读取配置、实例化插件
- **编译阶段**：从 entry 开始递归解析依赖
- **输出阶段**：将编译后的内容输出到文件系统

不同的 plugin 会在不同的钩子（hooks）上执行。

## 相关文档

- [Webpack 官方文档 - Plugins](https://webpack.js.org/concepts/plugins/)
- [Webpack 官方文档 - Plugin API](https://webpack.js.org/api/plugins/)
- [HtmlWebpackPlugin 文档](https://github.com/jantimon/html-webpack-plugin)
- [MiniCssExtractPlugin 文档](https://webpack.js.org/plugins/mini-css-extract-plugin/)
