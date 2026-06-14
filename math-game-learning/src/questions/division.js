/**
 * 除法题目生成器（确保整除）
 */
import { register } from './registry';
import { randomInt } from './_helpers';

/**
 * 生成除法题目
 * @param {number} grade - 年级
 * @param {object} range - 数字范围 { min, max }
 * @returns {{ question: string, answer: number, type: string, operands: number[], operator: string }}
 */
function generateDivision(grade, range) {
  const maxFactor = Math.min(12, Math.floor(range.max / 10));
  const b = randomInt(2, maxFactor);
  const answer = randomInt(2, maxFactor);
  const a = b * answer; // 确保整除
  return {
    question: `${a} ÷ ${b} = ?`,
    answer: answer,
    type: 'divide',
    operands: [a, b],
    operator: '÷'
  };
}

register('divide', generateDivision);

export default generateDivision;
