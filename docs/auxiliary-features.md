# 辅助功能实现文档

本文档描述了任务 9 中实现的三个辅助功能：书签功能、学习笔记导出和个性化学习计划生成。

## 功能概述

### 1. 书签功能

允许学习者标记重要的课程内容，方便后续快速访问。

**实现位置：** `src/core/ProgressTracker.ts`

**方法：**
- `addBookmark(lessonId: string): void` - 添加书签
- `removeBookmark(lessonId: string): void` - 移除书签
- `getBookmarks(): string[]` - 获取所有书签

**特性：**
- 幂等操作：重复添加同一书签不会产生重复记录
- 数据持久化：书签保存在进度文件中
- 返回副本：`getBookmarks()` 返回数组副本，防止外部修改

**使用示例：**
```typescript
const progressTracker = new ProgressTracker('user-id');

// 添加书签
progressTracker.addBookmark('01-basics/01-installation');
progressTracker.addBookmark('02-configuration/01-config-structure');

// 获取书签列表
const bookmarks = progressTracker.getBookmarks();
console.log(bookmarks); // ['01-basics/01-installation', '02-configuration/01-config-structure']

// 移除书签
progressTracker.removeBookmark('01-basics/01-installation');
```

### 2. 学习笔记导出功能

将学习进度、已完成课程和书签内容导出为 Markdown 格式的学习笔记。

**实现位置：** `src/core/ProgressTracker.ts`

**方法：**
- `exportNotes(contentManager: ContentManager): string` - 导出学习笔记

**导出内容包括：**
1. 学习进度概览
   - 整体完成度
   - 已完成课程数
   - 已完成项目数
   - 最后学习日期

2. 已完成的课程
   - 按模块分组
   - 课程标题
   - 关键知识点
   - 内容摘要（前 200 字符）

3. 书签内容
   - 课程标题和模块信息
   - 关键知识点
   - 相关文档链接

4. 学习统计
   - 各模块学习时间
   - 各模块完成度

**使用示例：**
```typescript
const progressTracker = new ProgressTracker('user-id');
const contentManager = new ContentManager();

// 导出笔记
const notes = progressTracker.exportNotes(contentManager);

// 保存到文件
fs.writeFileSync('my-learning-notes.md', notes, 'utf-8');
```

**导出格式示例：**
```markdown
# 我的 Webpack 学习笔记

导出时间：2026/3/3 00:51:04

---

## 学习进度概览

- 整体完成度：25%
- 已完成课程数：2
- 已完成项目数：0
- 最后学习日期：2026/3/3 00:51:04

---

## 已完成的课程

### 模块：01-basics

#### Webpack 安装和初始化

**关键知识点：**

- npm 安装 webpack
- webpack-cli 的作用
- 初始化 package.json

**内容摘要：**

本课程介绍如何安装和初始化 webpack 项目...

---

## 我的书签

### Webpack 配置文件结构

**模块：** 02-configuration

**关键知识点：**

- webpack.config.js 基本结构
- 配置对象的导出方式

**相关文档：**

- [Webpack 官方文档](https://webpack.js.org)

---

## 学习统计

### 各模块学习时间

- 01-basics: 2小时0分钟

### 各模块完成度

- 01-basics: 2/8 (25%)
```

### 3. 个性化学习计划生成

根据目标学习时间自动生成合理的学习计划。

**实现位置：** 
- `src/core/LearningPlanGenerator.ts` - 学习计划生成器类
- `src/core/ProgressTracker.ts` - 提供便捷方法

**方法：**
- `generateLearningPlan(modules: Module[], targetHours: number): LearningPlan` - 生成学习计划

**生成规则：**
1. **时间范围验证**
   - 目标时间必须在总预估时长的 90%-110% 之间
   - 太短或太长都会抛出错误

2. **每日学习时间计算**
   - 自动计算合理的每日学习时间（1-4 小时）
   - 根据时间紧张程度调整：
     - 时间紧张（≤95%）：3.5 小时/天
     - 时间适中（95%-100%）：2.5 小时/天
     - 时间充裕（>100%）：1.5 小时/天

