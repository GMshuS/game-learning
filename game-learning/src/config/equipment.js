/**
 * 装备数据配置
 * 文具主题装备：铅笔剑、橡皮盾等
 */
export const equipmentConfig = {
  // 武器类
  weapons: [
    {
      id: 'pencil_sword_1',
      name: '铅笔剑',
      type: 'weapon',
      subtype: 'sword',
      rarity: 'common',
      attack: 5,
      defense: 0,
      luck: 0,
      description: '一支普通的铅笔剑，学生们的入门武器',
      icon: '✏️',
      grade: 1,
      cost: 100
    },
    {
      id: 'pencil_sword_2',
      name: '魔法铅笔剑',
      type: 'weapon',
      subtype: 'sword',
      rarity: 'uncommon',
      attack: 10,
      defense: 0,
      luck: 1,
      description: '带有魔法的铅笔剑，能写出正确答案',
      icon: '🪄',
      grade: 2,
      cost: 250
    },
    {
      id: 'ruler_sword',
      name: '尺子剑',
      type: 'weapon',
      subtype: 'sword',
      rarity: 'rare',
      attack: 15,
      defense: 2,
      luck: 0,
      description: '用透明尺子制成的剑，笔直锋利',
      icon: '📏',
      grade: 3,
      cost: 500
    },
    {
      id: 'compass_spear',
      name: '圆规矛',
      type: 'weapon',
      subtype: 'spear',
      rarity: 'epic',
      attack: 25,
      defense: 5,
      luck: 3,
      description: '精准的圆规制成的长矛',
      icon: '🧭',
      grade: 4,
      cost: 1000
    },
    {
      id: 'formula_staff',
      name: '公式法杖',
      type: 'weapon',
      subtype: 'staff',
      rarity: 'legendary',
      attack: 40,
      defense: 10,
      luck: 5,
      description: '刻满数学公式的传说法杖',
      icon: '🪄',
      grade: 5,
      cost: 2500
    }
  ],

  // 防具类
  armors: [
    {
      id: 'eraser_shield',
      name: '橡皮盾',
      type: 'armor',
      subtype: 'shield',
      rarity: 'common',
      attack: 0,
      defense: 5,
      luck: 0,
      description: '用大橡皮做成的盾牌，可以擦除错误攻击',
      icon: '🛡️',
      grade: 1,
      cost: 100
    },
    {
      id: 'notebook_armor',
      name: '笔记本甲',
      type: 'armor',
      subtype: 'chest',
      rarity: 'uncommon',
      attack: 2,
      defense: 10,
      luck: 0,
      description: '用厚笔记本制成的护甲',
      icon: '📓',
      grade: 2,
      cost: 300
    },
    {
      id: 'textbook_armor',
      name: '教科书重甲',
      type: 'armor',
      subtype: 'chest',
      rarity: 'rare',
      attack: 5,
      defense: 20,
      luck: 2,
      description: '厚重的教科书做成的重甲',
      icon: '📚',
      grade: 3,
      cost: 600
    },
    {
      id: 'calculator_shield',
      name: '计算器盾',
      type: 'armor',
      subtype: 'shield',
      rarity: 'epic',
      attack: 5,
      defense: 30,
      luck: 5,
      description: '内置计算功能的智能盾牌',
      icon: '🔢',
      grade: 4,
      cost: 1200
    },
    {
      id: 'geometry_armor',
      name: '几何圣甲',
      type: 'armor',
      subtype: 'chest',
      rarity: 'legendary',
      attack: 10,
      defense: 50,
      luck: 10,
      description: '蕴含几何之力的神圣铠甲',
      icon: '⭐',
      grade: 5,
      cost: 3000
    }
  ],

  // 饰品类
  accessories: [
    {
      id: 'math_badge',
      name: '数学徽章',
      type: 'accessory',
      subtype: 'badge',
      rarity: 'common',
      attack: 1,
      defense: 1,
      luck: 5,
      description: '数学课代表的光荣徽章',
      icon: '🏅',
      grade: 1,
      cost: 50
    },
    {
      id: 'star_pin',
      name: '智慧之星',
      type: 'accessory',
      subtype: 'pin',
      rarity: 'uncommon',
      attack: 2,
      defense: 2,
      luck: 10,
      description: '闪烁着智慧光芒的星星胸针',
      icon: '⭐',
      grade: 2,
      cost: 200
    },
    {
      id: 'glasses',
      name: '学者眼镜',
      type: 'accessory',
      subtype: 'glasses',
      rarity: 'rare',
      attack: 5,
      defense: 3,
      luck: 15,
      description: '增加智力的学者眼镜',
      icon: '👓',
      grade: 3,
      cost: 400
    },
    {
      id: 'abacus_ring',
      name: '算盘戒指',
      type: 'accessory',
      subtype: 'ring',
      rarity: 'epic',
      attack: 10,
      defense: 5,
      luck: 20,
      description: '镶嵌着微型算盘的魔法戒指',
      icon: '💍',
      grade: 4,
      cost: 800
    },
    {
      id: 'pi_necklace',
      name: 'π之项链',
      type: 'accessory',
      subtype: 'necklace',
      rarity: 'legendary',
      attack: 15,
      defense: 10,
      luck: 30,
      description: '刻有圆周率的神秘项链',
      icon: '📿',
      grade: 5,
      cost: 2000
    }
  ]
};

/**
 * 稀有度配置
 */
export const rarityConfig = {
  common: { 
    name: '普通', 
    color: '#9ca3af', 
    multiplier: 1.0,
    dropRate: 0.5
  },
  uncommon: { 
    name: '优秀', 
    color: '#4ade80', 
    multiplier: 1.5,
    dropRate: 0.3
  },
  rare: { 
    name: '稀有', 
    color: '#60a5fa', 
    multiplier: 2.0,
    dropRate: 0.15
  },
  epic: { 
    name: '史诗', 
    color: '#a78bfa', 
    multiplier: 3.0,
    dropRate: 0.04
  },
  legendary: { 
    name: '传说', 
    color: '#fbbf24', 
    multiplier: 5.0,
    dropRate: 0.01
  }
};

/**
 * 根据 ID 获取装备
 */
export function getEquipmentById(id) {
  const allEquipment = [
    ...equipmentConfig.weapons,
    ...equipmentConfig.armors,
    ...equipmentConfig.accessories
  ];
  return allEquipment.find(e => e.id === id);
}

/**
 * 根据类型获取装备列表
 */
export function getEquipmentByType(type) {
  if (type === 'weapon') return equipmentConfig.weapons;
  if (type === 'armor') return equipmentConfig.armors;
  if (type === 'accessory') return equipmentConfig.accessories;
  return [];
}

/**
 * 根据年级获取可用装备
 */
export function getEquipmentForGrade(grade) {
  const allEquipment = [
    ...equipmentConfig.weapons,
    ...equipmentConfig.armors,
    ...equipmentConfig.accessories
  ];
  return allEquipment.filter(e => e.grade <= grade);
}

/**
 * 根据稀有度获取装备
 */
export function getEquipmentByRarity(rarity) {
  const allEquipment = [
    ...equipmentConfig.weapons,
    ...equipmentConfig.armors,
    ...equipmentConfig.accessories
  ];
  return allEquipment.filter(e => e.rarity === rarity);
}

export default equipmentConfig;
