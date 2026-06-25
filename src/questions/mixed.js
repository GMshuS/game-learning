/**
 * 混合运算题目生成器
 * 支持：
 * - 两则混合运算（+ - × ÷）
 * - 连加连减（a + b + c, a - b - c）
 * - 连乘连除（a × b × c, a ÷ b ÷ c）
 * - 带括号运算（(a + b) × c, a × (b - c), (a + b) ÷ c 等）
 */
import { register } from './registry';
import { randomInt } from './_helpers';

/**
 * 生成连加连减题目
 * @param {number} grade
 * @returns {{ question: string, answer: number, operands: number[], operators: string[] }}
 */
function generateSequentialAddSub(grade) {
  const maxNum = Math.min(50, grade <= 2 ? 20 : 50);
  const count = randomInt(2, 3); // 2-3个运算符 → 3-4个数
  const nums = [];
  const ops = [];
  let total = 0;

  for (let i = 0; i < count; i++) {
    const num = randomInt(1, maxNum);
    nums.push(num);
    if (i === 0) {
      total = num;
    } else {
      const op = Math.random() > 0.5 ? '+' : '-';
      ops.push(op);
      if (op === '+') {
        total += num;
      } else {
        total -= num;
      }
    }
  }

  // 确保结果为非负整数
  if (total < 0 || !Number.isInteger(total)) {
    return generateSequentialAddSub(grade);
  }

  // 构建题目字符串
  let questionStr = `${nums[0]}`;
  for (let i = 0; i < ops.length; i++) {
    questionStr += ` ${ops[i]} ${nums[i + 1]}`;
  }
  questionStr += ' = ?';

  return {
    question: questionStr,
    answer: total,
    operands: nums,
    operators: ops
  };
}

/**
 * 生成连乘连除题目
 * @returns {{ question: string, answer: number, operands: number[], operators: string[] }}
 */
function generateSequentialMulDiv() {
  const count = randomInt(1, 2); // 1-2个运算符 → 2-3个数
  let nums = [];
  let ops = [];
  let total;

  if (count === 1) {
    // a × b 或 a ÷ b
    const a = randomInt(2, 10);
    const b = randomInt(2, 10);
    if (Math.random() > 0.5) {
      total = a * b;
      ops = ['×'];
    } else {
      total = a;
      nums = [a * b, b];
      ops = ['÷'];
    }
    if (nums.length === 0) nums = [a, b];
  } else {
    // a × b × c 或 a ÷ b ÷ c 或 a × b ÷ c
    const a = randomInt(2, 8);
    const b = randomInt(2, 8);
    const firstOp = Math.random() > 0.5 ? '×' : '÷';
    const secondOp = Math.random() > 0.5 ? '×' : '÷';

    let intermediate;
    if (firstOp === '×') {
      intermediate = a * b;
    } else {
      intermediate = a;
      const tmpA = a * b;
      nums = [tmpA, b];
      intermediate = tmpA / b;
    }

    let c;
    if (secondOp === '×') {
      c = randomInt(2, 8);
      total = intermediate * c;
    } else {
      // 确保能整除
      c = randomInt(2, 8);
      const product = intermediate * c;
      total = product / c;
      intermediate = product;
    }

    if (nums.length === 0) nums = [a, b];
    nums.push(c);
    ops = [firstOp, secondOp];
  }

  // 确保结果为整数
  if (!Number.isInteger(total) || total <= 0) {
    return generateSequentialMulDiv();
  }

  // 构建题目字符串
  let questionStr = `${nums[0]}`;
  for (let i = 0; i < ops.length; i++) {
    questionStr += ` ${ops[i]} ${nums[i + 1]}`;
  }
  questionStr += ' = ?';

  return {
    question: questionStr,
    answer: total,
    operands: nums,
    operators: ops
  };
}

/**
 * 生成带括号的运算题目
 * @param {number} grade
 * @returns {{ question: string, answer: number, operands: number[], operators: string[] }}
 */
function generateBracketOperation(grade) {
  const highLevel = grade >= 5;

  // 括号位置模式
  const bracketType = randomInt(0, highLevel ? 5 : 3);

  let a, b, c, answer, questionStr;
  const ops = [];

  switch (bracketType) {
    case 0:
      // (a + b) × c
      a = randomInt(1, 15);
      b = randomInt(1, 15);
      c = randomInt(2, 8);
      answer = (a + b) * c;
      questionStr = `(${a} + ${b}) × ${c} = ?`;
      ops.push('+', '×');
      break;
    case 1:
      // (a - b) × c
      a = randomInt(10, 30);
      b = randomInt(1, a - 1);
      c = randomInt(2, 8);
      answer = (a - b) * c;
      questionStr = `(${a} - ${b}) × ${c} = ?`;
      ops.push('-', '×');
      break;
    case 2:
      // a × (b + c)
      a = randomInt(2, 8);
      b = randomInt(1, 15);
      c = randomInt(1, 15);
      answer = a * (b + c);
      questionStr = `${a} × (${b} + ${c}) = ?`;
      ops.push('×', '+');
      break;
    case 3:
      // a × (b - c)
      a = randomInt(2, 8);
      b = randomInt(10, 30);
      c = randomInt(1, b - 1);
      answer = a * (b - c);
      questionStr = `${a} × (${b} - ${c}) = ?`;
      ops.push('×', '-');
      break;
    case 4: {
      // (a + b) ÷ c （确保能整除）
      c = randomInt(2, 6);
      const q = randomInt(2, 10);
      a = randomInt(1, q * c - 1);
      b = q * c - a;
      answer = q;
      questionStr = `(${a} + ${b}) ÷ ${c} = ?`;
      ops.push('+', '÷');
      break;
    }
    case 5: {
      // (a - b) ÷ c （确保能整除）
      c = randomInt(2, 6);
      const quotient = randomInt(2, 8);
      const diff = quotient * c;
      a = randomInt(diff + 1, diff + 20);
      b = a - diff;
      answer = quotient;
      questionStr = `(${a} - ${b}) ÷ ${c} = ?`;
      ops.push('-', '÷');
      break;
    }
  }

  // 确保答案为整数
  if (!Number.isInteger(answer) || answer < 0) {
    return generateBracketOperation(grade);
  }

  return {
    question: questionStr,
    answer: answer,
    operands: [a, b, c],
    operators: ops
  };
}

