/**
 * LearningPlanGenerator - 学习计划生成器
 * 
 * 根据目标学习时间生成个性化学习计划
 */

import { LearningPlan, Module } from '../types';

export class LearningPlanGenerator {
  /**
   * 生成个性化学习计划
   * 
   * @param modules 所有学习模块
   * @param targetHours 目标学习时间（小时）
   * @returns 个性化学习计划
   */
  generateLearningPlan(modules: Module[], targetHours: number): LearningPlan {
    if (targetHours <= 0) {
      throw new Error('Target hours must be positive');
    }

    if (modules.length === 0) {
      throw new Error('No modules provided');
    }

    // 按依赖顺序排序模块
    const sortedModules = this.sortModulesByDependencies(modules);

    // 计算总的预估学习时长
    const totalEstimatedHours = sortedModules.reduce(
      (sum, module) => sum + module.estimatedHours,
      0
    );

    // 如果目标时间太短，至少需要总预估时长的 90%
    const minHours = totalEstimatedHours * 0.9;
    const maxHours = totalEstimatedHours * 1.1;

    if (targetHours < minHours) {
      throw new Error(
        `Target hours (${targetHours}) is too short. Minimum required: ${Math.ceil(minHours)} hours`
      );
    }

    if (targetHours > maxHours) {
      throw new Error(
        `Target hours (${targetHours}) is too long. Maximum recommended: ${Math.floor(maxHours)} hours`
      );
    }

    // 计算每日学习时间（1-4 小时之间）
    const dailyHours = this.calculateDailyHours(targetHours, totalEstimatedHours);

    // 计算总天数
    const totalDays = Math.ceil(targetHours / dailyHours);

    // 生成学习计划
    const schedule = this.generateSchedule(sortedModules, dailyHours, totalDays);

    return {
      targetHours,
      dailyHours,
      totalDays,
      schedule
    };
  }

  /**
   * 按依赖关系排序模块
   */
  private sortModulesByDependencies(modules: Module[]): Module[] {
    // 简单实现：按 order 字段排序
    // 更复杂的实现可以使用拓扑排序处理依赖关系
    return [...modules].sort((a, b) => a.order - b.order);
  }

  /**
   * 计算每日学习时间
   */
  private calculateDailyHours(targetHours: number, totalEstimatedHours: number): number {
    // 根据目标时间和总预估时长计算合理的每日学习时间
    // 目标：在 1-4 小时之间

    // 如果目标时间接近预估时长，使用较长的每日学习时间
    const ratio = targetHours / totalEstimatedHours;

    let dailyHours: number;

    if (ratio <= 0.95) {
      // 时间紧张，每天学习 3-4 小时
      dailyHours = 3.5;
    } else if (ratio <= 1.0) {
      // 时间适中，每天学习 2-3 小时
      dailyHours = 2.5;
    } else {
      // 时间充裕，每天学习 1-2 小时
      dailyHours = 1.5;
    }

    // 确保在 1-4 小时范围内
    return Math.max(1, Math.min(4, dailyHours));
  }

  /**
   * 生成学习计划表
   */
  private generateSchedule(
    modules: Module[],
    dailyHours: number,
    totalDays: number
  ): LearningPlan['schedule'] {
    const schedule: LearningPlan['schedule'] = [];
    let currentDay = 1;
    let remainingDailyHours = dailyHours;

    for (const module of modules) {
      // 获取模块的所有课程（按顺序）
      const lessons = [...module.lessons].sort((a, b) => a.order - b.order);

      for (const lesson of lessons) {
        const lessonHours = lesson.estimatedMinutes / 60;

        // 如果当前课程可以在今天完成
        if (lessonHours <= remainingDailyHours) {
          // 查找当天的计划
          let daySchedule = schedule.find(s => s.day === currentDay && s.moduleId === module.id);

          if (!daySchedule) {
            daySchedule = {
              day: currentDay,
              moduleId: module.id,
              lessonIds: [],
              estimatedHours: 0
            };
            schedule.push(daySchedule);
          }

          daySchedule.lessonIds.push(lesson.id);
          daySchedule.estimatedHours += lessonHours;
          remainingDailyHours -= lessonHours;
        } else {
          // 课程需要跨天完成，先完成今天的部分
          if (remainingDailyHours > 0.5) {
            // 如果今天还有超过 0.5 小时，记录部分完成
            let daySchedule = schedule.find(s => s.day === currentDay && s.moduleId === module.id);

            if (!daySchedule) {
              daySchedule = {
                day: currentDay,
                moduleId: module.id,
                lessonIds: [],
                estimatedHours: 0
              };
              schedule.push(daySchedule);
            }

            daySchedule.lessonIds.push(lesson.id);
            daySchedule.estimatedHours += remainingDailyHours;
          }

          // 移到下一天
          currentDay++;
          remainingDailyHours = dailyHours;

          // 在新的一天继续这个课程
          const daySchedule = {
            day: currentDay,
            moduleId: module.id,
            lessonIds: [lesson.id],
            estimatedHours: Math.min(lessonHours - (dailyHours - remainingDailyHours), dailyHours)
          };
          schedule.push(daySchedule);

          remainingDailyHours -= daySchedule.estimatedHours;
        }

        // 如果今天的时间用完了，移到下一天
        if (remainingDailyHours < 0.1) {
          currentDay++;
          remainingDailyHours = dailyHours;
        }
      }
    }

    return schedule;
  }
}
