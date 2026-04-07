/**
 * ResourceManager - 资源管理组件
 * 
 * 负责管理参考资料和外部链接
 */

import * as fs from 'fs';
import * as path from 'path';
import { Resource, DocLink, FAQ, ConfigTemplate, CodeFile } from '../types';

export class ResourceManager {
  private resourcesPath: string;

  constructor(basePath: string = path.join(process.cwd(), 'resources')) {
    this.resourcesPath = basePath;
  }

  /**
   * 获取推荐资源列表
   */
  getRecommendedResources(): Resource[] {
    const learningResourcesPath = path.join(this.resourcesPath, 'learning-resources.md');
    
    if (!fs.existsSync(learningResourcesPath)) {
      return [];
    }

    try {
      const content = fs.readFileSync(learningResourcesPath, 'utf-8');
      return this.parseResources(content);
    } catch (error) {
      throw new Error(
        `Failed to load learning resources: ${error instanceof Error ? error.message : String(error)}`
      );
    }
  }

  /**
   * 获取官方文档链接
   */
  getOfficialDocs(topic?: string): DocLink[] {
    const officialDocsPath = path.join(this.resourcesPath, 'official-docs.md');
    
    if (!fs.existsSync(officialDocsPath)) {
      return [];
    }

    try {
      const content = fs.readFileSync(officialDocsPath, 'utf-8');
      const allDocs = this.parseDocLinks(content);
      
      // 如果指定了主题，过滤相关文档
      if (topic) {
        const lowerTopic = topic.toLowerCase();
        return allDocs.filter(doc => 
          doc.title.toLowerCase().includes(lowerTopic) ||
          doc.url.toLowerCase().includes(lowerTopic)
        );
      }
      
      return allDocs;
    } catch (error) {
      throw new Error(
        `Failed to load official docs: ${error instanceof Error ? error.message : String(error)}`
      );
    }
  }

  /**
   * 获取常见问题解答
   */
  getFAQ(): FAQ[] {
    const faqPath = path.join(this.resourcesPath, 'faq.md');
    
    if (!fs.existsSync(faqPath)) {
      return [];
    }

    try {
      const content = fs.readFileSync(faqPath, 'utf-8');
      return this.parseFAQ(content);
    } catch (error) {
      throw new Error(
        `Failed to load FAQ: ${error instanceof Error ? error.message : String(error)}`
      );
    }
  }

  /**
   * 获取配置模板
   */
  getConfigTemplates(): ConfigTemplate[] {
    const templatesPath = path.join(this.resourcesPath, 'config-templates');
    
    if (!fs.existsSync(templatesPath)) {
      return [];
    }

    try {
      const entries = fs.readdirSync(templatesPath, { withFileTypes: true });
      const templates: ConfigTemplate[] = [];

      for (const entry of entries) {
        if (entry.isDirectory()) {
          try {
            const template = this.loadConfigTemplate(entry.name, templatesPath);
            templates.push(template);
          } catch (error) {
            console.warn(`Failed to load template ${entry.name}:`, error);
          }
        }
      }

      return templates;
    } catch (error) {
      throw new Error(
        `Failed to load config templates: ${error instanceof Error ? error.message : String(error)}`
      );
    }
  }

