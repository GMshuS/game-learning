/**
 * 速算竞技场配置
 */

export const speedChallengeConfig = {
  // 子模式配置
  modes: {
    base: {
      id: 'base',
      name: '基础速算',
      description: '60秒内尽可能多答题',
      duration: 60, // 秒
      pointsPerCorrect: 10,
      comboBonus: 0.1 // 每连击加成 10%
    },
    blitz: {
      id: 'blitz',
      name: '闪电抢答',
      description: '与 AI 对手竞速',
      duration: 45,
      pointsPerCorrect: 15,
      aiAnswerTime: { min: 2, max: 5 }, // AI 答题时间范围（秒）
      comboBonus: 0.15
    },
    survival: {
      id: 'survival',
      name: '生存模式',
      description: '3条命，答错扣命',
      lives: 3,
      pointsPerCorrect: 20,
      comboBonus: 0.2
    }
  },

  // 评级标准
  ratings: [
    { minScore: 0, rating: 'D', label: '继续努力' },
    { minScore: 100, rating: 'C', label: '不错' },
    { minScore: 300, rating: 'B', label: '很好' },
    { minScore: 500, rating: 'A', label: '优秀' },
    { minScore: 800, rating: 'S', label: '完美' }
  ],

  // 奖励配置
  rewards: {
    coinsPerPoint: 0.5, // 每分获得金币
    gemThresholds: [
      { score: 300, gems: 1 },
      { score: 500, gems: 2 },
      { score: 800, gems: 3 }
    ]
  },

  // 年级题目类型适配
  gradeConfig: {
    1: { operations: ['+', '-'], maxNum: 20 },
    2: { operations: ['+', '-'], maxNum: 100 },
    3: { operations: ['+', '-', '×'], maxNum: 100 },
    4: { operations: ['+', '-', '×', '÷'], maxNum: 100 },
    5: { operations: ['+', '-', '×', '÷'], maxNum: 1000 },
    6: { operations: ['+', '-', '×', '÷'], maxNum: 1000 }
  }
}

export default speedChallengeConfig
