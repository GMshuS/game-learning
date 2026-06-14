/**
 * 方程求解题生成器
 * 面向 5-6 年级
 * 生成如：x + 5 = 12，求 x
 */
import { register } from './registry';
import { randomInt } from './_helpers';

/**
 * 生成方程求解题目
 * @param {number} grade - 年级 (1-6)
 * @param {object} range - 数字范围 { min, max }
 * @returns {{ question: string, answer: number, type: string, operands: number[] }}
 */
function generateEquation(grade, range) {
  const { min, max } = range;
  let question, answer, operands;

  const useMultiplication = grade >= 6 && Math.random() > 0.5;
  const operation = randomInt(0, 2);

  if (useMultiplication) {
    // 6 年级：乘除方程
    // x × a = b 或 x ÷ a = b
    if (Math.random() > 0.5) {
      // x × a = b
      const a = randomInt(Math.max(min, 2), Math.min(max, 9));
      const x = randomInt(Math.max(min, 2), Math.min(max, 20));
      const b = a * x;
      answer = x;
      question = `解方程：x × ${a} = ${b}，求 x`;
      operands = [a, b, x];
    } else {
      // x ÷ a = b
      const a = randomInt(Math.max(min, 2), Math.min(max, 9));
      const b = randomInt(Math.max(min, 2), Math.min(max, 20));
      const x = a * b;
      answer = x;
      question = `解方程：x ÷ ${a} = ${b}，求 x`;
      operands = [a, b, x];
    }
  } else if (operation === 0) {
    // 加法方程：x + a = b
    const a = randomInt(Math.max(min, 1), Math.min(max, 50));
    const x = randomInt(Math.max(min, 1), Math.min(max, 50));
    const b = a + x;
    answer = x;
    question = `解方程：x + ${a} = ${b}，求 x`;
    operands = [a, b, x];
  } else if (operation === 1) {
    // 减法方程：x - a = b 或 a - x = b
    if (Math.random() > 0.5) {
      // x - a = b
      const a = randomInt(Math.max(min, 1), Math.min(max, 30));
      const b = randomInt(Math.max(min, 1), Math.min(max, 30));
      const x = a + b;
      answer = x;
      question = `解方程：x - ${a} = ${b}，求 x`;
      operands = [a, b, x];
    } else {
      // a - x = b
      const a = randomInt(Math.max(min, 10), Math.min(max, 100));
      const b = randomInt(Math.max(min, 1), Math.min(max, a - 1));
      const x = a - b;
      answer = x;
      question = `解方程：${a} - x = ${b}，求 x`;
      operands = [a, b, x];
    }
  } else {
    // 两步方程：ax + b = c
    const a = randomInt(2, 9);
    const x = randomInt(Math.max(min, 1), Math.min(max, 20));
    const b = randomInt(Math.max(min, 1), Math.min(max, 30));
    const c = a * x + b;
    answer = x;
    question = `解方程：${a}x + ${b} = ${c}，求 x`;
    operands = [a, b, c, x];
  }

  return {
    question,
    answer,
    type: 'equation',
    operands
  };
}

register('equation', generateEquation);

export default generateEquation;
