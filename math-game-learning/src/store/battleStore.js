/**
 * 战斗 Store - 管理战斗状态
 */
import { defineStore } from 'pinia'
import { BattleState } from '../utils/battle'
import { getRandomMonster } from '../config/monsters'

export const useBattleStore = defineStore('battle', {
  state: () => ({
    inBattle: false,
    player: null,
    monster: null,
    battleState: null,
    streak: 0,
    totalBattles: 0,
    victories: 0,
    defeats: 0,
    currentRewards: { exp: 0, coins: 0 },
    battleHistory: []
  }),

  getters: {
    // 胜率
    winRate: (state) => {
      if (state.totalBattles === 0) return 0
      return Math.round((state.victories / state.totalBattles) * 100)
    },
    
    // 战斗统计
    statistics: (state) => ({
      total: state.totalBattles,
      victories: state.victories,
      defeats: state.defeats,
      winRate: state.winRate,
      currentStreak: state.streak
    })
  },

  actions: {
    /**
     * 开始战斗
     */
    startBattle(player, monster = null, grade = 1) {
      this.player = {
        ...player,
        hp: player.hp || player.maxHp || 100,
        maxHp: player.maxHp || 100
      }
      
      this.monster = monster || getRandomMonster(grade)
      
      this.battleState = new BattleState(this.player, this.monster)
      this.inBattle = true
      this.totalBattles++
      
      return {
        player: this.player,
        monster: this.monster
      }
    },
    
    /**
     * 结束战斗
     */
    endBattle(result, rewards) {
      this.inBattle = false
      this.currentRewards = rewards || { exp: 0, coins: 0 }
      
      if (result === 'victory') {
        this.victories++
        this.battleHistory.push({
          result: 'victory',
          timestamp: new Date().toISOString(),
          monster: this.monster?.name,
          rewards
        })
      } else {
        this.defeats++
        this.streak = 0
        this.battleHistory.push({
          result: result === 'defeat' ? 'defeat' : 'timeout',
          timestamp: new Date().toISOString(),
          monster: this.monster?.name
        })
      }
      
      // 保留最近 10 场战斗记录
      if (this.battleHistory.length > 10) {
        this.battleHistory = this.battleHistory.slice(-10)
      }
      
      return {
        result,
        rewards: this.currentRewards,
        statistics: this.statistics
      }
    },
    
    /**
     * 更新连击
     */
    updateStreak(count) {
      this.streak = count
    },
    
    /**
     * 增加连击
     */
    addStreak() {
      this.streak++
      return this.streak
    },
    
    /**
     * 重置连击
     */
    resetStreak() {
      this.streak = 0
    },
    
    /**
     * 重置战斗状态
     */
    reset() {
      this.inBattle = false
      this.player = null
      this.monster = null
      this.battleState = null
      this.streak = 0
      this.currentRewards = { exp: 0, coins: 0 }
    },
    
    /**
     * 获取战斗历史记录
     */
    getHistory() {
      return this.battleHistory
    }
  }
})

export default useBattleStore
