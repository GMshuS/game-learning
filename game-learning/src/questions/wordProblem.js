/**
 * 应用题生成器
 * 1-2 年级：简单加减
 * 3-4 年级：多步计算
 * 5-6 年级：复杂应用题
 */
import { register } from './registry';
import { randomInt } from './_helpers';

/**
 * 生成应用题题目
 * @param {number} grade - 年级 (1-6)
 * @param {object} range - 数字范围 { min, max }
 * @returns {{ question: string, answer: number, type: string, operands: number[] }}
 */
function generateWordProblem(grade, range) {
  const { min, max } = range;
  let question, answer, operands;

  if (grade <= 2) {
    // 1-2 年级：简单加减应用题
    const a = randomInt(Math.max(min, 1), Math.min(max, 50));
    const b = randomInt(Math.max(min, 1), Math.min(max, 50));
    const isAddition = Math.random() > 0.5;

    if (isAddition) {
      answer = a + b;
      question = `小明有 ${a} 个苹果，妈妈又给了他 ${b} 个苹果。小明现在一共有多少个苹果？`;
      operands = [a, b];
    } else {
      const larger = Math.max(a, b);
      const smaller = Math.min(a, b);
      answer = larger - smaller;
      question = `小明有 ${larger} 个糖果，他吃了 ${smaller} 个。小明还剩下多少个糖果？`;
      operands = [larger, smaller];
    }
  } else if (grade <= 4) {
    // 3-4 年级：多步计算应用题
    const scenario = randomInt(0, 2);

    if (scenario === 0) {
      // 购物：单价 × 数量 + 固定花费
      const unitPrice = randomInt(2, 15);
      const quantity = randomInt(2, 6);
      const extraCost = randomInt(1, 10);
      answer = unitPrice * quantity + extraCost;
      question = `小明买了 ${quantity} 支铅笔，每支铅笔 ${unitPrice} 元，又买了一个 ${extraCost} 元的橡皮擦。小明一共花了多少钱？`;
      operands = [unitPrice, quantity, extraCost];
    } else if (scenario === 1) {
      // 分配问题：总数 ÷ 人数
      const people = randomInt(2, 6);
      const total = people * randomInt(2, 10);  // 保证可整除，避免有余数
      answer = total / people;
      question = `老师把 ${total} 本练习本平均分给 ${people} 个学生，每个学生分到多少本？`;
      operands = [total, people];
    } else {
      // 两步加减混合
      const start = randomInt(10, 50);
      const add1 = randomInt(5, 20);
      const sub1 = randomInt(3, 15);
      answer = start + add1 - sub1;
      question = `公交车上原来有 ${start} 人，到站后上来 ${add1} 人，又下去 ${sub1} 人。现在车上有多少人？`;
      operands = [start, add1, sub1];
    }
  } else {
    // 5-6 年级：复杂应用题
    const scenario = randomInt(0, 2);

    if (scenario === 0) {
      // 速度/时间/距离问题
      const speed = randomInt(30, 120);
      const time = randomInt(1, 5);
      answer = speed * time;
      question = `一辆汽车每小时行驶 ${speed} 公里，连续行驶 ${time} 小时，一共行驶了多少公里？`;
      operands = [speed, time];
    } else if (scenario === 1) {
      // 折扣/百分比问题
      const originalPrice = randomInt(50, 500);
      const discountPercent = randomInt(10, 50);
      const discountAmount = Math.floor(originalPrice * discountPercent / 100);
      answer = originalPrice - discountAmount;
      question = `一件商品原价 ${originalPrice} 元，降价 ${discountPercent}%。打折后的价格是多少元？`;
      operands = [originalPrice, discountPercent];
    } else {
      // 面积/周长问题
      const length = randomInt(5, 30);
      const width = randomInt(3, 20);
      answer = length * width;
      question = `一个长方形花坛长 ${length} 米，宽 ${width} 米。这个花坛的面积是多少平方米？`;
      operands = [length, width];
    }
  }

  return {
    question,
    answer,
    type: 'word',
    operands
  };
}

register('word', generateWordProblem);

export default generateWordProblem;
