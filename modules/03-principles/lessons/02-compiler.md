# Compiler 工作机制

## 概述

Compiler 是 webpack 的核心对象，代表完整的 webpack 环境配置。理解 Compiler 的工作机制是深入掌握 webpack 的关键。

**预估学习时长：2 小时**

## Compiler 的作用

Compiler 对象：
- 在 webpack 启动时创建，全局唯一
- 包含完整的 webpack 配置信息
- 管理整个构建生命周期
- 提供钩子系统供插件使用
- 负责文件监听和增量编译

## Compiler 的创建

```javascript
// webpack 入口
const webpack = require('webpack');
const config = require('./webpack.config.js');

// 创建 Compiler 实例
const compiler = webpack(config);

// 运行编译
compiler.run((err, stats) => {
  if (err) {
    console.error(err);
    return;
  }
  console.log(stats.toString());
});
```

## Compiler 的核心属性

```javascript
class Compiler {
  constructor(context) {
    // 上下文路径
    this.context = context;
    
    // webpack 配置选项
    this.options = {};
    
    // 钩子系统
    this.hooks = {
      // 同步钩子
      environment: new SyncHook([]),
      afterEnvironment: new SyncHook([]),
      
      // 异步钩子
      run: new AsyncSeriesHook(['compiler']),
      compile: new SyncHook(['params']),
      make: new AsyncParallelHook(['compilation']),
      emit: new AsyncSeriesHook(['compilation']),
      done: new AsyncSeriesHook(['stats'])
    };
    
    // 输入文件系统
    this.inputFileSystem = null;
    
    // 输出文件系统
    this.outputFileSystem = null;
    
    // 文件监听器
    this.watchFileSystem = null;
  }
}
```

## Compiler 的核心方法

### run() - 启动编译

```javascript
run(callback) {
  // 1. 触发 beforeRun 钩子
  this.hooks.beforeRun.callAsync(this, err => {
    if (err) return callback(err);
    
    // 2. 触发 run 钩子
    this.hooks.run.callAsync(this, err => {
      if (err) return callback(err);
      
      // 3. 开始编译
      this.compile(onCompiled);
    });
  });
}
```

### compile() - 执行编译

```javascript
compile(callback) {
  // 1. 创建编译参数
  const params = this.newCompilationParams();
  
  // 2. 触发 beforeCompile 钩子
  this.hooks.beforeCompile.callAsync(params, err => {
    if (err) return callback(err);
    
    // 3. 触发 compile 钩子
    this.hooks.compile.call(params);
    
    // 4. 创建 Compilation 对象
    const compilation = this.newCompilation(params);
    
    // 5. 触发 make 钩子，开始构建
    this.hooks.make.callAsync(compilation, err => {
      if (err) return callback(err);
      
      // 6. 完成构建
      compilation.finish(err => {
        if (err) return callback(err);
        
        // 7. 封闭编译
        compilation.seal(err => {
          if (err) return callback(err);
          
          // 8. 触发 afterCompile 钩子
          this.hooks.afterCompile.callAsync(compilation, err => {
            if (err) return callback(err);
            
            return callback(null, compilation);
          });
        });
      });
    });
  });
}
```

### watch() - 监听模式

```javascript
watch(watchOptions, handler) {
  // 创建 Watching 对象
  const watching = new Watching(this, watchOptions, handler);
  return watching;
}
```

### emitAssets() - 输出资源

```javascript
emitAssets(compilation, callback) {
  // 1. 触发 emit 钩子
  this.hooks.emit.callAsync(compilation, err => {
    if (err) return callback(err);
    
    // 2. 输出文件
    const outputPath = this.outputPath;
    const assets = compilation.getAssets();
    
    assets.forEach(asset => {
      const targetPath = path.join(outputPath, asset.name);
      this.outputFileSystem.writeFile(targetPath, asset.source.buffer());
    });
    
    // 3. 触发 afterEmit 钩子
    this.hooks.afterEmit.callAsync(compilation, err => {
      if (err) return callback(err);
      callback();
    });
  });
}
```

