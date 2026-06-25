/**
 * 运算定律生成器
 * 面向 3-6 年级
 * 交换律、结合律、分配律的识别与运用
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
 * 生成运算定律题目
 * @param {number} grade - 年级 (1-6)
 * @param {object} range - 数字范围 { min, max }
 * @returns {{ question: string, answer: string, type: string, operands: number[], inputType: string, choices?: string[] }}
 */
function generateOperationLaw(grade, range) {
  const { min, max } = range;

  if (grade <= 2) {
    // 1-2年级：简单交换律识别
    const a = randomInt(Math.max(min, 1), Math.min(max, 20));
    const b = randomInt(Math.max(min, 1), Math.min(max, 20));
    const useAdd = Math.random() > 0.5;

    if (useAdd) {
      const answer = `${a}+${b}`;
      const choices = shuffle([`${a}+${b}`, `${b}+${a}`, `${a}-${b}`, `${b}-${a}`]);
      return {
        question: `${a} + ${b} = ${b} + ${a}，等式右边应填什么？`,
        answer,
        type: 'operationLaw',
        operands: [a, b],
        inputType: 'choice',
        choices
      };
    } else {
      const answer = `${a}×${b}`;
      const choices = shuffle([`${a}×${b}`, `${b}×${a}`, `${a}+${b}`, `${b}+${a}`]);
      return {
        question: `${a} × ${b} = ${b} × ${a}，等式右边应填什么？`,
        answer,
        type: 'operationLaw',
        operands: [a, b],
        inputType: 'choice',
        choices
      };
    }
  } else if (grade <= 4) {
    // 3-4年级：交换律 + 结合律
    const mode = randomInt(0, 2);

    if (mode === 0) {
      // 交换律识别
      const a = randomInt(Math.max(min, 2), Math.min(max, 50));
      const b = randomInt(Math.max(min, 2), Math.min(max, 50));
      const answer = '交换律';
      const choices = shuffle(['交换律', '结合律', '分配律', '无法确定']);

      return {
        question: `${a} × ${b} = ${b} × ${a} 应用了什么运算定律？`,
        answer,
        type: 'operationLaw',
        operands: [a, b],
        inputType: 'choice',
        choices
      };
    } else if (mode === 1) {
      // 结合律识别
      const a = randomInt(2, 10);
      const b = randomInt(2, 10);
      const c = randomInt(2, 10);
      const answer = '结合律';
      const choices = shuffle(['交换律', '结合律', '分配律', '无法确定']);

      return {
        question: `(${a} + ${b}) + ${c} = ${a} + (${b} + ${c}) 应用了什么运算定律？`,
        answer,
        type: 'operationLaw',
        operands: [a, b, c],
        inputType: 'choice',
        choices
      };
    } else {
      // 运用交换律简便计算
      const a = randomInt(2, 9);
      const b = randomInt(11, 99);
      const answer = String(a * b);
      return {
        question: `利用交换律计算：${a} × ${b} = ${b} × ${a} = ？`,
        answer,
        type: 'operationLaw',
        operands: [a, b],
        inputType: 'input'
      };
    }
  } else {
    // 5-6年级：交换律 + 结合律 + 分配律
    const mode = randomInt(0, 3);

    if (mode === 0) {
      // 分配律识别
      const a = randomInt(2, 12);
      const b = randomInt(2, 12);
      const c = randomInt(2, 12);
      const answer = '分配律';
      const choices = shuffle(['交换律', '结合律', '分配律', '无法确定']);

      return {
        question: `${a} × (${b} + ${c}) = ${a}×${b} + ${a}×${c} 应用了什么运算定律？`,
        answer,
        type: 'operationLaw',
        operands: [a, b, c],
        inputType: 'choice',
        choices
      };
    } else if (mode === 1) {
      // 乘法分配律运用：25 × 104 = 25 × (100 + 4) = 25×100 + 25×4
      const a = randomInt(2, 25);
      const b = randomInt(2, 9);
      const c = randomInt(2, 9);
      const simplified = b + c;
      const result = a * simplified;
      return {
        question: `运用分配律计算：${a} × (${b} + ${c}) = ${a}×${b} + ${a}×${c} = ？`,
        answer: String(result),
        type: 'operationLaw',
        operands: [a, b, c, result],
        inputType: 'input'
      };
    } else if (mode === 2) {
      // 结合律运用：(25 × 17) × 4 = 25 × (17 × 4)
      const a = randomInt(2, 25);
      const b = randomInt(2, 20);
      const c = randomInt(2, 25);
      const result = a * b * c;
      return {
        question: `运用结合律计算：(${a} × ${b}) × ${c} = ${a} × (${b} × ${c}) = ？`,
        answer: String(result),
        type: 'operationLaw',
        operands: [a, b, c, result],
        inputType: 'input'
      };
    } else {
      // 交换律运用：25×17×4 = 25×4×17
      const a = randomInt(2, 25);
      const b = randomInt(2, 20);
      const c = randomInt(2, 25);
      const answer = `交换律`;
      const choices = shuffle(['交换律', '结合律', '分配律', '无法确定']);

      return {
        question: `${a} × ${b} × ${c} = ${a} × ${c} × ${b} 应用了什么运算定律？`,
        answer,
        type: 'operationLaw',
        operands: [a, b, c],
        inputType: 'choice',
        choices
      };
    }
  }
}

register('operationLaw', generateOperationLaw);

export default generateOperationLaw;
