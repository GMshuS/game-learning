/**
 * 题目工具函数
 * 从 questionBank.js 迁移而来的辅助功能：选项生成、答案校验、选择题格式转换、题库缓存等
 * 
 * 统一入口：题目生成请使用 questionGenerator.js，本模块仅提供工具性函数。
 */
import { generateQuestion } from './questionGenerator.js';

/**
 * 题目缓存
 */
let questionCache = new Map();

/**
 * 从题库获取题目（带缓存）
 * @param {number} grade 年级
 * @param {string} type 题型
 * @param {number} count 数量
 * @param {Function} [generateFn] 题目生成函数，默认使用 questionGenerator.js
 */
export function getQuestionsFromBank(grade, type, count = 10, generateFn) {
  const key = `g${grade}_${type}`;

  if (questionCache.has(key)) {
    const cached = questionCache.get(key);
    if (cached.length >= count) {
      return shuffleArray(cached).slice(0, count);
    }
  }

  // 如果缓存不足，生成新题目
  const gen = generateFn || generateQuestion;
  const questions = generateQuestionsForBank(grade, type, count, gen);
  questionCache.set(key, questions);

  return shuffleArray(questions).slice(0, count);
}

/**
 * 为题库生成题目
 */
function generateQuestionsForBank(grade, type, count, generateFn) {
  const questions = [];
  for (let i = 0; i < count; i++) {
    const question = generateFn(grade, type);
    questions.push(question);
  }
  return questions;
}

/**
 * 清空题目缓存
 */
export function clearQuestionCache() {
  questionCache.clear();
}

/**
 * 数组乱序（Fisher-Yates）
 */
export function shuffleArray(array) {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}

/**
 * 生成干扰选项（用于选择题）
 * @param {number} correctAnswer 正确答案
 * @param {number} count 需要生成的干扰项数量
 * @param {object} [options] 配置项
 * @param {number} [options.range=20] 干扰项偏移范围
 * @param {boolean} [options.avoidZero=false] 是否避免生成 0
 * @returns {number[]} 干扰项数组
 */
export function generateWrongOptions(correctAnswer, count = 3, options = {}) {
  const {
    range = 20,
    avoidZero = false
  } = options;

  const wrongOptions = new Set();
  const MAX_ATTEMPTS = 1000;
  let attempts = 0;

  while (wrongOptions.size < count && attempts < MAX_ATTEMPTS) {
    attempts++;
    const offset = Math.floor(Math.random() * range) + 1;
    const sign = Math.random() > 0.5 ? 1 : -1;
    let wrongAnswer = correctAnswer + (offset * sign);

    // 确保是整数（如果正确答案是整数）
    if (Number.isInteger(correctAnswer)) {
      wrongAnswer = Math.round(wrongAnswer);
    }

    // 避免 0
    if (avoidZero && wrongAnswer === 0) {
      continue;
    }

    // 避免与正确答案相同
    if (wrongAnswer !== correctAnswer) {
      wrongOptions.add(wrongAnswer);
    }
  }

  // 保底填充：若未生成足够干扰项，用递增值填充
  let fallback = 1;
  while (wrongOptions.size < count) {
    const fallbackOption = correctAnswer + fallback;
    if ((!avoidZero || fallbackOption !== 0) && fallbackOption !== correctAnswer) {
      wrongOptions.add(fallbackOption);
    }
    fallback++;
  }

  return Array.from(wrongOptions);
}

/**
 * 将题目转换为选择题格式
 * @param {object} question 题目对象（须含 answer 字段）
 * @param {number} [optionCount=4] 选项总数
 * @returns {object} 包含 options 和 correctOption 的题目对象
 */
export function questionToMultipleChoice(question, optionCount = 4) {
  const correctAnswer = question.answer;
  const wrongOptions = generateWrongOptions(correctAnswer, optionCount - 1, {
    avoidZero: correctAnswer !== 0
  });

  // 随机排列选项
  const allOptions = shuffleArray([correctAnswer, ...wrongOptions]);

  return {
    ...question,
    format: 'multipleChoice',
    options: allOptions,
    correctOption: allOptions.indexOf(correctAnswer)
  };
}

/**
 * 验证答案
 * @param {object} question 题目对象
 * @param {number} userAnswer 用户答案
 * @param {number} [tolerance=0.01] 容差
 * @returns {{ correct: boolean, correctAnswer: number, userAnswer: number, knowledgeId: string }}
 */
export function checkAnswer(question, userAnswer, tolerance = 0.01) {
  const correct = Math.abs(userAnswer - question.answer) <= tolerance;
  return {
    correct,
    correctAnswer: question.answer,
    userAnswer,
    knowledgeId: question.type
  };
}

/**
 * 获取年级知识点列表
 */
export function getGradeTopics(grade) {
  const topics = {
    1: ['20 以内加减法', '认识数字', '比较大小', '简单应用题'],
    2: ['100 以内加减法', '乘法入门', '长度单位', '时间认识'],
    3: ['乘除法', '混合运算', '面积计算', '分数入门'],
    4: ['大数运算', '四则混合运算', '几何图形', '小数入门'],
    5: ['分数运算', '小数运算', '百分比', '简易方程'],
    6: ['比例', '百分比应用', '圆的面积', '数据统计']
  };
  return topics[grade] || topics[1];
}

/**
 * 根据知识点筛选题目
 * @param {number} grade 年级
 * @param {string} topic 知识点名称
 * @param {number} count 数量
 * @param {Function} [generateFn] 题目生成函数
 */
export function getQuestionsByTopic(grade, topic, count = 10, generateFn) {
  const topicTypeMap = {
    '20 以内加减法': ['add', 'subtract'],
    '100 以内加减法': ['add', 'subtract'],
    '乘法入门': ['multiply'],
    '乘除法': ['multiply', 'divide'],
    '混合运算': ['mixed'],
    '分数运算': ['fraction'],
    '小数运算': ['decimal'],
    '百分比': ['percentage'],
    '简单应用题': ['word']
  };

  const gen = generateFn || generateQuestion;
  const types = topicTypeMap[topic] || ['add', 'subtract'];
  const questions = [];

  for (let i = 0; i < count; i++) {
    const type = types[Math.floor(Math.random() * types.length)];
    questions.push(gen(grade, type));
  }

  return questions;
}

export default {
  getQuestionsFromBank,
  clearQuestionCache,
  shuffleArray,
  generateWrongOptions,
  questionToMultipleChoice,
  checkAnswer,
  getGradeTopics,
  getQuestionsByTopic
};