3. **模块顺序**
   - 按模块的 order 字段排序
   - 确保符合依赖关系

4. **课程分配**
   - 按课程顺序分配到每天
   - 如果课程时长超过当天剩余时间，会跨天安排

**使用示例：**
```typescript
const progressTracker = new ProgressTracker('user-id');
const contentManager = new ContentManager();

// 获取所有模块
const modules = contentManager.getModules();

// 生成 100 小时的学习计划
const plan = progressTracker.generateLearningPlan(modules, 100);

console.log(`目标学习时间: ${plan.targetHours} 小时`);
console.log(`每日学习时间: ${plan.dailyHours} 小时`);
console.log(`总天数: ${plan.totalDays} 天`);

// 查看学习计划
plan.schedule.forEach(item => {
  console.log(`第 ${item.day} 天 - 模块 ${item.moduleId}:`);
  console.log(`  课程: ${item.lessonIds.join(', ')}`);
  console.log(`  预估时长: ${item.estimatedHours.toFixed(1)} 小时`);
});
```

**返回的学习计划结构：**
```typescript
interface LearningPlan {
  targetHours: number;           // 目标学习时间（小时）
  dailyHours: number;            // 每日学习时间（小时）
  totalDays: number;             // 总天数
  schedule: {                    // 学习计划
    day: number;                 // 第几天
    moduleId: string;            // 模块 ID
    lessonIds: string[];         // 课程 ID 列表
    estimatedHours: number;      // 预估时长
  }[];
}
```

## 数据持久化

所有辅助功能的数据都保存在进度文件中（`progress-{userId}.json`）：

```json
{
  "userId": "user-id",
  "completedLessons": [...],
  "completedProjects": [...],
  "moduleProgress": {...},
  "overallPercentage": 25,
  "studyTime": {...},
  "lastStudyDate": "2026-03-03T00:51:04.000Z",
  "bookmarks": [
    "01-basics/01-installation",
    "02-configuration/01-config-structure"
  ]
}
```

## 测试

所有功能都有完整的单元测试覆盖：

**测试文件：** `src/core/ProgressTracker.auxiliary.test.ts`

**测试覆盖：**
- 书签功能：5 个测试用例
- 学习笔记导出：3 个测试用例
- 学习计划生成：6 个测试用例

**运行测试：**
```bash
npm test -- ProgressTracker.auxiliary.test.ts
```

## 示例代码

完整的使用示例可以在以下文件中找到：

**示例文件：** `examples/auxiliary-features-usage.ts`

**运行示例：**
```bash
npx ts-node examples/auxiliary-features-usage.ts
```

## 相关需求

本实现满足以下需求：

- **需求 8.5**：学习系统应支持导出学习笔记
- **需求 8.6**：学习系统应支持书签功能，标记重要内容
- **需求 9.6**：当学习者设定学习目标时间，学习系统应生成个性化学习计划

## 设计属性

本实现验证以下设计属性：

- **属性 15**：书签功能正确性（往返属性）
- **属性 17**：学习笔记导出完整性
- **属性 18**：个性化学习计划生成正确性

## 错误处理

### 书签功能
- 移除不存在的书签不会报错（静默处理）
- 重复添加书签是幂等操作

### 学习笔记导出
- 如果课程内容无法加载，会显示"无法加载详细信息"
- 空进度也能正常导出基本结构

### 学习计划生成
- 目标时间为负数或零：抛出错误
- 目标时间太短（<90%）：抛出错误并提示最小时长
- 目标时间太长（>110%）：抛出错误并提示最大时长
- 模块列表为空：抛出错误

## 未来改进

1. **书签功能**
   - 添加书签分类和标签
   - 支持书签笔记

2. **学习笔记导出**
   - 支持多种导出格式（PDF、HTML）
   - 添加图表和可视化

3. **学习计划生成**
   - 考虑学习者的历史学习速度
   - 支持自定义每日学习时间
   - 添加学习提醒功能
