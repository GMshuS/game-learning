/**
 * 背包独立 Store
 * 管理物品持有、收藏品追踪、战斗道具槽位（最多5个）
 * 遵循 save-on-write 模式
 */
import { defineStore } from 'pinia';
import { getEffectByProductId, isCollectible, getCollectibleSetInfo } from '../config/shopEffects';
import { useAchievementStore } from './achievementStore';
import { getProductById } from '../config/shop';
import storageManager from '../utils/storage';

// 批量保存计数器
let _batchSaveCount = 0;

/**
 * 从 StorageManager 读取背包数据
 */
function loadFromStorage() {
  try {
    const gameData = storageManager.loadGame();
    if (gameData && gameData.inventory) {
      const inv = gameData.inventory;
      // 兼容 Inventory 模型格式（collectibles 中 id → productId）
      const collectibles = (inv.collectibles || []).map(c => ({
        productId: c.productId || c.id,
        collectedAt: c.collectedAt || Date.now()
      }));
      return {
        items: inv.items || [],
        collectibles,
        battleSlots: inv.battleSlots || [null, null, null, null, null],
        maxBattleSlots: inv.maxBattleSlots || 5
      };
    }
  } catch (e) {
    console.error('加载背包数据失败:', e);
  }
  return null;
}

/**
 * 通过 StorageManager 保存背包数据
 */
function saveToStorage(state) {
  if (_batchSaveCount > 0) return; // 批量模式下跳过
  try {
    storageManager.saveInventory({
      items: state.items,
      collectibles: state.collectibles,
      battleSlots: state.battleSlots,
      maxBattleSlots: state.maxBattleSlots
    });
  } catch (e) {
    if (e.name === 'QuotaExceededError') {
      console.warn('localStorage 容量不足，背包数据保存失败');
    } else {
      throw e;
    }
  }
}

