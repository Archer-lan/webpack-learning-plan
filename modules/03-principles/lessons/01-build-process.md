# Webpack 构建流程

## 概述

理解 webpack 的构建流程是掌握其工作原理的基础。本课程将详细讲解 webpack 从读取配置到输出文件的完整过程。

**预估学习时长：3 小时**

## 构建流程三大阶段

### 1. 初始化阶段

**主要任务**：读取和合并配置参数，创建 Compiler 对象

```
读取配置文件 → 合并配置 → 创建 Compiler → 加载插件 → 触发 environment 钩子
```

**详细步骤**：

1. **读取配置**：从 webpack.config.js 读取配置
2. **合并配置**：将配置与默认配置合并
3. **创建 Compiler**：实例化 Compiler 对象
4. **加载插件**：调用所有插件的 apply 方法
5. **触发钩子**：触发 environment 和 afterEnvironment 钩子

```javascript
// 简化的初始化过程
const webpack = require('webpack');
const config = require('./webpack.config.js');

// 1. 创建 Compiler
const compiler = webpack(config);

// 2. 插件注册
config.plugins.forEach(plugin => {
  plugin.apply(compiler);
});

// 3. 开始编译
compiler.run((err, stats) => {
  // 编译完成
});
```

### 2. 编译阶段

**主要任务**：从入口文件开始，递归解析所有依赖，构建模块依赖图

```
确定入口 → 编译模块 → 完成模块编译 → 输出资源 → 写入文件系统
```

**详细步骤**：

1. **确定入口**：根据 entry 配置确定入口模块
2. **编译模块**：
   - 调用 loader 转换模块内容
   - 解析模块依赖（import、require）
   - 递归处理所有依赖模块
3. **完成模块编译**：得到转换后的内容和依赖关系
4. **输出资源**：根据依赖关系组装成 chunk
5. **优化**：对 chunk 进行优化（压缩、分割等）

```javascript
// 编译流程伪代码
class Compilation {
  build(entry) {
    // 1. 从入口开始
    const entryModule = this.buildModule(entry);
    
    // 2. 递归构建依赖
    const modules = this.buildDependencies(entryModule);
    
    // 3. 生成 chunk
    const chunks = this.createChunks(modules);
    
    // 4. 生成代码
    const assets = this.generateCode(chunks);
    
    return assets;
  }
  
  buildModule(modulePath) {
    // 读取文件
    const source = fs.readFileSync(modulePath, 'utf-8');
    
    // 应用 loader
    const transformedSource = this.applyLoaders(source);
    
    // 解析依赖
    const dependencies = this.parseDependencies(transformedSource);
    
    return {
      path: modulePath,
      source: transformedSource,
      dependencies
    };
  }
}
```

### 3. 输出阶段

**主要任务**：将编译后的内容输出到文件系统

```
确定输出路径 → 写入文件系统 → 触发 done 钩子
```

**详细步骤**：

1. **确定输出路径**：根据 output 配置确定输出文件名和路径
2. **写入文件**：将 chunk 写入文件系统
3. **触发钩子**：触发 emit 和 done 钩子

```javascript
// 输出阶段伪代码
class Compiler {
  emitAssets(compilation) {
    const outputPath = this.options.output.path;
    
    // 遍历所有资源
    Object.keys(compilation.assets).forEach(filename => {
      const filePath = path.join(outputPath, filename);
      const content = compilation.assets[filename];
      
      // 写入文件
      fs.writeFileSync(filePath, content);
    });
    
    // 触发 done 钩子
    this.hooks.done.call(compilation.getStats());
  }
}
```

## 核心概念

### Compiler

Compiler 对象代表完整的 webpack 环境配置，在 webpack 启动时创建，全局唯一。

**主要职责**：
- 管理整个构建流程
- 触发各个阶段的钩子
- 管理文件监听和增量编译

```javascript
class Compiler {
  constructor(context) {
    this.hooks = {
      environment: new SyncHook([]),
      compile: new SyncHook([]),
      make: new AsyncParallelHook(['compilation']),
      emit: new AsyncSeriesHook(['compilation']),
      done: new AsyncSeriesHook(['stats'])
    };
  }
  
  run(callback) {
    // 触发编译流程
    this.compile(callback);
  }
}
```

