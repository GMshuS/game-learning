/**
 * 商店商品配置
 */
import { getEffectByProductId } from './shopEffects'

export const shopConfig = {
  // 商品分类
  categories: [
    { id: 'stationery', name: '文具区', icon: '✏️' },
    { id: 'books', name: '书籍区', icon: '📚' },
    { id: 'snacks', name: '零食区', icon: '🍬' },
    { id: 'toys', name: '玩具区', icon: '🧸' }
  ],

  // 商品列表
  products: [
    // 文具区
    {
      id: 'pencil',
      name: '铅笔',
      category: 'stationery',
      icon: '✏️',
      costPrice: 1,
      sellPrice: 2,
      stock: 50,
      popularity: 0.8,
      description: '学生必备的书写工具',
      effect: getEffectByProductId('pencil')
    },
    {
      id: 'eraser',
      name: '橡皮擦',
      category: 'stationery',
      icon: '🧽',
      costPrice: 2,
      sellPrice: 4,
      stock: 30,
      popularity: 0.7,
      description: '修改错误的必备工具',
      effect: getEffectByProductId('eraser')
    },
    {
      id: 'ruler',
      name: '尺子',
      category: 'stationery',
      icon: '📏',
      costPrice: 3,
      sellPrice: 6,
      stock: 25,
      popularity: 0.6,
      description: '画线测量好帮手',
      effect: getEffectByProductId('ruler')
    },
    {
      id: 'notebook',
      name: '笔记本',
      category: 'stationery',
      icon: '📓',
      costPrice: 5,
      sellPrice: 10,
      stock: 20,
      popularity: 0.75,
      description: '记录知识的本子',
      effect: getEffectByProductId('notebook')
    },
    {
      id: 'pencil_case',
      name: '铅笔盒',
      category: 'stationery',
      icon: '📦',
      costPrice: 10,
      sellPrice: 20,
      stock: 15,
      popularity: 0.65,
      description: '收纳文具的盒子',
      effect: getEffectByProductId('pencil_case')
    },

    // 书籍区
    {
      id: 'math_book',
      name: '数学练习册',
      category: 'books',
      icon: '📖',
      costPrice: 8,
      sellPrice: 15,
      stock: 20,
      popularity: 0.7,
      description: '提高数学成绩的好帮手',
      effect: getEffectByProductId('math_book')
    },
    {
      id: 'story_book',
      name: '故事书',
      category: 'books',
      icon: '📕',
      costPrice: 12,
      sellPrice: 22,
      stock: 15,
      popularity: 0.8,
      description: '有趣的童话故事集',
      effect: getEffectByProductId('story_book')
    },
    {
      id: 'dictionary',
      name: '字典',
      category: 'books',
      icon: '📗',
      costPrice: 20,
      sellPrice: 35,
      stock: 10,
      popularity: 0.5,
      description: '查找字词的工具书',
      effect: getEffectByProductId('dictionary')
    },

    // 零食区
    {
      id: 'candy',
      name: '糖果',
      category: 'snacks',
      icon: '🍬',
      costPrice: 2,
      sellPrice: 4,
      stock: 40,
      popularity: 0.9,
      description: '甜甜的美味糖果',
      effect: getEffectByProductId('candy')
    },
    {
      id: 'cookie',
      name: '饼干',
      category: 'snacks',
      icon: '🍪',
      costPrice: 3,
      sellPrice: 6,
      stock: 35,
      popularity: 0.85,
      description: '香脆可口的饼干',
      effect: getEffectByProductId('cookie')
    },
    {
      id: 'juice',
      name: '果汁',
      category: 'snacks',
      icon: '🧃',
      costPrice: 4,
      sellPrice: 8,
      stock: 30,
      popularity: 0.8,
      description: '新鲜美味的果汁',
      effect: getEffectByProductId('juice')
    },
    {
      id: 'ice_cream',
      name: '冰淇淋',
      category: 'snacks',
      icon: '🍦',
      costPrice: 5,
      sellPrice: 10,
      stock: 25,
      popularity: 0.95,
      description: '夏日必备的冰品',
      effect: getEffectByProductId('ice_cream')
    },

    // 玩具区
    {
      id: 'ball',
      name: '皮球',
      category: 'toys',
      icon: '⚽',
      costPrice: 8,
      sellPrice: 15,
      stock: 20,
      popularity: 0.7,
      description: '运动健身的好伙伴',
      effect: getEffectByProductId('ball')
    },
    {
      id: 'doll',
      name: '玩偶',
      category: 'toys',
      icon: '🧸',
      costPrice: 15,
      sellPrice: 28,
      stock: 15,
      popularity: 0.75,
      description: '可爱的毛绒玩具',
      effect: getEffectByProductId('doll')
    },
    {
      id: 'car',
      name: '玩具车',
      category: 'toys',
      icon: '🚗',
      costPrice: 12,
      sellPrice: 22,
      stock: 18,
      popularity: 0.8,
      description: '孩子们喜欢的小车',
      effect: getEffectByProductId('car')
    },
    {
      id: 'puzzle',
      name: '拼图',
      category: 'toys',
      icon: '🧩',
      costPrice: 10,
      sellPrice: 18,
      stock: 15,
      popularity: 0.65,
      description: '锻炼智力的拼图游戏',
      effect: getEffectByProductId('puzzle')
    }
  ]
}

/**
 * 根据分类获取商品
 */
export function getProductsByCategory(categoryId) {
  return shopConfig.products.filter(p => p.category === categoryId)
}

/**
 * 根据 ID 获取商品
 */
export function getProductById(productId) {
  return shopConfig.products.find(p => p.id === productId)
}

/**
 * 获取所有商品
 */
export function getAllProducts() {
  return shopConfig.products
}

export default shopConfig
