/**
 * AssessmentEngine - 评估组件
 * 
 * 负责知识评估和测试
 */

import * as fs from 'fs';
import * as path from 'path';
import {
  Quiz,
  QuizResult,
  QuizHistory,
  Answer,
  Question
} from '../types';

export class AssessmentEngine {
  private modulesPath: string;
  private dataPath: string;
  private historyFilePath: string;

  constructor(
    modulesPath: string = path.join(process.cwd(), 'modules'),
    dataPath: string = path.join(process.cwd(), 'data')
  ) {
    this.modulesPath = modulesPath;
    this.dataPath = dataPath;
    this.historyFilePath = path.join(dataPath, 'quiz-history.json');

    // 确保数据目录存在
    if (!fs.existsSync(dataPath)) {
      fs.mkdirSync(dataPath, { recursive: true });
    }

    // 如果历史记录文件不存在，创建空记录
    if (!fs.existsSync(this.historyFilePath)) {
      this.saveHistory([]);
    }
  }

  /**
   * 获取模块测试题
   */
  getModuleQuiz(moduleId: string): Quiz {
    const quizPath = path.join(this.modulesPath, moduleId, 'quiz.json');

    if (!fs.existsSync(quizPath)) {
      throw new Error(`Quiz not found for module: ${moduleId}`);
    }

    try {
      const quizData = fs.readFileSync(quizPath, 'utf-8');
      const quiz: Quiz = JSON.parse(quizData);

      // 验证测试题格式
      if (!quiz.id || !quiz.moduleId || !Array.isArray(quiz.questions)) {
        throw new Error(`Invalid quiz format for module: ${moduleId}`);
      }

      return quiz;
    } catch (error) {
      if (error instanceof SyntaxError) {
        throw new Error(`Invalid JSON format in quiz file for module: ${moduleId}`);
      }
      throw error;
    }
  }

  /**
   * 提交测试答案并评分
   */
  submitQuiz(quizId: string, answers: Answer[]): QuizResult {
    // 查找对应的测试题
    const quiz = this.findQuizById(quizId);

    if (!quiz) {
      throw new Error(`Quiz not found: ${quizId}`);
    }

    // 计算得分和正确率
    let score = 0;
    const totalPoints = quiz.questions.reduce((sum, q) => sum + q.points, 0);
    const answerResults: QuizResult['answers'] = [];

    for (const question of quiz.questions) {
      const userAnswer = answers.find(a => a.questionId === question.id);
      
      if (!userAnswer) {
        // 未回答的题目
        answerResults.push({
          questionId: question.id,
          userAnswer: '',
          isCorrect: false
        });
        continue;
      }

      // 判断答案是否正确
      const isCorrect = this.checkAnswer(question, userAnswer.answer);

      if (isCorrect) {
        score += question.points;
      }

      answerResults.push({
        questionId: question.id,
        userAnswer: userAnswer.answer,
        isCorrect: isCorrect
      });
    }

    const percentage = totalPoints > 0 ? Math.round((score / totalPoints) * 100) : 0;

    const result: QuizResult = {
      quizId: quizId,
      score: score,
      totalPoints: totalPoints,
      percentage: percentage,
      answers: answerResults,
      completedAt: new Date().toISOString()
    };

    // 保存测试结果到历史记录
    this.saveQuizResult(quiz.moduleId, result);

    return result;
  }

  /**
   * 获取历史测试记录
   */
  getQuizHistory(moduleId: string): QuizHistory[] {
    const allHistory = this.loadHistory();
    return allHistory.filter(h => h.moduleId === moduleId);
  }

  /**
   * 生成综合测试
   */
  generateFinalExam(): Quiz {
    const finalExamPath = path.join(this.dataPath, '..', 'assessments', 'final-exam.json');

    if (fs.existsSync(finalExamPath)) {
      try {
        const examData = fs.readFileSync(finalExamPath, 'utf-8');
        return JSON.parse(examData);
      } catch (error) {
        console.warn('Failed to load final exam from file, generating from modules');
      }
    }

    // 如果没有预定义的综合测试，从所有模块中抽取题目生成
    return this.generateExamFromModules();
  }