### Compilation

Compilation 对象代表一次资源版本构建，包含当前的模块资源、编译生成资源等。

**主要职责**：
- 构建模块依赖图
- 管理模块编译
- 生成 chunk 和 assets

```javascript
class Compilation {
  constructor(compiler) {
    this.compiler = compiler;
    this.modules = [];  // 所有模块
    this.chunks = [];   // 所有 chunk
    this.assets = {};   // 所有资源
  }
  
  buildModule(module) {
    // 编译单个模块
  }
  
  seal() {
    // 封闭编译，生成 chunk
  }
}
```

### Module

Module 对象代表一个模块，可以是 JS、CSS、图片等任何文件。

```javascript
class Module {
  constructor(request) {
    this.request = request;  // 模块路径
    this.dependencies = [];  // 依赖列表
    this.source = null;      // 模块内容
  }
}
```

### Chunk

Chunk 是输出的代码块，由多个模块组成。

**Chunk 类型**：
- Entry Chunk：入口 chunk
- Normal Chunk：普通 chunk
- Initial Chunk：初始 chunk

```javascript
class Chunk {
  constructor(name) {
    this.name = name;
    this.modules = [];  // 包含的模块
    this.files = [];    // 生成的文件
  }
}
```

## 完整流程图

```
┌─────────────────┐
│  读取配置文件    │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│  创建 Compiler   │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│  加载插件        │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│  触发 run 钩子   │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│ 创建 Compilation │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│  从 entry 开始   │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│  编译模块        │◄──┐
└────────┬────────┘   │
         │            │
         ▼            │
┌─────────────────┐   │
│  解析依赖        │   │
└────────┬────────┘   │
         │            │
         ▼            │
┌─────────────────┐   │
│  递归编译依赖    │───┘
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│  生成 chunk      │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│  优化 chunk      │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│  生成代码        │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│  输出文件        │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│  触发 done 钩子  │
└─────────────────┘
```

## 关键钩子

### Compiler 钩子

- `environment`：环境准备完成
- `compile`：开始编译
- `make`：开始构建
- `emit`：输出资源到目录之前
- `done`：编译完成

### Compilation 钩子

- `buildModule`：构建模块之前
- `succeedModule`：模块构建成功
- `finishModules`：所有模块构建完成
- `seal`：封闭编译
- `optimize`：优化阶段

## 实践：监听构建流程

```javascript
class BuildFlowPlugin {
  apply(compiler) {
    compiler.hooks.environment.tap('BuildFlowPlugin', () => {
      console.log('1. 环境准备完成');
    });
    
    compiler.hooks.compile.tap('BuildFlowPlugin', () => {
      console.log('2. 开始编译');
    });
    
    compiler.hooks.make.tapAsync('BuildFlowPlugin', (compilation, callback) => {
      console.log('3. 开始构建模块');
      callback();
    });
    
    compiler.hooks.emit.tapAsync('BuildFlowPlugin', (compilation, callback) => {
      console.log('4. 输出资源');
      console.log('生成的文件：', Object.keys(compilation.assets));
      callback();
    });
    
    compiler.hooks.done.tap('BuildFlowPlugin', (stats) => {
      console.log('5. 编译完成');
      console.log('耗时：', stats.endTime - stats.startTime, 'ms');
    });
  }
}

module.exports = BuildFlowPlugin;
```

## 小结

- Webpack 构建流程分为初始化、编译、输出三个阶段
- Compiler 代表整个 webpack 环境，Compilation 代表一次编译
- 模块依赖图从 entry 开始递归构建
- Chunk 是输出的代码块，由多个模块组成
- 通过钩子系统可以介入构建流程的各个阶段

## 相关链接

- [Compiler Hooks](https://webpack.js.org/api/compiler-hooks/)
- [Compilation Hooks](https://webpack.js.org/api/compilation-hooks/)
