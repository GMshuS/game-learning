/**
 * 负数认识生成器
 * 面向 5-6 年级
 * 负数比较、数轴定位、简单负数加减
 */
import { register } from './registry';
import { randomInt } from './_helpers';

/**
 * 打乱数组
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
 * 生成负数认识题目
 * @param {number} grade - 年级 (1-6)
 * @param {object} range - 数字范围 { min, max }
 * @returns {{ question: string, answer: string, type: string, operands: number[], inputType: string, choices?: string[] }}
 */
function generateNegativeNumber(grade, range) {
  // 仅 5-6 年级生成负数题目
  if (grade < 5) {
    // 低年级降级为简单正数比较
    const a = randomInt(1, 20);
    const b = randomInt(1, 20);
    const max = Math.max(a, b);
    const answer = String(max);

    return {
      question: `${a} 和 ${b} 中，较大的数是？`,
      answer,
      type: 'negativeNumber',
      operands: [a, b],
      inputType: 'input'
    };
  }

  const mode = randomInt(0, 4);

  if (mode === 0) {
    // 负数比较：比较两个负数的大小
    const a = randomInt(-100, -1);
    const b = randomInt(-100, -1);
    // 确保两个数不同
    const answer = a > b ? '>' : '<';
    const choices = shuffle(['>', '<', '=']);

    return {
      question: `比较大小：${a} ○ ${b}`,
      answer,
      type: 'negativeNumber',
      operands: [a, b],
      inputType: 'choice',
      choices
    };
  } else if (mode === 1) {
    // 正负数比较
    const a = randomInt(-50, -1);
    const b = randomInt(1, 50);
    const answer = '<';
    const choices = shuffle(['>', '<', '=']);

    return {
      question: `比较大小：${a} ○ ${b}`,
      answer,
      type: 'negativeNumber',
      operands: [a, b],
      inputType: 'choice',
      choices
    };
  } else if (mode === 2) {
    // 数轴定位：哪个数在数轴上更靠左/右
    const a = randomInt(-50, 50);
    const b = randomInt(-50, 50);
    const askLeft = Math.random() > 0.5;

    if (askLeft) {
      const answer = a < b ? String(a) : String(b);
      const choices = shuffle([String(a), String(b), String(Math.min(a, b) - 1), String(Math.max(a, b) + 1)]);

      return {
        question: `在数轴上，${a} 和 ${b} 哪个数更靠左？`,
        answer,
        type: 'negativeNumber',
        operands: [a, b],
        inputType: 'choice',
        choices
      };
    } else {
      const answer = a > b ? String(a) : String(b);
      const choices = shuffle([String(a), String(b), String(Math.min(a, b) - 1), String(Math.max(a, b) + 1)]);

      return {
        question: `在数轴上，${a} 和 ${b} 哪个数更靠右？`,
        answer,
        type: 'negativeNumber',
        operands: [a, b],
        inputType: 'choice',
        choices
      };
    }
  } else if (mode === 3) {
    // 简单负数加减：-5 + 3 = ?
    const useAdd = Math.random() > 0.5;

    if (useAdd) {
      // 负数加正数：-a + b
      const a = randomInt(1, 30);
      const b = randomInt(1, 30);
      const result = -a + b;
      return {
        question: `计算：(-${a}) + ${b} = ?`,
        answer: String(result),
        type: 'negativeNumber',
        operands: [-a, b, result],
        inputType: 'input'
      };
    } else {
      // 正数加负数：a + (-b) = a - b
      const a = randomInt(10, 50);
      const b = randomInt(1, a - 1);
      const result = a - b;
      return {
        question: `计算：${a} + (-${b}) = ?`,
        answer: String(result),
        type: 'negativeNumber',
        operands: [a, -b, result],
        inputType: 'input'
      };
    }
  } else {
    // 温度场景应用题
    const temp1 = randomInt(-20, -1);
    const temp2 = randomInt(1, 20);
    const rise = randomInt(1, 15);
    const newTemp = temp1 + rise;

    return {
      question: `某地早上气温是 ${temp1}°C，中午上升了 ${rise}°C，中午的气温是多少°C？`,
      answer: String(newTemp),
      type: 'negativeNumber',
      operands: [temp1, rise, newTemp],
      inputType: 'input'
    };
  }
}

register('negativeNumber', generateNegativeNumber);

export default generateNegativeNumber;
