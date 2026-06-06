/**
 * 减法题目生成器（确保结果非负）
 */
import { register } from './registry'
import { randomInt } from './_helpers'

/**
 * 生成减法题目
 * @param {number} grade - 年级
 * @param {object} range - 数字范围 { min, max }
 * @returns {{ question: string, answer: number, type: string, operands: number[], operator: string }}
 */
function generateSubtraction(grade, range) {
  const a = randomInt(range.min, range.max)
  const b = randomInt(range.min, a) // 确保 a >= b
  return {
    question: `${a} - ${b} = ?`,
    answer: a - b,
    type: 'subtract',
    operands: [a, b],
    operator: '-'
  }
}

register('subtract', generateSubtraction)

export default generateSubtraction
