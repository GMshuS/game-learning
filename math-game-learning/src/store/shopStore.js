/**
 * 商店管理 Store
 */
import { defineStore } from 'pinia'
import { shopConfig, getProductById } from '../config/shop'
import { generateCustomer } from '../config/customers'
import { useSettingsStore } from './settingsStore'
import { getGameConfig } from '../utils/gameContext'

export const useShopStore = defineStore('shop', {
  state: () => ({
    level: 1,
    exp: 0,
    coins: 500,
    inventory: [],
    customers: [],
    upgrades: [],
    dailyStats: {
      sales: 0,
      revenue: 0,
      customersServed: 0
    },
    isRunning: false,
    customerSpawnRate: 5000 // 毫秒
  }),

  getters: {
    // 获取所有商品库存
    getInventory: (state) => {
      return state.inventory
    },
    
    // 获取指定商品库存
    getProductStock: (state) => (productId) => {
      const item = state.inventory.find(i => i.productId === productId)
      return item ? item.quantity : 0
    },
    
    // 计算总价值
    getTotalValue: (state) => {
      const inventoryValue = state.inventory.reduce((sum, item) => {
        const product = getProductById(item.productId)
        return sum + (product?.costPrice || 0) * item.quantity
      }, 0)
      return state.coins + inventoryValue
    }
  },

  actions: {
    /**
     * 开始营业
     */
    startBusiness() {
      this.isRunning = true
    },
    
    /**
     * 停止营业
     */
    stopBusiness() {
      this.isRunning = false
      this.customers = []
    },
    
    /**
     * 生成顾客
     */
    spawnCustomer() {
      if (this.customers.length < 5) {
        const customer = generateCustomer()
        this.customers.push(customer)
      }
    },
    
    /**
     * 更新顾客耐心
     */
    updateCustomerPatience(deltaTime) {
      this.customers.forEach(customer => {
        if (customer.status === 'waiting') {
          customer.currentPatience -= deltaTime / 1000
          if (customer.currentPatience <= 0) {
            customer.status = 'leaving'
          }
        }
      })
      
      // 清理离开的顾客
      this.customers = this.customers.filter(c => c.status !== 'leaving')
    },
    
    /**
     * 进货
     */
    restock(productId, quantity) {
      const product = getProductById(productId)
      if (!product) return false
      
      const cost = product.costPrice * quantity
      
      if (this.coins >= cost) {
        const existing = this.inventory.find(i => i.productId === productId)
        if (existing) {
          existing.quantity += quantity
        } else {
          this.inventory.push({
            productId,
            quantity,
            costPrice: product.costPrice
          })
        }
        
        this.coins -= cost
        return true
      }
      return false
    },
    
    /**
     * 销售商品
     */
    sell(productId, quantity) {
      const index = this.inventory.findIndex(i => i.productId === productId)
      if (index === -1) return false
      
      const item = this.inventory[index]
      if (item.quantity < quantity) return false
      
      const product = getProductById(productId)
      const settingsStore = useSettingsStore()
      const gameConfig = getGameConfig(settingsStore.grade, settingsStore.difficulty)
      const coinRatio = gameConfig.scale.coinRatio || 1.0
      const revenue = Math.floor(product.sellPrice * quantity * coinRatio)

      item.quantity -= quantity
      if (item.quantity === 0) {
        this.inventory.splice(index, 1)
      }

      this.coins += revenue
      this.dailyStats.sales++
      this.dailyStats.revenue += revenue
      
      // 获得商店经验
      this.addExp(quantity * 5)
      
      return {
        revenue,
        exp: quantity * 5
      }
    },
    
    /**
     * 服务顾客
     */
    serveCustomer(customerId) {
      const customer = this.customers.find(c => c.id === customerId)
      if (!customer) return false
      
      // 检查库存是否足够
      for (const item of customer.products) {
        const stock = this.getProductStock(item.product.id)
        if (stock < item.quantity * customer.total) {
          return false
        }
      }
      
      customer.status = 'being_served'
      return true
    },
    
    /**
     * 结账
     */
    checkout(customerId) {
      const customer = this.customers.find(c => c.id === customerId)
      if (!customer || customer.status !== 'being_served') return false
      
      // 扣除库存
      for (const item of customer.products) {
        for (let i = 0; i < item.quantity; i++) {
          this.sell(item.product.id, 1)
        }
      }

      const settingsStore = useSettingsStore()
      const gameConfig = getGameConfig(settingsStore.grade, settingsStore.difficulty)
      const coinRatio = gameConfig.scale.coinRatio || 1.0
      this.dailyStats.customersServed++
      
      // 移除顾客
      this.customers = this.customers.filter(c => c.id !== customerId)
      
      return {
        revenue: Math.floor(customer.total * coinRatio),
        satisfied: true
      }
    },
    
    /**
     * 添加商店经验
     */
    addExp(amount) {
      this.exp += amount
      const expNeeded = this.level * 200
      
      if (this.exp >= expNeeded) {
        this.exp -= expNeeded
        this.levelUp()
        return true
      }
      return false
    },
    
    /**
     * 商店升级
     */
    levelUp() {
      this.level++
      this.customerSpawnRate = Math.max(2000, this.customerSpawnRate - 500)
      return {
        level: this.level,
        newSpawnRate: this.customerSpawnRate
      }
    },
    
    /**
     * 购买升级
     */
    buyUpgrade(upgrade) {
      if (this.coins >= upgrade.cost) {
        this.coins -= upgrade.cost
        this.upgrades.push(upgrade)
        
        // 应用升级效果
        // TODO: 实现库存上限扩容逻辑 — 可通过新增 state.maxStock 并在 restock 中检查
        if (upgrade.maxStockBonus) {
          // 增加最大库存
        }
        // TODO: 实现顾客吸引率加成 — 提高 spawnCustomer 频率或增加队列上限
        if (upgrade.customerAttractionBonus) {
          // 增加顾客吸引率
        }
        // TODO: 实现结账速度加成 — 减少 customerPatience 衰减速率
        if (upgrade.checkoutSpeedBonus) {
          // 增加结账速度
        }
        
        return true
      }
      return false
    },
    
    /**
     * 重置每日统计
     */
    resetDailyStats() {
      this.dailyStats = {
        sales: 0,
        revenue: 0,
        customersServed: 0
      }
    },
    
    /**
     * 重置商店
     */
    reset() {
      this.level = 1
      this.exp = 0
      this.coins = 500
      this.inventory = []
      this.customers = []
      this.upgrades = []
      this.dailyStats = {
        sales: 0,
        revenue: 0,
        customersServed: 0
      }
      this.isRunning = false
      this.customerSpawnRate = 5000
    }
  }
})

export default useShopStore
