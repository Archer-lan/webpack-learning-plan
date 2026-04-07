# Webpack 学习方案

一个完整的 webpack 学习系统，通过结构化的学习内容、实践项目和评估机制，帮助开发者从零基础到深入理解 webpack 的各个方面。

## 项目概述

本学习系统旨在提供：
- 清晰的学习路径，从基础使用到底层原理递进式学习
- 丰富的代码示例和实践项目巩固理论知识
- 支持离线学习和本地运行所有示例代码
- 进度跟踪和知识评估机制

## 学习路径

### 1. 基础使用模块（01-basics）
学习 webpack 的基本使用方法，包括：
- webpack 安装和初始化
- entry 和 output 概念
- loader 和 plugin 基础
- 开发模式和生产模式
- webpack-dev-server 和 HMR

**预估学习时长**：10-15 小时

### 2. 配置选项模块（02-configuration）
深入理解 webpack 的各种配置选项，包括：
- webpack.config.js 文件结构
- 常用 loader 和 plugin 详细配置
- resolve、devServer、optimization 配置
- source map 和环境变量配置

**预估学习时长**：20-25 小时

### 3. 底层原理模块（03-principles）
理解 webpack 的底层运行原理，包括：
- webpack 构建流程
- Compiler 和 Compilation 机制
- 模块依赖图和 AST
- 自定义 loader 和 plugin 编写
- HMR、Tree Shaking、Code Splitting 原理

**预估学习时长**：25-30 小时

## 项目结构

```
webpack-learning-plan/
├── modules/              # 学习模块
│   ├── 01-basics/       # 基础模块
│   ├── 02-configuration/# 配置模块
│   └── 03-principles/   # 原理模块
├── projects/            # 实践项目
│   ├── basic/          # 基础项目
│   ├── configuration/  # 配置项目
│   └── advanced/       # 高级项目
├── assessments/        # 评估测试
├── resources/          # 参考资料
├── examples/           # 代码示例
├── config/             # 系统配置
└── src/                # 系统源代码
```

## 快速开始

### 1. 安装依赖

```bash
npm install
```

### 2. 构建项目

```bash
npm run build
```

### 3. 运行测试

```bash
# 运行所有测试
npm test

# 运行单个测试文件
npm test -- ContentManager.test.ts

# 运行测试并查看覆盖率
npm test -- --coverage
```

### 4. 使用学习系统

#### 查看学习内容

```typescript
import { ContentManager } from './src/core/ContentManager';

const contentManager = new ContentManager();

// 获取所有模块
const modules = contentManager.getModules();

// 获取特定模块内容
const basicModule = contentManager.getModuleContent('01-basics');

// 获取课程内容
const lesson = contentManager.getLessonContent('01-basics', '01-installation');
```

#### 跟踪学习进度

```typescript
import { ProgressTracker } from './src/core/ProgressTracker';

const tracker = new ProgressTracker('user-id');

// 标记课程为已完成
tracker.markLessonComplete('01-basics', '01-installation');

// 获取模块进度
const progress = tracker.getModuleProgress('01-basics');

// 记录学习时间
tracker.recordStudyTime('01-basics', 60); // 60 分钟
```

#### 完成测试评估

```typescript
import { AssessmentEngine } from './src/core/AssessmentEngine';

const engine = new AssessmentEngine();

// 获取模块测试
const quiz = engine.getModuleQuiz('01-basics');

// 提交答案
const result = engine.submitQuiz('basics-quiz', answers);

// 查看历史成绩
const history = engine.getQuizHistory('01-basics');
```

#### 管理学习资源

```typescript
import { ResourceManager } from './src/core/ResourceManager';

const resourceManager = new ResourceManager();

// 获取推荐资源
const resources = resourceManager.getRecommendedResources();

// 获取官方文档
const docs = resourceManager.getOfficialDocs('loader');

// 获取常见问题
const faq = resourceManager.getFAQ();
```

### 5. 运行代码示例

每个模块都包含可运行的代码示例：

```bash
# 基础模块示例
cd modules/01-basics/examples/01-installation-example
npm install
npm run build

# 配置模块示例
cd modules/02-configuration/projects/01-react-config
npm install
npm run dev
```

### 6. 完成实践项目

每个模块都有配套的实践项目：

```bash
# 查看项目说明
cat modules/01-basics/projects/01-simple-js-bundle/README.md

# 开始项目
cd modules/01-basics/projects/01-simple-js-bundle/template
npm install
# 按照 README 完成项目

# 查看参考答案
cd ../solution
```

## 学习建议

