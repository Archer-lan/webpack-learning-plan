/**
 * ContentManager - 内容管理组件
 * 
 * 负责学习内容的组织和访问
 */

import * as fs from 'fs';
import * as path from 'path';
import {
  Module,
  ModuleContent,
  LessonContent,
  SearchResult,
  Lesson,
  Example,
  DocLink,
  CodeFile
} from '../types';

export class ContentManager {
  private basePath: string;

  constructor(basePath: string = path.join(process.cwd(), 'modules')) {
    this.basePath = basePath;
  }

  getModules(): Module[] {
    try {
      if (!fs.existsSync(this.basePath)) {
        return [];
      }

      const entries = fs.readdirSync(this.basePath, { withFileTypes: true });
      const modules: Module[] = [];

      for (const entry of entries) {
        if (entry.isDirectory()) {
          const moduleId = entry.name;
          const modulePath = path.join(this.basePath, moduleId);
          const readmePath = path.join(modulePath, 'README.md');

          if (fs.existsSync(readmePath)) {
            try {
              const module = this.loadModuleMetadata(moduleId, modulePath);
              modules.push(module);
            } catch (error) {
              console.warn(`Failed to load module ${moduleId}:`, error);
            }
          }
        }
      }

      return modules.sort((a, b) => a.order - b.order);
    } catch (error) {
      throw new Error(`Failed to get modules: ${error instanceof Error ? error.message : String(error)}`);
    }
  }

  getModuleContent(moduleId: string): ModuleContent {
    const modulePath = path.join(this.basePath, moduleId);

    if (!fs.existsSync(modulePath)) {
      throw new Error(`Module not found: ${moduleId}`);
    }

    const readmePath = path.join(modulePath, 'README.md');
    if (!fs.existsSync(readmePath)) {
      throw new Error(`Module README not found: ${moduleId}`);
    }

    const module = this.loadModuleMetadata(moduleId, modulePath);

    const lessonsPath = path.join(modulePath, 'lessons');
    if (fs.existsSync(lessonsPath)) {
      const lessonFiles = fs.readdirSync(lessonsPath)
        .filter(file => file.endsWith('.md'))
        .sort();

      module.lessons = lessonFiles.map(file => {
        const lessonId = path.basename(file, '.md');
        return this.loadLesson(moduleId, lessonId, modulePath);
      });
    }

    return module;
  }

  getLessonContent(moduleId: string, lessonId: string): LessonContent {
    const modulePath = path.join(this.basePath, moduleId);

    if (!fs.existsSync(modulePath)) {
      throw new Error(`Module not found: ${moduleId}`);
    }

    return this.loadLesson(moduleId, lessonId, modulePath);
  }

  searchContent(query: string): SearchResult[] {
    if (!query || query.trim() === '') {
      return [];
    }

    const results: SearchResult[] = [];
    const lowerQuery = query.toLowerCase();

    try {
      const modules = this.getModules();

      for (const module of modules) {
        const moduleContent = this.getModuleContent(module.id);

        for (const lesson of moduleContent.lessons) {
          const titleMatch = lesson.title.toLowerCase().includes(lowerQuery);
          const contentMatch = lesson.content.toLowerCase().includes(lowerQuery);
          const keyPointsMatch = lesson.keyPoints.some(kp => 
            kp.toLowerCase().includes(lowerQuery)
          );

          if (titleMatch || contentMatch || keyPointsMatch) {
            let relevance = 0;
            if (titleMatch) relevance += 0.5;
            if (contentMatch) relevance += 0.3;
            if (keyPointsMatch) relevance += 0.2;

            results.push({
              type: 'lesson',
              id: lesson.id,
              title: lesson.title,
              description: this.extractDescription(lesson.content),
              moduleId: module.id,
              relevance: Math.min(relevance, 1.0)
            });
          }
        }
      }

      return results.sort((a, b) => b.relevance - a.relevance);
    } catch (error) {
      throw new Error(`Search failed: ${error instanceof Error ? error.message : String(error)}`);
    }
  }

