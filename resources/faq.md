# Webpack 常见问题解答（FAQ）

## 基础问题

### 1. Webpack 是什么？

Webpack 是一个现代 JavaScript 应用程序的静态模块打包工具。它将项目中的各种资源（JavaScript、CSS、图片等）视为模块，通过分析依赖关系，将它们打包成浏览器可以识别的静态资源。

### 2. Webpack 和 Gulp/Grunt 有什么区别？

- **Webpack**：模块打包工具，专注于模块依赖管理和打包
- **Gulp/Grunt**：任务运行器，专注于自动化构建流程

Webpack 更适合现代前端项目，Gulp/Grunt 更适合简单的任务自动化。

### 3. 为什么需要 Webpack？

- 模块化开发：支持 ES6 模块、CommonJS、AMD 等
- 资源管理：统一处理 JS、CSS、图片等资源
- 代码优化：压缩、分割、Tree Shaking 等
- 开发体验：热更新、Source Map 等

### 4. Webpack 4 和 Webpack 5 有什么区别？

主要区别：
- 更好的 Tree Shaking
- 持久化缓存
- 模块联邦（Module Federation）
- 移除了 Node.js polyfills
- 资源模块（Asset Modules）替代 file-loader 和 url-loader

### 5. 零配置真的不需要配置吗？

零配置是指 Webpack 提供了默认配置，可以直接运行。但实际项目中通常需要自定义配置来满足特定需求。

## 配置问题

### 6. entry 和 output 是什么？

- **entry**：打包的入口文件，Webpack 从这里开始构建依赖图
- **output**：打包后文件的输出位置和文件名

```javascript
module.exports = {
  entry: './src/index.js',
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'bundle.js'
  }
};
```

### 7. loader 和 plugin 有什么区别？

- **Loader**：转换模块内容，如将 TypeScript 转为 JavaScript
- **Plugin**：扩展 Webpack 功能，如生成 HTML 文件、压缩代码等

Loader 在模块加载时执行，Plugin 在构建流程的不同阶段执行。

### 8. 如何配置多入口？

```javascript
module.exports = {
  entry: {
    app: './src/app.js',
    admin: './src/admin.js'
  },
  output: {
    filename: '[name].bundle.js',
    path: path.resolve(__dirname, 'dist')
  }
};
```

### 9. 如何处理 CSS 文件？

```javascript
module.exports = {
  module: {
    rules: [
      {
        test: /\.css$/,
        use: ['style-loader', 'css-loader']
      }
    ]
  }
};
```

### 10. 如何处理图片和字体？

Webpack 5 使用 Asset Modules：

```javascript
module.exports = {
  module: {
    rules: [
      {
        test: /\.(png|jpg|gif)$/,
        type: 'asset/resource'
      },
      {
        test: /\.(woff|woff2|eot|ttf|otf)$/,
        type: 'asset/resource'
      }
    ]
  }
};
```

## 开发问题

### 11. 如何启用热更新（HMR）？

```javascript
module.exports = {
  devServer: {
    hot: true
  }
};
```

或在代码中手动接受更新：

```javascript
if (module.hot) {
  module.hot.accept('./module.js', () => {
    // 模块更新时的处理逻辑
  });
}
```

### 12. 如何配置开发服务器？

```javascript
module.exports = {
  devServer: {
    port: 3000,
    open: true,
    hot: true,
    compress: true,
    historyApiFallback: true
  }
};
```

### 13. 如何配置代理解决跨域问题？

```javascript
module.exports = {
  devServer: {
    proxy: {
      '/api': {
        target: 'http://localhost:8080',
        changeOrigin: true,
        pathRewrite: { '^/api': '' }
      }
    }
  }
};
```

### 14. 如何配置 Source Map？

```javascript
module.exports = {
  devtool: 'eval-source-map'  // 开发环境
  // devtool: 'source-map'     // 生产环境
};
```

常用选项：
- `eval-source-map`：开发环境，快速重建
- `source-map`：生产环境，完整 source map
- `cheap-module-source-map`：折中方案

## 优化问题

### 15. 如何进行代码分割？

```javascript
module.exports = {
  optimization: {
    splitChunks: {
      chunks: 'all',
      cacheGroups: {
        vendor: {
          test: /[\\/]node_modules[\\/]/,
          name: 'vendors',
          priority: 10
        }
      }
    }
  }
};
```

### 16. 如何启用 Tree Shaking？

Tree Shaking 在生产模式下自动启用，前提是：
- 使用 ES6 模块语法（import/export）
- 在 package.json 中设置 `"sideEffects": false`

```json
{
  "sideEffects": false
}
```

### 17. 如何压缩代码？

生产模式下自动压缩，也可以手动配置：

