# Plugin 详细配置

## 概述

Plugin 用于扩展 webpack 的功能，可以在打包过程的不同阶段执行各种任务。本课程将详细讲解常用 plugin 的配置和使用方法。

**预估学习时长：3 小时**

## Plugin 基本概念

Plugin 是 webpack 的支柱功能，它可以：
- 打包优化和压缩
- 重新定义环境变量
- 生成 HTML 文件
- 提取 CSS 到单独文件
- 等等...

## 配置语法

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

## 常用 Plugin 详解

### 1. HtmlWebpackPlugin

自动生成 HTML 文件并注入打包后的资源：

```javascript
const HtmlWebpackPlugin = require('html-webpack-plugin');

plugins: [
  new HtmlWebpackPlugin({
    template: './src/index.html',  // 模板文件
    filename: 'index.html',  // 输出文件名
    title: 'My App',  // HTML 标题
    inject: 'body',  // 注入位置：'head' | 'body'
    minify: {
      collapseWhitespace: true,  // 压缩空格
      removeComments: true  // 移除注释
    },
    chunks: ['app']  // 指定要注入的 chunk
  })
]
```

**安装**：
```bash
npm install -D html-webpack-plugin
```

### 2. MiniCssExtractPlugin

将 CSS 提取到单独的文件（生产环境推荐）：

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
      filename: 'css/[name].[contenthash:8].css',
      chunkFilename: 'css/[id].[contenthash:8].css'
    })
  ]
};
```

**安装**：
```bash
npm install -D mini-css-extract-plugin
```

### 3. CleanWebpackPlugin

清理构建目录：

```javascript
const { CleanWebpackPlugin } = require('clean-webpack-plugin');

plugins: [
  new CleanWebpackPlugin()
]
```

**webpack 5 内置方案**：
```javascript
output: {
  clean: true  // 自动清理
}
```

### 4. DefinePlugin（webpack 内置）

定义全局常量：

```javascript
const webpack = require('webpack');

plugins: [
  new webpack.DefinePlugin({
    'process.env.NODE_ENV': JSON.stringify('production'),
    'process.env.API_URL': JSON.stringify('https://api.example.com'),
    VERSION: JSON.stringify('1.0.0')
  })
]
```

### 5. CopyWebpackPlugin

复制文件或目录到构建目录：

```javascript
const CopyWebpackPlugin = require('copy-webpack-plugin');

plugins: [
  new CopyWebpackPlugin({
    patterns: [
      { from: 'public', to: 'public' },
      { from: 'src/assets', to: 'assets' }
    ]
  })
]
```

**安装**：
```bash
npm install -D copy-webpack-plugin
```

### 6. CompressionWebpackPlugin

生成 gzip 压缩文件：

```javascript
const CompressionPlugin = require('compression-webpack-plugin');

plugins: [
  new CompressionPlugin({
    algorithm: 'gzip',
    test: /\.(js|css|html|svg)$/,
    threshold: 10240,  // 只压缩大于 10KB 的文件
    minRatio: 0.8  // 压缩比小于 0.8 才生成
  })
]
```

**安装**：
```bash
npm install -D compression-webpack-plugin
```

### 7. BundleAnalyzerPlugin

可视化分析打包结果：

```javascript
const { BundleAnalyzerPlugin } = require('webpack-bundle-analyzer');

plugins: [
  new BundleAnalyzerPlugin({
    analyzerMode: 'static',  // 'server' | 'static' | 'json'
    openAnalyzer: false,
    reportFilename: 'bundle-report.html'
  })
]
```

**安装**：
```bash
npm install -D webpack-bundle-analyzer
```

### 8. ProvidePlugin（webpack 内置）

自动加载模块，无需 import：

```javascript
const webpack = require('webpack');

plugins: [
  new webpack.ProvidePlugin({
    $: 'jquery',
    jQuery: 'jquery',
    _: 'lodash'
  })
]
```

### 9. HotModuleReplacementPlugin（webpack 内置）

启用模块热替换：

```javascript
const webpack = require('webpack');

plugins: [
  new webpack.HotModuleReplacementPlugin()
]

// webpack 5 简化配置
devServer: {
  hot: true  // 自动启用 HMR
}
```

### 10. ESLintWebpackPlugin

代码检查：

```javascript
const ESLintPlugin = require('eslint-webpack-plugin');

plugins: [
  new ESLintPlugin({
    extensions: ['js', 'jsx', 'ts', 'tsx'],
    fix: true,  // 自动修复
    cache: true,  // 启用缓存
    threads: true  // 多线程
  })
]
```

**安装**：
```bash
npm install -D eslint-webpack-plugin eslint
```

## Plugin 执行时机

Plugin 通过 webpack 的钩子系统在不同阶段执行：

```javascript
class MyPlugin {
  apply(compiler) {
    compiler.hooks.emit.tap('MyPlugin', (compilation) => {
      // 在生成资源到 output 目录之前执行
      console.log('Emitting files...');
    });
  }
}

plugins: [
  new MyPlugin()
]
```

## 多个 Plugin 组合使用

```javascript
const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const webpack = require('webpack');

module.exports = {
  plugins: [
    new HtmlWebpackPlugin({
      template: './src/index.html'
    }),
    new MiniCssExtractPlugin({
      filename: 'css/[name].[contenthash:8].css'
    }),
    new CopyWebpackPlugin({
      patterns: [{ from: 'public', to: 'public' }]
    }),
    new webpack.DefinePlugin({
      'process.env.NODE_ENV': JSON.stringify('production')
    })
  ]
};
```

## 配置前后对比

### 配置前

```javascript
// 需要手动创建 HTML 文件
// 需要手动引入打包后的 JS 文件
// CSS 内联在 JS 中
```

### 配置后

```javascript
plugins: [
  new HtmlWebpackPlugin({
    template: './src/index.html'
  }),
  new MiniCssExtractPlugin({
    filename: 'css/[name].css'
  })
]

// 自动生成 HTML 并注入资源
// CSS 提取到单独文件
```

## 开发环境 vs 生产环境

### 开发环境

```javascript
const webpack = require('webpack');

plugins: [
  new webpack.HotModuleReplacementPlugin(),
  new HtmlWebpackPlugin({
    template: './src/index.html'
  })
]
```

### 生产环境

```javascript
plugins: [
  new HtmlWebpackPlugin({
    template: './src/index.html',
    minify: {
      collapseWhitespace: true,
      removeComments: true
    }
  }),
  new MiniCssExtractPlugin({
    filename: 'css/[name].[contenthash:8].css'
  }),
  new CompressionPlugin(),
  new webpack.DefinePlugin({
    'process.env.NODE_ENV': JSON.stringify('production')
  })
]
```

## 小结

- Plugin 用于扩展 webpack 功能
- 常用 plugin 包括 HtmlWebpackPlugin、MiniCssExtractPlugin、DefinePlugin 等
- Plugin 通过 webpack 钩子系统在不同阶段执行
- 开发环境和生产环境应使用不同的 plugin 组合
- webpack 5 内置了一些常用功能，减少了对第三方 plugin 的依赖

## 相关链接

- [Plugins 官方文档](https://webpack.js.org/plugins/)
- [Plugin API](https://webpack.js.org/api/plugins/)
