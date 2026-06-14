/**
 * 按年级题型权重配置
 * 每个年级中各种题型的权重分布，用于按权重随机选择题目类型
 * 权重总值不需要统一为 100，算法会按比例归一化
 *
 * 注意：只包含实际已实现的题型
 * 未实现的题型（pictureCompare, chartQuestion, fractionVisual）暂不加入
 */
export const gradeQuestionWeights = {
  1: { add: 20, subtract: 20, word: 15, numberFill: 30 },
  2: { add: 15, subtract: 15, multiply: 10, word: 20, numberFill: 25 },
  3: { add: 10, subtract: 10, multiply: 15, divide: 10, mixed: 10, word: 15, estimate: 15, numberFill: 15 },
  4: { add: 8, subtract: 8, multiply: 12, divide: 10, mixed: 15, word: 15, estimate: 12 },
  5: { fraction: 15, decimal: 15, mixed: 10, word: 15, equation: 15, percentage: 10 },
  6: { fraction: 10, decimal: 10, percentage: 15, equation: 20, word: 15, mixed: 10 }
};

export default gradeQuestionWeights;
