/**
 * 怪物配置
 */
export const monsterConfig = {
  // 史莱姆系列
  slimes: [
    {
      id: 'green_slime',
      name: '绿色史莱姆',
      type: 'slime',
      difficulty: 1,
      exp: 10,
      coins: 5,
      hp: 30,
      attack: 3,
      icon: '🟢',
      color: '#4ade80',
      grades: [1, 2]
    },
    {
      id: 'blue_slime',
      name: '蓝色史莱姆',
      type: 'slime',
      difficulty: 2,
      exp: 20,
      coins: 10,
      hp: 50,
      attack: 5,
      icon: '🔵',
      color: '#60a5fa',
      grades: [2, 3]
    },
    {
      id: 'king_slime',
      name: '史莱姆王',
      type: 'slime',
      difficulty: 4,
      exp: 60,
      coins: 30,
      hp: 120,
      attack: 12,
      icon: '👑',
      color: '#a78bfa',
      grades: [4, 5]
    }
  ],
  
  // 哥布林系列
  goblins: [
    {
      id: 'goblin_scout',
      name: '哥布林侦察兵',
      type: 'goblin',
      difficulty: 2,
      exp: 25,
      coins: 12,
      hp: 45,
      attack: 6,
      icon: '👺',
      color: '#f87171',
      grades: [2, 3]
    },
    {
      id: 'goblin_warrior',
      name: '哥布林战士',
      type: 'goblin',
      difficulty: 3,
      exp: 40,
      coins: 20,
      hp: 80,
      attack: 10,
      icon: '⚔️',
      color: '#dc2626',
      grades: [3, 4]
    },
    {
      id: 'goblin_king',
      name: '哥布林大王',
      type: 'goblin',
      difficulty: 5,
      exp: 120,
      coins: 60,
      hp: 200,
      attack: 20,
      icon: '🤴',
      color: '#991b1b',
      grades: [5, 6]
    }
  ],
  
  // 兽人系列
  orcs: [
    {
      id: 'orc_grunt',
      name: '兽人步兵',
      type: 'orc',
      difficulty: 3,
      exp: 35,
      coins: 18,
      hp: 70,
      attack: 9,
      icon: '👹',
      color: '#fb923c',
      grades: [3, 4]
    },
    {
      id: 'orc_berserker',
      name: '兽人狂战士',
      type: 'orc',
      difficulty: 4,
      exp: 55,
      coins: 28,
      hp: 110,
      attack: 15,
      icon: '💪',
      color: '#ea580c',
      grades: [4, 5]
    },
    {
      id: 'orc_warlord',
      name: '兽人督军',
      type: 'orc',
      difficulty: 5,
      exp: 100,
      coins: 50,
      hp: 180,
      attack: 22,
      icon: '🛡️',
      color: '#c2410c',
      grades: [5, 6]
    }
  ],
  
  // 巨龙系列（Boss）
  dragons: [
    {
      id: 'math_dragon',
      name: '数学巨龙',
      type: 'dragon',
      difficulty: 5,
      exp: 200,
      coins: 100,
      hp: 300,
      attack: 25,
      icon: '🐉',
      color: '#7c3aed',
      grades: [5, 6],
      isBoss: true
    }
  ]
}

/**
 * 根据难度获取怪物
 */
export function getMonstersByDifficulty(difficulty) {
  const allMonsters = [
    ...monsterConfig.slimes,
    ...monsterConfig.goblins,
    ...monsterConfig.orcs,
    ...monsterConfig.dragons
  ]
  
  return allMonsters.filter(m => m.difficulty === difficulty)
}

/**
 * 根据年级获取怪物
 */
export function getMonstersForGrade(grade) {
  const allMonsters = [
    ...monsterConfig.slimes,
    ...monsterConfig.goblins,
    ...monsterConfig.orcs,
    ...monsterConfig.dragons
  ]
  
  return allMonsters.filter(m => m.grades.includes(grade))
}

/**
 * 随机获取一个怪物
 */
export function getRandomMonster(grade) {
  const available = getMonstersForGrade(grade)
  if (available.length === 0) {
    return monsterConfig.slimes[0]
  }
  return available[Math.floor(Math.random() * available.length)]
}

export default monsterConfig
