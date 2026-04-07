/**
 * ResourceManager 单元测试
 */

import * as fs from 'fs';
import * as path from 'path';
import { ResourceManager } from './ResourceManager';
import { Resource, DocLink, FAQ, ConfigTemplate } from '../types';

describe('ResourceManager', () => {
  const testResourcesPath = path.join(__dirname, '../../test-data/resources');
  let resourceManager: ResourceManager;

  beforeAll(() => {
    // 创建测试数据目录
    if (!fs.existsSync(testResourcesPath)) {
      fs.mkdirSync(testResourcesPath, { recursive: true });
    }
  });

  beforeEach(() => {
    resourceManager = new ResourceManager(testResourcesPath);
  });

  afterAll(() => {
    // 清理测试数据
    if (fs.existsSync(testResourcesPath)) {
      fs.rmSync(testResourcesPath, { recursive: true, force: true });
    }
  });

  describe('getRecommendedResources', () => {
    it('应该返回空数组当文件不存在时', () => {
      const resources = resourceManager.getRecommendedResources();
      expect(resources).toEqual([]);
    });

    it('应该解析学习资源列表', () => {
      const content = `# 学习资源

## 书籍

- [深入浅出Webpack](https://example.com/book1) - 全面介绍webpack的书籍 (作者A)
- [Webpack实战](https://example.com/book2) - 实战指南

## 视频

- [Webpack入门教程](https://youtube.com/video1) - 适合初学者 ⭐
`;

      fs.writeFileSync(
        path.join(testResourcesPath, 'learning-resources.md'),
        content,
        'utf-8'
      );

      const resources = resourceManager.getRecommendedResources();
      
      expect(resources.length).toBeGreaterThan(0);
      expect(resources[0]).toMatchObject({
        type: 'book',
        title: expect.any(String),
        url: expect.any(String),
        description: expect.any(String)
      });

      // 检查推荐标记
      const recommendedResource = resources.find(r => r.title.includes('入门教程'));
      expect(recommendedResource?.recommended).toBe(true);
    });

    it('应该正确分类不同类型的资源', () => {
      const content = `# 学习资源

## 书籍
- [书籍标题](https://example.com/book) - 描述

## 视频
- [视频标题](https://youtube.com/video) - 描述

## 博客
- [博客标题](https://blog.example.com) - 描述

## 工具
- [工具标题](https://tool.example.com) - 描述
`;

      fs.writeFileSync(
        path.join(testResourcesPath, 'learning-resources.md'),
        content,
        'utf-8'
      );

      const resources = resourceManager.getRecommendedResources();
      
      expect(resources.some(r => r.type === 'book')).toBe(true);
      expect(resources.some(r => r.type === 'video')).toBe(true);
      expect(resources.some(r => r.type === 'blog')).toBe(true);
      expect(resources.some(r => r.type === 'tool')).toBe(true);
    });
  });

  describe('getOfficialDocs', () => {
    it('应该返回空数组当文件不存在时', () => {
      const docs = resourceManager.getOfficialDocs();
      expect(docs).toEqual([]);
    });

    it('应该解析官方文档链接', () => {
      const content = `# 官方文档

- [Webpack官方文档](https://webpack.js.org/concepts/)
- [配置指南](https://webpack.js.org/configuration/)
- [社区教程](https://example.com/tutorial)
`;

      fs.writeFileSync(
        path.join(testResourcesPath, 'official-docs.md'),
        content,
        'utf-8'
      );

      const docs = resourceManager.getOfficialDocs();
      
      expect(docs.length).toBeGreaterThan(0);
      
      // 检查官方文档标记
      const officialDoc = docs.find(d => d.url.includes('webpack.js.org'));
      expect(officialDoc?.type).toBe('official');
      
      // 检查社区文档标记
      const communityDoc = docs.find(d => d.url.includes('example.com'));
      expect(communityDoc?.type).toBe('community');
    });

    it('应该根据主题过滤文档', () => {
      const content = `# 官方文档

- [配置指南](https://webpack.js.org/configuration/)
- [Loader文档](https://webpack.js.org/loaders/)
- [Plugin文档](https://webpack.js.org/plugins/)
`;

      fs.writeFileSync(
        path.join(testResourcesPath, 'official-docs.md'),
        content,
        'utf-8'
      );

      const loaderDocs = resourceManager.getOfficialDocs('loader');
      expect(loaderDocs.length).toBeGreaterThan(0);
      expect(loaderDocs.every(d => 
        d.title.toLowerCase().includes('loader') || 
        d.url.toLowerCase().includes('loader')
      )).toBe(true);
    });
  });

  describe('getFAQ', () => {
    it('应该返回空数组当文件不存在时', () => {
      const faqs = resourceManager.getFAQ();
      expect(faqs).toEqual([]);
    });

    it('应该解析常见问题', () => {
      const content = `# 常见问题

## 配置问题

### 如何配置多入口？

使用对象形式配置entry：

\`\`\`javascript
entry: {
  app: './src/app.js',
  admin: './src/admin.js'
}
\`\`\`

### 如何配置output？

配置output.path和output.filename。

## 性能问题

### 如何优化打包速度？

使用缓存和并行构建。
`;

      fs.writeFileSync(
        path.join(testResourcesPath, 'faq.md'),
        content,
        'utf-8'
      );

      const faqs = resourceManager.getFAQ();
      
      expect(faqs.length).toBeGreaterThan(0);
      expect(faqs[0]).toMatchObject({
        id: expect.any(String),
        question: expect.any(String),
        answer: expect.any(String),
        category: expect.any(String),
        tags: expect.any(Array)
      });

      // 检查分类
      const configFaq = faqs.find(f => f.category === '配置问题');
      expect(configFaq).toBeDefined();
    });

    it('应该提取相关标签', () => {
      const content = `# 常见问题

## 配置问题

### webpack配置文件如何编写？

详细说明...
`;

      fs.writeFileSync(
        path.join(testResourcesPath, 'faq.md'),
        content,
        'utf-8'
      );

      const faqs = resourceManager.getFAQ();
      
      expect(faqs[0].tags).toContain('配置问题');
      expect(faqs[0].tags.some(tag => 
        ['webpack', 'config'].includes(tag)
      )).toBe(true);
    });
  });

  describe('getConfigTemplates', () => {
    it('应该返回空数组当目录不存在时', () => {
      const templates = resourceManager.getConfigTemplates();
      expect(templates).toEqual([]);
    });

    it('应该加载配置模板', () => {
      const templatesDir = path.join(testResourcesPath, 'config-templates');
      const templateDir = path.join(templatesDir, 'react-template');
      
      fs.mkdirSync(templateDir, { recursive: true });
      
      // 创建README
      fs.writeFileSync(
        path.join(templateDir, 'README.md'),
        `# React项目配置

这是一个React项目的webpack配置模板。

## 使用说明

1. 安装依赖
2. 运行构建
`,
        'utf-8'
      );

      // 创建配置文件
      fs.writeFileSync(
        path.join(templateDir, 'webpack.config.js'),
        `module.exports = {
  entry: './src/index.js',
  output: {
    filename: 'bundle.js'
  }
};`,
        'utf-8'
      );

      const templates = resourceManager.getConfigTemplates();
      
      expect(templates.length).toBeGreaterThan(0);
      expect(templates[0]).toMatchObject({
        id: 'react-template',
        name: expect.any(String),
        description: expect.any(String),
        category: expect.any(String),
        files: expect.any(Array),
        usage: expect.any(String)
      });

      expect(templates[0].files.length).toBeGreaterThan(0);
      expect(templates[0].files[0]).toMatchObject({
        path: expect.any(String),
        content: expect.any(String),
        language: expect.any(String)
      });
    });

    it('应该正确分类模板', () => {
      const templatesDir = path.join(testResourcesPath, 'config-templates');
      
      const templateTypes = [
        { id: 'react-app', name: 'React应用' },
        { id: 'vue-project', name: 'Vue项目' },
        { id: 'typescript-config', name: 'TypeScript配置' }
      ];

      for (const template of templateTypes) {
        const templateDir = path.join(templatesDir, template.id);
        fs.mkdirSync(templateDir, { recursive: true });
        
        fs.writeFileSync(
          path.join(templateDir, 'README.md'),
          `# ${template.name}\n\n描述`,
          'utf-8'
        );
        
        fs.writeFileSync(
          path.join(templateDir, 'webpack.config.js'),
          'module.exports = {};',
          'utf-8'
        );
      }

      const templates = resourceManager.getConfigTemplates();
      
      expect(templates.some(t => t.category === 'React')).toBe(true);
      expect(templates.some(t => t.category === 'Vue')).toBe(true);
      expect(templates.some(t => t.category === 'TypeScript')).toBe(true);
    });
  });

  describe('错误处理', () => {
    it('应该处理空文件', () => {
      // 创建一个空文件
      const emptyPath = path.join(testResourcesPath, 'learning-resources.md');
      fs.writeFileSync(emptyPath, '', 'utf-8');

      const resources = resourceManager.getRecommendedResources();
      expect(resources).toEqual([]);
    });

    it('应该处理格式错误的文件', () => {
      const invalidPath = path.join(testResourcesPath, 'learning-resources.md');
      fs.writeFileSync(invalidPath, 'Invalid content without proper format', 'utf-8');

      // 应该返回空数组而不是崩溃
      const resources = resourceManager.getRecommendedResources();
      expect(Array.isArray(resources)).toBe(true);
    });
  });
});
