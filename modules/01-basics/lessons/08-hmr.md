# 模块热替换（HMR）基础

本课程介绍 webpack 的模块热替换（Hot Module Replacement，HMR）功能。

预估学习时长：50 分钟

## 关键知识点

- HMR 的概念和优势
- HMR 的配置方法
- HMR API 的使用
- 常见框架的 HMR 支持

## 课程内容

### 什么是 HMR

模块热替换（Hot Module Replacement，HMR）是 webpack 提供的最有用的功能之一。它允许在运行时更新所有类型的模块，而无需完全刷新页面。

### HMR 的优势

1. **保留应用状态**：页面不刷新，保持当前的应用状态
2. **更快的开发体验**：只更新变更的内容，节省时间
3. **精确更新**：只更新修改的模块
4. **即时反馈**：修改后立即看到效果

### HMR vs Live Reloading

| 特性 | HMR | Live Reloading |
|------|-----|----------------|
| 页面刷新 | 否 | 是 |
| 保留状态 | 是 | 否 |
| 更新速度 | 快 | 慢 |
| 配置复杂度 | 中 | 低 |

### 启用 HMR

#### 1. 基本配置

在 webpack 配置中启用 HMR：

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
    hot: true,  // 启用 HMR
    static: {
      directory: path.join(__dirname, 'public')
    }
  }
};
```

**注意**：webpack 5 中，`devServer.hot` 默认为 `true`，通常不需要显式配置。

#### 2. 通过命令行启用

```bash
webpack serve --hot
```

### HMR API 使用

#### 1. 基本用法

在入口文件中使用 HMR API：

```javascript
// src/index.js
import { render } from './render.js';

render();

// 启用 HMR
if (module.hot) {
  module.hot.accept('./render.js', () => {
    console.log('Accepting the updated render module!');
    render();
  });
}
```

#### 2. 接受自身更新

```javascript
// src/module.js
export function doSomething() {
  console.log('Doing something...');
}

if (module.hot) {
  module.hot.accept();  // 接受自身的更新
}
```

#### 3. 处理更新失败

```javascript
if (module.hot) {
  module.hot.accept('./module.js', () => {
    // 更新成功
  });
  
  module.hot.dispose((data) => {
    // 模块即将被替换时的清理工作
    data.someValue = 'cleanup';
  });
}
```

### CSS 的 HMR

使用 `style-loader` 时，CSS 自动支持 HMR：

```javascript
module.exports = {
  module: {
    rules: [
      {
        test: /\.css$/,
        use: ['style-loader', 'css-loader']  // style-loader 内置 HMR 支持
      }
    ]
  },
  devServer: {
    hot: true
  }
};
```

修改 CSS 文件后，样式会立即更新，无需刷新页面。

### 框架的 HMR 支持

#### 1. React

使用 React Fast Refresh：

```bash
npm install --save-dev @pmmmwh/react-refresh-webpack-plugin react-refresh
```

```javascript
const ReactRefreshWebpackPlugin = require('@pmmmwh/react-refresh-webpack-plugin');

module.exports = {
  mode: 'development',
  module: {
    rules: [
      {
        test: /\.[jt]sx?$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
          options: {
            plugins: ['react-refresh/babel']
          }
        }
      }
    ]
  },
  plugins: [
    new ReactRefreshWebpackPlugin()
  ],
  devServer: {
    hot: true
  }
};
```

#### 2. Vue

Vue Loader 内置 HMR 支持：

```bash
npm install --save-dev vue-loader vue-template-compiler
```

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
  ],
  devServer: {
    hot: true
  }
};
```

#### 3. Angular

使用 Angular CLI 时，HMR 需要额外配置：

```bash
ng serve --hmr
```

### 实践示例

创建一个支持 HMR 的完整项目：

```javascript
// webpack.config.js
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
      template: './src/index.html'
    })
  ],
  devServer: {
    static: {
      directory: path.join(__dirname, 'public')
    },
    hot: true,
    port: 8080,
    open: true
  },
  devtool: 'eval-source-map'
};
```

```javascript
// src/index.js
import './styles.css';
import { greet } from './greet.js';

function render() {
  const app = document.getElementById('app');
  app.innerHTML = `<h1>${greet()}</h1>`;
}

render();

// 启用 HMR
if (module.hot) {
  module.hot.accept('./greet.js', () => {
    console.log('Greet module updated!');
    render();
  });
  
  module.hot.accept('./styles.css', () => {
    console.log('Styles updated!');
  });
}
```

```javascript
// src/greet.js
export function greet() {
  return 'Hello, HMR!';
}
```

```css
/* src/styles.css */
body {
  font-family: Arial, sans-serif;
  background-color: #f0f0f0;
}

h1 {
  color: #333;
}
```

### HMR 工作原理

1. **文件监听**：webpack-dev-server 监听文件变化
2. **重新编译**：文件变化时，webpack 重新编译修改的模块
3. **推送更新**：通过 WebSocket 将更新推送到浏览器
4. **应用更新**：浏览器接收更新并应用到运行中的应用

### 调试 HMR

启用 HMR 日志：

```javascript
if (module.hot) {
  module.hot.accept('./module.js', () => {
    console.log('Module updated');
  });
  
  // 查看 HMR 状态
  console.log('HMR enabled:', module.hot);
}
```

在浏览器控制台查看 HMR 日志：

```javascript
devServer: {
  client: {
    logging: 'info'  // 显示详细日志
  }
}
```

### 常见问题

#### 1. HMR 不工作

检查：
- `devServer.hot` 是否启用
- 是否正确使用 `module.hot.accept()`
- 浏览器控制台是否有错误

#### 2. 页面仍然刷新

可能原因：
- 没有正确处理模块更新
- 模块更新失败，回退到完全刷新

#### 3. 状态丢失

确保在 `module.hot.accept()` 回调中正确恢复状态。

### 最佳实践

1. **开发环境使用 HMR**：提升开发效率
2. **生产环境禁用 HMR**：HMR 仅用于开发
3. **合理使用 HMR API**：只在必要时手动处理更新
4. **使用框架的 HMR 方案**：React Fast Refresh、Vue HMR 等
5. **保持模块纯净**：避免副作用，便于热更新

## 相关文档

- [Webpack 官方文档 - Hot Module Replacement](https://webpack.js.org/concepts/hot-module-replacement/)
- [Webpack 官方文档 - HMR API](https://webpack.js.org/api/hot-module-replacement/)
- [React Fast Refresh](https://github.com/pmmmwh/react-refresh-webpack-plugin)
- [Vue Loader - Hot Reload](https://vue-loader.vuejs.org/guide/hot-reload.html)
