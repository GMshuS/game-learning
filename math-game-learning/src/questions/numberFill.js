/**
 * 填空题生成器
 * 面向 1-3 年级
 * 生成如：__ + 5 = 12, __ × 3 = 18
 */
import { register } from './registry';
import { randomInt } from './_helpers';

/**
 * 生成填空题目
 * @param {number} grade - 年级 (1-6)
 * @param {object} range - 数字范围 { min, max }
 * @returns {{ question: string, answer: number, type: string, operands: number[] }}
 */
function generateNumberFill(grade, range) {
  const { min, max } = range;
  let question, answer, operands;

  // 三路分支：加法 / 减法 / 乘法，确保减法可被生成
  const roll = Math.random();

  if (grade <= 1 || (grade >= 2 && roll < 0.4)) {
    // 加法填空：a + __ = c 或 __ + b = c
    const a = randomInt(Math.max(min, 1), Math.min(max, 20));
    const b = randomInt(Math.max(min, 1), Math.min(max, 20));
    const c = a + b;
    const fillFirst = Math.random() > 0.5;

    if (fillFirst) {
      question = `__ + ${b} = ${c}`;
      answer = a;
    } else {
      question = `${a} + __ = ${c}`;
      answer = b;
    }
    operands = [a, b, c];
  } else if (grade >= 2 && roll < 0.7) {
    // 减法填空：c - __ = a 或 __ - a = b
    const a = randomInt(Math.max(min, 1), Math.min(max, 20));
    const b = randomInt(Math.max(min, 1), Math.min(max, 20));
    const c = a + b;
    const fillFirst = Math.random() > 0.5;

    if (fillFirst) {
      question = `__ - ${a} = ${b}`;
      answer = c;
    } else {
      question = `${c} - __ = ${b}`;
      answer = a;
    }
    operands = [a, b, c];
  } else {
    // 乘法填空（grade >= 2）：a × __ = c 或 __ × b = c
    const a = randomInt(Math.max(min, 1), Math.min(max, 9));
    const b = randomInt(2, 9);
    const c = a * b;
    const fillFirst = Math.random() > 0.5;

    if (fillFirst) {
      question = `__ × ${b} = ${c}`;
      answer = a;
    } else {
      question = `${a} × __ = ${c}`;
      answer = b;
    }
    operands = [a, b, c];
  }

  return {
    question,
    answer,
    type: 'numberFill',
    operands
  };
}

register('numberFill', generateNumberFill);

export default generateNumberFill;
