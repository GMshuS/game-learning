/**
 * 设置 Store
 */
import { defineStore } from 'pinia';
import storageManager from '../utils/storage';
import Settings from '../models/Settings';

export const useSettingsStore = defineStore('settings', {
  state: () => ({
    sound: true,
    music: true,
    musicVolume: 0.5,
    soundVolume: 0.7,
    difficulty: 'normal',
    grade: 1,
    language: 'zh-CN',
    showTutorial: true,
    notifications: true,
    autoSave: true,
    showDamageNumbers: true,
    quickMode: false,
    englishLevel: 'auto'
  }),

  getters: {
    // 获取实际英语等级
    getEffectiveEnglishLevel(state) {
      // 如果 englishLevel === 'auto'，返回当前数学年级，否则返回独立设置的等级
      const level = state.englishLevel === 'auto' ? state.grade : Number(state.englishLevel);
      // 确保范围在 1-6
      return Math.max(1, Math.min(6, level));
    },

    // 获取难度标签
    difficultyLabel: (state) => {
      const labels = {
        easy: '简单',
        normal: '普通',
        hard: '困难'
      };
      return labels[state.difficulty] || '普通';
    },

    // 获取年级标签
    gradeLabel: (state) => {
      return `${state.grade}年级`;
    }
  },

  actions: {
    /**
     * 加载设置
     */
    loadSettings() {
      // 先执行数据迁移，修复可能损坏的音量数据
      storageManager.migrateSettings();
      
      const settings = storageManager.loadSettings();
      if (settings) {
        this.sound = settings.sound ?? true;
        this.music = settings.music ?? true;
        // 规范化音量值：确保在 0-1 范围内
        let musicVol = settings.musicVolume ?? 0.5;
        if (typeof musicVol !== 'number' || !isFinite(musicVol) || musicVol < 0) musicVol = 0.5;
        if (musicVol > 1) musicVol = musicVol / 100;
        if (musicVol > 1) musicVol = 0.5;
        this.musicVolume = Math.max(0, Math.min(1, musicVol));
        let soundVol = settings.soundVolume ?? 0.7;
        if (typeof soundVol !== 'number' || !isFinite(soundVol) || soundVol < 0) soundVol = 0.7;
        if (soundVol > 1) soundVol = soundVol / 100;
        if (soundVol > 1) soundVol = 0.7;
        this.soundVolume = Math.max(0, Math.min(1, soundVol));
        this.difficulty = settings.difficulty ?? 'normal';
        this.grade = settings.grade ?? 1;
        this.language = settings.language ?? 'zh-CN';
        this.showTutorial = settings.showTutorial ?? true;
        // Settings 模型现在包含 englishLevel 等字段，自动序列化
        this.englishLevel = settings.englishLevel ?? 'auto';
        this.notifications = settings.notifications ?? true;
        this.autoSave = settings.autoSave ?? true;
        this.showDamageNumbers = settings.showDamageNumbers ?? true;
        this.quickMode = settings.quickMode ?? false;
      }
    },

    /**
     * 保存设置
     */
    saveSettings() {
      const settings = new Settings({
        sound: this.sound,
        music: this.music,
        musicVolume: this.musicVolume,
        soundVolume: this.soundVolume,
        difficulty: this.difficulty,
        grade: this.grade,
        language: this.language,
        showTutorial: this.showTutorial,
        englishLevel: this.englishLevel,
        notifications: this.notifications,
        autoSave: this.autoSave,
        showDamageNumbers: this.showDamageNumbers,
        quickMode: this.quickMode
      });
      storageManager.saveSettings(settings);
    },

    /**
     * 更新设置
     */
    updateSetting(key, value) {
      // 使用 Object.prototype.hasOwnProperty.call 检查 state 中的键
      // 避免 Pinia Proxy 对象上 hasOwnProperty 不可靠的问题
      if (Object.prototype.hasOwnProperty.call(this.$state, key)) {
        this[key] = value;
        this.saveSettings();
      }
    },

    /**
     * 设置难度
     */
    setDifficulty(difficulty) {
      if (['easy', 'normal', 'hard'].includes(difficulty)) {
        this.difficulty = difficulty;
        this.saveSettings();
      }
    },

    /**
     * 设置年级
     */
    setGrade(grade) {
      if (grade >= 1 && grade <= 6) {
        this.grade = grade;
        this.saveSettings();
      }
    },

    /**
     * 切换音效
     */
    toggleSound() {
      this.sound = !this.sound;
      this.saveSettings();
    },

    /**
     * 切换音乐
     */
    toggleMusic() {
      this.music = !this.music;
      this.saveSettings();
    },

    /**
     * 切换教程
     */
    toggleTutorial() {
      this.showTutorial = !this.showTutorial;
      this.saveSettings();
    },

    /**
     * 重置设置
     */
    resetSettings() {
      this.sound = true;
      this.music = true;
      this.musicVolume = 0.5;
      this.soundVolume = 0.7;
      this.difficulty = 'normal';
      this.grade = 1;
      this.language = 'zh-CN';
      this.showTutorial = true;
      this.saveSettings();
    }
  }
});

export default useSettingsStore;
