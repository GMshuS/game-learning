/**
 * 题库管理系统
 * 支持题目的存储、检索、分类管理
 *
 * @deprecated 题目生成逻辑已由 questionGenerator.js + src/questions/ 注册表模式统一管理。
 *   本模块保留的缓存、选项生成、答案校验等功能将在后续版本迁移至独立的 utility 模块。
 *   新增题型请直接在 src/questions/ 下添加生成器并注册到 registry.js。
 */
import { generateQuestion } from './questionGenerator.js';

/**
 * 题目缓存
 */
let questionCache = new Map();

/**
 * 从题库获取题目
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
 * @param {number} grade 年级
 * @param {string} type 题型
 * @param {number} count 数量
 * @param {Function} generateFn 题目生成函数
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
 * 数组乱序
 */
function shuffleArray(array) {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}

/**
 * 生成干扰选项（用于选择题）
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
    // 生成接近正确答案的干扰项
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
 */
export function checkAnswer(question, userAnswer, tolerance = 0.01) {
  const correct = Math.abs(userAnswer - question.answer) <= tolerance;
  return {
    correct,
    correctAnswer: question.answer,
    userAnswer,
    knowledgeId: question.type  // 题型标识，与知识节点 id 一致
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
 * @param {Function} [generateFn] 题目生成函数，默认使用 questionGenerator.js
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
  generateWrongOptions,
  questionToMultipleChoice,
  checkAnswer,
  getGradeTopics,
  getQuestionsByTopic
};
