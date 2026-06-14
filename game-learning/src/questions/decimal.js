/**
 * 小数题目生成器
 */
import { register } from './registry';
import { randomInt } from './_helpers';

/**
 * 生成小数题目
 * @param {number} grade - 年级
 * @param {object} range - 数字范围 { min, max }
 * @returns {{ question: string, answer: number, type: string, operands: number[], operator: string, decimalPlaces: number }}
 */
function generateDecimal(grade, range) {
  const decimalPlaces = grade >= 5 ? 1 : 2;
  const multiplier = Math.pow(10, decimalPlaces);

  const a = randomInt(1, range.max * multiplier) / multiplier;
  const b = randomInt(1, a * multiplier) / multiplier; // 确保 a >= b

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

register('decimal', generateDecimal);

export default generateDecimal;
