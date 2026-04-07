# 模块热替换（HMR）示例

本示例演示 webpack 的热模块替换功能。

## 运行步骤

1. 安装依赖：`npm install`
2. 启动开发服务器：`npm start`
3. 浏览器会自动打开 http://localhost:8080
4. 修改 `src/greet.js` 中的文字，观察页面无刷新更新
5. 修改 `src/styles.css`，观察样式无刷新更新

## 预期结果

- 修改 JS 模块时，页面不刷新但内容更新
- 修改 CSS 时，样式立即更新
- 控制台显示 HMR 更新日志
