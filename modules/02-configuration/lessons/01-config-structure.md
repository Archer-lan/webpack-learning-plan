# webpack.config.js 文件结构

## 概述

webpack.config.js 是 webpack 的核心配置文件，它定义了 webpack 如何处理和打包你的项目。本课程将详细讲解配置文件的结构和各个部分的作用。

**预估学习时长：2 小时**

## 基本结构

webpack 配置文件导出一个配置对象：

```javascript
const path = require('path');

module.exports = {
  // 模式：development, production, none
  mode: 'development',
  
  // 入口文件
  entry: './src/index.js',
  
  // 输出配置
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'bundle.js'
  },
  
  // 模块规则（loader 配置）
  module: {
    rules: []
  },
  
  // 插件配置
  plugins: [],
  
  // 解析配置
  resolve: {
    extensions: ['.js', '.json']
  },
  
  // 开发服务器配置
  devServer: {
    port: 3000
  },
  
  // 优化配置
  optimization: {},
  
  // Source Map 配置
  devtool: 'eval-source-map'
};
```

## 配置方式

### 1. 对象配置

最常见的配置方式，导出一个配置对象：

```javascript
module.exports = {
  mode: 'production',
  entry: './src/index.js',
  // ...其他配置
};
```

### 2. 函数配置

导出一个返回配置对象的函数，可以根据环境变量动态生成配置：

```javascript
module.exports = (env, argv) => {
  const isProduction = argv.mode === 'production';
  
  return {
    mode: argv.mode,
    entry: './src/index.js',
    output: {
      filename: isProduction ? '[name].[contenthash].js' : '[name].js'
    },
    devtool: isProduction ? 'source-map' : 'eval-source-map'
  };
};
```

### 3. 多配置数组

导出一个配置数组，webpack 会并行执行多个配置：

```javascript
module.exports = [
  {
    // 配置 1：客户端打包
    entry: './src/client.js',
    output: {
      filename: 'client.bundle.js'
    }
  },
  {
    // 配置 2：服务端打包
    entry: './src/server.js',
    target: 'node',
    output: {
      filename: 'server.bundle.js'
    }
  }
];
```

## 核心配置项

### mode

指定构建模式，会自动启用相应的优化：

- `development`：开发模式，启用调试功能
- `production`：生产模式，启用代码压缩和优化
- `none`：不使用任何默认优化

### entry

指定打包的入口文件：

```javascript
// 单入口
entry: './src/index.js'

// 多入口
entry: {
  app: './src/app.js',
  admin: './src/admin.js'
}
```

### output

配置打包输出：

```javascript
output: {
  path: path.resolve(__dirname, 'dist'),
  filename: '[name].[contenthash].js',
  clean: true  // 清理旧文件
}
```

### module.rules

配置 loader 规则：

```javascript
module: {
  rules: [
    {
      test: /\.css$/,
      use: ['style-loader', 'css-loader']
    }
  ]
}
```

### plugins

配置插件：

```javascript
const HtmlWebpackPlugin = require('html-webpack-plugin');

plugins: [
  new HtmlWebpackPlugin({
    template: './src/index.html'
  })
]
```

## 配置文件命名

webpack 支持多种配置文件名：

- `webpack.config.js`（默认）
- `webpack.config.ts`（TypeScript）
- 自定义名称（需要通过 `--config` 参数指定）

```bash
# 使用自定义配置文件
webpack --config webpack.prod.js
```

## 环境变量

通过命令行传递环境变量：

```bash
webpack --env production --env api=https://api.example.com
```

在配置文件中接收：

```javascript
module.exports = (env) => {
  console.log(env.production);  // true
  console.log(env.api);  // 'https://api.example.com'
  
  return {
    // 配置对象
  };
};
```

## 最佳实践

1. **分离配置文件**：为不同环境创建独立的配置文件
   - `webpack.common.js`：公共配置
   - `webpack.dev.js`：开发环境配置
   - `webpack.prod.js`：生产环境配置

2. **使用 webpack-merge 合并配置**：

```javascript
// webpack.dev.js
const { merge } = require('webpack-merge');
const common = require('./webpack.common.js');

module.exports = merge(common, {
  mode: 'development',
  devtool: 'eval-source-map',
  devServer: {
    hot: true
  }
});
```

3. **使用环境变量**：通过 `.env` 文件管理环境变量

4. **配置验证**：使用 TypeScript 或 JSON Schema 验证配置

## 配置前后对比

### 配置前（零配置）

```bash
# 使用默认配置
webpack
```

- 入口：`src/index.js`
- 输出：`dist/main.js`
- 模式：`production`

### 配置后（自定义配置）

```javascript
// webpack.config.js
module.exports = {
  mode: 'development',
  entry: './app/main.js',
  output: {
    path: path.resolve(__dirname, 'build'),
    filename: 'app.bundle.js'
  }
};
```

- 入口：`app/main.js`
- 输出：`build/app.bundle.js`
- 模式：`development`

## 小结

- webpack.config.js 是 webpack 的核心配置文件
- 支持对象、函数、数组三种配置方式
- 核心配置项包括 mode、entry、output、module、plugins 等
- 建议为不同环境创建独立的配置文件
- 使用 webpack-merge 合并配置，提高可维护性

## 相关链接

- [Configuration 官方文档](https://webpack.js.org/configuration/)
- [Configuration Types](https://webpack.js.org/configuration/configuration-types/)
