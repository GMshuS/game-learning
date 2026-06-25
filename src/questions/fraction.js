/**
 * 分数题目生成器
 * 支持：分数加减（同分母）、分数乘除、通分、约分
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
  while (b) {
    const t = b;
    b = a % b;
    a = t;
  }
  return a;
}

/**
 * 将分数化简为最简形式
 * @param {number} numerator
 * @param {number} denominator
 * @returns {[number, number]} [化简后分子, 化简后分母]
 */
function simplifyFraction(numerator, denominator) {
  const g = gcd(Math.abs(numerator), Math.abs(denominator));
  return [numerator / g, denominator / g];
}

/**
 * 生成分数乘除法题目
 * @returns {{ question: string, answer: number, type: string, operands: array[], operator: string }}
 */
function generateMultiplyDivide() {
  // 生成两个真分数 a/b 和 c/d
  const b = randomInt(2, 10);
  const a = randomInt(1, b - 1);
  const d = randomInt(2, 10);
  const c = randomInt(1, d - 1);

  const isMultiply = Math.random() > 0.5;

  if (isMultiply) {
    // 乘法：a/b × c/d = (a×c)/(b×d)
    const num = a * c;
    const den = b * d;
    const [sNum, sDen] = simplifyFraction(num, den);
    return {
      question: `${a}/${b} × ${c}/${d} = ?`,
      answer: sNum / sDen,
      type: 'fraction',
      operands: [[a, b], [c, d]],
      operator: '×'
    };
  } else {
    // 除法：a/b ÷ c/d = a/b × d/c = (a×d)/(b×c)
    const num = a * d;
    const den = b * c;
    const [sNum, sDen] = simplifyFraction(num, den);
    return {
      question: `${a}/${b} ÷ ${c}/${d} = ?`,
      answer: sNum / sDen,
      type: 'fraction',
      operands: [[a, b], [c, d]],
      operator: '÷'
    };
  }
}

/**
 * 生成约分题：给一个非最简分数，求化简后的分数
 * @returns {{ question: string, answer: number, type: string, operands: array[], operator: string }}
 */
function generateReduction() {
  // 构造一个可约分的分数：选一个公因子 g，再生成互质的分子和分母
  const g = randomInt(2, 8);
  let baseNum = randomInt(1, 6);
  let baseDen = randomInt(baseNum + 1, baseNum + 8);
  // 确保 baseNum 和 baseDen 互质
  while (gcd(baseNum, baseDen) > 1) {
    baseDen++;
  }
  const numerator = baseNum * g;
  const denominator = baseDen * g;
  return {
    question: `将分数 ${numerator}/${denominator} 化为最简分数`,
    answer: baseNum / baseDen,
    type: 'fraction',
    operands: [[numerator, denominator]],
    operator: 'simplify'
  };
}

/**
 * 生成为通分题：给两个分数，求它们的公分母或比较大小
 * @returns {{ question: string, answer: number, type: string, operands: array[], operator: string }}
 */
function generateCommonDenominator() {
  const d1 = randomInt(2, 8);
  const d2 = randomInt(d1 + 1, d1 + 6);
  const n1 = randomInt(1, d1 - 1);
  const n2 = randomInt(1, d2 - 1);

  // 比较两个异分母分数的大小
  // 通分后比较分子：n1*d2 ? n2*d1
  const left = n1 * d2;
  const right = n2 * d1;
  let comp, answer;
  if (left > right) {
    comp = '>';
    answer = 1;
  } else if (left < right) {
    comp = '<';
    answer = -1;
  } else {
    comp = '=';
    answer = 0;
  }

  return {
    question: `比较大小：${n1}/${d1} ${comp === '>' ? '○' : '○'} ${n2}/${d2}`,
    answer: answer,
    type: 'fraction',
    operands: [[n1, d1], [n2, d2]],
    operator: 'compare'
  };
}

/**
 * 生成分数加减题目（原有逻辑，同分母）
 * @returns {{ question: string, answer: number, type: string, operands: array[], operator: string }}
 */
function generateAddSub() {
  const denominator = randomInt(2, 12);
  const numerator1 = randomInt(1, denominator - 1);
  const numerator2 = randomInt(1, denominator - 1);

  const operation = Math.random() > 0.5 ? '+' : '-';

  if (operation === '+') {
    if (numerator1 + numerator2 > denominator) {
      return null; // 结果大于1，重新尝试
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
      return null; // 负数结果，重新尝试
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

/**
 * 生成分数题目
 * @param {number} grade - 年级
 * @param {object} range - 数字范围 { min, max }
 * @returns {{ question: string, answer: number, type: string, operands: array[], operator: string }}
 */
function generateFraction(grade, _range) {
  const MAX_ATTEMPTS = 100;
  let attempts = 0;

  while (attempts < MAX_ATTEMPTS) {
    attempts++;

    // 根据年级选择题目类型
    const rand = Math.random();

    if (grade >= 5) {
      // 5-6年级：所有类型（加减、乘除、约分、通分比较）
      if (rand < 0.3) {
        // 30% 分数加减（同分母）
        const result = generateAddSub();
        if (result) return result;
      } else if (rand < 0.55) {
        // 25% 分数乘除
        return generateMultiplyDivide();
      } else if (rand < 0.8) {
        // 25% 约分
        return generateReduction();
      } else {
        // 20% 通分比较
        return generateCommonDenominator();
      }
    } else if (grade >= 3) {
      // 3-4年级：加减 + 简单乘除
      if (rand < 0.5) {
        const result = generateAddSub();
        if (result) return result;
      } else {
        // 简单分数乘除（用较小的分母）
        return generateMultiplyDivide();
      }
    } else {
      // 1-2年级：仅同分母加减
      const result = generateAddSub();
      if (result) return result;
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
