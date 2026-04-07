/**
 * ProgressTracker - 进度管理组件
 * 
 * 负责跟踪和管理学习进度
 */

import * as fs from 'fs';
import * as path from 'path';
import { Progress, Statistics, LearningPlan, Module } from '../types';
import { LearningPlanGenerator } from './LearningPlanGenerator';

export class ProgressTracker {
  private progressFilePath: string;
  private userId: string;

  constructor(
    userId: string = 'default-user',
    dataPath: string = path.join(process.cwd(), 'data')
  ) {
    this.userId = userId;
    this.progressFilePath = path.join(dataPath, `progress-${userId}.json`);
    
    // 确保数据目录存在
    const dataDir = path.dirname(this.progressFilePath);
    if (!fs.existsSync(dataDir)) {
      fs.mkdirSync(dataDir, { recursive: true });
    }

    // 如果进度文件不存在，创建初始进度
    if (!fs.existsSync(this.progressFilePath)) {
      this.saveProgress(this.createInitialProgress());
    }
  }

  /**
   * 标记课程为已完成（幂等操作）
   */
  markLessonComplete(moduleId: string, lessonId: string): void {
    const progress = this.loadProgress();
    const lessonKey = `${moduleId}/${lessonId}`;

    // 幂等性：如果已经存在，不重复添加
    if (!progress.completedLessons.includes(lessonKey)) {
      progress.completedLessons.push(lessonKey);
    }

    // 更新最后学习日期
    progress.lastStudyDate = new Date().toISOString();

    this.saveProgress(progress);
  }

  /**
   * 获取模块完成百分比
   */
  getModuleProgress(moduleId: string): number {
    const progress = this.loadProgress();

    // 如果模块进度信息存在，直接返回
    if (progress.moduleProgress[moduleId]) {
      return progress.moduleProgress[moduleId].percentage;
    }

    return 0;
  }

  /**
   * 获取整体学习进度
   */
  getOverallProgress(): Progress {
    return this.loadProgress();
  }

  /**
   * 记录学习时间（累加）
   */
  recordStudyTime(moduleId: string, duration: number): void {
    if (duration < 0) {
      throw new Error('Study time duration must be non-negative');
    }

    const progress = this.loadProgress();

    // 累加学习时间
    if (!progress.studyTime[moduleId]) {
      progress.studyTime[moduleId] = 0;
    }
    progress.studyTime[moduleId] += duration;

    // 更新最后学习日期
    progress.lastStudyDate = new Date().toISOString();

    this.saveProgress(progress);
  }

  /**
   * 获取学习统计数据
   */
  getStudyStatistics(): Statistics {
    const progress = this.loadProgress();

    // 计算总学习时间
    const totalStudyTime = Object.values(progress.studyTime).reduce(
      (sum, time) => sum + time,
      0
    );

    // 计算已完成课程数
    const completedLessonsCount = progress.completedLessons.length;

    // 计算已完成项目数
    const completedProjectsCount = progress.completedProjects.length;

    // 计算平均测试分数（暂时返回0，等待评估系统实现）
    const averageQuizScore = 0;

    // 构建模块统计
    const moduleStatistics: {
      [moduleId: string]: {
        studyTime: number;
        completedLessons: number;
        averageScore: number;
      };
    } = {};

    // 统计每个模块的数据
    for (const moduleId in progress.studyTime) {
      const moduleCompletedLessons = progress.completedLessons.filter(
        lesson => lesson.startsWith(`${moduleId}/`)
      ).length;

      moduleStatistics[moduleId] = {
        studyTime: progress.studyTime[moduleId],
        completedLessons: moduleCompletedLessons,
        averageScore: 0 // 暂时返回0，等待评估系统实现
      };
    }

    return {
      totalStudyTime,
      completedLessonsCount,
      completedProjectsCount,
      averageQuizScore,
      moduleStatistics
    };
  }

  /**
   * 更新模块进度信息
   * 此方法应该在模块内容变化时调用，用于重新计算模块进度
   */
  updateModuleProgress(moduleId: string, totalLessons: number): void {
    const progress = this.loadProgress();

    const completedCount = progress.completedLessons.filter(
      lesson => lesson.startsWith(`${moduleId}/`)
    ).length;

    const percentage = totalLessons > 0 
      ? Math.round((completedCount / totalLessons) * 100) 
      : 0;

    progress.moduleProgress[moduleId] = {
      completedCount,
      totalCount: totalLessons,
      percentage
    };

    // 重新计算整体进度
    this.recalculateOverallProgress(progress);

    this.saveProgress(progress);
  }

