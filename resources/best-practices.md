# Webpack 性能优化最佳实践

## 构建性能优化

### 1. 使用持久化缓存

Webpack 5 内置了持久化缓存功能：

```javascript
module.exports = {
  cache: {
    type: 'filesystem',
    buildDependencies: {
      config: [__filename]
    }
  }
};
```

**效果**：首次构建后，后续构建速度提升 90% 以上

### 2. 减少 Loader 处理范围

使用 include 和 exclude 限制 loader 的处理范围：

```javascript
module.exports = {
  module: {
    rules: [
      {
        test: /\.js$/,
        include: path.resolve(__dirname, 'src'),
        exclude: /node_modules/,
        use: 'babel-loader'
      }
    ]
  }
};
```

### 3. 使用 DLL 或 Externals

对于不常变化的第三方库，可以使用 externals：

```javascript
module.exports = {
  externals: {
    react: 'React',
    'react-dom': 'ReactDOM'
  }
};
```

### 4. 多线程构建

使用 thread-loader 进行多线程构建：

```javascript
module.exports = {
  module: {
    rules: [
      {
        test: /\.js$/,
        use: [
          'thread-loader',
          'babel-loader'
        ]
      }
    ]
  }
};
```

### 5. 优化 resolve 配置

```javascript
module.exports = {
  resolve: {
    // 减少搜索步骤
    modules: [path.resolve(__dirname, 'node_modules')],
    
    // 减少后缀尝试
    extensions: ['.js', '.jsx'],
    
    // 使用别名
    alias: {
      '@': path.resolve(__dirname, 'src')
    },
    
    // 优化 symlinks
    symlinks: false
  }
};
```

### 6. 使用 noParse

对于不需要解析依赖的库，使用 noParse：

```javascript
module.exports = {
  module: {
    noParse: /jquery|lodash/
  }
};
```

## 打包体积优化

### 1. 代码分割

#### 入口分割

```javascript
module.exports = {
  entry: {
    app: './src/app.js',
    vendor: './src/vendor.js'
  }
};
```

#### 动态导入

```javascript
// 懒加载
button.addEventListener('click', () => {
  import(/* webpackChunkName: "module" */ './module.js')
    .then(module => {
      module.default();
    });
});
```

#### SplitChunks

```javascript
module.exports = {
  optimization: {
    splitChunks: {
      chunks: 'all',
      cacheGroups: {
        vendor: {
          test: /[\\/]node_modules[\\/]/,
          name: 'vendors',
          priority: 10
        },
        common: {
          minChunks: 2,
          priority: 5,
          reuseExistingChunk: true
        }
      }
    }
  }
};
```

### 2. Tree Shaking

确保使用 ES6 模块语法：

```javascript
// package.json
{
  "sideEffects": false
}

// 或指定有副作用的文件
{
  "sideEffects": ["*.css", "*.scss"]
}
```

### 3. 压缩代码

#### JavaScript 压缩

```javascript
const TerserPlugin = require('terser-webpack-plugin');

module.exports = {
  optimization: {
    minimize: true,
    minimizer: [
      new TerserPlugin({
        parallel: true,
        terserOptions: {
          compress: {
            drop_console: true
          }
        }
      })
    ]
  }
};
```

#### CSS 压缩

```javascript
const CssMinimizerPlugin = require('css-minimizer-webpack-plugin');

module.exports = {
  optimization: {
    minimizer: [
      new CssMinimizerPlugin()
    ]
  }
};
```

### 4. 图片优化

使用 image-webpack-loader：

```javascript
module.exports = {
  module: {
    rules: [
      {
        test: /\.(png|jpg|gif)$/,
        use: [
          {
            loader: 'url-loader',
            options: {
              limit: 8192
            }
          },
          {
            loader: 'image-webpack-loader',
            options: {
              mozjpeg: {
                progressive: true,
                quality: 65
              },
              optipng: {
                enabled: false
              },
              pngquant: {
                quality: [0.65, 0.90],
                speed: 4
              }
            }
          }
        ]
      }
    ]
  }
};
```

### 5. 使用 CDN

```javascript
module.exports = {
  output: {
    publicPath: 'https://cdn.example.com/'
  }
};
```

## 运行时性能优化

### 1. 长期缓存

使用 contenthash：

```javascript
module.exports = {
  output: {
    filename: '[name].[contenthash:8].js',
    chunkFilename: '[name].[contenthash:8].chunk.js'
  }
};
```

### 2. 提取 Runtime

```javascript
module.exports = {
  optimization: {
    runtimeChunk: 'single'
  }
};
```

### 3. Module IDs 优化

```javascript
module.exports = {
  optimization: {
    moduleIds: 'deterministic'
  }
};
```

### 4. Prefetch 和 Preload

```javascript
// Prefetch（空闲时加载）
import(/* webpackPrefetch: true */ './module.js');

// Preload（立即加载）
import(/* webpackPreload: true */ './module.js');
```