/**
 * 生成两则混合运算题目（原有逻辑）
 * @param {number} grade
 * @param {object} range
 * @returns {{ question: string, answer: number, operands: number[], operators: string[] } | null}
 */
function generateTraditional(grade, range) {
  const operations = grade >= 3
    ? ['+', '-', '×', '÷']
    : ['+', '-'];

  const op1 = operations[randomInt(0, operations.length - 1)];
  const op2 = operations[randomInt(0, operations.length - 1)];

  let a, b, c, answer;

  const smallRange = { min: 1, max: Math.min(20, range.max) };

  if (op1 === '×' || op1 === '÷') {
    a = randomInt(2, 10);
    if (op1 === '×') {
      b = randomInt(2, 10);
    } else {
      b = randomInt(2, 5);
      a = a * b;
    }
  } else {
    a = randomInt(smallRange.min, smallRange.max);
    b = randomInt(smallRange.min, smallRange.max);
  }

  if (op2 === '×' || op2 === '÷') {
    c = randomInt(2, 10);
    if (op2 === '÷') {
      const temp = b;
      b = c * temp;
      c = temp;
    }
  } else {
    c = randomInt(smallRange.min, smallRange.max);
  }

  // 计算答案
  let firstResult;
  if (op1 === '+') firstResult = a + b;
  else if (op1 === '-') firstResult = a - b;
  else if (op1 === '×') firstResult = a * b;
  else firstResult = a / b;

  if (op2 === '+') answer = firstResult + c;
  else if (op2 === '-') answer = firstResult - c;
  else if (op2 === '×') answer = firstResult * c;
  else answer = firstResult / c;

  // 确保答案为整数且非负
  if (!Number.isInteger(answer) || answer < 0) {
    return null;
  }

  return {
    question: `${a} ${op1} ${b} ${op2} ${c} = ?`,
    answer: answer,
    operands: [a, b, c],
    operators: [op1, op2]
  };
}

/**
 * 生成混合运算题目
 * @param {number} grade - 年级
 * @param {object} range - 数字范围 { min, max }
 * @returns {{ question: string, answer: number, type: string, operands: number[], operators: string[] }}
 */
function generateMixedOperation(grade, range) {
  const MAX_ATTEMPTS = 20;

  for (let i = 0; i < MAX_ATTEMPTS; i++) {
    const rand = Math.random();

    if (grade >= 4) {
      // 4-6年级：所有类型
      if (rand < 0.35) {
        // 35% 传统两则混合
        const result = generateTraditional(grade, range);
        if (result) {
          return {
            question: result.question,
            answer: result.answer,
            type: 'mixed',
            operands: result.operands,
            operators: result.operators
          };
        }
      } else if (rand < 0.55) {
        // 20% 连加连减
        const result = generateSequentialAddSub(grade);
        return {
          question: result.question,
          answer: result.answer,
          type: 'mixed',
          operands: result.operands,
          operators: result.operators
        };
      } else if (rand < 0.75) {
        // 20% 连乘连除
        const result = generateSequentialMulDiv();
        return {
          question: result.question,
          answer: result.answer,
          type: 'mixed',
          operands: result.operands,
          operators: result.operators
        };
      } else {
        // 25% 带括号运算
        const result = generateBracketOperation(grade);
        return {
          question: result.question,
          answer: result.answer,
          type: 'mixed',
          operands: result.operands,
          operators: result.operators
        };
      }
    } else {
      // 1-3年级：传统两则 + 连加连减（仅加减）
      if (rand < 0.6) {
        const result = generateTraditional(grade, range);
        if (result) {
          return {
            question: result.question,
            answer: result.answer,
            type: 'mixed',
            operands: result.operands,
            operators: result.operators
          };
        }
      } else {
        const result = generateSequentialAddSub(grade);
        return {
          question: result.question,
          answer: result.answer,
          type: 'mixed',
          operands: result.operands,
          operators: result.operators
        };
      }
    }
  }

  // 保底：返回一个简单加法
  return {
    question: '1 + 2 + 3 = ?',
    answer: 6,
    type: 'mixed',
    operands: [1, 2, 3],
    operators: ['+', '+']
  };
}

register('mixed', generateMixedOperation);

export default generateMixedOperation;
