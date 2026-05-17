/**
 * 卡牌数据库 - 约60张卡牌
 */

// 稀有度
export const RARITY = {
  COMMON: 'common',
  RARE: 'rare',
  EPIC: 'epic',
  LEGENDARY: 'legendary'
}

// 卡牌类型
export const CARD_TYPE = {
  ATTACK: 'attack',
  DEFENSE: 'defense',
  HEAL: 'heal',
  SPECIAL: 'special',
  EQUATION: 'equation' // 高年级专属
}

// 稀有度配置
export const rarityConfig = {
  common: { color: '#94a3b8', label: '普通', packWeight: 60, duplicateCoins: 5 },
  rare: { color: '#3b82f6', label: '稀有', packWeight: 25, duplicateCoins: 15 },
  epic: { color: '#a855f7', label: '史诗', packWeight: 12, duplicateCoins: 30 },
  legendary: { color: '#fbbf24', label: '传说', packWeight: 3, duplicateCoins: 50 }
}

// 卡包配置
export const packConfig = {
  common: { name: '普通卡包', icon: '📦', price: 50, currency: 'coins', weights: { common: 70, rare: 25, epic: 5, legendary: 0 } },
  rare: { name: '稀有卡包', icon: '🎁', price: 150, currency: 'coins', weights: { common: 40, rare: 40, epic: 17, legendary: 3 } },
  epic: { name: '史诗卡包', icon: '💜', price: 500, currency: 'coins', weights: { common: 20, rare: 40, epic: 35, legendary: 5 } },
  legendary: { name: '传说卡包', icon: '👑', price: 10, currency: 'gems', weights: { common: 10, rare: 30, epic: 45, legendary: 15 } }
}

