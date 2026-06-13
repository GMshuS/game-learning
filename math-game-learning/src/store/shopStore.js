/**
 * 商店管理 Store（重构版）
 * 经营模拟已删除，重构为「顾客出题/答题」的轻度数学购物流程
 */
import { defineStore } from 'pinia'
import { shopConfig, getProductById } from '../config/shop'
import { customerConfig, getRandomDialogue } from '../config/customers'
import { useGameStore } from './gameStore'
import { useInventoryStore } from './inventoryStore'

export const useShopStore = defineStore('shop', {
  state: () => ({
    // 当前顾客信息（单顾客，非队列）
    customerQueue: null,
    // 当前应用题
    currentProblem: null,
    // 是否处于出题答题状态
    isProblemActive: false
  }),

  getters: {
    /**
     * 金币统一从 gameStore 读取
     */
    coins: () => {
      const gameStore = useGameStore()
      return gameStore.playerCoins
    }
  },

  actions: {
    /**
     * 生成一位顾客（带购物清单）
     * @param {number} grade - 年级（1-6），影响商品选择的难度范围
     */
    generateCustomer(grade = 2) {
      // 清理可能残留的高年级找零字段
      this._paidAmount = null
      this._change = null
      // 随机选择顾客类型
      const types = customerConfig.types
      const rand = Math.random()
      let cumulative = 0
      let selectedType = types[0]

      for (const type of types) {
        cumulative += type.frequency
        if (rand <= cumulative) {
          selectedType = type
          break
        }
      }

      // 随机选择 1~3 种商品
      const productCount = Math.floor(Math.random() * 3) + 1
      const items = []
      const usedIndices = new Set()

      for (let i = 0; i < productCount; i++) {
        let idx
        do {
          idx = Math.floor(Math.random() * shopConfig.products.length)
        } while (usedIndices.has(idx))
        usedIndices.add(idx)

        const product = shopConfig.products[idx]
        const quantity = Math.floor(Math.random() * 5) + 1 // 1~5 个
        items.push({ product, quantity })
      }

      // 生成对话
      const dialogue = `${selectedType.icon} ${selectedType.name}：${getRandomDialogue('greeting')}我想买东西。`

      this.customerQueue = {
        type: selectedType,
        items,
        dialogue
      }

      // 生成对应的应用题
      this.generateShopProblem(grade)
      this.isProblemActive = true
    },

    /**
     * 按年级生成应用题
     * 低年级(1-2)：单种 price×qty
     * 中年级(3-4)：两种之和
     * 高年级(5-6)：两种之和 + 找零（分步）
     * @param {number} grade - 年级（1-6）
     */
    generateShopProblem(grade) {
      if (!this.customerQueue || this.customerQueue.items.length === 0) return

      const items = this.customerQueue.items

      // 计算总价
      const totalCost = items.reduce((sum, item) => {
        return sum + item.product.sellPrice * item.quantity
      }, 0)

      // 动态拼接公式：将所有商品项用 + 连接
      const formulaParts = items.map(item =>
        `${item.product.icon}${item.product.name}×${item.quantity}（${item.product.sellPrice}元/个）`
      )
      const formulaStr = formulaParts.join(' + ')

      let questionText = ''
      let answer = totalCost

      if (grade <= 2) {
        // 低年级：单种商品单价×数量
        questionText = `📋 请计算总价：${formulaStr} = ?`
      } else if (grade <= 4) {
        // 中年级：多种商品之和
        questionText = `📋 请计算总价：${formulaStr} = ?`
      } else {
        // 高年级：多种之和 + 找零（分步）
        const paidAmount = Math.ceil(totalCost / 10) * 10 + 10 // 支付金额（向上取整到十位+10）
        const change = paidAmount - totalCost
        questionText = `📋 第一步：计算总价。${formulaStr} = ?`
        // 高年级存储额外找零信息
        this._paidAmount = paidAmount
        this._change = change
      }

      this.currentProblem = {
        questionText,
        answer,
        totalCost
      }
    },

    /**
     * 验证用户答案
     * @param {number} userAnswer - 用户输入的答案
     * @param {object} options - 可选参数
     * @param {boolean} options.isChangeStep - 是否为找零计算步骤（高年级）
     * @returns {object} { correct, message, reward? }
     */
    checkAnswer(userAnswer, options = {}) {
      if (!this.currentProblem) {
        return { correct: false, message: '没有活跃的题目' }
      }

      const parsed = Number(userAnswer)
      if (isNaN(parsed)) {
        return { correct: false, message: '请输入有效数字' }
      }

      // 高年级找零步骤
      if (options.isChangeStep) {
        const correctChange = this._change
        if (parsed === correctChange) {
          return {
            correct: true,
            message: `✅ 找零正确！顾客满意离开。`,
            reward: this._giveReward()
          }
        }
        return { correct: false, message: `❌ 找零计算错误，正确答案是 ${correctChange} 元` }
      }

      // 常规答案验证
      if (parsed === this.currentProblem.answer) {
        let message = `✅ 总价计算正确！共 ${this.currentProblem.totalCost} 元。`

        // 高年级：进入找零步骤
        if (this._paidAmount) {
          this.currentProblem.questionText = `📋 第二步：找零。顾客给了 ${this._paidAmount} 元，总价 ${this.currentProblem.totalCost} 元，应该找零多少？`
          message = `✅ 总价计算正确！共 ${this.currentProblem.totalCost} 元。现在计算找零：顾客给了 ${this._paidAmount} 元。`
          return {
            correct: true,
            message,
            isChangeStep: true, // 标记需要进入找零步骤
            paidAmount: this._paidAmount,
            change: this._change
          }
        }

        // 低中年级：直接给奖励
        return {
          correct: true,
          message: `✅ 正确！顾客满意离开。`,
          reward: this._giveReward()
        }
      }

      return {
        correct: false,
        message: `❌ 答案不正确，正确答案是 ${this.currentProblem.answer}`
      }
    },

    /**
     * 答对后的奖励发放
     * @returns {object} { coins, items }
     */
    _giveReward() {
      if (!this.customerQueue) return { coins: 0, items: [] }

      const gameStore = useGameStore()
      const inventoryStore = useInventoryStore()
      const items = this.customerQueue.items
      let totalCoins = 0
      const addedItems = []

      // 根据购物清单发放奖励：消耗金币成本，获得物品
      for (const item of items) {
        const cost = item.product.costPrice * item.quantity
        totalCoins += cost
        // 添加物品到背包
        inventoryStore.addItem(item.product, item.quantity)
        addedItems.push({
          productId: item.product.id,
          name: item.product.name,
          icon: item.product.icon,
          quantity: item.quantity
        })
      }

      // 扣除金币（从 gameStore）
      const coinCost = Math.max(1, Math.floor(totalCoins * 0.5)) // 半价购买
      gameStore.spendCoins(coinCost)

      return { coins: coinCost, items: addedItems }
    },

    /**
     * 清空当前顾客和相关题目
     */
    clearCustomer() {
      this.customerQueue = null
      this.currentProblem = null
      this.isProblemActive = false
      this._paidAmount = null
      this._change = null
    },

    /**
     * 重置商店状态
     */
    reset() {
      this.clearCustomer()
    }
  }
})

export default useShopStore
