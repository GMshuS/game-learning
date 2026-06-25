/**
 * 小数题目生成器
 * 支持：小数加减、小数乘除
 */
import { register } from './registry';
import { randomInt } from './_helpers';

/**
 * 生成小数加减题目（原有逻辑）
 * @param {number} grade
 * @param {object} range
 * @returns {{ question: string, answer: number } | null}
 */
function generateAddSub(grade, range) {
  const decimalPlaces = grade >= 5 ? 1 : 2;
  const multiplier = Math.pow(10, decimalPlaces);

  const a = randomInt(1, range.max * multiplier) / multiplier;
  const b = randomInt(1, a * multiplier) / multiplier;

  const operation = Math.random() > 0.5 ? '+' : '-';
  const answer = operation === '+' ? a + b : a - b;

  return {
    question: `${a.toFixed(decimalPlaces)} ${operation === '+' ? '+' : '-'} ${b.toFixed(decimalPlaces)} = ?`,
    answer: parseFloat(answer.toFixed(decimalPlaces)),
    type: 'decimal',
    operands: [a, b],
    operator: operation,
    decimalPlaces
  };
}

/**
 * 生成小数乘法题目
 * 如：2.5 × 0.4 = 1.0
 * @returns {{ question: string, answer: number }}
 */
function generateMultiplication() {
  // 生成两个小数，乘积保留1-2位小数
  const dp1 = randomInt(1, 2);
  const dp2 = randomInt(1, 2);
  const m1 = Math.pow(10, dp1);
  const m2 = Math.pow(10, dp2);

  const aInt = randomInt(1, 99);
  const bInt = randomInt(1, 99);
  const a = aInt / m1;
  const b = bInt / m2;

  const rawAnswer = a * b;
  // 四舍五入到最多4位小数（避免浮点精度问题）
  const answer = Math.round(rawAnswer * 10000) / 10000;

  const displayDp = Math.max(dp1, dp2);

  return {
    question: `${a.toFixed(dp1)} × ${b.toFixed(dp2)} = ?`,
    answer: answer,
    type: 'decimal',
    operands: [a, b],
    operator: '×',
    decimalPlaces: displayDp
  };
}

/**
 * 生成小数除法题目
 * 如：7.5 ÷ 2.5 = 3
 * 保证结果为有限小数（不超过3位）
 * @returns {{ question: string, answer: number }}
 */
function generateDivision() {
  // 构造 b × c = a 的形式，保证整除或有限结果
  const dp = randomInt(1, 2);
  const m = Math.pow(10, dp);

  let c, b;
  // 选一个整数结果 c
  c = randomInt(1, 30);
  // 选一个除数 b（小数）
  const bInt = randomInt(1, 99);
  b = bInt / m;
  // 被除数 a = b * c
  const a = parseFloat((b * c).toFixed(dp + 1));

  return {
    question: `${a.toFixed(dp + 1)} ÷ ${b.toFixed(dp)} = ?`,
    answer: Math.round(c * 1000) / 1000,
    type: 'decimal',
    operands: [a, b],
    operator: '÷',
    decimalPlaces: dp
  };
}

/**
 * 生成小数题目
 * @param {number} grade - 年级
 * @param {object} range - 数字范围 { min, max }
 * @returns {{ question: string, answer: number, type: string, operands: number[], operator: string, decimalPlaces: number }}
 */
function generateDecimal(grade, range) {
  if (grade >= 4) {
    // 4-6年级：加减 + 乘除
    const rand = Math.random();
    if (rand < 0.35) {
      return generateAddSub(grade, range);
    } else if (rand < 0.65) {
      return generateMultiplication();
    } else {
      return generateDivision();
    }
  } else {
    // 1-3年级：仅小数加减
    return generateAddSub(grade, range);
  }
}

register('decimal', generateDecimal);

export default generateDecimal;
