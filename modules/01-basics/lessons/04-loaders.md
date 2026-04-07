# Loader 基本概念和使用

本课程介绍 webpack loader 的基本概念和常用 loader 的使用方法。

预估学习时长：60 分钟

## 关键知识点

- loader 的作用和工作原理
- loader 的配置方式
- 常用 loader 的使用
- loader 的执行顺序

## 课程内容

### 什么是 Loader

webpack 本身只能理解 JavaScript 和 JSON 文件。loader 让 webpack 能够去处理其他类型的文件，并将它们转换为有效的模块，以供应用程序使用。

### Loader 的配置

在 `webpack.config.js` 中配置 loader：

```javascript
module.exports = {
  module: {
    rules: [
      {
        test: /\.css$/,  // 匹配文件
        use: ['style-loader', 'css-loader']  // 使用的 loader
      }
    ]
  }
};
```

### 常用 Loader

#### 1. CSS Loader

处理 CSS 文件：

```bash
npm install --save-dev style-loader css-loader
```

```javascript
module.exports = {
  module: {
    rules: [
      {
        test: /\.css$/,
        use: ['style-loader', 'css-loader']
      }
    ]
  }
};
```

- `css-loader`：解析 CSS 文件中的 `@import` 和 `url()`
- `style-loader`：将 CSS 注入到 DOM 中

#### 2. Sass/SCSS Loader

处理 Sass/SCSS 文件：

```bash
npm install --save-dev sass-loader sass
```

```javascript
module.exports = {
  module: {
    rules: [
      {
        test: /\.scss$/,
        use: ['style-loader', 'css-loader', 'sass-loader']
      }
    ]
  }
};
```

#### 3. Babel Loader

转换 ES6+ 代码为 ES5：

```bash
npm install --save-dev babel-loader @babel/core @babel/preset-env
```

```javascript
module.exports = {
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: ['@babel/preset-env']
          }
        }
      }
    ]
  }
};
```

#### 4. 文件 Loader

处理图片、字体等文件（webpack 5 使用 Asset Modules）：

```javascript
module.exports = {
  module: {
    rules: [
      {
        test: /\.(png|jpg|gif|svg)$/,
        type: 'asset/resource'
      },
      {
        test: /\.(woff|woff2|eot|ttf|otf)$/,
        type: 'asset/resource'
      }
    ]
  }
};
```

#### 5. TypeScript Loader

处理 TypeScript 文件：

```bash
npm install --save-dev typescript ts-loader
```

```javascript
module.exports = {
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        use: 'ts-loader',
        exclude: /node_modules/
      }
    ]
  },
  resolve: {
    extensions: ['.tsx', '.ts', '.js']
  }
};
```

### Loader 的执行顺序

loader 从右到左（或从下到上）执行：

```javascript
{
  test: /\.css$/,
  use: ['style-loader', 'css-loader']  // 先执行 css-loader，再执行 style-loader
}
```

### Loader 的配置选项

可以为 loader 传递选项：

```javascript
{
  test: /\.css$/,
  use: [
    'style-loader',
    {
      loader: 'css-loader',
      options: {
        modules: true,  // 启用 CSS Modules
        importLoaders: 1
      }
    }
  ]
}
```

### 实践示例

创建一个处理多种文件类型的配置：

```javascript
const path = require('path');

module.exports = {
  entry: './src/index.js',
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'bundle.js'
  },
  module: {
    rules: [
      // JavaScript
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: ['@babel/preset-env']
          }
        }
      },
      // CSS
      {
        test: /\.css$/,
        use: ['style-loader', 'css-loader']
      },
      // SCSS
      {
        test: /\.scss$/,
        use: ['style-loader', 'css-loader', 'sass-loader']
      },
      // 图片
      {
        test: /\.(png|jpg|gif|svg)$/,
        type: 'asset/resource',
        generator: {
          filename: 'images/[name].[hash][ext]'
        }
      },
      // 字体
      {
        test: /\.(woff|woff2|eot|ttf|otf)$/,
        type: 'asset/resource',
        generator: {
          filename: 'fonts/[name].[hash][ext]'
        }
      }
    ]
  }
};
```

## 相关文档

- [Webpack 官方文档 - Loaders](https://webpack.js.org/concepts/loaders/)
- [Webpack 官方文档 - Asset Modules](https://webpack.js.org/guides/asset-modules/)
- [Babel 官方文档](https://babeljs.io/)
- [Sass 官方文档](https://sass-lang.com/)
