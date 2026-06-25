/**
 * 比和比例生成器
 * 面向 5-6 年级
 * 化简比、求比值、解比例
 */
import { register } from './registry';
import { randomInt } from './_helpers';

/**
 * 最大公约数
 * @param {number} a
 * @param {number} b
 * @returns {number}
 */
function gcd(a, b) {
  a = Math.abs(a);
  b = Math.abs(b);
  while (b) {
    [a, b] = [b, a % b];
  }
  return a;
}

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
 * 生成比和比例题目
 * @param {number} grade - 年级 (1-6)
 * @param {object} range - 数字范围 { min, max }
 * @returns {{ question: string, answer: string, type: string, operands: number[], inputType: string, choices?: string[] }}
 */
function generateRatioProportion(grade, _range) {
  // 仅 5-6 年级生成比例题目
  if (grade < 5) {
    // 低年级降级为简单除法
    const a = randomInt(2, 20);
    const b = randomInt(2, 20);
    const quotient = Math.floor(a / b);
    const remainder = a % b;

    const answer = remainder === 0 ? String(quotient) : `${quotient} 余 ${remainder}`;

    return {
      question: `${a} ÷ ${b} = ?`,
      answer,
      type: 'ratioProportion',
      operands: [a, b],
      inputType: 'input'
    };
  }

  const mode = randomInt(0, 4);

  if (mode === 0) {
    // 化简比：a : b 化为最简整数比
    const baseA = randomInt(2, 20);
    const baseB = randomInt(2, 20);
    const factor = randomInt(2, 6);
    const a = baseA * factor;
    const b = baseB * factor;
    const g = gcd(baseA, baseB);
    const simplestA = baseA / g;
    const simplestB = baseB / g;
    const answer = `${simplestA}:${simplestB}`;

    // 生成干扰选项
    const choices = shuffle([
      answer,
      `${a}:${b}`,
      `${simplestA + 1}:${simplestB}`,
      `${simplestA}:${simplestB + 1}`
    ]);

    return {
      question: `化简比：${a} : ${b}`,
      answer,
      type: 'ratioProportion',
      operands: [a, b, simplestA, simplestB],
      inputType: 'choice',
      choices
    };
  } else if (mode === 1) {
    // 求比值：a : b = ?
    const a = randomInt(2, 30);
    const b = randomInt(2, 30);
    // 确保结果是整数或简单小数
    const value = Math.round((a / b) * 100) / 100;
    const answer = String(value);

    return {
      question: `求比值：${a} : ${b} = ？（保留两位小数）`,
      answer,
      type: 'ratioProportion',
      operands: [a, b],
      inputType: 'input'
    };
  } else if (mode === 2) {
    // 已知比值求前项或后项：a : ? = value
    const isFindFirst = Math.random() > 0.5;
    const a = randomInt(2, 12);
    const b = randomInt(2, 12);

    if (isFindFirst) {
      // 求前项：? : b = a/b
      const answer = String(a);
      const choices = shuffle([String(a), String(b), String(a + 1), String(b - 1)]);

      return {
        question: `在比例 ${a} : ${b} 中，前项是？`,
        answer,
        type: 'ratioProportion',
        operands: [a, b],
        inputType: 'choice',
        choices
      };
    } else {
      // 求后项：a : ? = a/b
      const answer = String(b);
      const choices = shuffle([String(b), String(a), String(b + 1), String(a - 1)]);

      return {
        question: `在比例 ${a} : ${b} 中，后项是？`,
        answer,
        type: 'ratioProportion',
        operands: [a, b],
        inputType: 'choice',
        choices
      };
    }
  } else if (mode === 3) {
    // 解比例：a : b = c : x 或 x : a = b : c
    const useFirst = Math.random() > 0.5;

    if (useFirst) {
      // a : b = c : x => x = b*c/a
      const a = randomInt(2, 10);
      const c = a * randomInt(2, 5);
      // 确保整除：a * x = b * c => x = b * c / a
      // 令 b*c 能被 a 整除
      const factor = randomInt(1, 10);
      const bVal = a * factor;
      const x = bVal * c / a;
      const answer = String(x);

      return {
        question: `解比例：${a} : ${bVal} = ${c} : x，求 x`,
        answer,
        type: 'ratioProportion',
        operands: [a, bVal, c, x],
        inputType: 'input'
      };
    } else {
      // x : a = b : c => x = a*b/c
      const a = randomInt(2, 10);
      const b = randomInt(2, 15);
      const c = a * randomInt(2, 5);
      const factor = randomInt(1, 10);
      const aVal = c * factor;
      const x = aVal * b / c;
      const answer = String(x);

      return {
        question: `解比例：x : ${aVal} = ${b} : ${c}，求 x`,
        answer,
        type: 'ratioProportion',
        operands: [aVal, b, c, x],
        inputType: 'input'
      };
    }
  } else {
    // 实际应用：按比分配
    const totalParts = randomInt(3, 10);
    const partA = randomInt(1, totalParts - 1);
    const partB = totalParts - partA;
    const totalValue = randomInt(20, 100);
    const valueA = Math.floor(totalValue * partA / totalParts);
    const valueB = totalValue - valueA;
    const answer = `${valueA}:${valueB}`;

    return {
      question: `把 ${totalValue} 按 ${partA} : ${partB} 的比例分配，两部分各是多少？`,
      answer,
      type: 'ratioProportion',
      operands: [totalValue, partA, partB, valueA, valueB],
      inputType: 'input'
    };
  }
}

register('ratioProportion', generateRatioProportion);

export default generateRatioProportion;
