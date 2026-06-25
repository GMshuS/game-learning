/**
 * 卡牌对战 Store — 独立持久化 (v2)
 *
 * 不再依赖 gameStore.cardBattle，独立管理自身数据，
 * 通过 localStorage 直接读写（键名 math_game_cards）。
 */
import { defineStore } from 'pinia';
import { useGameStore } from './gameStore';
import { useSettingsStore } from './settingsStore';
import { cards, rarityConfig, packConfig, getCardById, getCardsByGrade } from '../config/cards';
import { getGameConfig } from '../utils/gameContext';
import { STORAGE_KEYS } from '../utils/storage';

const CARD_STORAGE_KEY = STORAGE_KEYS.CARDS || 'math_game_cards';

export const useCardStore = defineStore('card', {
  state: () => ({
    /** @type {boolean} 是否已从 localStorage 初始化 */
    _initialized: false,

    // === 原有字段 ===
    /** @type {Array<{cardId: string, quantity: number}>} */
    collection: [],
    /** @type {string[]} 卡组中的卡牌 ID */
    deck: [],
    /** @type {{wins: number, losses: number, totalBattles: number}} 对战统计（原 gameStore.cardBattle.battleStats） */
    battleStats: { wins: 0, losses: 0, totalBattles: 0 },
    /** @type {object|null} 对战状态 */
    battle: null,
    /** @type {number|null} AI 行动定时器 ID（非响应式清理用） */
    _aiTimer: null,

    // === 新增字段（学科碎片系统） ===
    /** @type {{math: number, english: number, total: number}} */
    shards: {
      math: 0,
      english: 0,
      total: 0
    },
    /** @type {string[]} 已解锁的学科来源 */
    unlockedSources: ['math'],
    /** @type {Array<{cardId: string, source: string, timestamp: number}>} 最近获得记录 */
    recentAcquisitions: [],
    /** @type {number} 累计获得卡牌总数 */
    totalCardsEarned: 0,
    /** @type {{mathCardsEarned: number, englishCardsEarned: number}} 跨学科统计 */
    crossDomainStats: {
      mathCardsEarned: 0,
      englishCardsEarned: 0
    }
  }),

  getters: {
    collectionCount: (state) => state.collection.reduce((sum, c) => sum + c.quantity, 0),
    hasCard: (state) => (cardId) => state.collection.some(c => c.cardId === cardId && c.quantity > 0),
    deckValid: (state) => state.deck.length >= 10 && state.deck.length <= 15
  },

  actions: {
    // ==================== 初始化 & 持久化 ====================

    /**
     * 确保数据已从 localStorage 加载（惰性初始化）
     * 在每次数据访问/修改前调用
     */
    _ensureLoaded() {
      if (!this._initialized) {
        this._initialized = true;
        this.loadData();
      }
    },

    /**
     * 加载卡牌数据
     * @param {object} [data] - 可选，从外部传入的数据（向后兼容 gameStore.cardBattle）
     *                          无参数时自动从 localStorage 读取
     */
    loadData(data) {
      if (data) {
        // 向后兼容：从 gameStore.cardBattle 等外部数据源加载
        this.collection = data.collection || [];
        this.deck = data.deck || [];
        this.battleStats = data.battleStats || { wins: 0, losses: 0, totalBattles: 0 };
        this.shards = data.shards || { math: 0, english: 0, total: 0 };
        this.unlockedSources = data.unlockedSources || ['math'];
        this.recentAcquisitions = data.recentAcquisitions || [];
        this.totalCardsEarned = data.totalCardsEarned || 0;
        this.crossDomainStats = data.crossDomainStats || { mathCardsEarned: 0, englishCardsEarned: 0 };
      } else {
        // 从 localStorage 自动加载
        this._loadFromStorage();
      }
    },

    /**
     * 获取存档数据（用于外部序列化或 _persist）
     * @returns {object}
     */
    getSaveData() {
      this._ensureLoaded();
      return {
        collection: this.collection,
        deck: this.deck,
        battleStats: this.battleStats,
        shards: this.shards,
        unlockedSources: this.unlockedSources,
        recentAcquisitions: this.recentAcquisitions,
        totalCardsEarned: this.totalCardsEarned,
        crossDomainStats: this.crossDomainStats
      };
    },

    /**
     * 保存卡牌数据到 localStorage（公开接口）
     */
    saveData() {
      this._ensureLoaded();
      this._persist();
    },

    /**
     * 从 localStorage 读取卡牌数据
     * 如新键不存在则尝试从旧键（math_game_card_battle）迁移
     */
    _loadFromStorage() {
      try {
        const raw = localStorage.getItem(CARD_STORAGE_KEY);
        if (raw) {
          const data = JSON.parse(raw);
          this.collection = data.collection || [];
          this.deck = data.deck || [];
          this.battleStats = data.battleStats || { wins: 0, losses: 0, totalBattles: 0 };
          this.shards = data.shards || { math: 0, english: 0, total: 0 };
          this.unlockedSources = data.unlockedSources || ['math'];
          this.recentAcquisitions = data.recentAcquisitions || [];
          this.totalCardsEarned = data.totalCardsEarned || 0;
          this.crossDomainStats = data.crossDomainStats || { mathCardsEarned: 0, englishCardsEarned: 0 };
        } else {
          // 尝试从旧键迁移
          this._migrateFromOldStorage();
        }
      } catch (e) {
        console.warn('Failed to load card data from localStorage, using defaults');
      }
    },

    /**
     * 从旧的 gameStore.cardBattle 存储键迁移数据
     * 旧键名：math_game_card_battle（由 storage.js 的 STORAGE_KEYS.CARD_BATTLE 定义）
     */
    _migrateFromOldStorage() {
      try {
        const oldRaw = localStorage.getItem('math_game_card_battle');
        if (oldRaw) {
          const oldData = JSON.parse(oldRaw);
          this.collection = oldData.collection || [];
          this.deck = oldData.deck || [];
          this.battleStats = oldData.battleStats || { wins: 0, losses: 0, totalBattles: 0 };
          // 立即保存到新键，完成迁移
          this._persist();
          console.log('Card data migrated from old storage (math_game_card_battle)');
        }
      } catch (e) {
        // 无旧数据，使用默认空状态
      }
    },

    /**
     * 写入 localStorage（内部持久化）
     * @returns {boolean}
     */
    _persist() {
      const data = this.getSaveData();
      try {
        localStorage.setItem(CARD_STORAGE_KEY, JSON.stringify(data));
        return true;
      } catch (e) {
        if (e.name === 'QuotaExceededError' || e.code === 22 || e.code === 1014) {
          console.warn('localStorage 容量不足，无法保存卡牌数据');
        } else {
          console.error('卡牌数据保存失败:', e);
        }
        return false;
      }
    },

    // ==================== 碎片系统 ====================

    /**
     * 获得碎片
     * @param {'math'|'english'|string} source - 碎片来源学科
     * @param {number} [count=1] - 碎片数量
     */
    earnShard(source, count = 1) {
      this._ensureLoaded();
      if (!this.unlockedSources.includes(source)) {
        this.unlockedSources.push(source);
      }
      this.shards[source] = (this.shards[source] || 0) + count;
      this.shards.total += count;
      this._persist();
    },

    /**
     * 消耗碎片合成随机卡牌
     * @param {number} [shardCost=10] - 消耗的碎片数量
     * @returns {object|null} 合成的卡牌对象，失败返回 null
     */
    craftCard(shardCost = 10) {
      this._ensureLoaded();
      if (this.shards.total < shardCost) return null;

      // 按比例扣除碎片（先扣数学，再扣英语）
      let remaining = shardCost;
      const mathDeduction = Math.min(this.shards.math, remaining);
      this.shards.math -= mathDeduction;
      remaining -= mathDeduction;
      if (remaining > 0) {
        this.shards.english = Math.max(0, this.shards.english - remaining);
        remaining = 0;
      }
      this.shards.total -= shardCost;

      // 随机选择卡牌
      const settingsStore = useSettingsStore();
      const grade = settingsStore.gradeRange.max;
      const gradeCards = getCardsByGrade(grade);

      const craftWeights = { common: 50, rare: 30, epic: 15, legendary: 5 };
      const totalWeight = Object.values(craftWeights).reduce((a, b) => a + b, 0);
      let rand = Math.random() * totalWeight;
      let selectedRarity = 'common';
      for (const [rarity, weight] of Object.entries(craftWeights)) {
        rand -= weight;
        if (rand <= 0) { selectedRarity = rarity; break; }
      }

      const candidates = gradeCards.filter(c => c.rarity === selectedRarity);
      let card;
      if (candidates.length === 0) {
        // 降级
        const fallback = gradeCards.filter(c => rarityConfig[c.rarity] && rarityConfig[c.rarity].packWeight > 0);
        if (fallback.length === 0) {
          this._persist();
          return null;
        }
        card = fallback[Math.floor(Math.random() * fallback.length)];
      } else {
        card = candidates[Math.floor(Math.random() * candidates.length)];
      }

      // 添加到收藏
      this.addCardToCollection(card.id);

      // 记录获得
      this.totalCardsEarned++;
      this.crossDomainStats.mathCardsEarned++;
      this.recentAcquisitions.push({
        cardId: card.id,
        source: 'craft',
        timestamp: Date.now()
      });
      // 保留最近 20 条
      if (this.recentAcquisitions.length > 20) {
        this.recentAcquisitions.shift();
      }

      this._persist();
      return card;
    },

    // ==================== 卡牌操作 ====================

    /**
     * 开卡包
     * @param {string} packType - 卡包类型
     * @returns {Array<{card: object, isNew: boolean}>}
     */
    openPack(packType) {
      this._ensureLoaded();
      const pack = packConfig[packType];
      if (!pack) return [];

      const gameStore = useGameStore();
      if (pack.currency === 'gems') {
        if (!gameStore.spendGems(pack.price)) return [];
      } else {
        if (!gameStore.spendCoins(pack.price)) return [];
      }

      const settingsStore = useSettingsStore();
      const grade = settingsStore.gradeRange.max;
      const gradeCards = getCardsByGrade(grade);
      const results = [];

      for (let i = 0; i < 5; i++) {
        const card = this.rollCard(pack.weights, gradeCards);
        if (card) {
          this.addCardToCollection(card.id);
          results.push({ card, isNew: !this.hasCard(card.id) });
          // 统计
          this.totalCardsEarned++;
          this.recentAcquisitions.push({
            cardId: card.id,
            source: 'pack',
            timestamp: Date.now()
          });
          if (this.recentAcquisitions.length > 20) {
            this.recentAcquisitions.shift();
          }
        }
      }

      this._persist();
      return results;
    },

    /**
     * 随机抽取卡牌（根据权重）
     * @param {object} weights - 稀有度权重 { common: number, rare: number, ... }
     * @param {object[]} gradeCards - 当前年级的卡牌列表
     * @returns {object|null}
     */
    rollCard(weights, gradeCards) {
      const total = Object.values(weights).reduce((a, b) => a + b, 0);
      let rand = Math.random() * total;
      let selectedRarity = 'common';

      for (const [rarity, weight] of Object.entries(weights)) {
        rand -= weight;
        if (rand <= 0) { selectedRarity = rarity; break; }
      }

      const candidates = gradeCards.filter(c => c.rarity === selectedRarity);
      if (candidates.length === 0) {
        // 降级
        const fallback = gradeCards.filter(c => rarityConfig[c.rarity] && rarityConfig[c.rarity].packWeight > 0);
        return fallback[Math.floor(Math.random() * fallback.length)] || null;
      }
      return candidates[Math.floor(Math.random() * candidates.length)];
    },

    /**
     * 添加到收藏
     * @param {string} cardId
     */
    addCardToCollection(cardId) {
      this._ensureLoaded();
      const existing = this.collection.find(c => c.cardId === cardId);
      if (existing) {
        existing.quantity++;
        // 重复卡转化为金币
        const card = getCardById(cardId);
        if (card && existing.quantity > 1) {
          const gameStore = useGameStore();
          gameStore.addCoins(rarityConfig[card.rarity].duplicateCoins);
        }
      } else {
        this.collection.push({ cardId, quantity: 1 });
      }
    },

    /**
     * 加入卡组
     * @param {string} cardId
     * @returns {boolean}
     */
    addToDeck(cardId) {
      this._ensureLoaded();
      if (this.deck.length >= 15) return false;
      if (this.deck.includes(cardId)) return false;
      if (!this.hasCard(cardId)) return false;
      this.deck.push(cardId);
      this._persist();
      return true;
    },

    /**
     * 从卡组移除
     * @param {string} cardId
     * @returns {boolean}
     */
    removeFromDeck(cardId) {
      this._ensureLoaded();
      const idx = this.deck.indexOf(cardId);
      if (idx >= 0) {
        this.deck.splice(idx, 1);
        this._persist();
        return true;
      }
      return false;
    },

    // ==================== 对战逻辑 ====================

    /**
     * 开始对战
     * @param {string} [difficulty='normal']
     * @returns {boolean}
     */
    startBattle(difficulty = 'normal') {
      this._ensureLoaded();
      if (!this.deckValid) return false;

      // 清理残留的 AI 定时器
      if (this._aiTimer) {
        clearTimeout(this._aiTimer);
        this._aiTimer = null;
      }

      const settingsStore = useSettingsStore();
      const gameConfig = getGameConfig(settingsStore.gradeRange.max, settingsStore.difficulty);
      const aiLevel = gameConfig.scale.aiStrategyLevel || 'basic';

      const playerDeck = [...this.deck];
      const aiDeck = this.generateAIDeck();

      this.battle = {
        difficulty,
        aiLevel,
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
      };

      // 初始抽牌
      for (let i = 0; i < 3; i++) {
        this.drawCard('player');
        this.drawCard('ai');
      }

      this.battle.phase = 'play';
      return true;
    },

    /**
     * 生成 AI 卡组
     * @returns {string[]}
     */
    generateAIDeck() {
      const aiCards = [];
      const available = cards.filter(c => c.type === 'attack' || c.type === 'defense' || c.type === 'heal');
      while (aiCards.length < 15) {
        const card = available[Math.floor(Math.random() * available.length)];
        if (!aiCards.includes(card.id)) aiCards.push(card.id);
      }
      return aiCards;
    },

    /**
     * 抽牌
     * @param {'player'|'ai'} who
     */
    drawCard(who) {
      const deckKey = who === 'player' ? 'playerDeck' : 'aiDeck';
      const handKey = who === 'player' ? 'playerHand' : 'aiHand';

      if (this.battle[deckKey].length > 0 && this.battle[handKey].length < 5) {
        const cardId = this.battle[deckKey].pop();
        this.battle[handKey].push(cardId);
      }
    },

    /**
     * 出牌
     * @param {number} handIndex
     * @returns {boolean}
     */
    playCard(handIndex) {
      if (this.battle.turn !== 'player' || this.battle.phase !== 'play') return false;

      const cardId = this.battle.playerHand[handIndex];
      const card = getCardById(cardId);
      if (!card) return false;

      this.battle.playerHand.splice(handIndex, 1);
      this.battle.playedCard = cardId;

      // 方程卡需要答题
      if (card.type === 'equation') {
        this.battle.phase = 'answer';
        this.battle.equationAnswer = card.answer;
        return true;
      }

      this.resolveEffect(card);
      return true;
    },

    /**
     * 答题（方程卡）
     * @param {number} answer
     * @returns {boolean}
     */
    answerEquation(answer) {
      if (this.battle.phase !== 'answer') return false;

      const card = getCardById(this.battle.playedCard);
      if (answer === this.battle.equationAnswer) {
        this.resolveEffect(card);
      } else {
        this.battle.log.push('方程答错，卡牌无效！');
        this.endTurn();
      }
      return true;
    },

    /**
     * 结算效果
     * @param {object} card
     */
    resolveEffect(card) {
      switch (card.type) {
        case 'attack':
          this.battle.aiHP = Math.max(0, this.battle.aiHP - card.value);
          this.battle.log.push(`使用 ${card.name}，造成 ${card.value} 点伤害`);
          break;
        case 'defense':
          this.battle.playerHP = Math.min(this.battle.playerMaxHP, this.battle.playerHP + card.value);
          this.battle.log.push(`使用 ${card.name}，抵挡 ${card.value} 点伤害`);
          break;
        case 'heal':
          this.battle.playerHP = Math.min(this.battle.playerMaxHP, this.battle.playerHP + card.value);
          this.battle.log.push(`使用 ${card.name}，回复 ${card.value} 点HP`);
          break;
        case 'special':
          this.battle.log.push(`使用 ${card.name}`);
          break;
      }

      this.checkWinCondition();
      if (!this.battle.winner) this.endTurn();
    },

    /**
     * AI 回合
     */
    aiTurn() {
      if (this.battle.winner) return;

      this.drawCard('ai');

      // AI 出牌逻辑
      if (this.battle.aiHand.length > 0) {
        const aiStrategy = this.getAIStrategy();
        const cardIndex = aiStrategy(this.battle.aiHand, this.battle);
        if (cardIndex >= 0) {
          const cardId = this.battle.aiHand[cardIndex];
          const card = getCardById(cardId);
          this.battle.aiHand.splice(cardIndex, 1);

          switch (card.type) {
            case 'attack':
              this.battle.playerHP = Math.max(0, this.battle.playerHP - card.value);
              this.battle.log.push(`AI 使用 ${card.name}，造成 ${card.value} 点伤害`);
              break;
            case 'defense':
              this.battle.aiHP = Math.min(this.battle.aiMaxHP, this.battle.aiHP + card.value);
              break;
            case 'heal':
              this.battle.aiHP = Math.min(this.battle.aiMaxHP, this.battle.aiHP + card.value);
              this.battle.log.push(`AI 使用 ${card.name}，回复 ${card.value} 点HP`);
              break;
          }
        }
      }

      this.checkWinCondition();
      if (!this.battle.winner) {
        this.battle.turn = 'player';
        this.battle.phase = 'draw';
        this.drawCard('player');
        this.battle.phase = 'play';
      }
    },

    /**
     * AI 策略选择
     * @returns {Function}
     */
    getAIStrategy() {
      const aiLevel = this.battle?.aiLevel || 'basic';
      switch (aiLevel) {
        case 'random': return this.aiEasy;
        case 'optimal': return this.aiHard;
        default: return this.aiNormal;
      }
    },

    /** @private */
    aiEasy(hand) {
      return Math.floor(Math.random() * hand.length);
    },

    /** @private */
    aiNormal(hand, battle) {
      const hpRatio = battle.aiHP / battle.aiMaxHP;
      if (hpRatio < 0.3) {
        // 优先防御/回复
        const healIdx = hand.findIndex(id => { const c = getCardById(id); return c.type === 'heal' || c.type === 'defense'; });
        if (healIdx >= 0) return healIdx;
      }
      if (hpRatio > 0.7) {
        // 优先攻击
        const atkIdx = hand.findIndex(id => { const c = getCardById(id); return c.type === 'attack'; });
        if (atkIdx >= 0) return atkIdx;
      }
      return Math.floor(Math.random() * hand.length);
    },

    /** @private */
    aiHard(hand, battle) {
      let bestIdx = 0;
      let bestScore = -1;

      hand.forEach((cardId, idx) => {
        const card = getCardById(cardId);
        let score = 0;
        switch (card.type) {
          case 'attack': score = card.value * 1.0; break;
          case 'defense': score = card.value * 0.8; break;
          case 'heal': score = card.value * (battle.aiHP < battle.aiMaxHP * 0.5 ? 1.5 : 0.5); break;
        }
        score *= rarityConfig[card.rarity].packWeight / 10;
        if (score > bestScore) { bestScore = score; bestIdx = idx; }
      });

      return bestIdx;
    },

    /**
     * 结束回合
     */
    endTurn() {
      this.battle.playedCard = null;
      this.battle.equationAnswer = null;

      if (this.battle.turn === 'player') {
        this.battle.turn = 'ai';
        this.battle.phase = 'ai_turn';
        // 清理旧定时器，存储新定时器 ID 以便组件卸载时清理
        if (this._aiTimer) clearTimeout(this._aiTimer);
        this._aiTimer = setTimeout(() => {
          this._aiTimer = null;
          this.aiTurn();
        }, 800);
      }
    },

    /**
     * 检查胜负
     */
    checkWinCondition() {
      if (this.battle.aiHP <= 0) {
        this.battle.winner = 'player';
        this.battle.phase = 'ended';
        this.onBattleEnd('player');
      } else if (this.battle.playerHP <= 0) {
        this.battle.winner = 'ai';
        this.battle.phase = 'ended';
        this.onBattleEnd('ai');
      } else if (this.battle.playerDeck.length === 0 && this.battle.playerHand.length === 0) {
        this.battle.winner = 'ai';
        this.battle.phase = 'ended';
        this.onBattleEnd('ai');
      }
    },

    /**
     * 对战结束 — 发放奖励并更新统计
     *
     * 【改造说明】
     * 原代码写入 gameStore.cardBattle.battleStats，现已迁移到 cardStore 自身的 battleStats 字段，
     * 完全去除了对 gameStore.cardBattle 的数据依赖。
     *
     * @param {'player'|'ai'} winner
     */
    onBattleEnd(winner) {
      // 清理 AI 定时器
      if (this._aiTimer) {
        clearTimeout(this._aiTimer);
        this._aiTimer = null;
      }

      const gameStore = useGameStore();
      const settingsStore = useSettingsStore();
      const gameConfig = getGameConfig(settingsStore.gradeRange.max, settingsStore.difficulty);
      const coinRatio = gameConfig.scale.coinRatio || 1.0;

      let coins = winner === 'player' ? 30 : 10;
      coins = Math.floor(coins * coinRatio);
      const gems = winner === 'player' ? 1 : 0;

      gameStore.addCoins(coins);
      if (gems > 0) gameStore.addGems(gems);

      // 使用自身的 battleStats，不再依赖 gameStore.cardBattle.battleStats
      this.battleStats.totalBattles++;
      if (winner === 'player') this.battleStats.wins++;
      else this.battleStats.losses++;

      // 持久化卡牌数据
      this._persist();
    },

    /**
     * 洗牌
     * @param {Array} arr
     * @returns {Array}
     */
    shuffle(arr) {
      const a = [...arr];
      for (let i = a.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1))
        ;[a[i], a[j]] = [a[j], a[i]];
      }
      return a;
    }
  }
});

export default useCardStore;
