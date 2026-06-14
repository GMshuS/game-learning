/**
 * 数学工坊配置
 */

// 材料类型
export const materialTypes = [
  { id: 'wood', name: '木材', icon: '🪵', rarity: 'common' },
  { id: 'stone', name: '石头', icon: '🪨', rarity: 'common' },
  { id: 'iron', name: '铁矿', icon: '⛏️', rarity: 'common' },
  { id: 'crystal', name: '水晶', icon: '💎', rarity: 'rare' },
  { id: 'gold_ore', name: '金矿', icon: '🥇', rarity: 'rare' },
  { id: 'magic_dust', name: '魔法粉', icon: '✨', rarity: 'epic' }
];

// 配方列表
export const recipes = [
  // 低年级（1-2年级）- 形状拼合
  {
    id: 'shape_puzzle',
    name: '形状拼图',
    icon: '🧩',
    gradeRange: [1, 2],
    materials: { wood: 3, stone: 2 },
    basePrice: 30,
    category: 'shape'
  },
  {
    id: 'block_tower',
    name: '积木塔',
    icon: '🏗️',
    gradeRange: [1, 2],
    materials: { wood: 5, stone: 3 },
    basePrice: 50,
    category: 'shape'
  },
  // 中年级（3-4年级）- 周长面积
  {
    id: 'garden_fence',
    name: '花园围栏',
    icon: '🌻',
    gradeRange: [3, 4],
    materials: { wood: 4, iron: 3 },
    basePrice: 80,
    category: 'measurement'
  },
  {
    id: 'tile_floor',
    name: '瓷砖地板',
    icon: '🏠',
    gradeRange: [3, 4],
    materials: { stone: 6, iron: 4 },
    basePrice: 120,
    category: 'measurement'
  },
  // 高年级（5-6年级）- 预算规划
  {
    id: 'budget_bridge',
    name: '预算大桥',
    icon: '🌉',
    gradeRange: [5, 6],
    materials: { iron: 8, crystal: 2, gold_ore: 1 },
    basePrice: 200,
    category: 'budget'
  },
  {
    id: 'magic_tower',
    name: '魔法塔',
    icon: '🏰',
    gradeRange: [5, 6],
    materials: { crystal: 5, gold_ore: 3, magic_dust: 2 },
    basePrice: 350,
    category: 'budget'
  }
];

// 答题获得材料配置
export const questionReward = {
  common: { chance: 0.6, amount: [1, 2] },
  rare: { chance: 0.3, amount: [1, 1] },
  epic: { chance: 0.1, amount: [1, 1] }
};

// 销售配置
export const salesConfig = {
  customerInterval: 45, // 每 45 秒模拟一位顾客
  maxSettlement: 10, // 每次最多结算 10 笔
  priceVariance: 0.2 // 价格波动 ±20%
};

export default {
  materialTypes,
  recipes,
  questionReward,
  salesConfig
};