1. **按顺序学习**：建议按照基础 → 配置 → 原理的顺序学习
2. **动手实践**：每学完一个知识点，运行对应的代码示例
3. **完成项目**：每个模块学习后，完成相应的实践项目
4. **定期测试**：通过模块测试检验学习效果
5. **记录笔记**：使用书签功能标记重要内容
6. **参考资料**：查阅 resources 目录中的官方文档和最佳实践
7. **社区交流**：遇到问题可以在 GitHub Issues 或 Stack Overflow 提问

## 学习路线图

```
第 1-2 周：基础模块
├── 安装和配置
├── Entry 和 Output
├── Loader 和 Plugin 基础
├── 开发服务器和 HMR
└── 完成 3 个基础实践项目

第 3-4 周：配置模块
├── 配置文件结构
├── Loader 详细配置（10+ 种）
├── Plugin 详细配置（8+ 种）
├── 高级配置选项
└── 完成 React/Vue 项目配置

第 5-8 周：原理模块
├── Webpack 构建流程
├── Compiler 和 Compilation
├── Loader 和 Plugin 机制
├── 编写自定义 Loader
├── 编写自定义 Plugin
└── 性能优化和问题排查
```

## 时间规划建议

- **4 周完成**：每天学习 2-3 小时
- **8 周完成**：每天学习 1-1.5 小时
- **12 周完成**：每天学习 0.5-1 小时

## 功能特性

### 核心功能
- ✅ **离线访问**：所有学习内容支持离线访问
- ✅ **本地运行**：所有代码示例可在本地运行
- ✅ **进度跟踪**：自动记录学习进度和时间
- ✅ **知识评估**：每个模块配有测试题和综合测试
- ✅ **实践项目**：10+ 个实践项目巩固知识

### 辅助功能
- ✅ **书签功能**：标记重要内容，方便回顾
- ✅ **笔记导出**：导出学习笔记为 Markdown 格式
- ✅ **学习计划**：根据目标时间生成个性化学习计划
- ✅ **搜索功能**：快速查找知识点
- ✅ **资源库**：官方文档、推荐资源、常见问题等

### 内容特色
- 📚 **3 个学习模块**：基础、配置、原理
- 📝 **20+ 篇课程文档**：详细讲解每个知识点
- 💻 **30+ 个代码示例**：可运行的完整示例
- 🎯 **10+ 个实践项目**：从简单到复杂的项目练习
- ❓ **30 道测试题**：检验学习效果
- 📖 **20+ 个常见问题**：FAQ 和解决方案

## 目录结构详解

```
webpack-learning-plan/
├── modules/                    # 学习模块
│   ├── 01-basics/             # 基础模块
│   │   ├── README.md          # 模块概述
│   │   ├── lessons/           # 课程文档
│   │   ├── examples/          # 代码示例
│   │   ├── projects/          # 实践项目
│   │   └── quiz.json          # 模块测试
│   ├── 02-configuration/      # 配置模块
│   └── 03-principles/         # 原理模块
├── resources/                 # 参考资料
│   ├── official-docs.md       # 官方文档链接
│   ├── learning-resources.md  # 推荐学习资源
│   ├── faq.md                 # 常见问题（20+）
│   └── best-practices.md      # 性能优化最佳实践
├── config/                    # 系统配置
│   ├── learning-path.json     # 学习路径配置
│   └── system.json            # 系统配置
├── src/                       # 系统源代码
│   ├── core/                  # 核心功能
│   │   ├── ContentManager.ts  # 内容管理
│   │   ├── ProgressTracker.ts # 进度跟踪
│   │   ├── AssessmentEngine.ts# 评估系统
│   │   ├── ProjectManager.ts  # 项目管理
│   │   └── ResourceManager.ts # 资源管理
│   └── types/                 # 类型定义
├── examples/                  # 使用示例
├── data/                      # 数据存储
└── docs/                      # 文档
```

## 技术栈

- **内容格式**：Markdown（学习文档）、JSON（配置和数据）
- **编程语言**：TypeScript/JavaScript
- **测试框架**：Jest + fast-check
- **运行环境**：Node.js

## 贡献

欢迎贡献新的学习内容、代码示例或改进建议。请参考贡献指南。

## 许可证

MIT


## API 文档

### ContentManager

内容管理器，用于访问学习内容。

```typescript
const contentManager = new ContentManager();

// 获取所有模块
const modules = contentManager.getModules();

// 获取模块内容
const moduleContent = contentManager.getModuleContent('01-basics');

// 获取课程内容
const lessonContent = contentManager.getLessonContent('01-basics', '01-installation');

// 搜索内容
const results = contentManager.searchContent('loader');
```

### ProgressTracker

