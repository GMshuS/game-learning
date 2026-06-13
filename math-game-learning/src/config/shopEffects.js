/**
 * 道具效果类型与数据定义
 *
 * 每个商品对应一个 effect 对象，定义其类型、目标属性、数值、持续方式等。
 * 收藏品（故事书、字典）带有 collectibleSetId，集齐对应组合可触发成就。
 */

// ============================================================
// 枚举常量
// ============================================================

/** 效果类型 */
export const EFFECT_TYPES = {
  BUFF: 'buff',
  HEAL: 'heal',
  SPECIAL: 'special'
}

/** 效果目标属性 */
export const TARGET_TYPES = {
  ATTACK: 'attack',
  DEFENSE: 'defense',
  EXP: 'exp',
  CRIT: 'crit',
  TIME: 'time',
  LUCK: 'luck',
  HP: 'hp',
  GOLD: 'gold',
  RETRY: 'retry',
  SKIP_MONSTER: 'skip_monster',
  TAUNT: 'taunt',
  DAMAGE_MULTIPLIER: 'damage_multiplier',
  COLLECTIBLE: 'collectible'
}

// ============================================================
// 效果数据表（按 productId 索引）
// ============================================================

const effectMap = {
  // ---- 文具区 ----
  pencil: {
    type: EFFECT_TYPES.BUFF,
    target: TARGET_TYPES.ATTACK,
    value: 3,
    duration: 'battle',
    description: '战斗中攻击力+3',
    triggerDescription: '',
    collectibleSetId: null
  },
  eraser: {
    type: EFFECT_TYPES.SPECIAL,
    target: TARGET_TYPES.RETRY,
    value: 1,
    duration: 'one_time',
    description: '答错时重新生成一道同知识点/难度的新题目',
    triggerDescription: '每场战斗限1次',
    collectibleSetId: null
  },
  ruler: {
    type: EFFECT_TYPES.BUFF,
    target: TARGET_TYPES.TIME,
    value: 10,
    duration: 'battle',
    description: '答题时间+10秒',
    triggerDescription: '',
    collectibleSetId: null
  },
  notebook: {
    type: EFFECT_TYPES.BUFF,
    target: TARGET_TYPES.EXP,
    value: 1.2,
    duration: 'battle',
    description: '战斗获得经验×1.2',
    triggerDescription: '',
    collectibleSetId: null
  },
  pencil_case: {
    type: EFFECT_TYPES.BUFF,
    target: TARGET_TYPES.DEFENSE,
    value: 3,
    duration: 'battle',
    description: '减少受到伤害3点',
    triggerDescription: '',
    collectibleSetId: null
  },

  // ---- 书籍区 ----
  math_book: {
    type: EFFECT_TYPES.BUFF,
    target: TARGET_TYPES.GOLD,
    value: 1.3,
    duration: 'battle',
    description: '战斗获得金币×1.3',
    triggerDescription: '',
    collectibleSetId: null
  },
  story_book: {
    type: EFFECT_TYPES.SPECIAL,
    target: TARGET_TYPES.COLLECTIBLE,
    value: 1,
    duration: 'one_time',
    description: '收藏品——集齐故事书和字典解锁成就「小小收藏家」',
    triggerDescription: '',
    collectibleSetId: 'book_collection'
  },
  dictionary: {
    type: EFFECT_TYPES.SPECIAL,
    target: TARGET_TYPES.COLLECTIBLE,
    value: 1,
    duration: 'one_time',
    description: '收藏品——集齐故事书和字典解锁成就「小小收藏家」',
    triggerDescription: '',
    collectibleSetId: 'book_collection'
  },

  // ---- 零食区 ----
  candy: {
    type: EFFECT_TYPES.HEAL,
    target: TARGET_TYPES.HP,
    value: 20,
    duration: 'one_time',
    description: '恢复20点生命值',
    triggerDescription: '',
    collectibleSetId: null
  },
  cookie: {
    type: EFFECT_TYPES.HEAL,
    target: TARGET_TYPES.HP,
    value: 35,
    duration: 'one_time',
    description: '恢复35点生命值',
    triggerDescription: '',
    collectibleSetId: null
  },
  juice: {
    type: EFFECT_TYPES.BUFF,
    target: TARGET_TYPES.CRIT,
    value: 0.15,
    duration: 'battle',
    description: '暴击率+15%',
    triggerDescription: '',
    collectibleSetId: null
  },
  ice_cream: {
    type: EFFECT_TYPES.SPECIAL,
    target: TARGET_TYPES.DAMAGE_MULTIPLIER,
    value: 2,
    duration: 'one_time',
    description: '下题答对时造成2倍伤害',
    triggerDescription: '仅生效一次',
    collectibleSetId: null
  },

  // ---- 玩具区 ----
  ball: {
    type: EFFECT_TYPES.SPECIAL,
    target: TARGET_TYPES.SKIP_MONSTER,
    value: 1,
    duration: 'one_time',
    description: '怪物下回合跳过攻击',
    triggerDescription: '仅生效一次',
    collectibleSetId: null
  },
  doll: {
    type: EFFECT_TYPES.SPECIAL,
    target: TARGET_TYPES.TAUNT,
    value: 1,
    duration: 'one_time',
    description: '怪物攻击玩偶不扣血',
    triggerDescription: '仅生效一次',
    collectibleSetId: null
  },
  car: {
    type: EFFECT_TYPES.BUFF,
    target: TARGET_TYPES.TIME,
    value: 5,
    duration: 'battle',
    description: '思考时间+5秒',
    triggerDescription: '',
    collectibleSetId: null
  },
  puzzle: {
    type: EFFECT_TYPES.BUFF,
    target: TARGET_TYPES.LUCK,
    value: 0.1,
    duration: 'battle',
    description: '答对时额外获得金币概率+10%',
    triggerDescription: '',
    collectibleSetId: null
  }
}

