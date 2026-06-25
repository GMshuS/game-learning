/**
 * 英语冒险 Store
 * 管理英语冒险模式的区域进度，遵循 save-on-write 模式
 * 持久化数据存放在 gameStore.englishAdventureProgress 中
 */
import { defineStore } from 'pinia';
import { useGameStore } from './gameStore';
import { getAllEnglishRegions } from '../config/english/adventure';

export const useEnglishAdventureStore = defineStore('englishAdventure', {
  state: () => ({
    /** @type {string|null} 当前选中的区域ID */
    currentRegion: null,
    /**
     * 各区域进度
     * @type {{ [regionId]: { towersCompleted: string[], bossDefeated: boolean } }}
     */
    regionProgress: {}
  }),

  getters: {
    /**
     * 已解锁的区域ID列表
     * 第一个区域自动解锁，后续区域需要前置区域的BOSS被击败
     * @returns {string[]}
     */
    unlockedRegionIds: (state) => {
      const regions = getAllEnglishRegions();
      return regions
        .filter(r => !r.unlockedBy || (state.regionProgress[r.unlockedBy] && state.regionProgress[r.unlockedBy].bossDefeated))
        .map(r => r.id);
    },

    /**
     * 获取指定区域的进度（返回副本，避免直接修改）
     * @returns {Function}
     */
    getRegionProgress: (state) => {
      /**
       * @param {string} regionId
       * @returns {{ towersCompleted: string[], bossDefeated: boolean }}
       */
      return (regionId) => {
        const p = state.regionProgress[regionId];
        return p ? { ...p, towersCompleted: [...p.towersCompleted] } : { towersCompleted: [], bossDefeated: false };
      };
    }
  },

  actions: {
    /**
     * 从 gameStore 加载持久化的冒险进度数据
     * 在游戏初始化时由 GameApp 调用
     */
    loadFromSave() {
      const gameStore = useGameStore();
      if (gameStore.englishAdventureProgress) {
        this.currentRegion = gameStore.englishAdventureProgress.currentRegion || null;
        this.regionProgress = gameStore.englishAdventureProgress.regionProgress
          ? { ...gameStore.englishAdventureProgress.regionProgress }
          : {};
      } else {
        this.currentRegion = null;
        this.regionProgress = {};
      }
    },

    /**
     * 将当前状态持久化到 gameStore 并触发保存
     * @private
     */
    _persist() {
      const gameStore = useGameStore();
      gameStore.englishAdventureProgress = {
        currentRegion: this.currentRegion,
        regionProgress: { ...this.regionProgress }
      };
      gameStore.saveGame();
    },

    /**
     * 初始化区域的进度记录（如不存在）
     * @param {string} regionId
     * @private
     */
    _ensureRegion(regionId) {
      if (!this.regionProgress[regionId]) {
        this.regionProgress[regionId] = {
          towersCompleted: [],
          bossDefeated: false
        };
      }
    },

    /**
     * 解锁区域（由前置区域BOSS击败触发）
     * @param {string} regionId - 区域ID
     */
    unlockRegion(regionId) {
      this._ensureRegion(regionId);
      this._persist();
    },

    /**
     * 完成语法塔
     * 自动查找塔所属区域，更新该区域的 towersCompleted
     * @param {string} towerId - 语法塔ID
     */
    completeTower(towerId) {
      const regions = getAllEnglishRegions();
      for (const region of regions) {
        if (region.towers.includes(towerId)) {
          this._ensureRegion(region.id);
          if (!this.regionProgress[region.id].towersCompleted.includes(towerId)) {
            this.regionProgress[region.id].towersCompleted.push(towerId);
            this._persist();
          }
          return;
        }
      }
      console.warn(`[englishAdventureStore] 未找到塔 ${towerId} 所属的区域`);
    },

    /**
     * 击败区域BOSS
     * @param {string} regionId - 区域ID
     */
    defeatBoss(regionId) {
      this._ensureRegion(regionId);
      this.regionProgress[regionId].bossDefeated = true;
      this._persist();
    },

    /**
     * 获取已解锁的区域列表（返回配置对象）
     * @returns {object[]} 已解锁的区域配置数组
     */
    getUnlockedRegions() {
      const unlockedIds = this.unlockedRegionIds;
      return getAllEnglishRegions().filter(r => unlockedIds.includes(r.id));
    },

    /**
     * 设置当前区域
     * @param {string} regionId - 区域ID
     */
    setCurrentRegion(regionId) {
      this.currentRegion = regionId;
      this._persist();
    },

    /**
     * 重置冒险进度
     */
    resetAdventure() {
      this.currentRegion = null;
      this.regionProgress = {};
      this._persist();
    }
  }
});

export default useEnglishAdventureStore;
