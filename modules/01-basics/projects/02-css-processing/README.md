# 项目 2：CSS 处理项目

## 项目目标

通过本项目，你将学会：
- 配置 css-loader 和 style-loader
- 在 JavaScript 中导入 CSS 文件
- 理解 loader 的执行顺序
- 创建一个带样式的简单网页

## 项目描述

创建一个个人名片网页，使用 webpack 处理 CSS 样式，并将样式注入到 HTML 中。

## 功能要求

1. 创建一个 HTML 模板文件
2. 创建至少 2 个 CSS 文件（base.css 和 card.css）
3. 在 JavaScript 中导入这些 CSS 文件
4. 配置 webpack 使用 css-loader 和 style-loader
5. 使用 HtmlWebpackPlugin 自动生成 HTML 文件
6. 打包后在浏览器中查看效果

## 提示

- 安装必要的 loader：`npm install --save-dev style-loader css-loader`
- 安装 HtmlWebpackPlugin：`npm install --save-dev html-webpack-plugin`
- 在 module.rules 中配置 CSS 文件的处理规则
- 注意 loader 的执行顺序：从右到左（从下到上）
- 使用 `npm run build` 打包，然后在浏览器中打开 dist/index.html

## 预期效果

一个美观的个人名片页面，包含：
- 居中的卡片布局
- 个人信息（姓名、职位、简介）
- 美观的样式和配色

## 评分标准

- [ ] 正确配置 CSS loader（30分）
- [ ] 正确配置 HtmlWebpackPlugin（20分）
- [ ] CSS 样式正确应用（30分）
- [ ] 页面布局美观（20分）
