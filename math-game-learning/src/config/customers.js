/**
 * 顾客配置
 */
export const customerConfig = {
  // 顾客类型
  types: [
    {
      id: 'student',
      name: '学生',
      icon: '🧑‍🎓',
      patience: 60,    // 耐心值（秒）
      spendRate: 0.8,  // 消费意愿
      frequency: 0.4   // 出现频率
    },
    {
      id: 'teacher',
      name: '老师',
      icon: '🧑‍🏫',
      patience: 90,
      spendRate: 0.6,
      frequency: 0.2
    },
    {
      id: 'parent',
      name: '家长',
      icon: '🧑‍👧',
      patience: 45,
      spendRate: 0.9,
      frequency: 0.3
    },
    {
      id: 'kid',
      name: '小朋友',
      icon: '🧒',
      patience: 30,
      spendRate: 0.7,
      frequency: 0.1
    }
  ],

  // 顾客对话模板
  dialogues: {
    greeting: [
      '你好！',
      '欢迎光临！',
      '我想买点东西。',
      '这里有什么好东西？'
    ],
    buying: [
      '我要买这个。',
      '这个多少钱？',
      '请给我这个。',
      '我要这个，谢谢！'
    ],
    waiting: [
      '怎么这么慢...',
      '我还有事呢...',
      '快点吧...',
      '等了好久了...'
    ],
    leaving: [
      '太慢了，下次不来！',
      '算了，不买了。',
      '服务太差了！',
      '走了走了...'
    ],
    thanking: [
      '谢谢！',
      '下次再来！',
      '再见！',
      '很满意！'
    ]
  }
};

/**
 * 生成顾客
 */
export function generateCustomer() {
  const types = customerConfig.types;
  
  // 根据频率随机选择顾客类型
  const rand = Math.random();
  let cumulative = 0;
  let selectedType = types[0];
  
  for (const type of types) {
    cumulative += type.frequency;
    if (rand <= cumulative) {
      selectedType = type;
      break;
    }
  }
  
  // 生成顾客要购买的商品
  const productCount = Math.floor(Math.random() * 3) + 1;
  const products = [];
  
  for (let i = 0; i < productCount; i++) {
    const randProduct = Math.floor(Math.random() * shopConfig.products.length);
    const product = shopConfig.products[randProduct];
    const quantity = Math.floor(Math.random() * 2) + 1;
    products.push({ product, quantity });
  }
  
  // 计算总价
  const total = products.reduce((sum, item) => {
    return sum + item.product.sellPrice * item.quantity;
  }, 0);
  
  return {
    id: 'customer_' + Date.now(),
    type: selectedType,
    name: selectedType.name,
    icon: selectedType.icon,
    patience: selectedType.patience,
    currentPatience: selectedType.patience,
    products,
    total,
    status: 'waiting', // waiting, being_served, leaving
    dialogue: getRandomDialogue('greeting')
  };
}

/**
 * 获取随机对话
 */
export function getRandomDialogue(type) {
  const dialogues = customerConfig.dialogues[type];
  if (!dialogues || dialogues.length === 0) return '...';
  return dialogues[Math.floor(Math.random() * dialogues.length)];
}

// 导入 shopConfig
import shopConfig from './shop';

export default customerConfig;
