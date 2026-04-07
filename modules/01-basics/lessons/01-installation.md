# Webpack 安装和初始化

本课程介绍如何安装和初始化 webpack 项目。

预估学习时长：30 分钟

## 关键知识点

- npm 安装 webpack
- webpack-cli 的作用
- 初始化 package.json
- 创建基本的项目结构

## 课程内容

Webpack 是一个现代 JavaScript 应用程序的静态模块打包工具。在开始使用 webpack 之前，我们需要先安装它。

### 安装步骤

1. 确保已安装 Node.js 和 npm
2. 创建项目目录并初始化 npm
3. 安装 webpack 和 webpack-cli

```bash
mkdir my-webpack-project
cd my-webpack-project
npm init -y
npm install --save-dev webpack webpack-cli
```

### 验证安装

安装完成后，可以通过以下命令验证：

```bash
npx webpack --version
```

## 相关文档

- [Webpack 官方文档 - 安装](https://webpack.js.org/guides/installation/)
- [Node.js 官网](https://nodejs.org/)
