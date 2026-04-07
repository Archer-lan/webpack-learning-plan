# Loader 执行机制

## 概述

Loader 是 webpack 的核心功能之一，用于转换模块内容。本课程将深入讲解 loader 的执行机制和编写方法。

**预估学习时长：3 小时**

## Loader 的本质

Loader 本质上是一个函数，接收源代码作为参数，返回转换后的代码。

```javascript
// 最简单的 loader
module.exports = function(source) {
  // source 是模块的源代码
  return source;
};
```

## Loader 的执行顺序

### 从右到左执行

```javascript
module: {
  rules: [
    {
      test: /\.css$/,
      use: ['style-loader', 'css-loader', 'postcss-loader']
      // 执行顺序：postcss-loader → css-loader → style-loader
    }
  ]
}
```

### 执行阶段

Loader 有两个执行阶段：

1. **Pitching 阶段**：从左到右执行
2. **Normal 阶段**：从右到左执行

```javascript
// loader1.js
module.exports = function(source) {
  console.log('loader1 normal');
  return source;
};

module.exports.pitch = function() {
  console.log('loader1 pitch');
};

// loader2.js
module.exports = function(source) {
  console.log('loader2 normal');
  return source;
};

module.exports.pitch = function() {
  console.log('loader2 pitch');
};

// 执行顺序：
// loader1 pitch
// loader2 pitch
// loader2 normal
// loader1 normal
```

## Loader 的参数

### source

模块的源代码，可以是字符串或 Buffer。

```javascript
module.exports = function(source) {
  console.log(typeof source);  // 'string' 或 'object' (Buffer)
  return source;
};
```

### sourceMap

上一个 loader 生成的 source map。

```javascript
module.exports = function(source, sourceMap) {
  // 处理 source map
  return source;
};
```

### meta

上一个 loader 传递的元数据。

```javascript
module.exports = function(source, sourceMap, meta) {
  // 访问元数据
  console.log(meta);
  return source;
};
```

## Loader 的返回值

### 简单返回

```javascript
module.exports = function(source) {
  const result = transform(source);
  return result;
};
```

### 使用 this.callback()

可以返回多个值：

```javascript
module.exports = function(source) {
  const result = transform(source);
  
  // this.callback(err, content, sourceMap, meta)
  this.callback(null, result, sourceMap, meta);
  
  // 不需要 return
};
```

### 异步 Loader

```javascript
module.exports = function(source) {
  const callback = this.async();
  
  someAsyncOperation(source, (err, result) => {
    if (err) return callback(err);
    callback(null, result);
  });
};
```

## Loader Context (this)

Loader 函数中的 `this` 提供了很多有用的方法和属性。

### 常用属性

```javascript
module.exports = function(source) {
  // 资源路径
  console.log(this.resourcePath);  // '/path/to/file.js'
  
  // 资源查询参数
  console.log(this.resourceQuery);  // '?foo=bar'
  
  // 当前 loader 的配置
  console.log(this.query);
  
  // webpack 配置
  console.log(this.options);
  
  // 是否处于生产模式
  console.log(this.mode);  // 'development' | 'production'
  
  return source;
};
```

### 常用方法

```javascript
module.exports = function(source) {
  // 1. 异步回调
  const callback = this.async();
  
  // 2. 添加依赖（文件变化时重新编译）
  this.addDependency('./config.json');
  
  // 3. 添加上下文依赖（目录变化时重新编译）
  this.addContextDependency('./templates');
  
  // 4. 发出文件
  this.emitFile('output.txt', 'content');
  
  // 5. 获取 loader 选项
  const options = this.getOptions();
  
  // 6. 缓存控制
  this.cacheable(false);  // 禁用缓存
  
  return source;
};
```

## 编写 Loader 的最佳实践

### 1. 单一职责

每个 loader 只做一件事：

```javascript
// ❌ 不好：一个 loader 做太多事
module.exports = function(source) {
  const compiled = compileSass(source);
  const prefixed = addPrefix(compiled);
  const minified = minify(prefixed);
  return minified;
};

// ✅ 好：拆分成多个 loader
// sass-loader: 编译 Sass
// postcss-loader: 添加前缀
// css-minimizer-loader: 压缩
```

### 2. 链式调用

利用 loader 的链式特性：

```javascript
module: {
  rules: [
    {
      test: /\.scss$/,
      use: [
        'style-loader',
        'css-loader',
        'postcss-loader',
        'sass-loader'
      ]
    }
  ]
}
```

### 3. 模块化

使用 ES6 模块或 CommonJS：

```javascript
// 导出 loader 函数
module.exports = function(source) {
  return transform(source);
};

// 导出 pitch 函数
module.exports.pitch = function() {
  // ...
};

// 导出 raw 标志（处理 Buffer）
module.exports.raw = true;
```

### 4. 无状态

Loader 应该是无状态的，不依赖外部变量：

```javascript
// ❌ 不好：依赖外部状态
let count = 0;
module.exports = function(source) {
  count++;
  return source + `\n// Processed ${count} times`;
};

// ✅ 好：无状态
module.exports = function(source) {
  return source + `\n// Processed at ${Date.now()}`;
};
```

### 5. 使用 loader-utils

```javascript
const { getOptions } = require('loader-utils');

module.exports = function(source) {
  // 获取 loader 配置
  const options = getOptions(this);
  
  // 使用配置
  const result = transform(source, options);
  
  return result;
};
```

## 实战：编写一个 Markdown Loader

```javascript
// markdown-loader.js
const marked = require('marked');

module.exports = function(source) {
  // 1. 获取配置
  const options = this.getOptions();
  
  // 2. 配置 marked
  marked.setOptions({
    gfm: true,
    breaks: true,
    ...options
  });
  
  // 3. 转换 Markdown
  const html = marked(source);
  
  // 4. 返回 JavaScript 模块
  return `export default ${JSON.stringify(html)}`;
};
```

使用：

```javascript
// webpack.config.js
module: {
  rules: [
    {
      test: /\.md$/,
      use: {
        loader: './markdown-loader.js',
        options: {
          gfm: true
        }
      }
    }
  ]
}

// app.js
import content from './README.md';
document.body.innerHTML = content;
```

## Loader 的调试

### 1. 使用 console.log

```javascript
module.exports = function(source) {
  console.log('Processing:', this.resourcePath);
  console.log('Source length:', source.length);
  return source;
};
```

### 2. 使用 Node.js 调试器

```bash
node --inspect-brk ./node_modules/webpack/bin/webpack.js
```

### 3. 使用 loader-runner

单独测试 loader：

```javascript
const { runLoaders } = require('loader-runner');

runLoaders({
  resource: '/path/to/file.js',
  loaders: [
    {
      loader: '/path/to/my-loader.js',
      options: { /* ... */ }
    }
  ],
  context: { /* ... */ },
  readResource: fs.readFile.bind(fs)
}, (err, result) => {
  console.log(result);
});
```

## 小结

- Loader 本质是一个函数，接收源代码，返回转换后的代码
- Loader 从右到左执行（Normal 阶段）
- 使用 this.callback() 可以返回多个值
- 使用 this.async() 实现异步 loader
- Loader 应该遵循单一职责原则
- 使用 loader-utils 获取配置选项

## 相关链接

- [Writing a Loader](https://webpack.js.org/contribute/writing-a-loader/)
- [Loader API](https://webpack.js.org/api/loaders/)
- [loader-utils](https://github.com/webpack/loader-utils)
