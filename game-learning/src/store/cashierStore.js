/**
 * 收银游戏 Store
 */
import { defineStore } from 'pinia';
import { useSettingsStore } from './settingsStore';
import { getGameConfig } from '../utils/gameContext';

export const useCashierStore = defineStore('cashier', {
  state: () => ({
    gamesPlayed: 0,
    gamesWon: 0,
    bestStreak: 0,
    currentStreak: 0,
    totalEarnings: 0,
    lastResults: [],
    highScores: {
      easy: 0,
      medium: 0,
      hard: 0
    }
  }),

  getters: {
    // 胜率
    winRate: (state) => {
      if (state.gamesPlayed === 0) return 0;
      return Math.round((state.gamesWon / state.gamesPlayed) * 100);
    },
    
    // 平均评分
    averageStars: (state) => {
      const validResults = state.lastResults.filter(r => r.stars);
      if (validResults.length === 0) return 0;
      const total = validResults.reduce((sum, r) => sum + r.stars, 0);
      return (total / validResults.length).toFixed(1);
    }
  },

  actions: {
    /**
     * 记录游戏结果
     */
    recordResult(result) {
      const settingsStore = useSettingsStore();
      const gameConfig = getGameConfig(settingsStore.grade, settingsStore.difficulty);
      const coinRatio = gameConfig.scale.coinRatio || 1.0;
      const cashierDifficulty = settingsStore.difficulty === 'normal' ? 'medium' : settingsStore.difficulty;

      this.gamesPlayed++;
      
      if (result.status === 'success') {
        this.gamesWon++;
        this.currentStreak++;
        
        if (this.currentStreak > this.bestStreak) {
          this.bestStreak = this.currentStreak;
        }
        
        // 计算得分（应用难度倍率）
        const score = this.calculateScore(result);
        const adjustedScore = Math.floor(score * coinRatio);
        
        // 更新最高分
        if (adjustedScore > this.highScores[cashierDifficulty]) {
          this.highScores[cashierDifficulty] = adjustedScore;
        }
        
        // 增加收益（带难度倍率）
        this.totalEarnings += Math.floor(result.stars * 10 * coinRatio);
      } else {
        this.currentStreak = 0;
      }
      
      // 记录最近结果
      this.lastResults.unshift({
        ...result,
        timestamp: new Date().toISOString()
      });
      
      // 只保留最近 10 场
      if (this.lastResults.length > 10) {
        this.lastResults = this.lastResults.slice(0, 10);
      }
    },
    
    /**
     * 计算得分
     */
    calculateScore(result) {
      const baseScore = 100;
      
      // 星级奖励
      const starBonus = result.stars * 50;
      
      // 时间奖励（用时越短奖励越高，满分 120 秒内完成）
      const MAX_TIME = 120;
      const timeBonus = Math.floor(Math.max(0, MAX_TIME - result.timeUsed) * 2);
      
      // 连击奖励
      const streakBonus = this.currentStreak * 10;
      
      return baseScore + starBonus + timeBonus + streakBonus;
    },
    
    /**
     * 设置难度
     */
    setDifficulty(difficulty) {
      const settingsStore = useSettingsStore();
      const mappedDifficulty = difficulty === 'medium' ? 'normal' : difficulty;
      if (['easy', 'normal', 'hard'].includes(mappedDifficulty)) {
        settingsStore.setDifficulty(mappedDifficulty);
      }
    },
    
    /**
     * 重置统计
     */
    reset() {
      this.gamesPlayed = 0;
      this.gamesWon = 0;
      this.bestStreak = 0;
      this.currentStreak = 0;
      this.totalEarnings = 0;
      this.lastResults = [];
      this.highScores = {
        easy: 0,
        medium: 0,
        hard: 0
      };
    }
  }
});

export default useCashierStore;
