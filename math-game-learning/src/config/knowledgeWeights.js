/**
 * 权重加载逻辑
 * 优先级: admin override (weightOverrides) > config 默认 > errorBoost 乘数
 */

import { STORAGE_KEYS } from '../utils/storage';

// 错题反馈系数 (K 因子)
export const ERROR_BOOST_FACTOR = 2.0;

/**
 * 从 localStorage 读取 weightOverrides
 * @returns {Object} { grades: { [grade]: { type: weight } }, globalSettings: {} }
 */
function loadWeightOverrides() {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.WEIGHT_OVERRIDES);
    return raw ? JSON.parse(raw) : { grades: {}, globalSettings: {} };
  } catch {
    return { grades: {}, globalSettings: {} };
  }
}

/**
 * 从 localStorage 读取知识系统配置
 * @returns {Object} { minAttempts: number }
 */
export function loadKnowledgeConfig() {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.KNOWLEDGE_CONFIG);
    return raw ? JSON.parse(raw) : { minAttempts: 3 };
  } catch {
    return { minAttempts: 3 };
  }
}

/**
 * 获取调整后的权重
 * @param {number} grade - 年级
 * @param {Object} baseWeights - gradeQuestionWeights[grade] 的默认权重
 * @param {Object} knowledgeStore - mathKnowledgeStore 实例 (需有 records 属性)
 * @returns {Object} adjustedWeights - { type: adjustedWeight }
 */
export function getAdjustedWeights(grade, baseWeights, knowledgeStore) {
  const overrides = loadWeightOverrides();
  const gradeOverrides = overrides.grades?.[grade] || {};
  const adjusted = {};

  // 最小值阈值 (errorBoost 冷启动保护)
  const config = loadKnowledgeConfig();
  const minAttempts = config.minAttempts || 3;

  for (const [type, defaultWeight] of Object.entries(baseWeights)) {
    // 优先级1: admin override
    const weight = (gradeOverrides[type] !== undefined) ? gradeOverrides[type] : defaultWeight;

    // 优先级2: errorBoost (仅当答题次数达到 minAttempts 阈值后生效)
    let boost = 1.0;
    const record = knowledgeStore?.records?.[type];
    if (record && record.totalAttempts >= minAttempts) {
      const errorRate = record.wrongCount / record.totalAttempts;
      boost = 1 + errorRate * ERROR_BOOST_FACTOR;
    }

    adjusted[type] = Math.round(weight * boost);
  }

  return adjusted;
}

export default { getAdjustedWeights, loadKnowledgeConfig, ERROR_BOOST_FACTOR };
