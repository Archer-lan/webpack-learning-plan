# 项目 3：图片资源处理项目

## 项目目标

通过本项目，你将学会：
- 使用 webpack 5 的 Asset Modules 处理图片
- 在 JavaScript 中导入图片资源
- 理解不同的资源类型（asset/resource, asset/inline）
- 配置图片输出路径和文件名

## 项目描述

创建一个图片画廊网页，使用 webpack 处理图片资源，并在页面中展示。

## 功能要求

1. 创建一个包含多张图片的项目
2. 配置 webpack 使用 Asset Modules 处理图片
3. 在 JavaScript 中导入图片并动态插入到页面
4. 配置图片的输出目录为 `images/`
5. 使用 CSS 美化图片展示效果

## 提示

- webpack 5 使用 Asset Modules 替代了 file-loader 和 url-loader
- 使用 `type: 'asset/resource'` 处理图片文件
- 使用 `generator.filename` 配置输出文件名
- 在 JavaScript 中 import 图片会返回图片的 URL
- 可以使用占位符如 `[name]`, `[ext]`, `[hash]` 等

## 预期效果

一个图片画廊页面，包含：
- 多张图片的展示
- 响应式布局
- 美观的样式

## 评分标准

- [ ] 正确配置 Asset Modules（30分）
- [ ] 正确导入和使用图片（30分）
- [ ] 图片正确显示（20分）
- [ ] 页面布局美观（20分）

## 注意事项

由于这是一个模板项目，实际的图片文件需要你自己准备。你可以：
1. 使用占位图片服务（如 https://via.placeholder.com/300）
2. 准备自己的图片文件放在 src/images/ 目录下
