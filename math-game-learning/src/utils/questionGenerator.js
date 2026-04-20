/**
 * 数学题目生成器
 * 支持加减乘除、分数、小数、百分比等运算
 */
import { getGradeRange, getGradeOperations } from '../config/grades'

/**
 * 生成随机数
 */
function randomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min
}

/**
 * 生成加法题目
 */
function generateAddition(grade, range) {
  const a = randomInt(range.min, range.max)
  const b = randomInt(range.min, range.max)
  return {
    question: `${a} + ${b} = ?`,
    answer: a + b,
    type: 'add',
    operands: [a, b],
    operator: '+'
  }
}

/**
 * 生成减法题目（确保结果非负）
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

/**
 * 生成乘法题目
 */
function generateMultiplication(grade, range) {
  // 乘除法使用较小的数字范围
  const maxFactor = Math.min(12, Math.floor(range.max / 10))
  const a = randomInt(2, maxFactor)
  const b = randomInt(2, maxFactor)
  return {
    question: `${a} × ${b} = ?`,
    answer: a * b,
    type: 'multiply',
    operands: [a, b],
    operator: '×'
  }
}

/**
 * 生成除法题目（确保整除）
 */
function generateDivision(grade, range) {
  const maxFactor = Math.min(12, Math.floor(range.max / 10))
  const b = randomInt(2, maxFactor)
  const answer = randomInt(2, maxFactor)
  const a = b * answer // 确保整除
  return {
    question: `${a} ÷ ${b} = ?`,
    answer: answer,
    type: 'divide',
    operands: [a, b],
    operator: '÷'
  }
}

/**
 * 生成混合运算题目
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

/**
 * 生成分数题目
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

/**
 * 生成小数题目
 */
function generateDecimal(grade, range) {
  const decimalPlaces = grade >= 5 ? 1 : 2
  const multiplier = Math.pow(10, decimalPlaces)
  
  const a = randomInt(1, range.max * multiplier) / multiplier
  const b = randomInt(1, a * multiplier) / multiplier // 确保 a >= b
  
  const operation = Math.random() > 0.5 ? '+' : '-'
  const answer = operation === '+' ? a + b : a - b
  
  return {
    question: `${a.toFixed(decimalPlaces)} ${operation === '+' ? '+' : '-'} ${b.toFixed(decimalPlaces)} = ?`,
    answer: parseFloat(answer.toFixed(decimalPlaces)),
    type: 'decimal',
    operands: [a, b],
    operator: operation,
    decimalPlaces
  }
}

/**
 * 生成百分比题目
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

/**
 * 生成应用题（1-3 年级特色）
 */
function generateWordProblem(grade, range) {
  const scenarios = [
    {
      type: 'add',
      template: (a, b) => `小明有${a}个苹果，妈妈又给了他${b}个苹果，他现在一共有多少个苹果？`,
      answer: (a, b) => a + b
    },
    {
      type: 'subtract',
      template: (a, b) => `小红有${a}颗糖果，她吃了${b}颗，还剩多少颗？`,
      answer: (a, b) => a - b
    },
    {
      type: 'multiply',
      template: (a, b) => `每个铅笔盒有${a}支铅笔，有${b}个铅笔盒，一共有多少支铅笔？`,
      answer: (a, b) => a * b
    },
    {
      type: 'divide',
      template: (a, b) => `有${a}块饼干，平均分给${b}个小朋友，每个小朋友分到几块？`,
      answer: (a, b) => a / b
    }
  ]
  
  // 根据年级选择合适的场景
  let availableScenarios = scenarios
  if (grade < 3) {
    availableScenarios = scenarios.filter(s => s.type === 'add' || s.type === 'subtract')
  }
  
  const scenario = availableScenarios[randomInt(0, availableScenarios.length - 1)]
  
  let a, b
  if (scenario.type === 'add' || scenario.type === 'subtract') {
    a = randomInt(range.min, range.max)
    b = scenario.type === 'subtract' ? randomInt(1, a) : randomInt(range.min, range.max)
  } else {
    a = randomInt(2, 10)
    b = randomInt(2, 10)
  }
  
  return {
    question: scenario.template(a, b),
    answer: scenario.answer(a, b),
    type: 'word',
    subType: scenario.type,
    operands: [a, b]
  }
}

/**
 * 根据年级生成题目
 */
export function generateQuestion(grade = 1, questionType = 'random') {
  const range = getGradeRange(grade)
  const operations = getGradeOperations(grade)
  
  let generator
  
  if (questionType === 'random') {
    // 根据年级随机选择题目类型
    const availableTypes = []
    
    if (operations.includes('add')) availableTypes.push('add')
    if (operations.includes('subtract')) availableTypes.push('subtract')
    if (operations.includes('multiply')) availableTypes.push('multiply')
    if (operations.includes('divide')) availableTypes.push('divide')
    if (operations.includes('fraction')) availableTypes.push('fraction')
    if (operations.includes('decimal')) availableTypes.push('decimal')
    if (operations.includes('percentage')) availableTypes.push('percentage')
    
    // 1-3 年级可以生成应用题
    if (grade <= 3 && Math.random() < 0.3) {
      availableTypes.push('word')
    }
    
    if (grade >= 3 && operations.includes('multiply') && operations.includes('add')) {
      availableTypes.push('mixed')
    }
    
    questionType = availableTypes[randomInt(0, availableTypes.length - 1)]
  }
  
  switch (questionType) {
    case 'add':
      generator = generateAddition
      break
    case 'subtract':
      generator = generateSubtraction
      break
    case 'multiply':
      generator = generateMultiplication
      break
    case 'divide':
      generator = generateDivision
      break
    case 'mixed':
      generator = generateMixedOperation
      break
    case 'fraction':
      generator = generateFraction
      break
    case 'decimal':
      generator = generateDecimal
      break
    case 'percentage':
      generator = generatePercentage
      break
    case 'word':
      generator = generateWordProblem
      break
    default:
      generator = generateAddition
  }
  
  const question = generator(grade, range)
  question.grade = grade
  question.difficulty = getDifficulty(grade, questionType)
  question.id = generateQuestionId()
  question.createdAt = new Date().toISOString()
  
  return question
}

/**
 * 计算题目难度
 */
function getDifficulty(grade, type) {
  const easyTypes = ['add', 'subtract']
  const mediumTypes = ['multiply', 'divide', 'word']
  const hardTypes = ['mixed', 'fraction', 'decimal', 'percentage']
  
  if (easyTypes.includes(type)) return 'easy'
  if (mediumTypes.includes(type)) return 'medium'
  return 'hard'
}

/**
 * 生成题目 ID
 */
function generateQuestionId() {
  return 'q_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9)
}

/**
 * 生成一组题目
 */
export function generateQuestionSet(grade, count = 10, options = {}) {
  const {
    types = [],
    difficulty = 'random'
  } = options
  
  const questions = []
  
  for (let i = 0; i < count; i++) {
    let question
    let attempts = 0
    
    do {
      const type = types.length > 0 
        ? types[randomInt(0, types.length - 1)] 
        : 'random'
      question = generateQuestion(grade, type)
      attempts++
    } while (
      difficulty !== 'random' && 
      question.difficulty !== difficulty && 
      attempts < 10
    )
    
    questions.push(question)
  }
  
  return questions
}

export default {
  generateQuestion,
  generateQuestionSet
}
