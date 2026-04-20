/**
 * 库存数据模型
 */
export class Inventory {
  constructor(data = {}) {
    this.items = data.items || []         // 普通物品
    this.equipment = data.equipment || {  // 装备
      weapon: null,    // 武器
      armor: null,     // 防具
      accessory: null  // 饰品
    }
    this.collectibles = data.collectibles || [] // 收藏品
  }

  /**
   * 添加物品
   */
  addItem(item) {
    const existing = this.items.find(i => i.id === item.id)
    if (existing) {
      existing.quantity = (existing.quantity || 1) + (item.quantity || 1)
    } else {
      this.items.push({ ...item, quantity: item.quantity || 1 })
    }
  }

  /**
   * 移除物品
   */
  removeItem(itemId, quantity = 1) {
    const index = this.items.findIndex(i => i.id === itemId)
    if (index !== -1) {
      const item = this.items[index]
      if ((item.quantity || 1) <= quantity) {
        this.items.splice(index, 1)
      } else {
        item.quantity -= quantity
      }
      return true
    }
    return false
  }

  /**
   * 检查是否有某物品
   */
  hasItem(itemId, quantity = 1) {
    const item = this.items.find(i => i.id === itemId)
    return item && (item.quantity || 1) >= quantity
  }

  /**
   * 获取物品数量
   */
  getItemQuantity(itemId) {
    const item = this.items.find(i => i.id === itemId)
    return item ? (item.quantity || 1) : 0
  }

  /**
   * 装备物品
   */
  equipItem(item) {
    const slot = this.getEquipmentSlot(item.type)
    if (slot) {
      const current = this.equipment[slot]
      this.equipment[slot] = item
      return current
    }
    return null
  }

  /**
   * 卸下装备
   */
  unequipItem(slot) {
    const item = this.equipment[slot]
    this.equipment[slot] = null
    return item
  }

  /**
   * 获取装备类型对应的槽位
   */
  getEquipmentSlot(type) {
    const slotMap = {
      'weapon': 'weapon',
      'sword': 'weapon',
      'shield': 'armor',
      'armor': 'armor',
      'accessory': 'accessory',
      'badge': 'accessory'
    }
    return slotMap[type] || null
  }

  /**
   * 获取装备属性加成
   */
  getEquipmentBonus() {
    let bonus = { attack: 0, defense: 0, luck: 0 }
    
    Object.values(this.equipment).forEach(item => {
      if (item) {
        bonus.attack += item.attack || 0
        bonus.defense += item.defense || 0
        bonus.luck += item.luck || 0
      }
    })
    
    return bonus
  }

  /**
   * 添加收藏品
   */
  addCollectible(collectible) {
    if (!this.collectibles.find(c => c.id === collectible.id)) {
      this.collectibles.push(collectible)
      return true
    }
    return false
  }

  /**
   * 检查收藏品是否已收集
   */
  hasCollectible(collectibleId) {
    return this.collectibles.some(c => c.id === collectibleId)
  }

  /**
   * 获取收藏品总数
   */
  getCollectibleCount() {
    return this.collectibles.length
  }

  /**
   * 转换为存储对象
   */
  toStorage() {
    return {
      items: this.items,
      equipment: this.equipment,
      collectibles: this.collectibles
    }
  }

  /**
   * 从存储对象创建
   */
  static fromStorage(data) {
    return new Inventory(data)
  }
}

export default Inventory
