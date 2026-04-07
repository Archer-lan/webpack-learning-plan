# 自定义 Plugin - FileList Plugin

## 项目目标

编写一个自定义 plugin，在构建完成后生成一个包含所有输出文件列表的 JSON 文件。

**预估完成时长：2-3 小时**

## 项目要求

1. 创建一个 FileListPlugin 类
2. 在 emit 阶段生成文件列表
3. 输出 JSON 格式的文件信息
4. 支持配置输出文件名
5. 包含文件大小信息

## 功能需求

### 输出格式

```json
{
  "buildTime": "2024-01-01T00:00:00.000Z",
  "files": [
    {
      "name": "main.js",
      "size": 12345,
      "sizeFormatted": "12.1 KB"
    },
    {
      "name": "main.css",
      "size": 5678,
      "sizeFormatted": "5.5 KB"
    }
  ],
  "totalSize": 18023,
  "totalSizeFormatted": "17.6 KB"
}
```

### 配置选项

```javascript
new FileListPlugin({
  filename: 'filelist.json',  // 输出文件名
  format: 'json'  // 输出格式：json | markdown
})
```

## 实现步骤

### 1. 创建 Plugin 类

```javascript
// FileListPlugin.js
class FileListPlugin {
  constructor(options = {}) {
    this.options = {
      filename: 'filelist.json',
      format: 'json',
      ...options
    };
  }
  
  apply(compiler) {
    // TODO: 实现 plugin 逻辑
  }
}

module.exports = FileListPlugin;
```

### 2. 注册钩子

在 emit 钩子中生成文件列表：

```javascript
apply(compiler) {
  compiler.hooks.emit.tapAsync('FileListPlugin', (compilation, callback) => {
    // 获取所有资源
    const assets = compilation.assets;
    
    // 生成文件列表
    const fileList = this.generateFileList(assets);
    
    // 添加到输出资源
    compilation.assets[this.options.filename] = {
      source: () => fileList,
      size: () => fileList.length
    };
    
    callback();
  });
}
```

### 3. 配置 webpack

```javascript
// webpack.config.js
const FileListPlugin = require('./FileListPlugin');

module.exports = {
  plugins: [
    new FileListPlugin({
      filename: 'filelist.json'
    })
  ]
};
```

## 关键知识点

1. **Plugin 基本结构**：类 + apply 方法
2. **钩子系统**：使用 compiler.hooks 注册钩子
3. **异步钩子**：使用 tapAsync 和 callback
4. **访问资源**：通过 compilation.assets 访问所有输出文件
5. **添加资源**：向 compilation.assets 添加新文件

## 提示

- 使用 `compilation.assets` 获取所有输出文件
- 资源对象需要实现 `source()` 和 `size()` 方法
- 使用 `tapAsync` 处理异步操作
- 文件大小单位转换：bytes → KB → MB

## 扩展功能

1. 支持 Markdown 格式输出
2. 添加文件哈希值
3. 按文件类型分组
4. 生成可视化图表
5. 对比上次构建的变化

## 参考答案

参考 `solution/` 目录中的完整实现。

## 验证

运行 webpack 构建：

```bash
npm run build
```

检查 dist 目录中是否生成了 filelist.json 文件。

## 调试技巧

```javascript
apply(compiler) {
  // 查看所有可用钩子
  console.log(Object.keys(compiler.hooks));
  
  // 查看编译信息
  compiler.hooks.emit.tap('FileListPlugin', (compilation) => {
    console.log('Assets:', Object.keys(compilation.assets));
  });
}
```
