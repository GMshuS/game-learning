/**
 * 题型共享工具函数
 */

/**
 * 生成随机整数 [min, max]
 */
export function randomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min
}
