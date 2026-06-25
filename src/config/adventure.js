/**
 * 冒险模式配置
 */
export const adventureConfig = {
  // 世界区域
  areas: [
    {
      id: 'area_1',
      name: '数字森林',
      description: '学习数字的基础之地',
      gradeRange: [1, 2],
      color: '#4ade80',
      levels: 10,
      unlockedBy: null
    },
    {
      id: 'area_2',
      name: '加减山谷',
      description: '掌握加减法的山谷',
      gradeRange: [1, 2],
      color: '#60a5fa',
      levels: 10,
      unlockedBy: 'area_1'
    },
    {
      id: 'area_3',
      name: '乘除城堡',
      description: '乘除法的神秘城堡',
      gradeRange: [3, 4],
      color: '#fbbf24',
      levels: 12,
      unlockedBy: 'area_2'
    },
    {
      id: 'area_4',
      name: '分数海岛',
      description: '探索分数的奥秘',
      gradeRange: [5, 6],
      color: '#f472b6',
      levels: 10,
      unlockedBy: 'area_3'
    },
    {
      id: 'area_5',
      name: '数学之王座',
      description: '最终的挑战之地',
      gradeRange: [5, 6],
      color: '#a78bfa',
      levels: 8,
      unlockedBy: 'area_4'
    }
  ],

  // 怪物类型
  monsters: [
    { id: 'slime', name: '数字史莱姆', difficulty: 1, exp: 10, coins: 5 },
    { id: 'goblin', name: '计算哥布林', difficulty: 2, exp: 20, coins: 10 },
    { id: 'orc', name: '算术兽人', difficulty: 3, exp: 30, coins: 15 },
    { id: 'dragon', name: '数学巨龙', difficulty: 5, exp: 100, coins: 50 }
  ],

  // 关卡奖励
  levelRewards: {
    firstClear: { coins: 50, exp: 100 },
    perfectScore: { coins: 25, exp: 50 },
    timeBonus: { coins: 10, exp: 20 }
  }
};

/**
 * 获取区域信息
 */
export function getArea(areaId) {
  return adventureConfig.areas.find(a => a.id === areaId);
}

/**
 * 获取所有区域
 */
export function getAllAreas() {
  return adventureConfig.areas;
}

/**
 * 根据年级获取可用区域
 */
export function getAreasForGrade(grade) {
  return adventureConfig.areas.filter(area => 
    grade >= area.gradeRange[0] && grade <= area.gradeRange[1]
  );
}

export default adventureConfig;