export const useInventoryStore = defineStore('inventory', {
  state: () => {
    const saved = loadFromStorage();
    return {
      // 持有物品列表
      items: saved?.items || [],
      // 收藏品列表 [{ productId, collectedAt }]
      collectibles: saved?.collectibles || [],
      // 战斗道具槽位，长度固定为5，值为 item.id（对应 items 中某个元素的 id）或 null
      battleSlots: saved?.battleSlots || [null, null, null, null, null],
      // 最大战斗槽位数
      maxBattleSlots: saved?.maxBattleSlots || 5
    };
  },

  getters: {
    /**
     * 获取已装备的战斗道具列表（按槽位顺序）
     */
    getEquippedBattleItems: (state) => {
      return state.battleSlots
        .filter(slotId => slotId !== null)
        .map(slotId => state.items.find(item => item.id === slotId))
        .filter(Boolean);
    },

    /**
     * 获取所有收藏品 ID 列表
     */
    collectibleIds: (state) => {
      return state.collectibles.map(c => c.productId);
    },

    /**
     * 检查收藏品是否已收集
     */
    hasCollectible: (state) => (productId) => {
      return state.collectibles.some(c => c.productId === productId);
    }
  },

  actions: {
    /**
     * 添加物品（自动合并同类物品的 quantity）
     * @param {object} product - 商品对象（含 id, name, icon, effect 等）
     * @param {number} quantity - 添加数量
     */
    addItem(product, quantity = 1) {
      if (!product || !product.id) return;

      const existingItem = this.items.find(item => item.productId === product.id);

      if (existingItem) {
        existingItem.quantity += quantity;
      } else {
        // 生成唯一实例 ID
        const itemId = `${product.id}_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;
        this.items.push({
          id: itemId,
          productId: product.id,
          name: product.name,
          icon: product.icon,
          quantity: quantity,
          effect: product.effect || getEffectByProductId(product.id)
        });
      }

      // 如果是收藏品，添加至 collectibles
      if (isCollectible(product.id) && !this.hasCollectible(product.id)) {
        this.collectibles.push({
          productId: product.id,
          collectedAt: Date.now()
        });
        // 收集后检查收藏品集是否集齐
        this.checkCollectibleSet();
      }

      this._save();
    },

    /**
     * 消耗物品（归零则删除条目）
     * @param {string} itemId - 物品实例 ID
     * @param {number} quantity - 消耗数量
     */
    removeItem(itemId, quantity = 1) {
      const index = this.items.findIndex(item => item.id === itemId);
      if (index === -1) return;

      const item = this.items[index];
      item.quantity -= quantity;

      if (item.quantity <= 0) {
        // 从战斗槽位中移除该物品
        this.battleSlots = this.battleSlots.map(slotId => slotId === itemId ? null : slotId);
        // 删除物品条目
        this.items.splice(index, 1);
      }

      this._save();
    },

    /**
     * 从战斗槽位卸下物品
     * @param {number} slotIndex - 槽位索引（0-4）
     */
    equipToBattleSlot(itemId, slotIndex) {
      if (slotIndex < 0 || slotIndex >= this.maxBattleSlots) return;

      const item = this.items.find(i => i.id === itemId);
      if (!item || item.quantity <= 0) return;

      // 如果该槽位已有物品，先卸下
      if (this.battleSlots[slotIndex] !== null) {
        this.unequipFromBattleSlot(slotIndex);
      }

      // 如果该物品已在其他槽位，先移除旧引用
      for (let i = 0; i < this.battleSlots.length; i++) {
        if (this.battleSlots[i] === itemId) {
          this.battleSlots[i] = null;
        }
      }

      this.battleSlots[slotIndex] = itemId;
      this._save();
    },

    /**
     * 卸下战斗槽位
     * @param {number} slotIndex - 槽位索引（0-4）
     */
    unequipFromBattleSlot(slotIndex) {
      if (slotIndex < 0 || slotIndex >= this.maxBattleSlots) return;
      this.battleSlots[slotIndex] = null;
      this._save();
    },

    /**
     * 战斗中消耗道具
     * @param {string} itemId - 物品实例 ID
     */
    consumeBattleItem(itemId) {
      const item = this.items.find(i => i.id === itemId);
      if (!item || item.quantity <= 0) return null;

      item.quantity -= 1;

      if (item.quantity <= 0) {
        // 归零后从槽位移除
        for (let i = 0; i < this.battleSlots.length; i++) {
          if (this.battleSlots[i] === itemId) {
            this.battleSlots[i] = null;
          }
        }
        // 删除条目
        const index = this.items.findIndex(i => i.id === itemId);
        if (index !== -1) {
          this.items.splice(index, 1);
        }
      }

      this._save();
      return item;
    },

    /**
     * 从旧存档（gameStore.inventory.items）导入数据
     * 用于首次加载 inventoryStore 时的兼容迁移
     * @param {Array} legacyItems - 旧存档中的物品数组
     */
    initFromLegacy(legacyItems) {
      if (!legacyItems || legacyItems.length === 0) return;

      // 避免重复迁移：如果已有数据则跳过
      if (this.items.length > 0) return;

      for (const legacyItem of legacyItems) {
        const product = getProductById(legacyItem.productId || legacyItem.id);
        if (!product) continue;

        const itemId = `${product.id}_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;
        this.items.push({
          id: itemId,
          productId: product.id,
          name: product.name,
          icon: product.icon,
          quantity: legacyItem.quantity || 1,
          effect: product.effect || getEffectByProductId(product.id)
        });

        // 处理收藏品
        if (isCollectible(product.id) && !this.hasCollectible(product.id)) {
          this.collectibles.push({
            productId: product.id,
            collectedAt: Date.now()
          });
        }
      }

      // 迁移后检查收藏品集
      this.checkCollectibleSet();
      this._save();
    },

    /**
     * 检查收藏品集是否集齐
     * 若集齐则调用 achievementStore 更新统计并触发成就检查
     */
    checkCollectibleSet() {
      const sets = getCollectibleSetInfo();
      const collectedIds = this.collectibles.map(c => c.productId);

      for (const set of Object.values(sets)) {
        const allCollected = set.requiredProductIds.every(id => collectedIds.includes(id));
        if (allCollected) {
          // 通过 achievementStore 更新收集计数并触发成就检查
          const achievementStore = useAchievementStore();
          achievementStore.updateStat('collectibles', set.requiredProductIds.length);
          achievementStore.checkAchievements('collectibles');
        }
      }
    },

    /**
     * 重置状态
     */
    reset() {
      this.items = [];
      this.collectibles = [];
      this.battleSlots = [null, null, null, null, null];
      this.maxBattleSlots = 5;
      this._save();
    },

    /**
     * 保存数据到 localStorage（save-on-write）
     */
    _save() {
      saveToStorage(this);
    },

    /**
     * 开始批量保存模式：暂停自动保存直到 endBatchSave 被调用
     */
    beginBatchSave() {
      _batchSaveCount++;
    },

    /**
     * 结束批量保存模式：恢复自动保存并执行一次完整保存
     */
    endBatchSave() {
      _batchSaveCount = Math.max(0, _batchSaveCount - 1);
      if (_batchSaveCount === 0) {
        saveToStorage(this);
      }
    }
  }
});

export default useInventoryStore;
