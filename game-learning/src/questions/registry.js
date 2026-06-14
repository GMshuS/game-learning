/**
 * 题型注册表
 * 管理各题型生成器的注册与调用
 */

const registry = {};

/**
 * 注册一个题型生成器
 * @param {string} type - 题型标识 ('add', 'subtract', 'multiply', etc.)
 * @param {function} generator - (grade, range) => { question, answer, type, ... }
 */
export function register(type, generator) {
  registry[type] = generator;
}

/**
 * 获取已注册的题型列表
 * @returns {string[]}
 */
export function getRegisteredTypes() {
  return Object.keys(registry);
}

/**
 * 生成指定类型的题目
 * @param {string} type - 题型标识
 * @param {number} grade - 年级 (1-6)
 * @param {object} range - 数字范围 { min, max }
 * @returns {object|null} 题目对象，若类型未注册则返回 null
 */
export function generate(type, grade, range) {
  const generator = registry[type];
  if (!generator) return null;
  return generator(grade, range);
}
