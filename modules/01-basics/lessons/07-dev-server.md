# Webpack Dev Server 使用

本课程介绍 webpack-dev-server 的安装、配置和使用方法。

预估学习时长：45 分钟

## 关键知识点

- webpack-dev-server 的作用
- 安装和基本配置
- 常用配置选项
- 实时重新加载（Live Reloading）

## 课程内容

### 什么是 Webpack Dev Server

webpack-dev-server 是一个小型的 Node.js Express 服务器，它使用 webpack-dev-middleware 来为通过 webpack 打包生成的资源文件提供 Web 服务。

主要特性：
- 提供 HTTP 服务器
- 实时重新加载（Live Reloading）
- 支持热模块替换（HMR）
- 在内存中编译，不写入磁盘

### 安装

```bash
npm install --save-dev webpack-dev-server
```

### 基本配置

在 `webpack.config.js` 中添加 devServer 配置：

```javascript
const path = require('path');

module.exports = {
  mode: 'development',
  entry: './src/index.js',
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'bundle.js'
  },
  devServer: {
    static: {
      directory: path.join(__dirname, 'public')
    },
    port: 8080,
    open: true
  }
};
```

### 启动 Dev Server

在 `package.json` 中添加脚本：

```json
{
  "scripts": {
    "start": "webpack serve --mode development",
    "dev": "webpack serve --open"
  }
}
```

运行：

```bash
npm start
# 或
npm run dev
```

### 常用配置选项

#### 1. static - 静态文件目录

指定静态文件的目录：

```javascript
devServer: {
  static: {
    directory: path.join(__dirname, 'public'),
    publicPath: '/assets'
  }
}
```

#### 2. port - 端口号

指定服务器端口：

```javascript
devServer: {
  port: 3000
}
```

#### 3. open - 自动打开浏览器

启动后自动打开浏览器：

```javascript
devServer: {
  open: true,
  // 或指定打开的页面
  open: ['/index.html']
}
```

#### 4. hot - 热模块替换

启用热模块替换（默认已启用）：

```javascript
devServer: {
  hot: true
}
```

#### 5. compress - 启用 gzip 压缩

```javascript
devServer: {
  compress: true
}
```

#### 6. historyApiFallback - 支持 HTML5 History API

对于单页应用，所有 404 请求都返回 index.html：

```javascript
devServer: {
  historyApiFallback: true
}
```

#### 7. proxy - 代理配置

解决跨域问题，代理 API 请求：

```javascript
devServer: {
  proxy: {
    '/api': {
      target: 'http://localhost:3000',
      pathRewrite: { '^/api': '' },
      changeOrigin: true
    }
  }
}
```

#### 8. headers - 自定义响应头

```javascript
devServer: {
  headers: {
    'X-Custom-Header': 'yes'
  }
}
```

#### 9. client - 客户端配置

配置客户端日志级别和覆盖层：

```javascript
devServer: {
  client: {
    logging: 'info',
    overlay: {
      errors: true,
      warnings: false
    },
    progress: true
  }
}
```

### 完整配置示例

```javascript
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
      {
        test: /\.css$/,
        use: ['style-loader', 'css-loader']
      },
      {
        test: /\.(png|jpg|gif)$/,
        type: 'asset/resource'
      }
    ]
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: './src/index.html'
    })
  ],
  devServer: {
    static: {
      directory: path.join(__dirname, 'public')
    },
    port: 8080,
    open: true,
    hot: true,
    compress: true,
    historyApiFallback: true,
    proxy: {
      '/api': {
        target: 'http://localhost:3000',
        changeOrigin: true,
        pathRewrite: { '^/api': '' }
      }
    },
    client: {
      logging: 'info',
      overlay: {
        errors: true,
        warnings: false
      },
      progress: true
    }
  },
  devtool: 'eval-source-map'
};
```

### 实时重新加载

webpack-dev-server 默认启用实时重新加载功能。当你修改源代码并保存时：

1. webpack 重新编译代码
2. 浏览器自动刷新页面
3. 显示最新的更改

### 与 HMR 的区别

- **Live Reloading**：整个页面刷新
- **HMR（热模块替换）**：只更新修改的模块，不刷新整个页面

### 使用 HTTPS

启用 HTTPS 服务：

```javascript
devServer: {
  https: true,
  // 或使用自定义证书
  https: {
    key: fs.readFileSync('/path/to/server.key'),
    cert: fs.readFileSync('/path/to/server.crt')
  }
}
```

### 多页面应用配置

```javascript
module.exports = {
  entry: {
    home: './src/home.js',
    about: './src/about.js'
  },
  plugins: [
    new HtmlWebpackPlugin({
      filename: 'index.html',
      template: './src/index.html',
      chunks: ['home']
    }),
    new HtmlWebpackPlugin({
      filename: 'about.html',
      template: './src/about.html',
      chunks: ['about']
    })
  ],
  devServer: {
    open: ['/index.html']
  }
};
```

### 最佳实践

1. **开发环境使用 dev server**：提高开发效率
2. **配置代理解决跨域**：避免 CORS 问题
3. **启用 source map**：方便调试
4. **使用 HMR**：提升开发体验（下一课详细介绍）
5. **合理配置端口**：避免端口冲突

## 相关文档

- [Webpack 官方文档 - DevServer](https://webpack.js.org/configuration/dev-server/)
- [webpack-dev-server GitHub](https://github.com/webpack/webpack-dev-server)
- [Webpack 官方文档 - Development](https://webpack.js.org/guides/development/)
