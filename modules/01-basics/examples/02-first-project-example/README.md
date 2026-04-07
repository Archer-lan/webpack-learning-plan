# 第一个 Webpack 项目示例

本示例演示如何创建第一个 webpack 项目，包含基本的配置文件。

## 项目结构

```
02-first-project-example/
├── src/
│   └── index.js
├── dist/
├── package.json
└── webpack.config.js
```

## 运行步骤

1. 安装依赖：
```bash
npm install
```

2. 运行打包：
```bash
npm run build
```

3. 查看输出：
```bash
node dist/bundle.js
```

## 预期结果

- 在 `dist/` 目录生成 `bundle.js` 文件
- 运行输出文件显示 "Hello, Webpack!"
