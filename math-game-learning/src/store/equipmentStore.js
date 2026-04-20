/**
 * 装备管理 Store
 */
import { defineStore } from 'pinia'
import { getEquipmentById } from '../config/equipment'

export const useEquipmentStore = defineStore('equipment', {
  state: () => ({
    equipped: {
      weapon: null,
      armor: null,
      accessory: null
    },
    inventory: [],
    totalBonus: {
      attack: 0,
      defense: 0,
      luck: 0
    }
  }),

  getters: {
    // 获取总属性加成
    getTotalBonus: (state) => {
      let bonus = { attack: 0, defense: 0, luck: 0 }
      
      Object.values(state.equipped).forEach(itemId => {
        if (itemId) {
          const item = getEquipmentById(itemId)
          if (item) {
            bonus.attack += item.attack || 0
            bonus.defense += item.defense || 0
            bonus.luck += item.luck || 0
          }
        }
      })
      
      return bonus
    },
    
    // 获取当前装备的物品详情
    getEquippedItems: (state) => {
      const items = {}
      
      Object.entries(state.equipped).forEach(([slot, itemId]) => {
        if (itemId) {
          items[slot] = getEquipmentById(itemId)
        } else {
          items[slot] = null
        }
      })
      
      return items
    },
    
    // 检查是否有某物品
    hasItem: (state) => (itemId) => {
      return state.inventory.some(item => item.id === itemId)
    }
  },

  actions: {
    /**
     * 装备物品
     */
    equipItem(slot, itemId) {
      if (!['weapon', 'armor', 'accessory'].includes(slot)) {
        return false
      }
      
      if (!this.hasItem(itemId)) {
        return false
      }
      
      const item = getEquipmentById(itemId)
      if (!item || item.type !== slot) {
        return false
      }
      
      // 卸下当前装备
      const oldItemId = this.equipped[slot]
      
      // 装备新物品
      this.equipped[slot] = itemId
      
      // 更新总加成
      this.updateTotalBonus()
      
      return {
        slot,
        newItem: item,
        oldItemId
      }
    },
    
    /**
     * 卸下装备
     */
    unequipItem(slot) {
      if (!['weapon', 'armor', 'accessory'].includes(slot)) {
        return null
      }
      
      const itemId = this.equipped[slot]
      if (!itemId) {
        return null
      }
      
      const item = getEquipmentById(itemId)
      this.equipped[slot] = null
      
      this.updateTotalBonus()
      
      return item
    },
    
    /**
     * 添加物品到库存
     */
    addItemToInventory(item) {
      const existing = this.inventory.find(i => i.id === item.id)
      if (existing) {
        existing.quantity = (existing.quantity || 1) + 1
      } else {
        this.inventory.push({ ...item, quantity: 1 })
      }
    },
    
    /**
     * 从库存移除物品
     */
    removeItemFromInventory(itemId, quantity = 1) {
      const index = this.inventory.findIndex(i => i.id === itemId)
      if (index === -1) {
        return false
      }
      
      const item = this.inventory[index]
      if ((item.quantity || 1) <= quantity) {
        this.inventory.splice(index, 1)
      } else {
        item.quantity -= quantity
      }
      
      return true
    },
    
    /**
     * 更新总加成
     */
    updateTotalBonus() {
      let bonus = { attack: 0, defense: 0, luck: 0 }
      
      Object.values(this.equipped).forEach(itemId => {
        if (itemId) {
          const item = getEquipmentById(itemId)
          if (item) {
            bonus.attack += item.attack || 0
            bonus.defense += item.defense || 0
            bonus.luck += item.luck || 0
          }
        }
      })
      
      this.totalBonus = bonus
    },
    
    /**
     * 重置装备
     */
    reset() {
      this.equipped = {
        weapon: null,
        armor: null,
        accessory: null
      }
      this.inventory = []
      this.totalBonus = { attack: 0, defense: 0, luck: 0 }
    }
  }
})

export default useEquipmentStore
