/**
 * 混合运算题目生成器
 */
import { register } from './registry'
import { randomInt } from './_helpers'

/**
 * 生成混合运算题目
 * @param {number} grade - 年级
 * @param {object} range - 数字范围 { min, max }
 * @returns {{ question: string, answer: number, type: string, operands: number[], operators: string[] }}
 */
function generateMixedOperation(grade, range) {
  const operations = grade >= 3
    ? ['+', '-', '×', '÷']
    : ['+', '-']

  const op1 = operations[randomInt(0, operations.length - 1)]
  const op2 = operations[randomInt(0, operations.length - 1)]

  let a, b, c, answer

  // 简化：使用较小数字
  const smallRange = { min: 1, max: Math.min(20, range.max) }

  if (op1 === '×' || op1 === '÷') {
    a = randomInt(2, 10)
    if (op1 === '×') {
      b = randomInt(2, 10)
    } else {
      b = randomInt(2, 5)
      a = a * b
    }
  } else {
    a = randomInt(smallRange.min, smallRange.max)
    b = randomInt(smallRange.min, smallRange.max)
  }

  if (op2 === '×' || op2 === '÷') {
    c = randomInt(2, 10)
    if (op2 === '÷') {
      const temp = b
      b = c * temp
      c = temp
    }
  } else {
    c = randomInt(smallRange.min, smallRange.max)
  }

  // 计算答案
  let firstResult
  if (op1 === '+') firstResult = a + b
  else if (op1 === '-') firstResult = a - b
  else if (op1 === '×') firstResult = a * b
  else firstResult = a / b

  if (op2 === '+') answer = firstResult + c
  else if (op2 === '-') answer = firstResult - c
  else if (op2 === '×') answer = firstResult * c
  else answer = firstResult / c

  // 确保答案为整数且非负
  if (!Number.isInteger(answer) || answer < 0) {
    return generateMixedOperation(grade, range)
  }

  return {
    question: `${a} ${op1} ${b} ${op2} ${c} = ?`,
    answer: answer,
    type: 'mixed',
    operands: [a, b, c],
    operators: [op1, op2]
  }
}

register('mixed', generateMixedOperation)

export default generateMixedOperation
