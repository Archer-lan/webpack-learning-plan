# Entry 和 Output 概念

本课程详细讲解 webpack 的 entry（入口）和 output（输出）配置。

预估学习时长：40 分钟

## 关键知识点

- entry 的作用和配置方式
- 单入口和多入口配置
- output 的常用配置选项
- 输出文件的命名规则

## 课程内容

### Entry（入口）

entry 是 webpack 构建依赖图的起点。webpack 会从 entry 指定的文件开始，递归地找出所有依赖的模块。

#### 单入口配置

最简单的配置方式：

```javascript
// webpack.config.js
module.exports = {
  entry: './src/index.js'
};
```

#### 多入口配置

当应用有多个入口点时：

```javascript
module.exports = {
  entry: {
    app: './src/app.js',
    admin: './src/admin.js'
  }
};
```

### Output（输出）

output 配置告诉 webpack 如何输出打包后的文件，以及输出到哪里。

#### 基本配置

```javascript
const path = require('path');

module.exports = {
  entry: './src/index.js',
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'bundle.js'
  }
};
```

#### 多入口的输出配置

使用占位符为不同入口生成不同的输出文件：

```javascript
module.exports = {
  entry: {
    app: './src/app.js',
    admin: './src/admin.js'
  },
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: '[name].bundle.js'  // app.bundle.js, admin.bundle.js
  }
};
```

#### 常用占位符

- `[name]` - 入口名称
- `[hash]` - 构建的 hash 值
- `[chunkhash]` - chunk 的 hash 值
- `[contenthash]` - 内容的 hash 值

### 实践示例

创建一个包含多入口的项目：

```javascript
// webpack.config.js
const path = require('path');

module.exports = {
  entry: {
    home: './src/home.js',
    about: './src/about.js'
  },
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: '[name].[contenthash].js',
    clean: true  // 清理旧文件
  }
};
```

## 相关文档

- [Webpack 官方文档 - Entry Points](https://webpack.js.org/concepts/entry-points/)
- [Webpack 官方文档 - Output](https://webpack.js.org/concepts/output/)
- [Webpack 官方文档 - Output Management](https://webpack.js.org/guides/output-management/)
