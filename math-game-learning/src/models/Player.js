/**
 * 玩家数据模型
 */
export class Player {
  constructor(data = {}) {
    this.id = data.id || this.generateId()
    this.name = data.name || '冒险者'
    this.level = data.level || 1  // 角色等级
    this.exp = data.exp || 0      // 经验值
    this.coins = data.coins || 0  // 金币数量
    this.items = data.items || [] // 道具列表
    this.createdAt = data.createdAt || new Date().toISOString()
    this.lastLoginAt = data.lastLoginAt || new Date().toISOString()
  }

  generateId() {
    return 'player_' + Date.now() + '_' + Math.random().toString(36).slice(2, 11)
  }

  /**
   * 增加经验值
   */
  addExp(amount) {
    this.exp += amount
    const expNeeded = this.level * 100
    if (this.exp >= expNeeded) {
      this.exp -= expNeeded
      this.levelUp()
      return true
    }
    return false
  }

  /**
   * 升级
   */
  levelUp() {
    this.level++
    console.log(`升级！当前等级：${this.level}`)
  }

  /**
   * 增加金币
   */
  addCoins(amount) {
    this.coins += amount
  }

  /**
   * 消费金币
   */
  spendCoins(amount) {
    if (this.coins >= amount) {
      this.coins -= amount
      return true
    }
    return false
  }

  /**
   * 添加道具
   */
  addItem(item) {
    this.items.push(item)
  }

  /**
   * 移除道具
   */
  removeItem(itemId) {
    const index = this.items.findIndex(i => i.id === itemId)
    if (index !== -1) {
      this.items.splice(index, 1)
      return true
    }
    return false
  }

  /**
   * 转换为存储对象
   */
  toStorage() {
    return {
      id: this.id,
      name: this.name,
      level: this.level,
      exp: this.exp,
      coins: this.coins,
      items: this.items,
      createdAt: this.createdAt,
      lastLoginAt: new Date().toISOString()
    }
  }

  /**
   * 从存储对象创建
   */
  static fromStorage(data) {
    return new Player(data)
  }
}

export default Player
