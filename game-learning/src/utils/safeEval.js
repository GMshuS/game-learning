/**
 * expr-eval 安全求值封装
 *
 * 提供安全的数学表达式求值能力，替代 eval()。
 * 仅支持数学表达式，不支持任意 JS 代码执行。
 * 第一阶段仅为建壳，供后续自定义模板系统使用。
 */
import { Parser } from 'expr-eval';

let parser = null;
function getParser() {
  if (!parser) {
    parser = new Parser();
  }
  return parser;
}

/**
 * 安全求值数学表达式
 * @param {string} expression - 数学表达式，如 'a + b'
 * @param {Object} variables - 变量值映射，如 { a: 5, b: 3 }
 * @returns {number} 计算结果，失败返回 NaN
 */
function safeEvaluate(expression, variables = {}) {
  try {
    const expr = getParser().parse(expression);
    return expr.evaluate(variables);
  } catch (e) {
    console.warn('safeEval: 表达式求值失败', expression, e.message);
    return NaN;
  }
}

export { safeEvaluate };
export default { safeEvaluate };