## 开发体验优化

### 1. 快速的 Source Map

开发环境使用快速的 source map：

```javascript
module.exports = {
  devtool: 'eval-cheap-module-source-map'
};
```

### 2. 热更新优化

```javascript
module.exports = {
  devServer: {
    hot: true,
    liveReload: false
  }
};
```

### 3. 开发服务器优化

```javascript
module.exports = {
  devServer: {
    compress: true,
    historyApiFallback: true,
    open: true,
    overlay: true
  }
};
```

## 分析和监控

### 1. 使用 webpack-bundle-analyzer

```javascript
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;

module.exports = {
  plugins: [
    new BundleAnalyzerPlugin({
      analyzerMode: 'static',
      openAnalyzer: false
    })
  ]
};
```

### 2. 使用 speed-measure-webpack-plugin

```javascript
const SpeedMeasurePlugin = require('speed-measure-webpack-plugin');
const smp = new SpeedMeasurePlugin();

module.exports = smp.wrap({
  // webpack 配置
});
```

### 3. 查看构建统计

```bash
webpack --profile --json > stats.json
```

## 环境配置最佳实践

### 开发环境配置

```javascript
module.exports = {
  mode: 'development',
  devtool: 'eval-cheap-module-source-map',
  devServer: {
    hot: true,
    open: true
  },
  cache: {
    type: 'filesystem'
  },
  optimization: {
    removeAvailableModules: false,
    removeEmptyChunks: false,
    splitChunks: false
  }
};
```

### 生产环境配置

```javascript
module.exports = {
  mode: 'production',
  devtool: 'source-map',
  output: {
    filename: '[name].[contenthash:8].js',
    chunkFilename: '[name].[contenthash:8].chunk.js',
    clean: true
  },
  optimization: {
    minimize: true,
    minimizer: [
      new TerserPlugin(),
      new CssMinimizerPlugin()
    ],
    splitChunks: {
      chunks: 'all',
      cacheGroups: {
        vendor: {
          test: /[\\/]node_modules[\\/]/,
          name: 'vendors',
          priority: 10
        }
      }
    },
    runtimeChunk: 'single',
    moduleIds: 'deterministic'
  },
  performance: {
    hints: 'warning',
    maxEntrypointSize: 512000,
    maxAssetSize: 512000
  }
};
```

## 通用最佳实践

### 1. 配置文件分离

```
webpack.common.js   # 公共配置
webpack.dev.js      # 开发环境
webpack.prod.js     # 生产环境
```

### 2. 使用环境变量

```javascript
const webpack = require('webpack');

module.exports = {
  plugins: [
    new webpack.DefinePlugin({
      'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV)
    })
  ]
};
```

### 3. 版本控制

在 package.json 中锁定 webpack 版本：

```json
{
  "devDependencies": {
    "webpack": "5.75.0",
    "webpack-cli": "5.0.0"
  }
}
```

### 4. 文档和注释

在配置文件中添加注释说明：

```javascript
module.exports = {
  // 入口文件
  entry: './src/index.js',
  
  // 输出配置
  output: {
    // 输出目录
    path: path.resolve(__dirname, 'dist'),
    // 输出文件名（使用 contenthash 实现长期缓存）
    filename: '[name].[contenthash:8].js'
  }
};
```

## 性能指标

### 构建速度目标

- 首次构建：< 30 秒
- 增量构建：< 5 秒
- 热更新：< 1 秒

### 打包体积目标

- 首屏 JS：< 200KB（gzip 后）
- 首屏 CSS：< 50KB（gzip 后）
- 总体积：< 1MB（gzip 后）

### 运行时性能目标

- 首次加载：< 3 秒
- 交互时间：< 5 秒
- 缓存命中率：> 90%

## 检查清单

### 构建优化

- [ ] 启用持久化缓存
- [ ] 限制 loader 处理范围
- [ ] 使用多线程构建
- [ ] 优化 resolve 配置
- [ ] 使用 noParse

### 体积优化

- [ ] 启用代码分割
- [ ] 启用 Tree Shaking
- [ ] 压缩 JS 和 CSS
- [ ] 优化图片
- [ ] 使用 CDN

### 运行时优化

- [ ] 使用 contenthash
- [ ] 提取 runtime
- [ ] 优化 module IDs
- [ ] 使用 prefetch/preload

### 监控

- [ ] 使用 bundle analyzer
- [ ] 监控构建时间
- [ ] 监控打包体积
- [ ] 设置性能预算

## 总结

性能优化是一个持续的过程，需要：

1. **测量**：使用工具分析当前性能
2. **优化**：针对性地进行优化
3. **验证**：验证优化效果
4. **监控**：持续监控性能指标

记住：过早优化是万恶之源，先让项目跑起来，再根据实际情况进行优化。
