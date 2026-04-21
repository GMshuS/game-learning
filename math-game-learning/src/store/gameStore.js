/**
 * 游戏主 Store - 管理游戏全局状态
 */
import { defineStore } from 'pinia'
import storageManager from '../utils/storage'
import Player from '../models/Player'
import GameProgress from '../models/GameProgress'
import Inventory from '../models/Inventory'
import Settings from '../models/Settings'

export const useGameStore = defineStore('game', {
  state: () => ({
    player: null,
    progress: null,
    inventory: null,
    settings: null,
    isLoaded: false,
    currentMode: null // 'adventure' | 'shop' | null
  }),

  getters: {
    // 玩家相关
    playerName: (state) => state.player?.name || '冒险者',
    playerGrade: (state) => state.player?.grade || 1,
    playerLevel: (state) => state.player?.level || 1,
    playerExp: (state) => state.player?.exp || 0,
    playerCoins: (state) => state.player?.coins || 0,

    // 进度相关
    adventureLevel: (state) => state.progress?.adventureLevel || 1,
    shopLevel: (state) => state.progress?.shopLevel || 1,
    unlockedAreas: (state) => state.progress?.unlockedAreas || [],

    // 设置相关
    isSoundOn: (state) => state.settings?.sound ?? true,
    isMusicOn: (state) => state.settings?.music ?? true,
    difficulty: (state) => state.settings?.difficulty || 'normal',

    // 库存相关
    equipment: (state) => state.inventory?.equipment || {},
    items: (state) => state.inventory?.items || []
  },

  actions: {
    /**
     * 初始化游戏 - 从存储加载数据
     */
    async initGame() {
      const gameData = storageManager.loadGame()
      
      if (gameData.player) {
        this.player = gameData.player
        this.progress = gameData.progress
        this.inventory = gameData.inventory
        this.settings = gameData.settings
        this.isLoaded = true
      }
      
      return this.isLoaded
    },

    /**
     * 创建新游戏
     */
    async newGame(playerName, grade = 1) {
      const gameData = storageManager.createNewGame(playerName, grade)
      
      this.player = gameData.player
      this.progress = gameData.progress
      this.inventory = gameData.inventory
      this.settings = gameData.settings
      this.isLoaded = true
      this.currentMode = null
    },

    /**
     * 重置游戏
     */
    async resetGame() {
      storageManager.resetGame()
      this.$reset()
    },

    /**
     * 保存游戏
     */
    async saveGame() {
      if (this.player && this.progress && this.inventory && this.settings) {
        storageManager.saveGame(
          this.player,
          this.progress,
          this.inventory,
          this.settings
        )
      }
    },

    /**
     * 设置当前游戏模式
     */
    setGameMode(mode) {
      this.currentMode = mode
    },

    /**
     * 更新玩家数据
     */
    updatePlayer(updates) {
      if (this.player) {
        Object.assign(this.player, updates)
        this.saveGame()
      }
    },

    /**
     * 增加经验值
     */
    addExp(amount) {
      if (!this.player) return false
      
      // 使用 $patch 确保响应式更新
      const oldExp = this.player.exp
      const oldLevel = this.player.level
      let newExp = oldExp + amount
      let newLevel = oldLevel
      let leveledUp = false
      
      const expNeeded = newLevel * 100
      if (newExp >= expNeeded) {
        newExp -= expNeeded
        newLevel++
        leveledUp = true
      }
      
      this.$patch({
        player: {
          exp: newExp,
          level: newLevel
        }
      })
      
      this.saveGame()
      return leveledUp
    },

    /**
     * 增加金币
     */
    addCoins(amount) {
      if (!this.player) return
      
      // 使用 $patch 确保响应式更新
      this.$patch({
        player: {
          coins: this.player.coins + amount
        }
      })
      
      this.saveGame()
    },

    /**
     * 消费金币
     */
    spendCoins(amount) {
      if (this.player) {
        return this.player.spendCoins(amount)
      }
      return false
    },

    /**
     * 更新游戏进度
     */
    updateProgress(updates) {
      if (this.progress) {
        Object.assign(this.progress, updates)
        this.saveGame()
      }
    },

    /**
     * 完成关卡
     */
    completeLevel(levelId, stars = 1) {
      if (this.progress) {
        this.progress.completeLevel(levelId, stars)
        this.saveGame()
      }
    },

    /**
     * 解锁区域
     */
    unlockArea(areaId) {
      if (this.progress) {
        return this.progress.unlockArea(areaId)
      }
      return false
    },

    /**
     * 更新设置
     */
    updateSettings(updates) {
      if (this.settings) {
        Object.assign(this.settings, updates)
        this.saveGame()
      }
    },

    /**
     * 添加物品到库存
     */
    addItem(item) {
      if (this.inventory) {
        this.inventory.addItem(item)
        this.saveGame()
      }
    },

    /**
     * 从库存移除物品
     */
    removeItem(itemId, quantity = 1) {
      if (this.inventory) {
        return this.inventory.removeItem(itemId, quantity)
      }
      return false
    },

    /**
     * 装备物品
     */
    equipItem(item) {
      if (this.inventory) {
        return this.inventory.equipItem(item)
      }
      return null
    },

    /**
     * 添加收藏品
     */
    addCollectible(collectible) {
      if (this.inventory) {
        return this.inventory.addCollectible(collectible)
      }
      return false
    }
  }
})

export default useGameStore
