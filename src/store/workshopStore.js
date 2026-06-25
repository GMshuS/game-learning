/**
 * 数学工坊 Store
 */
import { defineStore } from 'pinia';
import { useGameStore } from './gameStore';
import { useSettingsStore } from './settingsStore';
import { useNotificationStore } from './notificationStore';
import workshopConfig from '../config/workshop';
import { getGameConfig } from '../utils/gameContext';

export const useWorkshopStore = defineStore('workshop', {
  state: () => ({
    materials: {}, // { materialId: quantity }
    craftedItems: [], // { recipeId, quantity, createdAt }
    listedItems: [] // { recipeId, price, listedAt, sold }
  }),

  getters: {
    materialList: (state) => {
      return workshopConfig.materialTypes.map(m => ({
        ...m,
        quantity: state.materials[m.id] || 0
      })).filter(m => m.quantity > 0);
    },

    availableRecipes: (_state, _getters) => {
      const settingsStore = useSettingsStore();
      const grade = settingsStore.gradeRange.max;
      return workshopConfig.recipes.filter(r =>
        r.gradeRange[0] <= grade && r.gradeRange[1] >= grade
      );
    },

    canCraft: (state) => (recipeId) => {
      const recipe = workshopConfig.recipes.find(r => r.id === recipeId);
      if (!recipe) return false;
      for (const [matId, qty] of Object.entries(recipe.materials)) {
        if ((state.materials[matId] || 0) < qty) return false;
      }
      return true;
    },

    pendingSales: (state) => {
      return state.listedItems.filter(item => !item.sold);
    }
  },

  actions: {
    /**
     * 从初始化加载数据
     */
    loadData(data) {
      if (data) {
        this.materials = data.materials || {};
        this.craftedItems = data.craftedItems || [];
        this.listedItems = data.listedItems || [];
      }
    },

    /**
     * 获取数据用于存档
     */
    getSaveData() {
      return {
        materials: this.materials,
        craftedItems: this.craftedItems,
        listedItems: this.listedItems
      };
    },

    /**
     * 答题获得材料
     */
    rewardMaterial() {
      const settingsStore = useSettingsStore();
      const gameConfig = getGameConfig(settingsStore.gradeRange.max, settingsStore.difficulty);
      const materialRareRatio = gameConfig.scale.materialRareRatio || 1.0;

      const reward = workshopConfig.questionReward;
      const adjustedEpicChance = reward.epic.chance * materialRareRatio;
      const adjustedRareChance = reward.rare.chance * materialRareRatio;
      let rand = Math.random();
      let rarity;
      if (rand < adjustedEpicChance) rarity = 'epic';
      else if (rand < adjustedEpicChance + adjustedRareChance) rarity = 'rare';
      else rarity = 'common';

      const candidates = workshopConfig.materialTypes.filter(m => m.rarity === rarity);
      const material = candidates[Math.floor(Math.random() * candidates.length)];
      const [min, max] = reward[rarity].amount;
      const amount = Math.floor(Math.random() * (max - min + 1)) + min;

      this.materials[material.id] = (this.materials[material.id] || 0) + amount;
      return { material, amount };
    },

    /**
     * 制作配方
     */
    craftRecipe(recipeId) {
      const recipe = workshopConfig.recipes.find(r => r.id === recipeId);
      if (!recipe || !this.canCraft(recipeId)) return false;

      // 消耗材料
      for (const [matId, qty] of Object.entries(recipe.materials)) {
        this.materials[matId] -= qty;
        if (this.materials[matId] <= 0) delete this.materials[matId];
      }

      // 添加到成品
      const existing = this.craftedItems.find(c => c.recipeId === recipeId);
      if (existing) {
        existing.quantity++;
      } else {
        this.craftedItems.push({ recipeId, quantity: 1, createdAt: Date.now() });
      }
      return true;
    },

    /**
     * 上架物品
     */
    listItem(recipeId, price) {
      const item = this.craftedItems.find(c => c.recipeId === recipeId);
      if (!item || item.quantity <= 0) return false;

      item.quantity--;
      if (item.quantity <= 0) {
        this.craftedItems = this.craftedItems.filter(c => c.recipeId !== recipeId);
      }

      this.listedItems.push({
        recipeId,
        price: Math.floor(price),
        listedAt: Date.now(),
        sold: false
      });
      return true;
    },

    /**
     * 撤回未售出物品
     */
    withdrawItem(listedIndex) {
      const item = this.listedItems[listedIndex];
      if (!item || item.sold) return false;

      const existing = this.craftedItems.find(c => c.recipeId === item.recipeId);
      if (existing) {
        existing.quantity++;
      } else {
        this.craftedItems.push({ recipeId: item.recipeId, quantity: 1, createdAt: Date.now() });
      }

      this.listedItems.splice(listedIndex, 1);
      return true;
    },

    /**
     * 结算销售（基于时间戳差值）
     */
    settleSales() {
      const config = workshopConfig.salesConfig;
      const now = Date.now();
      let settled = 0;
      const notificationStore = useNotificationStore();
      const gameStore = useGameStore();

      for (let i = 0; i < this.listedItems.length && settled < config.maxSettlement; i++) {
        const item = this.listedItems[i];
        if (item.sold) continue;

        const elapsed = (now - item.listedAt) / 1000; // 秒
        if (elapsed < config.customerInterval) continue;

        // 模拟顾客购买
        const recipe = workshopConfig.recipes.find(r => r.id === item.recipeId);
        if (!recipe) continue;

        // 价格波动影响购买概率
        const priceVariance = Math.random() * config.priceVariance * 2 - config.priceVariance;
        const adjustedPrice = item.price * (1 + priceVariance);
        const buyChance = Math.max(0.3, 1 - (adjustedPrice - recipe.basePrice) / recipe.basePrice);

        if (Math.random() < buyChance) {
          item.sold = true;
          const finalPrice = Math.floor(adjustedPrice);
          const settingsStore = useSettingsStore();
          const gameConfig = getGameConfig(settingsStore.gradeRange.max, settingsStore.difficulty);
          const coinRatio = gameConfig.scale.coinRatio || 1.0;
          const finalCoins = Math.floor(finalPrice * coinRatio);
          gameStore.addCoins(finalCoins);

          // 触发通知
          notificationStore.addNotification({
            type: 'workshop',
            title: '工坊售出',
            message: `${recipe.name} 以 ${finalPrice} 金币售出！`
          });

          settled++;
        }
      }

      // 清理已售出超过一段时间的记录
      this.listedItems = this.listedItems.filter(item => {
        return !item.sold || (now - item.listedAt) < 86400000 * 3; // 保留3天
      });
    }
  }
});

export default useWorkshopStore;
