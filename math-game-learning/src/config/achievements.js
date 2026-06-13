/**
 * 成就系统配置
 */
export const achievementConfig = {
  // 成就分类
  categories: [
    { id: 'learning', name: '学习成就', icon: '📚' },
    { id: 'adventure', name: '冒险成就', icon: '🗡️' },
    { id: 'shop', name: '经营成就', icon: '🏪' },
    { id: 'collection', name: '收集成就', icon: '🏆' },
    { id: 'special', name: '特殊成就', icon: '⭐' }
  ],

  // 成就列表
  achievements: [
    // 学习成就
    {
      id: 'first_answer',
      name: '初次尝试',
      description: '完成第一道题目',
      category: 'learning',
      icon: '📝',
      requirement: { type: 'questions_answered', count: 1 },
      rewards: { coins: 10, exp: 20 },
      rarity: 'common'
    },
    {
      id: 'answer_10',
      name: '勤奋学习',
      description: '累计完成 10 道题目',
      category: 'learning',
      icon: '✏️',
      requirement: { type: 'questions_answered', count: 10 },
      rewards: { coins: 50, exp: 100 },
      rarity: 'common'
    },
    {
      id: 'answer_100',
      name: '学霸之路',
      description: '累计完成 100 道题目',
      category: 'learning',
      icon: '🎓',
      requirement: { type: 'questions_answered', count: 100 },
      rewards: { coins: 200, exp: 500 },
      rarity: 'rare'
    },
    {
      id: 'answer_1000',
      name: '数学大师',
      description: '累计完成 1000 道题目',
      category: 'learning',
      icon: '👑',
      requirement: { type: 'questions_answered', count: 1000 },
      rewards: { coins: 1000, exp: 2000 },
      rarity: 'legendary'
    },
    {
      id: 'perfect_10',
      name: '十连全对',
      description: '连续答对 10 道题目',
      category: 'learning',
      icon: '💯',
      requirement: { type: 'streak', count: 10 },
      rewards: { coins: 100, exp: 200 },
      rarity: 'rare'
    },
    {
      id: 'perfect_50',
      name: '无敌连胜',
      description: '连续答对 50 道题目',
      category: 'learning',
      icon: '🔥',
      requirement: { type: 'streak', count: 50 },
      rewards: { coins: 500, exp: 1000 },
      rarity: 'legendary'
    },

    // 冒险成就
    {
      id: 'first_battle',
      name: '初次战斗',
      description: '第一次参加冒险战斗',
      category: 'adventure',
      icon: '⚔️',
      requirement: { type: 'battles', count: 1 },
      rewards: { coins: 20, exp: 50 },
      rarity: 'common'
    },
    {
      id: 'battle_10',
      name: '冒险新手',
      description: '完成 10 场战斗',
      category: 'adventure',
      icon: '🛡️',
      requirement: { type: 'battles', count: 10 },
      rewards: { coins: 100, exp: 200 },
      rarity: 'common'
    },
    {
      id: 'battle_100',
      name: '冒险勇士',
      description: '完成 100 场战斗',
      category: 'adventure',
      icon: '🏅',
      requirement: { type: 'battles', count: 100 },
      rewards: { coins: 500, exp: 1000 },
      rarity: 'rare'
    },
    {
      id: 'level_1',
      name: '初出茅庐',
      description: '冒险等级达到 1 级',
      category: 'adventure',
      icon: '🌟',
      requirement: { type: 'adventure_level', count: 1 },
      rewards: { coins: 50, exp: 100 },
      rarity: 'common'
    },
    {
      id: 'level_10',
      name: '冒险达人',
      description: '冒险等级达到 10 级',
      category: 'adventure',
      icon: '⭐',
      requirement: { type: 'adventure_level', count: 10 },
      rewards: { coins: 300, exp: 600 },
      rarity: 'rare'
    },
    {
      id: 'level_50',
      name: '传说冒险家',
      description: '冒险等级达到 50 级',
      category: 'adventure',
      icon: '👑',
      requirement: { type: 'adventure_level', count: 50 },
      rewards: { coins: 2000, exp: 5000 },
      rarity: 'legendary'
    },

    // 经营成就
    {
      id: 'first_sale',
      name: '第一笔生意',
      description: '完成第一次销售',
      category: 'shop',
      icon: '💰',
      requirement: { type: 'sales', count: 1 },
      rewards: { coins: 20, exp: 50 },
      rarity: 'common'
    },
    {
      id: 'sales_10',
      name: '小店主',
      description: '完成 10 次销售',
      category: 'shop',
      icon: '🏪',
      requirement: { type: 'sales', count: 10 },
      rewards: { coins: 100, exp: 200 },
      rarity: 'common'
    },
    {
      id: 'sales_100',
      name: '大老板',
      description: '完成 100 次销售',
      category: 'shop',
      icon: '💼',
      requirement: { type: 'sales', count: 100 },
      rewards: { coins: 500, exp: 1000 },
      rarity: 'rare'
    },
    {
      id: 'rich_1000',
      name: '小富翁',
      description: '拥有 1000 金币',
      category: 'shop',
      icon: '💎',
      requirement: { type: 'coins', count: 1000 },
      rewards: { coins: 200, exp: 400 },
      rarity: 'rare'
    },
    {
      id: 'rich_10000',
      name: '大富豪',
      description: '拥有 10000 金币',
      category: 'shop',
      icon: '🏦',
      requirement: { type: 'coins', count: 10000 },
      rewards: { coins: 1000, exp: 2000 },
      rarity: 'legendary'
    },

    // 收集成就
    {
      id: 'equipment_1',
      name: '装备收集',
      description: '获得第一件装备',
      category: 'collection',
      icon: '🗡️',
      requirement: { type: 'equipment', count: 1 },
      rewards: { coins: 30, exp: 60 },
      rarity: 'common'
    },
    {
      id: 'equipment_10',
      name: '装备大师',
      description: '收集 10 件装备',
      category: 'collection',
      icon: '🛡️',
      requirement: { type: 'equipment', count: 10 },
      rewards: { coins: 200, exp: 400 },
      rarity: 'rare'
    },
    {
      id: 'all_areas',
      name: '探索者',
      description: '解锁所有区域',
      category: 'collection',
      icon: '🗺️',
      requirement: { type: 'areas_unlocked', count: 5 },
      rewards: { coins: 500, exp: 1000 },
      rarity: 'epic'
    },
    {
      id: 'collector_starter',
      name: '小小收藏家',
      description: '集齐故事书和字典',
      category: 'collection',
      icon: '📚',
      requirement: { type: 'collectibles', count: 2 },
      rewards: { coins: 200, exp: 400 },
      rarity: 'rare'
    },

    // 特殊成就
    {
      id: 'first_login',
      name: '初次见面',
      description: '第一次登录游戏',
      category: 'special',
      icon: '🎉',
      requirement: { type: 'login', count: 1 },
      rewards: { coins: 100, exp: 200 },
      rarity: 'common'
    },
    {
      id: 'login_7',
      name: '忠实玩家',
      description: '连续登录 7 天',
      category: 'special',
      icon: '📅',
      requirement: { type: 'login_streak', count: 7 },
      rewards: { coins: 300, exp: 600 },
      rarity: 'rare'
    },
    {
      id: 'login_30',
      name: '铁杆粉丝',
      description: '连续登录 30 天',
      category: 'special',
      icon: '🏆',
      requirement: { type: 'login_streak', count: 30 },
      rewards: { coins: 1000, exp: 2000 },
      rarity: 'legendary'
    }
  ],

  // 稀有度配置
  rarities: {
    common: { name: '普通', color: '#9ca3af', multiplier: 1 },
    uncommon: { name: '优秀', color: '#4ade80', multiplier: 1.5 },
    rare: { name: '稀有', color: '#60a5fa', multiplier: 2 },
    epic: { name: '史诗', color: '#a78bfa', multiplier: 3 },
    legendary: { name: '传说', color: '#fbbf24', multiplier: 5 }
  }
}

/**
 * 根据 ID 获取成就
 */
export function getAchievementById(id) {
  return achievementConfig.achievements.find(a => a.id === id)
}

/**
 * 根据分类获取成就
 */
export function getAchievementsByCategory(category) {
  return achievementConfig.achievements.filter(a => a.category === category)
}

/**
 * 获取所有成就
 */
export function getAllAchievements() {
  return achievementConfig.achievements
}

/**
 * 获取稀有度配置
 */
export function getRarityConfig(rarity) {
  return achievementConfig.rarities[rarity] || achievementConfig.rarities.common
}

export default achievementConfig
