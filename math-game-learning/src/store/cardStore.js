/**
 * 卡牌对战 Store
 */
import { defineStore } from 'pinia'
import { useGameStore } from './gameStore'
import { cards, rarityConfig, packConfig, getCardById, getCardsByGrade } from '../config/cards'

export const useCardStore = defineStore('card', {
  state: () => ({
    collection: [], // { cardId, quantity }
    deck: [], // cardId[]
    // 对战状态
    battle: null // { playerHP, aiHP, playerHand, aiHand, playerDeck, aiDeck, turn, phase }
  }),

  getters: {
    collectionCount: (state) => state.collection.reduce((sum, c) => sum + c.quantity, 0),
    hasCard: (state) => (cardId) => state.collection.some(c => c.cardId === cardId && c.quantity > 0),
    deckValid: (state) => state.deck.length >= 10 && state.deck.length <= 15
  },

  actions: {
    /**
     * 从存档加载
     */
    loadData(data) {
      if (data) {
        this.collection = data.collection || []
        this.deck = data.deck || []
      }
    },

    /**
     * 获取存档数据
     */
    getSaveData() {
      return { collection: this.collection, deck: this.deck }
    },

    /**
     * 开卡包
     */
    openPack(packType) {
      const pack = packConfig[packType]
      if (!pack) return []

      const gameStore = useGameStore()
      if (pack.currency === 'gems') {
        if (!gameStore.spendGems(pack.price)) return []
      } else {
        if (!gameStore.spendCoins(pack.price)) return []
      }

      const grade = gameStore.playerGrade || 1
      const gradeCards = getCardsByGrade(grade)
      const results = []

      for (let i = 0; i < 5; i++) {
        const card = this.rollCard(pack.weights, gradeCards)
        if (card) {
          this.addCardToCollection(card.id)
          results.push({ card, isNew: !this.hasCard(card.id) })
        }
      }

      gameStore.saveGame()
      return results
    },

    /**
     * 随机抽取卡牌
     */
    rollCard(weights, gradeCards) {
      const total = Object.values(weights).reduce((a, b) => a + b, 0)
      let rand = Math.random() * total
      let selectedRarity = 'common'

      for (const [rarity, weight] of Object.entries(weights)) {
        rand -= weight
        if (rand <= 0) { selectedRarity = rarity; break }
      }

      const candidates = gradeCards.filter(c => c.rarity === selectedRarity)
      if (candidates.length === 0) {
        // 降级
        const fallback = gradeCards.filter(c => rarityConfig[c.rarity].packWeight > 0)
        return fallback[Math.floor(Math.random() * fallback.length)] || null
      }
      return candidates[Math.floor(Math.random() * candidates.length)]
    },

    /**
     * 添加到收藏
     */
    addCardToCollection(cardId) {
      const existing = this.collection.find(c => c.cardId === cardId)
      if (existing) {
        existing.quantity++
        // 重复卡转化为金币
        const card = getCardById(cardId)
        if (card && existing.quantity > 1) {
          const gameStore = useGameStore()
          gameStore.addCoins(rarityConfig[card.rarity].duplicateCoins)
        }
      } else {
        this.collection.push({ cardId, quantity: 1 })
      }
    },

    /**
     * 加入卡组
     */
    addToDeck(cardId) {
      if (this.deck.length >= 15) return false
      if (this.deck.includes(cardId)) return false
      if (!this.hasCard(cardId)) return false
      this.deck.push(cardId)
      return true
    },

    /**
     * 从卡组移除
     */
    removeFromDeck(cardId) {
      const idx = this.deck.indexOf(cardId)
      if (idx >= 0) {
        this.deck.splice(idx, 1)
        return true
      }
      return false
    },

    /**
     * 开始对战
     */
    startBattle(difficulty = 'normal') {
      if (!this.deckValid) return false

      const playerDeck = [...this.deck]
      const aiDeck = this.generateAIDeck()

      this.battle = {
        difficulty,
        playerHP: 30,
        aiHP: 30,
        playerMaxHP: 30,
        aiMaxHP: 30,
        playerHand: [],
        aiHand: [],
        playerDeck: this.shuffle(playerDeck),
        aiDeck: this.shuffle(aiDeck),
        turn: 'player',
        phase: 'draw', // draw -> play -> answer -> effect
        playedCard: null,
        equationAnswer: null,
        log: [],
        winner: null
      }

      // 初始抽牌
      for (let i = 0; i < 3; i++) {
        this.drawCard('player')
        this.drawCard('ai')
      }

      this.battle.phase = 'play'
      return true
    },

    /**
     * 生成 AI 卡组
     */
    generateAIDeck() {
      const aiCards = []
      const available = cards.filter(c => c.type === 'attack' || c.type === 'defense' || c.type === 'heal')
      while (aiCards.length < 15) {
        const card = available[Math.floor(Math.random() * available.length)]
        if (!aiCards.includes(card.id)) aiCards.push(card.id)
      }
      return aiCards
    },

    /**
     * 抽牌
     */
    drawCard(who) {
      const deckKey = who === 'player' ? 'playerDeck' : 'aiDeck'
      const handKey = who === 'player' ? 'playerHand' : 'aiHand'

      if (this.battle[deckKey].length > 0 && this.battle[handKey].length < 5) {
        const cardId = this.battle[deckKey].pop()
        this.battle[handKey].push(cardId)
      }
    },

    /**
     * 出牌
     */
    playCard(handIndex) {
      if (this.battle.turn !== 'player' || this.battle.phase !== 'play') return false

      const cardId = this.battle.playerHand[handIndex]
      const card = getCardById(cardId)
      if (!card) return false

      this.battle.playerHand.splice(handIndex, 1)
      this.battle.playedCard = cardId

      // 方程卡需要答题
      if (card.type === 'equation') {
        this.battle.phase = 'answer'
        this.battle.equationAnswer = card.answer
        return true
      }

      this.resolveEffect(card)
      return true
    },

    /**
     * 答题（方程卡）
     */
    answerEquation(answer) {
      if (this.battle.phase !== 'answer') return false

      const card = getCardById(this.battle.playedCard)
      if (answer === this.battle.equationAnswer) {
        this.resolveEffect(card)
      } else {
        this.battle.log.push('方程答错，卡牌无效！')
        this.endTurn()
      }
      return true
    },

    /**
     * 结算效果
     */
    resolveEffect(card) {
      switch (card.type) {
        case 'attack':
          this.battle.aiHP = Math.max(0, this.battle.aiHP - card.value)
          this.battle.log.push(`使用 ${card.name}，造成 ${card.value} 点伤害`)
          break
        case 'defense':
          this.battle.playerHP = Math.min(this.battle.playerMaxHP, this.battle.playerHP + card.value)
          this.battle.log.push(`使用 ${card.name}，抵挡 ${card.value} 点伤害`)
          break
        case 'heal':
          this.battle.playerHP = Math.min(this.battle.playerMaxHP, this.battle.playerHP + card.value)
          this.battle.log.push(`使用 ${card.name}，回复 ${card.value} 点HP`)
          break
        case 'special':
          this.battle.log.push(`使用 ${card.name}`)
          break
      }

      this.checkWinCondition()
      if (!this.battle.winner) this.endTurn()
    },

    /**
     * AI 回合
     */
    aiTurn() {
      if (this.battle.winner) return

      this.drawCard('ai')

      // AI 出牌逻辑
      if (this.battle.aiHand.length > 0) {
        const aiStrategy = this.getAIStrategy()
        const cardIndex = aiStrategy(this.battle.aiHand, this.battle)
        if (cardIndex >= 0) {
          const cardId = this.battle.aiHand[cardIndex]
          const card = getCardById(cardId)
          this.battle.aiHand.splice(cardIndex, 1)

          switch (card.type) {
            case 'attack':
              this.battle.playerHP = Math.max(0, this.battle.playerHP - card.value)
              this.battle.log.push(`AI 使用 ${card.name}，造成 ${card.value} 点伤害`)
              break
            case 'defense':
              this.battle.aiHP = Math.min(this.battle.aiMaxHP, this.battle.aiHP + card.value)
              break
            case 'heal':
              this.battle.aiHP = Math.min(this.battle.aiMaxHP, this.battle.aiHP + card.value)
              this.battle.log.push(`AI 使用 ${card.name}，回复 ${card.value} 点HP`)
              break
          }
        }
      }

      this.checkWinCondition()
      if (!this.battle.winner) {
        this.battle.turn = 'player'
        this.battle.phase = 'draw'
        this.drawCard('player')
        this.battle.phase = 'play'
      }
    },

    /**
     * AI 策略
     */
    getAIStrategy() {
      const difficulty = this.battle.difficulty
      switch (difficulty) {
        case 'easy': return this.aiEasy
        case 'hard': return this.aiHard
        default: return this.aiNormal
      }
    },

    aiEasy(hand) {
      return Math.floor(Math.random() * hand.length)
    },

    aiNormal(hand, battle) {
      const hpRatio = battle.aiHP / battle.aiMaxHP
      if (hpRatio < 0.3) {
        // 优先防御/回复
        const healIdx = hand.findIndex(id => { const c = getCardById(id); return c.type === 'heal' || c.type === 'defense' })
        if (healIdx >= 0) return healIdx
      }
      if (hpRatio > 0.7) {
        // 优先攻击
        const atkIdx = hand.findIndex(id => { const c = getCardById(id); return c.type === 'attack' })
        if (atkIdx >= 0) return atkIdx
      }
      return Math.floor(Math.random() * hand.length)
    },

    aiHard(hand, battle) {
      let bestIdx = 0
      let bestScore = -1

      hand.forEach((cardId, idx) => {
        const card = getCardById(cardId)
        let score = 0
        switch (card.type) {
          case 'attack': score = card.value * 1.0; break
          case 'defense': score = card.value * 0.8; break
          case 'heal': score = card.value * (battle.aiHP < battle.aiMaxHP * 0.5 ? 1.5 : 0.5); break
        }
        score *= rarityConfig[card.rarity].packWeight / 10
        if (score > bestScore) { bestScore = score; bestIdx = idx }
      })

      return bestIdx
    },

    /**
     * 结束回合
     */
    endTurn() {
      this.battle.playedCard = null
      this.battle.equationAnswer = null

      if (this.battle.turn === 'player') {
        this.battle.turn = 'ai'
        this.battle.phase = 'ai_turn'
        setTimeout(() => this.aiTurn(), 800)
      }
    },

    /**
     * 检查胜负
     */
    checkWinCondition() {
      if (this.battle.aiHP <= 0) {
        this.battle.winner = 'player'
        this.battle.phase = 'ended'
        this.onBattleEnd('player')
      } else if (this.battle.playerHP <= 0) {
        this.battle.winner = 'ai'
        this.battle.phase = 'ended'
        this.onBattleEnd('ai')
      } else if (this.battle.playerDeck.length === 0 && this.battle.playerHand.length === 0) {
        this.battle.winner = 'ai'
        this.battle.phase = 'ended'
        this.onBattleEnd('ai')
      }
    },

    /**
     * 对战结束
     */
    onBattleEnd(winner) {
      const gameStore = useGameStore()
      const coins = winner === 'player' ? 30 : 10
      const gems = winner === 'player' ? 1 : 0

      gameStore.addCoins(coins)
      if (gems > 0) gameStore.addGems(gems)

      if (!gameStore.cardBattle) gameStore.cardBattle = gameStore.getDefaultCardBattle()
      gameStore.cardBattle.battleStats.totalBattles++
      if (winner === 'player') gameStore.cardBattle.battleStats.wins++
      else gameStore.cardBattle.battleStats.losses++

      gameStore.saveGame()
    },

    /**
     * 洗牌
     */
    shuffle(arr) {
      const a = [...arr]
      for (let i = a.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1))
        ;[a[i], a[j]] = [a[j], a[i]]
      }
      return a
    }
  }
})

export default useCardStore
