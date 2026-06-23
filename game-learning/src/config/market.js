/**
 * 超市大挑战配置
 * 4种模式：新手采购、购物达人、收银小能手、极速收银挑战
 */

// 商品池定义
const productPool = [
  // 文具类
  { id: 'pencil', name: '铅笔', icon: '✏️', price: 2 },
  { id: 'eraser', name: '橡皮', icon: '🧽', price: 3 },
  { id: 'ruler', name: '尺子', icon: '📏', price: 4 },
  { id: 'notebook', name: '笔记本', icon: '📓', price: 8 },
  { id: 'pen', name: '钢笔', icon: '🖊️', price: 10 },
  // 食品类
  { id: 'candy', name: '糖果', icon: '🍬', price: 2 },
  { id: 'cookie', name: '饼干', icon: '🍪', price: 5 },
  { id: 'juice', name: '果汁', icon: '🧃', price: 6 },
  { id: 'iceCream', name: '冰淇淋', icon: '🍦', price: 8 },
  { id: 'chocolate', name: '巧克力', icon: '🍫', price: 12 },
  // 玩具类
  { id: 'ball', name: '皮球', icon: '⚽', price: 15 },
  { id: 'doll', name: '玩偶', icon: '🧸', price: 25 },
  { id: 'toyCar', name: '玩具车', icon: '🚗', price: 20 },
  { id: 'puzzle', name: '拼图', icon: '🧩', price: 18 },
  { id: 'blocks', name: '积木', icon: '🧱', price: 30 }
];

// 货币面额
const denominations = [
  { value: 100, name: '100 元', color: '#ef4444', icon: '¥100' },
  { value: 50, name: '50 元', color: '#f97316', icon: '¥50' },
  { value: 20, name: '20 元', color: '#84cc16', icon: '¥20' },
  { value: 10, name: '10 元', color: '#06b6d4', icon: '¥10' },
  { value: 5, name: '5 元', color: '#8b5cf6', icon: '¥5' },
  { value: 1, name: '1 元', color: '#64748b', icon: '¥1' }
];

/**
 * 根据年级获取适用的商品池
 * @param {number} grade - 年级（1-6）
 * @returns {Array} 商品列表
 */
function getProductsForGrade(grade) {
  if (grade <= 2) {
    // 低年级：简单商品，价格不超过10元
    return productPool.filter(p => p.price <= 8);
  }
  if (grade <= 4) {
    // 中年级：大部分商品
    return productPool.filter(p => p.price <= 20);
  }
  // 高年级：全部商品
  return [...productPool];
}

/**
 * 根据年级获取适用的货币面额
 * @param {number} grade - 年级（1-6）
 * @returns {Array} 面额列表
 */
function getDenominationsForGrade(grade) {
  if (grade <= 1) {
    return denominations.filter(d => d.value <= 10);
  }
  if (grade <= 2) {
    return denominations.filter(d => d.value <= 20);
  }
  if (grade <= 4) {
    return denominations.filter(d => d.value <= 50);
  }
  return [...denominations];
}

// 各模式配置
const modeConfig = {
  // 新手采购（1-2年级）
  beginner: {
    id: 'beginner',
    name: '新手采购',
    icon: '🛒',
    description: '计算单价×数量，掌握基础乘法',
    gradeRange: [1, 2],
    difficulty: 'easy',
    timeLimit: 0, // 不限时
    itemCount: 1,
    quantityRange: [1, 5],
    priceRange: [1, 10],
    questionType: 'single', // 单商品计算
    inputType: 'input',
    allowChange: false,
    stars: {
      3: { condition: '一次答对' },
      2: { condition: '两次内答对' },
      1: { condition: '完成题目' }
    },
    color: '#4ade80',
    gradient: 'linear-gradient(135deg, #4ade80 0%, #22c55e 100%)'
  },

  // 购物达人（3-4年级）
  shopper: {
    id: 'shopper',
    name: '购物达人',
    icon: '🛍️',
    description: '多商品求和、混合运算',
    gradeRange: [3, 4],
    difficulty: 'medium',
    timeLimit: 0,
    itemCount: 3,
    quantityRange: [1, 5],
    priceRange: [1, 20],
    questionType: 'multiple', // 多商品求和
    inputType: 'input',
    allowChange: false,
    stars: {
      3: { condition: '全部答对，无提示' },
      2: { condition: '允许一次错误' },
      1: { condition: '完成题目' }
    },
    color: '#fbbf24',
    gradient: 'linear-gradient(135deg, #fbbf24 0%, #f59e0b 100%)'
  },

  // 收银小能手（5-6年级）
  cashier: {
    id: 'cashier',
    name: '收银小能手',
    icon: '🧾',
    description: '计算总价+最优找零方案',
    gradeRange: [5, 6],
    difficulty: 'hard',
    timeLimit: 0,
    itemCount: 3,
    quantityRange: [2, 5],
    priceRange: [2, 30],
    questionType: 'change', // 总价+找零
    inputType: 'coin',
    allowChange: true,
    stars: {
      3: { condition: '找零最优' },
      2: { condition: '找零正确' },
      1: { condition: '完成收银' }
    },
    color: '#a78bfa',
    gradient: 'linear-gradient(135deg, #a78bfa 0%, #7c3aed 100%)'
  },

  // 极速收银挑战（挑战模式）
  speed: {
    id: 'speed',
    name: '极速收银挑战',
    icon: '⚡',
    description: '限时60秒，尽可能多地完成收银',
    gradeRange: [5, 6],
    difficulty: 'hard',
    timeLimit: 60,
    itemCount: 2,
    quantityRange: [1, 4],
    priceRange: [2, 50],
    questionType: 'speed', // 限时速算+找零
    inputType: 'coin',
    allowChange: true,
    stars: {
      3: { condition: '答对10题以上' },
      2: { condition: '答对6题以上' },
      1: { condition: '完成挑战' }
    },
    color: '#f43f5e',
    gradient: 'linear-gradient(135deg, #f43f5e 0%, #e11d48 100%)'
  }
};

/**
 * 根据年级和模式获取配置
 * @param {string} modeId - 模式ID
 * @param {number} grade - 年级
 * @returns {object} 合并后的配置
 */
function getConfig(modeId, grade) {
  const mode = modeConfig[modeId];
  if (!mode) return null;

  return {
    ...mode,
    products: getProductsForGrade(grade),
    availableDenominations: getDenominationsForGrade(grade)
  };
}

/**
 * 获取所有模式列表
 * @returns {Array} 模式配置数组
 */
function getAllModes() {
  return Object.values(modeConfig);
}

export {
  productPool,
  denominations,
  modeConfig,
  getProductsForGrade,
  getDenominationsForGrade,
  getConfig,
  getAllModes
};

export default modeConfig;
