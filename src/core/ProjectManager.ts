/**
 * ProjectManager - 项目管理组件
 * 
 * 负责实践项目的模板和参考答案管理
 */

import * as fs from 'fs';
import * as path from 'path';
import {
  Project,
  ProjectTemplate,
  ProjectSolution,
  ComparisonResult,
  CodeFile
} from '../types';

export class ProjectManager {
  private basePath: string;

  constructor(basePath: string = path.join(process.cwd(), 'projects')) {
    this.basePath = basePath;
  }

  /**
   * 获取指定级别的项目列表
   */
  getProjects(level: 'basic' | 'configuration' | 'advanced'): Project[] {
    try {
      const levelPath = path.join(this.basePath, level);

      if (!fs.existsSync(levelPath)) {
        return [];
      }

      const entries = fs.readdirSync(levelPath, { withFileTypes: true });
      const projects: Project[] = [];

      for (const entry of entries) {
        if (entry.isDirectory()) {
          const projectId = entry.name;
          const projectPath = path.join(levelPath, projectId);
          
          try {
            const project = this.loadProject(projectId, level, projectPath);
            projects.push(project);
          } catch (error) {
            console.warn(`Failed to load project ${projectId}:`, error);
          }
        }
      }

      return projects;
    } catch (error) {
      throw new Error(`Failed to get projects for level ${level}: ${error instanceof Error ? error.message : String(error)}`);
    }
  }

  /**
   * 获取项目初始模板
   */
  getProjectTemplate(projectId: string): ProjectTemplate {
    const project = this.findProject(projectId);
    
    if (!project) {
      throw new Error(`Project not found: ${projectId}`);
    }

    return project.template;
  }

  /**
   * 获取项目参考答案
   */
  getProjectSolution(projectId: string): ProjectSolution {
    const project = this.findProject(projectId);
    
    if (!project) {
      throw new Error(`Project not found: ${projectId}`);
    }

    return project.solution;
  }

  /**
   * 对比用户代码和参考答案
   */
  compareCode(userCode: string, solutionCode: string): ComparisonResult {
    const userLines = userCode.split('\n');
    const solutionLines = solutionCode.split('\n');

    // 检查是否完全相同
    if (userCode === solutionCode) {
      return {
        identical: true,
        differences: [],
        similarity: 1.0
      };
    }

    // 找出差异
    const differences: ComparisonResult['differences'] = [];
    const maxLines = Math.max(userLines.length, solutionLines.length);

    for (let i = 0; i < maxLines; i++) {
      const userLine = userLines[i] || '';
      const solutionLine = solutionLines[i] || '';

      if (userLine !== solutionLine) {
        differences.push({
          lineNumber: i + 1,
          userCode: userLine,
          solutionCode: solutionLine
        });
      }
    }

    // 计算相似度（基于相同行数的比例）
    const sameLines = maxLines - differences.length;
    const similarity = maxLines > 0 ? sameLines / maxLines : 0;

    return {
      identical: false,
      differences: differences,
      similarity: similarity
    };
  }

  /**
   * 查找项目（在所有级别中搜索）
   */
  private findProject(projectId: string): Project | null {
    const levels: Array<'basic' | 'configuration' | 'advanced'> = ['basic', 'configuration', 'advanced'];

    for (const level of levels) {
      const projects = this.getProjects(level);
      const project = projects.find(p => p.id === projectId);
      
      if (project) {
        return project;
      }
    }

    return null;
  }

  /**
   * 加载项目信息
   */
  private loadProject(projectId: string, level: 'basic' | 'configuration' | 'advanced', projectPath: string): Project {
    const readmePath = path.join(projectPath, 'README.md');
    
    if (!fs.existsSync(readmePath)) {
      throw new Error(`Project README not found: ${projectId}`);
    }

    const readmeContent = fs.readFileSync(readmePath, 'utf-8');

    const project: Project = {
      id: projectId,
      name: this.extractProjectName(readmeContent, projectId),
      level: level,
      description: this.extractProjectDescription(readmeContent),
      objectives: this.extractObjectives(readmeContent),
      estimatedHours: this.extractEstimatedHours(readmeContent),
      template: this.loadProjectTemplate(projectPath),
      solution: this.loadProjectSolution(projectPath),
      hints: this.extractHints(readmeContent),
      relatedLessons: this.extractRelatedLessons(readmeContent)
    };

    return project;
  }

  /**
   * 加载项目模板
   */
  private loadProjectTemplate(projectPath: string): ProjectTemplate {
    const templatePath = path.join(projectPath, 'template');
    
    if (!fs.existsSync(templatePath)) {
      throw new Error(`Project template not found at: ${templatePath}`);
    }

    const instructionsPath = path.join(projectPath, 'README.md');
    const instructions = fs.existsSync(instructionsPath)
      ? fs.readFileSync(instructionsPath, 'utf-8')
      : '';

    return {
      files: this.loadCodeFiles(templatePath),
      instructions: instructions
    };
  }

