/**
 * 平均数计算生成器
 * 面向 3-6 年级
 * 求一组数的平均数
 */
import { register } from './registry';
import { randomInt } from './_helpers';

/**
 * 生成平均数计算题目
 * @param {number} grade - 年级 (1-6)
 * @param {object} range - 数字范围 { min, max }
 * @returns {{ question: string, answer: number, type: string, operands: number[], inputType: string }}
 */
function generateAverageCalc(grade, range) {
  const { min, max } = range;
  let numbers, answer, question;

  if (grade <= 2) {
    // 1-2年级：2-3个数的平均数（整数结果）
    const count = randomInt(2, 3);
    const base = randomInt(Math.max(min, 1), Math.min(max, 10));
    // 确保平均数是整数
    const nums = [];
    let sum = 0;
    for (let i = 0; i < count; i++) {
      const n = base + randomInt(-3, 3);
      nums.push(n);
      sum += n;
    }
    // 保证平均值是整数
    while (sum % count !== 0) {
      nums[nums.length - 1] += 1;
      sum += 1;
    }
    numbers = nums;
    answer = sum / count;
    question = `求 ${numbers.join(', ')} 的平均数`;
  } else if (grade <= 4) {
    // 3-4年级：3-5个数的平均数（可能含小数）
    const count = randomInt(3, 5);
    const isInteger = Math.random() > 0.4;
    const nums = [];
    let sum = 0;

    for (let i = 0; i < count; i++) {
      const n = randomInt(Math.max(min, 1), Math.min(max, 50));
      nums.push(n);
      sum += n;
    }

    if (isInteger) {
      // 保证整数平均结果
      while (sum % count !== 0) {
        nums[nums.length - 1] += 1;
        sum += 1;
      }
      numbers = nums;
      answer = sum / count;
    } else {
      numbers = nums;
      answer = Math.round((sum / count) * 10) / 10;
    }

    question = `求 ${numbers.join(', ')} 的平均数（保留一位小数）`;
    answer = Math.round((sum / count) * 10) / 10;
  } else {
    // 5-6年级：4-6个数的平均数（含小数）
    const count = randomInt(4, 6);
    const useDecimals = Math.random() > 0.4;
    const nums = [];
    let sum = 0;

    if (useDecimals) {
      // 含小数的数据
      for (let i = 0; i < count; i++) {
        const intPart = randomInt(Math.max(min, 1), Math.min(max, 30));
        const decPart = randomInt(1, 99);
        const n = parseFloat(`${intPart}.${decPart < 10 ? '0' : ''}${decPart}`);
        nums.push(n);
        sum += n;
      }
      sum = Math.round(sum * 100) / 100;
      answer = Math.round((sum / count) * 100) / 100;
      question = `求 ${nums.join(', ')} 的平均数（保留两位小数）`;
    } else {
      // 应用题风格
      const scenarios = [
        { template: (scores) => `小明的 ${scores.length} 次数学测验成绩分别是 ${scores.join('、')} 分，他的平均分是多少？` },
        { template: (temps) => `某地区一周前 ${temps.length} 天的气温分别是 ${temps.join('°C、')}°C，这 ${temps.length} 天的平均气温是多少？` },
        { template: (nums) => `求 ${nums.join(', ')} 的平均数（保留一位小数）` }
      ];
      const scenario = scenarios[randomInt(0, scenarios.length - 1)];

      for (let i = 0; i < count; i++) {
        const n = randomInt(Math.max(min, 5), Math.min(max, 100));
        nums.push(n);
        sum += n;
      }
      answer = Math.round((sum / count) * 10) / 10;
      question = scenario.template(nums);
    }
  }

  return {
    question,
    answer: String(answer),
    type: 'averageCalc',
    operands: numbers,
    inputType: 'input'
  };
}

register('averageCalc', generateAverageCalc);

export default generateAverageCalc;
