# React 项目配置

## 项目目标

配置一个完整的 React 开发环境，包括：
- React 和 JSX 支持
- 开发服务器和热更新
- CSS 处理
- 图片和字体资源处理
- 代码分割和优化

**预估完成时长：3-4 小时**

## 项目要求

1. 支持 React 17+ 和 JSX 语法
2. 配置开发服务器，支持热更新
3. 支持 CSS 和 CSS Modules
4. 支持图片和字体资源
5. 生产环境代码压缩和优化
6. 配置 source map

## 初始文件结构

```
react-project/
├── src/
│   ├── index.js
│   ├── App.js
│   ├── App.css
│   └── index.html
├── package.json
└── webpack.config.js
```

## 需要安装的依赖

```bash
# React
npm install react react-dom

# Webpack
npm install -D webpack webpack-cli webpack-dev-server

# Babel
npm install -D @babel/core @babel/preset-env @babel/preset-react babel-loader

# CSS
npm install -D style-loader css-loader

# HTML
npm install -D html-webpack-plugin

# 其他
npm install -D clean-webpack-plugin
```

## 配置步骤

### 1. 配置 Babel

创建 `.babelrc` 或在 webpack.config.js 中配置：

```json
{
  "presets": [
    "@babel/preset-env",
    "@babel/preset-react"
  ]
}
```

### 2. 配置 webpack.config.js

需要配置：
- entry 和 output
- babel-loader 处理 JSX
- css-loader 和 style-loader
- HtmlWebpackPlugin
- devServer 配置

### 3. 配置开发和生产环境

- 开发环境：启用 HMR，使用 eval-source-map
- 生产环境：代码压缩，提取 CSS

## 关键知识点

1. **JSX 转换**：使用 @babel/preset-react
2. **热更新**：配置 devServer.hot
3. **CSS Modules**：css-loader 的 modules 选项
4. **代码分割**：optimization.splitChunks
5. **环境变量**：DefinePlugin

## 提示

- React 17+ 不需要在每个文件中 `import React`
- 使用 `webpack-dev-server` 而不是 `webpack serve`
- 生产环境建议使用 MiniCssExtractPlugin 提取 CSS
- 配置 resolve.extensions 简化导入

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

访问 http://localhost:3000 查看效果。