// ============================================================
// 收藏品集定义
// ============================================================

const collectibleSets = {
  book_collection: {
    id: 'book_collection',
    name: '书籍收藏',
    description: '集齐故事书和字典',
    requiredProductIds: ['story_book', 'dictionary'],
    achievementId: 'collector_starter',
    icon: '📚'
  }
}

// ============================================================
// 导出数据（只读）
// ============================================================

/** 全部效果数据（浅拷贝副本，防止外部修改） */
export const ALL_EFFECTS = { ...effectMap }

/** 全部收藏品集定义 */
export const COLLECTIBLE_SETS = { ...collectibleSets }

// ============================================================
// 查询函数
// ============================================================

/**
 * 根据商品 ID 获取效果定义
 * @param {string} productId - 商品 ID（对应 shop.js 中的 product.id）
 * @returns {object|null} effect 对象，未找到返回 null
 */
export function getEffectByProductId(productId) {
  const effect = effectMap[productId]
  return effect ? { ...effect } : null
}

/**
 * 判断某商品是否为收藏品
 * @param {string} productId - 商品 ID
 * @returns {boolean}
 */
export function isCollectible(productId) {
  const effect = effectMap[productId]
  return effect ? effect.collectibleSetId !== null : false
}

/**
 * 返回收藏品集信息
 * @returns {object} 收藏品集定义对象（键为 setId）
 */
export function getCollectibleSetInfo() {
  // 返回深拷贝副本
  const result = {}
  for (const [key, set] of Object.entries(collectibleSets)) {
    result[key] = { ...set, requiredProductIds: [...set.requiredProductIds] }
  }
  return result
}

export default {
  EFFECT_TYPES,
  TARGET_TYPES,
  ALL_EFFECTS,
  COLLECTIBLE_SETS,
  getEffectByProductId,
  isCollectible,
  getCollectibleSetInfo
}
