/**
 * 超市大挑战 Store
 * 合并 shopStore + cashierStore 功能
 * 支持4种模式：新手采购、购物达人、收银小能手、极速收银挑战
 */
import { defineStore } from 'pinia';
import { useSettingsStore } from './settingsStore';
import { useGameStore } from './gameStore';
import {
  getConfig,
  getProductsForGrade,
  getDenominationsForGrade
} from '../config/market';

export const useMarketStore = defineStore('market', {
  state: () => ({
    // 模式：shopping(采购) | cashier(收银) | speed(极速)
    mode: 'shopping',
    // 年级
    grade: 1,
    // 当前顾客信息
    customer: null,
    // 购物清单
    items: [],
    // 总价
    totalCost: 0,
    // 当前题目
    problem: null,
    // 已选择的找零货币（面额 => 张数）
    selectedChange: {},
    // 倒计时剩余秒数（极速模式）
    timeLeft: 60,
    // 最高分
    highScores: {
      easy: 0,
      medium: 0,
      hard: 0
    },
    // 游戏统计
    gamesPlayed: 0,
    gamesWon: 0,
    totalEarnings: 0,
    // 当前回合
    round: 0,
    // 历史记录（最近10场）
    lastGames: [],
    // 极速模式答对计数
    correctCount: 0,
    // 是否正在游戏中
    isPlaying: false,
    // 计时器ID
    _timerId: null
  }),

  getters: {
    /**
     * 胜率
     */
    winRate: (state) => {
      if (state.gamesPlayed === 0) return 0;
      return Math.round((state.gamesWon / state.gamesPlayed) * 100);
    },

    /**
     * 当前模式配置
     */
    currentConfig: (state) => {
      const settingsStore = useSettingsStore();
      const grade = state.grade || settingsStore.gradeRange.max || 1;
      if (state.mode === 'shopping') {
        return grade <= 2 ? getConfig('beginner', grade) : getConfig('shopper', grade);
      }
      if (state.mode === 'cashier') {
        return getConfig('cashier', grade);
      }
      if (state.mode === 'speed') {
        return getConfig('speed', grade);
      }
      return getConfig('beginner', grade);
    },

    /**
     * 可用货币面额
     */
    availableDenominations: (state) => {
      const grade = state.grade || useSettingsStore().gradeRange.max || 1;
      return getDenominationsForGrade(grade);
    },

    /**
     * 已选找零总额
     */
    selectedTotal: (state) => {
      return Object.entries(state.selectedChange).reduce((sum, [value, count]) => {
        return sum + parseInt(value) * count;
      }, 0);
    }
  },

  actions: {
    /**
     * 开始游戏
     * @param {'shopping'|'cashier'|'speed'} mode - 游戏模式
     * @param {number} grade - 年级（1-6）
     */
    startGame(mode, grade) {
      this.mode = mode;
      this.grade = grade || useSettingsStore().gradeRange.max || 1;
      this.isPlaying = true;
      this.round = 0;
      this.correctCount = 0;
      this.clearTimer();

      if (mode === 'speed') {
        this.timeLeft = 60;
        this.startTimer();
      }

      this.generateCustomer();
    },

    /**
     * 清除计时器
     */
    clearTimer() {
      if (this._timerId) {
        clearInterval(this._timerId);
        this._timerId = null;
      }
    },

    /**
     * 启动倒计时（极速模式）
     */
    startTimer() {
      this.clearTimer();
      this._timerId = setInterval(() => {
        if (this.timeLeft <= 0) {
          this.clearTimer();
          this.endGame('timeout');
          return;
        }
        this.timeLeft--;
      }, 1000);
    },

    /**
     * 生成顾客和购物清单
     */
    generateCustomer() {
      const grade = this.grade;
      const products = getProductsForGrade(grade);
      const config = this.currentConfig;

      // 确定商品数量
      let itemCount = 1;
      if (this.mode === 'shopping') {
        itemCount = grade <= 2 ? 1 : Math.min(3, Math.floor(Math.random() * 2) + 2);
      } else {
        itemCount = config.itemCount || 2;
      }

      // 生成购物清单
      const items = [];
      const usedIndices = new Set();
      for (let i = 0; i < itemCount; i++) {
        let idx;
        let attempts = 0;
        do {
          idx = Math.floor(Math.random() * products.length);
          attempts++;
        } while (usedIndices.has(idx) && attempts < 10);
        usedIndices.add(idx);

        const maxQty = config.quantityRange ? config.quantityRange[1] : 5;
        const minQty = config.quantityRange ? config.quantityRange[0] : 1;
        const quantity = Math.floor(Math.random() * (maxQty - minQty + 1)) + minQty;

        items.push({
          product: products[idx],
          quantity
        });
      }

      // 计算总价
      const totalCost = items.reduce((sum, item) => {
        return sum + item.product.price * item.quantity;
      }, 0);

      this.items = items;
      this.totalCost = totalCost;
      this.customer = {
        name: this.generateCustomerName(),
        dialogue: this.generateDialogue()
      };

      // 生成题目
      this.generateProblem(items, totalCost);
      this.selectedChange = {};
    },

    /**
     * 生成顾客名称
     * @returns {string}
     */
    generateCustomerName() {
      const names = [
        '小明', '小红', '小华', '小丽', '小刚',
        '王叔叔', '李阿姨', '张爷爷', '刘奶奶',
        '同学', '老师', '邻居'
      ];
      return names[Math.floor(Math.random() * names.length)];
    },

    /**
     * 生成对话
     * @returns {string}
     */
    generateDialogue() {
      const dialogues = [
        '你好，我要买东西！',
        '请问这些东西多少钱？',
        '帮我算算一共多少钱？',
        '我要这些，帮我算一下！',
        '今天来采购一些东西！'
      ];
      return dialogues[Math.floor(Math.random() * dialogues.length)];
    },

    /**
     * 生成题目
     * @param {Array} items - 购物清单
     * @param {number} totalCost - 总价
     */
    generateProblem(items, totalCost) {
      const grade = this.grade;
      let questionText = '';
      let answer = totalCost;

      if (this.mode === 'shopping') {
        // 采购模式
        if (items.length === 1) {
          questionText = `📋 ${this.customer.name}要买${items[0].product.icon}${items[0].product.name}×${items[0].quantity}（${items[0].product.price}元/个），一共多少钱？`;
        } else {
          const parts = items.map(item =>
            `${item.product.icon}${item.product.name}×${item.quantity}（${item.product.price}元/个）`
          );
          questionText = `📋 ${this.customer.name}买了：${parts.join('、')}，一共多少钱？`;
        }
      } else if (this.mode === 'cashier' || this.mode === 'speed') {
        // 收银模式
        const parts = items.map(item =>
          `${item.product.icon}${item.product.name}×${item.quantity}（${item.product.price}元/个）`
        );
        questionText = `🧾 ${this.customer.name}买了：${parts.join('、')}，总价多少元？`;

        // 计算应付款（模拟顾客付款）
        const payment = this.calculatePayment(totalCost);
        this.problem = {
          questionText,
          answer,
          totalCost,
          payment,
          change: payment - totalCost,
          step: 'total' // total | change
        };
        return;
      }

      this.problem = {
        questionText,
        answer,
        totalCost,
        step: 'answer'
      };
    },

    /**
     * 计算顾客付款金额
     * @param {number} totalCost - 总价
     * @returns {number} 付款金额
     */
    calculatePayment(totalCost) {
      const denoms = [100, 50, 20, 10, 5, 1];
      const grade = this.grade;

      // 随机选择1-3张钞票凑够总价
      let maxBills = grade <= 2 ? 2 : 3;
      if (grade === 1) maxBills = 1;

      let sum = 0;
      let billCount = 0;
      const usedDenoms = denoms.filter(d => {
        if (grade <= 1) return d <= 10;
        if (grade <= 2) return d <= 20;
        if (grade <= 4) return d <= 50;
        return true;
      });

      while (sum < totalCost && billCount < maxBills) {
        const remaining = maxBills - billCount;
        const needed = totalCost - sum;
        const suitable = usedDenoms.filter(v => v >= Math.ceil(needed / remaining));
        const pool = suitable.length > 0 ? suitable : usedDenoms;
        const bill = pool[Math.floor(Math.random() * pool.length)];
        sum += bill;
        billCount++;
      }

      // 确保至少付够总价
      while (sum < totalCost) {
        sum += 1;
      }

      return sum;
    },

    /**
     * 提交答案
     * @param {number} answer - 用户输入的答案
     * @returns {object} { correct, message, reward?, nextStep? }
     */
    submitAnswer(answer) {
      if (!this.problem) {
        return { correct: false, message: '没有活跃的题目' };
      }

      const parsed = Number(answer);
      if (isNaN(parsed)) {
        return { correct: false, message: '请输入有效数字' };
      }

      // 收银模式：先计算总价，再进入找零
      if (this.mode === 'cashier' || this.mode === 'speed') {
        if (this.problem.step === 'total') {
          if (parsed === this.problem.totalCost) {
            this.problem.step = 'change';
            this.problem.questionText = `🧾 总价${this.problem.totalCost}元，顾客给了${this.problem.payment}元，请选择找零方案。`;
            return {
              correct: true,
              message: `✅ 总价正确！${this.problem.totalCost}元。请给顾客找零。`,
              nextStep: 'change',
              change: this.problem.change,
              payment: this.problem.payment
            };
          }
          return {
            correct: false,
            message: `❌ 总价不正确，正确答案是 ${this.problem.totalCost} 元`
          };
        }
        return { correct: false, message: '请先选择找零方案' };
      }

      // 采购模式：直接验证答案
      if (parsed === this.problem.answer) {
        this.correctCount++;
        return {
          correct: true,
          message: `✅ 正确！一共${this.problem.totalCost}元。`,
          reward: this.calculateReward()
        };
      }

      return {
        correct: false,
        message: `❌ 答案不正确，正确答案是 ${this.problem.answer} 元`
      };
    },

    /**
     * 添加一枚货币到找零选择
     * @param {number} value - 面额
     */
    addCoin(value) {
      const key = String(value);
      this.selectedChange[key] = (this.selectedChange[key] || 0) + 1;
    },

    /**
     * 从找零选择移除一枚货币
     * @param {number} value - 面额
     */
    removeCoin(value) {
      const key = String(value);
      if (this.selectedChange[key] && this.selectedChange[key] > 0) {
        this.selectedChange[key]--;
        if (this.selectedChange[key] === 0) {
          delete this.selectedChange[key];
        }
      }
    },

    /**
     * 提交找零方案
     * @returns {object} { correct, message, reward? }
     */
    submitChange() {
      if (!this.problem || this.problem.step !== 'change') {
        return { correct: false, message: '当前不需要找零' };
      }

      const selectedTotal = this.selectedTotal;
      const correctChange = this.problem.change;

      if (selectedTotal === correctChange) {
        this.correctCount++;
        return {
          correct: true,
          message: `✅ 找零正确！顾客满意离开。`,
          reward: this.calculateReward()
        };
      }

      if (selectedTotal > correctChange) {
        return {
          correct: false,
          message: `❌ 多找了${selectedTotal - correctChange}元，再想想！`
        };
      }

      return {
        correct: false,
        message: `❌ 少找了${correctChange - selectedTotal}元，再想想！`
      };
    },

    /**
     * 计算奖励
     * @returns {object} { coins, score }
     */
    calculateReward() {
      const grade = this.grade;
      const baseCoins = grade <= 2 ? 5 : grade <= 4 ? 10 : 15;
      const bonusCoins = this.correctCount > 3 ? Math.floor(this.correctCount * 2) : 0;
      const coins = baseCoins + bonusCoins;

      // 计算得分
      const score = this.calculateScore();

      const gameStore = useGameStore();
      if (gameStore.player) {
        gameStore.addCoins(coins);
      }

      return { coins, score };
    },

    /**
     * 计算得分
     * @param {object} options - { timeUsed?, stars? }
     * @returns {number} 得分
     */
    calculateScore(options = {}) {
      const baseScore = 100;
      const starBonus = (options.stars || 1) * 50;
      const maxTime = 120;
      const timeUsed = options.timeUsed || 0;
      const timeBonus = Math.floor(Math.max(0, maxTime - timeUsed) * 2);
      const streakBonus = this.correctCount * 10;

      return baseScore + starBonus + timeBonus + streakBonus;
    },

    /**
     * 下一回合
     */
    nextRound() {
      this.round++;
      this.selectedChange = {};
      this.generateCustomer();
    },

    /**
     * 结算游戏
     * @param {string} status - 'success' | 'fail' | 'timeout'
     */
    endGame(status) {
      this.clearTimer();
      this.isPlaying = false;
      this.gamesPlayed++;

      const isWin = status === 'success';
      if (isWin) {
        this.gamesWon++;
      }

      // 更新最高分
      const difficultyMap = { beginner: 'easy', shopper: 'medium', cashier: 'hard', speed: 'hard' };
      const config = this.currentConfig;
      const diffKey = difficultyMap[config?.id] || 'medium';
      const finalScore = this.calculateScore({ stars: isWin ? 3 : 1 });
      if (finalScore > this.highScores[diffKey]) {
        this.highScores[diffKey] = finalScore;
      }

      // 记录最近的游戏
      this.lastGames.unshift({
        mode: this.mode,
        grade: this.grade,
        status,
        score: finalScore,
        correctCount: this.correctCount,
        round: this.round,
        timestamp: new Date().toISOString()
      });
      if (this.lastGames.length > 10) {
        this.lastGames = this.lastGames.slice(0, 10);
      }

      // 保存到 gameStore
      const gameStore = useGameStore();
      gameStore.saveGame();
    },

    /**
     * 重置全部状态
     */
    reset() {
      this.clearTimer();
      this.$reset();
    }
  }
});

export default useMarketStore;
