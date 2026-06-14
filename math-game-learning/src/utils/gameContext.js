/**
 * GameContext 适配层
 * 设置层与表现层之间的统一接口
 */
import { getGradeRange, getGradeOperations } from '../config/grades';
import { getDifficultyScale } from '../config/difficultyScale';

/**
 * 获取年级上下文
 * @param {number} grade - 年级 (1-6)
 * @returns {{ range: {min: number, max: number}, operations: string[] }}
 */
export function getGradeContext(grade) {
  const range = getGradeRange(grade);
  const operations = getGradeOperations(grade);
  return { range, operations };
}

/**
 * 获取难度上下文
 * @param {string} difficulty - 难度标识 ('easy' | 'normal' | 'hard')
 * @returns {object} 难度倍率配置对象
 */
export function getDifficultyContext(difficulty) {
  return getDifficultyScale(difficulty);
}

/**
 * 获取完整游戏配置（合并年级配置与难度倍率）
 * @param {number} grade - 年级 (1-6)
 * @param {string} difficulty - 难度标识 ('easy' | 'normal' | 'hard')
 * @returns {{ grade: number, range: {min: number, max: number}, operations: string[], difficulty: string, scale: object }}
 */
export function getGameConfig(grade, difficulty) {
  const gradeContext = getGradeContext(grade);
  const scale = getDifficultyContext(difficulty);

  return {
    grade: grade,
    range: gradeContext.range,
    operations: gradeContext.operations,
    difficulty: difficulty,
    scale: scale
  };
}
