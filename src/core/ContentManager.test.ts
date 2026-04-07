/**
 * ContentManager 单元测试
 */

import { ContentManager } from './ContentManager';
import * as path from 'path';

describe('ContentManager', () => {
  let contentManager: ContentManager;

  beforeEach(() => {
    const modulesPath = path.join(__dirname, '../../modules');
    contentManager = new ContentManager(modulesPath);
  });

  describe('getModules', () => {
    it('应该返回模块列表', () => {
      const modules = contentManager.getModules();
      expect(Array.isArray(modules)).toBe(true);
    });

    it('应该按顺序排序模块', () => {
      const modules = contentManager.getModules();
      if (modules.length > 1) {
        for (let i = 1; i < modules.length; i++) {
          expect(modules[i].order).toBeGreaterThanOrEqual(modules[i - 1].order);
        }
      }
    });

    it('每个模块应该包含必需的字段', () => {
      const modules = contentManager.getModules();
      modules.forEach((module: any) => {
        expect(module).toHaveProperty('id');
        expect(module).toHaveProperty('name');
        expect(module).toHaveProperty('description');
        expect(module).toHaveProperty('order');
        expect(module).toHaveProperty('estimatedHours');
        expect(module).toHaveProperty('lessons');
        expect(module).toHaveProperty('prerequisites');
        expect(module).toHaveProperty('learningObjectives');
      });
    });
  });

  describe('getModuleContent', () => {
    it('应该返回指定模块的完整内容', () => {
      const modules = contentManager.getModules();
      if (modules.length > 0) {
        const moduleId = modules[0].id;
        const moduleContent = contentManager.getModuleContent(moduleId);
        
        expect(moduleContent).toHaveProperty('id', moduleId);
        expect(moduleContent).toHaveProperty('lessons');
        expect(Array.isArray(moduleContent.lessons)).toBe(true);
      }
    });

    it('应该在模块不存在时抛出错误', () => {
      expect(() => {
        contentManager.getModuleContent('non-existent-module');
      }).toThrow('Module not found');
    });
  });

  describe('getLessonContent', () => {
    it('应该返回指定课程的内容', () => {
      const modules = contentManager.getModules();
      if (modules.length > 0) {
        const moduleContent = contentManager.getModuleContent(modules[0].id);
        if (moduleContent.lessons.length > 0) {
          const lesson = moduleContent.lessons[0];
          const lessonContent = contentManager.getLessonContent(
            lesson.moduleId,
            lesson.id
          );
          
          expect(lessonContent).toHaveProperty('id');
          expect(lessonContent).toHaveProperty('title');
          expect(lessonContent).toHaveProperty('content');
          expect(lessonContent).toHaveProperty('keyPoints');
          expect(lessonContent).toHaveProperty('examples');
          expect(lessonContent).toHaveProperty('relatedDocs');
        }
      }
    });

    it('应该在课程不存在时抛出错误', () => {
      const modules = contentManager.getModules();
      if (modules.length > 0) {
        expect(() => {
          contentManager.getLessonContent(modules[0].id, 'non-existent-lesson');
        }).toThrow('Lesson not found');
      }
    });

    it('应该在模块不存在时抛出错误', () => {
      expect(() => {
        contentManager.getLessonContent('non-existent-module', 'some-lesson');
      }).toThrow('Module not found');
    });
  });

  describe('searchContent', () => {
    it('应该返回搜索结果数组', () => {
      const results = contentManager.searchContent('webpack');
      expect(Array.isArray(results)).toBe(true);
    });

    it('应该在空查询时返回空数组', () => {
      const results = contentManager.searchContent('');
      expect(results).toEqual([]);
    });

    it('搜索结果应该包含必需的字段', () => {
      const results = contentManager.searchContent('webpack');
      results.forEach((result: any) => {
        expect(result).toHaveProperty('type');
        expect(result).toHaveProperty('id');
        expect(result).toHaveProperty('title');
        expect(result).toHaveProperty('description');
        expect(result).toHaveProperty('relevance');
        expect(result.relevance).toBeGreaterThanOrEqual(0);
        expect(result.relevance).toBeLessThanOrEqual(1);
      });
    });

    it('搜索结果应该按相关性排序', () => {
      const results = contentManager.searchContent('webpack');
      if (results.length > 1) {
        for (let i = 1; i < results.length; i++) {
          expect(results[i].relevance).toBeLessThanOrEqual(results[i - 1].relevance);
        }
      }
    });

    it('搜索结果应该匹配查询字符串（不区分大小写）', () => {
      const query = 'webpack';
      const results = contentManager.searchContent(query);
      
      results.forEach((result: any) => {
        const lowerQuery = query.toLowerCase();
        const titleMatch = result.title.toLowerCase().includes(lowerQuery);
        const descMatch = result.description.toLowerCase().includes(lowerQuery);
        
        expect(titleMatch || descMatch).toBe(true);
      });
    });
  });
});
