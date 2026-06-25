/**
 * 应用题生成器
 * 1-2 年级：简单加减
 * 3-4 年级：多步计算 + 归一归总 + 简单行程
 * 5-6 年级：复杂应用题 + 归一归总 + 行程 + 工程 + 植树 + 鸡兔同笼 + 浓度
 */
import { register } from './registry';
import { randomInt } from './_helpers';

/**
 * 生成简单加减应用题（1-2年级）
 */
function generateSimpleAddSub() {
  const a = randomInt(1, 50);
  const b = randomInt(1, 50);
  const isAddition = Math.random() > 0.5;

  if (isAddition) {
    const answer = a + b;
    return {
      question: `小明有 ${a} 个苹果，妈妈又给了他 ${b} 个苹果。小明现在一共有多少个苹果？`,
      answer,
      operands: [a, b]
    };
  } else {
    const larger = Math.max(a, b);
    const smaller = Math.min(a, b);
    const answer = larger - smaller;
    return {
      question: `小明有 ${larger} 个糖果，他吃了 ${smaller} 个。小明还剩下多少个糖果？`,
      answer,
      operands: [larger, smaller]
    };
  }
}

/**
 * 生成归一归总问题（3-6年级）
 * 归一："3支笔12元，5支笔多少元？"
 * 归总："每天看8页，15天看完，每天看10页，几天看完？"
 * @param {number} grade
 */
function generateUnification(grade) {
  if (Math.random() > 0.5 || grade >= 4) {
    // 归一问题
    const unitCount = randomInt(2, 8);
    const totalPrice = unitCount * randomInt(2, 10);
    const unitPrice = totalPrice / unitCount;
    const targetCount = randomInt(unitCount + 1, unitCount + 8);
    const answer = unitPrice * targetCount;
    return {
      question: `${unitCount} 支铅笔一共 ${totalPrice} 元，买 ${targetCount} 支同样的铅笔需要多少钱？`,
      answer,
      operands: [unitCount, totalPrice, targetCount]
    };
  } else {
    // 归总问题
    const dailyRate = randomInt(2, 10);
    const totalDays = randomInt(5, 20);
    const total = dailyRate * totalDays;
    const newDailyRate = randomInt(dailyRate + 1, dailyRate + 5);
    const answer = Math.ceil(total / newDailyRate);
    return {
      question: `小明每天看 ${dailyRate} 页书，${totalDays} 天可以看完一本书。如果每天看 ${newDailyRate} 页，需要多少天看完？`,
      answer,
      operands: [dailyRate, totalDays, newDailyRate]
    };
  }
}

/**
 * 生成行程问题（3-6年级）
 * @param {number} grade
 */
function generateTravel(grade) {
  if (grade <= 4) {
    // 简单行程：速度 × 时间 = 路程
    const speed = randomInt(30, 90);
    const time = randomInt(1, 5);
    const answer = speed * time;
    return {
      question: `一辆汽车每小时行驶 ${speed} 公里，连续行驶 ${time} 小时，一共行驶了多少公里？`,
      answer,
      operands: [speed, time]
    };
  } else {
    // 相遇问题：相对而行
    const speed1 = randomInt(40, 80);
    const speed2 = randomInt(40, 80);
    const distance = randomInt(2, 5) * 100; // 200-500公里
    const meetTime = distance / (speed1 + speed2);
    // 确保时间为整数或一位小数
    if (Number.isInteger(meetTime) || Math.abs(meetTime - Math.round(meetTime * 10) / 10) < 0.01) {
      const answer = Math.round(meetTime * 10) / 10;
      return {
        question: `甲、乙两车分别从相距 ${distance} 公里的两地同时相对开出，甲车每小时行 ${speed1} 公里，乙车每小时行 ${speed2} 公里。两车几小时后相遇？`,
        answer,
        operands: [distance, speed1, speed2]
      };
    }
    // 如果相遇时间不是整齐的数字，生成一个简单的行程题
    const speed = randomInt(40, 100);
    const time = randomInt(2, 6);
    const answer = speed * time;
    return {
      question: `一列火车每小时行驶 ${speed} 公里，行驶 ${time} 小时，一共行驶了多少公里？`,
      answer,
      operands: [speed, time]
    };
  }
}

/**
 * 生成工程问题（5-6年级）
 */
function generateWork() {
  const person1Days = randomInt(3, 10);
  const person2Days = randomInt(person1Days + 1, person1Days + 8);
  // 合作天数 = 1 / (1/person1 + 1/person2)
  const workRate = (1 / person1Days) + (1 / person2Days);
  const combineDays = 1 / workRate;
  const answer = Math.ceil(combineDays * 10) / 10; // 保留一位小数向上取整

  return {
    question: `一项工程，甲队单独做需要 ${person1Days} 天完成，乙队单独做需要 ${person2Days} 天完成。两队合作需要多少天完成？（保留一位小数）`,
    answer,
    operands: [person1Days, person2Days]
  };
}

/**
 * 生成植树问题（3-6年级）
 */
function generateTreePlanting() {
  const type = randomInt(0, 2);
  const interval = randomInt(2, 8);
  let length, totalTrees;

  if (type === 0) {
    // 两端都栽
    length = interval * randomInt(4, 15);
    totalTrees = length / interval + 1;
    return {
      question: `在一条 ${length} 米长的小路一旁种树，每隔 ${interval} 米种一棵（两端都种），一共需要种多少棵树？`,
      answer: totalTrees,
      operands: [length, interval]
    };
  } else if (type === 1) {
    // 两端不栽
    length = interval * randomInt(4, 15);
    totalTrees = length / interval - 1;
    return {
      question: `在一条 ${length} 米长的小路一旁种树，每隔 ${interval} 米种一棵（两端不种），一共需要种多少棵树？`,
      answer: totalTrees,
      operands: [length, interval]
    };
  } else {
    // 环形植树（封闭图形）
    length = interval * randomInt(4, 15);
    totalTrees = length / interval;
    return {
      question: `在一个周长为 ${length} 米的圆形花坛周围种树，每隔 ${interval} 米种一棵，一共需要种多少棵树？`,
      answer: totalTrees,
      operands: [length, interval]
    };
  }
}

