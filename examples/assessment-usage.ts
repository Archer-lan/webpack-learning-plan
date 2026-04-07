/**
 * AssessmentEngine 使用示例
 * 
 * 演示如何使用评估组件进行测试和评分
 */

import { AssessmentEngine } from '../src/core/AssessmentEngine';
import { Answer } from '../src/types';

// 创建评估引擎实例
const engine = new AssessmentEngine();

// 示例 1: 获取模块测试题
console.log('=== 示例 1: 获取模块测试题 ===');
try {
  const quiz = engine.getModuleQuiz('01-basics');
  console.log(`测试标题: ${quiz.title}`);
  console.log(`题目数量: ${quiz.questions.length}`);
  console.log(`及格分数: ${quiz.passingScore}`);
  console.log(`时间限制: ${quiz.timeLimit} 分钟\n`);
} catch (error) {
  console.error('获取测试题失败:', error);
}

// 示例 2: 提交测试答案
console.log('=== 示例 2: 提交测试答案 ===');
const answers: Answer[] = [
  { questionId: 'q1', answer: '模块打包工具' },
  { questionId: 'q2', answer: 'webpack.config.js' },
  { questionId: 'q3', answer: 'false' },
  { questionId: 'q4', answer: '以上都是' },
  { questionId: 'q5', answer: '转换非 JavaScript 文件' },
  { questionId: 'q6', answer: 'true' },
  { questionId: 'q7', answer: 'development 和 production' },
  { questionId: 'q8', answer: 'true' },
  { questionId: 'q9', answer: 'npm install webpack webpack-cli --save-dev' },
  { questionId: 'q10', answer: 'true' }
];

try {
  const result = engine.submitQuiz('quiz-basics', answers);
  console.log(`得分: ${result.score} / ${result.totalPoints}`);
  console.log(`正确率: ${result.percentage}%`);
  console.log(`完成时间: ${result.completedAt}\n`);
} catch (error) {
  console.error('提交测试失败:', error);
}

// 示例 3: 获取错题反馈
console.log('=== 示例 3: 获取错题反馈 ===');
const wrongAnswers: Answer[] = [
  { questionId: 'q1', answer: 'JavaScript 编译器' }, // 错误答案
  { questionId: 'q2', answer: 'webpack.config.js' }, // 正确答案
];

try {
  const result = engine.submitQuiz('quiz-basics', wrongAnswers);
  const feedback = engine.getWrongAnswersFeedback('quiz-basics', result);
  
  console.log(`错题数量: ${feedback.length}`);
  
  if (feedback.length > 0) {
    console.log('\n错题详情:');
    feedback.forEach((item, index) => {
      console.log(`\n${index + 1}. ${item.question.question}`);
      console.log(`   您的答案: ${item.userAnswer}`);
      console.log(`   正确答案: ${item.correctAnswer}`);
      console.log(`   解析: ${item.explanation}`);
    });
  }
  console.log();
} catch (error) {
  console.error('获取错题反馈失败:', error);
}

// 示例 4: 获取学习建议
console.log('=== 示例 4: 获取学习建议 ===');
const lowScoreAnswers: Answer[] = [
  { questionId: 'q1', answer: '模块打包工具' },
  { questionId: 'q2', answer: 'config.js' }, // 错误
  { questionId: 'q3', answer: 'true' }, // 错误
];

try {
  const result = engine.submitQuiz('quiz-basics', lowScoreAnswers);
  const recommendations = engine.getLearningRecommendations(result);
  
  console.log(`需要复习: ${recommendations.shouldReview}`);
  
  if (recommendations.shouldReview) {
    console.log('\n学习建议:');
    recommendations.recommendations.forEach((rec, index) => {
      console.log(`${index + 1}. ${rec}`);
    });
    
    if (recommendations.relatedLessons.length > 0) {
      console.log('\n相关课程:');
      recommendations.relatedLessons.forEach(lesson => {
        console.log(`- ${lesson}`);
      });
    }
  }
  console.log();
} catch (error) {
  console.error('获取学习建议失败:', error);
}

// 示例 5: 查看历史记录
console.log('=== 示例 5: 查看历史记录 ===');
try {
  const history = engine.getQuizHistory('01-basics');
  
  console.log(`历史记录数量: ${history.length}`);
  
  if (history.length > 0) {
    const moduleHistory = history[0];
    console.log(`\n模块 ${moduleHistory.moduleId} 的测试记录:`);
    
    moduleHistory.results.forEach((result, index) => {
      console.log(`\n第 ${index + 1} 次测试:`);
      console.log(`  得分: ${result.score} / ${result.totalPoints}`);
      console.log(`  正确率: ${result.percentage}%`);
      console.log(`  完成时间: ${new Date(result.completedAt).toLocaleString()}`);
    });
  }
  console.log();
} catch (error) {
  console.error('获取历史记录失败:', error);
}

// 示例 6: 生成综合测试
console.log('=== 示例 6: 生成综合测试 ===');
try {
  const finalExam = engine.generateFinalExam();
  console.log(`综合测试标题: ${finalExam.title}`);
  console.log(`题目数量: ${finalExam.questions.length}`);
  console.log(`及格分数: ${finalExam.passingScore}`);
  console.log(`时间限制: ${finalExam.timeLimit} 分钟`);
} catch (error) {
  console.error('生成综合测试失败:', error);
}
