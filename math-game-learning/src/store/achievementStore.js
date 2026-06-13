/**
 * 成就系统 Store
 */
import { defineStore } from 'pinia'
import { getAllAchievements, getAchievementById, getRarityConfig } from '../config/achievements'

export const useAchievementStore = defineStore('achievement', {
  state: () => ({
    unlocked: [],        // 已解锁的成就 ID
    progress: {},        // 成就进度追踪
    lastLogin: null,     // 上次登录时间
    loginStreak: 0,      // 登录连续天数
    stats: {
      questionsAnswered: 0,
      battles: 0,
      sales: 0,
      coins: 0,
      equipment: 0,
      areasUnlocked: 0,
      currentStreak: 0,
      bestStreak: 0,
      collectibles: 0
    },
    notifications: [],   // 成就解锁通知
    totalRewards: {
      coins: 0,
      exp: 0
    }
  }),

  getters: {
    // 获取已解锁成就数量
    unlockedCount: (state) => state.unlocked.length,
    
    // 获取总成就数量
    totalCount: () => getAllAchievements().length,
    
    // 完成度百分比
    completionRate: (state) => {
      const total = getAllAchievements().length
      return Math.round((state.unlocked.length / total) * 100)
    },
    
    // 获取按分类统计
    achievementsByCategory: () => (category) => {
      return getAllAchievements().filter(a => a.category === category)
    },
    
    // 获取已解锁成就详情
    unlockedAchievements: (state) => {
      return state.unlocked.map(id => getAchievementById(id)).filter(Boolean)
    },
    
    // 获取未解锁成就
    lockedAchievements: (state) => {
      return getAllAchievements().filter(a => !state.unlocked.includes(a.id))
    },
    
    // 获取可解锁成就（进度已达标的）
    availableAchievements: (state) => {
      return state.lockedAchievements.filter(achievement => {
        const req = achievement.requirement
        const current = state.stats[req.type] || state.progress[req.type] || 0
        return current >= req.count
      })
    }
  },

  actions: {
    /**
     * 更新统计数据
     */
    updateStat(type, value) {
      if (type === 'streak') {
        if (value > this.stats.currentStreak) {
          this.stats.currentStreak = value
        }
        if (value > this.stats.bestStreak) {
          this.stats.bestStreak = value
        }
        this.checkAchievements('streak')
      } else if (this.stats.hasOwnProperty(type)) {
        this.stats[type] = (this.stats[type] || 0) + value
        this.checkAchievements(type)
      }
    },

    /**
     * 设置统计数据
     */
    setStat(type, value) {
      if (this.stats.hasOwnProperty(type)) {
        this.stats[type] = value
        this.checkAchievements(type)
      }
    },

    /**
     * 检查成就
     */
    checkAchievements(statType) {
      const achievementsToUnlock = []

      for (const achievement of getAllAchievements()) {
        if (this.unlocked.includes(achievement.id)) continue

        const req = achievement.requirement
        let currentValue

        if (req.type === statType || req.type === 'questions_answered' || req.type === 'battles' || req.type === 'sales') {
          currentValue = this.stats[req.type] || 0
        } else if (req.type === 'streak') {
          currentValue = this.stats.bestStreak
        } else if (req.type === 'coins') {
          currentValue = this.stats.coins
        } else if (req.type === 'equipment') {
          currentValue = this.stats.equipment
        } else if (req.type === 'areas_unlocked') {
          currentValue = this.stats.areasUnlocked
        } else if (req.type === 'collectibles') {
          currentValue = this.stats.collectibles || 0
        } else {
          currentValue = this.progress[req.type] || 0
        }

        if (currentValue >= req.count) {
          achievementsToUnlock.push(achievement)
        }
      }

      // 解锁成就
      for (const achievement of achievementsToUnlock) {
        this.unlockAchievement(achievement)
      }
    },

    /**
     * 解锁成就
     */
    unlockAchievement(achievement) {
      if (this.unlocked.includes(achievement.id)) return

      this.unlocked.push(achievement.id)

      // 添加奖励
      if (achievement.rewards) {
        this.totalRewards.coins += achievement.rewards.coins || 0
        this.totalRewards.exp += achievement.rewards.exp || 0
      }

      // 添加通知
      this.notifications.unshift({
        id: achievement.id,
        name: achievement.name,
        description: achievement.description,
        icon: achievement.icon,
        rarity: achievement.rarity,
        timestamp: new Date().toISOString()
      })

      // 限制通知数量
      if (this.notifications.length > 10) {
        this.notifications = this.notifications.slice(0, 10)
      }
    },

    /**
     * 清除通知
     */
    clearNotification(index) {
      this.notifications.splice(index, 1)
    },

    /**
     * 清除所有通知
     */
    clearAllNotifications() {
      this.notifications = []
    },

    /**
     * 更新登录信息
     */
    updateLogin() {
      const today = new Date().toDateString()
      const lastLogin = this.lastLogin ? new Date(this.lastLogin).toDateString() : null

      if (lastLogin !== today) {
        // 检查连续登录
        const yesterday = new Date()
        yesterday.setDate(yesterday.getDate() - 1)

        if (lastLogin === yesterday.toDateString()) {
          this.loginStreak++
        } else {
          this.loginStreak = 1
        }

        this.lastLogin = new Date().toISOString()

        // 检查登录成就
        this.checkAchievements('login')
        this.checkAchievements('login_streak')
      }

      // 检查初次登录成就
      if (!this.unlocked.includes('first_login')) {
        this.unlockAchievement(getAchievementById('first_login'))
      }
    },

    /**
     * 重置成就系统
     */
    reset() {
      this.unlocked = []
      this.progress = {}
      this.lastLogin = null
      this.loginStreak = 0
      this.stats = {
        questionsAnswered: 0,
        battles: 0,
        sales: 0,
        coins: 0,
        equipment: 0,
        areasUnlocked: 0,
        currentStreak: 0,
        bestStreak: 0,
        collectibles: 0
      }
      this.notifications = []
      this.totalRewards = {
        coins: 0,
        exp: 0
      }
    },

    /**
     * 获取成就详情
     */
    getAchievementProgress(achievementId) {
      const achievement = getAchievementById(achievementId)
      if (!achievement) return null

      const req = achievement.requirement
      const current = this.stats[req.type] || this.progress[req.type] || 0
      const isUnlocked = this.unlocked.includes(achievementId)

      return {
        ...achievement,
        current,
        required: req.count,
        progress: Math.min(100, Math.round((current / req.count) * 100)),
        isUnlocked
      }
    }
  }
})

export default useAchievementStore