/**
 * 生成鸡兔同笼问题（5-6年级）
 */
function generateChickenRabbit() {
  const heads = randomInt(5, 20);
  // 随机确定鸡和兔的数量
  const rabbitCount = randomInt(1, heads - 1);
  const chickenCount = heads - rabbitCount;
  const legs = rabbitCount * 4 + chickenCount * 2;
  const answer = rabbitCount;

  return {
    question: `笼子里有鸡和兔共 ${heads} 只，共有 ${legs} 条腿。问兔子有多少只？`,
    answer,
    operands: [heads, legs]
  };
}

/**
 * 生成浓度问题（5-6年级）
 */
function generateConcentration() {
  const type = randomInt(0, 1);

  if (type === 0) {
    // 求含盐量：盐水质量 × 浓度
    const mass = randomInt(2, 10) * 50; // 100-500克
    const percent = randomInt(5, 20); // 5%-20%
    const salt = Math.floor(mass * percent / 100);
    return {
      question: `有 ${mass} 克盐水，含盐率为 ${percent}%。这杯盐水中含有多少克盐？`,
      answer: salt,
      operands: [mass, percent]
    };
  } else {
    // 求浓度：盐 ÷ 盐水 × 100%
    const salt = randomInt(1, 10) * 5; // 5-50克
    const water = randomInt(5, 20) * 10; // 50-200克
    const total = salt + water;
    const percent = Math.round(salt / total * 100);
    return {
      question: `将 ${salt} 克盐溶解在 ${water} 克水中，得到的盐水的含盐率是多少？（结果取整数百分比）`,
      answer: percent,
      operands: [salt, water]
    };
  }
}

/**
 * 生成应用题题目
 * @param {number} grade - 年级 (1-6)
 * @param {object} range - 数字范围 { min, max }
 * @returns {{ question: string, answer: number, type: string, operands: number[] }}
 */
function generateWordProblem(grade, _range) {
  let question, answer, operands;

  if (grade <= 2) {
    // 1-2 年级：简单加减应用题
    const result = generateSimpleAddSub();
    return {
      question: result.question,
      answer: result.answer,
      type: 'word',
      operands: result.operands
    };
  } else if (grade <= 4) {
    // 3-4 年级：多步计算 + 归一归总 + 简单行程 + 植树
    const scenario = randomInt(0, 4);

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
      const total = people * randomInt(2, 10);
      answer = total / people;
      question = `老师把 ${total} 本练习本平均分给 ${people} 个学生，每个学生分到多少本？`;
      operands = [total, people];
    } else if (scenario === 2) {
      // 两步加减混合
      const start = randomInt(10, 50);
      const add1 = randomInt(5, 20);
      const sub1 = randomInt(3, 15);
      answer = start + add1 - sub1;
      question = `公交车上原来有 ${start} 人，到站后上来 ${add1} 人，又下去 ${sub1} 人。现在车上有多少人？`;
      operands = [start, add1, sub1];
    } else if (scenario === 3) {
      // 归一问题
      const result = generateUnification(grade);
      return {
        question: result.question,
        answer: result.answer,
        type: 'word',
        operands: result.operands
      };
    } else {
      // 植树问题（简单）
      const result = generateTreePlanting();
      return {
        question: result.question,
        answer: result.answer,
        type: 'word',
        operands: result.operands
      };
    }
  } else {
    // 5-6 年级：复杂应用题（8种类型）
    const scenario = randomInt(0, 7);

    if (scenario === 0) {
      // 行程问题
      const result = generateTravel(grade);
      return {
        question: result.question,
        answer: result.answer,
        type: 'word',
        operands: result.operands
      };
    } else if (scenario === 1) {
      // 折扣/百分比问题
      const originalPrice = randomInt(50, 500);
      const discountPercent = randomInt(10, 50);
      const discountAmount = Math.floor(originalPrice * discountPercent / 100);
      answer = originalPrice - discountAmount;
      question = `一件商品原价 ${originalPrice} 元，降价 ${discountPercent}%。打折后的价格是多少元？`;
      operands = [originalPrice, discountPercent];
    } else if (scenario === 2) {
      // 面积/周长问题
      const length = randomInt(5, 30);
      const width = randomInt(3, 20);
      answer = length * width;
      question = `一个长方形花坛长 ${length} 米，宽 ${width} 米。这个花坛的面积是多少平方米？`;
      operands = [length, width];
    } else if (scenario === 3) {
      // 归一归总
      const result = generateUnification(grade);
      return {
        question: result.question,
        answer: result.answer,
        type: 'word',
        operands: result.operands
      };
    } else if (scenario === 4) {
      // 工程问题
      const result = generateWork();
      return {
        question: result.question,
        answer: result.answer,
        type: 'word',
        operands: result.operands
      };
    } else if (scenario === 5) {
      // 鸡兔同笼
      const result = generateChickenRabbit();
      return {
        question: result.question,
        answer: result.answer,
        type: 'word',
        operands: result.operands
      };
    } else if (scenario === 6) {
      // 浓度问题
      const result = generateConcentration();
      return {
        question: result.question,
        answer: result.answer,
        type: 'word',
        operands: result.operands
      };
    } else {
      // 植树问题
      const result = generateTreePlanting();
      return {
        question: result.question,
        answer: result.answer,
        type: 'word',
        operands: result.operands
      };
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
