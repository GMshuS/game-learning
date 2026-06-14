/**
 * 虚拟排行榜配置
 */

// 虚拟玩家名字池
export const virtualPlayerNames = [
  '小明', '小红', '小刚', '小丽', '小华', '小强', '小芳', '小龙',
  '小杰', '小燕', '小伟', '小敏', '小磊', '小婷', '小波', '小静',
  '数学小达人', '计算高手', '速算王', '答题王', '智慧星', '天才少年',
  '学霸', '小诸葛', '小神算', '算术王', '数学之星', '智慧之星'
];

// 各模式虚拟玩家分数范围
export const scoreRanges = {
  speed_base: { min: 200, max: 800 },
  speed_blitz: { min: 150, max: 600 },
  speed_survival: { min: 300, max: 1000 },
  card_battle: { min: 5, max: 25 } // 连胜场次
};

// 虚拟玩家数量
export const VIRTUAL_PLAYER_COUNT = 20;

// 分数增长系数
export const SCORE_GROWTH = {
  min: 1.05,
  max: 1.15
};

export default {
  virtualPlayerNames,
  scoreRanges,
  VIRTUAL_PLAYER_COUNT,
  SCORE_GROWTH
};
