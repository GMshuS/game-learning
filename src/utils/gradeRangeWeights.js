/**
 * 区间权重合并工具
 * 线性偏上策略：高年级系数 > 低年级系数
 */
import { gradeQuestionWeights } from '../config/gradeQuestionWeights';
import { getAvailableTypesForGrade } from '../config/questionTypes';

/**
 * 计算区间内各年级的线性偏上系数
 * @param {number} min - 区间下限
 * @param {number} max - 区间上限
 * @returns {Object} { grade: coefficient, ... }
 */
export function calcRangeCoefficients(min, max) {
  if (min > max) {
    // 容错：交换 min/max
    [min, max] = [max, min];
  }
  const n = max - min + 1;
  const sum = n * (n + 1) / 2; // 1+2+...+n
  const coefficients = {};
  for (let g = min; g <= max; g++) {
    coefficients[g] = (g - min + 1) / sum;
  }
  return coefficients;
}

/**
 * 合并区间内各年级的题型权重
 * @param {number} min - 区间下限
 * @param {number} max - 区间上限
 * @param {string} [strategy='linear_up'] - 策略名（保留扩展）
 * @param {Object} [gradeWeights] - 缺省时读 gradeQuestionWeights config
 * @returns {Object} { type: mergedWeight }
 */
export function mergeWeightsForRange(min, max, _strategy = 'linear_up', gradeWeights = null) {
  if (min > max) {
    [min, max] = [max, min];
  }
  const weights = gradeWeights || gradeQuestionWeights;
  const coefficients = calcRangeCoefficients(min, max);
  const merged = {};

  for (let g = min; g <= max; g++) {
    const gw = weights[g];
    if (!gw) continue;
    const coeff = coefficients[g];
    for (const [type, weight] of Object.entries(gw)) {
      if (merged[type] === undefined) {
        merged[type] = 0;
      }
      merged[type] += weight * coeff;
    }
  }

  // 四舍五入保留2位小数，避免浮点误差积累
  for (const type of Object.keys(merged)) {
    merged[type] = Math.round(merged[type] * 100) / 100;
  }

  return merged;
}

/**
 * 获取区间内所有年级的可用题型并集
 * @param {number} min
 * @param {number} max
 * @returns {string[]}
 */
export function getAvailableTypesForRange(min, max) {
  if (min > max) {
    [min, max] = [max, min];
  }
  const typeSet = new Set();
  for (let g = min; g <= max; g++) {
    const types = getAvailableTypesForGrade(g);
    for (const t of types) {
      typeSet.add(t);
    }
  }
  return Array.from(typeSet);
}
