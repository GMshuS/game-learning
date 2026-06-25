/**
 * 数位认知生成器
 * 面向 1-4 年级
 * 生成如：数字 5 在 3527 中表示什么？
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
 * 根据数字和数位位置生成描述
 * @param {number} digit - 该数位上的数字
 * @param {number} placeIndex - 数位索引 (0=个位, 1=十位, 2=百位, 3=千位, 4=万位)
 * @returns {string}
 */
function getPlaceLabel(digit, placeIndex) {
  const placeNames = ['个', '十', '百', '千', '万', '十万', '百万', '千万', '亿'];
  return `${digit} 个${placeNames[placeIndex]}`;
}

/**
 * 获取数位选项（含干扰项）
 * @param {number} targetDigit - 目标数字
 * @param {number} targetPlace - 目标数位索引
 * @param {number} maxPlace - 最大允许的数位索引
 * @returns {{ choices: string[], answer: string }}
 */
function generateChoices(targetDigit, targetPlace, maxPlace) {
  const answer = getPlaceLabel(targetDigit, targetPlace);
  const distractors = new Set();

  // 添加干扰项：其他数位但相同数字
  for (let i = 0; i <= maxPlace; i++) {
    if (i !== targetPlace) {
      distractors.add(getPlaceLabel(targetDigit, i));
    }
  }

  // 如果干扰项不够，补充其他数字的
  if (distractors.size < 3) {
    const altDigit = targetDigit === 5 ? 3 : 5;
    for (let i = 0; i <= maxPlace; i++) {
      if (distractors.size >= 3) break;
      const label = getPlaceLabel(altDigit, i);
      if (label !== answer) {
        distractors.add(label);
      }
    }
  }

  const choices = shuffle([answer, ...Array.from(distractors).slice(0, 3)]);
  return { choices, answer };
}

/**
 * 生成数位认知题目
 * @param {number} grade - 年级 (1-6)
 * @param {object} range - 数字范围 { min, max }
 * @returns {{ question: string, answer: string, type: string, operands: number[], inputType: string, choices: string[] }}
 */
function generatePlaceValue(grade, range) {
  let number, targetPlace, maxPlace;

  if (grade <= 1) {
    // 1年级：个位、十位
    maxPlace = 1;
    number = randomInt(10, 99);
  } else if (grade <= 2) {
    // 2年级：个位、十位、百位
    maxPlace = 2;
    number = randomInt(100, 999);
  } else if (grade <= 4) {
    // 3-4年级：千位、万位
    maxPlace = 3;
    number = randomInt(1000, 9999);
  } else {
    // 5-6年级：万位及以上
    maxPlace = 4;
    number = randomInt(10000, 999999);
  }

  // 随机选择一个数位
  targetPlace = randomInt(0, Math.min(maxPlace, String(number).length - 1));

  // 获取该数位上的数字
  const digit = Math.floor(number / Math.pow(10, targetPlace)) % 10;

  const { choices, answer } = generateChoices(digit, targetPlace, maxPlace);

  return {
    question: `数字 ${digit} 在 ${number} 中表示什么？`,
    answer,
    type: 'placeValue',
    operands: [number, targetPlace, digit],
    inputType: 'choice',
    choices
  };
}

register('placeValue', generatePlaceValue);

export default generatePlaceValue;