进度跟踪器，用于管理学习进度。

```typescript
const tracker = new ProgressTracker('user-id');

// 标记课程完成
tracker.markLessonComplete('01-basics', '01-installation');

// 获取模块进度
const progress = tracker.getModuleProgress('01-basics');

// 获取整体进度
const overall = tracker.getOverallProgress();

// 记录学习时间
tracker.recordStudyTime('01-basics', 60);

// 添加书签
tracker.addBookmark('01-basics', '01-installation');

// 导出笔记
const notes = tracker.exportNotes();
```

### AssessmentEngine

评估引擎，用于知识测试。

```typescript
const engine = new AssessmentEngine();

// 获取模块测试
const quiz = engine.getModuleQuiz('01-basics');

// 提交答案
const result = engine.submitQuiz('quiz-id', answers);

// 获取历史成绩
const history = engine.getQuizHistory('01-basics');

// 生成综合测试
const finalExam = engine.generateFinalExam();
```

### ProjectManager

项目管理器，用于管理实践项目。

```typescript
const projectManager = new ProjectManager();

// 获取项目列表
const projects = projectManager.getProjects('basic');

// 获取项目模板
const template = projectManager.getProjectTemplate('01-simple-js-bundle');

// 获取参考答案
const solution = projectManager.getProjectSolution('01-simple-js-bundle');

// 对比代码
const comparison = projectManager.compareCode(userCode, solutionCode);
```

### ResourceManager

资源管理器，用于访问参考资料。

```typescript
const resourceManager = new ResourceManager();

// 获取推荐资源
const resources = resourceManager.getRecommendedResources();

// 获取官方文档
const docs = resourceManager.getOfficialDocs('loader');

// 获取常见问题
const faq = resourceManager.getFAQ();

// 获取配置模板
const templates = resourceManager.getConfigTemplates();
```

## 常见问题

### 如何开始学习？

1. 克隆或下载本项目
2. 运行 `npm install` 安装依赖
3. 从 `modules/01-basics/README.md` 开始学习
4. 按照课程顺序阅读文档并运行示例

### 如何运行代码示例？

每个示例都是独立的项目：

```bash
cd modules/01-basics/examples/01-installation-example
npm install
npm run build
```

### 如何完成实践项目？

1. 阅读项目 README 了解要求
2. 在 template 目录中编写代码
3. 完成后对比 solution 目录中的参考答案

### 如何跟踪学习进度？

使用 ProgressTracker API：

```typescript
const tracker = new ProgressTracker('your-user-id');
tracker.markLessonComplete('module-id', 'lesson-id');
```

### 遇到问题怎么办？

1. 查阅 `resources/faq.md` 中的常见问题
2. 搜索 `resources/official-docs.md` 中的官方文档
3. 在 GitHub Issues 中提问
4. 在 Stack Overflow 上搜索相关问题

## 贡献指南

欢迎贡献！你可以：

1. **添加新内容**：编写新的课程文档或代码示例
2. **改进现有内容**：修正错误或改进说明
3. **提供反馈**：报告问题或提出改进建议
4. **翻译内容**：将内容翻译成其他语言

### 贡献步骤

1. Fork 本项目
2. 创建特性分支 (`git checkout -b feature/AmazingFeature`)
3. 提交更改 (`git commit -m 'Add some AmazingFeature'`)
4. 推送到分支 (`git push origin feature/AmazingFeature`)
5. 开启 Pull Request

### 内容格式规范

- 课程文档使用 Markdown 格式
- 代码示例包含完整的 package.json 和 README
- 测试题使用 JSON 格式
- 遵循现有的目录结构和命名规范

## 更新日志

### v1.0.0 (2024-01-01)

- ✨ 初始版本发布
- 📚 完成基础模块内容
- 📚 完成配置模块内容
- 📚 完成原理模块内容
- 💻 提供 30+ 个代码示例
- 🎯 提供 10+ 个实践项目
- 📖 提供完整的参考资料

## 相关资源

- [Webpack 官方文档](https://webpack.js.org/)
- [Webpack 中文文档](https://webpack.docschina.org/)
- [Webpack GitHub](https://github.com/webpack/webpack)
- [Webpack 官方博客](https://webpack.js.org/blog/)

## 致谢

感谢以下资源和项目的启发：

- Webpack 官方文档
- SurviveJS - Webpack
- 《深入浅出 Webpack》
- Webpack Academy
- 社区贡献者

## 许可证

MIT License

Copyright (c) 2024 Webpack Learning Plan

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.

---

**开始你的 Webpack 学习之旅吧！** 🚀

如有任何问题或建议，欢迎提交 Issue 或 Pull Request。