  private loadModuleMetadata(moduleId: string, modulePath: string): Module {
    const readmePath = path.join(modulePath, 'README.md');
    const readmeContent = fs.readFileSync(readmePath, 'utf-8');

    const module: Module = {
      id: moduleId,
      name: this.extractModuleName(readmeContent, moduleId),
      description: this.extractModuleDescription(readmeContent),
      order: this.extractModuleOrder(moduleId),
      estimatedHours: this.extractEstimatedHours(readmeContent),
      lessons: [],
      prerequisites: this.extractPrerequisites(readmeContent),
      learningObjectives: this.extractLearningObjectives(readmeContent)
    };

    return module;
  }

  private loadLesson(moduleId: string, lessonId: string, modulePath: string): Lesson {
    const lessonPath = path.join(modulePath, 'lessons', `${lessonId}.md`);

    if (!fs.existsSync(lessonPath)) {
      throw new Error(`Lesson not found: ${moduleId}/${lessonId}`);
    }

    const content = fs.readFileSync(lessonPath, 'utf-8');
    const orderMatch = lessonId.match(/^(\d+)/);
    const order = orderMatch ? parseInt(orderMatch[1], 10) : 0;

    const lesson: Lesson = {
      id: lessonId,
      moduleId: moduleId,
      title: this.extractLessonTitle(content, lessonId),
      content: content,
      order: order,
      estimatedMinutes: this.extractEstimatedMinutes(content),
      keyPoints: this.extractKeyPoints(content),
      examples: this.loadExamples(moduleId, lessonId, modulePath),
      relatedDocs: this.extractRelatedDocs(content)
    };

    return lesson;
  }

  private loadExamples(moduleId: string, lessonId: string, modulePath: string): Example[] {
    const examplesPath = path.join(modulePath, 'examples');
    
    if (!fs.existsSync(examplesPath)) {
      return [];
    }

    const examples: Example[] = [];
    const entries = fs.readdirSync(examplesPath, { withFileTypes: true });

    for (const entry of entries) {
      if (entry.isDirectory() && entry.name.includes(lessonId)) {
        const examplePath = path.join(examplesPath, entry.name);
        try {
          const example = this.loadExample(entry.name, examplePath);
          examples.push(example);
        } catch (error) {
          console.warn(`Failed to load example ${entry.name}:`, error);
        }
      }
    }

    return examples;
  }

  private loadExample(exampleId: string, examplePath: string): Example {
    const readmePath = path.join(examplePath, 'README.md');
    const readme = fs.existsSync(readmePath) 
      ? fs.readFileSync(readmePath, 'utf-8') 
      : '';

    const packageJsonPath = path.join(examplePath, 'package.json');
    const dependencies: string[] = [];

    if (fs.existsSync(packageJsonPath)) {
      try {
        const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf-8'));
        if (packageJson.dependencies) {
          dependencies.push(...Object.keys(packageJson.dependencies));
        }
      } catch (error) {
        console.warn(`Failed to parse package.json for ${exampleId}`);
      }
    }

    return {
      id: exampleId,
      title: this.extractExampleTitle(readme, exampleId),
      description: this.extractExampleDescription(readme),
      files: this.loadExampleFiles(examplePath),
      runnable: fs.existsSync(packageJsonPath),
      dependencies: dependencies
    };
  }

  private loadExampleFiles(examplePath: string): CodeFile[] {
    const files: CodeFile[] = [];
    const mainFiles = ['index.js', 'webpack.config.js', 'src/index.js'];

    for (const file of mainFiles) {
      const filePath = path.join(examplePath, file);
      if (fs.existsSync(filePath)) {
        files.push({
          path: file,
          content: fs.readFileSync(filePath, 'utf-8'),
          language: this.getLanguageFromExtension(file)
        });
      }
    }

    return files;
  }

  private getLanguageFromExtension(filename: string): string {
    const ext = path.extname(filename).toLowerCase();
    const languageMap: { [key: string]: string } = {
      '.js': 'javascript',
      '.ts': 'typescript',
      '.json': 'json',
      '.md': 'markdown',
      '.css': 'css',
      '.html': 'html'
    };
    return languageMap[ext] || 'text';
  }

