# 开发模式和生产模式

本课程介绍 webpack 的开发模式和生产模式的区别及使用场景。

预估学习时长：30 分钟

## 关键知识点

- mode 配置选项
- development 模式的特点
- production 模式的特点
- 不同模式下的优化策略

## 课程内容

### Mode 配置

webpack 提供了 `mode` 配置选项，用于指定当前的构建环境。mode 有三个可选值：

- `development`：开发模式
- `production`：生产模式
- `none`：不使用任何默认优化选项

```javascript
module.exports = {
  mode: 'development'  // 或 'production' 或 'none'
};
```

### Development 模式

开发模式针对开发体验进行优化，特点包括：

#### 1. 启用的功能

- **快速构建**：使用更快的增量编译
- **详细的错误信息**：提供有用的错误和警告信息
- **Source Map**：默认启用 `eval` source map，方便调试
- **模块名称**：使用可读的模块名称而不是数字 ID

#### 2. 配置示例

```javascript
module.exports = {
  mode: 'development',
  devtool: 'eval-source-map',  // 开发环境推荐的 source map
  optimization: {
    minimize: false  // 不压缩代码
  }
};
```

#### 3. 适用场景

- 本地开发
- 调试代码
- 快速迭代

### Production 模式

生产模式针对输出结果进行优化，特点包括：

#### 1. 启用的功能

- **代码压缩**：自动压缩 JavaScript 代码
- **Tree Shaking**：移除未使用的代码
- **作用域提升**：减小代码体积，提高运行效率
- **优化模块 ID**：使用更短的模块 ID
- **NoEmitOnErrorsPlugin**：编译出错时不输出资源
- **ModuleConcatenationPlugin**：作用域提升

#### 2. 配置示例

```javascript
module.exports = {
  mode: 'production',
  devtool: 'source-map',  // 生产环境推荐的 source map
  optimization: {
    minimize: true,  // 压缩代码
    splitChunks: {
      chunks: 'all'  // 代码分割
    }
  }
};
```

#### 3. 适用场景

- 部署到生产环境
- 需要最优的性能和体积
- 最终交付给用户的代码

### 模式对比

| 特性 | Development | Production |
|------|-------------|------------|
| 构建速度 | 快 | 慢 |
| 代码压缩 | 否 | 是 |
| Source Map | eval | source-map |
| 代码可读性 | 高 | 低 |
| 文件体积 | 大 | 小 |
| Tree Shaking | 否 | 是 |
| 作用域提升 | 否 | 是 |

### 通过命令行设置 Mode

可以通过命令行参数设置 mode：

```bash
# 开发模式
webpack --mode development

# 生产模式
webpack --mode production
```

### 通过环境变量设置 Mode

在 `package.json` 中配置不同的脚本：

```json
{
  "scripts": {
    "dev": "webpack --mode development",
    "build": "webpack --mode production"
  }
}
```

### 根据 Mode 进行条件配置

可以根据 mode 动态调整配置：

```javascript
module.exports = (env, argv) => {
  const isProduction = argv.mode === 'production';
  
  return {
    mode: argv.mode,
    devtool: isProduction ? 'source-map' : 'eval-source-map',
    output: {
      filename: isProduction ? '[name].[contenthash].js' : '[name].js'
    },
    optimization: {
      minimize: isProduction
    }
  };
};
```

### 实践示例

创建一个支持多环境的配置：

```javascript
const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = (env, argv) => {
  const isDevelopment = argv.mode === 'development';
  
  return {
    mode: argv.mode,
    entry: './src/index.js',
    output: {
      path: path.resolve(__dirname, 'dist'),
      filename: isDevelopment ? '[name].js' : '[name].[contenthash].js',
      clean: true
    },
    devtool: isDevelopment ? 'eval-source-map' : 'source-map',
    module: {
      rules: [
        {
          test: /\.js$/,
          exclude: /node_modules/,
          use: 'babel-loader'
        },
        {
          test: /\.css$/,
          use: ['style-loader', 'css-loader']
        }
      ]
    },
    plugins: [
      new HtmlWebpackPlugin({
        template: './src/index.html',
        minify: !isDevelopment
      })
    ],
    optimization: {
      minimize: !isDevelopment,
      splitChunks: {
        chunks: 'all'
      }
    }
  };
};
```

### 最佳实践

1. **开发时使用 development 模式**：获得更好的开发体验和调试能力
2. **生产时使用 production 模式**：获得最优的性能和体积
3. **分离配置文件**：可以创建 `webpack.dev.js` 和 `webpack.prod.js` 分别管理不同环境的配置
4. **使用环境变量**：通过 `process.env.NODE_ENV` 在代码中判断当前环境

## 相关文档

- [Webpack 官方文档 - Mode](https://webpack.js.org/configuration/mode/)
- [Webpack 官方文档 - Production](https://webpack.js.org/guides/production/)
- [Webpack 官方文档 - Development](https://webpack.js.org/guides/development/)
