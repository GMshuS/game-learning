/**
 * 数的性质生成器
 * 面向 1-6 年级
 * 奇偶判断、质数合数判断、因数倍数
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
 * 判断是否为质数
 * @param {number} n
 * @returns {boolean}
 */
function isPrime(n) {
  if (n < 2) return false;
  if (n === 2) return true;
  if (n % 2 === 0) return false;
  for (let i = 3; i * i <= n; i += 2) {
    if (n % i === 0) return false;
  }
  return true;
}

/**
 * 生成数的性质题目
 * @param {number} grade - 年级 (1-6)
 * @param {object} range - 数字范围 { min, max }
 * @returns {{ question: string, answer: string, type: string, operands: number[], inputType: string, choices?: string[] }}
 */
function generateNumberProperty(grade, range) {
  const { min, max } = range;

  if (grade <= 2) {
    // 1-2年级：奇偶判断
    const n = randomInt(Math.max(min, 1), Math.min(max, 50));
    const isEven = n % 2 === 0;
    const answer = isEven ? '偶数' : '奇数';
    const choices = shuffle(['奇数', '偶数']);

    return {
      question: `${n} 是奇数还是偶数？`,
      answer,
      type: 'numberProperty',
      operands: [n],
      inputType: 'choice',
      choices
    };
  } else if (grade <= 4) {
    // 3-4年级：奇偶 + 因数倍数判断
    const mode = randomInt(0, 2);

    if (mode === 0) {
      // 奇偶判断（更大范围）
      const n = randomInt(Math.max(min, 10), Math.min(max, 200));
      const isEven = n % 2 === 0;
      const answer = isEven ? '偶数' : '奇数';
      const choices = shuffle(['奇数', '偶数']);

      return {
        question: `${n} 是奇数还是偶数？`,
        answer,
        type: 'numberProperty',
        operands: [n],
        inputType: 'choice',
        choices
      };
    } else if (mode === 1) {
      // 因数判断：a 是否是 b 的因数？
      const b = randomInt(Math.max(min, 6), Math.min(max, 100));
      const factors = [];
      for (let i = 1; i <= b; i++) {
        if (b % i === 0) factors.push(i);
      }
      const a = factors[randomInt(0, factors.length - 1)];
      const answer = '是';
      const choices = shuffle(['是', '否']);

      return {
        question: `${a} 是 ${b} 的因数吗？`,
        answer,
        type: 'numberProperty',
        operands: [a, b],
        inputType: 'choice',
        choices
      };
    } else {
      // 倍数判断：a 是否是 b 的倍数？
      const b = randomInt(Math.max(min, 2), Math.min(max, 30));
      const a = b * randomInt(2, 10);
      const answer = '是';
      const choices = shuffle(['是', '否']);

      return {
        question: `${a} 是 ${b} 的倍数吗？`,
        answer,
        type: 'numberProperty',
        operands: [a, b],
        inputType: 'choice',
        choices
      };
    }
  } else {
    // 5-6年级：质数/合数判断 + 因数倍数
    const mode = randomInt(0, 3);

    if (mode === 0) {
      // 质数/合数判断
      const usePrime = Math.random() > 0.5;
      let n;
      if (usePrime) {
        // 生成质数
        const primes = [2, 3, 5, 7, 11, 13, 17, 19, 23, 29, 31, 37, 41, 43, 47, 53, 59, 61, 67, 71, 73, 79, 83, 89, 97];
        n = primes[randomInt(0, primes.length - 1)];
      } else {
        // 生成合数
        const composites = [4, 6, 8, 9, 10, 12, 14, 15, 16, 18, 20, 21, 22, 24, 25, 26, 27, 28, 30, 32, 33, 34, 35, 36, 38, 39, 40, 42, 44, 45, 46, 48, 49, 50, 51, 52, 54, 55, 56, 57, 58, 60, 62, 63, 64, 65, 66, 68, 69, 70];
        n = composites[randomInt(0, composites.length - 1)];
      }
      const answer = isPrime(n) ? '质数' : '合数';
      const choices = shuffle(['质数', '合数']);

      return {
        question: `${n} 是质数还是合数？`,
        answer,
        type: 'numberProperty',
        operands: [n],
        inputType: 'choice',
        choices
      };
    } else if (mode === 1) {
      // 因数判断（复杂版）
      const b = randomInt(Math.max(min, 12), Math.min(max, 200));
      const factors = [];
      for (let i = 1; i <= b; i++) {
        if (b % i === 0) factors.push(i);
      }
      const a = factors[randomInt(0, factors.length - 1)];
      const answer = '是';
      const choices = shuffle(['是', '否']);

      return {
        question: `${a} 是 ${b} 的因数吗？`,
        answer,
        type: 'numberProperty',
        operands: [a, b],
        inputType: 'choice',
        choices
      };
    } else {
      // 倍数判断（复杂版）
      const b = randomInt(Math.max(min, 3), Math.min(max, 50));
      const a = b * randomInt(3, 15);
      const answer = '是';
      const choices = shuffle(['是', '否']);

      return {
        question: `${a} 是 ${b} 的倍数吗？`,
        answer,
        type: 'numberProperty',
        operands: [a, b],
        inputType: 'choice',
        choices
      };
    }
  }
}

register('numberProperty', generateNumberProperty);

export default generateNumberProperty;
