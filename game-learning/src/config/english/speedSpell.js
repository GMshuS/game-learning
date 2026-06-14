/**
 * 英语速拼模式配置
 */
export const speedSpellConfig = {
  // 子模式配置
  modes: {
    base: {
      id: 'base',
      name: '基础速拼',
      icon: '⏱️',
      description: '60秒内尽可能多答对单词',
      duration: 60,
      pointsPerCorrect: 10,
      comboBonus: 0.1
    },
    blitz: {
      id: 'blitz',
      name: '闪电抢拼',
      icon: '⚡',
      description: '与 AI 对手竞速拼词',
      duration: 45,
      pointsPerCorrect: 15,
      aiAnswerTime: { min: 3, max: 7 },
      comboBonus: 0.15
    },
    survival: {
      id: 'survival',
      name: '生存模式',
      icon: '💀',
      description: '3条命，答错扣命',
      lives: 3,
      pointsPerCorrect: 20,
      comboBonus: 0.2
    }
  },

  // 题目类型权重
  questionTypes: {
    en2cn: {
      weight: 0.40,
      label: '英译中'
    },
    cn2en: {
      weight: 0.35,
      label: '中译英'
    },
    listening: {
      weight: 0.25,
      label: '听音辨义'
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
    coinsPerPoint: 0.5,
    gemThresholds: [
      { score: 300, gems: 1 },
      { score: 500, gems: 2 },
      { score: 800, gems: 3 }
    ]
  },

  // 默认选项数量
  optionsCount: 4
};
