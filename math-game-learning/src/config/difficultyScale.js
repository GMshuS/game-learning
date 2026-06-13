/**
 * 全局难度倍率层
 * settingsStore.difficulty 通过此配置影响所有游戏模式
 * 与各模式自有难度正交叠加（相乘关系）
 * 
 * 设计原则：
 * - 简单模式：易上手，容错高，收益略低
 * - 普通模式：基准值 ×1.0
 * - 困难模式：挑战高，收益高
 * - 所有倍率设有 clamp 防止极端值
 */

const RATIO_CLAMP = { min: 0.3, max: 3.0 }

function clamp(val) {
  return Math.max(RATIO_CLAMP.min, Math.min(RATIO_CLAMP.max, val))
}

export const difficultyScale = {
  easy: {
    label: '简单',
    icon: '🌱',
    description: '适合初学者，怪物较弱，时间充裕，收益略低',

    /* 战斗相关 */
    monsterHpRatio: clamp(0.7),        // 怪物血量 70%
    monsterAttackRatio: clamp(0.7),    // 怪物攻击力 70%
    battleTimeRatio: clamp(1.3),       // 战斗时间 130%

    /* 速算相关 */
    speedAISpeedRatio: clamp(0.6),     // AI 答题速度 60%
    speedLivesBonus: 1,                // 生存模式 +1 条命

    /* 工坊相关 */
    materialRareRatio: clamp(1.3),     // 稀有材料掉落率提高 30%

    /* 卡牌相关 */
    aiStrategyLevel: 'random',         // AI 随机出牌

    /* 经济相关 */
    expRatio: clamp(0.8),              // 经验 ×0.8
    coinRatio: clamp(0.8),             // 金币 ×0.8
    gemThresholdRatio: clamp(0.7),     // 宝石达标门槛降低 30%

    /* 提示相关 */
    showHints: true,
    hintLevel: 'detailed',             // 详细提示
  },

  normal: {
    label: '普通',
    icon: '🌿',
    description: '标准难度，平衡挑战与收益',

    monsterHpRatio: clamp(1.0),
    monsterAttackRatio: clamp(1.0),
    battleTimeRatio: clamp(1.0),
    speedAISpeedRatio: clamp(1.0),
    speedLivesBonus: 0,
    materialRareRatio: clamp(1.0),
    aiStrategyLevel: 'basic',
    expRatio: clamp(1.0),
    coinRatio: clamp(1.0),
    gemThresholdRatio: clamp(1.0),
    showHints: true,
    hintLevel: 'normal',
  },

  hard: {
    label: '困难',
    icon: '🌵',
    description: '挑战性更高，怪物更强，收益更高',

    monsterHpRatio: clamp(1.4),
    monsterAttackRatio: clamp(1.3),
    battleTimeRatio: clamp(0.7),
    speedAISpeedRatio: clamp(1.4),
    speedLivesBonus: -1,
    materialRareRatio: clamp(0.7),
    aiStrategyLevel: 'optimal',
    expRatio: clamp(1.5),
    coinRatio: clamp(1.5),
    gemThresholdRatio: clamp(1.3),
    showHints: false,
    hintLevel: 'none',
  },
}

/**
 * 获取当前难度的缩放配置
 * @param {string} difficulty - 'easy' | 'normal' | 'hard'
 * @returns {object} 难度倍率配置对象
 */
export function getDifficultyScale(difficulty) {
  return difficultyScale[difficulty] || difficultyScale.normal
}

/**
 * 获取难度描述，带具体数值
 * @param {string} difficulty
 * @returns {Array<{label: string, value: string}>}
 */
export function getDifficultyDetails(difficulty) {
  const scale = getDifficultyScale(difficulty)
  return [
    { label: '怪物血量', value: `${Math.round(scale.monsterHpRatio * 100)}%` },
    { label: '怪物攻击', value: `${Math.round(scale.monsterAttackRatio * 100)}%` },
    { label: '战斗时间', value: `${Math.round(scale.battleTimeRatio * 100)}%` },
    { label: 'AI 速度', value: `${Math.round(scale.speedAISpeedRatio * 100)}%` },
    { label: '经验获取', value: `${Math.round(scale.expRatio * 100)}%` },
    { label: '金币获取', value: `${Math.round(scale.coinRatio * 100)}%` },
  ]
}

export default difficultyScale
