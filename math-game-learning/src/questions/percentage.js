/**
 * 百分比题目生成器
 */
import { register } from './registry'
import { randomInt } from './_helpers'

/**
 * 生成百分比题目
 * @param {number} grade - 年级
 * @param {object} range - 数字范围 { min, max }
 * @returns {{ question: string, answer: number, type: string, operands: number[], operator: string }}
 */
function generatePercentage(grade, range) {
  const percentage = randomInt(1, 20) * 5 // 5%, 10%, 15%...
  const number = randomInt(2, 20) * 10 // 20, 30, 40...

  const answer = (percentage / 100) * number

  return {
    question: `${percentage}% of ${number} = ?`,
    answer: answer,
    type: 'percentage',
    operands: [percentage, number],
    operator: '%'
  }
}

register('percentage', generatePercentage)

export default generatePercentage
