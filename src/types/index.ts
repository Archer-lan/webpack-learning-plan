/**
 * Webpack Learning Plan - Type Definitions
 * 
 * This file contains all TypeScript type definitions for the learning system.
 */

/**
 * 代码文件
 */
export interface CodeFile {
  path: string;                  // 文件路径
  content: string;               // 文件内容
  language: string;              // 编程语言
}

/**
 * 代码示例
 */
export interface Example {
  id: string;                    // 示例ID
  title: string;                 // 示例标题
  description: string;           // 示例说明
  files: CodeFile[];             // 代码文件
  runnable: boolean;             // 是否可运行
  dependencies: string[];        // npm 依赖
}

/**
 * 文档链接
 */
export interface DocLink {
  title: string;                 // 文档标题
  url: string;                   // 文档链接
  type: 'official' | 'community';  // 文档类型
}

/**
 * 课程
 */
export interface Lesson {
  id: string;                    // 课程ID
  moduleId: string;              // 所属模块ID
  title: string;                 // 课程标题
  content: string;               // Markdown 内容
  order: number;                 // 课程顺序
  estimatedMinutes: number;      // 预估学习时长（分钟）
  keyPoints: string[];           // 关键知识点
  examples: Example[];           // 代码示例
  relatedDocs: DocLink[];        // 相关文档链接
}

/**
 * 学习模块
 */
export interface Module {
  id: string;                    // 模块ID（如 "01-basics"）
  name: string;                  // 模块名称
  description: string;           // 模块描述
  order: number;                 // 学习顺序
  estimatedHours: number;        // 预估学习时长（小时）
  lessons: Lesson[];             // 课程列表
  prerequisites: string[];       // 前置模块ID
  learningObjectives: string[];  // 学习目标
}

/**
 * 项目模板
 */
export interface ProjectTemplate {
  files: CodeFile[];             // 模板文件
  instructions: string;          // 项目说明
}

/**
 * 项目参考答案
 */
export interface ProjectSolution {
  files: CodeFile[];             // 完整代码
  explanation: string;           // 实现说明
  keyPoints: string[];           // 关键知识点
}

/**
 * 实践项目
 */
export interface Project {
  id: string;                    // 项目ID
  name: string;                  // 项目名称
  level: 'basic' | 'configuration' | 'advanced';  // 难度级别
  description: string;           // 项目描述
  objectives: string[];          // 项目目标
  estimatedHours: number;        // 预估完成时长
  template: ProjectTemplate;     // 初始模板
  solution: ProjectSolution;     // 参考答案
  hints: string[];               // 提示信息
  relatedLessons: string[];      // 相关课程ID
}

/**
 * 学习进度
 */
export interface Progress {
  userId: string;                // 学习者ID（本地可用设备ID）
  completedLessons: string[];    // 已完成课程ID列表
  completedProjects: string[];   // 已完成项目ID列表
  moduleProgress: {              // 模块进度
    [moduleId: string]: {
      completedCount: number;
      totalCount: number;
      percentage: number;
    };
  };
  overallPercentage: number;     // 整体完成百分比
  studyTime: {                   // 学习时间（分钟）
    [moduleId: string]: number;
  };
  lastStudyDate: string;         // 最后学习日期
  bookmarks: string[];           // 书签（课程ID）
}

/**
 * 测试题目
 */
export interface Question {
  id: string;                    // 题目ID
  type: 'multiple-choice' | 'true-false' | 'short-answer';  // 题型
  question: string;              // 题目内容
  options?: string[];            // 选项（选择题）
  correctAnswer: string | string[];  // 正确答案
  explanation: string;           // 答案解析
  points: number;                // 分值
  relatedLesson: string;         // 相关课程ID
}

/**
 * 测试题
 */
export interface Quiz {
  id: string;                    // 测试ID
  moduleId: string;              // 所属模块ID
  title: string;                 // 测试标题
  questions: Question[];         // 题目列表
  passingScore: number;          // 及格分数
  timeLimit?: number;            // 时间限制（分钟）
}

