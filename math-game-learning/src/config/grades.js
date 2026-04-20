/**
 * 年级配置 - 定义各年级的数学知识点和难度
 */
export const gradesConfig = {
  // 1 年级
  grade1: {
    name: '一年级',
    range: { min: 1, max: 20 },
    operations: ['add', 'subtract'],
    topics: ['20 以内加减法', '认识数字', '比较大小'],
    description: '基础加减法入门'
  },
  
  // 2 年级
  grade2: {
    name: '二年级',
    range: { min: 1, max: 100 },
    operations: ['add', 'subtract'],
    topics: ['100 以内加减法', '乘法入门', '长度单位'],
    description: '百以内运算'
  },
  
  // 3 年级
  grade3: {
    name: '三年级',
    range: { min: 1, max: 1000 },
    operations: ['add', 'subtract', 'multiply', 'divide'],
    topics: ['乘除法', '混合运算', '面积计算'],
    description: '乘除法与混合运算'
  },
  
  // 4 年级
  grade4: {
    name: '四年级',
    range: { min: 1, max: 10000 },
    operations: ['add', 'subtract', 'multiply', 'divide'],
    topics: ['大数运算', '四则混合运算', '几何图形'],
    description: '大数与复杂运算'
  },
  
  // 5 年级
  grade5: {
    name: '五年级',
    range: { min: 1, max: 100 },
    operations: ['fraction', 'decimal'],
    topics: ['分数', '小数', '百分数'],
    description: '分数与小数'
  },
  
  // 6 年级
  grade6: {
    name: '六年级',
    range: { min: 1, max: 100 },
    operations: ['fraction', 'decimal', 'percentage'],
    topics: ['比例', '百分比应用', '简易方程'],
    description: '综合应用'
  }
}

/**
 * 根据年级获取数字范围
 */
export function getGradeRange(grade) {
  const config = gradesConfig[`grade${grade}`]
  return config ? config.range : { min: 1, max: 20 }
}

/**
 * 根据年级获取可用运算类型
 */
export function getGradeOperations(grade) {
  const config = gradesConfig[`grade${grade}`]
  return config ? config.operations : ['add', 'subtract']
}

export default gradesConfig
