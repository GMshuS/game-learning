/**
 * 估算题生成器
 * 面向 3-4 年级
 * 四舍五入到最近整十/整百后估算
 */
import { register } from './registry'
import { randomInt } from './_helpers'

/**
 * 四舍五入到最近的整十
 */
function roundToTen(n) {
  return Math.round(n / 10) * 10
}

/**
 * 四舍五入到最近的整百
 */
function roundToHundred(n) {
  return Math.round(n / 100) * 100
}

/**
 * 生成估算题目
 * @param {number} grade - 年级 (1-6)
 * @param {object} range - 数字范围 { min, max }
 * @returns {{ question: string, answer: number, type: string, operands: number[] }}
 */
function generateEstimate(grade, range) {
  const { min, max } = range
  let question, answer, operands

  const useHundreds = grade >= 4 && Math.random() > 0.5

  if (useHundreds) {
    // 整百估算分支：加法/减法各 50%
    const operation = Math.random() > 0.5 ? 1 : 0
    const a = randomInt(Math.max(min, 100), Math.min(max, 500))
    const b = randomInt(Math.max(min, 50), Math.min(max, 300))
    const roundA = roundToHundred(a)
    const roundB = roundToHundred(b)

    if (operation === 0) {
      // 加法估算
      answer = roundA + roundB
      question = `估算：${a} + ${b} ≈ （先四舍五入到整百）`
      operands = [a, b, roundA, roundB]
    } else {
      // 减法估算
      const larger = Math.max(a, b)
      const smaller = Math.min(a, b)
      const roundLarger = roundToHundred(larger)
      const roundSmaller = roundToHundred(smaller)
      answer = roundLarger - roundSmaller
      question = `估算：${larger} - ${smaller} ≈ （先四舍五入到整百）`
      operands = [larger, smaller, roundLarger, roundSmaller]
    }
  } else {
    // 十位估算分支：加法/减法/乘法各约 1/3
    const operation = randomInt(0, 2)
    const a = randomInt(Math.max(min, 10), Math.min(max, 100))
    const b = randomInt(Math.max(min, 10), Math.min(max, 80))
    const roundA = roundToTen(a)
    const roundB = roundToTen(b)

    if (operation === 0) {
      // 加法估算
      answer = roundA + roundB
      question = `估算：${a} + ${b} ≈ （先四舍五入到整十）`
      operands = [a, b, roundA, roundB]
    } else if (operation === 1) {
      // 减法估算
      const larger = Math.max(a, b)
      const smaller = Math.min(a, b)
      const roundLarger = roundToTen(larger)
      const roundSmaller = roundToTen(smaller)
      answer = roundLarger - roundSmaller
      question = `估算：${larger} - ${smaller} ≈ （先四舍五入到整十）`
      operands = [larger, smaller, roundLarger, roundSmaller]
    } else {
      // 乘法估算
      const factorA = randomInt(Math.max(min, 10), Math.min(max, 50))
      const factorB = randomInt(2, 9)
      const roundFactorA = roundToTen(factorA)
      answer = roundFactorA * factorB
      question = `估算：${factorA} × ${factorB} ≈ （先四舍五入到整十）`
      operands = [factorA, factorB, roundFactorA]
    }
  }

  return {
    question,
    answer,
    type: 'estimate',
    operands
  }
}

register('estimate', generateEstimate)

export default generateEstimate
