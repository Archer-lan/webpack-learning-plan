# 开发模式和生产模式示例

本示例演示 development 和 production 模式的区别。

## 运行步骤

1. 安装依赖：`npm install`
2. 开发模式打包：`npm run build:dev`
3. 生产模式打包：`npm run build:prod`
4. 对比 `dist/` 目录下的输出文件

## 预期结果

- 开发模式：代码未压缩，包含详细的注释和调试信息
- 生产模式：代码被压缩，体积更小，性能更优
