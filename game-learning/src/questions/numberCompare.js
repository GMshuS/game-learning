/**
 * 数的大小比较生成器
 * 面向 1-6 年级
 * 生成如：35 ○ 47，选择 > < =
 */
import { register } from './registry';
import { randomInt } from './_helpers';

/**
 * 打乱数组（Fisher-Yates）
 * @param {any[]} arr
 * @returns {any[]}
 */
function shuffle(arr) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = randomInt(0, i);
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

/**
 * 生成数的大小比较题目
 * @param {number} grade - 年级 (1-6)
 * @param {object} range - 数字范围 { min, max }
 * @returns {{ question: string, answer: string, type: string, operands: number[], inputType: string, choices: string[] }}
 */
function generateNumberCompare(grade, range) {
  const { min, max } = range;
  let a, b, answer;

  if (grade <= 2) {
    // 低年级：100以内整数比较
    a = randomInt(Math.max(min, 1), Math.min(max, 100));
    b = randomInt(Math.max(min, 1), Math.min(max, 100));
  } else if (grade <= 4) {
    // 中年级：万以内比较
    a = randomInt(Math.max(min, 10), Math.min(max, 9999));
    b = randomInt(Math.max(min, 10), Math.min(max, 9999));
  } else {
    // 高年级：大数/小数比较
    const useDecimal = Math.random() > 0.5;
    if (useDecimal) {
      // 小数比较（保留一位或两位小数）
      const intA = randomInt(10, 9999);
      const decA = randomInt(1, 99);
      const intB = randomInt(10, 9999);
      const decB = randomInt(1, 99);
      a = parseFloat(`${intA}.${decA < 10 ? '0' : ''}${decA}`);
      b = parseFloat(`${intB}.${decB < 10 ? '0' : ''}${decB}`);
    } else {
      // 大数比较（万以上）
      a = randomInt(10000, 999999);
      b = randomInt(10000, 999999);
    }
  }

  if (a > b) {
    answer = '>';
  } else if (a < b) {
    answer = '<';
  } else {
    answer = '=';
  }

  const choices = shuffle(['>', '<', '=']);

  return {
    question: `${a} ○ ${b}，选择正确的符号`,
    answer,
    type: 'numberCompare',
    operands: [a, b],
    inputType: 'choice',
    choices
  };
}

register('numberCompare', generateNumberCompare);

export default generateNumberCompare;
