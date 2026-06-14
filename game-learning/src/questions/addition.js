/**
 * 加法题目生成器
 */
import { register } from './registry';
import { randomInt } from './_helpers';

/**
 * 生成加法题目
 * @param {number} grade - 年级
 * @param {object} range - 数字范围 { min, max }
 * @returns {{ question: string, answer: number, type: string, operands: number[], operator: string }}
 */
function generateAddition(grade, range) {
  const a = randomInt(range.min, range.max);
  const b = randomInt(range.min, range.max);
  return {
    question: `${a} + ${b} = ?`,
    answer: a + b,
    type: 'add',
    operands: [a, b],
    operator: '+'
  };
}

register('add', generateAddition);

export default generateAddition;