  /**
   * 标记项目为已完成
   */
  markProjectComplete(projectId: string): void {
    const progress = this.loadProgress();

    // 幂等性：如果已经存在，不重复添加
    if (!progress.completedProjects.includes(projectId)) {
      progress.completedProjects.push(projectId);
    }

    progress.lastStudyDate = new Date().toISOString();

    this.saveProgress(progress);
  }

  /**
   * 添加书签
   */
  addBookmark(lessonId: string): void {
    const progress = this.loadProgress();

    // 幂等性：如果已经存在，不重复添加
    if (!progress.bookmarks.includes(lessonId)) {
      progress.bookmarks.push(lessonId);
    }

    this.saveProgress(progress);
  }

  /**
   * 移除书签
   */
  removeBookmark(lessonId: string): void {
    const progress = this.loadProgress();

    // 从书签列表中移除
    const index = progress.bookmarks.indexOf(lessonId);
    if (index !== -1) {
      progress.bookmarks.splice(index, 1);
    }

    this.saveProgress(progress);
  }

  /**
   * 获取所有书签
   */
  getBookmarks(): string[] {
    const progress = this.loadProgress();
    return [...progress.bookmarks]; // 返回副本，避免外部修改
  }

  /**
   * 导出学习笔记（Markdown 格式）
   * 
   * @param contentManager ContentManager 实例，用于获取课程内容
   * @returns Markdown 格式的学习笔记
   */
  exportNotes(contentManager: any): string {
    const progress = this.loadProgress();
    const lines: string[] = [];

    // 标题
    lines.push('# 我的 Webpack 学习笔记');
    lines.push('');
    lines.push(`导出时间：${new Date().toLocaleString('zh-CN')}`);
    lines.push('');
    lines.push('---');
    lines.push('');

    // 学习进度概览
    lines.push('## 学习进度概览');
    lines.push('');
    lines.push(`- 整体完成度：${progress.overallPercentage}%`);
    lines.push(`- 已完成课程数：${progress.completedLessons.length}`);
    lines.push(`- 已完成项目数：${progress.completedProjects.length}`);
    lines.push(`- 最后学习日期：${new Date(progress.lastStudyDate).toLocaleString('zh-CN')}`);
    lines.push('');
    lines.push('---');
    lines.push('');

    // 已完成的课程
    if (progress.completedLessons.length > 0) {
      lines.push('## 已完成的课程');
      lines.push('');

      // 按模块分组
      const lessonsByModule: { [moduleId: string]: string[] } = {};
      for (const lessonKey of progress.completedLessons) {
        const [moduleId, lessonId] = lessonKey.split('/');
        if (!lessonsByModule[moduleId]) {
          lessonsByModule[moduleId] = [];
        }
        lessonsByModule[moduleId].push(lessonId);
      }

      // 输出每个模块的课程
      for (const moduleId in lessonsByModule) {
        lines.push(`### 模块：${moduleId}`);
        lines.push('');

        for (const lessonId of lessonsByModule[moduleId]) {
          try {
            const lesson = contentManager.getLessonContent(moduleId, lessonId);
            lines.push(`#### ${lesson.title}`);
            lines.push('');
            
            if (lesson.keyPoints.length > 0) {
              lines.push('**关键知识点：**');
              lines.push('');
              for (const point of lesson.keyPoints) {
                lines.push(`- ${point}`);
              }
              lines.push('');
            }

            // 添加课程内容摘要（前200字符）
            const contentPreview = lesson.content
              .replace(/^#.+$/gm, '') // 移除标题
              .trim()
              .substring(0, 200);
            if (contentPreview) {
              lines.push('**内容摘要：**');
              lines.push('');
              lines.push(contentPreview + '...');
              lines.push('');
            }
          } catch (error) {
            lines.push(`- ${lessonId} (无法加载详细信息)`);
            lines.push('');
          }
        }
      }

      lines.push('---');
      lines.push('');
    }

    // 书签内容
    if (progress.bookmarks.length > 0) {
      lines.push('## 我的书签');
      lines.push('');

      for (const lessonKey of progress.bookmarks) {
        const [moduleId, lessonId] = lessonKey.split('/');
        
        try {
          const lesson = contentManager.getLessonContent(moduleId, lessonId);
          lines.push(`### ${lesson.title}`);
          lines.push('');
          lines.push(`**模块：** ${moduleId}`);
          lines.push('');
          
          if (lesson.keyPoints.length > 0) {
            lines.push('**关键知识点：**');
            lines.push('');
            for (const point of lesson.keyPoints) {
              lines.push(`- ${point}`);
            }
            lines.push('');
          }

          if (lesson.relatedDocs.length > 0) {
            lines.push('**相关文档：**');
            lines.push('');
            for (const doc of lesson.relatedDocs) {
              lines.push(`- [${doc.title}](${doc.url})`);
            }
            lines.push('');
          }
        } catch (error) {
          lines.push(`- ${lessonKey} (无法加载详细信息)`);
          lines.push('');
        }
      }

      lines.push('---');
      lines.push('');
    }

    // 学习统计
    lines.push('## 学习统计');
    lines.push('');

    if (Object.keys(progress.studyTime).length > 0) {
      lines.push('### 各模块学习时间');
      lines.push('');
      for (const moduleId in progress.studyTime) {
        const hours = Math.floor(progress.studyTime[moduleId] / 60);
        const minutes = progress.studyTime[moduleId] % 60;
        lines.push(`- ${moduleId}: ${hours}小时${minutes}分钟`);
      }
      lines.push('');
    }

    if (Object.keys(progress.moduleProgress).length > 0) {
      lines.push('### 各模块完成度');
      lines.push('');
      for (const moduleId in progress.moduleProgress) {
        const modProgress = progress.moduleProgress[moduleId];
        lines.push(`- ${moduleId}: ${modProgress.completedCount}/${modProgress.totalCount} (${modProgress.percentage}%)`);
      }
      lines.push('');
    }

    return lines.join('\n');
  }

  /**
   * 生成个性化学习计划
   * 
   * @param modules 所有学习模块
   * @param targetHours 目标学习时间（小时）
   * @returns 个性化学习计划
   */
  generateLearningPlan(modules: Module[], targetHours: number): LearningPlan {
    const generator = new LearningPlanGenerator();
    return generator.generateLearningPlan(modules, targetHours);
  }

  /**
   * 创建初始进度对象
   */
  private createInitialProgress(): Progress {
    return {
      userId: this.userId,
      completedLessons: [],
      completedProjects: [],
      moduleProgress: {},
      overallPercentage: 0,
      studyTime: {},
      lastStudyDate: new Date().toISOString(),
      bookmarks: []
    };
  }

  /**
   * 从文件加载进度数据
   */
  private loadProgress(): Progress {
    try {
      const data = fs.readFileSync(this.progressFilePath, 'utf-8');
      return JSON.parse(data);
    } catch (error) {
      // 如果文件损坏，创建新的进度记录
      console.warn('Progress file corrupted, creating new progress record');
      const newProgress = this.createInitialProgress();
      this.saveProgress(newProgress);
      return newProgress;
    }
  }

  /**
   * 保存进度数据到文件
   */
  private saveProgress(progress: Progress): void {
    try {
      const data = JSON.stringify(progress, null, 2);
      fs.writeFileSync(this.progressFilePath, data, 'utf-8');
    } catch (error) {
      throw new Error(
        `Failed to save progress: ${error instanceof Error ? error.message : String(error)}`
      );
    }
  }

  /**
   * 重新计算整体进度百分比
   */
  private recalculateOverallProgress(progress: Progress): void {
    const modules = Object.values(progress.moduleProgress);
    
    if (modules.length === 0) {
      progress.overallPercentage = 0;
      return;
    }

    const totalLessons = modules.reduce((sum, mod) => sum + mod.totalCount, 0);
    const completedLessons = modules.reduce((sum, mod) => sum + mod.completedCount, 0);

    progress.overallPercentage = totalLessons > 0
      ? Math.round((completedLessons / totalLessons) * 100)
      : 0;
  }
}
