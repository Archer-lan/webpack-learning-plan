# 原理模块 (Principles Module)

## 模块概述

本模块深入讲解 webpack 的底层运行原理，帮助你理解 webpack 的工作机制。通过本模块的学习，你将能够编写自定义 loader 和 plugin，进行性能优化和问题排查。

## 学习目标

- 理解 webpack 的完整构建流程
- 掌握 Compiler 和 Compilation 的工作机制
- 理解模块依赖图的构建过程
- 能够编写自定义 loader 和 plugin
- 理解 HMR、Tree Shaking、Code Splitting 的实现原理

## 预估学习时长

**总计：25-30 小时**

## 课程列表

1. [Webpack 构建流程](./lessons/01-build-process.md) - 3 小时
2. [Compiler 工作机制](./lessons/02-compiler.md) - 2 小时
3. [Loader 执行机制](./lessons/03-loader-mechanism.md) - 3 小时
4. [Plugin 钩子系统](./lessons/04-plugin-mechanism.md) - 3 小时
5. [模块依赖图构建](./lessons/05-dependency-graph.md) - 3 小时
6. [HMR 实现原理](./lessons/06-hmr-principle.md) - 3 小时

## 实践项目

1. [自定义 Loader - Markdown Loader](./projects/01-markdown-loader/) - 编写一个处理 Markdown 文件的 loader
2. [自定义 Plugin - FileList Plugin](./projects/02-filelist-plugin/) - 编写一个生成文件列表的 plugin

## 前置要求

- 完成基础模块和配置模块的学习
- 熟悉 JavaScript/TypeScript
- 了解 Node.js API
- 了解编译原理基础

## 学习建议

1. 先理解整体构建流程，再深入各个环节
2. 阅读 webpack 源码，理解核心概念
3. 动手编写自定义 loader 和 plugin
4. 使用调试工具跟踪构建过程
5. 参考官方文档和社区资源

## 相关资源

- [Webpack 官方 API 文档](https://webpack.js.org/api/)
- [Webpack 源码](https://github.com/webpack/webpack)
- [编写 Loader](https://webpack.js.org/contribute/writing-a-loader/)
- [编写 Plugin](https://webpack.js.org/contribute/writing-a-plugin/)
