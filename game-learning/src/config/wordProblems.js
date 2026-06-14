/**
 * 应用题可视化配置
 */
export const wordProblemConfig = {
  // 可视化物品类型
  items: {
    apple: { name: '苹果', icon: '🍎', color: '#ef4444' },
    orange: { name: '橙子', icon: '🍊', color: '#f97316' },
    banana: { name: '香蕉', icon: '🍌', color: '#fbbf24' },
    grape: { name: '葡萄', icon: '🍇', color: '#a855f7' },
    candy: { name: '糖果', icon: '🍬', color: '#ec4899' },
    cookie: { name: '饼干', icon: '🍪', color: '#92400e' },
    cake: { name: '蛋糕', icon: '🎂', color: '#f472b6' },
    toy: { name: '玩具', icon: '🧸', color: '#6366f1' },
    book: { name: '书', icon: '📕', color: '#dc2626' },
    pencil: { name: '铅笔', icon: '✏️', color: '#eab308' }
  },

  // 题目模板
  templates: {
    add: [
      {
        pattern: '{a}个{item}和{b}个{item}一共有多少个？',
        visual: 'group'
      },
      {
        pattern: '小明有{a}个{item}，妈妈又给了{b}个，现在有几个？',
        visual: 'add'
      },
      {
        pattern: '树上有{a}只鸟，又飞来{b}只，现在有几只？',
        visual: 'add'
      }
    ],
    subtract: [
      {
        pattern: '有{a}个{item}，吃了{b}个，还剩几个？',
        visual: 'remove'
      },
      {
        pattern: '小明有{a}个{item}，送给小红{b}个，还剩几个？',
        visual: 'remove'
      },
      {
        pattern: '有{a}只小鸟，飞走了{b}只，还剩几只？',
        visual: 'remove'
      }
    ],
    multiply: [
      {
        pattern: '每盒有{a}个{item}，{b}盒一共有几个？',
        visual: 'groups'
      },
      {
        pattern: '每个小朋友分{a}个{item}，{b}个小朋友需要几个？',
        visual: 'groups'
      }
    ],
    divide: [
      {
        pattern: '有{a}个{item}，平均分给{b}个小朋友，每人分几个？',
        visual: 'distribute'
      },
      {
        pattern: '有{a}个{item}，每盒装{b}个，可以装几盒？',
        visual: 'grouping'
      }
    ]
  },

  // 分步解题提示
  stepHints: {
    add: [
      '数一数第一组有几个',
      '数一数第二组有几个',
      '把两组合起来数一数'
    ],
    subtract: [
      '数一数原来有几个',
      '拿走/去掉几个',
      '数一数还剩几个'
    ],
    multiply: [
      '数一数每组有几个',
      '数一数有几组',
      '用乘法计算总数'
    ],
    divide: [
      '数一数总共有几个',
      '数一数要分给几个小朋友',
      '平均分配，每人得几个'
    ]
  }
};

/**
 * 生成可视化应用题
 */
export function generateVisualWordProblem(grade = 1) {
  const operation = grade <= 2 
    ? (Math.random() > 0.5 ? 'add' : 'subtract')
    : ['add', 'subtract', 'multiply'][Math.floor(Math.random() * 3)];
  
  const templates = wordProblemConfig.templates[operation];
  const template = templates[Math.floor(Math.random() * templates.length)];
  
  // 选择物品
  const itemKeys = Object.keys(wordProblemConfig.items);
  const itemKey = itemKeys[Math.floor(Math.random() * itemKeys.length)];
  const item = wordProblemConfig.items[itemKey];
  
  // 生成数字（根据年级调整范围）
  let a, b;
  if (grade === 1) {
    a = Math.floor(Math.random() * 10) + 1;
    b = operation === 'subtract' 
      ? Math.floor(Math.random() * a) + 1
      : Math.floor(Math.random() * 10) + 1;
  } else if (grade === 2) {
    a = Math.floor(Math.random() * 20) + 1;
    b = operation === 'subtract'
      ? Math.floor(Math.random() * a) + 1
      : Math.floor(Math.random() * 20) + 1;
  } else {
    if (operation === 'multiply') {
      a = Math.floor(Math.random() * 5) + 2;
      b = Math.floor(Math.random() * 5) + 2;
    } else {
      a = Math.floor(Math.random() * 20) + 5;
      b = operation === 'subtract'
        ? Math.floor(Math.random() * a) + 1
        : Math.floor(Math.random() * 20) + 1;
    }
  }
  
  // 生成题目
  let question = template.pattern
    .replace(/{a}/g, a)
    .replace(/{b}/g, b)
    .replace(/{item}/g, item.name);
  
  // 计算答案
  let answer;
  if (operation === 'add') answer = a + b;
  else if (operation === 'subtract') answer = a - b;
  else if (operation === 'multiply') answer = a * b;
  else answer = a / b;
  
  return {
    question,
    answer,
    operation,
    visualType: template.visual,
    item,
    numbers: { a, b },
    grade,
    steps: generateSteps(operation, a, b, item)
  };
}

/**
 * 生成解题步骤
 */
function generateSteps(operation, a, b, item) {
  const hints = wordProblemConfig.stepHints[operation];
  
  return hints.map((hint, index) => ({
    step: index + 1,
    hint,
    visual: generateStepVisual(operation, a, b, item, index)
  }));
}

/**
 * 生成步骤可视化数据
 */
function generateStepVisual(operation, a, b, item, stepIndex) {
  if (operation === 'add') {
    if (stepIndex === 0) {
      return { count: a, highlighted: 'first', total: a };
    } else if (stepIndex === 1) {
      return { count: b, highlighted: 'second', total: b };
    } else {
      return { count: a + b, highlighted: 'all', total: a + b };
    }
  }
  
  if (operation === 'subtract') {
    if (stepIndex === 0) {
      return { count: a, highlighted: 'all', total: a };
    } else if (stepIndex === 1) {
      return { count: b, highlighted: 'removed', total: b };
    } else {
      return { count: a - b, highlighted: 'remaining', total: a - b };
    }
  }
  
  if (operation === 'multiply') {
    return {
      groups: b,
      perGroup: a,
      total: a * b,
      highlighted: stepIndex === 2 ? 'total' : 'groups'
    };
  }
  
  return { count: a, highlighted: 'all', total: a };
}

export default {
  wordProblemConfig,
  generateVisualWordProblem
};
