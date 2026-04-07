/**
 * ProgressTracker 辅助功能测试
 * 
 * 测试书签、学习笔记导出和学习计划生成功能
 */

import { ProgressTracker } from './ProgressTracker';
import { LearningPlanGenerator } from './LearningPlanGenerator';
import { Module } from '../types';
import * as fs from 'fs';
import * as path from 'path';

describe('ProgressTracker - 辅助功能', () => {
  let progressTracker: ProgressTracker;
  const testDataPath = path.join(__dirname, '../../test-data-auxiliary');

  beforeEach(() => {
    // 清理测试数据目录
    if (fs.existsSync(testDataPath)) {
      fs.rmSync(testDataPath, { recursive: true, force: true });
    }
    fs.mkdirSync(testDataPath, { recursive: true });

    progressTracker = new ProgressTracker('test-user', testDataPath);
  });

  afterEach(() => {
    // 清理测试数据
    if (fs.existsSync(testDataPath)) {
      fs.rmSync(testDataPath, { recursive: true, force: true });
    }
  });

  describe('书签功能', () => {
    it('应该能够添加书签', () => {
      progressTracker.addBookmark('01-basics/01-installation');
      const bookmarks = progressTracker.getBookmarks();
      
      expect(bookmarks).toContain('01-basics/01-installation');
      expect(bookmarks.length).toBe(1);
    });

    it('应该能够移除书签', () => {
      progressTracker.addBookmark('01-basics/01-installation');
      progressTracker.addBookmark('01-basics/02-first-project');
      
      progressTracker.removeBookmark('01-basics/01-installation');
      const bookmarks = progressTracker.getBookmarks();
      
      expect(bookmarks).not.toContain('01-basics/01-installation');
      expect(bookmarks).toContain('01-basics/02-first-project');
      expect(bookmarks.length).toBe(1);
    });

    it('添加书签应该是幂等的', () => {
      progressTracker.addBookmark('01-basics/01-installation');
      progressTracker.addBookmark('01-basics/01-installation');
      progressTracker.addBookmark('01-basics/01-installation');
      
      const bookmarks = progressTracker.getBookmarks();
      expect(bookmarks.length).toBe(1);
    });

    it('移除不存在的书签不应该报错', () => {
      expect(() => {
        progressTracker.removeBookmark('non-existent');
      }).not.toThrow();
    });

    it('应该返回书签的副本，避免外部修改', () => {
      progressTracker.addBookmark('01-basics/01-installation');
      
      const bookmarks1 = progressTracker.getBookmarks();
      bookmarks1.push('external-modification');
      
      const bookmarks2 = progressTracker.getBookmarks();
      expect(bookmarks2.length).toBe(1);
      expect(bookmarks2).not.toContain('external-modification');
    });
  });

  describe('学习笔记导出功能', () => {
    it('应该能够导出基本的学习笔记', () => {
      // 模拟一些学习进度
      progressTracker.markLessonComplete('01-basics', '01-installation');
      progressTracker.recordStudyTime('01-basics', 60);
      progressTracker.updateModuleProgress('01-basics', 8);

      // 创建模拟的 ContentManager
      const mockContentManager = {
        getLessonContent: jest.fn().mockReturnValue({
          id: '01-installation',
          moduleId: '01-basics',
          title: 'Webpack 安装和初始化',
          content: '本课程介绍如何安装和初始化 webpack 项目。',
          order: 1,
          estimatedMinutes: 30,
          keyPoints: ['npm 安装 webpack', 'webpack-cli 的作用'],
          examples: [],
          relatedDocs: []
        })
      };

      const notes = progressTracker.exportNotes(mockContentManager);

      expect(notes).toContain('我的 Webpack 学习笔记');
      expect(notes).toContain('学习进度概览');
      expect(notes).toContain('已完成的课程');
      expect(notes).toContain('Webpack 安装和初始化');
      expect(notes).toContain('npm 安装 webpack');
    });

    it('导出的笔记应该包含书签内容', () => {
      progressTracker.addBookmark('01-basics/01-installation');

      const mockContentManager = {
        getLessonContent: jest.fn().mockReturnValue({
          id: '01-installation',
          moduleId: '01-basics',
          title: 'Webpack 安装和初始化',
          content: '本课程介绍如何安装和初始化 webpack 项目。',
          order: 1,
          estimatedMinutes: 30,
          keyPoints: ['npm 安装 webpack'],
          examples: [],
          relatedDocs: [{ title: 'Webpack 官方文档', url: 'https://webpack.js.org', type: 'official' as const }]
        })
      };

      const notes = progressTracker.exportNotes(mockContentManager);

      expect(notes).toContain('我的书签');
      expect(notes).toContain('Webpack 安装和初始化');
      expect(notes).toContain('Webpack 官方文档');
    });

    it('当没有学习进度时应该导出基本结构', () => {
      const mockContentManager = {
        getLessonContent: jest.fn()
      };

      const notes = progressTracker.exportNotes(mockContentManager);

      expect(notes).toContain('我的 Webpack 学习笔记');
      expect(notes).toContain('学习进度概览');
      expect(notes).toContain('已完成课程数：0');
    });
  });

  describe('个性化学习计划生成', () => {
    const createMockModules = (): Module[] => [
      {
        id: '01-basics',
        name: '基础模块',
        description: 'Webpack 基础',
        order: 1,
        estimatedHours: 8,
        lessons: [
          {
            id: '01-installation',
            moduleId: '01-basics',
            title: '安装',
            content: '',
            order: 1,
            estimatedMinutes: 60,
            keyPoints: [],
            examples: [],
            relatedDocs: []
          },
          {
            id: '02-first-project',
            moduleId: '01-basics',
            title: '第一个项目',
            content: '',
            order: 2,
            estimatedMinutes: 90,
            keyPoints: [],
            examples: [],
            relatedDocs: []
          }
        ],
        prerequisites: [],
        learningObjectives: []
      },
      {
        id: '02-configuration',
        name: '配置模块',
        description: 'Webpack 配置',
        order: 2,
        estimatedHours: 12,
        lessons: [
          {
            id: '01-config',
            moduleId: '02-configuration',
            title: '配置文件',
            content: '',
            order: 1,
            estimatedMinutes: 120,
            keyPoints: [],
            examples: [],
            relatedDocs: []
          }
        ],
        prerequisites: ['01-basics'],
        learningObjectives: []
      }
    ];

    it('应该能够生成学习计划', () => {
      const modules = createMockModules();
      const plan = progressTracker.generateLearningPlan(modules, 19);

      expect(plan.targetHours).toBe(19);
      expect(plan.dailyHours).toBeGreaterThanOrEqual(1);
      expect(plan.dailyHours).toBeLessThanOrEqual(4);
      expect(plan.totalDays).toBeGreaterThan(0);
    });

    it('目标时间应该在合理范围内（90%-110%）', () => {
      const modules = createMockModules();
      const totalHours = 20;

      // 太短应该报错
      expect(() => {
        progressTracker.generateLearningPlan(modules, totalHours * 0.8);
      }).toThrow();

      // 太长应该报错
      expect(() => {
        progressTracker.generateLearningPlan(modules, totalHours * 1.2);
      }).toThrow();

      // 合理范围应该成功
      expect(() => {
        progressTracker.generateLearningPlan(modules, totalHours * 0.95);
      }).not.toThrow();
    });

    it('每日学习时间应该在 1-4 小时之间', () => {
      const modules = createMockModules();
      const plan = progressTracker.generateLearningPlan(modules, 19);

      expect(plan.dailyHours).toBeGreaterThanOrEqual(1);
      expect(plan.dailyHours).toBeLessThanOrEqual(4);
    });
  });
});

