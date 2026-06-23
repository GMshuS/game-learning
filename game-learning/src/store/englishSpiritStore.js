/**
 * 精灵收集 Store
 * 管理英语精灵的收集状态，遵循 save-on-write 模式
 * 持久化数据存放在 gameStore.englishSpirits 中
 */
import { defineStore } from 'pinia';
import { useGameStore } from './gameStore';
import { getSpiritsByRegion } from '../config/english/spirits';

export const useEnglishSpiritStore = defineStore('englishSpirit', {
  state: () => ({
    /** @type {string[]} 已收集的精灵ID列表 */
    collectedSpirits: [],
    /** @type {number} 精灵总数（常量） */
    totalSpirits: 9
  }),

  getters: {
    /**
     * 已收集精灵数量
     * @returns {number}
     */
    collectedCount: (state) => state.collectedSpirits.length,

    /**
     * 是否已全部收集
     * @returns {boolean}
     */
    isAllCollected: (state) => state.collectedSpirits.length >= state.totalSpirits
  },

  actions: {
    /**
     * 从 gameStore 加载持久化的精灵收集数据
     * 在游戏初始化时由 GameApp 调用
     */
    loadFromSave() {
      const gameStore = useGameStore();
      if (gameStore.englishSpirits && Array.isArray(gameStore.englishSpirits.collectedSpirits)) {
        this.collectedSpirits = [...gameStore.englishSpirits.collectedSpirits];
      } else {
        this.collectedSpirits = [];
      }
    },

    /**
     * 将当前状态持久化到 gameStore 并触发保存
     * @private
     */
    _persist() {
      const gameStore = useGameStore();
      gameStore.englishSpirits = {
        collectedSpirits: [...this.collectedSpirits]
      };
      gameStore.saveGame();
    },

    /**
     * 收集精灵
     * @param {string} spiritId - 精灵ID
     * @returns {boolean} 是否成功收集（重复收集返回 false）
     */
    collectSpirit(spiritId) {
      if (this.collectedSpirits.includes(spiritId)) {
        console.warn(`[englishSpiritStore] 精灵 ${spiritId} 已被收集，跳过`);
        return false;
      }
      this.collectedSpirits.push(spiritId);
      this._persist();
      return true;
    },

    /**
     * 检查是否已收集指定精灵
     * @param {string} spiritId - 精灵ID
     * @returns {boolean}
     */
    hasSpirit(spiritId) {
      return this.collectedSpirits.includes(spiritId);
    },

    /**
     * 获取已收集精灵数量
     * @returns {number}
     */
    getCollectedCount() {
      return this.collectedSpirits.length;
    },

    /**
     * 获取指定区域的精灵收集进度
     * @param {string} regionId - 区域ID
     * @returns {{ total: number, collected: number, progress: number }}
     */
    getRegionProgress(regionId) {
      const regionSpirits = getSpiritsByRegion(regionId);
      const total = regionSpirits.length;
      const collected = regionSpirits.filter(s => this.collectedSpirits.includes(s.id)).length;
      return {
        total,
        collected,
        progress: total > 0 ? collected / total : 0
      };
    },

    /**
     * 重置收集状态
     */
    resetCollection() {
      this.collectedSpirits = [];
      this._persist();
    }
  }
});

export default useEnglishSpiritStore;
