/**
 * 题目难度配置
 */
export const difficultyConfig = {
  easy: {
    label: '简单',
    color: '#4ade80',
    expMultiplier: 1.0,
    coinMultiplier: 1.0,
    timeLimit: null
  },
  medium: {
    label: '中等',
    color: '#fbbf24',
    expMultiplier: 1.5,
    coinMultiplier: 1.5,
    timeLimit: 60
  },
  hard: {
    label: '困难',
    color: '#f87171',
    expMultiplier: 2.0,
    coinMultiplier: 2.0,
    timeLimit: 30
  }
};

/**
 * 题型配置
 */
export const questionTypeConfig = {
  add: {
    label: '加法',
    icon: '➕',
    color: '#60a5fa'
  },
  subtract: {
    label: '减法',
    icon: '➖',
    color: '#f472b6'
  },
  multiply: {
    label: '乘法',
    icon: '✖️',
    color: '#34d399'
  },
  divide: {
    label: '除法',
    icon: '➗',
    color: '#a78bfa'
  },
  mixed: {
    label: '混合运算',
    icon: '🔢',
    color: '#fb923c'
  },
  fraction: {
    label: '分数',
    icon: '📐',
    color: '#2dd4bf'
  },
  decimal: {
    label: '小数',
    icon: '🔢',
    color: '#6ee7b7'
  },
  percentage: {
    label: '百分比',
    icon: '%',
    color: '#fcd34d'
  },
  word: {
    label: '应用题',
    icon: '📝',
    color: '#f87171'
  },
  numberFill: {
    label: '填空题',
    icon: '⬜',
    color: '#a78bfa'
  },
  estimate: {
    label: '估算题',
    icon: '≈',
    color: '#34d399'
  },
  equation: {
    label: '方程求解',
    icon: '✕',
    color: '#fbbf24'
  }
};

/**
 * 获取难度配置
 */
export function getDifficultyConfig(difficulty) {
  return difficultyConfig[difficulty] || difficultyConfig.easy;
}

/**
 * 获取题型配置
 */
export function getQuestionTypeConfig(type) {
  return questionTypeConfig[type] || questionTypeConfig.add;
}

/**
 * 根据年级获取可用的题型
 */
export function getAvailableTypesForGrade(grade) {
  const typeMap = {
    1: ['add', 'subtract', 'word', 'numberFill'],
    2: ['add', 'subtract', 'multiply', 'word', 'numberFill'],
    3: ['add', 'subtract', 'multiply', 'divide', 'mixed', 'word', 'estimate'],
    4: ['add', 'subtract', 'multiply', 'divide', 'mixed', 'word'],
    5: ['add', 'subtract', 'multiply', 'divide', 'fraction', 'decimal', 'mixed', 'word', 'equation'],
    6: ['add', 'subtract', 'multiply', 'divide', 'fraction', 'decimal', 'percentage', 'mixed', 'word', 'equation']
  };
  
  return typeMap[grade] || typeMap[1];
}

export default {
  difficultyConfig,
  questionTypeConfig,
  getDifficultyConfig,
  getQuestionTypeConfig,
  getAvailableTypesForGrade
};
