/**
 * 分数题目生成器
 */
import { register } from './registry';
import { randomInt } from './_helpers';

/**
 * 生成分数题目
 * @param {number} grade - 年级
 * @param {object} range - 数字范围 { min, max }
 * @returns {{ question: string, answer: number, type: string, operands: array[], operator: string }}
 */
function generateFraction(_grade, _range) {
  const MAX_ATTEMPTS = 100;
  let attempts = 0;

  while (attempts < MAX_ATTEMPTS) {
    attempts++;
    const denominator = randomInt(2, 12);
    const numerator1 = randomInt(1, denominator - 1);
    const numerator2 = randomInt(1, denominator - 1);

    // 确保结果不超过 1 或为负数
    const operation = Math.random() > 0.5 ? '+' : '-';

    if (operation === '+') {
      if (numerator1 + numerator2 > denominator) {
        continue; // 结果大于 1，重新生成
      }
      return {
        question: `${numerator1}/${denominator} + ${numerator2}/${denominator} = ?`,
        answer: (numerator1 + numerator2) / denominator,
        type: 'fraction',
        operands: [[numerator1, denominator], [numerator2, denominator]],
        operator: '+'
      };
    } else {
      if (numerator1 < numerator2) {
        continue; // 负数结果，重新生成
      }
      return {
        question: `${numerator1}/${denominator} - ${numerator2}/${denominator} = ?`,
        answer: (numerator1 - numerator2) / denominator,
        type: 'fraction',
        operands: [[numerator1, denominator], [numerator2, denominator]],
        operator: '-'
      };
    }
  }

  // 保底：返回一个简单分数题
  return {
    question: `1/2 + 1/2 = ?`,
    answer: 1,
    type: 'fraction',
    operands: [[1, 2], [1, 2]],
    operator: '+'
  };
}

register('fraction', generateFraction);

export default generateFraction;
