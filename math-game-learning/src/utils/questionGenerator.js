/**
 * 数学题目生成器
 * 支持加减乘除、分数、小数、百分比等运算
 * 题型生成逻辑委托给 src/questions/ 下的独立模块，通过注册表管理
 *
 * ⚠️ 功能重叠提示：本模块与 src/utils/questionBank.js 均包含题目生成逻辑。
 *    建议长期统一入口，将 questionBank.js 的独立生成逻辑迁移到注册表模式中。
 */
import { getGradeRange, getGradeOperations } from '../config/grades'
import { generate as registryGenerate } from '../questions/registry'
import { gradeQuestionWeights } from '../config/gradeQuestionWeights'
import { getAvailableTypesForGrade } from '../config/questionTypes'

// 导入所有题型以触发注册
import '../questions/addition'
import '../questions/subtraction'
import '../questions/multiplication'
import '../questions/division'
import '../questions/mixed'
import '../questions/fraction'
import '../questions/decimal'
import '../questions/percentage'
import '../questions/wordProblem'
import '../questions/numberFill'
import '../questions/estimate'
import '../questions/equation'

/**
 * 生成随机数
 */
function randomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min
}

/**
 * 加权随机选择
 * 根据权重对象返回一个键，权重越高被选中的概率越大
 * @param {Object} weights - { type: weight, ... }
 * @returns {string} 选中的类型键
 */
function weightedRandom(weights) {
  const entries = Object.entries(weights)
  const totalWeight = entries.reduce((sum, [, w]) => sum + w, 0)
  let random = Math.random() * totalWeight
  for (const [type, weight] of entries) {
    random -= weight
    if (random <= 0) return type
  }
  return entries[entries.length - 1][0]
}

/**
 * 根据年级生成题目
 */
export function generateQuestion(grade = 1, questionType = 'random') {
  const range = getGradeRange(grade)
  const operations = getGradeOperations(grade)
  
  if (questionType === 'random') {
    const gradeWeights = gradeQuestionWeights[grade]
    if (gradeWeights) {
      // 使用权重策略选择题型
      const availableTypes = getAvailableTypesForGrade(grade)
      const filteredWeights = {}
      for (const type of availableTypes) {
        if (gradeWeights[type] !== undefined) {
          filteredWeights[type] = gradeWeights[type]
        }
      }
      if (Object.keys(filteredWeights).length > 0) {
        questionType = weightedRandom(filteredWeights)
      } else {
        // Fallback: 等概率选择可用题型
        questionType = availableTypes[randomInt(0, availableTypes.length - 1)]
      }
    } else {
      // Fallback: 权重配置不存在，回退到原有等概率逻辑
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
  }
  
  // 统一走注册表生成题目（word 类型已通过 src/questions/wordProblem.js 注册）
  let question = registryGenerate(questionType, grade, range)
  if (!question) {
    // fallback 到加法
    question = registryGenerate('add', grade, range)
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
  return 'q_' + Date.now() + '_' + Math.random().toString(36).slice(2, 11)
}

/**
 * 生成一组题目
 * 当 types 数组不为空时，按权重配置分发题型（而非等概率）；
 * 为空时由 generateQuestion(grade, 'random') 按全量权重分发。
 */
export function generateQuestionSet(grade, count = 10, options = {}) {
  const {
    types = [],
    difficulty = 'random'
  } = options

  // --- 确定题型选择策略 ---
  let pickType
  if (types.length > 0) {
    const gradeWeights = gradeQuestionWeights[grade]
    if (gradeWeights) {
      // 从 gradeWeights 中过滤出只包含 types 指定且有权重的条目
      const filteredWeights = {}
      for (const t of types) {
        if (gradeWeights[t] !== undefined) {
          filteredWeights[t] = gradeWeights[t]
        }
      }
      if (Object.keys(filteredWeights).length > 0) {
        pickType = () => weightedRandom(filteredWeights)
      } else {
        // 备选：指定题型都无权重时回退等概率
        pickType = () => types[randomInt(0, types.length - 1)]
      }
    } else {
      // 年级权重配置不存在时回退等概率
      pickType = () => types[randomInt(0, types.length - 1)]
    }
  } else {
    // types 为空 → 委托 generateQuestion 使用完整权重
    pickType = () => 'random'
  }

  const questions = []

  for (let i = 0; i < count; i++) {
    let question
    let attempts = 0

    do {
      const type = pickType()
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
