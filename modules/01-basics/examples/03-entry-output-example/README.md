# Entry 和 Output 配置示例

本示例演示单入口、多入口配置以及 output 的各种选项。

## 运行步骤

1. 安装依赖：
```bash
npm install
```

2. 运行单入口打包：
```bash
npm run build:single
```

3. 运行多入口打包：
```bash
npm run build:multi
```

## 预期结果

- 单入口：生成 `dist/bundle.js`
- 多入口：生成 `dist/app.bundle.js` 和 `dist/admin.bundle.js`
