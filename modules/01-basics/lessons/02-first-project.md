# 创建第一个 Webpack 项目

本课程将带你创建第一个 webpack 打包项目。

预估学习时长：45 分钟

## 关键知识点

- 项目目录结构
- 入口文件的创建
- webpack 命令的使用
- 打包输出文件

## 课程内容

创建一个简单的 webpack 项目，了解基本的打包流程。

### 项目结构

```
my-webpack-project/
├── src/
│   └── index.js
├── dist/
├── package.json
└── webpack.config.js
```

### 创建入口文件

在 `src/index.js` 中编写代码：

```javascript
console.log('Hello, Webpack!');
```

### 运行打包

```bash
npx webpack
```

## 相关文档

- [Webpack 官方文档 - 起步](https://webpack.js.org/guides/getting-started/)
