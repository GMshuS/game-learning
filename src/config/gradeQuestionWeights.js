/**
 * 按年级题型权重配置
 * 每个年级中各种题型的权重分布，用于按权重随机选择题目类型
 * 权重总值不需要统一为 100，算法会按比例归一化
 *
 * 注意：只包含实际已实现的题型
 * 未实现的题型（pictureCompare, chartQuestion, fractionVisual）暂不加入
 */
export const gradeQuestionWeights = {
  1: { add: 15, subtract: 15, word: 10, numberFill: 20,
       numberCompare: 15, placeValue: 15, patternFind: 10 },
  2: { add: 12, subtract: 12, multiply: 8, word: 15, numberFill: 18,
       numberCompare: 12, placeValue: 10, estimate: 8, patternFind: 5 },
  3: { add: 8, subtract: 8, multiply: 10, divide: 8, mixed: 8,
       word: 8, estimate: 8, numberFill: 5,
       numberCompare: 8, numberProperty: 10, patternFind: 7, averageCalc: 12 },
  4: { add: 6, subtract: 6, multiply: 8, divide: 8, mixed: 8,
       word: 10, decimal: 8, estimate: 5,
       numberCompare: 6, numberProperty: 10, operationLaw: 12, averageCalc: 7 },
  5: { add: 3, subtract: 3, multiply: 5, divide: 5,
       fraction: 10, decimal: 10, mixed: 6, word: 8, equation: 8, percentage: 6,
       numberProperty: 8, operationLaw: 8, ratioProportion: 8, negativeNumber: 6, averageCalc: 6 },
  6: { add: 3, subtract: 3, multiply: 5, divide: 5,
       fraction: 8, decimal: 8, percentage: 8, mixed: 5, word: 8, equation: 10,
       numberProperty: 8, operationLaw: 8, ratioProportion: 8, negativeNumber: 8, averageCalc: 5 }
};

export default gradeQuestionWeights;
