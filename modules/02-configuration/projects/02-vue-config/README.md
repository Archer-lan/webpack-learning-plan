# Vue 项目配置

## 项目目标

配置一个完整的 Vue 3 开发环境，包括：
- Vue 3 单文件组件支持
- 开发服务器和热更新
- CSS 预处理器（Sass）
- 图片和字体资源处理
- 代码分割和优化

**预估完成时长：3-4 小时**

## 项目要求

1. 支持 Vue 3 单文件组件（.vue）
2. 配置开发服务器，支持热更新
3. 支持 Sass/SCSS
4. 支持图片和字体资源
5. 生产环境代码压缩和优化
6. 配置 source map

## 初始文件结构

```
vue-project/
├── src/
│   ├── main.js
│   ├── App.vue
│   ├── components/
│   │   └── HelloWorld.vue
│   └── index.html
├── package.json
└── webpack.config.js
```

## 需要安装的依赖

```bash
# Vue
npm install vue

# Webpack
npm install -D webpack webpack-cli webpack-dev-server

# Vue Loader
npm install -D vue-loader vue-template-compiler

# Babel
npm install -D @babel/core @babel/preset-env babel-loader

# CSS
npm install -D style-loader css-loader sass-loader sass

# HTML
npm install -D html-webpack-plugin

# 其他
npm install -D clean-webpack-plugin
```

## 配置步骤

### 1. 配置 Vue Loader

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

### 2. 配置 webpack.config.js

需要配置：
- entry 和 output
- vue-loader 处理 .vue 文件
- babel-loader 处理 JS
- sass-loader 处理样式
- HtmlWebpackPlugin
- devServer 配置

### 3. 配置开发和生产环境

- 开发环境：启用 HMR，使用 eval-source-map
- 生产环境：代码压缩，提取 CSS

## 关键知识点

1. **Vue Loader**：必须配合 VueLoaderPlugin 使用
2. **单文件组件**：.vue 文件包含 template、script、style
3. **样式作用域**：`<style scoped>` 的实现
4. **热更新**：Vue Loader 自动支持 HMR
5. **别名配置**：配置 @ 指向 src 目录

## 提示

- VueLoaderPlugin 必须添加到 plugins 中
- Vue 3 需要使用 vue-loader@^16
- 配置 resolve.alias 简化导入路径
- 生产环境建议使用 MiniCssExtractPlugin
- 配置 resolve.extensions 包含 .vue

## 参考答案

参考 `solution/` 目录中的完整配置。

## 验证

运行以下命令验证配置：

```bash
# 开发模式
npm run dev

# 生产构建
npm run build
```

访问 http://localhost:8080 查看效果。
