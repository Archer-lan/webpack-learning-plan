# 项目 1：简单的 JS 打包项目

## 项目目标

通过本项目，你将学会：
- 配置 webpack 的基本入口和出口
- 打包多个 JavaScript 模块
- 使用 ES6 模块语法（import/export）
- 理解 webpack 的依赖图构建过程

## 项目描述

创建一个简单的计算器应用，包含多个 JavaScript 模块，使用 webpack 将它们打包成一个文件。

## 功能要求

1. 创建一个 `calculator.js` 模块，包含加、减、乘、除四个函数
2. 创建一个 `formatter.js` 模块，用于格式化输出结果
3. 在 `index.js` 中导入并使用这些模块
4. 配置 webpack 将所有模块打包成一个文件
5. 打包后的文件应该能在 Node.js 环境中运行

## 提示

- 使用 `module.exports` 和 `require` 或 ES6 的 `export` 和 `import`
- 配置 `webpack.config.js` 的 entry 和 output
- 使用 `npm run build` 命令进行打包
- 使用 `node dist/bundle.js` 测试打包结果

## 预期输出

```
计算结果：
10 + 5 = 15
10 - 5 = 5
10 * 5 = 50
10 / 5 = 2
```

## 评分标准

- [ ] 正确配置 webpack.config.js（30分）
- [ ] 正确使用模块导入导出（30分）
- [ ] 成功打包并运行（20分）
- [ ] 代码结构清晰（20分）
