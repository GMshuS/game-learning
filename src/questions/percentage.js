/**
 * 百分比题目生成器
 * 支持：基础百分比计算、折扣、税率、利率
 */
import { register } from './registry';
import { randomInt } from './_helpers';

/**
 * 生成基础百分比题目（原有逻辑）
 * "X% of Y = ?"
 * @returns {{ question: string, answer: number, operands: number[] }}
 */
function generateBasic() {
  const percentage = randomInt(1, 20) * 5; // 5%, 10%, 15%...
  const number = randomInt(2, 20) * 10; // 20, 30, 40...

  const answer = (percentage / 100) * number;

  return {
    question: `${percentage}% of ${number} = ?`,
    answer: answer,
    operands: [percentage, number],
    operator: '%'
  };
}

/**
 * 生成折扣题目
 * "原价X元，打Y折，现价多少元？"
 * @returns {{ question: string, answer: number, operands: number[] }}
 */
function generateDiscount() {
  const discount = randomInt(1, 9); // 1-9折
  let originalPrice;
  // 根据折扣力度选择合适原价，确保现价为整数
  if (discount <= 3) {
    originalPrice = randomInt(5, 20) * 10; // 50-200
  } else if (discount <= 6) {
    originalPrice = randomInt(3, 15) * 10; // 30-150
  } else {
    originalPrice = randomInt(2, 10) * 10; // 20-100
  }

  const answer = Math.floor(originalPrice * discount / 10);

  return {
    question: `一件商品原价 ${originalPrice} 元，打 ${discount} 折。打折后的价格是多少元？`,
    answer: answer,
    operands: [originalPrice, discount],
    operator: 'discount'
  };
}

/**
 * 生成税率题目
 * "收入X元，税率Y%，应缴税多少元？"
 * @returns {{ question: string, answer: number, operands: number[] }}
 */
function generateTax() {
  const taxRate = randomInt(1, 10) * 5; // 5%, 10%, 15%...50%
  let income;
  if (taxRate <= 20) {
    income = randomInt(5, 20) * 1000; // 5000-20000
  } else {
    income = randomInt(3, 10) * 1000; // 3000-10000
  }

  const answer = Math.floor(income * taxRate / 100);

  return {
    question: `小明的月收入是 ${income} 元，个人所得税税率为 ${taxRate}%。小明每月应缴纳个人所得税多少元？`,
    answer: answer,
    operands: [income, taxRate],
    operator: 'tax'
  };
}

/**
 * 生成利率题目
 * "本金X元，年利率Y%，存Z年，利息多少？"
 * @returns {{ question: string, answer: number, operands: number[] }}
 */
function generateInterest() {
  const rate = randomInt(1, 8); // 1%-8%
  const years = randomInt(1, 5); // 1-5年
  const principal = randomInt(1, 10) * 1000; // 1000-10000

  const answer = Math.floor(principal * rate / 100 * years);

  return {
    question: `小明在银行存入 ${principal} 元，年利率为 ${rate}%，存 ${years} 年（单利）。到期后小明可以获得多少元利息？`,
    answer: answer,
    operands: [principal, rate, years],
    operator: 'interest'
  };
}

/**
 * 生成百分比题目
 * @param {number} grade - 年级
 * @param {object} range - 数字范围 { min, max }
 * @returns {{ question: string, answer: number, type: string, operands: number[], operator: string }}
 */
function generatePercentage(grade, _range) {
  let result;

  if (grade >= 6) {
    // 6年级：全部类型（基础 + 折扣 + 税率 + 利率）
    const rand = Math.random();
    if (rand < 0.25) {
      result = generateBasic();
    } else if (rand < 0.5) {
      result = generateDiscount();
    } else if (rand < 0.75) {
      result = generateTax();
    } else {
      result = generateInterest();
    }
  } else if (grade >= 4) {
    // 4-5年级：基础 + 折扣
    const rand = Math.random();
    if (rand < 0.5) {
      result = generateBasic();
    } else {
      result = generateDiscount();
    }
  } else {
    // 1-3年级：仅基础百分比
    result = generateBasic();
  }

  return {
    question: result.question,
    answer: result.answer,
    type: 'percentage',
    operands: result.operands,
    operator: result.operator
  };
}

register('percentage', generatePercentage);

export default generatePercentage;