  /**
   * 获取错题反馈（包含正确答案和解析）
   */
  getWrongAnswersFeedback(quizId: string, result: QuizResult): Array<{
    question: Question;
    userAnswer: string | string[];
    correctAnswer: string | string[];
    explanation: string;
  }> {
    const quiz = this.findQuizById(quizId);

    if (!quiz) {
      throw new Error(`Quiz not found: ${quizId}`);
    }

    const feedback: Array<{
      question: Question;
      userAnswer: string | string[];
      correctAnswer: string | string[];
      explanation: string;
    }> = [];

    for (const answerResult of result.answers) {
      if (!answerResult.isCorrect) {
        const question = quiz.questions.find(q => q.id === answerResult.questionId);
        
        if (question) {
          feedback.push({
            question: question,
            userAnswer: answerResult.userAnswer,
            correctAnswer: question.correctAnswer,
            explanation: question.explanation
          });
        }
      }
    }

    return feedback;
  }

  /**
   * 获取学习建议（针对低分情况）
   */
  getLearningRecommendations(result: QuizResult): {
    shouldReview: boolean;
    recommendations: string[];
    relatedLessons: string[];
  } {
    const shouldReview = result.percentage < 70;

    if (!shouldReview) {
      return {
        shouldReview: false,
        recommendations: [],
        relatedLessons: []
      };
    }

    const quiz = this.findQuizById(result.quizId);
    const recommendations: string[] = [];
    const relatedLessons: string[] = [];

    if (quiz) {
      // 收集答错题目的相关课程
      for (const answerResult of result.answers) {
        if (!answerResult.isCorrect) {
          const question = quiz.questions.find(q => q.id === answerResult.questionId);
          
          if (question && question.relatedLesson) {
            if (!relatedLessons.includes(question.relatedLesson)) {
              relatedLessons.push(question.relatedLesson);
            }
          }
        }
      }

      recommendations.push(
        `您的测试得分为 ${result.percentage}%，建议重新学习相关内容以巩固知识。`
      );

      if (relatedLessons.length > 0) {
        recommendations.push(
          `建议重点复习以下课程：${relatedLessons.join(', ')}`
        );
      }

      recommendations.push(
        '完成复习后，可以再次参加测试以检验学习效果。'
      );
    }

    return {
      shouldReview: true,
      recommendations: recommendations,
      relatedLessons: relatedLessons
    };
  }

  /**
   * 检查答案是否正确
   */
  private checkAnswer(question: Question, userAnswer: string | string[]): boolean {
    const correctAnswer = question.correctAnswer;

    // 处理数组类型答案（多选题）
    if (Array.isArray(correctAnswer) && Array.isArray(userAnswer)) {
      if (correctAnswer.length !== userAnswer.length) {
        return false;
      }
      
      const sortedCorrect = [...correctAnswer].sort();
      const sortedUser = [...userAnswer].sort();
      
      return sortedCorrect.every((ans, idx) => ans === sortedUser[idx]);
    }

    // 处理字符串类型答案（单选题、判断题、简答题）
    if (typeof correctAnswer === 'string' && typeof userAnswer === 'string') {
      // 对于简答题，进行不区分大小写和去除首尾空格的比较
      return correctAnswer.trim().toLowerCase() === userAnswer.trim().toLowerCase();
    }

    return false;
  }

