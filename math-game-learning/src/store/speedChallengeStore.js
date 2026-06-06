/**
 * 速算竞技场 Store
 */
import { defineStore } from 'pinia'
import { useGameStore } from './gameStore'
import { useSettingsStore } from './settingsStore'
import { getGameConfig } from '../utils/gameContext'
import { speedChallengeConfig } from '../config/speedChallenge'

export const useSpeedChallengeStore = defineStore('speedChallenge', {
  state: () => ({
    currentMode: null, // 'base' | 'blitz' | 'survival'
    isPlaying: false,
    timeLeft: 0,
    score: 0,
    combo: 0,
    maxCombo: 0,
    correctCount: 0,
    wrongCount: 0,
    lives: 3,
    aiProgress: 0, // 闪电模式 AI 进度
    currentQuestion: null,
    difficultyScale: null,
    gameResult: null // 结算数据
  }),

  getters: {
    comboMultiplier: (state) => 1 + state.combo * speedChallengeConfig.modes[state.currentMode]?.comboBonus || 0,
    modeConfig: (state) => speedChallengeConfig.modes[state.currentMode] || null
  },

  actions: {
    /**
     * 开始游戏
     */
    startGame(mode) {
      const config = speedChallengeConfig.modes[mode]
      if (!config) return false

      const settingsStore = useSettingsStore()
      const gameConfig = getGameConfig(settingsStore.grade, settingsStore.difficulty)
      this.difficultyScale = gameConfig.scale

      this.currentMode = mode
      this.isPlaying = true
      this.score = 0
      this.combo = 0
      this.maxCombo = 0
      this.correctCount = 0
      this.wrongCount = 0
      this.aiProgress = 0
      this.gameResult = null

      if (mode === 'base') {
        this.timeLeft = config.duration
      } else if (mode === 'blitz') {
        this.timeLeft = config.duration
        this.resetAI()
      } else if (mode === 'survival') {
        this.lives = config.lives + (this.difficultyScale?.speedLivesBonus || 0)
        this.timeLeft = 0 // 生存模式无倒计时
      }

      this.generateQuestion()
      return true
    },

    /**
     * 生成题目（年级适配）
     */
    generateQuestion() {
      const settingsStore = useSettingsStore()
      const grade = settingsStore.grade
      const gradeCfg = speedChallengeConfig.gradeConfig[grade] || speedChallengeConfig.gradeConfig[1]

      const op = gradeCfg.operations[Math.floor(Math.random() * gradeCfg.operations.length)]
      let a, b, answer

      switch (op) {
        case '+':
          a = Math.floor(Math.random() * gradeCfg.maxNum) + 1
          b = Math.floor(Math.random() * (gradeCfg.maxNum - a)) + 1
          answer = a + b
          break
        case '-':
          a = Math.floor(Math.random() * gradeCfg.maxNum) + 1
          b = Math.floor(Math.random() * a) + 1
          answer = a - b
          break
        case '×':
          a = Math.floor(Math.random() * Math.min(gradeCfg.maxNum / 10, 12)) + 1
          b = Math.floor(Math.random() * 10) + 1
          answer = a * b
          break
        case '÷':
          b = Math.floor(Math.random() * 10) + 1
          answer = Math.floor(Math.random() * Math.min(gradeCfg.maxNum / 10, 12)) + 1
          a = b * answer
          break
      }

      // 生成选项
      const options = this.generateOptions(answer)
      this.currentQuestion = { a, b, op, answer, options }
    },

    /**
     * 生成选项
     */
    generateOptions(correct) {
      const options = new Set([correct])
      while (options.size < 4) {
        const offset = Math.floor(Math.random() * 10) - 5
        const val = correct + offset
        if (val >= 0 && val !== correct) options.add(val)
      }
      return [...options].sort(() => Math.random() - 0.5)
    },

    /**
     * 答题
     */
    answer(selected) {
      if (!this.isPlaying || !this.currentQuestion) return false

      const isCorrect = selected === this.currentQuestion.answer

      if (isCorrect) {
        this.correctCount++
        this.combo++
        if (this.combo > this.maxCombo) this.maxCombo = this.combo

        const basePoints = this.modeConfig.pointsPerCorrect
        const points = Math.floor(basePoints * this.comboMultiplier)
        this.score += points

        // 闪电模式 AI 进度
        if (this.currentMode === 'blitz') {
          this.updateAI()
        }
      } else {
        this.wrongCount++
        this.combo = 0

        if (this.currentMode === 'survival') {
          this.lives--
          if (this.lives <= 0) {
            this.endGame()
            return true
          }
        }
      }

      this.generateQuestion()
      return isCorrect
    },

    /**
     * 更新 AI 进度（闪电模式）
     */
    updateAI() {
      const config = this.modeConfig
      const aiTime = config.aiAnswerTime.min + Math.random() * (config.aiAnswerTime.max - config.aiAnswerTime.min)
      const aiSpeed = 1000 / aiTime // 每秒答题数
      const speedRatio = this.difficultyScale?.speedAISpeedRatio || 1.0
      this.aiProgress += aiSpeed * 0.5 * speedRatio // 玩家每次答题 AI 也前进
    },

    /**
     * 重置 AI
     */
    resetAI() {
      this.aiProgress = 0
    },

    /**
     * 计时器滴答
     */
    tick() {
      if (!this.isPlaying) return

      if (this.currentMode === 'base' || this.currentMode === 'blitz') {
        this.timeLeft--
        if (this.timeLeft <= 0) {
          this.endGame()
        }
        // 闪电模式 AI 也随时间前进
        if (this.currentMode === 'blitz') {
          const speedRatio = this.difficultyScale?.speedAISpeedRatio || 1.0
          this.aiProgress += 0.3 * speedRatio
          if (this.aiProgress >= 100) {
            this.endGame()
          }
        }
      }
    },

    /**
     * 结束游戏
     */
    endGame() {
      this.isPlaying = false

      let coins = Math.floor(this.score * speedChallengeConfig.rewards.coinsPerPoint)
      if (this.difficultyScale) {
        coins = Math.floor(coins * this.difficultyScale.coinRatio)
      }
      let gems = 0
      for (const threshold of speedChallengeConfig.rewards.gemThresholds) {
        if (this.score >= threshold.score) gems = threshold.gems
      }

      // 评级
      let rating = 'D'
      for (const r of speedChallengeConfig.ratings) {
        if (this.score >= r.minScore) rating = r.rating
      }

      this.gameResult = {
        score: this.score,
        rating,
        coins,
        gems,
        correct: this.correctCount,
        wrong: this.wrongCount,
        maxCombo: this.maxCombo,
        aiWon: this.currentMode === 'blitz' && this.aiProgress >= 100
      }

      // 更新最佳成绩
      const gameStore = useGameStore()
      const modeKey = this.currentMode === 'base' ? 'base' : this.currentMode
      const currentBest = gameStore.speedChallenge?.bestScores?.[modeKey]
      if (!currentBest || this.score > currentBest.score) {
        if (!gameStore.speedChallenge) gameStore.speedChallenge = gameStore.getDefaultSpeedChallenge()
        gameStore.speedChallenge.bestScores[modeKey] = {
          score: this.score,
          rating,
          date: Date.now()
        }
      }
      gameStore.speedChallenge.totalGames = (gameStore.speedChallenge.totalGames || 0) + 1
      gameStore.speedChallenge.totalCorrect = (gameStore.speedChallenge.totalCorrect || 0) + this.correctCount

      // 发放奖励
      gameStore.addCoins(coins)
      if (gems > 0) gameStore.addGems(gems)
      gameStore.saveGame()
    }
  }
})

export default useSpeedChallengeStore
