/**
 * SM-2 简化算法模块
 *
 * 提供基于 SM-2 间隔重复算法的核心函数。
 * quality 严格限定为 0/1/2 三档：
 *   0 — 忘记 (Forgot)
 *   1 — 困难 (Hard)
 *   2 — 轻松 (Easy)
 *
 * 不实现完整 SM-2（不追踪逐日重复历史），仅实现简化核心算法。
 * 纯函数模块，无外部依赖，不涉及 localStorage。
 */

/**
 * SM-2 简化算法核心
 *
 * @param {Object} record - { easeFactor: number, interval: number }
 * @param {number} quality - 0=忘记, 1=困难, 2=轻松
 * @returns {{ newEF: number, newInterval: number, nextReviewTime: number }}
 */
function reviewResult(record, quality) {
  try {
    const ef = record.easeFactor;
    const interval = record.interval;
    let newInterval;
    let newEF;

    switch (quality) {
      case 0: // 忘记
        newInterval = 1;
        newEF = Math.max(1.3, ef - 0.2);
        break;
      case 1: // 困难
        newInterval = interval === 0 ? 1 : interval;
        newEF = Math.max(1.3, ef - 0.15);
        break;
      case 2: // 轻松
        newInterval = interval === 0 ? 1 : Math.round(interval * ef);
        newEF = Math.min(2.5, ef + 0.1);
        break;
      default:
        // 兜底：不支持的 quality 值，返回原值 + 默认间隔 1
        newInterval = 1;
        newEF = ef;
    }

    const nextReviewTime = Date.now() + newInterval * 86400000;

    return {
      newEF: newEF,
      newInterval: newInterval,
      nextReviewTime: nextReviewTime
    };
  } catch (e) {
    console.warn('spacedRepetition.reviewResult: 计算失败', e.message);
    return {
      newEF: record.easeFactor,
      newInterval: 1,
      nextReviewTime: Date.now() + 86400000
    };
  }
}

/**
 * 返回默认 SM-2 初始字段
 *
 * @returns {{ easeFactor: number, interval: number, nextReviewTime: null, lastReviewDate: null }}
 */
function getInitialSM2Fields() {
  return {
    easeFactor: 2.5,
    interval: 0,
    nextReviewTime: null,
    lastReviewDate: null
  };
}

/**
 * 统计到期知识点数量
 *
 * 筛选 easeFactor 已设置 且 (nextReviewTime 为空 或 已到期) 的记录。
 *
 * @param {Object} records - 形如 { id: { easeFactor, nextReviewTime, ... } }
 * @returns {number} 到期知识点数量
 */
function getDueCount(records) {
  try {
    let count = 0;
    const ids = Object.keys(records);
    const now = Date.now();

    for (let i = 0; i < ids.length; i++) {
      const record = records[ids[i]];
      if (record.easeFactor !== undefined) {
        if (record.nextReviewTime === null || record.nextReviewTime <= now) {
          count++;
        }
      }
    }

    return count;
  } catch (e) {
    console.warn('spacedRepetition.getDueCount: 统计失败', e.message);
    return 0;
  }
}

export { reviewResult, getInitialSM2Fields, getDueCount };
export default { reviewResult, getInitialSM2Fields, getDueCount };