  /**
   * 根据 ID 查找测试题
   */
  private findQuizById(quizId: string): Quiz | null {
    try {
      // 遍历所有模块查找测试题
      const moduleEntries = fs.readdirSync(this.modulesPath, { withFileTypes: true });

      for (const entry of moduleEntries) {
        if (entry.isDirectory()) {
          const quizPath = path.join(this.modulesPath, entry.name, 'quiz.json');
          
          if (fs.existsSync(quizPath)) {
            try {
              const quizData = fs.readFileSync(quizPath, 'utf-8');
              const quiz: Quiz = JSON.parse(quizData);
              
              if (quiz.id === quizId) {
                return quiz;
              }
            } catch (error) {
              console.warn(`Failed to parse quiz in module ${entry.name}`);
            }
          }
        }
      }

      // 检查综合测试
      const finalExamPath = path.join(this.dataPath, '..', 'assessments', 'final-exam.json');
      if (fs.existsSync(finalExamPath)) {
        try {
          const examData = fs.readFileSync(finalExamPath, 'utf-8');
          const exam: Quiz = JSON.parse(examData);
          
          if (exam.id === quizId) {
            return exam;
          }
        } catch (error) {
          console.warn('Failed to parse final exam');
        }
      }

      return null;
    } catch (error) {
      console.error('Error finding quiz:', error);
      return null;
    }
  }

  /**
   * 从所有模块生成综合测试
   */
  private generateExamFromModules(): Quiz {
    const allQuestions: Question[] = [];
    const moduleEntries = fs.readdirSync(this.modulesPath, { withFileTypes: true });

    for (const entry of moduleEntries) {
      if (entry.isDirectory()) {
        const quizPath = path.join(this.modulesPath, entry.name, 'quiz.json');
        
        if (fs.existsSync(quizPath)) {
          try {
            const quizData = fs.readFileSync(quizPath, 'utf-8');
            const quiz: Quiz = JSON.parse(quizData);
            
            // 从每个模块抽取部分题目
            const selectedQuestions = this.selectQuestionsFromQuiz(quiz, 3);
            allQuestions.push(...selectedQuestions);
          } catch (error) {
            console.warn(`Failed to load quiz from module ${entry.name}`);
          }
        }
      }
    }

    // 计算总分和及格分数
    const totalPoints = allQuestions.reduce((sum, q) => sum + q.points, 0);
    const passingScore = Math.ceil(totalPoints * 0.7);

    return {
      id: 'final-exam',
      moduleId: 'all',
      title: 'Webpack 学习方案综合测试',
      questions: allQuestions,
      passingScore: passingScore,
      timeLimit: 120
    };
  }

  /**
   * 从测试题中选择指定数量的题目
   */
  private selectQuestionsFromQuiz(quiz: Quiz, count: number): Question[] {
    if (quiz.questions.length <= count) {
      return quiz.questions;
    }

    // 简单的随机选择（可以改进为更智能的选择策略）
    const shuffled = [...quiz.questions].sort(() => Math.random() - 0.5);
    return shuffled.slice(0, count);
  }

  /**
   * 保存测试结果到历史记录
   */
  private saveQuizResult(moduleId: string, result: QuizResult): void {
    const history = this.loadHistory();

    // 查找或创建该模块的历史记录
    let moduleHistory = history.find(h => h.moduleId === moduleId);

    if (!moduleHistory) {
      moduleHistory = {
        quizId: result.quizId,
        moduleId: moduleId,
        results: []
      };
      history.push(moduleHistory);
    }

    // 添加新的测试结果
    moduleHistory.results.push(result);

    // 保存到文件
    this.saveHistory(history);
  }

  /**
   * 从文件加载历史记录
   */
  private loadHistory(): QuizHistory[] {
    try {
      if (!fs.existsSync(this.historyFilePath)) {
        return [];
      }

      const data = fs.readFileSync(this.historyFilePath, 'utf-8');
      return JSON.parse(data);
    } catch (error) {
      console.warn('Failed to load quiz history, returning empty array');
      return [];
    }
  }

  /**
   * 保存历史记录到文件
   */
  private saveHistory(history: QuizHistory[]): void {
    try {
      const data = JSON.stringify(history, null, 2);
      fs.writeFileSync(this.historyFilePath, data, 'utf-8');
    } catch (error) {
      throw new Error(
        `Failed to save quiz history: ${error instanceof Error ? error.message : String(error)}`
      );
    }
  }
}
