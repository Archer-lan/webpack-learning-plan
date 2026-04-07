/**
 * AssessmentEngine - 单元测试
 */

import * as fs from 'fs';
import * as path from 'path';
import { AssessmentEngine } from './AssessmentEngine';
import { Quiz, Answer, QuizResult } from '../types';

describe('AssessmentEngine', () => {
  const testModulesPath = path.join(__dirname, '../../test-data/modules');
  const testDataPath = path.join(__dirname, '../../test-data/assessment-data');
  let engine: AssessmentEngine;

  beforeEach(() => {
    // 清理测试数据目录
    if (fs.existsSync(testDataPath)) {
      fs.rmSync(testDataPath, { recursive: true, force: true });
    }
    fs.mkdirSync(testDataPath, { recursive: true });

    // 创建测试模块目录
    if (!fs.existsSync(testModulesPath)) {
      fs.mkdirSync(testModulesPath, { recursive: true });
    }

    engine = new AssessmentEngine(testModulesPath, testDataPath);
  });

  afterEach(() => {
    // 清理测试数据
    if (fs.existsSync(testDataPath)) {
      fs.rmSync(testDataPath, { recursive: true, force: true });
    }
  });

  describe('getModuleQuiz', () => {
    it('应该成功获取模块测试题', () => {
      // 创建测试模块和测试题
      const moduleId = '01-test-module';
      const modulePath = path.join(testModulesPath, moduleId);
      fs.mkdirSync(modulePath, { recursive: true });

      const quiz: Quiz = {
        id: 'quiz-01',
        moduleId: moduleId,
        title: '测试题',
        questions: [
          {
            id: 'q1',
            type: 'multiple-choice',
            question: '什么是 webpack？',
            options: ['打包工具', '编译器', '运行时'],
            correctAnswer: '打包工具',
            explanation: 'webpack 是一个模块打包工具',
            points: 10,
            relatedLesson: '01-basics/01-intro'
          }
        ],
        passingScore: 70
      };

      fs.writeFileSync(
        path.join(modulePath, 'quiz.json'),
        JSON.stringify(quiz, null, 2)
      );

      const result = engine.getModuleQuiz(moduleId);

      expect(result.id).toBe('quiz-01');
      expect(result.moduleId).toBe(moduleId);
      expect(result.questions).toHaveLength(1);
    });

    it('当测试题不存在时应该抛出错误', () => {
      expect(() => {
        engine.getModuleQuiz('non-existent-module');
      }).toThrow('Quiz not found for module: non-existent-module');
    });

    it('当测试题格式无效时应该抛出错误', () => {
      const moduleId = '02-invalid-module';
      const modulePath = path.join(testModulesPath, moduleId);
      fs.mkdirSync(modulePath, { recursive: true });

      // 写入无效的 JSON
      fs.writeFileSync(
        path.join(modulePath, 'quiz.json'),
        '{ invalid json }'
      );

      expect(() => {
        engine.getModuleQuiz(moduleId);
      }).toThrow('Invalid JSON format');
    });
  });

  describe('submitQuiz', () => {
    beforeEach(() => {
      // 创建测试模块和测试题
      const moduleId = '01-test-module';
      const modulePath = path.join(testModulesPath, moduleId);
      fs.mkdirSync(modulePath, { recursive: true });

      const quiz: Quiz = {
        id: 'quiz-01',
        moduleId: moduleId,
        title: '测试题',
        questions: [
          {
            id: 'q1',
            type: 'multiple-choice',
            question: '什么是 webpack？',
            options: ['打包工具', '编译器', '运行时'],
            correctAnswer: '打包工具',
            explanation: 'webpack 是一个模块打包工具',
            points: 10,
            relatedLesson: '01-basics/01-intro'
          },
          {
            id: 'q2',
            type: 'true-false',
            question: 'webpack 只能打包 JavaScript 文件',
            correctAnswer: 'false',
            explanation: 'webpack 可以通过 loader 处理各种类型的文件',
            points: 10,
            relatedLesson: '01-basics/02-loaders'
          }
        ],
        passingScore: 14
      };

      fs.writeFileSync(
        path.join(modulePath, 'quiz.json'),
        JSON.stringify(quiz, null, 2)
      );
    });

    it('应该正确评分全部答对的情况', () => {
      const answers: Answer[] = [
        { questionId: 'q1', answer: '打包工具' },
        { questionId: 'q2', answer: 'false' }
      ];

      const result = engine.submitQuiz('quiz-01', answers);

      expect(result.score).toBe(20);
      expect(result.totalPoints).toBe(20);
      expect(result.percentage).toBe(100);
      expect(result.answers).toHaveLength(2);
      expect(result.answers.every(a => a.isCorrect)).toBe(true);
    });

    it('应该正确评分部分答对的情况', () => {
      const answers: Answer[] = [
        { questionId: 'q1', answer: '打包工具' },
        { questionId: 'q2', answer: 'true' } // 错误答案
      ];

      const result = engine.submitQuiz('quiz-01', answers);

      expect(result.score).toBe(10);
      expect(result.totalPoints).toBe(20);
      expect(result.percentage).toBe(50);
      expect(result.answers[0].isCorrect).toBe(true);
      expect(result.answers[1].isCorrect).toBe(false);
    });

    it('应该正确评分全部答错的情况', () => {
      const answers: Answer[] = [
        { questionId: 'q1', answer: '编译器' },
        { questionId: 'q2', answer: 'true' }
      ];

      const result = engine.submitQuiz('quiz-01', answers);

      expect(result.score).toBe(0);
      expect(result.totalPoints).toBe(20);
      expect(result.percentage).toBe(0);
      expect(result.answers.every(a => !a.isCorrect)).toBe(true);
    });

    it('应该处理未回答的题目', () => {
      const answers: Answer[] = [
        { questionId: 'q1', answer: '打包工具' }
        // q2 未回答
      ];

      const result = engine.submitQuiz('quiz-01', answers);

      expect(result.score).toBe(10);
      expect(result.answers).toHaveLength(2);
      expect(result.answers[1].userAnswer).toBe('');
      expect(result.answers[1].isCorrect).toBe(false);
    });

    it('应该保存测试结果到历史记录', () => {
      const answers: Answer[] = [
        { questionId: 'q1', answer: '打包工具' },
        { questionId: 'q2', answer: 'false' }
      ];

      engine.submitQuiz('quiz-01', answers);

      const history = engine.getQuizHistory('01-test-module');
      expect(history).toHaveLength(1);
      expect(history[0].results).toHaveLength(1);
      expect(history[0].results[0].score).toBe(20);
    });

    it('当测试题不存在时应该抛出错误', () => {
      const answers: Answer[] = [];

      expect(() => {
        engine.submitQuiz('non-existent-quiz', answers);
      }).toThrow('Quiz not found: non-existent-quiz');
    });
  });

  describe('getQuizHistory', () => {
    it('应该返回指定模块的历史记录', () => {
      // 创建测试数据
      const moduleId = '01-test-module';
      const modulePath = path.join(testModulesPath, moduleId);
      fs.mkdirSync(modulePath, { recursive: true });

      const quiz: Quiz = {
        id: 'quiz-01',
        moduleId: moduleId,
        title: '测试题',
        questions: [
          {
            id: 'q1',
            type: 'multiple-choice',
            question: '测试问题',
            correctAnswer: 'A',
            explanation: '解析',
            points: 10,
            relatedLesson: 'lesson-01'
          }
        ],
        passingScore: 7
      };

      fs.writeFileSync(
        path.join(modulePath, 'quiz.json'),
        JSON.stringify(quiz, null, 2)
      );

      // 提交两次测试
      engine.submitQuiz('quiz-01', [{ questionId: 'q1', answer: 'A' }]);
      engine.submitQuiz('quiz-01', [{ questionId: 'q1', answer: 'B' }]);

      const history = engine.getQuizHistory(moduleId);

      expect(history).toHaveLength(1);
      expect(history[0].results).toHaveLength(2);
    });

    it('当没有历史记录时应该返回空数组', () => {
      const history = engine.getQuizHistory('non-existent-module');
      expect(history).toEqual([]);
    });
  });

  describe('getLearningRecommendations', () => {
    it('当得分低于70%时应该建议重新学习', () => {
      const result: QuizResult = {
        quizId: 'quiz-01',
        score: 60,
        totalPoints: 100,
        percentage: 60,
        answers: [],
        completedAt: new Date().toISOString()
      };

      const recommendations = engine.getLearningRecommendations(result);

      expect(recommendations.shouldReview).toBe(true);
      expect(recommendations.recommendations.length).toBeGreaterThan(0);
    });

    it('当得分达到70%或以上时不应该建议重新学习', () => {
      const result: QuizResult = {
        quizId: 'quiz-01',
        score: 80,
        totalPoints: 100,
        percentage: 80,
        answers: [],
        completedAt: new Date().toISOString()
      };

      const recommendations = engine.getLearningRecommendations(result);

      expect(recommendations.shouldReview).toBe(false);
      expect(recommendations.recommendations).toEqual([]);
      expect(recommendations.relatedLessons).toEqual([]);
    });
  });

  describe('getWrongAnswersFeedback', () => {
    beforeEach(() => {
      // 创建测试模块和测试题
      const moduleId = '01-test-module';
      const modulePath = path.join(testModulesPath, moduleId);
      fs.mkdirSync(modulePath, { recursive: true });

      const quiz: Quiz = {
        id: 'quiz-01',
        moduleId: moduleId,
        title: '测试题',
        questions: [
          {
            id: 'q1',
            type: 'multiple-choice',
            question: '什么是 webpack？',
            correctAnswer: '打包工具',
            explanation: 'webpack 是一个模块打包工具',
            points: 10,
            relatedLesson: '01-basics/01-intro'
          },
          {
            id: 'q2',
            type: 'true-false',
            question: 'webpack 只能打包 JavaScript 文件',
            correctAnswer: 'false',
            explanation: 'webpack 可以通过 loader 处理各种类型的文件',
            points: 10,
            relatedLesson: '01-basics/02-loaders'
          }
        ],
        passingScore: 14
      };

      fs.writeFileSync(
        path.join(modulePath, 'quiz.json'),
        JSON.stringify(quiz, null, 2)
      );
    });

    it('应该返回所有错题的反馈', () => {
      const result: QuizResult = {
        quizId: 'quiz-01',
        score: 10,
        totalPoints: 20,
        percentage: 50,
        answers: [
          { questionId: 'q1', userAnswer: '打包工具', isCorrect: true },
          { questionId: 'q2', userAnswer: 'true', isCorrect: false }
        ],
        completedAt: new Date().toISOString()
      };

      const feedback = engine.getWrongAnswersFeedback('quiz-01', result);

      expect(feedback).toHaveLength(1);
      expect(feedback[0].question.id).toBe('q2');
      expect(feedback[0].userAnswer).toBe('true');
      expect(feedback[0].correctAnswer).toBe('false');
      expect(feedback[0].explanation).toBeTruthy();
    });

    it('当全部答对时应该返回空数组', () => {
      const result: QuizResult = {
        quizId: 'quiz-01',
        score: 20,
        totalPoints: 20,
        percentage: 100,
        answers: [
          { questionId: 'q1', userAnswer: '打包工具', isCorrect: true },
          { questionId: 'q2', userAnswer: 'false', isCorrect: true }
        ],
        completedAt: new Date().toISOString()
      };

      const feedback = engine.getWrongAnswersFeedback('quiz-01', result);

      expect(feedback).toEqual([]);
    });
  });

  describe('generateFinalExam', () => {
    it('应该能够生成综合测试', () => {
      // 创建多个模块的测试题
      for (let i = 1; i <= 2; i++) {
        const moduleId = `0${i}-module`;
        const modulePath = path.join(testModulesPath, moduleId);
        fs.mkdirSync(modulePath, { recursive: true });

        const quiz: Quiz = {
          id: `quiz-0${i}`,
          moduleId: moduleId,
          title: `模块 ${i} 测试`,
          questions: [
            {
              id: `q${i}-1`,
              type: 'multiple-choice',
              question: `问题 ${i}-1`,
              correctAnswer: 'A',
              explanation: '解析',
              points: 10,
              relatedLesson: `lesson-${i}`
            },
            {
              id: `q${i}-2`,
              type: 'true-false',
              question: `问题 ${i}-2`,
              correctAnswer: 'true',
              explanation: '解析',
              points: 10,
              relatedLesson: `lesson-${i}`
            }
          ],
          passingScore: 14
        };

        fs.writeFileSync(
          path.join(modulePath, 'quiz.json'),
          JSON.stringify(quiz, null, 2)
        );
      }

      const finalExam = engine.generateFinalExam();

      expect(finalExam.id).toBe('final-exam');
      expect(finalExam.questions.length).toBeGreaterThan(0);
      expect(finalExam.passingScore).toBeGreaterThan(0);
    });
  });
});
