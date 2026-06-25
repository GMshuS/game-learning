/**
 * 找规律生成器
 * 面向 1-6 年级
 * 数列规律、图形周期规律
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
 * 生成找规律题目
 * @param {number} grade - 年级 (1-6)
 * @param {object} range - 数字范围 { min, max }
 * @returns {{ question: string, answer: number|string, type: string, operands: number[], inputType: string, choices?: string[] }}
 */
function generatePatternFind(grade, range) {
  const { min, max } = range;

  if (grade <= 2) {
    // 1-2年级：简单递增/递减数列
    const mode = randomInt(0, 2);

    if (mode === 0) {
      // 等差数列（步长1-3）
      const start = randomInt(Math.max(min, 1), Math.min(max, 10));
      const step = randomInt(1, 3);
      const terms = 4;
      const seq = [];
      for (let i = 0; i < terms; i++) {
        seq.push(start + i * step);
      }
      const answer = seq[terms - 1] + step;
      const question = `找出规律，填出下一个数：${seq.join(', ')}, ?`;

      // 生成 3 个干扰选项
      const wrongOptions = new Set();
      wrongOptions.add(answer + 1);
      wrongOptions.add(answer - 1);
      wrongOptions.add(answer + step);
      wrongOptions.delete(answer);
      const wrongArr = Array.from(wrongOptions).slice(0, 3);
      while (wrongArr.length < 3) {
        wrongArr.push(answer + 2);
      }
      const choices = shuffle([String(answer), ...wrongArr.slice(0, 3).map(String)]);

      return {
        question,
        answer: String(answer),
        type: 'patternFind',
        operands: seq,
        inputType: 'choice',
        choices
      };
    } else if (mode === 1) {
      // 偶数数列
      const start = randomInt(1, 5) * 2;
      const step = 2;
      const terms = 4;
      const seq = [];
      for (let i = 0; i < terms; i++) {
        seq.push(start + i * step);
      }
      const answer = seq[terms - 1] + step;
      const choices = shuffle([String(answer), String(answer + 2), String(answer - 2), String(answer + 4)]);

      return {
        question: `找出规律，填出下一个数：${seq.join(', ')}, ?`,
        answer: String(answer),
        type: 'patternFind',
        operands: seq,
        inputType: 'choice',
        choices
      };
    } else {
      // 周期规律：颜色/图形序列
      const patterns = ['○●○●', '△△○○', '☆★☆★'];
      const pattern = patterns[randomInt(0, patterns.length - 1)];
      const pos = randomInt(1, pattern.length);
      const answer = pattern[pos - 1];
      const choices = shuffle([pattern[0], pattern[1], '□', '◇']);

      return {
        question: `根据规律，第 ${pos} 个图形是什么？\n序列：${pattern.split('').join(' ')}`,
        answer,
        type: 'patternFind',
        operands: [],
        inputType: 'choice',
        choices
      };
    }
  } else if (grade <= 4) {
    // 3-4年级：稍复杂数列
    const mode = randomInt(0, 3);

    if (mode === 0) {
      // 等差数列（步长较大）
      const start = randomInt(Math.max(min, 1), Math.min(max, 20));
      const step = randomInt(3, 7);
      const terms = 4;
      const seq = [];
      for (let i = 0; i < terms; i++) {
        seq.push(start + i * step);
      }
      const answer = seq[terms - 1] + step;
      const wrong1 = answer + step;
      const wrong2 = answer - step;
      const wrong3 = answer + 1;
      const choices = shuffle([String(answer), String(wrong1), String(wrong2), String(wrong3)]);

      return {
        question: `找出规律，填出下一个数：${seq.join(', ')}, ?`,
        answer: String(answer),
        type: 'patternFind',
        operands: seq,
        inputType: 'choice',
        choices
      };
    } else if (mode === 1) {
      // 倍数数列：2, 4, 8, 16, ?
      const base = randomInt(2, 3);
      const terms = 4;
      const seq = [];
      for (let i = 0; i < terms; i++) {
        seq.push(Math.pow(base, i + 1));
      }
      const answer = Math.pow(base, terms + 1);
      const choices = shuffle([String(answer), String(answer * base), String(answer / base), String(answer + base)]);

      return {
        question: `找出规律，填出下一个数：${seq.join(', ')}, ?`,
        answer: String(answer),
        type: 'patternFind',
        operands: seq,
        inputType: 'choice',
        choices
      };
    } else {
      // 周期规律
      const shapes = ['★', '●', '◆', '▲'];
      const period = randomInt(2, 4);
      const pattern = [];
      for (let i = 0; i < period; i++) {
        pattern.push(shapes[randomInt(0, shapes.length - 1)]);
      }
      const pos = randomInt(period + 1, period * 4);
      const answer = pattern[(pos - 1) % period];
      const patternStr = pattern.join(' ').repeat(2);
      const choices = shuffle([answer, ...shapes.filter(s => s !== answer).slice(0, 3)]);

      return {
        question: `图形按 ${pattern.join(' ')} 的规律重复排列，第 ${pos} 个图形是什么？`,
        answer,
        type: 'patternFind',
        operands: [pos, period],
        inputType: 'choice',
        choices
      };
    }
  } else {
    // 5-6年级：复杂数列+双重规律
    const mode = randomInt(0, 3);

    if (mode === 0) {
      // 二级等差数列
      const start = randomInt(Math.max(min, 1), Math.min(max, 10));
      const step1 = randomInt(2, 4);
      const step2 = step1 + randomInt(1, 3);
      const terms = 4;
      const seq = [start];
      let currentStep = step1;
      for (let i = 1; i < terms; i++) {
        seq.push(seq[i - 1] + currentStep);
        currentStep += step2 - step1;
      }
      const nextStep = currentStep;
      const answer = seq[terms - 1] + nextStep;
      const choices = shuffle([String(answer), String(answer + 5), String(answer - 5), String(answer + 10)]);

      return {
        question: `找出规律，填出下一个数：${seq.join(', ')}, ?`,
        answer: String(answer),
        type: 'patternFind',
        operands: seq,
        inputType: 'choice',
        choices
      };
    } else if (mode === 1) {
      // 分数/小数规律
      const useDecimal = Math.random() > 0.5;
      if (useDecimal) {
        const start = randomInt(1, 5);
        const step = 0.5;
        const terms = 4;
        const seq = [];
        for (let i = 0; i < terms; i++) {
          seq.push((start + i * step).toFixed(1));
        }
        const answer = (start + terms * step).toFixed(1);
        const choices = shuffle([answer, (parseFloat(answer) + 0.5).toFixed(1), (parseFloat(answer) - 0.5).toFixed(1), (parseFloat(answer) + 1).toFixed(1)]);

        return {
          question: `找出规律，填出下一个数：${seq.join(', ')}, ?`,
          answer,
          type: 'patternFind',
          operands: seq.map(Number),
          inputType: 'choice',
          choices
        };
      } else {
        // 分数规律：1/2, 2/3, 3/4, ?
        const terms = 4;
        const seq = [];
        for (let i = 0; i < terms; i++) {
          seq.push(`${i + 1}/${i + 2}`);
        }
        const answer = `${terms + 1}/${terms + 2}`;
        const choices = shuffle([answer, `${terms + 2}/${terms + 3}`, `${terms}/${terms + 1}`, `${terms + 1}/${terms + 1}`]);

        return {
          question: `找出规律，填出下一个数：${seq.join(', ')}, ?`,
          answer,
          type: 'patternFind',
          operands: [],
          inputType: 'choice',
          choices
        };
      }
    } else {
      // 双重规律：1, 1, 2, 3, 5, 8, ? (斐波那契)
      const start1 = randomInt(1, 2);
      const start2 = randomInt(1, 3);
      const terms = 6;
      const seq = [start1, start2];
      for (let i = 2; i < terms; i++) {
        seq.push(seq[i - 1] + seq[i - 2]);
      }
      const answer = seq[terms - 1] + seq[terms - 2];
      const choices = shuffle([String(answer), String(answer + seq[terms - 1]), String(answer - seq[terms - 2]), String(seq[terms - 1] * 2)]);

      return {
        question: `找出规律，填出下一个数：${seq.join(', ')}, ?`,
        answer: String(answer),
        type: 'patternFind',
        operands: seq,
        inputType: 'choice',
        choices
      };
    }
  }
}

register('patternFind', generatePatternFind);

export default generatePatternFind;
