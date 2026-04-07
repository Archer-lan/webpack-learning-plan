/**
 * 辅助功能使用示例
 * 
 * 演示书签、学习笔记导出和学习计划生成功能
 */

import { ProgressTracker } from '../src/core/ProgressTracker';
import { ContentManager } from '../src/core/ContentManager';
import * as path from 'path';
import * as fs from 'fs';

// 创建临时数据目录
const tempDataPath = path.join(__dirname, '../temp-data');
if (!fs.existsSync(tempDataPath)) {
  fs.mkdirSync(tempDataPath, { recursive: true });
}

// 初始化组件
const progressTracker = new ProgressTracker('demo-user', tempDataPath);
const contentManager = new ContentManager(path.join(__dirname, '../modules'));

console.log('=== 辅助功能演示 ===\n');

// 1. 书签功能演示
console.log('1. 书签功能演示');
console.log('添加书签...');
progressTracker.addBookmark('01-basics/01-installation');
progressTracker.addBookmark('01-basics/02-first-project');
progressTracker.addBookmark('02-configuration/01-config-structure');

console.log('当前书签列表：');
const bookmarks = progressTracker.getBookmarks();
bookmarks.forEach(bookmark => console.log(`  - ${bookmark}`));

console.log('\n移除一个书签...');
progressTracker.removeBookmark('01-basics/02-first-project');

console.log('更新后的书签列表：');
const updatedBookmarks = progressTracker.getBookmarks();
updatedBookmarks.forEach(bookmark => console.log(`  - ${bookmark}`));

// 2. 模拟一些学习进度
console.log('\n2. 模拟学习进度');
progressTracker.markLessonComplete('01-basics', '01-installation');
progressTracker.markLessonComplete('01-basics', '02-first-project');
progressTracker.recordStudyTime('01-basics', 120); // 120 分钟

progressTracker.updateModuleProgress('01-basics', 8); // 假设基础模块有 8 个课程

console.log('已完成课程和学习时间已记录');

// 3. 导出学习笔记
console.log('\n3. 导出学习笔记');
try {
  const notes = progressTracker.exportNotes(contentManager);
  const notesPath = path.join(tempDataPath, 'my-learning-notes.md');
  fs.writeFileSync(notesPath, notes, 'utf-8');
  console.log(`学习笔记已导出到: ${notesPath}`);
  console.log('\n笔记预览（前 500 字符）：');
  console.log(notes.substring(0, 500) + '...\n');
} catch (error) {
  console.log('导出笔记时出错（可能是因为模块内容不存在）:', error instanceof Error ? error.message : String(error));
}

// 4. 生成学习计划
console.log('\n4. 生成个性化学习计划');
try {
  const modules = contentManager.getModules();
  
  if (modules.length > 0) {
    console.log(`找到 ${modules.length} 个学习模块`);
    
    // 计算总预估时长
    const totalHours = modules.reduce((sum, m) => sum + m.estimatedHours, 0);
    console.log(`总预估学习时长: ${totalHours} 小时`);
    
    // 生成合理的学习计划（总时长的 95%-110% 之间）
    const targetHours = Math.ceil(totalHours * 0.95);
    console.log(`\n生成 ${targetHours} 小时的学习计划...`);
    
    const plan = progressTracker.generateLearningPlan(modules, targetHours);
    
    console.log('\n学习计划概览：');
    console.log(`  - 目标学习时间: ${plan.targetHours} 小时`);
    console.log(`  - 每日学习时间: ${plan.dailyHours} 小时`);
    console.log(`  - 总天数: ${plan.totalDays} 天`);
    console.log(`  - 计划项数: ${plan.schedule.length} 项`);
    
    console.log('\n前 5 天的学习计划：');
    const first5Days = plan.schedule.filter(s => s.day <= 5);
    first5Days.forEach(item => {
      console.log(`  第 ${item.day} 天 - 模块 ${item.moduleId}:`);
      console.log(`    课程: ${item.lessonIds.join(', ')}`);
      console.log(`    预估时长: ${item.estimatedHours.toFixed(1)} 小时`);
    });
  } else {
    console.log('没有找到学习模块，无法生成学习计划');
  }
} catch (error) {
  console.log('生成学习计划时出错:', error instanceof Error ? error.message : String(error));
}

console.log('\n=== 演示完成 ===');
console.log(`\n临时数据保存在: ${tempDataPath}`);
console.log('可以查看生成的进度文件和学习笔记');
