/**
 * 概率实验室 — 实验配置
 * 包含4种概率实验的默认参数和年级难度配置
 */

/**
 * 年级难度配置
 * 1-2年级：可能性（一定/可能/不可能）
 * 3-4年级：可能性大小比较
 * 5-6年级：概率计算
 */
export const gradeConfig = {
  1: {
    label: '一年级',
    level: 'basic',             // 基础：可能性概念
    description: '理解"一定""可能""不可能"',
    experimentCount: 5,         // 每轮实验次数
    trialsLimit: 30,            // 最大模拟次数
    showProbability: false,     // 是否显示概率值
    showComparison: false       // 是否显示可能性比较
  },
  2: {
    label: '二年级',
    level: 'basic',
    description: '用"一定""可能""不可能"描述事件',
    experimentCount: 5,
    trialsLimit: 30,
    showProbability: false,
    showComparison: false
  },
  3: {
    label: '三年级',
    level: 'comparison',        // 比较：可能性大小
    description: '比较事件发生的可能性大小',
    experimentCount: 8,
    trialsLimit: 50,
    showProbability: false,
    showComparison: true
  },
  4: {
    label: '四年级',
    level: 'comparison',
    description: '可能性大小比较与简单描述',
    experimentCount: 8,
    trialsLimit: 50,
    showProbability: false,
    showComparison: true
  },
  5: {
    label: '五年级',
    level: 'calculation',       // 计算：概率计算
    description: '理解概率意义，计算简单概率',
    experimentCount: 10,
    trialsLimit: 100,
    showProbability: true,
    showComparison: true
  },
  6: {
    label: '六年级',
    level: 'calculation',
    description: '概率计算与统计规律',
    experimentCount: 10,
    trialsLimit: 100,
    showProbability: true,
    showComparison: true
  }
};

/**
 * 4种实验的默认配置
 */
export const experiments = {
  dice: {
    id: 'dice',
    name: '掷骰子',
    icon: '🎲',
    description: '掷一个标准的六面骰子，观察点数',
    defaultParams: {
      sides: 6,
      trials: 20
    },
    possibleOutcomes: [1, 2, 3, 4, 5, 6],
    outcomeLabels: ['1点', '2点', '3点', '4点', '5点', '6点'],
    outcomeColors: [0xef4444, 0xf97316, 0xf59e0b, 0x22c55e, 0x3b82f6, 0x8b5cf6]
  },
  ball: {
    id: 'ball',
    name: '抽球',
    icon: '🎱',
    description: '从袋中随机抽取彩球',
    defaultParams: {
      ballCounts: { red: 5, blue: 3, green: 2, yellow: 1 },
      trials: 20
    },
    possibleOutcomes: ['red', 'blue', 'green', 'yellow'],
    outcomeLabels: ['红色', '蓝色', '绿色', '黄色'],
    outcomeColors: [0xef4444, 0x3b82f6, 0x22c55e, 0xfbbf24]
  },
  coin: {
    id: 'coin',
    name: '抛硬币',
    icon: '🪙',
    description: '抛一枚硬币，观察正反面',
    defaultParams: {
      trials: 20
    },
    possibleOutcomes: ['heads', 'tails'],
    outcomeLabels: ['正面', '反面'],
    outcomeColors: [0xf59e0b, 0x6b7280]
  },
  spinner: {
    id: 'spinner',
    name: '转盘',
    icon: '🎯',
    description: '转动彩色扇形转盘',
    defaultParams: {
      sectors: 8,
      trials: 20
    },
    possibleOutcomes: [0, 1, 2, 3, 4, 5, 6, 7],
    outcomeLabels: ['红', '蓝', '绿', '黄', '紫', '橙', '青', '粉'],
    outcomeColors: [0xef4444, 0x3b82f6, 0x22c55e, 0xfbbf24, 0x8b5cf6, 0xf97316, 0x06b6d4, 0xec4899]
  }
};

/**
 * 根据年级获取配置
 * @param {number} grade - 年级 (1-6)
 * @returns {object}
 */
export function getConfigForGrade(grade) {
  const clampedGrade = Math.min(6, Math.max(1, grade));
  return gradeConfig[clampedGrade] || gradeConfig[1];
}

/**
 * 获取实验配置
 * @param {string} experimentId - 实验ID
 * @returns {object|null}
 */
export function getExperimentConfig(experimentId) {
  return experiments[experimentId] || null;
}

/**
 * 获取所有实验列表
 * @returns {Array<{id: string, name: string, icon: string, description: string}>}
 */
export function getAllExperiments() {
  return Object.values(experiments).map(exp => ({
    id: exp.id,
    name: exp.name,
    icon: exp.icon,
    description: exp.description,
    defaultParams: exp.defaultParams
  }));
}

/**
 * 根据实验类型和年级生成参数
 * @param {string} experimentId - 实验ID
 * @param {number} grade - 年级
 * @returns {object} 实验参数
 */
