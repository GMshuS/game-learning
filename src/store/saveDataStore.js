/**
 * 存档管理 Store
 */
import { defineStore } from 'pinia';

export const useSaveDataStore = defineStore('saveData', {
  state: () => ({
    slots: [
      { index: 0, name: '存档 1', data: null, updatedAt: null },
      { index: 1, name: '存档 2', data: null, updatedAt: null },
      { index: 2, name: '存档 3', data: null, updatedAt: null }
    ],
    currentSlot: 0,
    autoSaveEnabled: true
  }),

  getters: {
    // 获取当前存档
    currentSave: (state) => {
      return state.slots[state.currentSlot]?.data;
    },

    // 获取是否有存档
    hasSave: (state) => (slotIndex) => {
      return state.slots[slotIndex]?.data !== null;
    },

    // 获取存档数量
    saveCount: (state) => {
      return state.slots.filter(s => s.data !== null).length;
    }
  },

  actions: {
    /**
     * 加载所有存档
     */
    loadAllSaves() {
      for (let i = 0; i < this.slots.length; i++) {
        const key = `save_slot_${i}`;
        try {
          const data = localStorage.getItem(key);
          if (data) {
            const parsed = JSON.parse(data);
            this.slots[i].data = parsed;
            this.slots[i].updatedAt = parsed.progress?.lastSavedAt || null;
          }
        } catch (e) {
          console.warn(`Failed to load save slot ${i}:`, e);
        }
      }
    },

    /**
     * 保存到指定槽位
     */
    saveToSlot(slotIndex, gameData) {
      const key = `save_slot_${slotIndex}`;
      
      try {
        const saveData = {
          ...gameData,
          savedAt: new Date().toISOString()
        };
        
        localStorage.setItem(key, JSON.stringify(saveData));
        
        this.slots[slotIndex].data = saveData;
        this.slots[slotIndex].updatedAt = saveData.savedAt;
        this.currentSlot = slotIndex;
        
        return true;
      } catch (e) {
        console.warn('Failed to save:', e);
        return false;
      }
    },

    /**
     * 从指定槽位加载
     */
    loadFromSlot(slotIndex) {
      const slot = this.slots[slotIndex];
      if (!slot || !slot.data) {
        return null;
      }
      
      this.currentSlot = slotIndex;
      return slot.data;
    },

    /**
     * 删除指定槽位的存档
     */
    deleteSlot(slotIndex) {
      const key = `save_slot_${slotIndex}`;
      
      try {
        localStorage.removeItem(key);
        this.slots[slotIndex].data = null;
        this.slots[slotIndex].updatedAt = null;
        
        if (this.currentSlot === slotIndex) {
          // 找到下一个有存档的槽位
          const nextSlot = this.slots.findIndex(s => s.data !== null);
          this.currentSlot = nextSlot >= 0 ? nextSlot : 0;
        }
        
        return true;
      } catch (e) {
        console.warn('Failed to delete save:', e);
        return false;
      }
    },

    /**
     * 导出数据
     */
    exportData() {
      const gameData = this.currentSave;
      if (!gameData) {
        return null;
      }
      
      const exportObj = {
        version: '1.0',
        exportedAt: new Date().toISOString(),
        data: gameData
      };
      
      return JSON.stringify(exportObj, null, 2);
    },

    /**
     * 导入数据
     */
    importData(jsonString, slotIndex = null) {
      try {
        const importObj = JSON.parse(jsonString);
        
        if (!importObj.version || !importObj.data) {
          throw new Error('Invalid save data format');
        }
        
        const targetSlot = slotIndex ?? this.currentSlot;
        return this.saveToSlot(targetSlot, importObj.data);
      } catch (e) {
        console.warn('Failed to import save:', e);
        return false;
      }
    },

    /**
     * 自动保存
     */
    autoSave(gameData) {
      if (this.autoSaveEnabled) {
        return this.saveToSlot(this.currentSlot, gameData);
      }
      return false;
    },

    /**
     * 切换自动保存
     */
    toggleAutoSave() {
      this.autoSaveEnabled = !this.autoSaveEnabled;
    },

    /**
     * 重置所有存档
     */
    resetAll() {
      for (let i = 0; i < this.slots.length; i++) {
        this.deleteSlot(i);
      }
    }
  }
});

export default useSaveDataStore;