```javascript
const TerserPlugin = require('terser-webpack-plugin');

module.exports = {
  optimization: {
    minimize: true,
    minimizer: [new TerserPlugin()]
  }
};
```

### 18. 如何提取 CSS 到单独文件？

```javascript
const MiniCssExtractPlugin = require('mini-css-extract-plugin');

module.exports = {
  module: {
    rules: [
      {
        test: /\.css$/,
        use: [MiniCssExtractPlugin.loader, 'css-loader']
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

### 19. 如何配置缓存？

使用 contenthash：

```javascript
module.exports = {
  output: {
    filename: '[name].[contenthash].js',
    path: path.resolve(__dirname, 'dist')
  }
};
```

### 20. 如何优化构建速度？

1. **使用缓存**：
```javascript
module.exports = {
  cache: {
    type: 'filesystem'
  }
};
```

2. **减少 loader 处理范围**：
```javascript
{
  test: /\.js$/,
  exclude: /node_modules/,
  use: 'babel-loader'
}
```

3. **使用 DllPlugin**（Webpack 4）或 **持久化缓存**（Webpack 5）

4. **多线程构建**：使用 thread-loader

## 错误处理

### 21. Module not found 错误怎么办？

检查：
1. 文件路径是否正确
2. 文件扩展名是否配置在 resolve.extensions 中
3. 是否安装了相关依赖

```javascript
module.exports = {
  resolve: {
    extensions: ['.js', '.jsx', '.json']
  }
};
```

### 22. Loader 执行顺序错误怎么办？

记住 loader 从右到左执行：

```javascript
// 正确
use: ['style-loader', 'css-loader', 'sass-loader']
// sass-loader → css-loader → style-loader

// 错误
use: ['sass-loader', 'css-loader', 'style-loader']
```

### 23. 打包后文件过大怎么办？

1. 使用代码分割
2. 启用 Tree Shaking
3. 压缩代码
4. 使用 webpack-bundle-analyzer 分析
5. 按需加载（懒加载）

### 24. 热更新不生效怎么办？

检查：
1. devServer.hot 是否设置为 true
2. 是否使用了 HotModuleReplacementPlugin
3. 代码中是否正确处理了 module.hot.accept

### 25. Source Map 不生效怎么办？

检查：
1. devtool 配置是否正确
2. 生产环境是否需要 source map
3. 浏览器开发者工具是否启用了 source map

## 高级问题

### 26. 如何编写自定义 Loader？

```javascript
module.exports = function(source) {
  // 转换 source
  const result = transform(source);
  return result;
};
```

### 27. 如何编写自定义 Plugin？

```javascript
class MyPlugin {
  apply(compiler) {
    compiler.hooks.emit.tap('MyPlugin', (compilation) => {
      // 在输出资源前执行
    });
  }
}

module.exports = MyPlugin;
```

### 28. 如何配置多环境？

使用 webpack-merge：

```javascript
// webpack.common.js
module.exports = { /* 公共配置 */ };

// webpack.dev.js
const { merge } = require('webpack-merge');
const common = require('./webpack.common.js');

module.exports = merge(common, {
  mode: 'development',
  devtool: 'eval-source-map'
});

// webpack.prod.js
const { merge } = require('webpack-merge');
const common = require('./webpack.common.js');

module.exports = merge(common, {
  mode: 'production',
  devtool: 'source-map'
});
```

### 29. 如何实现按需加载？

使用动态 import：

```javascript
// 点击时加载模块
button.addEventListener('click', () => {
  import('./module.js').then(module => {
    module.default();
  });
});
```

### 30. 如何配置别名（alias）？

```javascript
module.exports = {
  resolve: {
    alias: {
      '@': path.resolve(__dirname, 'src'),
      'components': path.resolve(__dirname, 'src/components')
    }
  }
};

// 使用
import Button from '@/components/Button';
```

## 调试技巧

### 如何调试 Webpack 配置？

1. 使用 `--stats verbose` 查看详细信息
2. 使用 webpack-bundle-analyzer 可视化分析
3. 在配置文件中添加 console.log
4. 使用 Node.js 调试器

### 如何查看打包结果？

```bash
# 查看详细统计信息
webpack --stats verbose

# 生成 JSON 文件
webpack --profile --json > stats.json
```

## 学习建议

1. 从官方文档开始学习
2. 动手实践，配置实际项目
3. 阅读开源项目的配置
4. 参与社区讨论
5. 关注官方博客和更新

## 更多资源

- [官方文档](https://webpack.js.org/)
- [Stack Overflow](https://stackoverflow.com/questions/tagged/webpack)
- [GitHub Issues](https://github.com/webpack/webpack/issues)
