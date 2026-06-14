/**
 * 乘法题目生成器
 */
import { register } from './registry';
import { randomInt } from './_helpers';

/**
 * 生成乘法题目
 * @param {number} grade - 年级
 * @param {object} range - 数字范围 { min, max }
 * @returns {{ question: string, answer: number, type: string, operands: number[], operator: string }}
 */
function generateMultiplication(grade, range) {
  // 乘除法使用较小的数字范围
  const maxFactor = Math.min(12, Math.floor(range.max / 10));
  const a = randomInt(2, maxFactor);
  const b = randomInt(2, maxFactor);
  return {
    question: `${a} × ${b} = ?`,
    answer: a * b,
    type: 'multiply',
    operands: [a, b],
    operator: '×'
  };
}

register('multiply', generateMultiplication);

export default generateMultiplication;