  /**
   * 加载项目参考答案
   */
  private loadProjectSolution(projectPath: string): ProjectSolution {
    const solutionPath = path.join(projectPath, 'solution');
    
    if (!fs.existsSync(solutionPath)) {
      throw new Error(`Project solution not found at: ${solutionPath}`);
    }

    const solutionReadmePath = path.join(solutionPath, 'README.md');
    const explanation = fs.existsSync(solutionReadmePath)
      ? fs.readFileSync(solutionReadmePath, 'utf-8')
      : '';

    return {
      files: this.loadCodeFiles(solutionPath),
      explanation: explanation,
      keyPoints: this.extractKeyPoints(explanation)
    };
  }

  /**
   * 递归加载目录中的所有代码文件
   */
  private loadCodeFiles(dirPath: string): CodeFile[] {
    const files: CodeFile[] = [];
    const excludeDirs = ['node_modules', 'dist', 'build', '.git'];
    const excludeFiles = ['package-lock.json', 'yarn.lock', '.DS_Store'];

    const loadFilesRecursive = (currentPath: string, relativePath: string = '') => {
      const entries = fs.readdirSync(currentPath, { withFileTypes: true });

      for (const entry of entries) {
        const fullPath = path.join(currentPath, entry.name);
        const relPath = relativePath ? path.join(relativePath, entry.name) : entry.name;

        if (entry.isDirectory()) {
          if (!excludeDirs.includes(entry.name)) {
            loadFilesRecursive(fullPath, relPath);
          }
        } else if (entry.isFile()) {
          if (!excludeFiles.includes(entry.name)) {
            try {
              const content = fs.readFileSync(fullPath, 'utf-8');
              files.push({
                path: relPath,
                content: content,
                language: this.getLanguageFromExtension(entry.name)
              });
            } catch (error) {
              console.warn(`Failed to read file ${relPath}:`, error);
            }
          }
        }
      }
    };

    loadFilesRecursive(dirPath);
    return files;
  }

  /**
   * 根据文件扩展名获取语言类型
   */
  private getLanguageFromExtension(filename: string): string {
    const ext = path.extname(filename).toLowerCase();
    const languageMap: { [key: string]: string } = {
      '.js': 'javascript',
      '.ts': 'typescript',
      '.jsx': 'javascript',
      '.tsx': 'typescript',
      '.json': 'json',
      '.md': 'markdown',
      '.css': 'css',
      '.scss': 'scss',
      '.sass': 'sass',
      '.less': 'less',
      '.html': 'html',
      '.vue': 'vue',
      '.yml': 'yaml',
      '.yaml': 'yaml'
    };
    return languageMap[ext] || 'text';
  }

  /**
   * 从 README 中提取项目名称
   */
  private extractProjectName(content: string, projectId: string): string {
    const match = content.match(/^#\s+(.+)$/m);
    return match ? match[1].trim() : projectId;
  }

  /**
   * 从 README 中提取项目描述
   */
  private extractProjectDescription(content: string): string {
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

  /**
   * 从 README 中提取项目目标
   */
  private extractObjectives(content: string): string[] {
    const objectives: string[] = [];
    const lines = content.split('\n');
    let inObjectivesSection = false;

    for (const line of lines) {
      if (line.match(/项目目标|Project Objectives|目标/i)) {
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

  /**
   * 从 README 中提取预估时长
   */
  private extractEstimatedHours(content: string): number {
    const match = content.match(/预估[完成]*时长[：:]\s*(\d+)\s*小时/i);
    return match ? parseInt(match[1], 10) : 2;
  }

  /**
   * 从 README 中提取提示信息
   */
  private extractHints(content: string): string[] {
    const hints: string[] = [];
    const lines = content.split('\n');
    let inHintsSection = false;

    for (const line of lines) {
      if (line.match(/提示|Hints/i)) {
        inHintsSection = true;
        continue;
      }
      if (inHintsSection) {
        if (line.startsWith('#')) break;
        const match = line.match(/^[-*]\s+(.+)$/);
        if (match) {
          hints.push(match[1].trim());
        }
      }
    }

    return hints;
  }

  /**
   * 从 README 中提取相关课程
   */
  private extractRelatedLessons(content: string): string[] {
    const lessons: string[] = [];
    const lines = content.split('\n');
    let inLessonsSection = false;

    for (const line of lines) {
      if (line.match(/相关课程|Related Lessons/i)) {
        inLessonsSection = true;
        continue;
      }
      if (inLessonsSection) {
        if (line.startsWith('#')) break;
        const match = line.match(/^[-*]\s+(.+)$/);
        if (match) {
          lessons.push(match[1].trim());
        }
      }
    }

    return lessons;
  }

  /**
   * 从内容中提取关键知识点
   */
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
}
