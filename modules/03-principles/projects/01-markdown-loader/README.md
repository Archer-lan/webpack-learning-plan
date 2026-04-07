# 自定义 Loader - Markdown Loader

## 项目目标

编写一个自定义 loader，将 Markdown 文件转换为 HTML，并作为 JavaScript 模块导出。

**预估完成时长：2-3 小时**

## 项目要求

1. 创建一个 markdown-loader.js 文件
2. Loader 应该接收 Markdown 源代码
3. 使用 marked 库将 Markdown 转换为 HTML
4. 返回一个 JavaScript 模块，导出 HTML 字符串
5. 支持配置选项（如 gfm、breaks 等）
6. 添加错误处理

## 功能需求

### 基础功能

```javascript
// 输入：README.md
# Hello World
This is a **markdown** file.

// 输出：JavaScript 模块
export default "<h1>Hello World</h1>\n<p>This is a <strong>markdown</strong> file.</p>";
```

### 配置选项

支持 marked 的配置选项：

```javascript
{
  loader: './markdown-loader.js',
  options: {
    gfm: true,
    breaks: true,
    sanitize: false
  }
}
```

## 实现步骤

### 1. 安装依赖

```bash
npm install marked
npm install -D loader-utils schema-utils
```

### 2. 创建 Loader

```javascript
// markdown-loader.js
const marked = require('marked');
const { getOptions } = require('loader-utils');
const { validate } = require('schema-utils');

// 配置 schema
const schema = {
  type: 'object',
  properties: {
    gfm: { type: 'boolean' },
    breaks: { type: 'boolean' },
    sanitize: { type: 'boolean' }
  }
};

module.exports = function(source) {
  // TODO: 实现 loader 逻辑
};
```

### 3. 配置 webpack

```javascript
// webpack.config.js
module.exports = {
  module: {
    rules: [
      {
        test: /\.md$/,
        use: {
          loader: './markdown-loader.js',
          options: {
            gfm: true,
            breaks: true
          }
        }
      }
    ]
  }
};
```

### 4. 使用 Loader

```javascript
// app.js
import content from './README.md';
document.getElementById('content').innerHTML = content;
```

## 关键知识点

1. **Loader 基本结构**：接收 source，返回转换后的代码
2. **获取配置**：使用 getOptions() 获取 loader 配置
3. **配置验证**：使用 schema-utils 验证配置
4. **返回模块**：返回有效的 JavaScript 代码
5. **错误处理**：使用 this.callback() 报告错误

## 提示

- 使用 `JSON.stringify()` 转义 HTML 字符串
- 返回的代码必须是有效的 JavaScript
- 可以使用 `this.cacheable()` 启用缓存
- 使用 `this.addDependency()` 添加依赖文件

## 扩展功能

1. 支持代码高亮（使用 highlight.js）
2. 支持自定义渲染器
3. 提取 frontmatter 元数据
4. 生成目录（TOC）

## 参考答案

参考 `solution/` 目录中的完整实现。

## 验证

创建测试文件并运行 webpack：

```bash
npm run build
```

检查生成的代码是否正确。
