/**
 * 数学题目生成器
 * 支持加减乘除、分数、小数、百分比等运算
 * 题型生成逻辑委托给 src/questions/ 下的独立模块，通过注册表管理
 *
 * 题目工具函数（选项生成、答案校验、选择题格式转换）请使用 questionUtils.js。
 */
import { getGradeRange, getGradeOperations } from '../config/grades';
import { generate as registryGenerate, register } from '../questions/registry';
import { gradeQuestionWeights } from '../config/gradeQuestionWeights';
import { getAvailableTypesForGrade } from '../config/questionTypes';
import { getAdjustedWeights } from '../config/knowledgeWeights';
import { useMathKnowledgeStore } from '../store/mathKnowledgeStore';
import { randomInt } from '../questions/_helpers';

// 显式导入所有题型生成器（非 side-effect import，避免 tree-shaking 移除）
import generateAddition from '../questions/addition';
import generateSubtraction from '../questions/subtraction';
import generateMultiplication from '../questions/multiplication';
import generateDivision from '../questions/division';
import generateMixedOperation from '../questions/mixed';
import generateFraction from '../questions/fraction';
import generateDecimal from '../questions/decimal';
import generatePercentage from '../questions/percentage';
import generateWordProblem from '../questions/wordProblem';
import generateNumberFill from '../questions/numberFill';
import generateEstimate from '../questions/estimate';
import generateEquation from '../questions/equation';

// 显式注册所有题型，确保 tree-shaking 安全
register('add', generateAddition);
register('subtract', generateSubtraction);
register('multiply', generateMultiplication);
register('divide', generateDivision);
register('mixed', generateMixedOperation);
register('fraction', generateFraction);
register('decimal', generateDecimal);
register('percentage', generatePercentage);
register('word', generateWordProblem);
register('numberFill', generateNumberFill);
register('estimate', generateEstimate);
register('equation', generateEquation);

/**
 * 加权随机选择
 * 根据权重对象返回一个键，权重越高被选中的概率越大
 * @param {Object} weights - { type: weight, ... }
 * @returns {string} 选中的类型键
 */
function weightedRandom(weights) {
  const entries = Object.entries(weights);
  const totalWeight = entries.reduce((sum, [, w]) => sum + w, 0);
  let random = Math.random() * totalWeight;
  for (const [type, weight] of entries) {
    random -= weight;
    if (random <= 0) return type;
  }
  return entries[entries.length - 1][0];
}

/**
 * 根据年级生成题目
 */
export function generateQuestion(grade = 1, questionType = 'random') {
  const range = getGradeRange(grade);
  const operations = getGradeOperations(grade);
  
  if (questionType === 'random') {
    const gradeWeights = gradeQuestionWeights[grade];
    if (gradeWeights) {
      // 使用权重策略选择题型
      const availableTypes = getAvailableTypesForGrade(grade);
      const filteredWeights = {};
      for (const type of availableTypes) {
        if (gradeWeights[type] !== undefined) {
          filteredWeights[type] = gradeWeights[type];
        }
      }
      if (Object.keys(filteredWeights).length > 0) {
        // ★ 注入错题反馈权重
        const mathKnowledgeStore = useMathKnowledgeStore();
        const adjustedWeights = getAdjustedWeights(grade, filteredWeights, mathKnowledgeStore);
        questionType = weightedRandom(adjustedWeights);
      } else {
        // Fallback: 等概率选择可用题型
        questionType = availableTypes[randomInt(0, availableTypes.length - 1)];
      }
    } else {
      // Fallback: 权重配置不存在，回退到原有等概率逻辑
      const availableTypes = [];
      if (operations.includes('add')) availableTypes.push('add');
      if (operations.includes('subtract')) availableTypes.push('subtract');
      if (operations.includes('multiply')) availableTypes.push('multiply');
      if (operations.includes('divide')) availableTypes.push('divide');
      if (operations.includes('fraction')) availableTypes.push('fraction');
      if (operations.includes('decimal')) availableTypes.push('decimal');
      if (operations.includes('percentage')) availableTypes.push('percentage');
      // 1-3 年级可以生成应用题
      if (grade <= 3 && Math.random() < 0.3) {
        availableTypes.push('word');
      }
      if (grade >= 3 && operations.includes('multiply') && operations.includes('add')) {
        availableTypes.push('mixed');
      }
      questionType = availableTypes[randomInt(0, availableTypes.length - 1)];
    }
  }
  
  // 统一走注册表生成题目（word 类型已通过 src/questions/wordProblem.js 注册）
  let question = registryGenerate(questionType, grade, range);
  if (!question) {
    // fallback 到加法
    question = registryGenerate('add', grade, range);
  }
  // 使用扩展运算符创建新对象，避免修改注册表返回的共享引用
  question = {
    ...question,
    grade,
    difficulty: getDifficulty(grade, questionType),
    id: generateQuestionId(),
    createdAt: new Date().toISOString()
  };
  
  return question;
}

/**
 * 计算题目难度
 */
function getDifficulty(grade, type) {
  const easyTypes = ['add', 'subtract'];
  const mediumTypes = ['multiply', 'divide', 'word'];
  
  if (easyTypes.includes(type)) return 'easy';
  if (mediumTypes.includes(type)) return 'medium';
  return 'hard';
}

/**
 * 生成题目 ID
 */
function generateQuestionId() {
  return 'q_' + Date.now() + '_' + Math.random().toString(36).slice(2, 11);
}

/**
 * 生成一组题目
 * 当 types 数组不为空时，按权重配置分发题型（而非等概率）；
 * 为空时由 generateQuestion(grade, 'random') 按全量权重分发。
 */
export function generateQuestionSet(grade, count = 10, options = {}) {
  const {
    types = [],
    difficulty = 'random'
  } = options;

  // --- 确定题型选择策略 ---
  let pickType;
  if (types.length > 0) {
    const gradeWeights = gradeQuestionWeights[grade];
    if (gradeWeights) {
      // 从 gradeWeights 中过滤出只包含 types 指定且有权重的条目
      const filteredWeights = {};
      for (const t of types) {
        if (gradeWeights[t] !== undefined) {
          filteredWeights[t] = gradeWeights[t];
        }
      }
      if (Object.keys(filteredWeights).length > 0) {
        // ★ 注入错题反馈权重
        const mathKnowledgeStore = useMathKnowledgeStore();
        const adjustedWeights = getAdjustedWeights(grade, filteredWeights, mathKnowledgeStore);
        pickType = () => weightedRandom(adjustedWeights);
      } else {
        // 备选：指定题型都无权重时回退等概率
        pickType = () => types[randomInt(0, types.length - 1)];
      }
    } else {
      // 年级权重配置不存在时回退等概率
      pickType = () => types[randomInt(0, types.length - 1)];
    }
  } else {
    // types 为空 → 委托 generateQuestion 使用完整权重
    pickType = () => 'random';
  }

  const questions = [];

  for (let i = 0; i < count; i++) {
    let question;
    let attempts = 0;

    do {
      const type = pickType();
      question = generateQuestion(grade, type);
      attempts++;
    } while (
      difficulty !== 'random' &&
      question.difficulty !== difficulty &&
      attempts < 10
    );

    questions.push(question);
  }

  return questions;
}

export default {
  generateQuestion,
  generateQuestionSet
};
