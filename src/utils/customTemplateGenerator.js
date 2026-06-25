/**
 * 自定义模板题目生成器
 *
 * 从 customTemplateStore 中读取用户创建的模板，
 * 根据参数定义随机生成参数值，计算答案，生成题目对象。
 */
import { useCustomTemplateStore } from '../store/customTemplateStore';
import { safeEvaluate } from './safeEval';
import { randomInt } from '../questions/_helpers';

const MAX_RETRIES = 100;
const DEFAULT_CUSTOM_WEIGHT = 15;

/**
 * 从模板池中随机生成一道题目
 * @param {number} grade - 目标年级
 * @param {string} [subject='math'] - 学科
 * @returns {Object|null} 题目对象或 null（无匹配模板时）
 */
export function generate(grade, subject = 'math') {
  const store = useCustomTemplateStore();

  // 筛选匹配年级和学科的模板
  const candidates = store.templates.filter(t =>
    t.grade === grade && t.subject === subject
  );

  if (candidates.length === 0) return null;

  // 随机选择一个模板
  const template = candidates[randomInt(0, candidates.length - 1)];

  return generateFromTemplate(template);
}

/**
 * 从单个模板对象直接生成题目（不依赖 store）
 * 用于测试生成等场景，避免污染 store 状态
 * @param {Object} template - 完整的模板对象
 * @returns {Object|null} 题目对象或 null
 */
export function generateFromTemplate(template) {
  // 生成参数值
  const paramValues = generateParamValues(template.params);
  if (!paramValues) return null; // 无法生成有效参数

  // 计算答案
  const answer = safeEvaluate(template.answerFormula, paramValues);
  if (answer === undefined || answer === null || (typeof answer === 'number' && Number.isNaN(answer))) {
    return null;
  }

  // 填充模板文本
  let questionText = template.template;
  for (const [key, value] of Object.entries(paramValues)) {
    questionText = questionText.replace(new RegExp(`\\{${key}\\}`, 'g'), value);
  }

  return {
    question: questionText,
    answer: answer,
    options: generateOptions(answer), // 生成选项供选择题使用
    type: 'custom',
    knowledgeId: template.knowledgeId,
    difficulty: template.difficulty,
    grade: template.grade,
    id: 'q_' + Date.now() + '_' + Math.random().toString(36).slice(2, 9),
    createdAt: new Date().toISOString()
  };
}

/**
 * 根据参数定义生成随机参数值，满足所有 constraint
 * @param {Array<{name: string, type: string, range: [number, number], constraint?: string}>} params
 * @returns {Object|null} 参数值映射或 null（超出最大重试次数）
 */
function generateParamValues(params) {
  for (let attempt = 0; attempt < MAX_RETRIES; attempt++) {
    const values = {};
    let valid = true;

    for (const param of params) {
      const [min, max] = param.range;
      let val;
      if (param.type === 'float') {
        val = min + Math.random() * (max - min);
        val = Math.round(val * 100) / 100; // 2位小数
      } else {
        val = randomInt(min, max);
      }
      values[param.name] = val;
    }

    // 验证所有 constraint
    for (const param of params) {
      if (param.constraint && param.constraint.trim()) {
        try {
          const result = safeEvaluate(param.constraint, values);
          if (result === false) { valid = false; break; }
        } catch (e) {
          valid = false;
          break;
        }
      }
    }

    if (valid) return values;
  }

  return null; // 超出重试上限
}

/**
 * Fisher-Yates 洗牌算法（均匀随机打乱）
 * @param {Array} arr - 要打乱的数组
 * @returns {Array} 新打乱后的数组
 */
function shuffleArray(arr) {
  const result = [...arr];
  for (let i = result.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [result[i], result[j]] = [result[j], result[i]];
  }
  return result;
}

/**
 * 生成选项（4个选项，包含正确答案）
 * @param {number|string} correctAnswer - 正确答案
 * @returns {Array} 打乱后的选项数组
 */
function generateOptions(correctAnswer) {
  const options = [correctAnswer];
  const numValue = Number(correctAnswer);

  if (Number.isFinite(numValue)) {
    // 数学题：生成干扰项
    const offsets = [-3, -2, -1, 1, 2, 3, 5, 10];
    const shuffled = shuffleArray(offsets);
    for (const offset of shuffled) {
      const distractor = numValue + offset;
      if (distractor >= 0 && !options.includes(distractor)) {
        options.push(distractor);
      }
      if (options.length >= 4) break;
    }
    // 补位
    while (options.length < 4) {
      options.push(numValue + options.length);
    }
  } else {
    // 非数学题：填充假值
    while (options.length < 4) {
      options.push('选项' + (options.length + 1));
    }
  }

  // 打乱
  return shuffleArray(options);
}

/**
 * 获取 custom 题型的基础权重（有模板时返回 15，无模板时返回 0）
 * @param {number} grade - 目标年级
 * @param {string} [subject='math'] - 学科
 * @returns {number} 权重值
 */
export function getCustomWeight(grade, subject = 'math') {
  const store = useCustomTemplateStore();
  const count = store.templates.filter(t => t.grade === grade && t.subject === subject).length;
  return count > 0 ? DEFAULT_CUSTOM_WEIGHT : 0;
}

export default { generate, generateFromTemplate, getCustomWeight };
