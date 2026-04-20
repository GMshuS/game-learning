/**
 * 角色属性与成长系统
 */

/**
 * 角色基础属性配置
 */
export const characterConfig = {
  // 基础属性
  baseStats: {
    hp: 100,        // 生命值
    attack: 10,     // 攻击力
    defense: 5,     // 防御力
    luck: 0,        // 幸运值
    exp: 0,         // 经验值
    level: 1        // 等级
  },
  
  // 每级成长
  growthPerLevel: {
    hp: 20,
    attack: 3,
    defense: 2,
    luck: 1
  },
  
  // 升级所需经验（每级）
  expPerLevel: (level) => level * 100,
  
  // 最大等级
  maxLevel: 50
}

/**
 * 角色类
 */
export class Character {
  constructor(data = {}) {
    this.name = data.name || '冒险者'
    this.level = data.level || 1
    this.exp = data.exp || 0
    this.hp = data.hp || this.getBaseHp(1)
    this.maxHp = data.maxHp || this.getBaseHp(1)
    this.attack = data.attack || this.getBaseAttack(1)
    this.defense = data.defense || this.getBaseDefense(1)
    this.luck = data.luck || this.getBaseLuck(1)
    this.equipmentBonus = data.equipmentBonus || { attack: 0, defense: 0, luck: 0 }
  }
  
  /**
   * 获取基础 HP
   */
  getBaseHp(level) {
    return characterConfig.baseStats.hp + (level - 1) * characterConfig.growthPerLevel.hp
  }
  
  /**
   * 获取基础攻击力
   */
  getBaseAttack(level) {
    return characterConfig.baseStats.attack + (level - 1) * characterConfig.growthPerLevel.attack
  }
  
  /**
   * 获取基础防御力
   */
  getBaseDefense(level) {
    return characterConfig.baseStats.defense + (level - 1) * characterConfig.growthPerLevel.defense
  }
  
  /**
   * 获取基础幸运
   */
  getBaseLuck(level) {
    return characterConfig.baseStats.luck + (level - 1) * characterConfig.growthPerLevel.luck
  }
  
  /**
   * 获取总攻击力（含装备）
   */
  getTotalAttack() {
    return this.attack + (this.equipmentBonus.attack || 0)
  }
  
  /**
   * 获取总防御力（含装备）
   */
  getTotalDefense() {
    return this.defense + (this.equipmentBonus.defense || 0)
  }
  
  /**
   * 获取总幸运（含装备）
   */
  getTotalLuck() {
    return this.luck + (this.equipmentBonus.luck || 0)
  }
  
  /**
   * 获得经验
   */
  gainExp(amount) {
    const expNeeded = this.getExpNeeded()
    this.exp += amount
    
    if (this.exp >= expNeeded) {
      this.exp -= expNeeded
      this.levelUp()
      return true
    }
    return false
  }
  
  /**
   * 获取升级所需经验
   */
  getExpNeeded() {
    return characterConfig.expPerLevel(this.level)
  }
  
  /**
   * 升级
   */
  levelUp() {
    if (this.level >= characterConfig.maxLevel) {
      return false
    }
    
    this.level++
    
    // 更新属性
    this.maxHp = this.getBaseHp(this.level)
    this.hp = this.maxHp  // 升级后满血
    this.attack = this.getBaseAttack(this.level)
    this.defense = this.getBaseDefense(this.level)
    this.luck = this.getBaseLuck(this.level)
    
    return true
  }
  
  /**
   * 恢复 HP
   */
  heal(amount) {
    const oldHp = this.hp
    this.hp = Math.min(this.maxHp, this.hp + amount)
    return this.hp - oldHp
  }
  
  /**
   * 受到伤害
   */
  takeDamage(amount) {
    // 计算实际伤害（考虑防御）
    const actualDamage = Math.max(1, Math.floor(amount * (1 - this.getTotalDefense() / 100)))
    this.hp = Math.max(0, this.hp - actualDamage)
    return actualDamage
  }
  
  /**
   * 是否存活
   */
  isAlive() {
    return this.hp > 0
  }
  
  /**
   * 获取升级进度百分比
   */
  getExpProgress() {
    const needed = this.getExpNeeded()
    return Math.round((this.exp / needed) * 100)
  }
  
  /**
   * 转换为存储对象
   */
  toStorage() {
    return {
      name: this.name,
      level: this.level,
      exp: this.exp,
      hp: this.hp,
      maxHp: this.maxHp,
      attack: this.attack,
      defense: this.defense,
      luck: this.luck,
      equipmentBonus: this.equipmentBonus
    }
  }
  
  /**
   * 从存储对象创建
   */
  static fromStorage(data) {
    return new Character(data)
  }
}

/**
 * 计算伤害
 */
export function calculateDamage(attacker, defender, isCritical = false) {
  let damage = attacker.getTotalAttack()
  
  // 暴击
  if (isCritical) {
    damage = Math.floor(damage * 1.5)
  }
  
  // 防御减免
  const defenseReduction = Math.min(0.8, defender.getTotalDefense() / 100)
  damage = Math.floor(damage * (1 - defenseReduction))
  
  return Math.max(1, damage)
}

/**
 * 检查暴击
 */
export function checkCritical(luck) {
  const baseCritRate = 0.05
  const critRate = baseCritRate + (luck * 0.01)
  return Math.random() < critRate
}

export default {
  characterConfig,
  Character,
  calculateDamage,
  checkCritical
}
