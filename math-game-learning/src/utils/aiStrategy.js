/**
 * AI 策略工具 - 三档 AI 策略
 */

/**
 * 简单 AI - 随机出牌
 */
export function aiEasy(hand) {
  return Math.floor(Math.random() * hand.length)
}

/**
 * 中等 AI - 基于 HP 阈值的优先级规则
 */
export function aiNormal(hand, battleState) {
  const hpRatio = battleState.aiHP / battleState.aiMaxHP

  if (hpRatio < 0.3) {
    // 低血量优先防御/回复
    const healIdx = hand.findIndex(id => {
      const card = getCard(id)
      return card && (card.type === 'heal' || card.type === 'defense')
    })
    if (healIdx >= 0) return healIdx
  }

  if (hpRatio > 0.7) {
    // 高血量优先攻击
    const atkIdx = hand.findIndex(id => {
      const card = getCard(id)
      return card && card.type === 'attack'
    })
    if (atkIdx >= 0) return atkIdx
  }

  // 默认随机
  return Math.floor(Math.random() * hand.length)
}

/**
 * 复杂 AI - 期望收益评估函数
 */
export function aiHard(hand, battleState) {
  let bestIdx = 0
  let bestScore = -1

  hand.forEach((cardId, idx) => {
    const card = getCard(cardId)
    if (!card) return

    let score = 0
    const hpRatio = battleState.aiHP / battleState.aiMaxHP
    const playerHpRatio = battleState.playerHP / battleState.playerMaxHP

    switch (card.type) {
      case 'attack':
        score = card.value * 1.0
        if (playerHpRatio < 0.3) score *= 1.5 // 斩杀优先
        break
      case 'defense':
        score = card.value * 0.8
        if (hpRatio < 0.5) score *= 1.3
        break
      case 'heal':
        score = card.value * (hpRatio < 0.5 ? 1.5 : 0.5)
        break
      case 'special':
        score = 5
        if (card.effect === 'double_damage') score = 8
        if (card.effect === 'lifesteal') score = 6 + card.value
        break
    }

    // 稀有度系数
    const rarityMultiplier = { common: 1, rare: 1.2, epic: 1.4, legendary: 1.6 }
    score *= (rarityMultiplier[card.rarity] || 1)

    if (score > bestScore) {
      bestScore = score
      bestIdx = idx
    }
  })

  return bestIdx
}

function getCard(id) {
  // 延迟引用避免循环依赖
  const { getCardById } = require('../config/cards')
  return getCardById(id)
}

/**
 * 默认难度推荐（按年级）
 */
export function getRecommendedDifficulty(grade) {
  if (grade <= 2) return 'easy'
  if (grade <= 4) return 'normal'
  return 'hard'
}

export default { aiEasy, aiNormal, aiHard, getRecommendedDifficulty }