describe('LearningPlanGenerator', () => {
  let generator: LearningPlanGenerator;

  beforeEach(() => {
    generator = new LearningPlanGenerator();
  });

  it('应该拒绝负数或零的目标时间', () => {
    const modules: Module[] = [{
      id: '01-basics',
      name: '基础',
      description: '',
      order: 1,
      estimatedHours: 10,
      lessons: [],
      prerequisites: [],
      learningObjectives: []
    }];

    expect(() => generator.generateLearningPlan(modules, 0)).toThrow();
    expect(() => generator.generateLearningPlan(modules, -5)).toThrow();
  });

  it('应该拒绝空模块列表', () => {
    expect(() => generator.generateLearningPlan([], 10)).toThrow();
  });

  it('应该按模块顺序生成计划', () => {
    const modules: Module[] = [
      {
        id: '02-advanced',
        name: '高级',
        description: '',
        order: 2,
        estimatedHours: 5,
        lessons: [{
          id: '01-lesson',
          moduleId: '02-advanced',
          title: '课程',
          content: '',
          order: 1,
          estimatedMinutes: 300,
          keyPoints: [],
          examples: [],
          relatedDocs: []
        }],
        prerequisites: ['01-basics'],
        learningObjectives: []
      },
      {
        id: '01-basics',
        name: '基础',
        description: '',
        order: 1,
        estimatedHours: 5,
        lessons: [{
          id: '01-lesson',
          moduleId: '01-basics',
          title: '课程',
          content: '',
          order: 1,
          estimatedMinutes: 300,
          keyPoints: [],
          examples: [],
          relatedDocs: []
        }],
        prerequisites: [],
        learningObjectives: []
      }
    ];

    const plan = generator.generateLearningPlan(modules, 9.5);

    // 第一个计划项应该是 01-basics（order 较小）
    expect(plan.schedule[0].moduleId).toBe('01-basics');
  });
});