/**
 * 测试结果
 */
export interface QuizResult {
  quizId: string;                // 测试ID
  score: number;                 // 得分
  totalPoints: number;           // 总分
  percentage: number;            // 正确率
  answers: {                     // 答题记录
    questionId: string;
    userAnswer: string | string[];
    isCorrect: boolean;
  }[];
  completedAt: string;           // 完成时间
}

/**
 * 参考资料
 */
export interface Resource {
  id: string;                    // 资源ID
  type: 'book' | 'video' | 'blog' | 'doc' | 'tool';  // 资源类型
  title: string;                 // 资源标题
  description: string;           // 资源描述
  url: string;                   // 资源链接
  author?: string;               // 作者
  tags: string[];                // 标签
  recommended: boolean;          // 是否推荐
}

/**
 * 里程碑
 */
export interface Milestone {
  name: string;                  // 里程碑名称
  description: string;           // 描述
  requiredLessons: string[];     // 必须完成的课程
  requiredProjects: string[];    // 必须完成的项目
}

/**
 * 学习路径
 */
export interface LearningPath {
  id: string;                    // 路径ID
  name: string;                  // 路径名称
  description: string;           // 路径描述
  totalHours: number;            // 总学时
  modules: {                     // 模块顺序
    moduleId: string;
    order: number;
    required: boolean;
  }[];
  milestones: Milestone[];       // 里程碑
}

/**
 * 模块内容（包含完整的模块信息）
 */
export interface ModuleContent extends Module {
  // Module 已包含所有必需字段
}

/**
 * 课程内容（包含完整的课程信息）
 */
export interface LessonContent extends Lesson {
  // Lesson 已包含所有必需字段
}

/**
 * 搜索结果
 */
export interface SearchResult {
  type: 'lesson' | 'project' | 'resource';  // 结果类型
  id: string;                    // 资源ID
  title: string;                 // 标题
  description: string;           // 描述
  moduleId?: string;             // 所属模块ID（如果适用）
  relevance: number;             // 相关性评分（0-1）
}

/**
 * 代码对比结果
 */
export interface ComparisonResult {
  identical: boolean;            // 是否完全相同
  differences: {                 // 差异列表
    lineNumber: number;
    userCode: string;
    solutionCode: string;
  }[];
  similarity: number;            // 相似度（0-1）
}

/**
 * 测试历史记录
 */
export interface QuizHistory {
  quizId: string;                // 测试ID
  moduleId: string;              // 模块ID
  results: QuizResult[];         // 历史测试结果
}

/**
 * 学习统计
 */
export interface Statistics {
  totalStudyTime: number;        // 总学习时间（分钟）
  completedLessonsCount: number; // 已完成课程数
  completedProjectsCount: number;// 已完成项目数
  averageQuizScore: number;      // 平均测试分数
  moduleStatistics: {            // 各模块统计
    [moduleId: string]: {
      studyTime: number;
      completedLessons: number;
      averageScore: number;
    };
  };
}

/**
 * 常见问题
 */
export interface FAQ {
  id: string;                    // 问题ID
  question: string;              // 问题
  answer: string;                // 答案
  category: string;              // 分类
  tags: string[];                // 标签
}

/**
 * 配置模板
 */
export interface ConfigTemplate {
  id: string;                    // 模板ID
  name: string;                  // 模板名称
  description: string;           // 模板描述
  category: string;              // 分类
  files: CodeFile[];             // 配置文件
  usage: string;                 // 使用说明
}

/**
 * 学习计划
 */
export interface LearningPlan {
  targetHours: number;           // 目标学习时间（小时）
  dailyHours: number;            // 每日学习时间（小时）
  totalDays: number;             // 总天数
  schedule: {                    // 学习计划
    day: number;
    moduleId: string;
    lessonIds: string[];
    estimatedHours: number;
  }[];
}

/**
 * 答案类型（用于测试提交）
 */
export type Answer = {
  questionId: string;
  answer: string | string[];
};