  private extractModuleName(content: string, moduleId: string): string {
    const match = content.match(/^#\s+(.+)$/m);
    return match ? match[1].trim() : moduleId;
  }

  private extractModuleDescription(content: string): string {
    const lines = content.split('\n');
    let description = '';
    let foundTitle = false;

    for (const line of lines) {
      if (line.startsWith('#')) {
        foundTitle = true;
        continue;
      }
      if (foundTitle && line.trim()) {
        description = line.trim();
        break;
      }
    }

    return description || '暂无描述';
  }

  private extractModuleOrder(moduleId: string): number {
    const match = moduleId.match(/^(\d+)/);
    return match ? parseInt(match[1], 10) : 999;
  }

  private extractEstimatedHours(content: string): number {
    const match = content.match(/预估学习时长[：:]\s*(\d+)\s*小时/i);
    return match ? parseInt(match[1], 10) : 0;
  }

  private extractPrerequisites(content: string): string[] {
    const match = content.match(/前置模块[：:]\s*(.+)$/m);
    if (!match) return [];
    
    return match[1]
      .split(/[,，]/)
      .map(s => s.trim())
      .filter(s => s && s !== '无');
  }

  private extractLearningObjectives(content: string): string[] {
    const objectives: string[] = [];
    const lines = content.split('\n');
    let inObjectivesSection = false;

    for (const line of lines) {
      if (line.match(/学习目标|Learning Objectives/i)) {
        inObjectivesSection = true;
        continue;
      }
      if (inObjectivesSection) {
        if (line.startsWith('#')) break;
        const match = line.match(/^[-*]\s+(.+)$/);
        if (match) {
          objectives.push(match[1].trim());
        }
      }
    }

    return objectives;
  }

  private extractLessonTitle(content: string, lessonId: string): string {
    const match = content.match(/^#\s+(.+)$/m);
    return match ? match[1].trim() : lessonId;
  }

  private extractEstimatedMinutes(content: string): number {
    const match = content.match(/预估学习时长[：:]\s*(\d+)\s*分钟/i);
    return match ? parseInt(match[1], 10) : 30;
  }

  private extractKeyPoints(content: string): string[] {
    const keyPoints: string[] = [];
    const lines = content.split('\n');
    let inKeyPointsSection = false;

    for (const line of lines) {
      if (line.match(/关键知识点|Key Points/i)) {
        inKeyPointsSection = true;
        continue;
      }
      if (inKeyPointsSection) {
        if (line.startsWith('#')) break;
        const match = line.match(/^[-*]\s+(.+)$/);
        if (match) {
          keyPoints.push(match[1].trim());
        }
      }
    }

    return keyPoints;
  }

  private extractRelatedDocs(content: string): DocLink[] {
    const docs: DocLink[] = [];
    const lines = content.split('\n');
    let inDocsSection = false;

    for (const line of lines) {
      if (line.match(/相关文档|Related Docs/i)) {
        inDocsSection = true;
        continue;
      }
      if (inDocsSection) {
        if (line.startsWith('#')) break;
        const match = line.match(/\[(.+?)\]\((.+?)\)/);
        if (match) {
          docs.push({
            title: match[1].trim(),
            url: match[2].trim(),
            type: match[2].includes('webpack.js.org') ? 'official' : 'community'
          });
        }
      }
    }

    return docs;
  }

  private extractDescription(content: string): string {
    const lines = content.split('\n');
    for (const line of lines) {
      if (line.trim() && !line.startsWith('#')) {
        return line.trim().substring(0, 150) + (line.length > 150 ? '...' : '');
      }
    }
    return '';
  }

  private extractExampleTitle(content: string, exampleId: string): string {
    const match = content.match(/^#\s+(.+)$/m);
    return match ? match[1].trim() : exampleId;
  }

  private extractExampleDescription(content: string): string {
    return this.extractDescription(content);
  }
}