## Compiler 钩子详解

### 初始化阶段

```javascript
// environment: 环境准备完成
compiler.hooks.environment.tap('MyPlugin', () => {
  console.log('环境准备完成');
});

// afterEnvironment: 环境准备完成后
compiler.hooks.afterEnvironment.tap('MyPlugin', () => {
  console.log('环境准备完成后');
});
```

### 编译阶段

```javascript
// beforeRun: 运行前
compiler.hooks.beforeRun.tapAsync('MyPlugin', (compiler, callback) => {
  console.log('准备运行');
  callback();
});

// run: 开始运行
compiler.hooks.run.tapAsync('MyPlugin', (compiler, callback) => {
  console.log('开始运行');
  callback();
});

// beforeCompile: 编译前
compiler.hooks.beforeCompile.tapAsync('MyPlugin', (params, callback) => {
  console.log('准备编译');
  callback();
});

// compile: 开始编译
compiler.hooks.compile.tap('MyPlugin', (params) => {
  console.log('开始编译');
});

// make: 构建模块
compiler.hooks.make.tapAsync('MyPlugin', (compilation, callback) => {
  console.log('开始构建模块');
  callback();
});

// afterCompile: 编译完成
compiler.hooks.afterCompile.tapAsync('MyPlugin', (compilation, callback) => {
  console.log('编译完成');
  callback();
});
```

### 输出阶段

```javascript
// emit: 输出资源前
compiler.hooks.emit.tapAsync('MyPlugin', (compilation, callback) => {
  console.log('准备输出资源');
  // 可以修改 compilation.assets
  callback();
});

// afterEmit: 输出资源后
compiler.hooks.afterEmit.tapAsync('MyPlugin', (compilation, callback) => {
  console.log('资源已输出');
  callback();
});

// done: 完成
compiler.hooks.done.tap('MyPlugin', (stats) => {
  console.log('构建完成');
  console.log('耗时:', stats.endTime - stats.startTime, 'ms');
});
```

### 监听模式

```javascript
// watchRun: 监听模式下重新编译
compiler.hooks.watchRun.tapAsync('MyPlugin', (compiler, callback) => {
  console.log('文件变化，重新编译');
  callback();
});

// watchClose: 监听停止
compiler.hooks.watchClose.tap('MyPlugin', () => {
  console.log('停止监听');
});
```

## 实践：访问 Compiler

### 在插件中访问

```javascript
class MyPlugin {
  apply(compiler) {
    // 访问配置
    console.log('Output path:', compiler.options.output.path);
    
    // 访问文件系统
    const fs = compiler.inputFileSystem;
    
    // 注册钩子
    compiler.hooks.done.tap('MyPlugin', (stats) => {
      console.log('Build completed!');
    });
  }
}
```

### 在 Loader 中访问

```javascript
module.exports = function(source) {
  // 通过 this._compiler 访问
  const compiler = this._compiler;
  console.log('Compiler context:', compiler.context);
  
  return source;
};
```

## Compiler vs Compilation

| 特性 | Compiler | Compilation |
|------|----------|-------------|
| 生命周期 | webpack 启动到结束 | 单次编译过程 |
| 创建时机 | webpack 启动时 | 每次编译时 |
| 数量 | 全局唯一 | 每次编译创建新实例 |
| 主要职责 | 管理构建流程 | 构建模块依赖图 |
| 包含内容 | 配置、钩子、文件系统 | 模块、chunk、assets |

## 小结

- Compiler 是 webpack 的核心对象，全局唯一
- Compiler 管理整个构建生命周期
- 通过钩子系统可以介入构建的各个阶段
- Compiler 提供 run() 和 watch() 两种编译模式
- 插件通过 apply() 方法访问 Compiler

## 相关链接

- [Compiler API](https://webpack.js.org/api/compiler-hooks/)
- [Node Interface](https://webpack.js.org/api/node/)