// 卡牌数据库
export const cards = [
  // === 攻击卡 (1-2年级) ===
  { id: 'a01', name: '小火球', type: CARD_TYPE.ATTACK, rarity: RARITY.COMMON, value: 5, grade: [1, 2], desc: '造成5点伤害', combo: null },
  { id: 'a02', name: '水箭', type: CARD_TYPE.ATTACK, rarity: RARITY.COMMON, value: 4, grade: [1, 2], desc: '造成4点伤害', combo: null },
  { id: 'a03', name: '风刃', type: CARD_TYPE.ATTACK, rarity: RARITY.COMMON, value: 6, grade: [1, 2], desc: '造成6点伤害', combo: null },
  { id: 'a04', name: '雷击', type: CARD_TYPE.ATTACK, rarity: RARITY.RARE, value: 10, grade: [1, 2], desc: '造成10点伤害', combo: null },
  { id: 'a05', name: '陨石', type: CARD_TYPE.ATTACK, rarity: RARITY.EPIC, value: 15, grade: [1, 2], desc: '造成15点伤害', combo: null },
  { id: 'a06', name: '烈焰风暴', type: CARD_TYPE.ATTACK, rarity: RARITY.LEGENDARY, value: 25, grade: [1, 2], desc: '造成25点伤害', combo: null },

  // === 攻击卡 (3-4年级) ===
  { id: 'a07', name: '冰锥术', type: CARD_TYPE.ATTACK, rarity: RARITY.COMMON, value: 8, grade: [3, 4], desc: '造成8点伤害', combo: null },
  { id: 'a08', name: '闪电链', type: CARD_TYPE.ATTACK, rarity: RARITY.COMMON, value: 7, grade: [3, 4], desc: '造成7点伤害', combo: null },
  { id: 'a09', name: '暗影箭', type: CARD_TYPE.ATTACK, rarity: RARITY.RARE, value: 12, grade: [3, 4], desc: '造成12点伤害', combo: null },
  { id: 'a10', name: '火山爆发', type: CARD_TYPE.ATTACK, rarity: RARITY.EPIC, value: 20, grade: [3, 4], desc: '造成20点伤害', combo: null },
  { id: 'a11', name: '星辰坠落', type: CARD_TYPE.ATTACK, rarity: RARITY.LEGENDARY, value: 30, grade: [3, 4], desc: '造成30点伤害', combo: null },

  // === 攻击卡 (5-6年级) ===
  { id: 'a12', name: '量子冲击', type: CARD_TYPE.ATTACK, rarity: RARITY.COMMON, value: 10, grade: [5, 6], desc: '造成10点伤害', combo: null },
  { id: 'a13', name: '时空裂缝', type: CARD_TYPE.ATTACK, rarity: RARITY.RARE, value: 18, grade: [5, 6], desc: '造成18点伤害', combo: null },
  { id: 'a14', name: '维度崩塌', type: CARD_TYPE.ATTACK, rarity: RARITY.EPIC, value: 28, grade: [5, 6], desc: '造成28点伤害', combo: null },
  { id: 'a15', name: '宇宙大爆炸', type: CARD_TYPE.ATTACK, rarity: RARITY.LEGENDARY, value: 40, grade: [5, 6], desc: '造成40点伤害', combo: null },

  // === 防御卡 (1-2年级) ===
  { id: 'd01', name: '木盾', type: CARD_TYPE.DEFENSE, rarity: RARITY.COMMON, value: 3, grade: [1, 2], desc: '抵挡3点伤害', combo: null },
  { id: 'd02', name: '铁盾', type: CARD_TYPE.DEFENSE, rarity: RARITY.COMMON, value: 5, grade: [1, 2], desc: '抵挡5点伤害', combo: null },
  { id: 'd03', name: '魔法护盾', type: CARD_TYPE.DEFENSE, rarity: RARITY.RARE, value: 8, grade: [1, 2], desc: '抵挡8点伤害', combo: null },
  { id: 'd04', name: '圣光守护', type: CARD_TYPE.DEFENSE, rarity: RARITY.EPIC, value: 12, grade: [1, 2], desc: '抵挡12点伤害', combo: null },

  // === 防御卡 (3-4年级) ===
  { id: 'd05', name: '冰墙', type: CARD_TYPE.DEFENSE, rarity: RARITY.COMMON, value: 6, grade: [3, 4], desc: '抵挡6点伤害', combo: null },
  { id: 'd06', name: '岩石装甲', type: CARD_TYPE.DEFENSE, rarity: RARITY.RARE, value: 10, grade: [3, 4], desc: '抵挡10点伤害', combo: null },
  { id: 'd07', name: '绝对防御', type: CARD_TYPE.DEFENSE, rarity: RARITY.EPIC, value: 18, grade: [3, 4], desc: '抵挡18点伤害', combo: null },

  // === 防御卡 (5-6年级) ===
  { id: 'd08', name: '力场屏障', type: CARD_TYPE.DEFENSE, rarity: RARITY.COMMON, value: 8, grade: [5, 6], desc: '抵挡8点伤害', combo: null },
  { id: 'd09', name: '时空扭曲', type: CARD_TYPE.DEFENSE, rarity: RARITY.RARE, value: 14, grade: [5, 6], desc: '抵挡14点伤害', combo: null },
  { id: 'd10', name: '虚无领域', type: CARD_TYPE.DEFENSE, rarity: RARITY.EPIC, value: 22, grade: [5, 6], desc: '抵挡22点伤害', combo: null },

  // === 回复卡 (1-2年级) ===
  { id: 'h01', name: '小药水', type: CARD_TYPE.HEAL, rarity: RARITY.COMMON, value: 5, grade: [1, 2], desc: '回复5点HP', combo: null },
  { id: 'h02', name: '治疗术', type: CARD_TYPE.HEAL, rarity: RARITY.COMMON, value: 8, grade: [1, 2], desc: '回复8点HP', combo: null },
  { id: 'h03', name: '生命之泉', type: CARD_TYPE.HEAL, rarity: RARITY.RARE, value: 12, grade: [1, 2], desc: '回复12点HP', combo: null },
  { id: 'h04', name: '复活之光', type: CARD_TYPE.HEAL, rarity: RARITY.EPIC, value: 20, grade: [1, 2], desc: '回复20点HP', combo: null },

  // === 回复卡 (3-4年级) ===
  { id: 'h05', name: '自然治愈', type: CARD_TYPE.HEAL, rarity: RARITY.COMMON, value: 10, grade: [3, 4], desc: '回复10点HP', combo: null },
  { id: 'h06', name: '圣光回复', type: CARD_TYPE.HEAL, rarity: RARITY.RARE, value: 15, grade: [3, 4], desc: '回复15点HP', combo: null },
  { id: 'h07', name: '生命绽放', type: CARD_TYPE.HEAL, rarity: RARITY.EPIC, value: 25, grade: [3, 4], desc: '回复25点HP', combo: null },

  // === 回复卡 (5-6年级) ===
  { id: 'h08', name: '能量灌注', type: CARD_TYPE.HEAL, rarity: RARITY.COMMON, value: 12, grade: [5, 6], desc: '回复12点HP', combo: null },
  { id: 'h09', name: '时间回溯', type: CARD_TYPE.HEAL, rarity: RARITY.RARE, value: 20, grade: [5, 6], desc: '回复20点HP', combo: null },
  { id: 'h10', name: '永恒之泉', type: CARD_TYPE.HEAL, rarity: RARITY.EPIC, value: 35, grade: [5, 6], desc: '回复35点HP', combo: null },

  // === 特殊卡 (全年级) ===
  { id: 's01', name: '双倍伤害', type: CARD_TYPE.SPECIAL, rarity: RARITY.RARE, value: 0, grade: [1, 6], desc: '下次攻击伤害翻倍', combo: null, effect: 'double_damage' },
  { id: 's02', name: '吸血', type: CARD_TYPE.SPECIAL, rarity: RARITY.RARE, value: 0, grade: [1, 6], desc: '造成伤害的50%转为HP', combo: null, effect: 'lifesteal' },
  { id: 's03', name: '反击', type: CARD_TYPE.SPECIAL, rarity: RARITY.EPIC, value: 0, grade: [1, 6], desc: '反弹下次受到伤害', combo: null, effect: 'counter' },
  { id: 's04', name: '连击', type: CARD_TYPE.SPECIAL, rarity: RARITY.EPIC, value: 0, grade: [3, 6], desc: '本回合可再出一张牌', combo: null, effect: 'extra_turn' },
  { id: 's05', name: '幸运币', type: CARD_TYPE.SPECIAL, rarity: RARITY.LEGENDARY, value: 0, grade: [1, 6], desc: '获得50金币', combo: null, effect: 'bonus_coins' },

  // === 方程卡 (5-6年级专属) ===
  { id: 'e01', name: '解方程·一元', type: CARD_TYPE.EQUATION, rarity: RARITY.RARE, value: 15, grade: [5, 6], desc: '解出x发动15点伤害', combo: null, equation: 'x + 5 = 12', answer: 7 },
  { id: 'e02', name: '解方程·二元', type: CARD_TYPE.EQUATION, rarity: RARITY.EPIC, value: 22, grade: [5, 6], desc: '解出x发动22点伤害', combo: null, equation: '2x = 14', answer: 7 },
  { id: 'e03', name: '解方程·比例', type: CARD_TYPE.EQUATION, rarity: RARITY.EPIC, value: 25, grade: [5, 6], desc: '解出x发动25点伤害', combo: null, equation: 'x/3 = 4', answer: 12 },
  { id: 'e04', name: '终极方程', type: CARD_TYPE.EQUATION, rarity: RARITY.LEGENDARY, value: 35, grade: [5, 6], desc: '解出x发动35点伤害', combo: null, equation: '3x + 2 = 20', answer: 6 },

  // === 组合技卡 ===
  { id: 'c01', name: '火焰+风', type: CARD_TYPE.SPECIAL, rarity: RARITY.EPIC, value: 0, grade: [1, 6], desc: '与风系卡组合: 龙卷风(20伤)', combo: 'wind', effect: 'combo_tornado' },
  { id: 'c02', name: '水+冰', type: CARD_TYPE.SPECIAL, rarity: RARITY.EPIC, value: 0, grade: [3, 6], desc: '与冰系卡组合: 冰河世纪(25伤)', combo: 'ice', effect: 'combo_glacier' },
  { id: 'c03', name: '光+暗', type: CARD_TYPE.SPECIAL, rarity: RARITY.LEGENDARY, value: 0, grade: [5, 6], desc: '与暗系卡组合: 混沌爆发(35伤)', combo: 'dark', effect: 'combo_chaos' }
]

export function getCardById(id) {
  return cards.find(c => c.id === id)
}

export function getCardsByGrade(grade) {
  return cards.filter(c => c.grade[0] <= grade && c.grade[1] >= grade)
}

export function getCardsByRarity(rarity) {
  return cards.filter(c => c.rarity === rarity)
}

export default { cards, rarityConfig, packConfig, getCardById, getCardsByGrade, getCardsByRarity }
