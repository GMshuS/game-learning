/**
 * 英语错题记录 Store
 *
 * 记录每个知识点（题型）的答题统计，用于后续权重反馈引擎。
 * 遵循 save-on-write 模式：每次 recordResult() 后立即持久化到 localStorage。
 * 结构同 mathKnowledgeStore，但使用独立的 localStorage key。
 */
import { defineStore } from 'pinia';
import storageManager, { STORAGE_KEYS } from '../utils/storage';

export const useEnglishKnowledgeStore = defineStore('englishKnowledge', {
  state: () => ({
    /**
     * 知识点记录，以知识点 id 为 key
     * @type {Object<string, {totalAttempts: number, wrongCount: number, lastWrongTime: number|null, subtopics: Object}>}
     */
    records: {}
  }),

  getters: {},

  actions: {
    /**
     * 从 localStorage 加载知识记录
     * 解析失败时 records 回退为空对象
     */
    init() {
      try {
        const data = localStorage.getItem(STORAGE_KEYS.ENGLISH_KNOWLEDGE);
        if (data) {
          this.records = JSON.parse(data);
        }
      } catch (e) {
        console.warn('加载英语知识记录失败:', e.message);
        this.records = {};
      }
    },

    /**
     * 记录一次答题结果
     * @param {string} id - 知识点标识（与 knowledge.js 中节点 id 一致）
     * @param {boolean} correct - 是否答对
     */
    recordResult(id, correct) {
      // 确保记录存在
      if (!this.records[id]) {
        this.records[id] = {
          totalAttempts: 0,
          wrongCount: 0,
          lastWrongTime: null,
          subtopics: {}
        };
      }

      const record = this.records[id];
      record.totalAttempts += 1;

      if (!correct) {
        record.wrongCount += 1;
        record.lastWrongTime = Date.now();
      }

      // save-on-write：立即持久化
      try {
        storageManager._safeSetItem(
          STORAGE_KEYS.ENGLISH_KNOWLEDGE,
          JSON.stringify(this.records)
        );
      } catch (e) {
        console.warn('保存英语知识记录失败:', e.message);
      }
    },

    /**
     * 重置所有记录
     */
    reset() {
      this.records = {};
      try {
        localStorage.removeItem(STORAGE_KEYS.ENGLISH_KNOWLEDGE);
      } catch (e) {
        console.warn('清除英语知识记录失败:', e.message);
      }
    }
  }
});

export default useEnglishKnowledgeStore;
