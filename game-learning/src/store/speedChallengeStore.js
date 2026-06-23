/**
 * 速算竞技场 Store
 */
import { defineStore } from 'pinia';
import { useCardStore } from './cardStore';
import { useGameStore } from './gameStore';
import { useSettingsStore } from './settingsStore';
import { useMathKnowledgeStore } from './mathKnowledgeStore';
import { getGameConfig } from '../utils/gameContext';
import { speedChallengeConfig } from '../config/speedChallenge';

const OP_KNOWLEDGE_MAP = {
  '+': 'add',
  '-': 'subtract',
  '×': 'multiply',
  '÷': 'divide'
};
import {
  createChallengeState,
  createChallengeGetters,
  baseStartGame,
  baseAnswer,
  baseTick,
  baseEndGame
} from './_challengeBase';

export const useSpeedChallengeStore = defineStore('speedChallenge', {
  state: () => ({
    ...createChallengeState(),
    difficultyScale: null
  }),

  getters: {
    ...createChallengeGetters(() => speedChallengeConfig)
  },

  actions: {
    /**
     * 开始游戏
     */
    startGame(mode) {
      const config = speedChallengeConfig.modes[mode];
      if (!config) return false;

      const settingsStore = useSettingsStore();
      const gameConfig = getGameConfig(settingsStore.grade, settingsStore.difficulty);
      this.difficultyScale = gameConfig.scale;

      baseStartGame(this, config, mode, () => this.generateQuestion());
      return true;
    },

    /**
     * 生成题目（年级适配）
     */
    generateQuestion() {
      const settingsStore = useSettingsStore();
      const grade = settingsStore.grade;
      const gradeCfg = speedChallengeConfig.gradeConfig[grade] || speedChallengeConfig.gradeConfig[1];

      const op = gradeCfg.operations[Math.floor(Math.random() * gradeCfg.operations.length)];
      let a, b, answer;

      switch (op) {
        case '+':
          a = Math.floor(Math.random() * gradeCfg.maxNum) + 1;
          b = Math.floor(Math.random() * (gradeCfg.maxNum - a)) + 1;
          answer = a + b;
          break;
        case '-':
          a = Math.floor(Math.random() * gradeCfg.maxNum) + 1;
          b = Math.floor(Math.random() * a) + 1;
          answer = a - b;
          break;
        case '×':
          a = Math.floor(Math.random() * Math.min(gradeCfg.maxNum / 10, 12)) + 1;
          b = Math.floor(Math.random() * 10) + 1;
          answer = a * b;
          break;
        case '÷':
          b = Math.floor(Math.random() * 10) + 1;
          answer = Math.floor(Math.random() * Math.min(gradeCfg.maxNum / 10, 12)) + 1;
          a = b * answer;
          break;
      }

      // 生成选项
      const options = this.generateOptions(answer);
      this.currentQuestion = { a, b, op, answer, options };
    },

    /**
     * 生成选项
     */
    generateOptions(correct) {
      const options = new Set([correct]);
      while (options.size < 4) {
        const offset = Math.floor(Math.random() * 10) - 5;
        const val = correct + offset;
        if (val >= 0 && val !== correct) options.add(val);
      }
      return [...options].sort(() => Math.random() - 0.5);
    },

    /**
     * 答题
     */
    answer(selected) {
      if (!this.isPlaying || !this.currentQuestion) return false;

      const isCorrect = selected === this.currentQuestion.answer;

      const result = baseAnswer(this, isCorrect, {
        onCorrect: () => this.updateAI(),
        onWrong: () => this.endGame(),
        generateFn: () => this.generateQuestion()
      });

      // 记录答题结果到知识库
      const knowledgeId = OP_KNOWLEDGE_MAP[this.currentQuestion?.op];
      if (knowledgeId) {
        const mathKnowledgeStore = useMathKnowledgeStore();
        mathKnowledgeStore.recordResult(knowledgeId, isCorrect);
      }

      return result;
    },

    /**
     * 更新 AI 进度（闪电模式）
     */
    updateAI() {
      const config = this.modeConfig;
      const aiTime = config.aiAnswerTime.min + Math.random() * (config.aiAnswerTime.max - config.aiAnswerTime.min);
      const aiSpeed = 1 / aiTime; // 每秒答题数（aiTime 单位是秒）
      const speedRatio = this.difficultyScale?.speedAISpeedRatio || 1.0;
      this.aiProgress += aiSpeed * 0.5 * speedRatio; // 玩家每次答题 AI 也前进
    },

    /**
     * 计时器滴答
     */
    tick() {
      baseTick(this, () => this.endGame(), 0.3 * (this.difficultyScale?.speedAISpeedRatio || 1.0));
    },

    /**
     * 结束游戏
     */
    endGame() {
      const result = baseEndGame(this, speedChallengeConfig);

      // 应用难度倍率
      if (this.difficultyScale) {
        result.coins = Math.floor(result.coins * this.difficultyScale.coinRatio);
      }

      // 更新最佳成绩
      const gameStore = useGameStore();
      const modeKey = this.currentMode === 'base' ? 'base' : this.currentMode;
      const currentBest = gameStore.speedChallenge?.bestScores?.[modeKey];
      if (!currentBest || this.score > currentBest.score) {
        if (!gameStore.speedChallenge) gameStore.speedChallenge = gameStore.getDefaultSpeedChallenge();
        gameStore.speedChallenge.bestScores[modeKey] = {
          score: this.score,
          rating: result.rating,
          date: Date.now()
        };
      }
      gameStore.speedChallenge.totalGames = (gameStore.speedChallenge.totalGames || 0) + 1;
      gameStore.speedChallenge.totalCorrect = (gameStore.speedChallenge.totalCorrect || 0) + this.correctCount;

      // 发放奖励
      gameStore.addCoins(result.coins);
      if (result.gems > 0) gameStore.addGems(result.gems);
      gameStore.saveGame();

      // === 卡牌碎片产出 ===
      // 每 100 分得 1 碎片
      const shardsFromScore = Math.floor(this.score / 100);
      if (shardsFromScore > 0) {
        const cardStore = useCardStore();
        cardStore.earnShard('math', shardsFromScore);
      }
      // S 评级额外得 3 碎片
      if (result.rating === 'S') {
        const cardStore = useCardStore();
        cardStore.earnShard('math', 3);
      }
    }
  }
});

export default useSpeedChallengeStore;
