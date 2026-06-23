/**
 * 几何王国 — 图形数据库
 * 包含平面图形和立体图形的定义数据
 */

/**
 * 平面图形列表
 * @type {Array<{id: string, name: string, icon: string, sides: number, angles: number, properties?: string[]}>}
 */
export const planeFigures = [
  { id: 'square', name: '正方形', icon: '⬜', sides: 4, angles: 4, properties: ['等边', '等角', '平行'] },
  { id: 'rectangle', name: '长方形', icon: '▬', sides: 4, angles: 4, properties: ['对边相等', '等角'] },
  { id: 'triangle', name: '三角形', icon: '△', sides: 3, angles: 3 },
  { id: 'circle', name: '圆形', icon: '○', sides: 0, angles: 0, properties: ['无角'] },
  { id: 'parallelogram', name: '平行四边形', icon: '▱', sides: 4, angles: 4, properties: ['对边平行', '对边相等', '对角相等'] },
  { id: 'trapezoid', name: '梯形', icon: '⏢', sides: 4, angles: 4, properties: ['一组对边平行'] },
  { id: 'rhombus', name: '菱形', icon: '◇', sides: 4, angles: 4, properties: ['四边相等', '对角相等', '对角线垂直'] },
  { id: 'pentagon', name: '五边形', icon: '⬠', sides: 5, angles: 5 },
  { id: 'hexagon', name: '六边形', icon: '⬡', sides: 6, angles: 6 },
  { id: 'ellipse', name: '椭圆', icon: '🥚', sides: 0, angles: 0, properties: ['无角'] },
  { id: 'rightTriangle', name: '直角三角形', icon: '⊿', sides: 3, angles: 3, properties: ['一个直角'] },
  { id: 'isoscelesTriangle', name: '等腰三角形', icon: '▲', sides: 3, angles: 3, properties: ['两边相等', '两角相等'] }
];

/**
 * 立体图形列表
 * @type {Array<{id: string, name: string, icon: string, faces: number, vertices: number, edges: number}>}
 */
export const solidFigures = [
  { id: 'cube', name: '正方体', icon: '🧊', faces: 6, vertices: 8, edges: 12 },
  { id: 'cuboid', name: '长方体', icon: '📦', faces: 6, vertices: 8, edges: 12 },
  { id: 'sphere', name: '球体', icon: '⚽', faces: 1, vertices: 0, edges: 0 },
  { id: 'cylinder', name: '圆柱', icon: '🥫', faces: 3, vertices: 0, edges: 2 },
  { id: 'cone', name: '圆锥', icon: '🎄', faces: 2, vertices: 1, edges: 1 },
  { id: 'triangularPrism', name: '三棱柱', icon: '🔺', faces: 5, vertices: 6, edges: 9 },
  { id: 'squarePyramid', name: '四棱锥', icon: '🔻', faces: 5, vertices: 5, edges: 8 },
  { id: 'triangularPyramid', name: '三棱锥', icon: '△', faces: 4, vertices: 4, edges: 6 }
];

/**
 * 根据年级获取适用的平面图形列表
 * @param {number} grade - 年级 (1-6)
 * @returns {Array} 平面图形列表
 */
export function getPlaneFiguresForGrade(grade) {
  if (grade <= 2) {
    // 低年级：基础图形
    return planeFigures.filter(f =>
      ['square', 'rectangle', 'triangle', 'circle'].includes(f.id)
    );
  }
  if (grade <= 4) {
    // 中年级：增加平行四边形、梯形、五边形、六边形
    return planeFigures.filter(f =>
      !['ellipse', 'rightTriangle', 'isoscelesTriangle'].includes(f.id)
    );
  }
  // 高年级：全部
  return [...planeFigures];
}

/**
 * 根据年级获取适用的立体图形列表
 * @param {number} grade - 年级 (1-6)
 * @returns {Array} 立体图形列表
 */
export function getSolidFiguresForGrade(grade) {
  if (grade <= 2) {
    return solidFigures.filter(f =>
      ['cube', 'cuboid', 'sphere'].includes(f.id)
    );
  }
  if (grade <= 4) {
    return solidFigures.filter(f =>
      !['triangularPyramid', 'squarePyramid'].includes(f.id)
    );
  }
  return [...solidFigures];
}

/**
 * 根据ID查找平面图形
 * @param {string} id
 * @returns {object|null}
 */
export function getPlaneFigureById(id) {
  return planeFigures.find(f => f.id === id) || null;
}

/**
 * 根据ID查找立体图形
 * @param {string} id
 * @returns {object|null}
 */
export function getSolidFigureById(id) {
  return solidFigures.find(f => f.id === id) || null;
}

export default {
  planeFigures,
  solidFigures,
  getPlaneFiguresForGrade,
  getSolidFiguresForGrade,
  getPlaneFigureById,
  getSolidFigureById
};
