# Loader 详细配置

## 概述

Loader 是 webpack 的核心功能之一，它让 webpack 能够处理非 JavaScript 文件。本课程将详细讲解常用 loader 的配置和使用方法。

**预估学习时长：4 小时**

## Loader 基本概念

Loader 用于对模块的源代码进行转换。它可以：
- 将 TypeScript 转换为 JavaScript
- 将 Sass/Less 转换为 CSS
- 将图片转换为 Data URL 或文件
- 等等...

## 配置语法

```javascript
module: {
  rules: [
    {
      test: /\.css$/,           // 匹配文件
      use: ['style-loader', 'css-loader'],  // 使用的 loader
      exclude: /node_modules/,  // 排除目录
      include: path.resolve(__dirname, 'src')  // 包含目录
    }
  ]
}
```

## 常用 Loader 详解

### 1. babel-loader

将 ES6+ 代码转换为 ES5：

```javascript
{
  test: /\.js$/,
  exclude: /node_modules/,
  use: {
    loader: 'babel-loader',
    options: {
      presets: [
        ['@babel/preset-env', {
          targets: '> 0.25%, not dead',
          useBuiltIns: 'usage',
          corejs: 3
        }]
      ],
      plugins: ['@babel/plugin-transform-runtime']
    }
  }
}
```

**安装**：
```bash
npm install -D babel-loader @babel/core @babel/preset-env
```

### 2. css-loader

解析 CSS 文件中的 `@import` 和 `url()`：

```javascript
{
  test: /\.css$/,
  use: ['style-loader', 'css-loader']
}
```

**配置选项**：
```javascript
{
  loader: 'css-loader',
  options: {
    modules: true,  // 启用 CSS Modules
    importLoaders: 1,  // 在 css-loader 前应用的 loader 数量
    sourceMap: true
  }
}
```

### 3. style-loader

将 CSS 注入到 DOM 中：

```javascript
{
  test: /\.css$/,
  use: ['style-loader', 'css-loader']
}
```

### 4. sass-loader / less-loader

处理 Sass/Less 文件：

```javascript
// Sass
{
  test: /\.scss$/,
  use: ['style-loader', 'css-loader', 'sass-loader']
}

// Less
{
  test: /\.less$/,
  use: ['style-loader', 'css-loader', 'less-loader']
}
```

**安装**：
```bash
npm install -D sass-loader sass
npm install -D less-loader less
```

### 5. postcss-loader

使用 PostCSS 处理 CSS（自动添加前缀等）：

```javascript
{
  test: /\.css$/,
  use: [
    'style-loader',
    'css-loader',
    {
      loader: 'postcss-loader',
      options: {
        postcssOptions: {
          plugins: [
            ['autoprefixer', { browsers: 'last 2 versions' }]
          ]
        }
      }
    }
  ]
}
```

### 6. file-loader（webpack 5 已内置）

处理文件资源：

```javascript
// webpack 4
{
  test: /\.(png|jpg|gif)$/,
  use: {
    loader: 'file-loader',
    options: {
      name: '[name].[hash:8].[ext]',
      outputPath: 'images/'
    }
  }
}

// webpack 5（使用 Asset Modules）
{
  test: /\.(png|jpg|gif)$/,
  type: 'asset/resource',
  generator: {
    filename: 'images/[name].[hash:8][ext]'
  }
}
```

### 7. url-loader（webpack 5 已内置）

将小文件转换为 Data URL：

```javascript
// webpack 4
{
  test: /\.(png|jpg|gif)$/,
  use: {
    loader: 'url-loader',
    options: {
      limit: 8192,  // 小于 8KB 转为 Data URL
      name: '[name].[hash:8].[ext]',
      outputPath: 'images/'
    }
  }
}

// webpack 5（使用 Asset Modules）
{
  test: /\.(png|jpg|gif)$/,
  type: 'asset',
  parser: {
    dataUrlCondition: {
      maxSize: 8 * 1024  // 8KB
    }
  }
}
```

### 8. ts-loader

处理 TypeScript 文件：

```javascript
{
  test: /\.tsx?$/,
  use: 'ts-loader',
  exclude: /node_modules/
}
```

**配置**：需要 `tsconfig.json` 文件

### 9. vue-loader

处理 Vue 单文件组件：

```javascript
const { VueLoaderPlugin } = require('vue-loader');

module.exports = {
  module: {
    rules: [
      {
        test: /\.vue$/,
        loader: 'vue-loader'
      }
    ]
  },
  plugins: [
    new VueLoaderPlugin()
  ]
};
```

### 10. eslint-loader（已废弃，使用 eslint-webpack-plugin）

代码检查：

```javascript
// 旧方式（不推荐）
{
  test: /\.js$/,
  enforce: 'pre',
  use: 'eslint-loader'
}

// 新方式（推荐）
const ESLintPlugin = require('eslint-webpack-plugin');

plugins: [
  new ESLintPlugin({
    extensions: ['js', 'jsx', 'ts', 'tsx']
  })
]
```

### 11. raw-loader

将文件作为字符串导入：

```javascript
{
  test: /\.txt$/,
  use: 'raw-loader'
}
```

### 12. html-loader

处理 HTML 文件中的资源引用：

```javascript
{
  test: /\.html$/,
  use: 'html-loader'
}
```

## Loader 执行顺序

Loader 从右到左（或从下到上）执行：

```javascript
{
  test: /\.scss$/,
  use: [
    'style-loader',  // 3. 将 CSS 注入 DOM
    'css-loader',    // 2. 解析 CSS
    'sass-loader'    // 1. 编译 Sass
  ]
}
```

## Loader 配置技巧

### 1. 使用 enforce 控制执行顺序

```javascript
{
  test: /\.js$/,
  enforce: 'pre',  // 'pre' | 'post'
  use: 'eslint-loader'
}
```

### 2. 条件配置

```javascript
{
  test: /\.js$/,
  use: {
    loader: 'babel-loader',
    options: {
      cacheDirectory: true  // 启用缓存
    }
  },
  include: path.resolve(__dirname, 'src'),
  exclude: /node_modules/
}
```

### 3. 链式调用

```javascript
{
  test: /\.css$/,
  use: [
    { loader: 'style-loader' },
    {
      loader: 'css-loader',
      options: { modules: true }
    },
    { loader: 'postcss-loader' }
  ]
}
```

## 配置前后对比

### 配置前

```javascript
// 无法处理 CSS 文件
import './style.css';  // 报错
```

### 配置后

```javascript
// webpack.config.js
module: {
  rules: [
    {
      test: /\.css$/,
      use: ['style-loader', 'css-loader']
    }
  ]
}

// 可以正常导入 CSS
import './style.css';  // 正常工作
```

## 小结

- Loader 用于转换非 JavaScript 文件
- 常用 loader 包括 babel-loader、css-loader、sass-loader、ts-loader 等
- Loader 从右到左执行
- webpack 5 内置了 Asset Modules，替代了 file-loader 和 url-loader
- 使用 enforce 可以控制 loader 的执行顺序

## 相关链接

- [Loaders 官方文档](https://webpack.js.org/loaders/)
- [Asset Modules](https://webpack.js.org/guides/asset-modules/)