export function generateExperimentParams(experimentId, grade) {
  const expConfig = experiments[experimentId];
  const gradeConf = getConfigForGrade(grade);

  if (!expConfig) return null;

  const params = {
    ...expConfig.defaultParams,
    trials: gradeConf.trialsLimit,
    experimentCount: gradeConf.experimentCount
  };

  // 年级特殊调整
  if (experimentId === 'ball') {
    // 低年级减少球的数量和种类
    if (grade <= 2) {
      params.ballCounts = { red: 3, blue: 2, green: 1 };
    } else if (grade <= 4) {
      params.ballCounts = { red: 5, blue: 3, green: 2, yellow: 1 };
    }
  }

  if (experimentId === 'spinner') {
    // 低年级减少扇区数量
    if (grade <= 2) {
      params.sectors = 4;
    } else if (grade <= 4) {
      params.sectors = 6;
    } else {
      params.sectors = 8;
    }
  }

  return params;
}

/**
 * 随机整数 [min, max]
 */
function randomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

/**
 * 模拟一次实验
 * @param {string} experimentId - 实验ID
 * @param {object} params - 实验参数
 * @returns {*} 实验结果
 */
export function simulateOnce(experimentId, params) {
  switch (experimentId) {
    case 'dice': {
      return randomInt(1, params.sides || 6);
    }
    case 'ball': {
      // 根据各颜色球的数量构建池子
      const pool = [];
      if (params.ballCounts) {
        Object.entries(params.ballCounts).forEach(([color, count]) => {
          for (let i = 0; i < count; i++) {
            pool.push(color);
          }
        });
      }
      return pool[randomInt(0, pool.length - 1)];
    }
    case 'coin': {
      return Math.random() < 0.5 ? 'heads' : 'tails';
    }
    case 'spinner': {
      return randomInt(0, (params.sectors || 8) - 1);
    }
    default:
      return null;
  }
}

/**
 * 模拟多次实验并返回统计结果
 * @param {string} experimentId - 实验ID
 * @param {object} params - 实验参数
 * @param {number} count - 模拟次数
 * @returns {{ results: Array, stats: object }}
 */
export function simulateMultiple(experimentId, params, count) {
  const results = [];
  for (let i = 0; i < count; i++) {
    results.push(simulateOnce(experimentId, params));
  }

  // 统计频次
  const experiment = experiments[experimentId];
  const stats = {};
  if (experiment) {
    experiment.possibleOutcomes.forEach(outcome => {
      const label = getOutcomeLabel(experimentId, outcome);
      stats[label] = {
        count: 0,
        frequency: 0,
        theoreticalProb: getTheoreticalProbability(experimentId, outcome, params)
      };
    });
  }

  results.forEach(result => {
    const label = getOutcomeLabel(experimentId, result);
    if (stats[label]) {
      stats[label].count++;
    }
  });

  // 计算实际频率
  Object.keys(stats).forEach(key => {
    stats[key].frequency = count > 0 ? stats[key].count / count : 0;
  });

  return { results, stats };
}

/**
 * 获取结果标签
 * @param {string} experimentId
 * @param {*} outcome
 * @returns {string}
 */
function getOutcomeLabel(experimentId, outcome) {
  const exp = experiments[experimentId];
  if (!exp) return String(outcome);

  if (experimentId === 'dice') {
    return `${outcome}点`;
  }
  if (experimentId === 'ball') {
    const labels = { red: '红色', blue: '蓝色', green: '绿色', yellow: '黄色' };
    return labels[outcome] || String(outcome);
  }
  if (experimentId === 'coin') {
    return outcome === 'heads' ? '正面' : '反面';
  }
  if (experimentId === 'spinner') {
    const spinnerLabels = ['红', '蓝', '绿', '黄', '紫', '橙', '青', '粉'];
    return spinnerLabels[outcome] || String(outcome);
  }
  return String(outcome);
}

/**
 * 计算理论概率
 * @param {string} experimentId
 * @param {*} outcome
 * @param {object} params
 * @returns {number}
 */
function getTheoreticalProbability(experimentId, outcome, params) {
  switch (experimentId) {
    case 'dice':
      return 1 / (params.sides || 6);
    case 'ball': {
      if (!params.ballCounts) return 0;
      const total = Object.values(params.ballCounts).reduce((s, v) => s + v, 0);
      return total > 0 ? (params.ballCounts[outcome] || 0) / total : 0;
    }
    case 'coin':
      return 0.5;
    case 'spinner':
      return 1 / (params.sectors || 8);
    default:
      return 0;
  }
}

export default {
  gradeConfig,
  experiments,
  getConfigForGrade,
  getExperimentConfig,
  getAllExperiments,
  generateExperimentParams,
  simulateOnce,
  simulateMultiple
};
