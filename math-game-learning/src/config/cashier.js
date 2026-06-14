/**
 * 收银找零游戏配置
 */

// 收银游戏奖励计算公式常量
export const CASHIER_REWARD = {
  COINS_PER_STAR: 10,
  EXP_PER_STAR: 5,
  TIME_BONUS_BASE: 30
};
export const cashierConfig = {
  // 货币面额
  denominations: [
    { value: 100, name: '100 元', color: '#ef4444', icon: '¥100' },
    { value: 50, name: '50 元', color: '#f97316', icon: '¥50' },
    { value: 20, name: '20 元', color: '#84cc16', icon: '¥20' },
    { value: 10, name: '10 元', color: '#06b6d4', icon: '¥10' },
    { value: 5, name: '5 元', color: '#8b5cf6', icon: '¥5' },
    { value: 1, name: '1 元', color: '#64748b', icon: '¥1' }
  ],

  // 难度配置
  difficulties: {
    easy: {
      name: '简单',
      maxTotal: 50,
      timeLimit: 120,
      items: 1
    },
    medium: {
      name: '中等',
      maxTotal: 100,
      timeLimit: 90,
      items: 2
    },
    hard: {
      name: '困难',
      maxTotal: 200,
      timeLimit: 60,
      items: 3
    }
  },

  // 年级自适应配置
  gradeAdaptation: {
    1: { maxTotal: 20, maxDenomination: 10, items: 1 },
    2: { maxTotal: 50, maxDenomination: 20, items: 1 },
    3: { maxTotal: 100, maxDenomination: 50, items: 2 },
    4: { maxTotal: 100, maxDenomination: 100, items: 2 },
    5: { maxTotal: 200, maxDenomination: 100, items: 3 },
    6: { maxTotal: 500, maxDenomination: 100, items: 3 }
  }
};

/**
 * 生成收银题目
 * @param {string} difficulty - 难度标识 ('easy' | 'medium' | 'hard')
 * @param {number} grade - 年级 (1-6)，可选，用于年级自适应
 */
export function generateCashierProblem(difficulty = 'easy', grade) {
  const baseConfig = cashierConfig.difficulties[difficulty];
  const adaptation = grade ? cashierConfig.gradeAdaptation[grade] : null;
  
  // 合并年级自适应配置与基础难度配置
  const config = {
    items: adaptation ? adaptation.items : baseConfig.items,
    maxTotal: adaptation ? adaptation.maxTotal : baseConfig.maxTotal,
    maxDenomination: adaptation ? adaptation.maxDenomination : null,
    timeLimit: baseConfig.timeLimit
  };
  
  const items = [];
  
  // 生成商品
  for (let i = 0; i < config.items; i++) {
    const maxPrice = Math.floor(config.maxTotal / config.items);
    const price = Math.floor(Math.random() * maxPrice) + 1;
    const quantity = Math.floor(Math.random() * 3) + 1;
    items.push({
      name: generateItemName(),
      price,
      quantity
    });
  }
  
  // 计算总价
  const total = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
  
  // 根据年级自适应过滤可用面额
  let availableDenominations = cashierConfig.denominations;
  if (config.maxDenomination) {
    availableDenominations = cashierConfig.denominations.filter(d => d.value <= config.maxDenomination);
  }
  
  // 生成顾客付款的钞票组合（真实面额）
  const paymentInfo = generatePaymentBills(total, grade || 1);
  
  const change = paymentInfo.payment - total;
  
  return {
    items,
    total,
    payment: paymentInfo.payment,
    paymentBills: paymentInfo.bills,
    change,
    availableDenominations,
    difficulty,
    grade
  };
}

/**
 * 生成顾客付款的钞票组合
 * 用真实面额生成1-3张钞票，模拟真实付钱场景
 */
export function generatePaymentBills(total, grade) {
  const allDenoms = [100, 50, 20, 10, 5, 1];

  let maxBills = 3;
  if (grade <= 2) maxBills = 2;
  if (grade === 1) maxBills = 1;

  const counts = {};
  let sum = 0;
  let billCount = 0;

  while (sum < total && billCount < maxBills) {
    const remaining = maxBills - billCount;
    const needed = total - sum;
    const suitable = allDenoms.filter(v => v >= Math.ceil(needed / remaining));
    const pool = suitable.length > 0 ? suitable : allDenoms;
    const bill = pool[Math.floor(Math.random() * pool.length)];
    counts[bill] = (counts[bill] || 0) + 1;
    sum += bill;
    billCount++;
    if (sum >= total) break;
  }

  while (sum < total) {
    counts[1] = (counts[1] || 0) + 1;
    sum += 1;
  }

  return { bills: counts, payment: sum };
}

/**
 * 生成商品名称
 */
function generateItemName() {
  const names = [
    '铅笔', '橡皮', '尺子', '笔记本', '铅笔盒',
    '数学书', '故事书', '字典', '糖果', '饼干',
    '果汁', '冰淇淋', '皮球', '玩偶', '玩具车'
  ];
  return names[Math.floor(Math.random() * names.length)];
}

/**
 * 计算最佳找零方案
 */
export function calculateOptimalChange(amount) {
  const result = {};
  let remaining = amount;
  
  for (const denom of cashierConfig.denominations) {
    const count = Math.floor(remaining / denom.value);
    if (count > 0) {
      result[denom.value] = count;
      remaining -= count * denom.value;
    }
  }
  
  return result;
}

/**
 * 验证找零是否正确
 */
export function validateChange(selected, correctChange) {
  const selectedTotal = Object.entries(selected).reduce((sum, [value, count]) => {
    return sum + parseInt(value) * count;
  }, 0);
  
  return {
    correct: selectedTotal === correctChange,
    selectedTotal,
    difference: selectedTotal - correctChange
  };
}

export default cashierConfig;
