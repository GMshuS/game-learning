/**
 * 各年级主题/场景差异化配置
 * 控制 UI 视觉风格、叙事主题、交互形态、题型呈现方式
 *
 * 每个年级拥有：
 * - 主题名称与吉祥物 → 用于 UI 头部展示
 * - 题型呈现风格 → 决定题目以什么形式展示给玩家
 * - 速算/工坊/商店子主题 → 各模式的主题包装
 * - 能力维度权重 → 该年级重点培养的数学能力
 */

export const gradeThemes = {
  1: {
    name: '森林乐园',
    icon: '🌳',
    mascot: '🦊',
    primaryColor: '#4ade80',
    bgGradient: 'linear-gradient(135deg, #166534, #4ade80)',

    /* 题目呈现形态 */
    questionStyle: 'visual_count',       // 可视化实物计数
    wordProblemStyle: 'picture_story',   // 图文故事
    supportsDragDrop: true,              // 支持拖拽交互

    /* 速算主题 */
    speedChallenge: {
      name: '森林数水果',
      description: '帮小动物数水果，快速说出答案！',
      icon: '🍎'
    },

    /* 工坊主题 */
    workshop: {
      name: '小厨师工坊',
      description: '收集食材，制作美味点心',
      icon: '🍳',
      itemTheme: 'food'                 // 材料主题：食材类
    },

    /* 商店主题 */
    shop: {
      name: '森林小卖部',
      description: '帮小动物计算购物金额',
      itemTypes: ['零食', '玩具']
    },

    /* 卡牌主题 */
    card: {
      name: '小动物卡牌',
      description: '可爱的动物朋友陪你战斗'
    },

    /* 该年级重点培养的能力及权重 */
    abilityFocus: [
      { type: 'numberSense',  label: '数感',     weight: 0.35 },
      { type: 'observation',  label: '观察力',   weight: 0.25 },
      { type: 'calculation',  label: '计算',     weight: 0.25 },
      { type: 'focus',        label: '专注力',   weight: 0.15 }
    ]
  },

  2: {
    name: '海洋世界',
    icon: '🌊',
    mascot: '🐬',
    primaryColor: '#60a5fa',
    bgGradient: 'linear-gradient(135deg, #1e3a5f, #60a5fa)',

    questionStyle: 'semi_visual',        // 半可视化（少量图文辅助）
    wordProblemStyle: 'picture_story',
    supportsDragDrop: true,

    speedChallenge: {
      name: '海底速算',
      description: '帮助小鱼穿越海底迷宫，快速计算！',
      icon: '🐟'
    },
    workshop: {
      name: '海洋工坊',
      description: '收集贝壳珍珠，制作精美手工艺品',
      icon: '🐚',
      itemTheme: 'craft'
    },
    shop: {
      name: '海洋商店',
      description: '帮海洋居民结账找零',
      itemTypes: ['文具', '玩具']
    },
    card: {
      name: '海洋精灵卡牌',
      description: '召唤海洋精灵为你而战！'
    },

    abilityFocus: [
      { type: 'calculation',  label: '计算',     weight: 0.30 },
      { type: 'numberSense',  label: '数感',     weight: 0.25 },
      { type: 'memory',       label: '记忆力',   weight: 0.25 },
      { type: 'reaction',     label: '反应速度', weight: 0.20 }
    ]
  },

  3: {
    name: '城堡王国',
    icon: '🏰',
    mascot: '🦁',
    primaryColor: '#fbbf24',
    bgGradient: 'linear-gradient(135deg, #78350f, #fbbf24)',

    questionStyle: 'text_problem',       // 纯文字题目
    wordProblemStyle: 'text_story',      // 纯文字故事
    supportsDragDrop: false,

    speedChallenge: {
      name: '城堡大闯关',
      description: '快速计算城堡门上的神秘算式！',
      icon: '⚔️'
    },
    workshop: {
      name: '城堡铁匠铺',
      description: '收集矿石，锻造武器和装备',
      icon: '⚒️',
      itemTheme: 'blacksmith'
    },
    shop: {
      name: '城堡集市',
      description: '为骑士和商人计算交易金额',
      itemTypes: ['装备', '药剂']
    },
    card: {
      name: '骑士卡牌',
      description: '率领骑士军团征战沙场'
    },

    abilityFocus: [
      { type: 'calculation',  label: '计算',     weight: 0.30 },
      { type: 'logic',        label: '逻辑推理', weight: 0.25 },
      { type: 'reading',      label: '阅读理解', weight: 0.25 },
      { type: 'estimation',   label: '估算能力', weight: 0.20 }
    ]
  },

  4: {
    name: '星际探险',
    icon: '🚀',
    mascot: '🤖',
    primaryColor: '#a78bfa',
    bgGradient: 'linear-gradient(135deg, #2e1065, #a78bfa)',

    questionStyle: 'data_chart',         // 数据图表
    wordProblemStyle: 'data_story',      // 数据故事（给出表格/图表）
    supportsDragDrop: false,

    speedChallenge: {
      name: '星际竞速',
      description: '在浩瀚宇宙中快速计算航线坐标！',
      icon: '🛸'
    },
    workshop: {
      name: '星际车间',
      description: '收集太空材料，建造飞船零件',
      icon: '🔧',
      itemTheme: 'tech'
    },
    shop: {
      name: '星际商店',
      description: '为星际旅行者计算补给品金额',
      itemTypes: ['零件', '补给']
    },
    card: {
      name: '星际卡牌',
      description: '用科技力量击败宇宙敌人'
    },

    abilityFocus: [
      { type: 'calculation',     label: '计算',        weight: 0.25 },
      { type: 'logic',           label: '逻辑推理',    weight: 0.20 },
      { type: 'spatial',         label: '空间想象',    weight: 0.25 },
      { type: 'systemThinking',  label: '系统思维',    weight: 0.15 },
      { type: 'observation',     label: '观察力',      weight: 0.15 }
    ]
  },

  5: {
    name: '魔法学院',
    icon: '🔮',
    mascot: '🧙',
    primaryColor: '#f472b6',
    bgGradient: 'linear-gradient(135deg, #831843, #f472b6)',

    questionStyle: 'abstract_symbol',    // 抽象符号（分数、小数）
    wordProblemStyle: 'multi_step',      // 多步骤推理
    supportsDragDrop: false,

    speedChallenge: {
      name: '魔法速算',
      description: '用魔法快速化解复杂的算式难题！',
      icon: '✨'
    },
    workshop: {
      name: '炼金工坊',
      description: '收集魔法材料，炼制神奇药水',
      icon: '⚗️',
      itemTheme: 'alchemy'
    },
    shop: {
      name: '魔法商店',
      description: '为魔法师计算药水和法杖的价格',
      itemTypes: ['药水', '法杖', '魔法书']
    },
    card: {
      name: '魔法卡牌',
      description: '施展强大魔法，击败黑暗势力'
    },

    abilityFocus: [
      { type: 'abstraction',      label: '抽象思维',    weight: 0.25 },
      { type: 'dataAnalysis',     label: '数据分析',    weight: 0.25 },
      { type: 'logic',            label: '逻辑推理',    weight: 0.25 },
      { type: 'creativity',       label: '创造性解题', weight: 0.25 }
    ]
  },

  6: {
    name: '未来科技',
    icon: '💻',
    mascot: '🚀',
    primaryColor: '#2dd4bf',
    bgGradient: 'linear-gradient(135deg, #134e4a, #2dd4bf)',

    questionStyle: 'comprehensive',       // 综合应用
    wordProblemStyle: 'optimization',     // 优化策略类
    supportsDragDrop: false,

    speedChallenge: {
      name: '未来竞速',
      description: '在未来都市中完成超高难度的极限运算！',
      icon: '🏎️'
    },
    workshop: {
      name: '科技工坊',
      description: '收集稀有材料，研发高科技产品',
      icon: '🦾',
      itemTheme: 'high_tech'
    },
    shop: {
      name: '未来超市',
      description: '计算折扣、满减、税费等综合交易',
      itemTypes: ['电子产品', '生活用品']
    },
    card: {
      name: '未来卡牌',
      description: '用高科技武装自己，迎接最终挑战'
    },

    abilityFocus: [
      { type: 'comprehensive',     label: '综合应用',    weight: 0.25 },
      { type: 'strategy',          label: '策略规划',    weight: 0.25 },
      { type: 'criticalThinking',  label: '批判性思维', weight: 0.25 },
      { type: 'creativity',        label: '创造性解题', weight: 0.25 }
    ]
  }
};

/**
 * 获取指定年级的主题配置
 * @param {number} grade - 1-6
 * @returns {object} 主题配置
 */
export function getGradeTheme(grade) {
  return gradeThemes[grade] || gradeThemes[1];
}

/**
 * 获取指定年级的能力培养重点列表（按权重排序）
 * @param {number} grade
 * @returns {Array<{type: string, label: string, weight: number}>}
 */
export function getGradeAbilityFocus(grade) {
  const theme = getGradeTheme(grade);
  return [...theme.abilityFocus].sort((a, b) => b.weight - a.weight);
}

/**
 * 获取指定年级的题型呈现风格
 * @param {number} grade
 * @returns {string} questionStyle key
 */
export function getGradeQuestionStyle(grade) {
  return getGradeTheme(grade).questionStyle;
}

export default gradeThemes;
