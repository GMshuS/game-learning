/**
 * 方程求解题生成器
 * 面向 5-6 年级
 * 生成：
 * - 一步方程（x + a = b, x - a = b, a - x = b, x × a = b, x ÷ a = b）
 * - 两步方程（ax + b = c, ax - b = c, x/a + b = c）
 * - 分数方程（x/a = b/c, (x + a)/b = c）
 * - 比例方程（a/x = b/c, a:b = x:c）
 */
import { register } from './registry';
import { randomInt } from './_helpers';

/**
 * 生成分数方程：x / a = b / c  →  x = a * b / c
 * @returns {{ question: string, answer: number, operands: number[] } | null}
 */
function generateFractionEquation() {
  const a = randomInt(2, 9);
  const b = randomInt(1, 8);
  const c = randomInt(a + 1, a + 6);
  // 确保 x 为整数
  const numerator = a * b;
  if (numerator % c !== 0) return null;
  const x = numerator / c;
  return {
    question: `解方程：x / ${a} = ${b} / ${c}，求 x`,
    answer: x,
    operands: [a, b, c, x]
  };
}

/**
 * 生成比例方程：a : b = x : c  →  a/b = x/c  →  x = a*c/b
 * 或 a : x = b : c  →  a/x = b/c  →  x = a*c/b
 * @returns {{ question: string, answer: number, operands: number[] } | null}
 */
function generateRatioEquation() {
  const type = Math.random() > 0.5 ? 'inner' : 'outer';
  const a = randomInt(1, 8);
  const b = randomInt(a + 1, a + 6);
  const c = randomInt(2, 10);
  // x = a * c / b，确保整数
  const numerator = a * c;
  if (numerator % b !== 0) return null;
  const x = numerator / b;

  if (type === 'inner') {
    // a : b = x : c
    return {
      question: `解比例：${a} : ${b} = x : ${c}，求 x`,
      answer: x,
      operands: [a, b, c, x]
    };
  } else {
    // a : x = b : c
    const numerator2 = a * c;
    if (numerator2 % b !== 0) return null;
    const x2 = numerator2 / b;
    return {
      question: `解比例：${a} : x = ${b} : ${c}，求 x`,
      answer: x2,
      operands: [a, b, c, x2]
    };
  }
}

/**
 * 生成两步方程：ax + b = c 或 ax - b = c 或 x/a + b = c
 * @param {number} grade
 * @returns {{ question: string, answer: number, operands: number[] }}
 */
function generateTwoStepEquation(_grade) {
  const type = randomInt(0, 2);

  if (type === 0) {
    // ax + b = c
    const a = randomInt(2, 9);
    const x = randomInt(1, 20);
    const b = randomInt(1, 30);
    const c = a * x + b;
    return {
      question: `解方程：${a}x + ${b} = ${c}，求 x`,
      answer: x,
      operands: [a, b, c, x]
    };
  } else if (type === 1) {
    // ax - b = c
    const a = randomInt(2, 9);
    const x = randomInt(2, 20);
    const b = randomInt(1, a * x - 1);
    const c = a * x - b;
    return {
      question: `解方程：${a}x - ${b} = ${c}，求 x`,
      answer: x,
      operands: [a, b, c, x]
    };
  } else {
    // x/a + b = c
    const a = randomInt(2, 9);
    const x = randomInt(1, 10) * a; // 确保 x 能被 a 整除
    const b = randomInt(1, 20);
    const c = x / a + b;
    return {
      question: `解方程：x / ${a} + ${b} = ${c}，求 x`,
      answer: x,
      operands: [a, b, c, x]
    };
  }
}

/**
 * 生成方程求解题目
 * @param {number} grade - 年级 (1-6)
 * @param {object} range - 数字范围 { min, max }
 * @returns {{ question: string, answer: number, type: string, operands: number[] }}
 */
function generateEquation(grade, range) {
  const { min, max } = range;
  let question, answer, operands;

  if (grade >= 6) {
    // 6 年级：所有类型（一步 + 两步 + 分数方程 + 比例方程）
    const rand = Math.random();

    if (rand < 0.3) {
      // 30% 一步乘除方程
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
    } else if (rand < 0.55) {
      // 25% 分数方程
      const result = generateFractionEquation();
      if (result) {
        return {
          question: result.question,
          answer: result.answer,
          type: 'equation',
          operands: result.operands
        };
      }
      // 保底：一步加减方程
      const a = randomInt(Math.max(min, 1), Math.min(max, 50));
      const x = randomInt(Math.max(min, 1), Math.min(max, 50));
      const b = a + x;
      answer = x;
      question = `解方程：x + ${a} = ${b}，求 x`;
      operands = [a, b, x];
    } else if (rand < 0.75) {
      // 20% 比例方程
      const result = generateRatioEquation();
      if (result) {
        return {
          question: result.question,
          answer: result.answer,
          type: 'equation',
          operands: result.operands
        };
      }
      // 保底：一步加减方程
      const a = randomInt(Math.max(min, 1), Math.min(max, 50));
      const x = randomInt(Math.max(min, 1), Math.min(max, 50));
      const b = a + x;
      answer = x;
      question = `解方程：x + ${a} = ${b}，求 x`;
      operands = [a, b, x];
    } else {
      // 25% 两步方程
      const result = generateTwoStepEquation(grade);
      return {
        question: result.question,
        answer: result.answer,
        type: 'equation',
        operands: result.operands
      };
    }
  } else if (grade >= 4) {
    // 4-5 年级：一步加减乘除 + 两步方程
    const rand = Math.random();
    const useMultiplication = Math.random() > 0.5;

    if (rand < 0.5) {
      // 50% 一步方程
      if (useMultiplication) {
        // x × a = b
        const a = randomInt(Math.max(min, 2), Math.min(max, 9));
        const x = randomInt(Math.max(min, 2), Math.min(max, 20));
        const b = a * x;
        answer = x;
        question = `解方程：x × ${a} = ${b}，求 x`;
        operands = [a, b, x];
      } else {
        // 加减方程
        const operation = randomInt(0, 2);
        if (operation === 0) {
          const a = randomInt(Math.max(min, 1), Math.min(max, 50));
          const x = randomInt(Math.max(min, 1), Math.min(max, 50));
          const b = a + x;
          answer = x;
          question = `解方程：x + ${a} = ${b}，求 x`;
          operands = [a, b, x];
        } else if (operation === 1) {
          const a = randomInt(Math.max(min, 1), Math.min(max, 30));
          const b = randomInt(Math.max(min, 1), Math.min(max, 30));
          const x = a + b;
          answer = x;
          question = `解方程：x - ${a} = ${b}，求 x`;
          operands = [a, b, x];
        } else {
          const a = randomInt(Math.max(min, 10), Math.min(max, 100));
          const b = randomInt(Math.max(min, 1), Math.min(max, a - 1));
          const x = a - b;
          answer = x;
          question = `解方程：${a} - x = ${b}，求 x`;
          operands = [a, b, x];
        }
      }
    } else {
      // 50% 两步方程
      const result = generateTwoStepEquation(grade);
      return {
        question: result.question,
        answer: result.answer,
        type: 'equation',
        operands: result.operands
      };
    }
  } else {
    // 1-3 年级：仅一步加减方程
    const operation = randomInt(0, 2);

    if (operation === 0) {
      // x + a = b
      const a = randomInt(Math.max(min, 1), Math.min(max, 50));
      const x = randomInt(Math.max(min, 1), Math.min(max, 50));
      const b = a + x;
      answer = x;
      question = `解方程：x + ${a} = ${b}，求 x`;
      operands = [a, b, x];
    } else if (operation === 1) {
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