  /**
   * 解析资源列表
   */
  private parseResources(content: string): Resource[] {
    const resources: Resource[] = [];
    const lines = content.split('\n');
    let currentCategory = '';
    let resourceId = 1;

    for (let i = 0; i < lines.length; i++) {
      const line = lines[i].trim();

      // 检测分类标题
      if (line.startsWith('##')) {
        currentCategory = line.replace(/^##\s+/, '').trim();
        continue;
      }

      // 解析资源项（支持多种格式）
      // 格式1: - [标题](链接) - 描述 (作者)
      // 格式2: - [标题](链接) - 描述
      // 格式3: - **[标题](链接)** - 描述
      const resourceMatch = line.match(/^[-*]\s+\*?\*?\[(.+?)\]\((.+?)\)\*?\*?\s*-\s*(.+?)(?:\s*\((.+?)\))?$/);
      
      if (resourceMatch) {
        const [, title, url, description, author] = resourceMatch;
        
        // 根据分类或URL判断资源类型
        let type: 'book' | 'video' | 'blog' | 'doc' | 'tool' = 'doc';
        const lowerCategory = currentCategory.toLowerCase();
        const lowerUrl = url.toLowerCase();
        
        if (lowerCategory.includes('书籍') || lowerCategory.includes('book')) {
          type = 'book';
        } else if (lowerCategory.includes('视频') || lowerCategory.includes('video') || lowerUrl.includes('youtube') || lowerUrl.includes('bilibili')) {
          type = 'video';
        } else if (lowerCategory.includes('博客') || lowerCategory.includes('blog')) {
          type = 'blog';
        } else if (lowerCategory.includes('工具') || lowerCategory.includes('tool')) {
          type = 'tool';
        }

        // 判断是否推荐（通常在标题或描述中包含"推荐"字样）
        const recommended = title.includes('推荐') || 
                          description.includes('推荐') || 
                          line.includes('⭐') ||
                          line.includes('★');

        // 提取标签
        const tags: string[] = [];
        if (currentCategory) {
          tags.push(currentCategory);
        }

        resources.push({
          id: `resource-${resourceId++}`,
          type,
          title: title.replace(/[⭐★]/g, '').trim(),
          description: description.trim(),
          url: url.trim(),
          author: author?.trim(),
          tags,
          recommended
        });
      }
    }

    return resources;
  }

  /**
   * 解析文档链接
   */
  private parseDocLinks(content: string): DocLink[] {
    const docs: DocLink[] = [];
    const lines = content.split('\n');

    for (const line of lines) {
      // 匹配 Markdown 链接格式: [标题](链接)
      const linkMatch = line.match(/\[(.+?)\]\((.+?)\)/g);
      
      if (linkMatch) {
        for (const match of linkMatch) {
          const parts = match.match(/\[(.+?)\]\((.+?)\)/);
          if (parts) {
            const [, title, url] = parts;
            
            // 判断是否为官方文档
            const isOfficial = url.includes('webpack.js.org') || 
                             url.includes('webpack.docschina.org');
            
            docs.push({
              title: title.trim(),
              url: url.trim(),
              type: isOfficial ? 'official' : 'community'
            });
          }
        }
      }
    }

    return docs;
  }

  /**
   * 解析常见问题
   */
  private parseFAQ(content: string): FAQ[] {
    const faqs: FAQ[] = [];
    const lines = content.split('\n');
    let currentCategory = '';
    let currentQuestion = '';
    let currentAnswer: string[] = [];
    let faqId = 1;
    let inAnswer = false;

    for (let i = 0; i < lines.length; i++) {
      const line = lines[i].trim();

      // 检测分类标题
      if (line.startsWith('##') && !line.startsWith('###')) {
        // 保存之前的FAQ
        if (currentQuestion && currentAnswer.length > 0) {
          faqs.push(this.createFAQ(faqId++, currentQuestion, currentAnswer, currentCategory));
          currentQuestion = '';
          currentAnswer = [];
          inAnswer = false;
        }
        
        currentCategory = line.replace(/^##\s+/, '').trim();
        continue;
      }

      // 检测问题标题（### 开头）
      if (line.startsWith('###')) {
        // 保存之前的FAQ
        if (currentQuestion && currentAnswer.length > 0) {
          faqs.push(this.createFAQ(faqId++, currentQuestion, currentAnswer, currentCategory));
          currentAnswer = [];
        }
        
        currentQuestion = line.replace(/^###\s+/, '').trim();
        inAnswer = true;
        continue;
      }

      // 收集答案内容
      if (inAnswer && currentQuestion) {
        if (line) {
          currentAnswer.push(line);
        }
      }
    }

    // 保存最后一个FAQ
    if (currentQuestion && currentAnswer.length > 0) {
      faqs.push(this.createFAQ(faqId++, currentQuestion, currentAnswer, currentCategory));
    }

    return faqs;
  }

  /**
   * 创建FAQ对象
   */
  private createFAQ(id: number, question: string, answerLines: string[], category: string): FAQ {
    const answer = answerLines.join('\n').trim();
    
    // 提取标签
    const tags: string[] = [];
    if (category) {
      tags.push(category);
    }
    
    // 从问题中提取关键词作为标签
    const keywords = ['webpack', 'loader', 'plugin', 'config', 'error', 'performance', 'optimization'];
    const lowerQuestion = question.toLowerCase();
    for (const keyword of keywords) {
      if (lowerQuestion.includes(keyword)) {
        tags.push(keyword);
      }
    }

    return {
      id: `faq-${id}`,
      question,
      answer,
      category: category || '其他',
      tags
    };
  }

  /**
   * 加载配置模板
   */
  private loadConfigTemplate(templateId: string, templatesPath: string): ConfigTemplate {
    const templatePath = path.join(templatesPath, templateId);
    const readmePath = path.join(templatePath, 'README.md');
    
    let name = templateId;
    let description = '';
    let usage = '';
    
    // 读取README获取模板信息
    if (fs.existsSync(readmePath)) {
      const readme = fs.readFileSync(readmePath, 'utf-8');
      name = this.extractTemplateName(readme, templateId);
      description = this.extractTemplateDescription(readme);
      usage = this.extractTemplateUsage(readme);
    }

    // 加载配置文件
    const files = this.loadTemplateFiles(templatePath);

    // 从模板ID或描述中提取分类
    const category = this.extractTemplateCategory(templateId, description);

    return {
      id: templateId,
      name,
      description,
      category,
      files,
      usage
    };
  }

  /**
   * 加载模板文件
   */
  private loadTemplateFiles(templatePath: string): CodeFile[] {
    const files: CodeFile[] = [];
    const configFiles = ['webpack.config.js', 'webpack.config.ts', 'package.json', '.babelrc', 'tsconfig.json'];

    for (const filename of configFiles) {
      const filePath = path.join(templatePath, filename);
      if (fs.existsSync(filePath)) {
        files.push({
          path: filename,
          content: fs.readFileSync(filePath, 'utf-8'),
          language: this.getLanguageFromExtension(filename)
        });
      }
    }

    return files;
  }

  /**
   * 从文件扩展名获取语言类型
   */
  private getLanguageFromExtension(filename: string): string {
    const ext = path.extname(filename).toLowerCase();
    const languageMap: { [key: string]: string } = {
      '.js': 'javascript',
      '.ts': 'typescript',
      '.json': 'json',
      '.md': 'markdown',
      '.css': 'css',
      '.html': 'html',
      '.babelrc': 'json'
    };
    return languageMap[ext] || languageMap[filename] || 'text';
  }

  /**
   * 提取模板名称
   */
  private extractTemplateName(content: string, defaultName: string): string {
    const match = content.match(/^#\s+(.+)$/m);
    return match ? match[1].trim() : defaultName;
  }

  /**
   * 提取模板描述
   */
  private extractTemplateDescription(content: string): string {
    const lines = content.split('\n');
    let foundTitle = false;

    for (const line of lines) {
      if (line.startsWith('#')) {
        foundTitle = true;
        continue;
      }
      if (foundTitle && line.trim()) {
        return line.trim();
      }
    }

    return '暂无描述';
  }

  /**
   * 提取模板使用说明
   */
  private extractTemplateUsage(content: string): string {
    const usageMatch = content.match(/##\s*使用说明[\s\S]*?(?=##|$)/i);
    if (usageMatch) {
      return usageMatch[0].replace(/##\s*使用说明\s*/i, '').trim();
    }
    return '';
  }

  /**
   * 提取模板分类
   */
  private extractTemplateCategory(templateId: string, description: string): string {
    const lowerTemplateId = templateId.toLowerCase();
    const lowerDescription = description.toLowerCase();

    if (lowerTemplateId.includes('react') || lowerDescription.includes('react')) {
      return 'React';
    } else if (lowerTemplateId.includes('vue') || lowerDescription.includes('vue')) {
      return 'Vue';
    } else if (lowerTemplateId.includes('typescript') || lowerTemplateId.includes('ts')) {
      return 'TypeScript';
    } else if (lowerTemplateId.includes('multi') || lowerDescription.includes('多页面')) {
      return '多页面应用';
    } else if (lowerTemplateId.includes('optimization') || lowerDescription.includes('优化')) {
      return '性能优化';
    } else if (lowerTemplateId.includes('basic') || lowerDescription.includes('基础')) {
      return '基础配置';
    }

    return '通用';
  }
}
