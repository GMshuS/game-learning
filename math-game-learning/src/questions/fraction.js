/**
 * 分数题目生成器
 */
import { register } from './registry'
import { randomInt } from './_helpers'

/**
 * 生成分数题目
 * @param {number} grade - 年级
 * @param {object} range - 数字范围 { min, max }
 * @returns {{ question: string, answer: number, type: string, operands: array[], operator: string }}
 */
function generateFraction(grade, range) {
  const denominator = randomInt(2, 12)
  const numerator1 = randomInt(1, denominator - 1)
  const numerator2 = randomInt(1, denominator - 1)

  // 确保结果不超过 1 或为负数
  const operation = Math.random() > 0.5 ? '+' : '-'
  let answer

  if (operation === '+') {
    answer = (numerator1 + numerator2) / denominator
    if (numerator1 + numerator2 > denominator) {
      // 结果大于 1，重新生成
      return generateFraction(grade, range)
    }
  } else {
    if (numerator1 < numerator2) {
      return generateFraction(grade, range)
    }
    answer = (numerator1 - numerator2) / denominator
  }

  return {
    question: `${numerator1}/${denominator} ${operation === '+' ? '+' : '-'} ${numerator2}/${denominator} = ?`,
    answer: answer,
    type: 'fraction',
    operands: [[numerator1, denominator], [numerator2, denominator]],
    operator: operation
  }
}

register('fraction', generateFraction)

export default generateFraction
