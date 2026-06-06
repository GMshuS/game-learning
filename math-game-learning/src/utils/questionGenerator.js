/**
 * 数学题目生成器
 * 支持加减乘除、分数、小数、百分比等运算
 * 题型生成逻辑委托给 src/questions/ 下的独立模块，通过注册表管理
 */
import { getGradeRange, getGradeOperations } from '../config/grades'
import { generate as registryGenerate } from '../questions/registry'

// 导入所有题型以触发注册
import '../questions/addition'
import '../questions/subtraction'
import '../questions/multiplication'
import '../questions/division'
import '../questions/mixed'
import '../questions/fraction'
import '../questions/decimal'
import '../questions/percentage'

/**
 * 生成随机数
 */
function randomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min
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
  
  let question
  
  if (questionType === 'word') {
    question = generateWordProblem(grade, range)
  } else {
    question = registryGenerate(questionType, grade, range)
    if (!question) {
      // fallback 到加法
      question = registryGenerate('add', grade, range)
    }
  }
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
