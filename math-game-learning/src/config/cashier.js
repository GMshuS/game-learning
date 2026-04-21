/**
 * 收银找零游戏配置
 */
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
  }
}

/**
 * 生成收银题目
 */
export function generateCashierProblem(difficulty = 'easy') {
  const config = cashierConfig.difficulties[difficulty]
  const items = []
  
  // 生成商品
  for (let i = 0; i < config.items; i++) {
    const price = Math.floor(Math.random() * (config.maxTotal / config.items)) + 1
    const quantity = Math.floor(Math.random() * 3) + 1
    items.push({
      name: generateItemName(),
      price,
      quantity
    })
  }
  
  // 计算总价
  const total = items.reduce((sum, item) => sum + item.price * item.quantity, 0)
  
  // 生成顾客支付金额（总是大于总价）
  const minPayment = total
  const paymentOptions = cashierConfig.denominations
    .filter(d => d.value >= minPayment)
    .map(d => d.value)
  
  // 添加一些组合支付
  for (const d of cashierConfig.denominations) {
    const multiple = Math.ceil(minPayment / d.value) * d.value
    if (multiple >= minPayment && !paymentOptions.includes(multiple)) {
      paymentOptions.push(multiple)
    }
  }
  
  const payment = paymentOptions[Math.floor(Math.random() * paymentOptions.length)] || minPayment
  const change = payment - total
  
  return {
    items,
    total,
    payment,
    change,
    difficulty
  }
}

/**
 * 生成商品名称
 */
function generateItemName() {
  const names = [
    '铅笔', '橡皮', '尺子', '笔记本', '铅笔盒',
    '数学书', '故事书', '字典', '糖果', '饼干',
    '果汁', '冰淇淋', '皮球', '玩偶', '玩具车'
  ]
  return names[Math.floor(Math.random() * names.length)]
}

/**
 * 计算最佳找零方案
 */
export function calculateOptimalChange(amount) {
  const result = {}
  let remaining = amount
  
  for (const denom of cashierConfig.denominations) {
    const count = Math.floor(remaining / denom.value)
    if (count > 0) {
      result[denom.value] = count
      remaining -= count * denom.value
    }
  }
  
  return result
}

/**
 * 验证找零是否正确
 */
export function validateChange(selected, correctChange) {
  const selectedTotal = Object.entries(selected).reduce((sum, [value, count]) => {
    return sum + parseInt(value) * count
  }, 0)
  
  return {
    correct: selectedTotal === correctChange,
    selectedTotal,
    difference: selectedTotal - correctChange
  }
}

export default cashierConfig
