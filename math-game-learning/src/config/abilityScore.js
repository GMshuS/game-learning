/**
 * 能力评分系统配置
 * 追踪玩家在各数学能力维度上的成长
 * 每种能力有独立的经验值和等级
 */

/** 所有能力类型枚举 */
export const ABILITY_TYPES = {
  NUMBER_SENSE: 'numberSense',          // 数感：数量感知、数字比较
  CALCULATION: 'calculation',           // 计算：加减乘除运算
  OBSERVATION: 'observation',           // 观察力：发现规律、细节
  MEMORY: 'memory',                     // 记忆力：记住数字、步骤
  REACTION: 'reaction',                 // 反应速度：快速作答
  LOGIC: 'logic',                       // 逻辑推理：推导、证明
  READING: 'reading',                   // 阅读理解：读题、理解题意
  ESTIMATION: 'estimation',             // 估算能力：近似计算
  SPATIAL: 'spatial',                   // 空间想象：几何、图形
  ABSTRACTION: 'abstraction',           // 抽象思维：符号、公式
  DATA_ANALYSIS: 'dataAnalysis',        // 数据分析：图表、统计
  STRATEGY: 'strategy',                 // 策略规划：多步规划
  FOCUS: 'focus',                       // 专注力：持续注意
  SYSTEM_THINKING: 'systemThinking',    // 系统思维：整体把握
  CRITICAL_THINKING: 'criticalThinking',// 批判性思维：验证、反思
  COMPREHENSIVE: 'comprehensive',       // 综合应用：多知识融合
  CREATIVITY: 'creativity',             // 创造性解题：非常规解法
}

/** 能力显示配置 */
export const abilityLabels = {
  numberSense:       { label: '数感',       icon: '🔢', color: '#4ade80' },
  calculation:       { label: '计算',       icon: '🧮', color: '#60a5fa' },
  observation:       { label: '观察力',     icon: '👁️', color: '#fbbf24' },
  memory:            { label: '记忆力',     icon: '🧠', color: '#a78bfa' },
  reaction:          { label: '反应速度',   icon: '⚡', color: '#f87171' },
  logic:             { label: '逻辑推理',   icon: '🔗', color: '#34d399' },
  reading:           { label: '阅读理解',   icon: '📖', color: '#f472b6' },
  estimation:        { label: '估算能力',   icon: '📏', color: '#fb923c' },
  spatial:           { label: '空间想象',   icon: '📐', color: '#2dd4bf' },
  abstraction:       { label: '抽象思维',   icon: '💭', color: '#e879f9' },
  dataAnalysis:      { label: '数据分析',   icon: '📊', color: '#38bdf8' },
  strategy:          { label: '策略规划',   icon: '♟️', color: '#fbbf24' },
  focus:             { label: '专注力',     icon: '🎯', color: '#ef4444' },
  systemThinking:    { label: '系统思维',   icon: '🔄', color: '#22d3ee' },
  criticalThinking:  { label: '批判性思维', icon: '⚖️', color: '#818cf8' },
  comprehensive:     { label: '综合应用',   icon: '🏆', color: '#f59e0b' },
  creativity:        { label: '创造性解题', icon: '💡', color: '#10b981' },
}

/** 能力升级经验表 */
export const abilityLevelExp = [
  { level: 1,  expNeeded: 0 },
  { level: 2,  expNeeded: 20 },
  { level: 3,  expNeeded: 50 },
  { level: 4,  expNeeded: 100 },
  { level: 5,  expNeeded: 180 },
  { level: 6,  expNeeded: 300 },
  { level: 7,  expNeeded: 500 },
  { level: 8,  expNeeded: 800 },
  { level: 9,  expNeeded: 1200 },
  { level: 10, expNeeded: 1800 },
]

/** 题目类型到能力类型的映射 */
export const questionTypeToAbility = {
  add: 'calculation',
  subtract: 'calculation',
  multiply: 'calculation',
  divide: 'calculation',
  mixed: 'logic',
  fraction: 'abstraction',
  decimal: 'dataAnalysis',
  percentage: 'dataAnalysis',
  word: 'reading',
}

/** 题目内部难度对应的经验值 */
export const difficultyExpMap = {
  easy: 2,
  medium: 3,
  hard: 5,
}

/**
 * 根据能力经验值获取等级
 * @param {number} exp
 * @returns {{ level: number, exp: number, expNeeded: number, progress: number }}
 */
export function getAbilityLevel(exp) {
  let level = 1
  for (let i = abilityLevelExp.length - 1; i >= 0; i--) {
    if (exp >= abilityLevelExp[i].expNeeded) {
      level = abilityLevelExp[i].level
      break
    }
  }
  const current = abilityLevelExp[level - 1] || abilityLevelExp[0]
  const next = abilityLevelExp[level] || abilityLevelExp[abilityLevelExp.length - 1]
  const expInLevel = exp - current.expNeeded
  const expNeededForNext = next.expNeeded - current.expNeeded

  return {
    level,
    exp,
    expNeeded: next.expNeeded,
    progress: expNeededForNext > 0 ? Math.min(1, expInLevel / expNeededForNext) : 1,
  }
}

export default {
  ABILITY_TYPES,
  abilityLabels,
  abilityLevelExp,
  questionTypeToAbility,
  difficultyExpMap,
  getAbilityLevel,
}
